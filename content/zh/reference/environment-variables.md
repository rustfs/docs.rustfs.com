---
title: "环境变量"
description: "介绍用于配置 RustFS 服务器、控制台、TLS、KMS、可观测性、扫描器、修复、存储类、凭证和事件目标的环境变量。"
---

本页列出 `rustfs` 服务器二进制文件可识别的环境变量，涵盖已根据 RustFS 源代码验证且与运维相关的部分；部分内部调优选项有意省略。如果存在对应的命令行参数，每个变量也可以通过该参数提供（请参阅 [CLI 参考](./cli)）。

:::note[布尔值]

布尔变量接受 `true`/`false`。显示为“未设置”的值没有默认值，对应功能会保持禁用或回退到内置行为。

:::

## 核心服务器

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RUSTFS_VOLUMES` | 未设置（必填） | 存储卷或端点，以空格分隔。支持 `{N...M}` 省略号展开，例如 `/data/rustfs{0...3}` 或 `http://node{1...4}:9000/data/rustfs{0...3}`。Docker 镜像默认为 `/data`。 |
| `RUSTFS_ADDRESS` | `:9000` | S3 API 监听器的绑定地址和端口（也承载内部节点 RPC）。 |
| `RUSTFS_SERVER_DOMAINS` | 未设置 | 用于虚拟主机风格 S3 请求的域名，以逗号分隔。例如设置 `s3.example.com` 后，`bucket.s3.example.com` 会解析到存储桶 `bucket`。未设置时，仅支持路径风格寻址。 |
| `RUSTFS_REGION` | 未设置 | 向 S3 客户端报告的区域。未设置时，服务器回退到 `us-east-1`。 |
| `RUSTFS_LICENSE` | 未设置 | 许可证字符串。 |
| `RUSTFS_BUFFER_PROFILE` | `GeneralPurpose` | 自适应缓冲区大小的工作负载配置。可选值：`GeneralPurpose`、`AiTraining`、`DataAnalytics`、`WebWorkload`、`IndustrialIoT`、`SecureStorage`。 |
| `RUSTFS_BUFFER_PROFILE_DISABLE` | `false` | 禁用自适应缓冲区大小并使用旧版固定大小缓冲区。 |
| `RUSTFS_HEALTH_ENDPOINT_ENABLE` | `true` | 注册无需身份验证的 `/health` 和 `/health/ready` 探针端点。 |
| `RUSTFS_HEALTH_READINESS_CACHE_TTL_MS` | `1000` | 就绪探针结果的缓存 TTL，单位为毫秒。 |
| `RUSTFS_HEALTH_CLUSTER_TIMEOUT_MS` | `2000` | 集群健康探针（`/minio/health/cluster`）的超时时间，单位为毫秒。 |
| `RUSTFS_STARTUP_READINESS_MAX_WAIT_SECS` | `120` | 就绪探针报告“starting”的最长时间，超过后视为启动失败。 |

## 控制台

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RUSTFS_CONSOLE_ENABLE` | `true` | 启用内嵌 Web 控制台（通过单独的监听器提供服务）。 |
| `RUSTFS_CONSOLE_ADDRESS` | `:9001` | 控制台监听器的绑定地址和端口。 |

## CORS

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RUSTFS_CORS_ALLOWED_ORIGINS` | 空 | 允许从浏览器访问 S3 API 的来源，以逗号分隔。设置 `*` 可允许不携带凭证的通配来源。 |
| `RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS` | `*` | 允许从浏览器访问控制台的来源，以逗号分隔；设置 `*` 可允许所有来源。 |

有关配置和验证步骤，请参阅 [CORS 配置](/administration/cors)。

