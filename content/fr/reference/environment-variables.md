---
title: "Variables d’environnement"
description: "Référence des variables d’environnement qui configurent le serveur RustFS, la Console, TLS, le KMS, l’observabilité, le scanner, la réparation des données, les classes de stockage, les identifiants et les cibles d’événements."
---

Cette page répertorie les variables d’environnement reconnues par le binaire serveur `rustfs`. Elle couvre le sous-ensemble pertinent pour l’exploitation, vérifié par rapport au code source de RustFS ; certains réglages internes sont omis volontairement. Chaque variable peut aussi être fournie par l’indicateur de ligne de commande correspondant, lorsqu’il existe (voir la [référence CLI](./cli)).

:::note[Valeurs booléennes]

Les variables booléennes acceptent `true`/`false`. Les valeurs indiquées comme « non définie » n’ont pas de valeur par défaut, et la fonctionnalité correspondante reste désactivée ou revient au comportement intégré.

:::

## Serveur principal

| Variable | Valeur par défaut | Description |
| --- | --- | --- |
| `RUSTFS_VOLUMES` | non définie (obligatoire) | Volumes ou points de terminaison de stockage, séparés par des espaces. Prend en charge l’expansion d’ellipses `{N...M}`, par exemple `/data/rustfs{0...3}` ou `http://node{1...4}:9000/data/rustfs{0...3}`. L’image Docker utilise `/data` par défaut. |
| `RUSTFS_ADDRESS` | `:9000` | Adresse et port d’écoute de l’API S3 (porte aussi le RPC interne entre nœuds). |
| `RUSTFS_SERVER_DOMAINS` | non définie | Noms de domaine séparés par des virgules pour les requêtes S3 en adressage de type hôte virtuel, par exemple `s3.example.com`, afin que `bucket.s3.example.com` corresponde au compartiment (bucket) `bucket`. Lorsqu’elle n’est pas définie, seul l’adressage de type chemin (path-style) fonctionne. |
| `RUSTFS_REGION` | non définie | Région signalée aux clients S3. Lorsqu’elle n’est pas définie, le serveur revient à `us-east-1`. |
| `RUSTFS_LICENSE` | non définie | Chaîne de licence. |
| `RUSTFS_BUFFER_PROFILE` | `GeneralPurpose` | Profil de charge pour le dimensionnement adaptatif des tampons. Options : `GeneralPurpose`, `AiTraining`, `DataAnalytics`, `WebWorkload`, `IndustrialIoT`, `SecureStorage`. |
| `RUSTFS_BUFFER_PROFILE_DISABLE` | `false` | Désactive le dimensionnement adaptatif des tampons et utilise les tampons de taille fixe historiques. |
| `RUSTFS_HEALTH_ENDPOINT_ENABLE` | `true` | Enregistre les points de terminaison de sonde non authentifiés `/health` et `/health/ready`. |
| `RUSTFS_HEALTH_READINESS_CACHE_TTL_MS` | `1000` | Durée de vie du cache des résultats de la sonde d’état de préparation, en millisecondes. |
| `RUSTFS_HEALTH_CLUSTER_TIMEOUT_MS` | `2000` | Délai d’expiration des sondes d’intégrité du cluster (`/minio/health/cluster`), en millisecondes. |
| `RUSTFS_STARTUP_READINESS_MAX_WAIT_SECS` | `120` | Durée maximale pendant laquelle la sonde d’état de préparation indique « starting » avant que le démarrage soit considéré comme échoué. |
| `RUSTFS_CHECK_UPDATE` | `true` | Vérifie l’existence d’une version plus récente de RustFS au démarrage en envoyant une requête HTTPS vers `version.rustfs.com` ; l’agent utilisateur porte la version actuelle. Le résultat est seulement journalisé, et RustFS ne se met jamais à jour lui-même. Définissez `false` pour ignorer la requête sortante, par exemple dans les déploiements isolés (air-gapped) ; les valeurs non reconnues reviennent à `true`. |

## Console

