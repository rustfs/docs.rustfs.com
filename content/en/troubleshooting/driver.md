---
title: "Drive Failures"
description: "Replace a failed drive in a RustFS deployment and let RustFS heal the data automatically."
---

RustFS uses erasure coding to keep data readable and writable when some drives fail. After you replace a failed drive, RustFS heals the missing data onto it automatically.

<a id="unmount-failed-disk"></a>

### Unmount the failed disk

Before replacing the physical hard drive, unmount the failed disk at the operating system level to prevent I/O errors in the file system or RustFS during replacement.

```bash
# Assume the failed disk is /dev/sdb
umount /dev/sdb
```

:::note[Notes]

* If the disk has multiple mount points, run `umount` on each one.
* If you see a "device is busy" error, stop the RustFS service first:

```bash
systemctl stop rustfs
```

:::

<a id="replace-failed-disk"></a>

### Replace the failed disk

After physically replacing the failed disk, you need to partition and format the new disk, and apply the same label as the original disk.

```bash
# Format as XFS and apply the same label as the original disk (RustFS requires XFS, like the other disks in the deployment)
mkfs.xfs -L DISK1 /dev/sdb
```

:::note[Requirements]
* The new disk is at least as large as the original disk.
* Use the same file system as the other disks (XFS; see the [installation guide](../installation/linux/index.md)).
* We recommend mounting file systems by label (LABEL) or UUID so that mounts remain correct if device names change after a restart.
:::

<a id="update-etcfstab-or-rustfs-configuration"></a>

### Update `/etc/fstab` or the RustFS configuration

Confirm that the labels or UUIDs in the `/etc/fstab` entries point to the new disk. The mount point must stay identical to the one listed in `RUSTFS_VOLUMES` (in `/etc/default/rustfs`), so the healed disk rejoins the cluster at the same path.

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

* After you edit `/etc/fstab`, validate the syntax:

```bash
mount -a # If no errors, configuration is correct
```

:::

<a id="remount-new-disk"></a>

### Remount the new disk

Run the following commands to mount all configured file systems and start RustFS:

```bash
mount -a
systemctl start rustfs
```

Verify that all expected file systems are mounted:

```bash
df -h | grep /data/rustfs
```

:::note[Mount failures]
If a mount fails, check that the labels or UUIDs in `/etc/fstab` match those on the target file system.
:::

<a id="trigger-and-monitor-data-healing"></a>

### Trigger and monitor data healing

Once RustFS detects a freshly formatted disk at a known mount point, its background scanner heals the missing data onto it automatically — no manual command is required. Confirm that recovery has started and track its progress through the service logs:

```bash
# For systemd-managed installations
journalctl -u rustfs -f

# Or view the log files under the directory set by RUSTFS_OBS_LOG_DIRECTORY
tail -f /var/log/rustfs/rustfs.log
```

You can also open the RustFS Console and check the disk status of the affected node.

:::note[Notes]

* Healing runs in the background and usually has little impact on client requests.
* When healing finishes, the logs report success or list objects that failed to heal.

:::

<a id="follow-up-checks-and-notes"></a>

### Follow-up checks and notes

1. **Performance Monitoring**

 * I/O load may fluctuate during healing. We recommend monitoring disk and network utilization.
2. **Batch Failures**

 * If several disks from the same manufacturing batch fail, inspect the remaining disks from that batch more often.
3. **Regular failure tests**

 * Run regular disk failure drills so your team can practice the recovery procedure.
4. **Maintenance Windows**

 * When failure rates are high, schedule dedicated maintenance windows to speed up replacement and healing.
