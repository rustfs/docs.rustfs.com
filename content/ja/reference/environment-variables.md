---
title: "環境変数"
description: "RustFS サーバー、Console、TLS、KMS、オブザーバビリティ、スキャナー、データ修復、ストレージクラス、認証情報、イベントターゲットを設定する環境変数のリファレンスです。"
---

このページでは、`rustfs` サーバーバイナリが認識する環境変数を一覧します。対象は、RustFS のソースコードで確認した、運用に関係する変数に限ります。内部向けの調整項目の一部は、意図的に省略しています。対応するコマンドラインフラグがある変数は、そのフラグでも指定できます（[CLI リファレンス](./cli) を参照）。

:::note[真偽値]

真偽値の変数は `true`/`false` を受け付けます。「unset」と示した値には既定値がなく、対応する機能は無効のままか、組み込みの動作にフォールバックします。

:::

## コアサーバー

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `RUSTFS_VOLUMES` | unset (required) | ストレージボリュームまたはエンドポイントを、空白区切りで指定します。`{N...M}` 形式の省略記号展開に対応します。例: `/data/rustfs{0...3}`、`http://node{1...4}:9000/data/rustfs{0...3}`。Docker イメージの既定値は `/data` です。 |
| `RUSTFS_ADDRESS` | `:9000` | S3 API リスナーのバインドアドレスとポートです（ノード間の内部 RPC もこのリスナーを使います）。 |
| `RUSTFS_SERVER_DOMAINS` | unset | 仮想ホスト形式の S3 リクエストに使うドメイン名を、カンマ区切りで指定します。例: `s3.example.com` を指定すると、`bucket.s3.example.com` はバケット `bucket` として解決されます。未設定の場合は、パススタイルアクセスのみが動作します。 |
| `RUSTFS_REGION` | unset | S3 クライアントへ報告するリージョンです。未設定の場合、サーバーは `us-east-1` にフォールバックします。 |
| `RUSTFS_LICENSE` | unset | ライセンス文字列です。 |
| `RUSTFS_BUFFER_PROFILE` | `GeneralPurpose` | 適応的なバッファサイズ決定に使うワークロードプロファイルです。選択肢は `GeneralPurpose`、`AiTraining`、`DataAnalytics`、`WebWorkload`、`IndustrialIoT`、`SecureStorage` です。 |
| `RUSTFS_BUFFER_PROFILE_DISABLE` | `false` | 適応的なバッファサイズ決定を無効にし、従来の固定サイズバッファを使います。 |
| `RUSTFS_HEALTH_ENDPOINT_ENABLE` | `true` | 認証不要のプローブエンドポイント `/health` と `/health/ready` を登録します。 |
| `RUSTFS_HEALTH_READINESS_CACHE_TTL_MS` | `1000` | 準備完了プローブの結果をキャッシュする TTL です。単位はミリ秒です。 |
| `RUSTFS_HEALTH_CLUSTER_TIMEOUT_MS` | `2000` | クラスターのヘルスチェック（`/minio/health/cluster`）のタイムアウトです。単位はミリ秒です。 |
| `RUSTFS_STARTUP_READINESS_MAX_WAIT_SECS` | `120` | 準備完了プローブが「starting」と報告する最長時間です。この時間を超えると、起動に失敗したとみなします。単位は秒です。 |
| `RUSTFS_CHECK_UPDATE` | `true` | 起動時に `version.rustfs.com` へ HTTPS リクエストを 1 回送り、新しい RustFS リリースがあるか確認します。ユーザーエージェントには現在のバージョンが含まれます。結果はログに記録されるだけで、RustFS が自ら更新することはありません。エアギャップ環境などでは `false` に設定し、外部へのリクエストを省略します。認識できない値は `true` にフォールバックします。 |

