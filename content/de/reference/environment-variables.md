---
title: "Umgebungsvariablen"
description: "Referenz der Umgebungsvariablen, die Server, Console, TLS, KMS, Observability, Scanner, Datenwiederherstellung, Speicherklassen, Anmeldedaten und Ereignisziele von RustFS konfigurieren."
---

Diese Seite listet die Umgebungsvariablen, die das Server-Binary `rustfs` erkennt. Sie umfasst die betrieblich relevante Teilmenge, die gegen den Quellcode von RustFS geprüft wurde; einige interne Stellschrauben sind absichtlich ausgelassen. Jede Variable lässt sich auch über das passende Befehlszeilen-Flag setzen, sofern eines existiert (siehe die [CLI-Referenz](./cli)).

:::note[Boolesche Werte]

Boolesche Variablen akzeptieren `true` und `false`. Als „nicht gesetzt“ angegebene Werte haben keinen Standard; die zugehörige Funktion bleibt deaktiviert oder fällt auf das eingebaute Verhalten zurück.

:::

## Serverkern

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `RUSTFS_VOLUMES` | nicht gesetzt (erforderlich) | Speicher-Volumes oder Endpunkte, durch Leerzeichen getrennt. Unterstützt die Ellipsen-Erweiterung `{N...M}`, zum Beispiel `/data/rustfs{0...3}` oder `http://node{1...4}:9000/data/rustfs{0...3}`. Das Docker-Image verwendet standardmäßig `/data`. |
| `RUSTFS_ADDRESS` | `:9000` | Bind-Adresse und Port des Listeners der S3-API (trägt auch den internen Knoten-RPC). |
| `RUSTFS_SERVER_DOMAINS` | nicht gesetzt | Durch Kommas getrennte Domainnamen für S3-Anfragen mit Adressierung im Virtual-Hosted-Stil, zum Beispiel `s3.example.com`, sodass `bucket.s3.example.com` auf den Bucket `bucket` zeigt. Wenn die Variable nicht gesetzt ist, funktioniert nur die pfadbasierte Adressierung (Path-Style). |
| `RUSTFS_REGION` | nicht gesetzt | Region, die S3-Clients gemeldet wird. Wenn die Variable nicht gesetzt ist, fällt der Server auf `us-east-1` zurück. |
| `RUSTFS_LICENSE` | nicht gesetzt | Lizenzzeichenkette. |
| `RUSTFS_BUFFER_PROFILE` | `GeneralPurpose` | Lastprofil für die adaptive Puffergröße. Optionen: `GeneralPurpose`, `AiTraining`, `DataAnalytics`, `WebWorkload`, `IndustrialIoT`, `SecureStorage`. |
| `RUSTFS_BUFFER_PROFILE_DISABLE` | `false` | Deaktiviert die adaptive Puffergröße und verwendet feste Puffergrößen der älteren Implementierung. |
| `RUSTFS_HEALTH_ENDPOINT_ENABLE` | `true` | Registriert die nicht authentifizierten Integritätsendpunkte `/health` und `/health/ready`. |
| `RUSTFS_HEALTH_READINESS_CACHE_TTL_MS` | `1000` | Cache-TTL für Ergebnisse der Bereitschaftsprüfung, in Millisekunden. |
| `RUSTFS_HEALTH_CLUSTER_TIMEOUT_MS` | `2000` | Zeitüberschreitung für Cluster-Integritätsprüfungen (`/minio/health/cluster`), in Millisekunden. |
| `RUSTFS_STARTUP_READINESS_MAX_WAIT_SECS` | `120` | Maximale Zeit, in der die Bereitschaftsprüfung „starting“ meldet, bevor der Start als fehlgeschlagen gilt. |
| `RUSTFS_CHECK_UPDATE` | `true` | Prüft beim Start auf eine neuere RustFS-Version, indem eine HTTPS-Anfrage an `version.rustfs.com` gesendet wird; der User-Agent enthält die aktuelle Version. Das Ergebnis wird nur protokolliert, und RustFS aktualisiert sich nie selbst. Setzen Sie `false`, um die ausgehende Anfrage zu überspringen, zum Beispiel in Bereitstellungen ohne ausgehenden Netzzugriff. Nicht erkannte Werte fallen auf `true` zurück. |

