# 专项评审 · 生产就绪度（运维/SRE 视角）

> 对照基准：rustfs/rustfs 上游源码（main 分支浅克隆），引用格式为 `file:line`。
> **总体结论：按现有文档，一个有经验的 SRE 无法独立、安全地把 RustFS 运营到生产。** 安装主线（Linux MNMD、Docker）大体可用，但 Day-2 运维文档（升级、扩容、换盘、换节点、修复）有大量**凭空虚构的 CLI 命令与配置文件**（文档自己写着 "hypothetical"/"assuming"），K8s 生产部署文档是一个 7 行的翻译占位符，而上游实际有完整的 Helm chart 和多篇高质量 ops runbook 未被搬运。

## 生产就绪度评分卡

| # | 阶段 | 得分 /5 | 关键证据 |
|---|------|--------|---------|
| 1 | 容量规划与硬件选型 | **2** | 有真实数字但互相矛盾：内存最低值三处不一致（`hardware-selection.md:31` 64GB / `multiple-node-multiple-disk.md:112` 128GB / `hardware-checklists.md:37` 64GB）。**没有任何 EC 开销/可用容量计算**；上游默认奇偶校验规则（`crates/ecstore/src/config/storageclass.rs:24-31`，≥8 盘默认 EC:4）完全未被引用。`network-checklists.md:69-74` 要求开放 "TCP 7946 (Serf)、UDP 4789 (VxLAN)"——RustFS 源码中不存在 Serf/VxLAN，是从别的系统抄来的废料；`:88` 的 `iperf3 -s 8972 <target IP>` 语法本身是错的 |
| 2 | 生产部署（MNMD + K8s） | **2** | Linux MNMD 约 3.5/5：流程完整，"12+4 默认"与上游默认 parity 一致；但 systemd 用 `User=root`（:284，上游模板用 `rustfs`）、`TimeoutStartSec=30s`（:300，上游刻意 120s）、防火墙只开 9000。**K8s 0/5**：`installation/cloud-native/index.md` 全文 7 行占位符；上游 `helm/rustfs/` 是成熟 chart（StatefulSet 分布式、多 Server Pool 扩容、PDB、反亲和、cert-manager mTLS、`/health`+`/health/ready` 探针、凭据防呆），文档对 Helm 只字未提 |
| 3 | 安全加固 | **1.5** | TLS 变量与源码一致 ✓，但无多域名证书布局、无轮换、无节点间 mTLS。IAM 只有一篇 UI 截图操作；上游 admin API 有 policies/group/service_account/STS/OIDC（含 Keycloak、Authing runbook），**策略语法、用户/组、服务账号、STS 全部无文档**。未提 `RUSTFS_ACCESS_KEY_FILE`/`RUSTFS_SECRET_KEY_FILE`（`entrypoint.sh:181-184`）、`RUSTFS_RPC_SECRET`。文档还建议 root 运行（MNMD:213）并首选"关闭防火墙"（:70-75） |
| 4 | 可观测性 | **1.5** | `features/logging/index.md` **同页自相矛盾**（:20 声称有 Prometheus 端点，:38 又说没有；后者才对——遥测走 OTLP，`rustfs/src/admin/handlers/metrics.rs:18` 明确 NDJSON 非 Prometheus 文本）。该页还引用不存在的 "RustFS Kubernetes Operator"、`mc admin trace`、LogSearch。`scanner.md:31` 列出的指标名 `rustfs_scanner_jobs_total` 等**源码中不存在，照此配告警 = 永远不告警**。上游约 40 个 `RUSTFS_OBS_*` 变量、`/health` 探针、`/v3/scanner/status` 文档只覆盖 1 个变量。无监控搭建教程、无告警建议 |
| 5 | Day-2 运维 | **1** | **无升级文档**（`upgrade-scale/index.md:9-12` 裸列表；上游有完整 rolling-restart runbook）。扩容文档含致命主机名不一致（见危险项 #2）与"禁止滚动重启"的错误一般化（#3）。**Pool 退役/rebalance 上游支持（admin handlers pools/rebalance、decommission compose、helm 工作流），文档为零**。换盘教程用 ext4（#1）。换节点用不存在的 config.yaml、`rustfs-server` 服务名、`rc cluster status`。备份/DR 除营销页外无流程 |
| 6 | 事件响应 | **1** | 排障仅 3 页且多虚构命令。未覆盖（上游多已有答案）：冷启动/法定数丢失 503 降级语义（`x-rustfs-readiness-pending`、"不要 restart-loop"）、启动失败排查（端口占用/卷不存在/凭据为空）、磁盘写满、时钟漂移、反代 SigV4 失败（上游 reverse-proxy.md 整页）、日志字段解读、版本堆积告警、慢盘画像（`RUSTFS_TIMEOUT_PROFILE`）、console CORS |
| 7 | 参考完整性 | **1** | 全文档只出现 13 个 `RUSTFS_*` 变量，上游仅运维强相关的就有 60+（SCANNER 15+、OBS 40、KMS、DURABILITY_MODE、ERASURE_SET_DRIVE_COUNT、RPC_SECRET…）——**无任何参考页**。`rustfs server/info/tls` 子命令无文档；`rc` 客户端无任何文档。无端口一览且 `security-checklists.md:52` 把控制台写成 9090（实为 9001）。上游有量化 S3 兼容矩阵（452 implemented / 17 unimplemented / 273 excluded）并明确不声称全覆盖；文档到处宣称 "100% S3 compatible" |