| Variable | Valeur par défaut | Description |
| --- | --- | --- |
| `RUSTFS_CONSOLE_ENABLE` | `true` | Active la console web intégrée (servie sur un écouteur distinct). |
| `RUSTFS_CONSOLE_ADDRESS` | `:9001` | Adresse et port d’écoute de la Console. |

## CORS

| Variable | Valeur par défaut | Description |
| --- | --- | --- |
| `RUSTFS_CORS_ALLOWED_ORIGINS` | vide | Origines séparées par des virgules, autorisées à accéder à l’API S3 depuis un navigateur. Définissez `*` pour des origines génériques sans identifiants. |
| `RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS` | `*` | Origines séparées par des virgules, autorisées à accéder à la Console depuis un navigateur, ou `*` pour toutes les origines. |

Consultez la [configuration CORS](/fr/administration/cors) pour les étapes de configuration et de vérification.

## TLS et KMS

| Variable | Valeur par défaut | Description |
| --- | --- | --- |
| `RUSTFS_TLS_PATH` | non définie | Répertoire contenant le certificat et la clé TLS (`rustfs_cert.pem` / `rustfs_key.pem`) pour l’API S3 et la Console. TLS est activé lorsque la variable est définie. |
| `RUSTFS_TLS_RELOAD_ENABLE` | `false` | Surveille le répertoire TLS et recharge les certificats à chaud. |
| `RUSTFS_TLS_KEYLOG` | `false` | Écrit les clés de session TLS dans un fichier keylog pour le débogage. Ne l’activez pas en production. |
| `RUSTFS_TRUST_SYSTEM_CA` | `false` | Fait aussi confiance au magasin d’autorités de certification du système d’exploitation pour les connexions TLS sortantes. |
| `RUSTFS_TRUST_LEAF_CERT_AS_CA` | `false` | Fait confiance à un certificat feuille comme s’il s’agissait d’une autorité de certification (configurations auto-signées). |
| `RUSTFS_SERVER_MTLS_ENABLE` | `false` | Exige des certificats client (TLS mutuel) sur les écouteurs du serveur. |
| `RUSTFS_MTLS_CLIENT_CERT` | non définie | Certificat client présenté pour les connexions mTLS entre nœuds. |
| `RUSTFS_MTLS_CLIENT_KEY` | non définie | Clé privée client pour les connexions mTLS entre nœuds. |
| `RUSTFS_KMS_ENABLE` | `false` | Active le chiffrement côté serveur reposant sur le KMS. |
| `RUSTFS_KMS_BACKEND` | `local` | Backend KMS : `local`, `vault` / `vault-kv2` (stockage Vault KV2 avec enveloppement local des clés de données), ou `vault-transit`. |
| `RUSTFS_KMS_KEY_DIR` | non définie | Répertoire de clés du backend `local`. |
| `RUSTFS_KMS_LOCAL_MASTER_KEY` | non définie | Clé principale qui protège les fichiers de clés du KMS local. |
| `RUSTFS_KMS_VAULT_ADDRESS` | non définie | Adresse du serveur Vault pour les backends Vault. |
| `RUSTFS_KMS_VAULT_TOKEN` | non définie | Jeton Vault pour les backends Vault. |
| `RUSTFS_KMS_VAULT_MOUNT_PATH` | `transit` | Point de montage Transit pour `vault-transit` ; obsolète et inutilisé pour `vault` / `vault-kv2`. |
| `RUSTFS_KMS_VAULT_KV_MOUNT` | `secret` | Point de montage KV v2 pour le backend `vault` / `vault-kv2`. |
| `RUSTFS_KMS_VAULT_KEY_PREFIX` | `rustfs/kms/keys` | Préfixe des enregistrements de clés dans le point de montage KV v2 pour `vault` / `vault-kv2`. |
| `RUSTFS_KMS_DEFAULT_KEY_ID` | non définie | ID de clé KMS par défaut utilisé pour le chiffrement. |
| `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS` | `false` | Autorise les valeurs par défaut KMS non sécurisées, réservées au développement. Ne l’activez jamais en production. |

## Observabilité