## Console

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `RUSTFS_CONSOLE_ENABLE` | `true` | 組み込みの Web Console を有効にします（別のリスナーで提供されます）。 |
| `RUSTFS_CONSOLE_ADDRESS` | `:9001` | Console リスナーのバインドアドレスとポートです。 |

## CORS [#cors]

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `RUSTFS_CORS_ALLOWED_ORIGINS` | empty | ブラウザから S3 API へアクセスできるオリジンを、カンマ区切りで指定します。認証情報を伴わないワイルドカードオリジンにする場合は `*` を設定します。 |
| `RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS` | `*` | ブラウザから Console へアクセスできるオリジンをカンマ区切りで指定します。すべてのオリジンを許可する場合は `*` です。 |

設定と確認の手順は [CORS の設定](/ja/administration/cors) を参照します。

## TLS と KMS

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `RUSTFS_TLS_PATH` | unset | S3 API と Console 用の TLS 証明書と鍵（`rustfs_cert.pem` / `rustfs_key.pem`）を置くディレクトリです。設定すると TLS が有効になります。 |
| `RUSTFS_TLS_RELOAD_ENABLE` | `false` | TLS ディレクトリを監視し、証明書を再読み込みします。 |
| `RUSTFS_TLS_KEYLOG` | `false` | デバッグのため、TLS セッション鍵を keylog ファイルへ書き出します。本番では有効にしないでください。 |
| `RUSTFS_TRUST_SYSTEM_CA` | `false` | 外向きの TLS 接続で、オペレーティングシステムの CA ストアも信頼します。 |
| `RUSTFS_TRUST_LEAF_CERT_AS_CA` | `false` | リーフ証明書を CA であるかのように信頼します（自己署名の構成向けです）。 |
| `RUSTFS_SERVER_MTLS_ENABLE` | `false` | サーバーリスナーでクライアント証明書（相互 TLS）を要求します。 |
| `RUSTFS_MTLS_CLIENT_CERT` | unset | ノード間の mTLS 接続で提示するクライアント証明書です。 |
| `RUSTFS_MTLS_CLIENT_KEY` | unset | ノード間の mTLS 接続に使うクライアント秘密鍵です。 |
| `RUSTFS_KMS_ENABLE` | `false` | KMS を使ったサーバー側の暗号化を有効にします。 |
| `RUSTFS_KMS_BACKEND` | `local` | KMS バックエンドです。指定できる値は `local`、`vault` / `vault-kv2`（ローカルでデータキーをラップする Vault KV2 ストレージ）、`vault-transit` です。 |
| `RUSTFS_KMS_KEY_DIR` | unset | `local` バックエンドのキーディレクトリです。 |
| `RUSTFS_KMS_LOCAL_MASTER_KEY` | unset | ローカル KMS のキーファイルを保護するマスターキーです。 |
| `RUSTFS_KMS_VAULT_ADDRESS` | unset | Vault バックエンドが使う Vault サーバーのアドレスです。 |
| `RUSTFS_KMS_VAULT_TOKEN` | unset | Vault バックエンドが使う Vault トークンです。 |
| `RUSTFS_KMS_VAULT_MOUNT_PATH` | `transit` | `vault-transit` の Transit マウントです。`vault` / `vault-kv2` では非推奨であり、使用されません。 |
| `RUSTFS_KMS_VAULT_KV_MOUNT` | `secret` | `vault` / `vault-kv2` バックエンドの KV v2 マウントです。 |
| `RUSTFS_KMS_VAULT_KEY_PREFIX` | `rustfs/kms/keys` | `vault` / `vault-kv2` で、KV v2 マウント内のキーレコードに付けるプレフィックスです。 |
| `RUSTFS_KMS_DEFAULT_KEY_ID` | unset | 暗号化に使う既定の KMS キー ID です。 |
| `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS` | `false` | 開発専用の、安全でない KMS 既定値を許可します。本番では決して有効にしないでください。 |

## オブザーバビリティ

