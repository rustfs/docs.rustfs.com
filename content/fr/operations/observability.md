---
title: "Observabilité de RustFS"
description: "Exportez les métriques, les traces et les journaux RustFS via OTLP, intégrez-les à vos outils de supervision et configurez les alertes recommandées."
---

## Comment RustFS expose la télémétrie

RustFS **pousse** les métriques, les traces et les journaux via OTLP (OpenTelemetry Protocol). Il **n’expose pas** de point de terminaison Prometheus `/metrics` natif pour la collecte (scrape) : aucune route HTTP sur le port 9000 ou 9001 ne sert le format texte Prometheus. Pour acheminer les métriques RustFS vers Prometheus, vous devez exécuter un collecteur OpenTelemetry qui reçoit l’OTLP depuis RustFS et réexpose les données au format Prometheus :

```text
RustFS (RUSTFS_OBS_ENDPOINT) --OTLP--> OpenTelemetry Collector --> Prometheus --> Grafana
                                                              \--> Loki (logs)
                                                              \--> Tempo / Jaeger (traces)
```

Pointez RustFS vers le collecteur avec :

```bash
# OTLP over HTTP (the Collector's default HTTP receiver port is 4318; gRPC is 4317)
RUSTFS_OBS_ENDPOINT=http://otel-collector:4318
```

Variables d’environnement associées (toutes définies dans la configuration du serveur) :

| Variable | Rôle |
| --- | --- |
| `RUSTFS_OBS_ENDPOINT` | Point de terminaison OTLP de base pour les traces, les métriques et les journaux |
| `RUSTFS_OBS_TRACE_ENDPOINT` / `RUSTFS_OBS_METRIC_ENDPOINT` / `RUSTFS_OBS_LOG_ENDPOINT` | Remplacements du point de terminaison pour chaque signal |
| `RUSTFS_OBS_METRICS_EXPORT_ENABLED` / `RUSTFS_OBS_TRACES_EXPORT_ENABLED` / `RUSTFS_OBS_LOGS_EXPORT_ENABLED` | Active ou désactive chaque signal |
| `RUSTFS_OBS_METER_INTERVAL` | Intervalle d’export des métriques |
| `RUSTFS_OBS_SERVICE_NAME` / `RUSTFS_OBS_ENVIRONMENT` | Attributs de ressource attachés à la télémétrie exportée |
| `RUSTFS_OBS_LOGGER_LEVEL` | Verbosité des journaux (par exemple `info`) |

## Déploiement de référence (profil d’observabilité Docker Compose)

Le dépôt amont `rustfs/rustfs` fournit une pile de référence complète dans `docker-compose.yml`, derrière le profil `observability` : **otel-collector**, **Prometheus**, **Grafana**, **Loki** (journaux), **Tempo** et **Jaeger** (traces). La configuration de son collecteur reçoit l’OTLP sur 4317 (gRPC) et 4318 (HTTP), puis réexporte les métriques pour Prometheus sur le port `8889` :

```yaml
# OpenTelemetry Collector (excerpt from the upstream reference config)
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
service:
  pipelines:
    metrics:
      receivers: [otlp]
      exporters: [prometheus]
```

Prometheus collecte ensuite le collecteur, et non RustFS :

```yaml
# prometheus.yml (excerpt)
scrape_configs:
  - job_name: "rustfs-app-metrics"
    static_configs:
      - targets: ["otel-collector:8889"]   # RustFS application metrics
  - job_name: "otel-collector"
    static_configs:
      - targets: ["otel-collector:8888"]   # Collector self-metrics
```

:::note

Si Prometheus n’affiche aucune série `rustfs_*`, vérifiez la chaîne dans l’ordre : `RUSTFS_OBS_ENDPOINT` est-il défini sur chaque nœud, le collecteur est-il joignable depuis les nœuds, et Prometheus collecte-t-il le port d’export `8889` du collecteur ?

:::

## Référence des métriques

Chaque nom ci-dessous est vérifié dans le code source du serveur. La liste couvre le sous-ensemble utile à l’exploitation, exporté via OTLP ; les instruments internes et expérimentaux sont omis, et les nouvelles versions peuvent ajouter des métriques absentes de cette liste. Les jeux d’étiquettes sont ceux enregistrés au point d’émission. Le collecteur et Prometheus peuvent ajouter des étiquettes de ressource supplémentaires, telles que `service_name` et l’instance.