## TLS 和 KMS

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RUSTFS_TLS_PATH` | 未设置 | 包含 S3 API 和控制台所用 TLS 证书与密钥（`rustfs_cert.pem` / `rustfs_key.pem`）的目录。设置后启用 TLS。 |
| `RUSTFS_TLS_RELOAD_ENABLE` | `false` | 监视 TLS 目录并热重载证书。 |
| `RUSTFS_TLS_KEYLOG` | `false` | 将 TLS 会话密钥写入密钥日志文件以便调试。请勿在生产环境中启用。 |
| `RUSTFS_TRUST_SYSTEM_CA` | `false` | 对出站 TLS 连接同时信任操作系统 CA 存储。 |
| `RUSTFS_TRUST_LEAF_CERT_AS_CA` | `false` | 像信任 CA 一样信任叶证书（用于自签名配置）。 |
| `RUSTFS_SERVER_MTLS_ENABLE` | `false` | 要求服务器监听器提供客户端证书（双向 TLS）。 |
| `RUSTFS_MTLS_CLIENT_CERT` | 未设置 | 节点间 mTLS 连接提供的客户端证书。 |
| `RUSTFS_MTLS_CLIENT_KEY` | 未设置 | 节点间 mTLS 连接使用的客户端私钥。 |
| `RUSTFS_KMS_ENABLE` | `false` | 启用由 KMS 支持的服务端加密。 |
| `RUSTFS_KMS_BACKEND` | `local` | KMS 后端：`local`、`vault` / `vault-kv2`（Vault KV2 + Transit）或 `vault-transit`。 |
| `RUSTFS_KMS_KEY_DIR` | 未设置 | `local` 后端的密钥目录。 |
| `RUSTFS_KMS_LOCAL_MASTER_KEY` | 未设置 | 保护本地 KMS 密钥文件的主密钥。 |
| `RUSTFS_KMS_VAULT_ADDRESS` | 未设置 | Vault 后端的 Vault 服务器地址。 |
| `RUSTFS_KMS_VAULT_TOKEN` | 未设置 | Vault 后端的 Vault 令牌。 |
| `RUSTFS_KMS_VAULT_MOUNT_PATH` | 未设置 | Vault 后端的 Vault 挂载路径。 |
| `RUSTFS_KMS_DEFAULT_KEY_ID` | 未设置 | 用于加密的默认 KMS 密钥 ID。 |
| `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS` | `false` | 允许仅用于开发的不安全 KMS 默认值。切勿在生产环境中启用。 |

## 可观测性

可观测性管道通过 OTLP/HTTP 导出链路、指标和日志。

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RUSTFS_OBS_ENDPOINT` | 空 | 用于链路、指标和日志的根 OTLP/HTTP 基础 URL，例如 `http://otel-collector:4318`。为空时，日志输出到 stdout 或本地文件。 |
| `RUSTFS_OBS_TRACE_ENDPOINT` | 未设置 | 链路端点的单信号覆盖值。 |
| `RUSTFS_OBS_METRIC_ENDPOINT` | 未设置 | 指标端点的单信号覆盖值。 |
| `RUSTFS_OBS_LOG_ENDPOINT` | 未设置 | 日志端点的单信号覆盖值。 |
| `RUSTFS_OBS_TRACES_EXPORT_ENABLED` | `true` | 将链路导出到 OTLP 端点。 |
| `RUSTFS_OBS_METRICS_EXPORT_ENABLED` | `true` | 将指标导出到 OTLP 端点。 |
| `RUSTFS_OBS_LOGS_EXPORT_ENABLED` | `true` | 将日志导出到 OTLP 端点。 |
| `RUSTFS_OBS_USE_STDOUT` | 未设置 | 强制将遥测输出到 stdout。 |
| `RUSTFS_OBS_SAMPLE_RATIO` | 未设置 | 链路采样率（0.0–1.0）。 |
| `RUSTFS_OBS_METER_INTERVAL` | 未设置 | 指标导出间隔，单位为秒。 |
| `RUSTFS_OBS_SERVICE_NAME` | 未设置 | 遥测资源属性中报告的服务名称。 |
| `RUSTFS_OBS_ENVIRONMENT` | 未设置 | 部署环境标签（`production`、`development`、`test`、`staging`）。 |
| `RUSTFS_OBS_LOGGER_LEVEL` | 未设置 | 日志级别过滤器（例如 `info`、`debug`）。 |
| `RUSTFS_OBS_LOG_STDOUT_ENABLED` | 未设置 | 启用文件或 OTLP 日志记录时，同时将日志镜像到 stdout。 |
| `RUSTFS_OBS_LOG_DIRECTORY` | 未设置 | 本地日志目录。未设置表示日志输出到 stdout；URL 值会将日志发送到远程端点。 |
| `RUSTFS_OBS_LOG_FILENAME` | `rustfs.log` | 日志目录中的日志文件名。 |
| `RUSTFS_OBS_LOG_ROTATION_TIME` | `hourly` | 基于时间的日志轮转：`daily`、`hourly`、`minutely`。 |
| `RUSTFS_OBS_LOG_KEEP_FILES` | `30` | 保留的轮转日志文件数量。 |
| `RUSTFS_OBS_LOG_MAX_TOTAL_SIZE_BYTES` | `2147483648` | 清理前日志目录的总大小预算（2 GiB）。 |
| `RUSTFS_OBS_LOG_COMPRESS_OLD_FILES` | `true` | 压缩轮转日志文件（默认为 `zstd`，可通过 `RUSTFS_OBS_LOG_COMPRESSION_ALGORITHM` 控制）。 |

