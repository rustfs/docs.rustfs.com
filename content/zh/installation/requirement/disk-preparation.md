---
title: "磁盘准备"
description: "在 Linux 上安装 RustFS 前，识别、格式化、挂载并验证专用数据盘。"
---

将每块 RustFS 数据盘准备为具有稳定标签和挂载点的独立 XFS 文件系统。在配置 `RUSTFS_VOLUMES` 前，请在每个 Linux 节点上完成以下步骤。

:::warning[格式化会销毁数据]

`mkfs.xfs` 命令会擦除所选设备。继续前请确认设备名称、备份所有必要数据，并确保操作系统未使用该磁盘。

:::

## 1. 识别数据盘

列出块设备、文件系统、标签和当前挂载点：

```bash
sudo lsblk -o NAME,SIZE,TYPE,FSTYPE,LABEL,UUID,MOUNTPOINTS
```

仅选择专用数据盘。不要格式化操作系统磁盘或包含需要保留数据的设备。

## 2. 使用 XFS 格式化磁盘

以下示例准备 `/dev/sdb` 并分配标签 `RUSTFS0`。请根据环境替换设备名称，并为每块磁盘使用唯一标签。

```bash
sudo mkfs.xfs -f -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

对其他磁盘重复运行该命令，并使用 `RUSTFS1`、`RUSTFS2` 和 `RUSTFS3` 等标签。

## 3. 创建持久挂载

创建挂载点：

```bash
sudo mkdir -p /data/rustfs0
```

在 `/etc/fstab` 中添加条目，以便重启后按稳定的文件系统标签挂载磁盘：

```ini title="/etc/fstab"
LABEL=RUSTFS0 /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

为了更可靠地选择设备，建议按文件系统 UUID 挂载。UUID 唯一标识文件系统，可避免标签重复或 Linux 设备名称变化时挂载错误的磁盘。格式化后获取 UUID：

```bash
sudo blkid -s UUID -o value /dev/sdb
```

将 `<filesystem-uuid>` 替换为返回值，并使用以下条目代替上面的 `LABEL` 条目：

```ini title="/etc/fstab"
UUID=<filesystem-uuid> /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

挂载所有条目并确认结果：

```bash
sudo mount -a
findmnt /data/rustfs0
```

对于多块磁盘，请为每个文件系统 UUID 创建一个挂载点和一个 `/etc/fstab` 条目。

## 4. 验证准备好的磁盘

确认每个预期挂载点都使用 XFS，并具有足够的可用空间：

```bash
df -hT /data/rustfs0
sudo xfs_info /data/rustfs0
```

配置 `RUSTFS_VOLUMES` 时使用已验证的挂载路径。在分布式部署中，保持各节点的磁盘标签和挂载路径一致。

## 后续步骤

- [选择部署拓扑](/installation#deployment-mode-comparison)
- [继续配置 Linux 前提条件和服务](/installation/linux/prerequisites-and-service)