Le pipeline d’observabilité exporte les traces, les métriques et les journaux via OTLP/HTTP.

| Variable | Valeur par défaut | Description |
| --- | --- | --- |
| `RUSTFS_OBS_ENDPOINT` | vide | URL de base OTLP/HTTP racine pour les traces, les métriques et les journaux, par exemple `http://otel-collector:4318`. Lorsqu’elle est vide, les journaux vont vers stdout ou des fichiers locaux. |
| `RUSTFS_OBS_TRACE_ENDPOINT` | non définie | Remplacement par signal pour le point de terminaison des traces. |
| `RUSTFS_OBS_METRIC_ENDPOINT` | non définie | Remplacement par signal pour le point de terminaison des métriques. |
| `RUSTFS_OBS_LOG_ENDPOINT` | non définie | Remplacement par signal pour le point de terminaison des journaux. |
| `RUSTFS_OBS_TRACES_EXPORT_ENABLED` | `true` | Exporte les traces vers le point de terminaison OTLP. |
| `RUSTFS_OBS_METRICS_EXPORT_ENABLED` | `true` | Exporte les métriques vers le point de terminaison OTLP. |
| `RUSTFS_OBS_LOGS_EXPORT_ENABLED` | `true` | Exporte les journaux vers le point de terminaison OTLP. |
| `RUSTFS_OBS_USE_STDOUT` | non définie | Force la sortie de télémétrie vers stdout. |
| `RUSTFS_OBS_SAMPLE_RATIO` | non définie | Taux d’échantillonnage des traces (0.0–1.0). |
| `RUSTFS_OBS_METER_INTERVAL` | non définie | Intervalle d’export des métriques, en secondes. |
| `RUSTFS_OBS_SERVICE_NAME` | non définie | Nom du service indiqué dans les attributs de ressource de télémétrie. |
| `RUSTFS_OBS_ENVIRONMENT` | non définie | Libellé d’environnement de déploiement (`production`, `development`, `test`, `staging`). |
| `RUSTFS_OBS_LOGGER_LEVEL` | non définie | Filtre de niveau de journal (par exemple `info`, `debug`). |
| `RUSTFS_OBS_LOG_STDOUT_ENABLED` | non définie | Recopie aussi les journaux vers stdout lorsque la journalisation fichier ou OTLP est active. |
| `RUSTFS_OBS_LOG_DIRECTORY` | non définie | Répertoire de journaux local. Lorsqu’elle n’est pas définie, les journaux vont vers stdout ; une valeur d’URL envoie les journaux vers un point de terminaison distant. |
| `RUSTFS_OBS_LOG_FILENAME` | `rustfs.log` | Nom du fichier journal dans le répertoire de journaux. |
| `RUSTFS_OBS_LOG_ROTATION_TIME` | `hourly` | Rotation des journaux selon le temps : `daily`, `hourly`, `minutely`. |
| `RUSTFS_OBS_LOG_KEEP_FILES` | `30` | Nombre de fichiers journaux rotés à conserver. |
| `RUSTFS_OBS_LOG_MAX_TOTAL_SIZE_BYTES` | `2147483648` | Budget de taille totale (2 GiB) du répertoire de journaux avant nettoyage. |
| `RUSTFS_OBS_LOG_COMPRESS_OLD_FILES` | `true` | Compresse les fichiers journaux rotés (`zstd` par défaut, réglable via `RUSTFS_OBS_LOG_COMPRESSION_ALGORITHM`). |

Les intervalles de collecte des métriques suivent le modèle `RUSTFS_METRICS_<SCOPE>_INTERVAL_SEC`, avec les portées `DEFAULT`, `SYSTEM`, `CLUSTER`, `BUCKET`, `NODE`, `RESOURCE`, `AUDIT`, `NOTIFICATION` et `BUCKET_REPLICATION_BANDWIDTH` — par exemple `RUSTFS_METRICS_CLUSTER_INTERVAL_SEC=60`.

## Scanner et réparation des données

