---
title: "Hard Drive Failures"
description: "RustFS ensures read/write access can still be provided when some disks fail through mechanisms similar to erasure coding, and automatically heals data after replacing disks."
---

RustFS ensures read/write access can still be provided when some disks fail through mechanisms similar to erasure coding, and automatically heals data after replacing disks.

## Table of Contents

1. [Unmount Failed Disk](#unmount-failed-disk)
2. [Replace Failed Disk](#replace-failed-disk)
3. [Update `/etc/fstab` or RustFS Configuration](#update-etcfstab-or-rustfs-configuration)
4. [Remount New Disk](#remount-new-disk)
5. [Trigger and Monitor Data Healing](#trigger-and-monitor-data-healing)
6. [Follow-up Checks and Notes](#follow-up-checks-and-notes)

<a id="unmount-failed-disk"></a>

### Unmount Failed Disk

Before replacing the physical hard drive, you need to safely unmount the failed disk from the operating system level to avoid I/O errors in the file system or RustFS during the replacement process.

```bash
# Assume the failed disk is /dev/sdb
umount /dev/sdb
```

:::note[Notes]

* If there are multiple mount points, execute `umount` separately.
* If encountering "device is busy", you can first stop the RustFS service:

```bash
systemctl stop rustfs
```

:::

<a id="replace-failed-disk"></a>

### Replace Failed Disk

After physically replacing the failed disk, you need to partition and format the new disk, and apply the same label as the original disk.

```bash
# Format as XFS and apply the same label as the original disk (RustFS requires XFS, like the other disks in the deployment)
mkfs.xfs -L DISK1 /dev/sdb
```

> **Requirements**
>
> * New disk capacity ≥ original disk capacity;
> * File system type consistent with other disks (XFS, per the [installation guide](../installation/linux/index.md));
> * Recommend using labels (LABEL) or UUID for mounting to ensure disk order is not affected by system restarts.

<a id="update-etcfstab-or-rustfs-configuration"></a>

### Update `/etc/fstab` or RustFS Configuration

Confirm that the mount item labels or UUIDs in `/etc/fstab` point to the new disk. The mount point must stay identical to the one listed in `RUSTFS_VOLUMES` (in `/etc/default/rustfs`), so the healed disk rejoins the cluster at the same path.

```bash
# View current fstab
cat /etc/fstab

# Example fstab entry (no modification needed if labels are the same)
LABEL=DISK1 /data/rustfs0 xfs defaults,noatime 0 2
```

:::tip[Tips]

* If using UUID:

```bash
blkid /dev/sdb
# Get the new partition's UUID, then replace the corresponding field in fstab
```

* After modifying fstab, be sure to validate syntax:

```bash
mount -a # If no errors, configuration is correct
```

:::

<a id="remount-new-disk"></a>

### Remount New Disk

Execute the following commands to batch mount all disks and start the RustFS service:

```bash
mount -a
systemctl start rustfs
```

Confirm all disks are mounted normally:

```bash
df -h | grep /data/rustfs
```

:::note

If some mounts fail, please check if fstab entries are consistent with disk labels/UUIDs.

:::

<a id="trigger-and-monitor-data-healing"></a>

### Trigger and Monitor Data Healing

Once RustFS detects a freshly formatted disk at a known mount point, its background scanner heals the missing data onto it automatically — no manual command is required. Confirm that recovery has started and track its progress through the service logs:

```bash
# For systemd-managed installations
journalctl -u rustfs -f

# Or view the log files under the directory set by RUSTFS_OBS_LOG_DIRECTORY
tail -f /var/logs/rustfs/rustfs.log
```

You can also open the RustFS Console and check the disk status of the affected node.

:::note[Notes]

* The healing process will complete in the background, usually with minimal impact on online access;
* After healing is complete, the tool will report success or list failed objects.

:::

<a id="follow-up-checks-and-notes"></a>

### Follow-up Checks and Notes

1. **Performance Monitoring**

 * I/O may fluctuate slightly during healing, recommend monitoring disk and network load.
2. **Batch Failures**

 * If multiple failures occur in the same batch of disks, consider more frequent hardware inspections.
3. **Regular Drills**

 * Regularly simulate disk failure drills to ensure team familiarity with recovery processes.
4. **Maintenance Windows**

 * When failure rates are high, arrange dedicated maintenance windows to speed up replacement and healing.