### État de préparation et processus

| Métrique | Type | Étiquettes | Signification |
| --- | --- | --- | --- |
| `rustfs_start_total` | compteur | — | Démarrages du processus ; un taux en hausse indique des boucles de redémarrage |
| `rustfs_runtime_readiness_ready` | jauge | — | `1` lorsque le nœud est entièrement prêt, `0` tant qu’il est dégradé |
| `rustfs_runtime_readiness_degraded_total` | compteur | `reason` | Évaluations d’état de préparation dégradé, selon la valeur de `degradedReasons` (par exemple `storage_quorum_unavailable`) |

### Scanner

| Métrique | Type | Étiquettes | Signification |
| --- | --- | --- | --- |
| `rustfs_scanner_objects_scanned_total` | compteur | — | Objets visités par le scanner d’arrière-plan |
| `rustfs_scanner_directories_scanned_total` | compteur | — | Répertoires visités |
| `rustfs_scanner_buckets_scanned_total` | compteur | `result`, `bucket`, `disk` | Analyses de compartiment (bucket) et de disque terminées, selon le résultat (`success` / `error` / `partial`) |
| `rustfs_scanner_cycles_total` | compteur | `result` | Cycles du scanner terminés (`success` / `error` / `partial` / `unknown`) |
| `rustfs_scanner_cycle_duration_seconds` | jauge | — | Durée du dernier cycle d’analyse terminé |
| `rustfs_scanner_bucket_drive_duration_seconds` | histogramme | `bucket`, `disk` | Temps nécessaire pour analyser un compartiment sur un disque |
| `rustfs_scanner_leader_lock_total` | compteur | `state` | Événements d’acquisition du verrou de leader du scanner |
| `rustfs_scanner_inline_heal_total` | compteur | — | Objets mis en file pour une réparation directement par le scanner |
| `rustfs_scanner_cache_save_duration_seconds` | histogramme | `cache` | Temps nécessaire pour persister le cache d’utilisation des données |
| `rustfs_scanner_set_scan_concurrency_limit` | jauge | — | Limite actuelle de concurrence d’analyse par ensemble |
| `rustfs_scanner_disk_scan_concurrency_limit` | jauge | `pool`, `set` | Limite actuelle de concurrence d’analyse par disque |

### Réparation des données

| Métrique | Type | Étiquettes | Signification |
| --- | --- | --- | --- |
| `rustfs_heal_task_running` | jauge | `type`, `set` | Tâches de réparation en cours, par ensemble d’effacement |
| `rustfs_heal_task_start_total` | compteur | `type`, `set` | Tâches de réparation démarrées |
| `rustfs_heal_queue_delay_seconds` | histogramme | `type`, `set` | Temps d’attente d’une tâche de réparation dans la file avant son démarrage |
| `rustfs_heal_admission_total` | compteur | `source`, `result`, `reason`, `context` | Décisions d’admission d’une réparation (acceptée ou rejetée, et pourquoi) |
| `rustfs_heal_mainline_throttle_total` | compteur | `source`, `result`, `reason` | Réparation d’arrière-plan limitée afin de protéger le trafic de premier plan |
| `rustfs_heal_scheduler_skip_total` | compteur | `reason`, `set` | Planification de réparation ignorée (par exemple, limite par ensemble atteinte) |
| `rustfs_heal_page_concurrency_current` | jauge | — | Concurrence actuelle de la réparation au niveau des pages |
| `rustfs_heal_candidate_enqueue_total` | compteur | — | Candidats à la réparation mis en file par le scanner |
| `rustfs_heal_candidate_merge_total` | compteur | — | Candidats fusionnés avec une entrée de file existante |
| `rustfs_heal_candidate_drop_total` | compteur | — | Candidats écartés |
| `rustfs_heal_candidate_priority_reject_total` | compteur | — | Candidats rejetés par la politique de priorité |
| `rustfs_heal_read_repair_dedup_total` | compteur | `reason` | Demandes de réparation sur le chemin de lecture dédupliquées |

### Chemin d’API et d’E/S

