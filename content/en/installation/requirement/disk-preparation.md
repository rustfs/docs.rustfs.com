---
title: "Disk Preparation"
description: "Identify, format, mount, and verify dedicated data disks before installing RustFS on Linux."
---

Prepare each RustFS data disk as an independent XFS file system with a stable label and mount point. Complete these steps on every Linux node before configuring `RUSTFS_VOLUMES`.

:::warning[Formatting destroys data]

The `mkfs.xfs` command erases the selected device. Confirm the device name, back up any required data, and ensure the disk is not used by the operating system before continuing.

:::

## 1. Identify the data disks

List block devices, file systems, labels, and current mount points:

```bash
sudo lsblk -o NAME,SIZE,TYPE,FSTYPE,LABEL,UUID,MOUNTPOINTS
```

Choose only dedicated data disks. Do not format the operating-system disk or a device that contains data you need to retain.

## 2. Format a disk with XFS

The following example prepares `/dev/sdb` and assigns the label `RUSTFS0`. Replace the device name for your environment and use a unique label for each disk.

```bash
sudo mkfs.xfs -f -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

Repeat the command for additional disks with labels such as `RUSTFS1`, `RUSTFS2`, and `RUSTFS3`.

## 3. Create a persistent mount

Create the mount point:

```bash
sudo mkdir -p /data/rustfs0
```

Add an entry to `/etc/fstab` so the disk is mounted by its stable file-system label after a restart:

```ini title="/etc/fstab"
LABEL=RUSTFS0 /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

For more reliable device selection, we recommend mounting by file-system UUID. A UUID uniquely identifies the file system and avoids mounting the wrong disk if labels are duplicated or Linux device names change. Retrieve the UUID after formatting:

```bash
sudo blkid -s UUID -o value /dev/sdb
```

Replace `<filesystem-uuid>` with the returned value, and use this entry instead of the `LABEL` entry above:

```ini title="/etc/fstab"
UUID=<filesystem-uuid> /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

Mount all entries and confirm the result:

```bash
sudo mount -a
findmnt /data/rustfs0
```

For multiple disks, create one mount point and one `/etc/fstab` entry per file-system UUID.

## 4. Verify the prepared disks

Confirm that every expected mount uses XFS and has sufficient free space:

```bash
df -hT /data/rustfs0
sudo xfs_info /data/rustfs0
```

Use the verified mount paths when you configure `RUSTFS_VOLUMES`. Keep disk labels and mount paths consistent across nodes in a distributed deployment.

## Next steps

- [Choose a deployment topology](/installation#deployment-mode-comparison)
- [Continue with Linux prerequisites and service setup](/installation/linux/prerequisites-and-service)