指标收集间隔遵循 `RUSTFS_METRICS_<SCOPE>_INTERVAL_SEC` 模式，作用域包括 `DEFAULT`、`SYSTEM`、`CLUSTER`、`BUCKET`、`NODE`、`RESOURCE`、`AUDIT`、`NOTIFICATION` 和 `BUCKET_REPLICATION_BANDWIDTH`，例如 `RUSTFS_METRICS_CLUSTER_INTERVAL_SEC=60`。

## 扫描和修复

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RUSTFS_SCANNER_SPEED` | `default` | 扫描器速度预设：`fastest`、`fast`、`default`、`slow`、`slowest`。控制休眠系数、最长休眠时间和周期间隔。 |
| `RUSTFS_SCANNER_DELAY` | 预设值 | 覆盖扫描器休眠倍数（例如 `30.0`）。 |
| `RUSTFS_SCANNER_MAX_WAIT_SECS` | 预设值 | 覆盖扫描器最长休眠秒数。 |
| `RUSTFS_SCANNER_CYCLE` | 预设值 | 覆盖扫描周期的秒数（例如 `3600`）。 |
| `RUSTFS_SCANNER_START_DELAY_SECS` | 未设置 | 第一个扫描周期开始前的启动延迟秒数。 |
| `RUSTFS_SCANNER_CYCLE_MAX_DURATION_SECS` | `0` | 限制单个周期的运行秒数；`0` 表示禁用该预算。 |
| `RUSTFS_SCANNER_CYCLE_MAX_OBJECTS` | `0` | 限制每个周期处理的对象数；`0` 表示禁用该预算。 |
| `RUSTFS_SCANNER_CYCLE_MAX_DIRECTORIES` | `0` | 限制每个周期进入的目录数；`0` 表示禁用该预算。 |
| `RUSTFS_SCANNER_BITROT_CYCLE_SECS` | `2592000` | 定期深度（位衰减）扫描周期的秒数（30 天）。`0`/`true`/`on` 使每个周期都执行深度扫描；`false`/`off` 禁用深度扫描。 |
| `RUSTFS_SCANNER_IDLE_MODE` | `true` | 为 `true` 时扫描器会自行限速；为 `false` 时全速运行。 |
| `RUSTFS_SCANNER_CACHE_SAVE_TIMEOUT_SECS` | `30` | 扫描器缓存保存超时秒数（最小值为 `1`）。 |
| `RUSTFS_SCANNER_MAX_CONCURRENT_SET_SCANS` | `0` | 限制并发纠删集扫描任务数；`0` 保留基于拓扑的并发数。 |
| `RUSTFS_SCANNER_MAX_CONCURRENT_DISK_SCANS` | `0` | 限制每个纠删集并发执行的磁盘存储桶遍历数；`0` 保留基于磁盘数量的并发数。 |
| `RUSTFS_SCANNER_YIELD_EVERY_N_OBJECTS` | `128` | 扫描器对象循环向异步运行时让出的频率；`0` 禁用额外让出。 |
| `RUSTFS_SCANNER_ALERT_EXCESS_VERSIONS` | `100` | 触发扫描器告警的对象版本数。 |
| `RUSTFS_SCANNER_ALERT_EXCESS_VERSION_SIZE` | `1099511627776` | 触发扫描器告警的累计版本字节数（1 TiB）。 |
| `RUSTFS_SCANNER_ALERT_EXCESS_FOLDERS` | `65538` | 触发扫描器告警的直接子文件夹数。 |
| `RUSTFS_HEAL_AUTO_HEAL_ENABLE` | `true` | 启用降级对象的自动后台修复。 |
| `RUSTFS_HEAL_QUEUE_SIZE` | `10000` | 待修复项队列容量。 |
| `RUSTFS_HEAL_INTERVAL_SECS` | `10` | 修复调度器运行间隔，单位为秒。 |
| `RUSTFS_HEAL_TASK_TIMEOUT_SECS` | `300` | 单个修复任务的超时时间，单位为秒。 |
| `RUSTFS_HEAL_MAX_CONCURRENT_HEALS` | `4` | 最大并发修复任务数。 |
| `RUSTFS_HEAL_MAX_CONCURRENT_PER_SET` | `1` | 每个纠删集的最大并发修复任务数。 |

## 存储和纠删码

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RUSTFS_STORAGE_CLASS_STANDARD` | 自动 | STANDARD 存储类的奇偶校验数，格式为 `EC:n`，例如 `EC:4`。未设置时，根据纠删集大小推导奇偶校验数。 |
| `RUSTFS_STORAGE_CLASS_RRS` | `EC:1` | REDUCED_REDUNDANCY 存储类的奇偶校验数，格式为 `EC:n`。 |
| `RUSTFS_STORAGE_CLASS_OPTIMIZE` | `availability` | 选择奇偶校验数时的优化目标。 |
| `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` | `131072` | 对象数据内联到元数据中的阈值（128 KiB）。 |
| `RUSTFS_ERASURE_SET_DRIVE_COUNT` | `0` | 强制设置每个纠删集的磁盘数；`0` 表示自动选择布局。 |
| `RUSTFS_DURABILITY_MODE` | 未设置 | 写入持久性模式：`strict`、`relaxed` 或 `none`。设置为有效值时，优先于旧版磁盘同步开关。 |