オブザーバビリティのパイプラインは、トレース、メトリクス、ログを OTLP/HTTP でエクスポートします。

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `RUSTFS_OBS_ENDPOINT` | empty | トレース、メトリクス、ログ共通の OTLP/HTTP ベース URL です。例: `http://otel-collector:4318` 。空の場合、ログは標準出力またはローカルファイルへ出力されます。 |
| `RUSTFS_OBS_TRACE_ENDPOINT` | unset | トレースエンドポイントに対する、シグナル別の上書きです。 |
| `RUSTFS_OBS_METRIC_ENDPOINT` | unset | メトリクスエンドポイントに対する、シグナル別の上書きです。 |
| `RUSTFS_OBS_LOG_ENDPOINT` | unset | ログエンドポイントに対する、シグナル別の上書きです。 |
| `RUSTFS_OBS_TRACES_EXPORT_ENABLED` | `true` | トレースを OTLP エンドポイントへエクスポートします。 |
| `RUSTFS_OBS_METRICS_EXPORT_ENABLED` | `true` | メトリクスを OTLP エンドポイントへエクスポートします。 |
| `RUSTFS_OBS_LOGS_EXPORT_ENABLED` | `true` | ログを OTLP エンドポイントへエクスポートします。 |
| `RUSTFS_OBS_USE_STDOUT` | unset | テレメトリ出力を標準出力へ強制します。 |
| `RUSTFS_OBS_SAMPLE_RATIO` | unset | トレースのサンプリング率です（0.0〜1.0）。 |
| `RUSTFS_OBS_METER_INTERVAL` | unset | メトリクスのエクスポート間隔です。単位は秒です。 |
| `RUSTFS_OBS_SERVICE_NAME` | unset | テレメトリのリソース属性として報告するサービス名です。 |
| `RUSTFS_OBS_ENVIRONMENT` | unset | デプロイ環境のラベルです（`production`、`development`、`test`、`staging`）。 |
| `RUSTFS_OBS_LOGGER_LEVEL` | unset | ログレベルのフィルタです（例: `info`、`debug`）。 |
| `RUSTFS_OBS_LOG_STDOUT_ENABLED` | unset | ファイルまたは OTLP へのログ出力が有効なとき、ログを標準出力へも複製します。 |
| `RUSTFS_OBS_LOG_DIRECTORY` | unset | ローカルのログディレクトリです。未設定の場合、ログは標準出力へ出力されます。URL を指定すると、ログはリモートエンドポイントへ送信されます。 |
| `RUSTFS_OBS_LOG_FILENAME` | `rustfs.log` | ログディレクトリ内のログファイル名です。 |
| `RUSTFS_OBS_LOG_ROTATION_TIME` | `hourly` | 時間に基づくログローテーションです。指定できる値は `daily`、`hourly`、`minutely` です。 |
| `RUSTFS_OBS_LOG_KEEP_FILES` | `30` | 保持するローテーション済みログファイルの数です。 |
| `RUSTFS_OBS_LOG_MAX_TOTAL_SIZE_BYTES` | `2147483648` | クリーンアップ前における、ログディレクトリの合計サイズ上限です（2 GiB）。 |
| `RUSTFS_OBS_LOG_COMPRESS_OLD_FILES` | `true` | ローテーション済みのログファイルを圧縮します（既定は `zstd`。`RUSTFS_OBS_LOG_COMPRESSION_ALGORITHM` で変更できます）。 |

メトリクスの収集間隔は、`RUSTFS_METRICS_<SCOPE>_INTERVAL_SEC` というパターンに従います。スコープは `DEFAULT`、`SYSTEM`、`CLUSTER`、`BUCKET`、`NODE`、`RESOURCE`、`AUDIT`、`NOTIFICATION`、`BUCKET_REPLICATION_BANDWIDTH` です。例: `RUSTFS_METRICS_CLUSTER_INTERVAL_SEC=60`。

