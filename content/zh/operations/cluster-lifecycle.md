---
title: "集群生命周期运维"
description: "安全地规划、启动、扩容、再平衡、退役、修复和重启纠删码 RustFS 集群，法定数量与存储类行为均经过验证。"
---

本运行手册是纠删码 RustFS 部署的运维入口：布局边界、存储类与法定数量、零冗余模式、扩容、数据再平衡、退役、修复、磁盘更换与重启。文中描述的所有行为均已对照 RustFS 源码验证；引入该内容的上游文档见 [rustfs/rustfs#7998](https://github.com/rustfs/rustfs/pull/7998)。

相关任务页面：[存储池扩容](./scaling/storage-pool-expansion.md)、[数据再平衡](./scaling/data-rebalancing.md)、[存储池退役](./scaling/storage-pool-decommission.md) 和 [节点修复](./high-availability/node-healing.md)。

## 布局边界

存储池的端点数量、集合数量、每个集合的磁盘数以及在存储池列表中的位置都是持久化布局。启动时 RustFS 会将存储的格式与配置的磁盘数和集合宽度进行比对，如果不匹配则以 `PoolTopologyMismatch`（单磁盘部署为 `UnsupportedSnsdExpansion`）永久失败，而不是自动迁移。请恢复原始端点和集合宽度；不要通过删除 `format.json` 绕过该错误。

:::warning[切勿执行以下操作]

- 用更多或更少的端点覆盖已有存储池，或对已初始化的存储池修改 `RUSTFS_ERASURE_SET_DRIVE_COUNT`。
- 重新排列卷参数顺序，或将磁盘目录移动到其他槽位。
- 手工删除、复制或重命名对象分片、`xl.meta` 或 `.rustfs.sys` 下的任何内容。
- 把手工文件复制当作数据迁移。只有再平衡和退役会在对象锁保护下移动对象，并带版本复核与源端清理。

:::

运行时角色：

- **存储池（Pool）** —— 一份具有持久化布局的端点列表。多磁盘集合包含 2 到 16 块磁盘；单个本地路径是唯一的单磁盘布局。
- **存储池主节点（Pool leader）** —— 存储池的第一个端点。退役的启动、取消和清除可以发送到任意节点；请求会通过认证的节点间 RPC 转发给存储池主节点。
- **集群级状态** —— 再平衡与根修复会向对等节点传播，并在重启后从持久化元数据中恢复。

## 规划与首次启动

1. 按节点、机柜、电源和网络故障域规划端点。拓扑准入不是高可用保证：单节点存储池会随宿主机丢失全部分片，启动时会对每个多磁盘集合记录 `host_failure_data_unavailable` 警告。
2. 为每个存储池选择集合宽度。各存储池宽度可以不同，但每个池必须均匀切分为同一宽度的集合（宽度取 2 到 16）；`RUSTFS_ERASURE_SET_DRIVE_COUNT` 只能固定一个已有效的宽度，别无他用。
3. 按[存储类](#存储类奇偶校验与法定数量)一节的规则选择 STANDARD 和 RRS 奇偶校验，然后按最窄的存储池验证，因为显式奇偶校验必须适配每一个存储池。
4. 记录完整的启动命令、端点顺序、存储池顺序、集合宽度和存储类变量。它们在每个节点上、每次重启时都必须完全一致。
5. 让 RustFS 独占使用每个端点路径。

卷来自位置参数或 `RUSTFS_VOLUMES`；不带参数的 `rustfs` 等价于使用环境变量卷的 `rustfs server`。省略号展开遵循 MinIO 模式：

```bash
# one pool, four nodes, four drives each: sixteen endpoints
rustfs server http://node{1...4}:9000/data{1...4}

# two pools; every argument must carry an ellipsis once there is more than one
rustfs server http://node{1...4}:9000/data{1...4} http://node{5...8}:9000/data{1...4}
```

参数多于一个时，每个参数都必须带省略号；每个存储池必须展开为至少两个不同的磁盘端点；单磁盘存储池不能加入多存储池部署；`{3...3}` 这类单元素区间不能绕过最小值要求。

存储类错误会在触碰任何磁盘之前终止启动。随后启动流程依次初始化本地磁盘、锁客户端和格式法定人数。

## 启动配置

| 变量 | 作用 | 边界 |
|---|---|---|
| `RUSTFS_ERASURE_SET_DRIVE_COUNT` | 固定集合宽度 | 必须是存储池的有效对称因数，最大 16；不能更改已初始化的存储池 |
| `RUSTFS_STORAGE_CLASS_STANDARD` | STANDARD 奇偶校验，格式 `EC:<n>` | 按存储池验证；只影响新写入 |
| `RUSTFS_STORAGE_CLASS_RRS` | RRS 奇偶校验，格式 `EC:<n>` | 按存储池验证；显式值在单磁盘上会失败，持久化的默认值 `EC:1` 在单磁盘上解析为 `0` |
| `RUSTFS_STORAGE_CLASS_OPTIMIZE` | 为兼容 MinIO 而接受 | 仅存储、当前未使用：运行时不产生任何效果 |
| `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` | 固定的每分片内联上限（字节大小语法，如 `128KiB`） | 替代[内联对象](#内联对象)中的按比例默认值；超过 128 KiB 会记录警告 |

空的 `RUSTFS_STORAGE_CLASS_STANDARD` 或 `RUSTFS_STORAGE_CLASS_RRS` 会恢复自动策略并覆盖持久化的值。当 `RUSTFS_` 名称未设置时，这些键以及 `ERASURE_SET_DRIVE_COUNT`、`VOLUMES` 的 `MINIO_` 前缀写法会映射到 `RUSTFS_` 名称；两者同时设置时 `RUSTFS_` 值优先，并在启动时报告冲突。

其他数据迁移与列举相关的旋钮：`RUSTFS_REBALANCE_MAX_ATTEMPTS`（默认 3）、`RUSTFS_DECOMMISSION_BUCKET_CONCURRENCY`（默认上限 4）、`RUSTFS_DECOMMISSION_ENTRY_CONCURRENCY`（默认上限 8，硬上限 64）、`RUSTFS_LIST_OBJECTS_QUORUM`（默认 `optimal`；接受 `disk`、`reduced`、`optimal`、`auto`，其他取值一律视为 `strict`）。它们都不会放宽对象法定数量、对象锁或版本检查。

## 存储类、奇偶校验与法定数量

### 几何结构

每个对象在一个集合的 `N` 块磁盘上做 Reed-Solomon 编码，得到 `K` 个数据分片和 `M` 个校验分片，`N = K + M`；任意 `K` 个分片即可重建对象。几何结构按对象存储在 `xl.meta` 中，因此之后修改默认值不会重写任何已有对象。对象哈希到某个集合，分片在集合内轮转；集合之间不共享故障预算。

各集合宽度的默认 STANDARD 奇偶校验：1 块磁盘为 0，2 到 3 块为 1，4 到 5 块为 2，6 到 7 块为 3，8 到 16 块为 4。默认 RRS 奇偶校验为 1（单磁盘为 0）。

校验规则：每个存储池的奇偶校验最多为 `N/2`；只有当两者均非零时，才要求 STANDARD 奇偶校验不小于 RRS。没有最小值限制，因此 `EC:0` 在任何宽度上都合法。PUT、CopyObject 和 CreateMultipartUpload 只接受 `STANDARD` 和 `REDUCED_REDUNDANCY`；其他 AWS 存储类返回 `InvalidStorageClass`。

### 法定数量与容量

```text
usable capacity  ≈ raw × K / N
read quorum      = K            (metadata vote and shard decode)
write quorum     = K, or K + 1 when K == M
delete markers   = N/2 + 1      (majority, both write and vote)
```

十六块磁盘、`EC:4`：`K = 12`，约 75% 可用，容忍四个故障，读取需要十二个有效分片。两块磁盘、`EC:1`：`K = M = 1`，因此一块磁盘离线仍可读，但不能再写。`.rustfs.sys` 下的内部元数据始终以 `N/2` 的奇偶校验写入，与配置的存储类无关。

### 内联对象

当每个分片都不超过每分片预算时，对象会内联存储在 `xl.meta` 中。默认预算为 `256 KiB / K`，上限为每分片 128 KiB，因此更宽的集合不会提高最大内联对象大小；在启用了版本的存储桶上预算再除以 8。`RUSTFS_STORAGE_CLASS_INLINE_BLOCK` 用固定的每分片上限替代按比例的默认值。每块磁盘只内联自己的分片，因此内联数据与外部分片具有相同的丢失语义。压缩或加密的流只有在存储大小已知且在预算内时才会内联。

### 写入与读取路径

写入按存储池解析布局，以 1 MiB 块做 Reed-Solomon 编码，写入带 bitrot 保护的分片，只有在达到写入法定数量后才提交。低于法定数量的写入永远不会被报告为成功。读取在读取法定数量下挑选权威元数据，校验 bitrot，从至少 `K` 个分片解码，低于该值则直接失败；在缺少分片情况下成功的读取会加入读修复队列。分片上传的各个部分使用对象的几何结构与写入法定数量；`CompleteMultipartUpload` 会复核元数据与提交法定数量，因此已上传的 part 不等于已提交的对象。

## 零冗余模式（EC:0）

`EC:0` 可用于 STANDARD、RRS 或两者，适用于任何集合宽度。它提供原始容量，不提供冗余。

:::danger[EC:0 意味着一块磁盘的损失等于整个集合的损失]

除非集合之外还有副本，被更换或被清空的磁盘会永久丢失其上拥有分片的所有零冗余对象。修复无法重建零冗余对象：修复会对其报告 `no-parity object is unrecoverable`。生产部署应使用 `EC:1` 或更高；一旦集合跨越多个节点，通常应以每集合 `EC:2` 或更高为底线。只在外部层（RAID、复制、备份或可重建的数据源）负责持久性与可用性、并经过明确批准的前提下使用 `EC:0`。

:::

行为细节：

- **配置。** 显式 `EC:0` 不会产生启动警告——零冗余警告只针对自动零奇偶校验（即单磁盘存储池）触发。`STANDARD=EC:2` 搭配 `RRS=EC:0` 是合法的，因为任一侧为零时会跳过排序规则；此时只有以 `x-amz-storage-class: REDUCED_REDUNDANCY` 写入的对象携带零冗余语义。
- **写入。** 写入法定数量为 `N`：集合中任何一块磁盘不可写，写入即以 `ErasureWriteQuorum` 失败，不提交任何内容。由于零冗余分片事后无法重建，写入路径会在提交前把每个刚写入的分片与其 bitrot 哈希比对，拒绝提交已经损坏的分片。
- **读取。** 读取法定数量为 `N`。集合中任何一块磁盘离线时，该集合中所有零冗余对象的 HEAD 和 GET 都会以 `ErasureReadQuorum` 失败。不存在降级读取。
- **删除。** 删除标记和版本删除使用多数派法定数量（`N/2 + 1`），因此在读写都失败的集合上删除仍可能成功。删除成功不代表集合健康。
- **一块磁盘离线时仍然可用的功能。** 存储桶操作、`.rustfs.sys` 元数据、删除标记以及满足列举法定数量的列举。集合中的其他一切都不可用，包括其对象的再平衡与退役——它们必须读取全部 `N` 个分片。
- **之后提高奇偶校验不会重写任何对象。** 修改后需要重新上传或服务端复制每个对象，才能重新获得保护。

## 启动后验证

只读管理检查：

```text
GET /rustfs/admin/v3/pools/list
GET /rustfs/admin/v3/pools/status?pool=<pool>[&by-id=true]
GET /rustfs/admin/v3/decommission/status[?pool=<pool>&by-id=true]
GET /rustfs/admin/v4/cluster/snapshot
GET /rustfs/admin/v4/runtime/capabilities
```

`pool` 是存储池的命令行，或配合 `by-id=true` 使用的从零开始索引。状态查询忽略未知参数；变更类查询会拒绝未知或重复参数以及 `true`/`false` 之外的 `by-id` 取值。

确认：存储池数量、每池端点数、每池集合数量与宽度、本地与远端端点，以及没有拓扑不匹配。

数据面检查：写入一个 STANDARD 对象和一个 RRS 对象；执行 GET、HEAD、范围 GET、CopyObject 和一次分片上传；在奇偶校验范围内让一块磁盘或一个节点离线，确认读取继续、写入符合法定数量表的行为；将其恢复，确认修复队列排空且 bitrot 错误停止；确认每个节点报告相同的存储池元数据和集群快照。

## 扩容

已有存储池无法原地增长，只能新增存储池：

1. 规划新池的节点、磁盘和故障域；每个新存储池需要至少两个磁盘端点和自己的有效集合布局。
2. 在每个节点上准备好空的、由 RustFS 独占的路径。
3. 在**每个**节点上把新池追加到启动参数末尾，保持已有存储池及其顺序、端点和集合宽度不变。单节点单磁盘部署无法扩容，请改用 S3 迁移。
4. 重启并按前述检查验证。
5. 新写入会分布在可用存储池上；旧对象留在原处。要移动它们，请启动再平衡。重启永远不会触发再平衡。

新增存储池不会为已有对象增加奇偶校验，也不会复制任何数据。跨池移动只有再平衡和退役两种途径。完整操作示例参见[存储池扩容](./scaling/storage-pool-expansion.md)。

## 数据再平衡

再平衡按使用率在存储池之间重新分布对象。前置条件：多于一个存储池（单池返回 `NotImplemented`）、没有正在运行或冲突的退役，且 `start` 或 `stop` 不带查询字符串。

```text
POST /rustfs/admin/v3/rebalance/start     → {"id": "<uuid>"}
GET  /rustfs/admin/v3/rebalance/status
POST /rustfs/admin/v3/rebalance/stop
```

状态报告包含每池的 `id`、`status`、`stopping`、`used`、`lastError`、`cleanupWarnings` 和 `progress`（对象数、版本数、字节数、剩余存储桶、当前桶与对象、已用时间、预计完成时间），以及 `stoppedAt` 和停止传播相关字段。

启动会向对等节点传播准入围栏和工作节点状态；传播失败会回滚到终态，并报告未回滚的对等节点。停止会关闭准入、停止本地与远端工作节点，并持久化停止状态。只有当没有存储池处于 active 或 stopping、`lastError` 为空或已解释、`cleanupWarnings` 已理解、停止传播已完成、且已迁移对象能从新存储池读取时，才认为再平衡结束。每池状态保存在 `rebalance.bin` 中；切勿通过删除它来解除阻塞。完整操作参见[数据再平衡](./scaling/data-rebalancing.md)。

## 退役

运维摘要——仅支持多存储池、非旧式（省略号）部署；其他情况返回 `NotImplemented`。进行中的再平衡会阻止启动。

```text
POST /rustfs/admin/v3/pools/decommission?pool=<a>[,<b>]      # by command line
POST /rustfs/admin/v3/pools/decommission?pool=1&by-id=true   # by index
GET  /rustfs/admin/v3/decommission/status[?pool=1&by-id=true]
POST /rustfs/admin/v3/pools/cancel?pool=1&by-id=true
POST /rustfs/admin/v3/pools/clear?pool=1&by-id=true
```

- 目标在持久化任何状态之前批量验证：未知、重复、active、queued 或 completed 的目标会被拒绝；failed 或 canceled 的目标必须先清除，除非其中还有未解决的列举条目——此时重新发起 start 就是重试路径。
- 条目状态：`queued` → `active` → `completed`、`failed` 或 `canceled`，持久化在 `pool.bin` 中。启动时恢复非终态条目，跳过终态前任。
- 处于任何退役状态的源池都会拒绝新的普通 PUT 和新的分片上传（暂存的 PUT 收到 `SlowDown`）；源池非终态期间，已存在的分片上传可以继续排空。
- `clear` 只删除 failed 或 canceled 的元数据，绝不会把数据移回来。
- 只有当条目为 `completed`、空闲版本与分层归属已收敛、且每个节点显示相同状态后，才能从启动参数中移除该池。在此之前不要拔出源盘，也不要用删除目录代替配置变更。

完整操作参见[存储池退役](./scaling/storage-pool-decommission.md)。

## 修复与磁盘更换

### 管理修复

```text
POST /rustfs/admin/v3/heal/                    # root: cluster, or one erasure set with pool+set
POST /rustfs/admin/v3/heal/<bucket>
POST /rustfs/admin/v3/heal/<bucket>/<prefix>
POST /rustfs/admin/v3/background-heal/status
GET  /rustfs/admin/v4/heal/replacement-recovery
```

JSON 请求体携带 `recursive`、`dryRun`、`remove`、`recreate`、`scanMode`、`updateParity`、`nolock`、`readRepair`、`pool` 和 `set`。处理规则：

- 根修复必须设置 `recursive=true` 或同时给出 `pool` 和 `set`；不带前缀的桶修复总是递归的，带前缀的修复遵循 `recursive`；
- `readRepair=true` 会以 `InvalidArgument` 被拒绝；
- `nolock` 在协议层被接受但始终被强制为 `false` ——管理修复总是获取对象命名空间锁，不存在锁旁路；
- `clientToken` 关联 start、status 和 stop；`forceStart` 与 `forceStop` 会与它相互校验，未知或重复的查询键会被拒绝。

修复从法定数量元数据中选择权威版本，当缺失分片超过奇偶校验可重建数量、或存储的几何结构与集合不匹配时拒绝修复。它与 PUT、删除、分片上传完成以及数据迁移共享 `(bucket, object)` 锁。

### 磁盘更换

1. 确认受影响集合的对象仍满足读取法定数量（`EC:0` 下不可能），并从存储池状态记录存储池索引、集合索引、槽位和故障磁盘的 UUID。
2. 在**相同**的端点和挂载路径上更换为属于 RustFS 的空文件系统。不要复制旧磁盘的目录；复制来的 `format.json` 会声明一个集合已经追踪的身份。
3. 将节点恢复上线。空磁盘不是格式法定人数成员，其槽位会保持离线，直到纠删码集合修复任务把格式写回原槽位并重建分片——当启动或磁盘扫描器观察到挂载身份变化时会记录自动更换意图并据此进行，或通过管理纠删码集合修复（带 `pool` 和 `set` 的 `POST /rustfs/admin/v3/heal/`）进行。
4. 观察 `GET /rustfs/admin/v4/heal/replacement-recovery`、后台修复状态、磁盘健康与 bitrot 计数。`idle` 队列或某个对象可读都不是完成的证明。
5. 当恢复对该实例报告 `completed`，且抽样对象的 `xl.meta` 和分片都已出现在新磁盘上时，更换才算完成。

如果集合丢失的磁盘数超过其奇偶校验，修复无法重建；请从复制、远程分层或备份恢复。更广泛的修复模型参见[节点修复](./high-availability/node-healing.md)。

## 重启与恢复

- **普通重启。** 没有进行中的拓扑变更、每个节点参数一致、每次一个节点。启动会重新加载存储池元数据、`rebalance.bin`、退役队列和修复恢复记录，并按主节点与属主规则恢复工作节点。
- **再平衡。** 先读取 `/rebalance/status`。在决定停止或重启之前，处理好 active 或 stopping 状态的存储池、`lastError`、清理警告和停止传播。不要删除 `rebalance.bin`。
- **退役。** 非终态条目会恢复；failed 和 canceled 条目在重启后保留，直到按允许路径清除或重试。
- **根修复。** 优雅关机会把未完成的集群修复持久化为 `.rustfs.sys` 下的 `root-heal-<task-id>.json`，并以相同任务 id 重放。无效、超大或不支持的记录会移动到隔离前缀并被跳过（带日志），直到运维人员处理。不要删除隔离标记，也不要复用任务 id。
- **非正常关机。** 当上一次运行留下标记时，修复管理器会为每个本地集合排队一次完整的纠删码集合修复；优雅关机会清除该标记。

## 互斥与禁止操作

| 操作 | 与再平衡并行 | 与退役并行 | 说明 |
|---|---|---|---|
| PUT、DELETE、分片上传完成 | 对象锁 | 源池拒绝新的发布 | 不要绕过存储池围栏 |
| 退役 | 再平衡运行期间被拒绝 | 串行队列 | 仅主节点可变更 |
| 再平衡 | 仅多存储池 | 退役运行或冲突期间被拒绝 | 不接受查询参数 |
| 管理修复 | 对象锁 | 只修复数据，不改变退役状态 | `nolock` 被忽略 |
| 磁盘更换 | 不能改变布局 | 避免在退役中的源池上进行 | 相同槽位、空磁盘 |

:::warning[禁止事项]

不要在再平衡或退役运行期间更改启动端点；不要删除 `.rustfs.sys`、`rebalance.bin`、`pool.bin` 或根修复记录；不要在同一存储池上同时进行手工修复、文件复制和磁盘更换；不要把 start 调用返回的 HTTP 200 当作完成。

:::

## 检查清单

- **启动或扩容后**：每个节点的端点与存储池顺序一致；拓扑与存储的格式一致；对等节点就绪；新端点唯一且由 RustFS 独占；GET、HEAD、范围 GET 和分片上传已验证。
- **再平衡后**：没有存储池处于 active 或 stopping；`lastError` 为空或已解释；`cleanupWarnings` 已处理；停止传播已完成；已迁移对象可读。
- **退役后**：状态为 `completed`；其他条目已按策略处理；源池拒绝新写入；空闲版本、分层归属和列举条目已收敛；拔盘前每个节点的启动参数已更新。
- **修复或更换后**：更换恢复为 `completed`；槽位与 UUID 正确；修复队列已排空；bitrot 计数不再增长；抽样的当前与历史版本可读；没有遗留的临时目录。

## rc 命令映射

`rc` 是 RustFS 命令行客户端（参见 [CLI 客户端（rc）](./rc.mdx)）；其 `expand` 命令组是 `rebalance` 的别名——服务端没有单独的 expand API。下面列出常用参数，其余请用 `rc admin <group> --help` 查看已安装版本的帮助。

```bash
rc alias set local http://localhost:9000 <your-access-key> <your-secret-key>
rc ping local
rc ready local --timeout 2
rc admin info cluster local
rc admin info disk local --offline
rc admin pool list local
rc admin pool status local 0 --by-id
rc admin rebalance start local
rc admin rebalance status local
rc admin rebalance stop local
rc admin decommission start local '/data/pool1/disk{1...4}'
rc admin decommission status local 1 --by-id
rc admin decommission cancel local 1 --by-id
rc admin decommission clear local 1 --by-id
rc admin heal start local --scan-mode deep
rc admin heal start local --bucket logs --prefix 2026/ --scan-mode deep
rc admin heal status local --client-token <TOKEN_FROM_START>
rc admin heal stop local --client-token <TOKEN_FROM_START>
```

| `rc` 命令 | 服务端路由 |
|---|---|
| `rc ping` / `rc ready` | `GET /health` / `GET /health/ready` |
| `rc admin pool list` / `status` | `GET /rustfs/admin/v3/pools/list` / `GET /rustfs/admin/v3/pools/status` |
| `rc admin rebalance …`（别名 `expand`） | `/rustfs/admin/v3/rebalance/*` |
| `rc admin decommission start` / `cancel` / `clear` | `POST /rustfs/admin/v3/pools/decommission` / `cancel` / `clear` |
| `rc admin decommission status` | `GET /rustfs/admin/v3/decommission/status` |
| `rc admin heal start` / `status` / `stop` | `/rustfs/admin/v3/heal/*`、`POST /rustfs/admin/v3/background-heal/status` |

`rc admin heal start` 暴露 `--bucket`、`--prefix`、`--scan-mode`、`--remove`、`--recreate` 和 `--dry-run`；不暴露 `nolock`、`forceStart`、`forceStop`、`pool` 或 `set`。更换恢复没有对应的 `rc` 命令，请直接调用 `GET /rustfs/admin/v4/heal/replacement-recovery`。

## 参考资料

- 上游运行手册：[rustfs/rustfs#7998](https://github.com/rustfs/rustfs/pull/7998) 中的 `docs/operations/cluster-lifecycle-operations.md` —— 本页的改编来源，所有论断均已逐条对照 RustFS 源码验证。
- [存储池扩容](./scaling/storage-pool-expansion.md) · [数据再平衡](./scaling/data-rebalancing.md) · [存储池退役](./scaling/storage-pool-decommission.md) · [节点修复](./high-availability/node-healing.md) · [CLI 客户端（rc）](./rc.mdx)