## 凭证和内部设置

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RUSTFS_ACCESS_KEY` | `rustfsadmin` | 根访问密钥。与 `RUSTFS_ACCESS_KEY_FILE` 互斥。 |
| `RUSTFS_SECRET_KEY` | `rustfsadmin` | 根私有密钥。与 `RUSTFS_SECRET_KEY_FILE` 互斥。 |
| `RUSTFS_ACCESS_KEY_FILE` | 未设置 | 包含访问密钥的文件路径（例如 Docker/Kubernetes Secret 挂载）。 |
| `RUSTFS_SECRET_KEY_FILE` | 未设置 | 包含私有密钥的文件路径。 |
| `RUSTFS_RPC_SECRET` | 派生值 | 用于验证节点间 RPC 的密钥。未设置时，从当前访问密钥与私有密钥对派生；如果凭证对全部使用默认值，多节点集群必须显式设置该变量。 |

:::warning

内置默认凭证 `rustfsadmin`/`rustfsadmin` 仅用于首次启动。生产部署必须设置非默认凭证。

:::

## 事件和审计目标

模块开关：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RUSTFS_NOTIFY_ENABLE` | `false` | 启用存储桶事件通知模块。 |
| `RUSTFS_AUDIT_ENABLE` | `false` | 启用审计日志模块。 |

目标配置基于模式：事件通知使用 `RUSTFS_NOTIFY_<TARGET>_<KEY>`，审计日志使用 `RUSTFS_AUDIT_<TARGET>_<KEY>`。两个系列均支持以下目标：`WEBHOOK`、`KAFKA`、`MQTT`、`MYSQL`、`POSTGRES`、`NATS`、`REDIS`、`AMQP`、`PULSAR`。