## 危险/错误运维指导（按严重度排序）

1. **换盘格式化成 ext4——在全 XFS 集群里制造异构文件系统**。`troubleshooting/driver.md:49` `mkfs.ext4 /dev/sdb -L DISK1`（:69 fstab 同）；安装文档明确要求全 XFS 并"避免 ext4"。挂载点 `/mnt/disk1` 也与安装布局 `/data/rustfs{0..3}` 对不上，照抄会把新盘挂到集群不识别的路径，heal 永远不会发生。正确：`mkfs.xfs` + 挂回原挂载点 + 自动 heal（`crates/heal/src/heal/manager.rs:1246` 确认存在 unformatted-disk 自动修复）。

2. **扩容文档新旧节点 RUSTFS_VOLUMES 不一致——按文档操作会全集群无法启动**。`availability-and-resiliency.md:144`（新节点）写 `http://node-{1...4}…`（带连字符），:219 给旧节点 sed 追加的是 `http://node{5...8}…`（无连字符），MNMD 基线本就无连字符。执行"全节点同时重启"后端点集合不一致，**集群拓扑校验失败 = 全量停机**。正确：所有节点 `RUSTFS_VOLUMES` 逐字节一致，加"diff 所有节点 env 文件"校验步骤。

3. **"禁止滚动重启"的一般化错误——与上游官方 runbook 和自家安全清单直接冲突**。`availability-and-resiliency.md:247` "Rolling Restart Prohibited: Must restart all nodes simultaneously"；上游 `docs/operations/rolling-restart.md:14-16` 明确滚动重启（一次一台、等 `/health/ready`）是零停机标准做法；`security-checklists.md:71` 自己也写 "Use the rolling restart process for zero-downtime upgrades"。正确：仅"改 RUSTFS_VOLUMES 加 pool"需全节点重启；升级/参数变更走滚动重启。

4. **systemd `Type=notify` + `TimeoutStartSec=30s`——冷启动/慢盘场景系统性触发 kill-restart 循环**。源码在 storage quorum + IAM + lock quorum + peer health 全就绪后才发 `READY=1`（`rustfs/src/server/readiness.rs:268-292`），就绪等待默认上限 120s；上游单元特意 `TimeoutStartSec=120s` 并写注释（`deploy/build/rustfs.service:40-43`）。全集群同时重启时每台都在等对端，30s 大概率等不齐 → systemd 杀掉重启 → 集群反复震荡。

5. **虚构的管理命令贯穿全部故障处理文档——事故现场无工具可用**。`driver.md:116`（自称 "hypothetical rustfs-admin tool"）、`node.md:56-67`（`rc cluster status`/`rc heal --node`）、`healing.md:53-66`（`rc admin heal start --all`）、`availability-and-resiliency.md:240,265`（`rustfs-admin metrics`、`rustfs-admin rebalance start`）。上游存在的是 admin HTTP API 和 `rc` 客户端（helm README 提及 `rc admin pool/rebalance/decommission` 形态）。凌晨三点按文档敲命令全部 command not found。

6. **换节点文档指向不存在的服务名与配置文件**。`node.md:42` 检查 "config.yaml 中的 endpoints"——RustFS 纯环境变量驱动，无 config.yaml；:50-53 用 `systemctl start rustfs-server`，全部安装文档的单元名是 `rustfs`。

7. **控制台端口写错（9090）+ 防火墙指导不完整**。`security-checklists.md:52` "Console (port 9090)"——真实默认 9001（`crates/config/src/constants/app.rs:263`）。`multiple-node-multiple-disk.md:77-84` 只放行 9000 却在 :255 启用控制台。:70-75 还把"直接关闭 firewalld"列为第一选项。

8. **Nginx "Dedicated DNS" 示例：443 无 TLS 配置，S3 API 挂在路径前缀下**。`integration/nginx.md:166-171` `listen 443; http2 on;` 但无 `ssl` 与证书指令；:183-199 把 S3 代理到 `/api` 前缀——SigV4 客户端不显式带路径会全部签名失败（上游 reverse-proxy.md 强调必须逐字节保留签名材料）。照抄即得 "403/Bucket not found" 生产事故。

