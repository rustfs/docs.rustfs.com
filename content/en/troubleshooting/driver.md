---
title: "Drive failures"
description: "Replace a failed drive and let RustFS heal the missing data onto the replacement."
---

RustFS uses erasure coding to keep data readable and writable when some drives fail. After you replace a failed drive, RustFS heals the missing data onto it automatically. For heal status and manual heal tasks, see [Node healing](/operations/high-availability/node-healing).

Replace `/data/rustfs0` and `/dev/sdb` with the mount and device for the failed drive. Confirm the device name before you format it. `mkfs.xfs` erases the selected device.

## 1. Stop RustFS and unmount the failed drive

Unmount the failed file system. If it has more than one mount point, unmount each one.

```bash
sudo umount /data/rustfs0
```

:::note[Device is busy]

If `umount` reports that the device is busy, stop RustFS and any other process that still has the mount open, then run `umount` again.

```bash
sudo systemctl stop rustfs
```

:::

## 2. Replace and prepare the drive

Install a replacement that is at least as large as the failed drive. Use XFS, the same file system as the other RustFS drives. [Disk preparation](/installation/requirement/disk-preparation) explains how to identify the device and choose a unique label.

```bash
sudo mkfs.xfs -f -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

## 3. Mount the replacement at the original path

The mount point must stay the path listed in `RUSTFS_VOLUMES` (in `/etc/default/rustfs`). Mount by file-system UUID so a reboot cannot attach the wrong drive if device names change.

```ini title="/etc/fstab"
UUID=<filesystem-uuid> /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

Read the UUID after formatting:

```bash
sudo blkid -s UUID -o value /dev/sdb
```

Check `/etc/fstab`, then mount every entry and confirm the path:

```bash
sudo mount -a
findmnt /data/rustfs0
```

Start RustFS after the replacement is mounted:

```bash
sudo systemctl start rustfs
```

Confirm the file system has free space:

```bash
df -hT /data/rustfs0
```

:::note[Mount failed]

If the mount fails, check that the UUID in `/etc/fstab` matches the new file system.

:::

## 4. Watch healing

```bash
journalctl -u rustfs -f
tail -f /var/log/rustfs/rustfs.log
```

When RustFS sees a freshly formatted drive at a known mount point, it queues healing for the missing data. You can also check drive status on the Console, or follow the heal queue with `rc` as described in [Node healing](/operations/high-availability/node-healing).

Healing reads healthy shards and writes reconstructed data, so disk and network utilization can rise while it runs. When the cycle finishes, the logs report success or list objects that failed to heal.

## 5. Follow-up checks

- If several drives from the same manufacturing batch fail, inspect the remaining drives from that batch more often.
- Rehearse this procedure so the team can follow it during an incident.
- When several drives fail together, schedule a maintenance window so replacement and healing do not compete with peak traffic.

## Next steps

- [Recover a failed node](/troubleshooting/node)
- [Monitor healing](/operations/high-availability/node-healing)