## スキャナーとデータ修復

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `RUSTFS_SCANNER_SPEED` | `default` | スキャナー速度のプリセットです。指定できる値は `fastest`、`fast`、`default`、`slow`、`slowest` です。スリープ係数、最大スリープ、サイクル間隔を制御します。 |
| `RUSTFS_SCANNER_DELAY` | preset | スキャナーのスリープ倍率を上書きします（例: `30.0`）。 |
| `RUSTFS_SCANNER_MAX_WAIT_SECS` | preset | スキャナーの最大スリープ時間を秒単位で上書きします。 |
| `RUSTFS_SCANNER_CYCLE` | preset | スキャンサイクルの間隔を秒単位で上書きします（例: `3600`）。 |
| `RUSTFS_SCANNER_START_DELAY_SECS` | unset | 最初のスキャンサイクルまでの起動遅延です。単位は秒です。 |
| `RUSTFS_SCANNER_CYCLE_MAX_DURATION_SECS` | `1800` | 1 サイクルの実行時間の上限です。単位は秒です。`0` でこの上限を無効にします。 |
| `RUSTFS_SCANNER_CYCLE_MAX_OBJECTS` | `0` | 1 サイクルで処理するオブジェクト数の上限です。`0` でこの上限を無効にします。 |
| `RUSTFS_SCANNER_CYCLE_MAX_DIRECTORIES` | `0` | 1 サイクルで進入するディレクトリ数の上限です。`0` でこの上限を無効にします。 |
| `RUSTFS_SCANNER_BITROT_CYCLE_SECS` | `2592000` | 定期的なディープ（bitrot）スキャンのサイクルです。単位は秒です（30 日）。`0` / `true` / `on` ですべてのサイクルをディープにし、`false` / `off` でディープスキャンを無効にします。 |
| `RUSTFS_SCANNER_IDLE_MODE` | `true` | `true` のとき、スキャナーは自ら処理を抑制します。`false` では全速で実行します。 |
| `RUSTFS_SCANNER_CACHE_SAVE_TIMEOUT_SECS` | `14` | スキャナーキャッシュの保存タイムアウトです。単位は秒です（最小値は `1`）。 |
| `RUSTFS_SCANNER_MAX_CONCURRENT_SET_SCANS` | `4` | 同時に実行するイレイジャーセットのスキャンタスク数の上限です。`0` ではトポロジーに基づく同時実行数を維持します。 |
| `RUSTFS_SCANNER_MAX_CONCURRENT_DISK_SCANS` | `4` | セットあたりで同時に行うディスク上のバケット走査数の上限です。`0` ではディスク数に基づく同時実行数を維持します。 |
| `RUSTFS_SCANNER_YIELD_EVERY_N_OBJECTS` | `128` | スキャナーのオブジェクトループが、非同期ランタイムへ処理を譲る頻度です。`0` で、この追加の譲り渡しを無効にします。 |
| `RUSTFS_SCANNER_ALERT_EXCESS_VERSIONS` | `100` | スキャナーアラートを発生させる、オブジェクトのバージョン数です。 |
| `RUSTFS_SCANNER_ALERT_EXCESS_VERSION_SIZE` | `1099511627776` | スキャナーアラートを発生させる、バージョンの累積バイト数です（1 TiB）。 |
| `RUSTFS_SCANNER_ALERT_EXCESS_FOLDERS` | `65538` | スキャナーアラートを発生させる、直下のサブフォルダー数です。 |
| `RUSTFS_HEAL_AUTO_HEAL_ENABLE` | `true` | 劣化したオブジェクトの自動バックグラウンドデータ修復を有効にします。 |
| `RUSTFS_HEAL_QUEUE_SIZE` | `10000` | 修復候補キューの容量です。 |
| `RUSTFS_HEAL_INTERVAL_SECS` | `10` | 修復スケジューラの実行間隔です。単位は秒です。 |
| `RUSTFS_HEAL_TASK_TIMEOUT_SECS` | `300` | 1 件の修復タスクのタイムアウトです。単位は秒です。 |
| `RUSTFS_HEAL_MAX_CONCURRENT_HEALS` | `4` | 同時に実行する修復タスクの最大数です。 |
| `RUSTFS_HEAL_MAX_CONCURRENT_PER_SET` | `1` | イレイジャーセットあたりの、同時修復タスクの最大数です。 |

