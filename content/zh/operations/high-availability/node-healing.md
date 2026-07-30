---
title: "节点修复"
description: "恢复故障的 RustFS 节点和磁盘、监控自动修复，并使用 rc 运行有界的手动修复任务。"
---

RustFS 修复利用存储集合中剩余的健康分片，重建缺失或不一致的纠删码数据。恢复不可用节点、更换故障磁盘，或调查扫描器和修复告警后，请使用此工作流程。

修复是集群存储操作。它不同于[站点复制](/operations/high-availability/site-replication)，后者在独立的 RustFS 部署之间复制数据和身份配置。

:::warning[修复不是备份]

只有当受影响纠删码集合中保留足够的健康分片时，RustFS 才能重建数据。当故障超出集合的可用冗余时，修复无法恢复对象，也无法防范有意删除或应用级损坏。请根据恢复要求维护独立备份或复制。

:::

## 修复的工作方式

RustFS 通过集群修复队列协调多个修复来源：

- `autoHeal`：自动磁盘扫描器检测未格式化或中断后恢复的磁盘，并将纠删码集合修复加入队列。
- `scanner`：后台数据扫描器发现存储状态不一致时，可以将对象和存储桶修复加入队列。
- `readRepair`：读取修复路径可以提交在处理请求时发现的工作。
- `internal`：内部恢复路径可以提交由系统发起的工作。
- `admin`：管理员可以使用 `rc admin heal start` 提交递归、存储桶或前缀修复。

自动磁盘修复以低优先级运行。`healOperations` 状态对象使用这些来源名称区分排队中、活跃和重试中的工作。

:::note[重建会消耗集群资源]

修复会读取健康分片并写入重建数据。深度扫描会增加读取和校验和工作。恢复期间，请监控客户端延迟、磁盘利用率、可用容量和修复队列。

:::

## 要求

恢复节点或磁盘前，请准备：

- 仍有足够健康分片来重建受影响数据的 RustFS 部署。
- 稳定的节点地址和最初配置的存储挂载路径。
- 容量适合受影响纠删码集合的替换存储。
- 安全管理主机上的 RustFS [`rc`](/operations/rc) 客户端。
- 允许执行集群信息、扫描器和修复操作的管理凭证。
- 更换硬件或运行深度递归扫描时的维护窗口。

更改硬件前，请记录故障节点、存储池、集合、磁盘端点、挂载路径和文件系统 UUID。恢复完成前，请勿从同一纠删码集合中移除其他磁盘。

## 1. 识别故障组件

如果尚未创建 `rc` 别名，请进行配置：

```bash
rc alias set rustfs https://rustfs.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

检查集群就绪状态、拓扑、存储健康状态和修复活动：

```bash
rc ready rustfs
rc admin info cluster rustfs
rc admin info storage rustfs
rc admin scanner status rustfs
rc admin heal status rustfs
```

集群降级时，就绪检查可能失败。使用管理信息命令确定不可用的节点或磁盘，并记下其存储池和纠删码集合位置。

如需机器可读的输出，请请求 JSON：

```bash
rc --json admin info storage rustfs
rc --json admin heal status rustfs
```

汇总修复状态报告运行时状态、排队和活跃任务、重试中的工作、请求来源、优先级以及可用的进度计数器。队列长度为零并不能证明离线磁盘已更换或每个对象都可恢复；请结合存储拓扑和就绪状态进行判断。

## 2. 恢复节点或磁盘

启动手动修复前，请纠正底层故障。

对于节点中断：

1. 恢复节点配置的网络标识，以及它通过 S3 API 端口（通常为 `9000`）与其他所有 RustFS 节点的连接。
2. 将原始数据磁盘挂载到其配置路径。
3. 确认 RustFS 进程使用与集群其余部分相同的存储端点配置。
4. 启动 RustFS，并确认节点重新加入集群。

对于故障磁盘：

1. 移除或重新挂载存储前，停止受影响节点上的 RustFS 进程。
2. 更换故障设备，并按照[磁盘准备](/installation/requirement/disk-preparation)准备其文件系统。
3. 将替换设备挂载到故障磁盘使用的准确路径，并使用其文件系统 UUID 更新 `/etc/fstab`。
4. 启动 RustFS 前，验证挂载、文件系统类型、所有权和可用容量。
5. 启动 RustFS，并确认磁盘出现在预期的存储池和纠删码集合中。

```bash
findmnt /data/rustfs0
df -hT /data/rustfs0
rc admin info storage rustfs
```

:::warning[不要盲目重用陈旧存储]

将设备挂载到 RustFS 数据路径前，请确认每个设备的标识和内容。请勿在磁盘之间复制内部元数据、将多个已配置端点合并到一个替换文件系统中，或将替换设备挂载到仍包含所需数据的路径之上。

:::

## 3. 监控自动修复

节点或替换磁盘上线后，RustFS 可以检测恢复候选项，并将纠删码集合修复加入队列。同时检查存储状态和汇总修复活动：

```bash
rc admin info storage rustfs
rc admin heal status rustfs
rc admin scanner status rustfs
```

在 JSON 输出中关注以下字段组：

| 字段 | 含义 |
| --- | --- |
| `state` | 修复运行时状态，例如 `active` 或 `idle`。 |
| `healQueueLength` | 修复队列中等待的工作总量。 |
| `healActiveTasks` | 当前运行的修复任务总数。 |
| `healOperations` | 按来源（`scanner`、`admin`、`autoHeal`、`internal` 和 `readRepair`）及优先级分组的队列、活跃和重试计数。 |
| `progress` | 对象扫描数、修复数、失败数和已处理字节数的可用总计。 |
| `clusterStatusComplete` | 响应是否包含每个预期节点。 |

不要仅将 `idle` 视为恢复成功。请确认替换磁盘在线、没有剩余修复失败、集群已就绪，并且代表性对象可读。

## 4. 运行定向手动修复

当自动恢复未覆盖所需路径，或需要在事件后执行明确扫描时，请使用手动任务。从包含受影响数据的最小存储桶或前缀开始。

预览存储桶修复而不应用更改：

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--scan-mode normal \
	--dry-run
```