| Métrique | Type | Étiquettes | Signification |
| --- | --- | --- | --- |
| `rustfs_io_get_object_request_duration_seconds` | histogramme | `status` | Latence de bout en bout de GetObject |
| `rustfs_io_get_object_stage_duration_seconds` | histogramme | `path`, `stage` | Latence GetObject décomposée par étape interne |
| `rustfs_io_get_object_response_size_bytes` | histogramme | — | Tailles des réponses GetObject |
| `rustfs_io_operation_duration_seconds` | histogramme | `operation` | Durée des opérations d’E/S |
| `rustfs_io_timeout_events_total` | compteur | `operation` | Opérations d’E/S ayant atteint un délai d’expiration |
| `rustfs_operation_progress` | jauge | `operation` | Pourcentage d’avancement des opérations de longue durée |
| `rustfs_operation_stalled` | compteur | `operation` | Opérations détectées comme bloquées |
| `rustfs_operation_completions` | compteur | `operation`, `status` | Achèvements d’opérations, selon le statut |
| `rustfs_io_queue_operations` | compteur | `operation`, `priority` | Opérations d’entrée et de sortie de la file d’E/S |
| `rustfs_io_queue_size` | jauge | `priority` | Profondeur actuelle de la file d’E/S, par priorité |
| `rustfs_io_starvation_events` | compteur | `priority` | Événements de famine des E/S de faible priorité |
| `rustfs_io_bandwidth_bps` | jauge | — | Bande passante d’E/S observée (octets/s) |
| `rustfs_io_scheduler_decisions` | compteur | — | Décisions prises par l’ordonnanceur d’E/S |
| `rustfs_io_scheduler_load` | compteur | `level` | Décisions de l’ordonnanceur, selon le niveau de charge |
| `rustfs_io_load_changes` | compteur | `from`, `to` | Transitions de niveau de charge d’E/S |

### Contre-pression

| Métrique | Type | Étiquettes | Signification |
| --- | --- | --- | --- |
| `rustfs_backpressure_state_changes` | compteur | `from`, `to` | Transitions d’état de contre-pression |
| `rustfs_backpressure_activations` | compteur | — | Nombre de fois où la contre-pression s’est activée |
| `rustfs_backpressure_deactivations` | compteur | — | Nombre de fois où la contre-pression a été relâchée |
| `rustfs_backpressure_rejections` | compteur | — | Requêtes rejetées à cause de la contre-pression |
| `rustfs_backpressure_concurrent` | jauge | — | Requêtes concurrentes actuellement suivies par le limiteur |

### Capacité

| Métrique | Type | Étiquettes | Signification |
| --- | --- | --- | --- |
| `rustfs_capacity_current_bytes` | jauge | — | Capacité utilisée actuelle, en octets |
| `rustfs_capacity_update_total` | compteur | `source` | Recalculs de capacité |
| `rustfs_capacity_update_duration_seconds` | histogramme | `source` | Temps nécessaire pour recalculer la capacité |
| `rustfs_capacity_cache_hits` | compteur | — | Accès réussis au cache de capacité |
| `rustfs_capacity_cache_misses` | compteur | — | Accès manqués au cache de capacité |
| `rustfs_capacity_cache_served_total` | compteur | `state` | Réponses de capacité servies depuis le cache, selon l’état de fraîcheur |

### Verrouillage

| Métrique | Type | Étiquettes | Signification |
| --- | --- | --- | --- |
| `rustfs_lock_contentions` | compteur | — | Événements de contention de verrou |
| `rustfs_lock_hold_time_secs` | histogramme | — | Durée pendant laquelle les verrous ont été tenus |
| `rustfs_lock_spin_successes` / `rustfs_lock_spin_failures` | compteur | — | Résultats d’acquisition des verrous à attente active |
| `rustfs_lock_early_releases` | compteur | — | Verrous relâchés plus tôt par une optimisation |
| `rustfs_object_lock_diag_acquire_duration_seconds` | histogramme | — | Latence d’acquisition du verrouillage d’objet (mode diagnostic) |
| `rustfs_object_lock_diag_hold_duration_seconds` | histogramme | — | Durée de détention du verrouillage d’objet (mode diagnostic) |
| `rustfs_object_lock_diag_slow_acquire_total` / `rustfs_object_lock_diag_slow_hold_total` | compteur | — | Événements lents d’acquisition ou de détention de verrou (mode diagnostic) |

### Nettoyage des journaux