9. **虚拟主机文档用控制台端口举 S3 例子**。`integration/virtual.md:44-58` `RUSTFS_SERVER_DOMAINS="rustfs.yourdomain.com:9001"` 并演示 `http://test.rustfs.yourdomain.com:9001/`——9001 是控制台端口，S3 virtual-host 应指 9000。读者把 SDK endpoint 配到 9001 全部失败。

10. **healing/scanner 机制描述误导容量与性能决策**。`healing.md:37-39` 称每次 GET/HEAD 都"检查对象所有分片"（实际读路径只需法定数分片）；`scanner.md:27` 拿 Ceph 的 `osd_scrub_begin_hour` 类比（RustFS 无该能力，真实调优面是 `RUSTFS_SCANNER_*` 族）；`scanner.md:31` 三个 Prometheus 指标名源码中不存在。

11. **营销页虚构 "RustFS Kubernetes Operator" 与 "KES" 组件**。`features/logging/index.md:22,30,38`、`features/encryption/index.md:52,64-72`（"KES 是 SSE-S3 必需组件"）、`features/cloud-native/index.md:33`——上游只有 Helm chart，无 Operator；KMS 是内置 vault 集成，无独立 KES 服务。架构师按文档会规划出依赖不存在组件的方案。

## 与上游部署物料的差距

### Helm / Kubernetes（上游有、文档无）
- 完整 chart：standalone（Deployment）+ distributed（StatefulSet 默认 4 副本）
- 多 Server Pool 扩容（append-only、扩容期间 crash-loop 属预期、完成后需 `rc admin rebalance start`）
- PDB、必需反亲和、topologySpreadConstraints
- 探针 `/health`（liveness）与 `/health/ready`（readiness）——两个健康端点在整个 docs 站内**零次出现**
- 凭据防呆（默认拒绝渲染除非提供非默认 AK/SK）
- cert-manager mTLS 节点间加密、Ingress、Gateway API
- 明示坑：默认 PVC 只有 **256Mi**、要求 ≥ 1.0.0-alpha.69

### Docker Compose
- 文档真实覆盖 observability profile ✓、`chown 10001:10001` ✓（全站与上游对齐最好的一页）
- 未覆盖：`*_KEY_FILE` secrets 注入、healthcheck 写法、`RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS`、decommission 演练 compose

### systemd / 裸机
- 文档单元派生自上游模板但三处劣化：`User=root`（上游 `rustfs`）、`TimeoutStartSec=30s`（上游 120s）、丢掉 `ProtectSystem=full`+`ReadWritePaths`
- 上游 `deploy/config/rustfs.env` 是权威 env 模板，docs 未引用
- 上游 ops runbook 完全未进入文档站：rolling-restart、durability-modes（`RUSTFS_DURABILITY_MODE` 掉电语义表）、scanner-runtime-controls、tier-ilm-debugging、reverse-proxy、sftp、keycloak/authing-oidc、nats-jetstream、decommission-compatibility

## 缺失的运维文档清单（按优先级）

**P0（阻塞生产上量）**
1. Kubernetes/Helm 生产部署指南（替换 cloud-native 占位符）
2. 升级 runbook（滚动重启 + `/health/ready` 门控 + 回滚）
3. 环境变量参考大全（运维相关 60+ `RUSTFS_*`，含默认值/单位）
4. 换盘/换节点 runbook 重写（修 ext4/假命令/假服务名）
5. 监控与告警搭建指南（OTLP → collector → Prometheus/Grafana、`/health`、明确"无原生 /metrics"、建议告警项）

**P1（显著降低运维风险）**
6. 法定数丢失与冷启动排障
7. Pool 退役与再均衡指南
8. IAM 参考（用户/组/策略 JSON/服务账号/STS/OIDC）
9. KMS/SSE 实操（替换 KES 营销文）
10. 凭据管理（`*_KEY_FILE`、轮换、`RUSTFS_RPC_SECRET`）
11. 反向代理/负载均衡权威指南（移植上游 reverse-proxy.md，修 nginx.md）

**P2（补全参考面）**
12. 端口与网络矩阵（清除 Serf/VxLAN 废料与 9090 错误）
13. 持久化模式文档（durability modes 掉电语义）
14. Scanner 调优（真实 `RUSTFS_SCANNER_*` 表替换虚构内容）
15. S3 兼容性矩阵（对齐上游 452/17/273 口径，停用 "100% S3 compatible"）
16. `rc` CLI 参考（或明确其发布状态）
17. 备份/DR 与桶复制实操
18. 容量规划计算器修订（EC 开销公式、write quorum、统一内存口径）