| Variable | Valeur par défaut | Description |
| --- | --- | --- |
| `RUSTFS_SCANNER_SPEED` | `default` | Préréglage de vitesse du scanner : `fastest`, `fast`, `default`, `slow`, `slowest`. Contrôle le facteur de pause, la pause maximale et l’intervalle de cycle. |
| `RUSTFS_SCANNER_DELAY` | préréglage | Remplace le multiplicateur de pause du scanner (par exemple `30.0`). |
| `RUSTFS_SCANNER_MAX_WAIT_SECS` | préréglage | Remplace la pause maximale du scanner, en secondes. |
| `RUSTFS_SCANNER_CYCLE` | préréglage | Remplace l’intervalle du cycle d’analyse, en secondes (par exemple `3600`). |
| `RUSTFS_SCANNER_START_DELAY_SECS` | non définie | Délai de démarrage, en secondes, avant le premier cycle d’analyse. |
| `RUSTFS_SCANNER_CYCLE_MAX_DURATION_SECS` | `1800` | Plafonne la durée d’un cycle, en secondes ; `0` désactive le budget. |
| `RUSTFS_SCANNER_CYCLE_MAX_OBJECTS` | `0` | Plafonne le nombre d’objets traités par cycle ; `0` désactive le budget. |
| `RUSTFS_SCANNER_CYCLE_MAX_DIRECTORIES` | `0` | Plafonne le nombre de répertoires parcourus par cycle ; `0` désactive le budget. |
| `RUSTFS_SCANNER_BITROT_CYCLE_SECS` | `2592000` | Cycle d’analyse approfondie (bitrot) périodique, en secondes (30 jours). `0`/`true`/`on` rend chaque cycle approfondi ; `false`/`off` désactive les analyses approfondies. |
| `RUSTFS_SCANNER_IDLE_MODE` | `true` | Lorsque la valeur est `true`, le scanner se limite lui-même ; `false` le fait tourner à pleine vitesse. |
| `RUSTFS_SCANNER_CACHE_SAVE_TIMEOUT_SECS` | `14` | Délai d’expiration de l’enregistrement du cache du scanner, en secondes (minimum `1`). |
| `RUSTFS_SCANNER_MAX_CONCURRENT_SET_SCANS` | `4` | Plafonne les tâches d’analyse simultanées d’ensembles de codage d’effacement ; `0` conserve la concurrence fondée sur la topologie. |
| `RUSTFS_SCANNER_MAX_CONCURRENT_DISK_SCANS` | `4` | Plafonne les parcours simultanés de compartiments sur disque par ensemble ; `0` conserve la concurrence fondée sur le nombre de disques. |
| `RUSTFS_SCANNER_YIELD_EVERY_N_OBJECTS` | `128` | Fréquence à laquelle les boucles d’objets du scanner rendent la main à l’environnement d’exécution asynchrone ; `0` désactive cette cession supplémentaire. |
| `RUSTFS_SCANNER_ALERT_EXCESS_VERSIONS` | `100` | Nombre de versions d’objet qui déclenche les alertes du scanner. |
| `RUSTFS_SCANNER_ALERT_EXCESS_VERSION_SIZE` | `1099511627776` | Nombre cumulé d’octets de versions (1 TiB) qui déclenche les alertes du scanner. |
| `RUSTFS_SCANNER_ALERT_EXCESS_FOLDERS` | `65538` | Nombre de sous-dossiers directs qui déclenche les alertes du scanner. |
| `RUSTFS_HEAL_AUTO_HEAL_ENABLE` | `true` | Active la réparation automatique en arrière-plan des objets dégradés. |
| `RUSTFS_HEAL_QUEUE_SIZE` | `10000` | Capacité de la file des candidats à la réparation. |
| `RUSTFS_HEAL_INTERVAL_SECS` | `10` | Intervalle entre les exécutions du planificateur de réparation, en secondes. |
| `RUSTFS_HEAL_TASK_TIMEOUT_SECS` | `300` | Délai d’expiration d’une tâche de réparation, en secondes. |
| `RUSTFS_HEAL_MAX_CONCURRENT_HEALS` | `4` | Nombre maximal de tâches de réparation simultanées. |
| `RUSTFS_HEAL_MAX_CONCURRENT_PER_SET` | `1` | Nombre maximal de tâches de réparation simultanées par ensemble de codage d’effacement. |