## Console

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `RUSTFS_CONSOLE_ENABLE` | `true` | Aktiviert die eingebettete Console (Weboberfläche) auf einem eigenen Listener. |
| `RUSTFS_CONSOLE_ADDRESS` | `:9001` | Bind-Adresse und Port des Console-Listeners. |

## CORS

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `RUSTFS_CORS_ALLOWED_ORIGINS` | leer | Durch Kommas getrennte Origins, die aus einem Browser auf die S3-API zugreifen dürfen. Setzen Sie `*` für Wildcard-Origins ohne mitgesendete Browser-Credentials. |
| `RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS` | `*` | Durch Kommas getrennte Origins, die aus einem Browser auf die Console zugreifen dürfen, oder `*` für alle Origins. |

Siehe [CORS-Konfiguration](/de/administration/cors) für Konfiguration und Prüfung.

## TLS und KMS

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `RUSTFS_TLS_PATH` | nicht gesetzt | Verzeichnis mit TLS-Zertifikat und Schlüssel (`rustfs_cert.pem` / `rustfs_key.pem`) für die S3-API und die Console. TLS ist aktiv, wenn die Variable gesetzt ist. |
| `RUSTFS_TLS_RELOAD_ENABLE` | `false` | Überwacht das TLS-Verzeichnis und lädt Zertifikate im laufenden Betrieb neu. |
| `RUSTFS_TLS_KEYLOG` | `false` | Schreibt TLS-Sitzungsschlüssel zu Diagnosezwecken in eine Keylog-Datei. Aktivieren Sie diese Option nicht in der Produktion. |
| `RUSTFS_TRUST_SYSTEM_CA` | `false` | Vertraut zusätzlich dem CA-Speicher des Betriebssystems für ausgehende TLS-Verbindungen. |
| `RUSTFS_TRUST_LEAF_CERT_AS_CA` | `false` | Vertraut einem Leaf-Zertifikat, als wäre es eine CA (selbst signierte Konfigurationen). |
| `RUSTFS_SERVER_MTLS_ENABLE` | `false` | Verlangt Client-Zertifikate (gegenseitiges TLS, mTLS) an den Server-Listenern. |
| `RUSTFS_MTLS_CLIENT_CERT` | nicht gesetzt | Client-Zertifikat für mTLS-Verbindungen zwischen Knoten. |
| `RUSTFS_MTLS_CLIENT_KEY` | nicht gesetzt | Privater Client-Schlüssel für mTLS-Verbindungen zwischen Knoten. |
| `RUSTFS_KMS_ENABLE` | `false` | Aktiviert die serverseitige Verschlüsselung über KMS. |
| `RUSTFS_KMS_BACKEND` | `local` | KMS-Backend: `local`, `vault` / `vault-kv2` (Vault-KV2-Speicher mit lokaler Umhüllung der Datenschlüssel) oder `vault-transit`. |
| `RUSTFS_KMS_KEY_DIR` | nicht gesetzt | Schlüsselverzeichnis für das Backend `local`. |
| `RUSTFS_KMS_LOCAL_MASTER_KEY` | nicht gesetzt | Hauptschlüssel, der lokale KMS-Schlüsseldateien schützt. |
| `RUSTFS_KMS_VAULT_ADDRESS` | nicht gesetzt | Vault-Serveradresse für die Vault-Backends. |
| `RUSTFS_KMS_VAULT_TOKEN` | nicht gesetzt | Vault-Token für die Vault-Backends. |
| `RUSTFS_KMS_VAULT_MOUNT_PATH` | `transit` | Transit-Mount für `vault-transit`; veraltet und ungenutzt für `vault` / `vault-kv2`. |
| `RUSTFS_KMS_VAULT_KV_MOUNT` | `secret` | KV-v2-Mount für das Backend `vault` / `vault-kv2`. |
| `RUSTFS_KMS_VAULT_KEY_PREFIX` | `rustfs/kms/keys` | Präfix der Schlüsseldatensätze im KV-v2-Mount für `vault` / `vault-kv2`. |
| `RUSTFS_KMS_DEFAULT_KEY_ID` | nicht gesetzt | Standard-KMS-Schlüssel-ID für die Verschlüsselung. |
| `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS` | `false` | Erlaubt unsichere KMS-Standards, die nur für die Entwicklung gedacht sind. Aktivieren Sie diese Option niemals in der Produktion. |

## Observability

