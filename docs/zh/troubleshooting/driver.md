---
title: "硬盘损坏"
description: "RustFS 通过类似纠删码的机制保证在部分磁盘故障时仍能提供读写访问并在更换磁盘后自动愈合数据。"
---

# RustFS 磁盘故障排查指南

RustFS 通过类似纠删码的机制保证在部分磁盘故障时仍能提供读写访问并在更换磁盘后自动愈合数据。

## 目录

1. [卸载故障磁盘](#卸载故障磁盘)
2. [更换故障磁盘](#更换故障磁盘)
3. [更新 `/etc/fstab` 或 RustFS 配置](#更新-etcfstab-或-rustfs-配置)
4. [重新挂载新磁盘](#重新挂载新磁盘)
5. [触发并监控数据愈合](#触发并监控数据愈合)
6. [后续检查与注意事项](#后续检查与注意事项)

<a id="卸载故障磁盘"></a>

### 卸载故障磁盘

在更换物理硬盘之前，需先从操作系统层面安全卸载故障盘，避免文件系统或 RustFS 在更换过程中出现 I/O 错误。

```bash
# 假设故障盘为 /dev/sdb
umount /dev/sdb
```

> **说明**
>
> * 若挂载点有多条，分别执行 `umount`。
> * 如遇“设备正忙”，可先停止 RustFS 服务：
>
> ```bash
> systemctl stop rustfs
> ```
>

<a id="更换故障磁盘"></a>

### 更换故障磁盘

物理上替换故障盘后，需要对新盘进行分区与格式化，并打上与原盘一致的标签。

```bash
# 格式化为 ext4，并打标签为 DISK1（需与原来标签对应）
mkfs.ext4 /dev/sdb -L DISK1
```

> **要求**
>
> * 新盘容量 ≥ 原盘容量；
> * 文件系统类型与其他盘保持一致；
> * 建议使用标签（LABEL）或 UUID 挂载，以保证磁盘顺序不受系统重启影响。

<a id="更新 `/etc/fstab` 或 RustFS 配置"></a>

### 更新 `/etc/fstab` 或 RustFS 配置

确认 `/etc/fstab` 中的挂载项标签或 UUID 指向新盘。若使用 RustFS 专有的配置文件（如 `config.yaml`），也需同步更新对应条目。

```bash
# 查看当前 fstab
cat /etc/fstab

# 示例 fstab 条目（无需修改标签相同的情况）
LABEL=DISK1 /mnt/disk1 ext4 defaults,noatime 0 2
```

> **提示**
>
> * 如使用 UUID：
>
> ```bash
> blkid /dev/sdb
> # 获取新分区的 UUID，然后替换 fstab 中对应字段
> ```
> * fstab 修改后务必校验语法：
>
> ```bash
> mount -a # 若无报错，则配置正确
> ```
>

<a id="重新挂载新磁盘"></a>

### 重新挂载新磁盘

执行以下命令批量挂载所有盘，并启动 RustFS 服务：

```bash
mount -a
systemctl start rustfs
```

确认所有磁盘已正常挂载：

```bash
df -h | grep /mnt/disk
```

> **注意**
>
> * 若部分挂载失败，请检查 fstab 条目与磁盘标签/UUID 是否一致。

<a id="触发并监控数据愈合"></a>

### 触发并监控数据愈合

RustFS 在检测到新盘后，会自动或手动触发数据愈合（heal）流程。以下示例使用假设的 `rustfs-admin` 工具：

```bash
# 查看当前磁盘状态
rustfs-admin disk status

# 手动触发对新盘的愈合
rustfs-admin heal --disk /mnt/disk1

# 实时查看愈合进度
rustfs-admin heal status --follow
```

同时，可以通过查看服务日志确认系统已识别并开始恢复数据：

```bash
# 对于 systemd 管理的安装
journalctl -u rustfs -f

# 或查看专用日志文件
tail -f /var/log/rustfs/heal.log
```

> **说明**
>
> * 愈合过程会在后台完成，通常对在线访问影响极小；
> * 愈合完成后，工具会报告成功或列出失败的对象。

<a id="后续检查与注意事项"></a>

### 后续检查与注意事项

1. **性能监控**

 * 愈合期间 I/O 可能略有波动，建议监控磁盘和网络负载。
2. **批量故障**

 * 如果同一批次磁盘出现多次故障，应考虑更频繁的硬件巡检。
3. **定期演练**

 * 定期模拟磁盘故障演练，保证团队对恢复流程熟悉。
4. **维护窗口**

 * 在故障率较高时，安排专门的维护窗口，加快替换与愈合速度。

