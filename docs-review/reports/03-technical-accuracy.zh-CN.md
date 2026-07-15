# 专项评审 · 技术准确性核对（架构师 + 测试视角）

> **审计基线**：upstream `rustfs/rustfs` @ `ea2e24ac`（2026-07-14，最新 main）；文档 worktree `content/` 下全部 88 个英文 markdown。upstream 引用路径相对于源码仓库根目录。
> 判定图例：✅ 正确 | ❌ 错误 | ⚠️ 过时/易误导 | ❓ 无法从源码验证

## 结论摘要

文档整体骨架（端口 9000/9001、`RUSTFS_ACCESS_KEY/SECRET_KEY`、`/etc/default/rustfs`、`{0...3}` 花括号卷展开、TLS 证书命名、虚拟主机 `RUSTFS_SERVER_DOMAINS`）与源码一致，**安装类文档基本可用**；但存在两类严重漂移：

其一，**troubleshooting / upgrade-scale 系列大量使用不存在的 CLI 工具（`rc admin heal`、`rustfs-admin`、`rc cluster status`）和不存在的配置文件（`config.toml` / `config.yaml`）**，用户照抄必然失败。

其二，**features 系列约 9 个页面是 MinIO 营销文案换皮**，宣称 RustFS 拥有 KES 密钥服务、Kubernetes Operator、Elasticsearch/NSQ 通知目标、HDFS/NFS 多协议等源码中完全不存在的能力，而 KMS 实际仅支持 local / vault / vault-transit 三种后端。

另有若干"会坑人"的点：安全清单把控制台端口写成 9090（实为 9001）、macOS/Windows 页写 7001、`developer/mcp.md` 的 `crates/mcp` 已从上游仓库消失导致构建命令必败、scanner 指标名全部对不上、EC 读写仲裁公式与实现不符。

## 逐项核对表（按文档文件分组，摘录全部非 ✅ 项及关键 ✅ 项）

### installation/linux/quick-start.md
| 位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| L25 | 安装脚本 URL | README.md:101 一致 | ✅ |
| L29 | 默认端口 9000 | `crates/config/src/constants/app.rs:255` | ✅ |
| L40 | "确认内核支持 IO-Uring" | `scripts/check_no_tokio_io_uring.sh:1-14` 明确**禁用** tokio io-uring 后端 | ❌ 删除该检查项 |

### installation/linux/single-node-single-disk.md（SNSD）
| 位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| L215-224 | `/etc/default/rustfs` + 各 env | `deploy/build/rustfs.service:22`；cli.rs:176-237 | ✅ |
| L247-254 | `ExecStart=rustfs $RUSTFS_VOLUMES` 旧式调用 | cli.rs:61-97 legacy 兼容层支持；上游推荐 `rustfs server` | ✅（建议对齐上游） |
| L179 | "默认启动账户 root/root" | 上游模板 `User=rustfs/Group=rustfs`（rustfs.service:13-14） | ⚠️ |
| L324 | 控制台默认 9001 | app.rs:263 | ✅ |

### installation/linux/{snmd,mnmd}.md
`RUSTFS_VOLUMES="/data/rustfs{0...3}"`（三点花括号展开，`crates/utils/src/string.rs:248-453`）✅；MNMD "默认 12+4"（≥8 盘默认 parity=4，`crates/ecstore/src/config/storageclass.rs:24-31`）✅。

### installation/docker/index.md
| 位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| L22 | 宿主机 `/etc/rustfs/config.toml`（"见第 4 节"） | 全仓库无 config.toml 支持；第 4 节实为"验证与访问" | ❌ 删除 |
| L24 | 非 root 用户 uid 10001 | Dockerfile:100-101 | ✅ |
| L30 | "官方 **Ubuntu** 基础镜像" | Dockerfile:15,73 为 `alpine:3.23.4` | ⚠️ 改 Alpine |
| L217-228 | 单独装 rustfs 需注释 `depends_on` | compose 现为 `required: false`，**无需修改** | ⚠️ 更新 |

### installation/{macos,windows}/index.md
控制台 `http://127.0.0.1:7001`——服务端控制台默认 `:9001`（app.rs:263-269）；7001 在源码零命中。⚠️ 若指桌面 GUI 包需注明；若指 rustfs server 应为 9001。

### installation/checklists/*
| 位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| security:52 | "Console (port **9090**)" | 9001（app.rs:263）；9090 是 compose 里 Prometheus | ❌ |
| network:72 | "TCP 7946 (Serf)" | RustFS 无 Serf/gossip；节点间走 S3 端口内部 RPC | ❌ 删除 |
| network:73 | "UDP 4789 (VxLAN)" | 与 RustFS 无关 | ⚠️ |
| network:88 | `iperf3 -s 8972 <ip>` | 语法错误（`-s` 为 server 模式） | ❌ 改 `iperf3 -c` |