## Stockage et codage d’effacement

| Variable | Valeur par défaut | Description |
| --- | --- | --- |
| `RUSTFS_STORAGE_CLASS_STANDARD` | automatique | Parité de la classe de stockage STANDARD au format `EC:n`, par exemple `EC:4`. Lorsqu’elle n’est pas définie, la parité est déduite de la taille de l’ensemble de codage d’effacement. |
| `RUSTFS_STORAGE_CLASS_RRS` | `EC:1` | Parité de la classe de stockage REDUCED_REDUNDANCY au format `EC:n`. |
| `RUSTFS_STORAGE_CLASS_OPTIMIZE` | `availability` | Objectif d’optimisation pour le choix de la parité. |
| `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` | `131072` | Seuil (128 KiB) en dessous duquel les données d’objet sont intégrées dans les métadonnées. |
| `RUSTFS_ERASURE_SET_DRIVE_COUNT` | `0` | Force le nombre de disques par ensemble de codage d’effacement ; `0` sélectionne la disposition automatiquement. |
| `RUSTFS_DURABILITY_MODE` | non définie | Mode de durabilité des écritures : `strict`, `relaxed` ou `none`. Lorsqu’une valeur valide est définie, elle a priorité sur le commutateur historique de synchronisation des disques. |

## Identifiants et paramètres internes

| Variable | Valeur par défaut | Description |
| --- | --- | --- |
| `RUSTFS_ACCESS_KEY` | `rustfsadmin` | Clé d’accès racine. Mutuellement exclusive avec `RUSTFS_ACCESS_KEY_FILE`. |
| `RUSTFS_SECRET_KEY` | `rustfsadmin` | Clé secrète racine. Mutuellement exclusive avec `RUSTFS_SECRET_KEY_FILE`. |
| `RUSTFS_ACCESS_KEY_FILE` | non définie | Chemin d’un fichier contenant la clé d’accès (par exemple un montage de secret Docker ou Kubernetes). |
| `RUSTFS_SECRET_KEY_FILE` | non définie | Chemin d’un fichier contenant la clé secrète. |
| `RUSTFS_RPC_SECRET` | dérivé | Secret utilisé pour authentifier le RPC entre nœuds. Lorsqu’il n’est pas défini, il est dérivé de la paire de clés d’accès et secrète active ; avec une paire d’identifiants entièrement par défaut, les clusters multi-nœuds doivent le définir explicitement. |

:::warning

Les identifiants par défaut intégrés `rustfsadmin`/`rustfsadmin` servent uniquement à faciliter le premier démarrage. Définissez toujours des identifiants autres que ceux par défaut pour les déploiements de production.

:::

## Cibles d’événements et d’audit

Commutateurs de module :

| Variable | Valeur par défaut | Description |
| --- | --- | --- |
| `RUSTFS_NOTIFY_ENABLE` | `false` | Active le module de notification d’événements de compartiment. |
| `RUSTFS_AUDIT_ENABLE` | `false` | Active le module de journalisation d’audit. |

La configuration des cibles suit un modèle : `RUSTFS_NOTIFY_<TARGET>_<KEY>` pour les notifications d’événements et `RUSTFS_AUDIT_<TARGET>_<KEY>` pour les journaux d’audit. Cibles prises en charge dans les deux familles : `WEBHOOK`, `KAFKA`, `MQTT`, `MYSQL`, `POSTGRES`, `NATS`, `REDIS`, `AMQP`, `PULSAR`.

Sous-clés de la cible webhook (les mêmes clés existent sous `RUSTFS_AUDIT_WEBHOOK_*`) :