| Métrique | Type | Étiquettes | Signification |
| --- | --- | --- | --- |
| `rustfs_log_cleaner_runs_total` | compteur | — | Exécutions du nettoyeur de journaux |
| `rustfs_log_cleaner_deleted_files_total` | compteur | — | Fichiers journaux supprimés |
| `rustfs_log_cleaner_freed_bytes_total` | compteur | — | Octets récupérés |
| `rustfs_log_cleaner_rotation_total` / `rustfs_log_cleaner_rotation_failures_total` | compteur | — | Rotations de journaux et échecs de rotation |
| `rustfs_log_cleaner_rotation_duration_seconds` | histogramme | — | Durée de la rotation |
| `rustfs_log_cleaner_active_file_size_bytes` | jauge | — | Taille du fichier journal actif |

:::note[Métriques supplémentaires]

D’autres noms de métriques vérifiés existent, dont le type et les étiquettes ne sont pas documentés ici, notamment `rustfs_scanner_cache_save_attempt_total`, `rustfs_scanner_cache_save_timeout_total`, `rustfs_scanner_cache_save_retry_total`, `rustfs_scanner_excess_object_versions_total`, `rustfs_scanner_excess_object_version_size_total`, `rustfs_scanner_excess_folders_total`, `rustfs_scanner_pending_heal_prune_total`, `rustfs_scanner_pending_heal_malformed_total`, ainsi que les familles `rustfs_io_scheduler_*`, `rustfs_io_buffer_*` et `rustfs_timeout_dynamic_*`. Inspectez-les dans Prometheus une fois le pipeline en service.

:::

## Alertes suggérées

| Alerte | Signal | Règle suggérée |
| --- | --- | --- |
| Nœud non prêt depuis plus de 2 min | jauge `rustfs_runtime_readiness_ready`, ou une sonde externe sur `GET /health/ready` qui renvoie un code autre que 200 | `rustfs_runtime_readiness_ready == 0` pendant `2m` |
| Boucle de redémarrage | `rustfs_start_total` | `increase(rustfs_start_total[10m]) > 3` |
| File de réparation en croissance | `rustfs_heal_task_running` et `rustfs_heal_queue_delay_seconds` | tâches en cours durablement non nulles et délai de file en hausse pendant `30m` |
| Scanner bloqué | `rustfs_scanner_cycles_total` | `increase(rustfs_scanner_cycles_total[24h]) == 0` |
| Seuil de capacité utilisée du cluster | `rustfs_capacity_current_bytes` | comparez la valeur à la capacité brute déployée (une constante que vous définissez), par exemple `rustfs_capacity_current_bytes > 0.8 * <total-bytes>` |

:::note

L’utilisation par disque et l’état en ligne ou hors ligne des disques sont actuellement exposés par la Console et par l’API d’administration (informations serveur et stockage), et non comme métriques OTLP dédiées. Pour une alerte de seuil par disque, interrogez l’API d’administration depuis votre propre exporteur, ou surveillez le tableau de bord de la Console.

:::

## Collecte des journaux

La destination des journaux est contrôlée par `RUSTFS_OBS_LOG_DIRECTORY` :

- **Non définie** — les journaux vont sur stdout. Dans les conteneurs, utilisez votre pilote de journalisation ; sur les hôtes systemd, stdout/stderr est capturé par **journald**, de sorte que `journalctl -u rustfs -f` fonctionne sans configuration supplémentaire.
- **Un répertoire local** (par exemple `/var/log/rustfs/`) — RustFS y écrit des fichiers journaux en rotation. La rotation se règle avec `RUSTFS_OBS_LOG_FILENAME`, `RUSTFS_OBS_LOG_ROTATION_SIZE_MB`, `RUSTFS_OBS_LOG_ROTATION_TIME` et `RUSTFS_OBS_LOG_KEEP_FILES`.
- **Une URL** (contient `://`) — les journaux sont expédiés vers un point de terminaison distant.

Lorsque `RUSTFS_OBS_ENDPOINT` est défini et que l’export des journaux est activé, les journaux sont en outre exportés via OTLP ; la pile de référence les achemine vers Loki pour les interroger depuis Grafana.

```bash title="Example: file logs plus OTLP export"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ADDRESS=":9001"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"
RUSTFS_OBS_ENDPOINT=http://otel-collector:4318
```