Die Observability-Pipeline exportiert Traces, Metriken und Protokolle über OTLP/HTTP.

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `RUSTFS_OBS_ENDPOINT` | leer | Basis-URL von OTLP/HTTP für Traces, Metriken und Protokolle, zum Beispiel `http://otel-collector:4318`. Wenn der Wert leer ist, gehen Protokolle nach stdout oder in lokale Dateien. |
| `RUSTFS_OBS_TRACE_ENDPOINT` | nicht gesetzt | Überschreibung des Trace-Endpunkts je Signal. |
| `RUSTFS_OBS_METRIC_ENDPOINT` | nicht gesetzt | Überschreibung des Metrik-Endpunkts je Signal. |
| `RUSTFS_OBS_LOG_ENDPOINT` | nicht gesetzt | Überschreibung des Protokoll-Endpunkts je Signal. |
| `RUSTFS_OBS_TRACES_EXPORT_ENABLED` | `true` | Exportiert Traces an den OTLP-Endpunkt. |
| `RUSTFS_OBS_METRICS_EXPORT_ENABLED` | `true` | Exportiert Metriken an den OTLP-Endpunkt. |
| `RUSTFS_OBS_LOGS_EXPORT_ENABLED` | `true` | Exportiert Protokolle an den OTLP-Endpunkt. |
| `RUSTFS_OBS_USE_STDOUT` | nicht gesetzt | Erzwingt die Telemetrieausgabe nach stdout. |
| `RUSTFS_OBS_SAMPLE_RATIO` | nicht gesetzt | Abtastrate für Traces (0.0–1.0). |
| `RUSTFS_OBS_METER_INTERVAL` | nicht gesetzt | Exportintervall für Metriken in Sekunden. |
| `RUSTFS_OBS_SERVICE_NAME` | nicht gesetzt | Dienstname in den Ressourcenattributen der Telemetrie. |
| `RUSTFS_OBS_ENVIRONMENT` | nicht gesetzt | Bezeichnung der Bereitstellungsumgebung (`production`, `development`, `test`, `staging`). |
| `RUSTFS_OBS_LOGGER_LEVEL` | nicht gesetzt | Filter für die Protokollstufe (zum Beispiel `info`, `debug`). |
| `RUSTFS_OBS_LOG_STDOUT_ENABLED` | nicht gesetzt | Spiegelt Protokolle zusätzlich nach stdout, wenn Datei- oder OTLP-Protokollierung aktiv ist. |
| `RUSTFS_OBS_LOG_DIRECTORY` | nicht gesetzt | Lokales Protokollverzeichnis. Nicht gesetzt bedeutet Ausgabe nach stdout; ein URL-Wert sendet Protokolle an einen entfernten Endpunkt. |
| `RUSTFS_OBS_LOG_FILENAME` | `rustfs.log` | Protokolldateiname im Protokollverzeichnis. |
| `RUSTFS_OBS_LOG_ROTATION_TIME` | `hourly` | Zeitbasierte Protokollrotation: `daily`, `hourly`, `minutely`. |
| `RUSTFS_OBS_LOG_KEEP_FILES` | `30` | Anzahl der aufbewahrten rotierten Protokolldateien. |
| `RUSTFS_OBS_LOG_MAX_TOTAL_SIZE_BYTES` | `2147483648` | Gesamtbudget (2 GiB) für das Protokollverzeichnis vor der Bereinigung. |
| `RUSTFS_OBS_LOG_COMPRESS_OLD_FILES` | `true` | Komprimiert rotierte Protokolldateien (standardmäßig `zstd`, steuerbar über `RUSTFS_OBS_LOG_COMPRESSION_ALGORITHM`). |

Intervalle der Metrikerfassung folgen dem Muster `RUSTFS_METRICS_<SCOPE>_INTERVAL_SEC` mit den Bereichen `DEFAULT`, `SYSTEM`, `CLUSTER`, `BUCKET`, `NODE`, `RESOURCE`, `AUDIT`, `NOTIFICATION` und `BUCKET_REPLICATION_BANDWIDTH`, zum Beispiel `RUSTFS_METRICS_CLUSTER_INTERVAL_SEC=60`.