## ストレージとイレイジャーコーディング [#storage--erasure]

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `RUSTFS_STORAGE_CLASS_STANDARD` | auto | STANDARD ストレージクラスのパリティです。形式は `EC:n` です。例: `EC:4`。未設定の場合、パリティはイレイジャーセットのサイズから決まります。 |
| `RUSTFS_STORAGE_CLASS_RRS` | `EC:1` | REDUCED_REDUNDANCY ストレージクラスのパリティです。形式は `EC:n` です。 |
| `RUSTFS_STORAGE_CLASS_OPTIMIZE` | `availability` | パリティ選択における最適化の目標です。 |
| `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` | `131072` | オブジェクトデータをメタデータへインライン化するサイズのしきい値です（128 KiB）。この値未満が対象です。 |
| `RUSTFS_ERASURE_SET_DRIVE_COUNT` | `0` | イレイジャーセットあたりのドライブ数を強制します。`0` ではレイアウトを自動選択します。 |
| `RUSTFS_DURABILITY_MODE` | unset | 書き込みの耐久性モードです。指定できる値は `strict`、`relaxed`、`none` です。有効な値を設定すると、従来のドライブ同期スイッチより優先されます。 |

## 認証情報と内部設定

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `RUSTFS_ACCESS_KEY` | `rustfsadmin` | ルートアクセスキーです。`RUSTFS_ACCESS_KEY_FILE` とは同時に指定できません。 |
| `RUSTFS_SECRET_KEY` | `rustfsadmin` | ルートシークレットキーです。`RUSTFS_SECRET_KEY_FILE` とは同時に指定できません。 |
| `RUSTFS_ACCESS_KEY_FILE` | unset | アクセスキーを格納したファイルのパスです（例: Docker や Kubernetes の Secret マウント）。 |
| `RUSTFS_SECRET_KEY_FILE` | unset | シークレットキーを格納したファイルのパスです。 |
| `RUSTFS_RPC_SECRET` | derived | ノード間 RPC の認証に使うシークレットです。未設定の場合は、有効なアクセスキーとシークレットキーの組から導出されます。認証情報がすべて既定値の組である場合、マルチノードクラスターではこの値を明示的に設定する必要があります。 |

:::warning

組み込みの既定認証情報 `rustfsadmin`/`rustfsadmin` は、初回起動を簡単にするためのものです。本番デプロイでは、既定以外の認証情報を設定する必要があります。

:::

## イベントと監査のターゲット [#event--audit-targets]

モジュールのスイッチ:

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `RUSTFS_NOTIFY_ENABLE` | `false` | バケットイベント通知モジュールを有効にします。 |
| `RUSTFS_AUDIT_ENABLE` | `false` | 監査ログモジュールを有効にします。 |

ターゲットの設定はパターンに基づきます。イベント通知は `RUSTFS_NOTIFY_<TARGET>_<KEY>`、監査ログは `RUSTFS_AUDIT_<TARGET>_<KEY>` です。両系統でサポートされるターゲットは `WEBHOOK`、`KAFKA`、`MQTT`、`MYSQL`、`POSTGRES`、`NATS`、`REDIS`、`AMQP`、`PULSAR` です。

