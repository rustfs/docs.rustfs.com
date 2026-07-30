---
title: "EC 配置"
description: "部署存储池前，规划并配置 RustFS 纠删集大小和校验分片数。"
---

RustFS 使用 Reed-Solomon 纠删码（EC）将每个对象分布到纠删集中的各个驱动器。本页帮助你估算可用容量、了解自动默认值，并决定部署是否需要显式校验设置。

## 了解布局

每个存储池分为一个或多个纠删集。对于包含 `N` 个驱动器和 `M` 个校验分片的纠删集：

- 数据分片：`N - M`
- 校验分片：`M`
- 最多可重建的不可用分片数：`M`
- 近似容量效率：`(N - M) / N`

例如，采用 `EC:4` 的 16 驱动器纠删集包含 12 个数据分片和 4 个校验分片。在计算文件系统、元数据和运维开销前，其近似容量效率为 75%。

:::note[故障域]

校验数描述单个纠删集内的不可用分片。节点级容错能力取决于该纠删集中的驱动器如何分布在各节点上。不要假定 `EC:4` 始终可以容忍四个完整节点故障；一个节点可能托管同一纠删集中的多个驱动器。

:::

## 自动校验

除非有明确且经过验证的持久性或容量要求，否则建议不要设置 `RUSTFS_STORAGE_CLASS_STANDARD`。RustFS 根据每个纠删集的驱动器数，为各存储池独立确定 STANDARD 校验数：

| 每个纠删集的驱动器数（`N`） | 自动 STANDARD 校验 | 数据分片 | 近似效率 |
| --- | --- | --- | --- |
| 1 | `EC:0` | 1 | 100% |
| 2–3 | `EC:1` | `N - 1` | 50%–67% |
| 4–5 | `EC:2` | `N - 2` | 50%–60% |
| 6–7 | `EC:3` | `N - 3` | 50%–57% |
| 8–16 | `EC:4` | `N - 4` | 50%–75% |

多驱动器纠删集包含 2 到 16 个驱动器。单驱动器部署是零校验的独立布局。

:::warning[使用纠删集宽度，而不是集群总数]

根据每个纠删集中的驱动器数验证校验数，而不是集群中的驱动器总数。一个集群可以包含宽度不同的多个纠删集或存储池。

:::

## 估算可用容量

如果存储池中的纠删集使用相同宽度和校验数，可使用以下公式估算 EC 容量：

$$
\text{usable capacity} \approx \text{raw capacity} \times \frac{N-M}{N}
$$

例如，将 16 块相同的 10 TiB 驱动器组成一个采用 `EC:4` 的 16 驱动器纠删集，大约可提供：

$$
160\ \text{TiB} \times \frac{16-4}{16} = 120\ \text{TiB}
$$

请为 XFS、对象元数据、版本控制、未完成上传、修复和正常运维空间预留额外容量。该结果仅用于规划估算，不代表保证可用的空间。

## 配置校验数

在 RustFS 服务使用的同一环境文件（例如 `/etc/default/rustfs`）中设置 EC 变量。

要使用推荐的自动 STANDARD 校验，请省略 `RUSTFS_STORAGE_CLASS_STANDARD` 或将其留空：

```ini title="/etc/default/rustfs"
RUSTFS_STORAGE_CLASS_STANDARD=
```

要显式固定校验数，请使用 `EC:<parity>` 格式：

```ini title="/etc/default/rustfs"
RUSTFS_STORAGE_CLASS_STANDARD=EC:4
RUSTFS_STORAGE_CLASS_RRS=EC:1
```

`RUSTFS_STORAGE_CLASS_STANDARD` 控制使用 `STANDARD` 存储类的写入。`RUSTFS_STORAGE_CLASS_RRS` 控制 `REDUCED_REDUNDANCY` 写入，在多驱动器纠删集中默认为一个校验分片。RustFS 接受这两种本地写入存储类。

显式设置必须满足以下所有规则：

- 校验数不得大于每个目标纠删集驱动器数的一半：`M <= N / 2`
- 当二者都非零时，STANDARD 校验数必须大于或等于 REDUCED_REDUNDANCY 校验数
- 配置的校验数必须适用于所有存储池，包括最窄的存储池

RustFS 在启动期间针对每个存储池验证显式存储类。无效值会导致启动失败，而不会静默降低校验数。删除显式 STANDARD 值可恢复各存储池的自动校验，或选择所有存储池都能满足的值。

## 控制纠删集宽度

RustFS 通常根据卷拓扑自动选择有效的纠删集宽度。多驱动器纠删集的宽度范围为 2 到 16。

需要特定对称布局时，`RUSTFS_ERASURE_SET_DRIVE_COUNT` 可以固定宽度：

```ini title="/etc/default/rustfs"
RUSTFS_ERASURE_SET_DRIVE_COUNT=16
```

该值必须能对称划分存储池拓扑，并适用于所有卷扩展模式。RustFS 会拒绝无法均匀划分已配置端点的宽度。除非已验证完整存储池布局，否则请勿设置此变量。

## 验证配置

启动或重启 RustFS 前：

1. 确定每个存储池中每个纠删集的驱动器数。
2. 确认显式校验数不超过最窄纠删集宽度的一半。
3. 估算可用容量并预留运维空间。
4. 在所有节点上保持相同的服务环境配置。

启动后，使用控制台的 **Status** 页面或 `rc admin info cluster` 确认后端布局、纠删码校验数、驱动器可用性和存储池成员关系。完整流程请参阅[状态检查](/operations/status-check)。

## 后续步骤

- [准备数据盘](./disk-preparation.md)
- [选择部署拓扑](/installation#deployment-mode-comparison)
- [查看所有存储环境变量](/reference/environment-variables#storage--erasure)