---
title: "Hard Drive Failures"
description: "RustFS ensures read/write access can still be provided when some disks fail through mechanisms similar to erasure coding, and automatically heals data after replacing disks."
---

# RustFS Disk Failure Troubleshooting Guide

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

> **Notes**
>
> * If there are multiple mount points, execute `umount` separately.
> * If encountering "device is busy", you can first stop the RustFS service:
>
> ```bash
> systemctl stop rustfs
> ```
>

<a id="replace-failed-disk"></a>

### Replace Failed Disk

After physically replacing the failed disk, you need to partition and format the new disk, and apply the same label as the original disk.

```bash
# Format as ext4 and apply label DISK1 (must correspond to original label)
mkfs.ext4 /dev/sdb -L DISK1
```

> **Requirements**
>
> * New disk capacity ≥ original disk capacity;
> * File system type consistent with other disks;
> * Recommend using labels (LABEL) or UUID for mounting to ensure disk order is not affected by system restarts.

<a id="update-etcfstab-or-rustfs-configuration"></a>

### Update `/etc/fstab` or RustFS Configuration

Confirm that the mount item labels or UUIDs in `/etc/fstab` point to the new disk. If using RustFS-specific configuration files (such as `config.yaml`), corresponding entries also need to be updated synchronously.

```bash
# View current fstab
cat /etc/fstab

# Example fstab entry (no modification needed if labels are the same)
LABEL=DISK1 /mnt/disk1 ext4 defaults,noatime 0 2
```

> **Tips**
>
> * If using UUID:
>
> ```bash
> blkid /dev/sdb
> # Get the new partition's UUID, then replace the corresponding field in fstab
> ```
> * After modifying fstab, be sure to validate syntax:
>
> ```bash
> mount -a # If no errors, configuration is correct
> ```
>

<a id="remount-new-disk"></a>

### Remount New Disk

Execute the following commands to batch mount all disks and start the RustFS service:

```bash
mount -a
systemctl start rustfs
```

Confirm all disks are mounted normally:

```bash
df -h | grep /mnt/disk
```

> **Note**
>
> * If some mounts fail, please check if fstab entries are consistent with disk labels/UUIDs.

<a id="trigger-and-monitor-data-healing"></a>

### Trigger and Monitor Data Healing

After RustFS detects the new disk, it will automatically or manually trigger the data healing process. The following example uses a hypothetical `rustfs-admin` tool:

```bash
# View current disk status
rustfs-admin disk status

# Manually trigger healing for the new disk
rustfs-admin heal --disk /mnt/disk1

# Real-time view of healing progress
rustfs-admin heal status --follow
```

At the same time, you can confirm the system has recognized and started data recovery by viewing service logs:

```bash
# For systemd-managed installations
journalctl -u rustfs -f

# Or view dedicated log files
tail -f /var/log/rustfs/heal.log
```

> **Notes**
>
> * The healing process will complete in the background, usually with minimal impact on online access;
> * After healing is complete, the tool will report success or list failed objects.

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