Webhook ターゲットのサブキーです（同じキーが `RUSTFS_AUDIT_WEBHOOK_*` にもあります）。

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `RUSTFS_NOTIFY_WEBHOOK_ENABLE` | `false` | Webhook ターゲットを有効にします。 |
| `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT` | unset | Webhook の HTTP(S) エンドポイント URL です。 |
| `RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN` | unset | 各配信に付与する Bearer トークンです。 |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR` | unset | 永続的な配信キューのディレクトリです。 |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_LIMIT` | unset | キューに入れられるイベントの最大数です。 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CERT` | unset | エンドポイントへの mTLS に使うクライアント証明書です。 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_KEY` | unset | エンドポイントへの mTLS に使うクライアント秘密鍵です。 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA` | unset | エンドポイントの検証に使う CA 証明書です。 |
| `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY` | unset | エンドポイントの TLS 検証を省略します（推奨しません）。 |

ほかのターゲットも同じ形で、ターゲット固有のキーを持ちます。例: `RUSTFS_NOTIFY_KAFKA_BROKERS`、`RUSTFS_NOTIFY_KAFKA_TOPIC`、`RUSTFS_NOTIFY_MQTT_BROKER`、`RUSTFS_NOTIFY_MQTT_TOPIC`、`RUSTFS_NOTIFY_MYSQL_DSN_STRING`、`RUSTFS_NOTIFY_NATS_ADDRESS`、`RUSTFS_NOTIFY_REDIS_URL`、`RUSTFS_NOTIFY_AMQP_URL`、`RUSTFS_NOTIFY_PULSAR_BROKER`。

## 従来互換

### MINIO_* 変数の対応

移行を簡単にするため、RustFS は起動時に、許可リストで固定された `MINIO_*` 変数を、対応する `RUSTFS_*` へ割り当てます。

- `MINIO_` 接頭辞の変数だけが設定されている場合は、その値が使われ、非推奨である旨の警告がログに記録されます。
- `MINIO_*` と `RUSTFS_*` が異なる値で両方設定されている場合は、`RUSTFS_*` の値が優先され、競合が記録されます。

対応する接尾辞には、`ACCESS_KEY`、`SECRET_KEY`、`ACCESS_KEY_FILE`、`SECRET_KEY_FILE`、`ROOT_USER`、`ROOT_PASSWORD`、`ADDRESS`、`CONSOLE_ADDRESS`、`VOLUMES`、`REGION`、`LICENSE`、`ERASURE_SET_DRIVE_COUNT`、`STORAGE_CLASS_STANDARD`、`STORAGE_CLASS_RRS`、`STORAGE_CLASS_OPTIMIZE`、`STORAGE_CLASS_INLINE_BLOCK`、`SCANNER_SPEED`、`SCANNER_CYCLE`、`COMPRESS_ENABLE`、`COMPRESS_EXTENSIONS`、`COMPRESS_MIME_TYPES`、`DRIVE_ACTIVE_MONITORING`、`ILM_EXPIRATION_WORKERS`、`API_XFF_HEADER`、`POLICY_PLUGIN_URL`、`POLICY_PLUGIN_AUTH_TOKEN`、`IDENTITY_OPENID_*` の各キー、および `NOTIFY_WEBHOOK_`、`NOTIFY_MQTT_`、`AUDIT_WEBHOOK_`、`AUDIT_MQTT_` で始まるすべての変数が含まれます。たとえば、`MINIO_ROOT_USER` は `RUSTFS_ROOT_USER` に、`MINIO_NOTIFY_WEBHOOK_ENDPOINT` は `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT` に対応します。

### 非推奨のエイリアス

| 非推奨の変数 | 代替 |
| --- | --- |
| `RUSTFS_ROOT_USER` | `RUSTFS_ACCESS_KEY` |
| `RUSTFS_ROOT_PASSWORD` | `RUSTFS_SECRET_KEY` |
| `RUSTFS_DATA_SCANNER_START_DELAY_SECS` | `RUSTFS_SCANNER_START_DELAY_SECS` |

非推奨のエイリアスは引き続き動作しますが、警告がログに記録されます。両方を設定した場合、正規の `RUSTFS_*` 名が常に優先されます。