查看预览后运行定向修复：

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--scan-mode normal
```

已知受影响范围时，将任务限制为对象前缀：

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--scan-mode deep
```

`normal` 是默认扫描模式。当需要更深入的数据验证，并已为额外磁盘 I/O 做好规划时，请使用 `deep`。仅当必须递归扫描所有存储桶时，才省略 `--bucket`。

:::warning[单独审查修改选项]

`--remove` 选项会删除悬空对象或部件，`--recreate` 请求重新创建缺失数据。在检查受影响的存储状态、使用 `--dry-run` 测试并确认预期结果之前，请勿将任一选项添加到事件命令中。

:::

## 5. 跟踪手动任务

每个手动修复都会返回 `clientToken`。请将其与事件记录一起保存，因为该任务的状态和停止操作需要此令牌。

对于存储桶或前缀任务，请传入原始目标和令牌：

```bash
rc admin heal status rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--client-token <client-token>
```

对于未使用 `--bucket` 启动的递归任务，请仅使用令牌：

```bash
rc admin heal status rustfs --client-token <client-token>
```

不带令牌的命令仍提供集群范围的后台摘要：

```bash
rc admin heal status rustfs
```

任务状态可能包括已扫描、已修复和失败项目总数、已处理字节数、当前项目、扫描模式、开始时间和最后更新时间。请调查失败项目，不要仅依赖任务的汇总状态。

## 6. 验证恢复

修复队列排空后，请验证集群和已恢复的数据路径：

```bash
rc ready rustfs
rc admin info cluster rustfs
rc admin info storage rustfs
rc admin heal status rustfs
```

从受影响的存储桶和版本中读取代表性对象。对于已知的测试对象：

```bash
rc object stat rustfs/my-bucket/hello.txt
rc object copy rustfs/my-bucket/hello.txt ./hello-recovered.txt
```

如果有独立校验和或可信来源，请将下载的对象与其比较。对象读取成功仅验证该请求，并不验证集群中的每个对象或每个分片。

集群就绪后，请继续监控存储健康状态和修复失败。保留事件时间线、故障设备信息、任务令牌和最终状态输出以供审查。

## 7. 停止手动修复

仅停止已识别的任务。对于存储桶或前缀任务，请包含原始目标和令牌：

```bash
rc admin heal stop rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--client-token <client-token>
```

使用以下命令停止递归的令牌范围任务：

```bash
rc admin heal stop rustfs --client-token <client-token>
```

不带令牌的停止命令以全局后台修复操作为目标：

```bash
rc admin heal stop rustfs
```

仅当继续执行后台工作会产生更大的运维风险时，才使用全局停止。停止修复会使恢复处于未完成状态；关闭事件前，请记录原因并确认修复如何恢复。

## 故障排除

### 替换磁盘未进行修复

确认替换设备已挂载到配置的端点，并出现在 `rc admin info storage` 中。检查 RustFS 日志中是否存在磁盘识别、格式化、权限或队列准入失败。还要使用 `rc admin heal status` 确认修复服务已初始化。

### 修复状态不完整

如果 `clusterStatusComplete` 为 false，则一个或多个预期节点未提供汇总响应。恢复节点间连接，并检查每个节点的存储和进程健康状态，再信任集群总计。

### 队列保持活跃

按来源比较排队、活跃和重试中的工作。不断增加的 `autoHeal` 计数表示磁盘或纠删码集合恢复；扫描器工作表示后台发现；管理工作属于手动提交的任务。启动其他任务前，请检查磁盘延迟、可用容量、节点连接和重复的项目失败。

### 对象无法重建

停止受影响纠删码集合上的其他维护。保留剩余磁盘和日志，然后确定是否仍有足够的健康分片。当可用冗余已经耗尽时，重复深度扫描无法重建数据。

### 无法查询手动任务

使用 `heal start` 返回的 `clientToken`。查询存储桶和前缀任务时，必须使用启动时相同的 `--bucket` 和 `--prefix` 目标；递归根任务使用令牌而不带存储桶。

## 后续步骤

- 查看[状态检查](/operations/status-check)，了解就绪状态、集群和容量检查。
- 配置[可观测性](/operations/observability)，针对磁盘健康状态和持续恢复工作发出告警。
- 当恢复需要独立的 RustFS 部署时，请查看[站点复制](/operations/high-availability/site-replication)。