## Scanner und Datenwiederherstellung (Healing)

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `RUSTFS_SCANNER_SPEED` | `default` | Vorgabe für die Scanner-Geschwindigkeit: `fastest`, `fast`, `default`, `slow`, `slowest`. Steuert Schlaffaktor, maximale Pause und Zyklusintervall. |
| `RUSTFS_SCANNER_DELAY` | aus der Geschwindigkeitsvorgabe | Überschreibt den Schlaf-Multiplikator des Scanners (zum Beispiel `30.0`). |
| `RUSTFS_SCANNER_MAX_WAIT_SECS` | aus der Geschwindigkeitsvorgabe | Überschreibt die maximale Scanner-Pause in Sekunden. |
| `RUSTFS_SCANNER_CYCLE` | aus der Geschwindigkeitsvorgabe | Überschreibt das Scan-Zyklusintervall in Sekunden (zum Beispiel `3600`). |
| `RUSTFS_SCANNER_START_DELAY_SECS` | nicht gesetzt | Startverzögerung in Sekunden vor dem ersten Scan-Zyklus. |
| `RUSTFS_SCANNER_CYCLE_MAX_DURATION_SECS` | `1800` | Begrenzt die Laufzeit eines Zyklus in Sekunden; `0` hebt das Budget auf. |
| `RUSTFS_SCANNER_CYCLE_MAX_OBJECTS` | `0` | Begrenzt die je Zyklus verarbeiteten Objekte; `0` hebt das Budget auf. |
| `RUSTFS_SCANNER_CYCLE_MAX_DIRECTORIES` | `0` | Begrenzt die je Zyklus betretenen Verzeichnisse; `0` hebt das Budget auf. |
| `RUSTFS_SCANNER_BITROT_CYCLE_SECS` | `2592000` | Zyklus des periodischen tiefen Scans (Bitrot) in Sekunden (30 Tage). `0`, `true` oder `on` macht jeden Zyklus tief; `false` oder `off` deaktiviert tiefe Scans. |
| `RUSTFS_SCANNER_IDLE_MODE` | `true` | Bei `true` drosselt sich der Scanner selbst; `false` lässt ihn mit voller Geschwindigkeit laufen. |
| `RUSTFS_SCANNER_CACHE_SAVE_TIMEOUT_SECS` | `14` | Zeitüberschreitung für das Speichern des Scanner-Caches in Sekunden (Minimum `1`). |
| `RUSTFS_SCANNER_MAX_CONCURRENT_SET_SCANS` | `4` | Begrenzt die Anzahl gleichzeitiger Scan-Aufgaben für Erasure-Sets; `0` behält die aus der Topologie abgeleitete Nebenläufigkeit. |
| `RUSTFS_SCANNER_MAX_CONCURRENT_DISK_SCANS` | `4` | Begrenzt gleichzeitige Bucket-Durchläufe auf Festplatten je Set; `0` behält die aus der Festplattenanzahl abgeleitete Nebenläufigkeit. |
| `RUSTFS_SCANNER_YIELD_EVERY_N_OBJECTS` | `128` | Wie oft Objektschleifen des Scanners an die asynchrone Laufzeitumgebung abgeben; `0` deaktiviert die zusätzliche Abgabe. |
| `RUSTFS_SCANNER_ALERT_EXCESS_VERSIONS` | `100` | Anzahl der Objektversionen, die Scanner-Alarme auslöst. |
| `RUSTFS_SCANNER_ALERT_EXCESS_VERSION_SIZE` | `1099511627776` | Aufsummierte Versionsbytes (1 TiB), die Scanner-Alarme auslösen. |
| `RUSTFS_SCANNER_ALERT_EXCESS_FOLDERS` | `65538` | Anzahl direkter Unterordner, die Scanner-Alarme auslöst. |
| `RUSTFS_HEAL_AUTO_HEAL_ENABLE` | `true` | Aktiviert die automatische Datenwiederherstellung beeinträchtigter Objekte im Hintergrund. |
| `RUSTFS_HEAL_QUEUE_SIZE` | `10000` | Kapazität der Warteschlange für Kandidaten der Datenwiederherstellung. |
| `RUSTFS_HEAL_INTERVAL_SECS` | `10` | Abstand zwischen den Läufen des Planers für die Datenwiederherstellung, in Sekunden. |
| `RUSTFS_HEAL_TASK_TIMEOUT_SECS` | `300` | Zeitüberschreitung für eine einzelne Aufgabe der Datenwiederherstellung, in Sekunden. |
| `RUSTFS_HEAL_MAX_CONCURRENT_HEALS` | `4` | Maximale Anzahl gleichzeitiger Aufgaben der Datenwiederherstellung. |
| `RUSTFS_HEAL_MAX_CONCURRENT_PER_SET` | `1` | Maximale Anzahl gleichzeitiger Aufgaben der Datenwiederherstellung je Erasure-Set. |

