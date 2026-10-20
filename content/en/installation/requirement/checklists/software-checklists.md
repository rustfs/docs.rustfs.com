---
title: "Software Checklist"
description: "Check the operating system, file system, and host packages before you install RustFS."
---

Ensure the following requirements are met before deployment.

## Operating system

- **Operating System**: Use LTS versions (Ubuntu 20.04+, RHEL 8/9).
- **Kernel**: We recommend Linux 5.10 or later.
- **CPU and memory**: x86_64 or ARM. Minimum 2 GB RAM for testing, 64 GB or more for production.
- **Disable interfering services**: Disable file indexing and auditing services (for example, `mlocate`, `auditd`, and antivirus) so they do not compete with RustFS I/O.

:::note[Why Linux 5.10 or later]

Modern LTS kernels include mature async I/O and file system improvements. RustFS also offers an optional `io_uring` read path (`RUSTFS_IO_URING_READ_ENABLE`, disabled by default), which requires Linux 5.10 or later.

:::

## Binary deployment

- **Official Download**: Download binaries only from official RustFS channels.
- **Integrity Verification**: Verify SHA256 checksums.
- **Consistency**: Ensure all nodes run the same RustFS version.
- **Installation Location**: Place binaries in `/usr/local/bin` and ensure they are executable (`chmod +x`).

## File system and drives

- **Dedicated Data Disks**: Use dedicated disks for RustFS data. Do not share with the OS.
- **File system**: Use XFS with mount options such as `noatime`. RustFS is developed and tested on XFS. See [File system selection](/installation/linux/prerequisites-and-service#file-system-selection).
- **Disk Configuration**: Use JBOD (independent volumes). Do not use hardware RAID.
- **Permissions**: Ensure the RustFS user has read/write access to data directories.

## Dependencies

- **Time Synchronization**: Synchronize time across all nodes using `ntp` or `chrony`.
- **Hostname and DNS**: Configure persistent hostnames and ensure proper DNS resolution.
- **Network Connectivity**: Ensure all nodes can communicate on the RustFS port (default 9000).
- **TLS/Certificates**: Install root certificates and prepare server certificates if using HTTPS.
- **Packages**: Ensure standard tools (`bash`, `glibc`, `openssl`) are installed.

## User and security

- **Dedicated User**: Run RustFS as a dedicated user (e.g., `rustfs-user`).
- **File Permissions**: Restrict access to binaries and configuration files.
- **SELinux/AppArmor**: Configure policies to allow RustFS operations, or disable if appropriate.
- **systemd**: Configure the systemd service file correctly (`User=`, `ExecStart=`, environment variables).

## Other

- **Monitoring**: Configure Prometheus and Grafana.
- **Rollback Plan**: Prepare configuration backups and a rollback plan.
