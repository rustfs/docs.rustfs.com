---
title: "硬盘故障"
description: "RustFS 通过类似纠删码的机制，在部分磁盘故障时仍可提供读写访问，并在更换磁盘后自动修复数据。"
---

RustFS 通过类似纠删码的机制，在部分磁盘故障时仍可提供读写访问，并在更换磁盘后自动修复数据。

## 目录

1. [卸载故障磁盘](#unmount-failed-disk)
2. [更换故障磁盘](#replace-failed-disk)
3. [更新 `/etc/fstab` 或 RustFS 配置](#update-etcfstab-or-rustfs-configuration)
4. [重新挂载新磁盘](#remount-new-disk)
5. [触发并监控数据修复](#trigger-and-monitor-data-healing)
6. [后续检查和注意事项](#follow-up-checks-and-notes)

<a id="unmount-failed-disk"></a>

### 卸载故障磁盘

更换物理硬盘前，需要在操作系统层面安全卸载故障磁盘，避免更换过程中在文件系统或 RustFS 中产生 I/O 错误。

```bash
# Assume the failed disk is /dev/sdb
umount /dev/sdb
```

:::note[注意事项]

* 如果有多个挂载点，请分别执行 `umount`。
* 如果遇到“device is busy”，可以先停止 RustFS 服务：

```bash
systemctl stop rustfs
```

:::

<a id="replace-failed-disk"></a>

### 更换故障磁盘

更换物理磁盘后，需要对新磁盘进行分区和格式化，并应用与原磁盘相同的标签。

```bash
# Format as XFS and apply the same label as the original disk (RustFS requires XFS, like the other disks in the deployment)
mkfs.xfs -L DISK1 /dev/sdb
```

> **要求**
>
> * 新磁盘容量 ≥ 原磁盘容量；
> * 文件系统类型与其他磁盘一致（根据[安装指南](../installation/linux/index.md)，使用 XFS）；
> * 建议使用标签（LABEL）或 UUID 挂载，确保磁盘顺序不受系统重启影响。

<a id="update-etcfstab-or-rustfs-configuration"></a>

### 更新 `/etc/fstab` 或 RustFS 配置

确认 `/etc/fstab` 中挂载项的标签或 UUID 指向新磁盘。挂载点必须与 `RUSTFS_VOLUMES`（位于 `/etc/default/rustfs`）中列出的路径保持一致，使修复后的磁盘以相同路径重新加入集群。

```bash
# View current fstab
cat /etc/fstab

# Example fstab entry (no modification needed if labels are the same)
LABEL=DISK1 /data/rustfs0 xfs defaults,noatime 0 2
```

:::tip[提示]

* 如果使用 UUID：

```bash
blkid /dev/sdb
# Get the new partition's UUID, then replace the corresponding field in fstab
```

* 修改 fstab 后，务必验证语法：

```bash
mount -a # If no errors, configuration is correct
```

:::

<a id="remount-new-disk"></a>

### 重新挂载新磁盘

执行以下命令批量挂载所有磁盘并启动 RustFS 服务：

```bash
mount -a
systemctl start rustfs
```

确认所有磁盘均已正常挂载：

```bash
df -h | grep /data/rustfs
```

:::note

如果部分挂载失败，请检查 fstab 条目是否与磁盘标签或 UUID 一致。

:::

<a id="trigger-and-monitor-data-healing"></a>

### 触发并监控数据修复

RustFS 在已知挂载点检测到新格式化的磁盘后，后台扫描器会自动将缺失数据修复到该磁盘，无需手动命令。通过服务日志确认恢复已开始并跟踪进度：

```bash
# For systemd-managed installations
journalctl -u rustfs -f

# Or view the log files under the directory set by RUSTFS_OBS_LOG_DIRECTORY
tail -f /var/logs/rustfs/rustfs.log
```

你也可以打开 RustFS 控制台，检查受影响节点的磁盘状态。

:::note[注意事项]

* 修复过程在后台完成，通常对在线访问影响很小；
* 修复完成后，工具会报告成功或列出修复失败的对象。

:::

<a id="follow-up-checks-and-notes"></a>

### 后续检查和注意事项

1. **性能监控**

 * 修复期间 I/O 可能略有波动，建议监控磁盘和网络负载。
2. **批量故障**

 * 如果同一批磁盘发生多次故障，请考虑提高硬件巡检频率。
3. **定期演练**

 * 定期模拟磁盘故障，确保团队熟悉恢复流程。
4. **维护窗口**

 * 故障率较高时，请安排专用维护窗口，以加快更换和修复。