| Variable | Valeur par défaut | Description |
| --- | --- | --- |
| `RUSTFS_NOTIFY_WEBHOOK_ENABLE` | `false` | Active la cible webhook. |
| `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT` | non définie | URL du point de terminaison HTTP(S) du webhook. |
| `RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN` | non définie | Jeton Bearer envoyé avec chaque livraison. |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR` | non définie | Répertoire de la file de livraison persistante. |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_LIMIT` | non définie | Nombre maximal d’événements en file d’attente. |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CERT` | non définie | Certificat client pour le mTLS vers le point de terminaison. |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_KEY` | non définie | Clé privée client pour le mTLS vers le point de terminaison. |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA` | non définie | Certificat d’autorité de certification utilisé pour vérifier le point de terminaison. |
| `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY` | non définie | Ignore la vérification TLS du point de terminaison (déconseillé). |

Les autres cibles suivent la même forme avec des clés propres à chaque cible, par exemple `RUSTFS_NOTIFY_KAFKA_BROKERS`, `RUSTFS_NOTIFY_KAFKA_TOPIC`, `RUSTFS_NOTIFY_MQTT_BROKER`, `RUSTFS_NOTIFY_MQTT_TOPIC`, `RUSTFS_NOTIFY_MYSQL_DSN_STRING`, `RUSTFS_NOTIFY_NATS_ADDRESS`, `RUSTFS_NOTIFY_REDIS_URL`, `RUSTFS_NOTIFY_AMQP_URL`, `RUSTFS_NOTIFY_PULSAR_BROKER`.

## Compatibilité historique

### Correspondance des variables MINIO_*

Pour faciliter la migration, RustFS associe au démarrage une liste d’autorisation fixe de variables `MINIO_*` à leurs équivalents `RUSTFS_*` :

- Si seule la variable préfixée par `MINIO_` est définie, sa valeur est utilisée et un avertissement d’obsolescence est journalisé.
- Si `MINIO_*` et `RUSTFS_*` sont toutes deux définies avec des valeurs différentes, la valeur `RUSTFS_*` l’emporte et un conflit est enregistré.

Les suffixes associés comprennent `ACCESS_KEY`, `SECRET_KEY`, `ACCESS_KEY_FILE`, `SECRET_KEY_FILE`, `ROOT_USER`, `ROOT_PASSWORD`, `ADDRESS`, `CONSOLE_ADDRESS`, `VOLUMES`, `REGION`, `LICENSE`, `ERASURE_SET_DRIVE_COUNT`, `STORAGE_CLASS_STANDARD`, `STORAGE_CLASS_RRS`, `STORAGE_CLASS_OPTIMIZE`, `STORAGE_CLASS_INLINE_BLOCK`, `SCANNER_SPEED`, `SCANNER_CYCLE`, `COMPRESS_ENABLE`, `COMPRESS_EXTENSIONS`, `COMPRESS_MIME_TYPES`, `DRIVE_ACTIVE_MONITORING`, `ILM_EXPIRATION_WORKERS`, `API_XFF_HEADER`, `POLICY_PLUGIN_URL`, `POLICY_PLUGIN_AUTH_TOKEN`, les clés `IDENTITY_OPENID_*`, ainsi que chaque variable qui commence par `NOTIFY_WEBHOOK_`, `NOTIFY_MQTT_`, `AUDIT_WEBHOOK_` ou `AUDIT_MQTT_`. Par exemple, `MINIO_ROOT_USER` correspond à `RUSTFS_ROOT_USER` et `MINIO_NOTIFY_WEBHOOK_ENDPOINT` correspond à `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT`.

### Alias obsolètes

| Variable obsolète | À utiliser à la place |
| --- | --- |
| `RUSTFS_ROOT_USER` | `RUSTFS_ACCESS_KEY` |
| `RUSTFS_ROOT_PASSWORD` | `RUSTFS_SECRET_KEY` |
| `RUSTFS_DATA_SCANNER_START_DELAY_SECS` | `RUSTFS_SCANNER_START_DELAY_SECS` |

Les alias obsolètes fonctionnent encore, mais journalisent un avertissement ; le nom canonique `RUSTFS_*` a toujours priorité lorsque les deux sont définis.