## Speicher und Erasure Coding

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `RUSTFS_STORAGE_CLASS_STANDARD` | automatisch | Parität der Speicherklasse STANDARD im Format `EC:n`, zum Beispiel `EC:4`. Wenn die Variable nicht gesetzt ist, wird die Parität aus der Größe des Erasure-Sets abgeleitet. |
| `RUSTFS_STORAGE_CLASS_RRS` | `EC:1` | Parität der Speicherklasse REDUCED_REDUNDANCY im Format `EC:n`. |
| `RUSTFS_STORAGE_CLASS_OPTIMIZE` | `availability` | Optimierungsziel bei der Wahl der Parität. |
| `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` | `131072` | Schwellenwert (128 KiB), unter dem Objektdaten in die Metadaten eingebettet werden. |
| `RUSTFS_ERASURE_SET_DRIVE_COUNT` | `0` | Erzwingt die Anzahl der Laufwerke je Erasure-Set; `0` wählt das Layout automatisch. |
| `RUSTFS_DURABILITY_MODE` | nicht gesetzt | Modus der Schreibdauerhaftigkeit: `strict`, `relaxed` oder `none`. Hat Vorrang vor dem älteren Schalter für die Laufwerksynchronisierung, wenn ein gültiger Wert gesetzt ist. |

## Anmeldedaten und interne Einstellungen

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `RUSTFS_ACCESS_KEY` | `rustfsadmin` | Root-Zugriffsschlüssel. Schließt sich mit `RUSTFS_ACCESS_KEY_FILE` gegenseitig aus. |
| `RUSTFS_SECRET_KEY` | `rustfsadmin` | Geheimer Root-Zugriffsschlüssel. Schließt sich mit `RUSTFS_SECRET_KEY_FILE` gegenseitig aus. |
| `RUSTFS_ACCESS_KEY_FILE` | nicht gesetzt | Pfad zu einer Datei mit dem Zugriffsschlüssel (zum Beispiel ein Secret-Mount von Docker oder Kubernetes). |
| `RUSTFS_SECRET_KEY_FILE` | nicht gesetzt | Pfad zu einer Datei mit dem geheimen Zugriffsschlüssel. |
| `RUSTFS_RPC_SECRET` | abgeleitet | Geheimnis für die Authentifizierung von RPC zwischen Knoten. Wenn die Variable nicht gesetzt ist, wird sie aus dem aktiven Paar aus Zugriffsschlüssel und geheimem Zugriffsschlüssel abgeleitet. Bei einem vollständig standardmäßigen Anmeldedatenpaar müssen Cluster mit mehreren Knoten sie ausdrücklich setzen. |

:::warning

Die eingebauten Standard-Anmeldedaten `rustfsadmin`/`rustfsadmin` dienen nur der Bequemlichkeit beim ersten Start. Setzen Sie für Produktionsbereitstellungen immer Anmeldedaten, die vom Standard abweichen.

:::

<a id="event--audit-targets"></a>

## Ereignis- und Audit-Ziele

Modulschalter:

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `RUSTFS_NOTIFY_ENABLE` | `false` | Aktiviert das Modul für Bucket-Ereignisbenachrichtigungen. |
| `RUSTFS_AUDIT_ENABLE` | `false` | Aktiviert das Modul für die Audit-Protokollierung. |

Die Zielkonfiguration folgt einem Muster: `RUSTFS_NOTIFY_<TARGET>_<KEY>` für Ereignisbenachrichtigungen und `RUSTFS_AUDIT_<TARGET>_<KEY>` für Audit-Protokolle. Unterstützte Ziele in beiden Familien: `WEBHOOK`, `KAFKA`, `MQTT`, `MYSQL`, `POSTGRES`, `NATS`, `REDIS`, `AMQP`, `PULSAR`.