Webhook 目标的子键如下（`RUSTFS_AUDIT_WEBHOOK_*` 下存在相同的键）：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RUSTFS_NOTIFY_WEBHOOK_ENABLE` | `false` | 启用 Webhook 目标。 |
| `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT` | 未设置 | Webhook HTTP(S) 端点 URL。 |
| `RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN` | 未设置 | 每次投递时发送的 Bearer 令牌。 |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR` | 未设置 | 持久投递队列的目录。 |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_LIMIT` | 未设置 | 最大排队事件数。 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CERT` | 未设置 | 连接端点时用于 mTLS 的客户端证书。 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_KEY` | 未设置 | 连接端点时用于 mTLS 的客户端私钥。 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA` | 未设置 | 用于验证端点的 CA 证书。 |
| `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY` | 未设置 | 跳过端点的 TLS 验证（不建议）。 |

其他目标采用相同结构并使用目标特定的键，例如 `RUSTFS_NOTIFY_KAFKA_BROKERS`、`RUSTFS_NOTIFY_KAFKA_TOPIC`、`RUSTFS_NOTIFY_MQTT_BROKER`、`RUSTFS_NOTIFY_MQTT_TOPIC`、`RUSTFS_NOTIFY_MYSQL_DSN_STRING`、`RUSTFS_NOTIFY_NATS_ADDRESS`、`RUSTFS_NOTIFY_REDIS_URL`、`RUSTFS_NOTIFY_AMQP_URL`、`RUSTFS_NOTIFY_PULSAR_BROKER`。

## 旧版兼容性

### MINIO_* 变量映射

为便于迁移，RustFS 会在启动时将固定允许列表中的 `MINIO_*` 变量映射到对应的 `RUSTFS_*` 变量：

- 如果仅设置带 `MINIO_` 前缀的变量，则使用其值并记录弃用警告。
- 如果同时设置 `MINIO_*` 和 `RUSTFS_*` 且值不同，则以 `RUSTFS_*` 值为准并记录冲突。

映射的后缀包括 `ACCESS_KEY`、`SECRET_KEY`、`ACCESS_KEY_FILE`、`SECRET_KEY_FILE`、`ROOT_USER`、`ROOT_PASSWORD`、`ADDRESS`、`CONSOLE_ADDRESS`、`VOLUMES`、`REGION`、`LICENSE`、`ERASURE_SET_DRIVE_COUNT`、`STORAGE_CLASS_STANDARD`、`STORAGE_CLASS_RRS`、`STORAGE_CLASS_OPTIMIZE`、`STORAGE_CLASS_INLINE_BLOCK`、`SCANNER_SPEED`、`SCANNER_CYCLE`、`COMPRESS_ENABLE`、`COMPRESS_EXTENSIONS`、`COMPRESS_MIME_TYPES`、`DRIVE_ACTIVE_MONITORING`、`ILM_EXPIRATION_WORKERS`、`API_XFF_HEADER`、`POLICY_PLUGIN_URL`、`POLICY_PLUGIN_AUTH_TOKEN`、`IDENTITY_OPENID_*` 键，以及所有以 `NOTIFY_WEBHOOK_`、`NOTIFY_MQTT_`、`AUDIT_WEBHOOK_` 或 `AUDIT_MQTT_` 开头的变量。例如，`MINIO_ROOT_USER` 映射到 `RUSTFS_ROOT_USER`，`MINIO_NOTIFY_WEBHOOK_ENDPOINT` 映射到 `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT`。

### 已弃用别名

| 已弃用变量 | 请改用 |
| --- | --- |
| `RUSTFS_ROOT_USER` | `RUSTFS_ACCESS_KEY` |
| `RUSTFS_ROOT_PASSWORD` | `RUSTFS_SECRET_KEY` |
| `RUSTFS_DATA_SCANNER_START_DELAY_SECS` | `RUSTFS_SCANNER_START_DELAY_SECS` |

已弃用别名仍可使用，但会记录警告；两者同时设置时，始终以规范的 `RUSTFS_*` 名称为准。