---
title: "Hard Drive Failure"
description: "RustFS ensures read/write access during partial disk failures through erasure coding-like mechanisms and automatically heals data after disk replacement."
---

# Hard Drive Failure

RustFS ensures read/write access during partial disk failures through erasure coding-like mechanisms and automatically heals data after disk replacement.

---

### Table of Contents

1. [Unmount Failed Disk](#1-unmount-failed-disk)
2. [Replace Failed Disk](#2-replace-failed-disk)
3. [Update `/etc/fstab` or RustFS Configuration](#3-update-etcfstab-or-rustfs-configuration)
4. [Remount New Disk](#4-remount-new-disk)
5. [Trigger and Monitor Data Healing](#5-trigger-and-monitor-data-healing)
6. [Subsequent Checks and Considerations](#6-subsequent-checks-and-considerations)

---

### 1) Unmount Failed Disk

Before replacing the physical hard drive, you must first safely unmount the failed disk from the operating system level to avoid file system or RustFS I/O errors during the replacement process.

```bash
# Assuming the failed disk is /dev/sdb
umount /dev/sdb
```

> **Note**
>
> * If there are multiple mount points, execute `umount` for each separately.
> * If you encounter "device busy", you can stop the RustFS service first:
>
> ```bash
> systemctl stop rustfs
> ```

---

### 2) Replace Failed Disk

After physically replacing the failed disk, you need to partition and format the new disk and label it consistently with the original disk.

```bash
# Format as ext4 and label as DISK1 (must correspond to original label)
mkfs.ext4 /dev/sdb -L DISK1
```

> **Requirements**
>
> * New disk capacity ≥ original disk capacity;
> * File system type must be consistent with other disks;
> * Recommend using LABEL or UUID for mounting to ensure disk order is not affected by system restarts.

---

### 3) Update `/etc/fstab` or RustFS Configuration

Confirm that the mount entry labels or UUIDs in `/etc/fstab` point to the new disk. If using RustFS proprietary configuration files (such as `config.yaml`), you also need to synchronously update corresponding entries.

```bash
# View current fstab
cat /etc/fstab

# Example fstab entry (no modification needed if labels are the same)
LABEL=DISK1 /mnt/disk1 ext4 defaults,noatime 0 2
```

> **Tip**
>
> * If using UUID:
>
> ```bash
> blkid /dev/sdb
> # Get the UUID of the new partition, then replace the corresponding field in fstab
> ```
>
> * After modifying fstab, be sure to verify syntax:
>
> ```bash
> mount -a # If no errors, configuration is correct
> ```

---

### 4) Remount New Disk

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

---

### 5) Trigger and Monitor Data Healing

RustFS will automatically or manually trigger the data healing process after detecting the new disk. The following example uses the hypothetical `rustfs-admin` tool:

```bash
# View current disk status
rustfs-admin disk status

# Manually trigger healing for the new disk
rustfs-admin heal --disk /mnt/disk1

# View healing progress in real-time
rustfs-admin heal status --follow
```

Meanwhile, you can confirm that the system has recognized and started data recovery by viewing service logs:

```bash
# For systemd managed installations
journalctl -u rustfs -f

# Or view dedicated log files
tail -f /var/log/rustfs/heal.log
```

> **Note**
>
> * The healing process will complete in the background and typically has minimal impact on online access;
> * After healing is complete, the tool will report success or list failed objects.

---

### 6) Subsequent Checks and Considerations

1. **Performance Monitoring**

* I/O may fluctuate slightly during healing; recommend monitoring disk and network load.

2. **Batch Failures**

* If multiple failures occur in the same batch of disks, consider more frequent hardware inspections.

3. **Regular Drills**

* Regularly simulate disk failure drills to ensure the team is familiar with recovery procedures.

4. **Maintenance Windows**

* When failure rates are high, schedule dedicated maintenance windows to accelerate replacement and healing speed.