Unterschlüssel für das Webhook-Ziel (dieselben Schlüssel gibt es unter `RUSTFS_AUDIT_WEBHOOK_*`):

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `RUSTFS_NOTIFY_WEBHOOK_ENABLE` | `false` | Aktiviert das Webhook-Ziel. |
| `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT` | nicht gesetzt | HTTP(S)-Endpunkt-URL des Webhooks. |
| `RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN` | nicht gesetzt | Bearer-Token, das bei jeder Zustellung gesendet wird. |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR` | nicht gesetzt | Verzeichnis für die persistente Zustellungswarteschlange. |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_LIMIT` | nicht gesetzt | Maximale Anzahl wartender Ereignisse. |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CERT` | nicht gesetzt | Client-Zertifikat für mTLS zum Endpunkt. |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_KEY` | nicht gesetzt | Privater Client-Schlüssel für mTLS zum Endpunkt. |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA` | nicht gesetzt | CA-Zertifikat, mit dem der Endpunkt geprüft wird. |
| `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY` | nicht gesetzt | Überspringt die TLS-Prüfung des Endpunkts (nicht empfohlen). |

Andere Ziele folgen demselben Muster mit zielspezifischen Schlüsseln, zum Beispiel `RUSTFS_NOTIFY_KAFKA_BROKERS`, `RUSTFS_NOTIFY_KAFKA_TOPIC`, `RUSTFS_NOTIFY_MQTT_BROKER`, `RUSTFS_NOTIFY_MQTT_TOPIC`, `RUSTFS_NOTIFY_MYSQL_DSN_STRING`, `RUSTFS_NOTIFY_NATS_ADDRESS`, `RUSTFS_NOTIFY_REDIS_URL`, `RUSTFS_NOTIFY_AMQP_URL`, `RUSTFS_NOTIFY_PULSAR_BROKER`.

## Abwärtskompatibilität

### Zuordnung von `MINIO_*`-Variablen

Zur Vereinfachung der Migration ordnet RustFS beim Start eine feste Positivliste von `MINIO_*`-Variablen ihren `RUSTFS_*`-Entsprechungen zu:

- Wenn nur die Variable mit dem Präfix `MINIO_` gesetzt ist, wird ihr Wert verwendet und eine Veraltungswarnung protokolliert.
- Wenn sowohl `MINIO_*` als auch `RUSTFS_*` mit unterschiedlichen Werten gesetzt sind, gilt der Wert von `RUSTFS_*` und der Konflikt wird festgehalten.

Die zugeordneten Suffixe umfassen `ACCESS_KEY`, `SECRET_KEY`, `ACCESS_KEY_FILE`, `SECRET_KEY_FILE`, `ROOT_USER`, `ROOT_PASSWORD`, `ADDRESS`, `CONSOLE_ADDRESS`, `VOLUMES`, `REGION`, `LICENSE`, `ERASURE_SET_DRIVE_COUNT`, `STORAGE_CLASS_STANDARD`, `STORAGE_CLASS_RRS`, `STORAGE_CLASS_OPTIMIZE`, `STORAGE_CLASS_INLINE_BLOCK`, `SCANNER_SPEED`, `SCANNER_CYCLE`, `COMPRESS_ENABLE`, `COMPRESS_EXTENSIONS`, `COMPRESS_MIME_TYPES`, `DRIVE_ACTIVE_MONITORING`, `ILM_EXPIRATION_WORKERS`, `API_XFF_HEADER`, `POLICY_PLUGIN_URL`, `POLICY_PLUGIN_AUTH_TOKEN`, die Schlüssel `IDENTITY_OPENID_*` und jede Variable, die mit `NOTIFY_WEBHOOK_`, `NOTIFY_MQTT_`, `AUDIT_WEBHOOK_` oder `AUDIT_MQTT_` beginnt. Zum Beispiel wird `MINIO_ROOT_USER` auf `RUSTFS_ROOT_USER` und `MINIO_NOTIFY_WEBHOOK_ENDPOINT` auf `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT` abgebildet.

### Veraltete Aliase

| Veraltete Variable | Stattdessen verwenden |
| --- | --- |
| `RUSTFS_ROOT_USER` | `RUSTFS_ACCESS_KEY` |
| `RUSTFS_ROOT_PASSWORD` | `RUSTFS_SECRET_KEY` |
| `RUSTFS_DATA_SCANNER_START_DELAY_SECS` | `RUSTFS_SCANNER_START_DELAY_SECS` |

Veraltete Aliase funktionieren weiterhin, protokollieren aber eine Warnung. Der kanonische Name `RUSTFS_*` hat immer Vorrang, wenn beide gesetzt sind.