### integration/*
| 文件:位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| tls:15 | 证书命名 `rustfs_cert.pem/rustfs_key.pem` | app.rs:71-75 | ✅ |
| tls:37,55 | TLS 后经 `:9001` 访问"实例" | 9001 是控制台，S3 API 是 9000 | ⚠️ 区分 |
| tls:47 | docker 示例缺行尾 `\` | — | ❌ |
| virtual:44-58 | `RUSTFS_SERVER_DOMAINS` 示例带 `:9001` | http.rs:623-632 自动追加 host:S3端口变体；9001 是控制台端口 | ⚠️ 示例改 9000 |
| nginx:183-199 | `location /api` 直接 proxy_pass 不去前缀 | rustfs 无 `/api` 前缀概念，请求会被当成名为 `api` 的桶 | ❌ |

### administration/iam/*
用户/组/策略/服务账号 admin API 完整存在（handlers/user.rs、group.rs、policies.rs、service_account.rs）✅——文档反而只写了 Access Key 一项。

### developer/mcp.md
| 位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| L37 | `cargo build --release -p rustfs-mcp` | 当前 main workspace **无 rustfs-mcp**，`find -iname "*mcp*"` 零命中 | ❌ 整页失效 |
| L125,132 | `crates/mcp/Dockerfile` 及 GitHub 链接 | 目录不存在，链接 404 | ❌ |

### management/object/scanner.md
| 位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| L17 | 1/1024 哈希抽样 | `crates/scanner/src/scanner_folder.rs:79` | ✅ |
| L31 | 指标 `rustfs_scanner_jobs_total` 等三个 | 真实指标为 `rustfs_scanner_objects_scanned_total`、`rustfs_scanner_cycles_total`、`rustfs_scanner_cycle_duration_seconds` 等；文档三个名**均不存在** | ❌ |
| L31 | "Prometheus 数据模型暴露" | 无原生 /metrics；经 OTLP 推送（`RUSTFS_OBS_ENDPOINT`）；admin `/rustfs/admin/v3/metrics` 为 JSON | ⚠️ |

### troubleshooting/*
| 文件:位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| healing:46 | "默认不做深度 bitrot 检查" | 默认**每 30 天**一周期（`DEFAULT_SCANNER_BITROT_CYCLE_SECS`，constants/scanner.rs:166） | ⚠️ |
| healing:53-65 | `rc admin heal start/status/stop` | 无 `rc` 工具；heal 走 admin API（handlers/heal.rs）与控制台 | ❌ |
| driver:49 | `mkfs.ext4` 换盘 | 与全站"强制 XFS、避免 ext4"矛盾 | ⚠️→❌ |
| driver:62 | "`config.yaml`" | 无 yaml 配置支持 | ❌ |
| driver:116-126 | `rustfs-admin disk status/heal`（自称 hypothetical） | 无此二进制；唯一 CLI 是 `rustfs`（server/info/tls，cli.rs:59） | ❌ |
| driver:136 | `/var/log/rustfs/heal.log` | 无独立 heal.log；日志统一 obs | ❌ |
| node:42 | `config.yaml` 节点列表 | 拓扑由 `RUSTFS_VOLUMES` 定义 | ❌ |
| node:50-53 | `systemctl start rustfs-server` | 服务名是 `rustfs` | ❌ |
| node:60-67 | `rc cluster status` / `rc heal --node` | 虚构 CLI | ❌ |

### upgrade-scale/availability-and-resiliency.md
| 位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| L10 | 多 pool 空格分隔 | cli.rs:179 `value_delimiter=' '` | ✅ |
| L130 | `1.0.0-alpha.67/...-latest.zip` | 发布资产名为 `...-v${version}.zip`（build.yml:437-438），版本目录配 latest 自相矛盾 | ⚠️ |
| L144 vs L219 | `node-{1...4}`（带连字符）vs `node{5...8}`（无） | 两处主机名模式不一致，集群拓扑对不上 | ❌ |
| L240,265 | `rustfs-admin metrics/rebalance start` | 虚构 CLI；rebalance 仅 admin API/控制台（handlers/rebalance.rs） | ❌ |

### concepts/limit.md
| 位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| L14 | 单次 PUT 上限 **500 GiB** | `MAX_SINGLE_PUT_OBJECT_SIZE = 5 GiB`（client/constants.rs:29）；500 GiB 是 MinIO 文档数字 | ❌ |
| L12,15,16 | 5 TiB 分片上限 / 10000 分片 / 5MiB-5GiB | 常量逐一吻合 | ✅ |
| L23 | 1 万版本"可配置" | 常量 `DEFAULT_OBJECT_MAX_VERSIONS=10000`，未见配置 env | ⚠️ |
| L38 | 读仲裁 = N/2 | `read_quorum = n - parity`（metadata.rs:111） | ❌ |
| L39 | 写仲裁 = N/2+1 | `write_quorum = data`（data==parity 时 +1，set_disk/mod.rs:1587-1590） | ❌ |

### concepts/principle/erasure-coding.md
| 位置 | 文档声称 | 源码事实 | 判定 |
|---|---|---|---|
| L111 | 分片校验哈希 **Blake3** | 默认 `HighwayHash256S`（bitrot.rs:692、fileinfo.rs:149） | ❌ |
| L119-125 | SIMD/AVX2 加速 RS | `reed-solomon-erasure(simd-accel)` + `reed-solomon-simd` | ✅ |
| L19 | 运行时调整 (k,m) | 经 `RUSTFS_STORAGE_CLASS_STANDARD`，仅对新对象生效 | ⚠️ 补充说明 |

## 能力声称核对（features vs 源码）

| 能力 | 结论 |
|---|---|
| 版本控制（三态/delete marker/对象锁联动） | ✅ 已实现（但 "需 EC 且至少 4 盘" 无代码依据 ❌） |
| 对象锁 WORM 全套 | ✅ 已实现 |
| WORM 页称"复制不传输保留设置" | ❌ 代码明确传输（replication_target_boundary.rs:212-227），且与 replication 页自相矛盾 |
| 桶级双活复制 | ✅ 已实现 |
| 生命周期/分层 | ✅ 已实现，且文档**少列**了后端（源码有 S3/Azure/GCS/MinIO/RustFS/阿里/华为/腾讯/R2 九种 tier） |
| SSE-S3 / SSE-KMS / SSE-C | ✅ 已实现 |
| KMS 后端 = AWS KMS/Google SM/Azure KV/Thales/Fortanix | ❌ 仅 local / vault / vault-transit（cli.rs:264-266） |
| KES 为 SSE-S3 必需组件 | ❌ 虚构（MinIO 文案残留），出现在 encryption + 6 个平台页 |
| RustFS Kubernetes Operator / Tenant | ❌ 仅有 Helm chart，无 Operator 代码（9 个页面引用） |
| 事件通知目标含 Elasticsearch、NSQ | ❌ 真实目标：amqp/webhook/kafka/mqtt/mysql/nats/postgres/**pulsar**/redis（targets/mod.rs:409-419）——ES、NSQ 不存在，Pulsar 漏列 |
| Prometheus 原生指标端点 | ❌（logging 页同页自相矛盾，L38 的"没有"才是对的） |
| LogSearch（PostgreSQL） | ❌ 虚构 |
| S3 Select（CSV/JSON/Parquet） | ✅ 已实现（s3select-api/query） |
| 审计 webhook | ✅ 已实现 |
| 位腐检测 + 自动修复 | ✅ 已实现 |
| 小文件"缓存节点集群、一致性哈希" | ⚠️ 夸大（实际是单机对象体缓存引擎 object-data-cache） |
| 服务器联邦/全局命名空间 | ❌ 未见于源码 |
| HDFS/NFS/POSIX 多协议 | ❌ 虚构；真实协议是 **FTPS、SFTP、WebDAV、Swift**（crates/protocols）——文档反而从未提及 |
| RDMA/GPU Direct、区块链存证、磁光电混合介质 | ❌ 虚构 |
| MinIO env 兼容（`MINIO_ROOT_USER` 等自动映射） | 源码有完整映射（envs.rs:122-184），**文档遗漏**，建议补充 |
| 默认凭证 rustfsadmin/rustfsadmin | ✅（credentials/constants.rs:21,28；文档用占位符做法安全，但应在快速上手处明示） |

## 高风险误导项 Top 10（照做会翻车）

1. **虚构 CLI 工具族 `rc` / `rustfs-admin`**（healing、node、driver、availability-and-resiliency 四处）——上游唯一二进制是 `rustfs`。排障时命令 100% 失败，且发生在数据故障高压场景。
2. **`developer/mcp.md` 整页失效**——构建命令与链接指向已从 main 移除的 crate。
3. **不存在的配置文件**：config.toml（docker 页）、config.yaml（node/driver 页）。
4. **security-checklists.md:52 控制台端口 9090**（实为 9001）。
5. **features/encryption 的 KES + 6 种不支持的 KMS 后端**。
6. **扩容文档主机名前后不一致**（`node-{1...4}` vs `node{5...8}`）——集群无法组成。
7. **limit.md 读写仲裁公式错误**——据此估算容错会得出危险结论。
8. **scanner.md 三个监控指标名不存在**——按文档配告警永远无数据。
9. **nginx.md `/api` 前缀直传后端**——S3 请求被解析成访问名为 `api` 的桶。
10. **服务名漂移 `rustfs-server`** + tls 页缺行续反斜杠 + WORM 复制声称与代码相反。

**附带建议（正向遗漏）**：文档未提及源码已具备的 FTPS/WebDAV/SFTP/Swift 协议、MINIO_*/RUSTFS_ROOT_* 兼容变量、`rustfs tls` 诊断子命令、`RUSTFS_KMS_*` 全套参数与 9 种 tier 后端——值得补文档。
