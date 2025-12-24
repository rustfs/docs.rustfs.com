---
title: "Software Checklist"
description: "Software requirements and considerations."
---

# Software Checklist

Ensure the following requirements are met before deployment.

## OS Requirements

- **Operating System**: Use LTS versions (Ubuntu 20.04+, RHEL 8/9).
- **Kernel**: Linux 5.x+ is recommended for `io_uring` support.
- **CPU & Memory**: x86_64 or ARM. Minimum 2 GB RAM for testing, 64 GB+ for production.
- **Disable Interfering Services**: Disable file indexing and auditing services (e.g., `mlocate`, `auditd`, antivirus) to prevent I/O interference.

> **Why Linux 5.x+?**
> RustFS leverages **io_uring** for high-performance asynchronous I/O, which is mature in Linux 5.10+.

## Binary Deployment

- **Official Download**: Download binaries only from official RustFS channels.
- **Integrity Verification**: Verify SHA256 checksums.
- **Consistency**: Ensure all nodes run the same RustFS version.
- **Installation Location**: Place binaries in `/usr/local/bin` and ensure they are executable (`chmod +x`).

## File System & Disks

- **Dedicated Data Disks**: Use dedicated disks for RustFS data. Do not share with the OS.
- **File System**: Use XFS or Ext4 with performance options (e.g., `noatime`).
- **Disk Configuration**: Use JBOD (independent volumes). Do not use hardware RAID.
- **Permissions**: Ensure the RustFS user has read/write access to data directories.

## Dependencies

- **Time Synchronization**: Synchronize time across all nodes using `ntp` or `chrony`.
- **Hostname and DNS**: Configure persistent hostnames and ensure proper DNS resolution.
- **Network Connectivity**: Ensure all nodes can communicate on the RustFS port (default 9000).
- **TLS/Certificates**: Install root certificates and prepare server certificates if using HTTPS.
- **Packages**: Ensure standard tools (`bash`, `glibc`, `openssl`) are installed.

## User & Security

- **Dedicated User**: Run RustFS as a dedicated user (e.g., `rustfs-user`).
- **File Permissions**: Restrict access to binaries and configuration files.
- **SELinux/AppArmor**: Configure policies to allow RustFS operations, or disable if appropriate.
- **Systemd**: Configure the systemd service file correctly (`User=`, `ExecStart=`, environment variables).

## Other

- **Monitoring**: Configure Prometheus and Grafana.
- **Rollback Plan**: Prepare configuration backups and a rollback plan.
