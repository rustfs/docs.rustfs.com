---
title: "Software Checklist"
description: "This document primarily explains precautions for peripheral software during RustFS installation, including operating systems, binary packages, etc."
---

# RustFS Software Deployment Checklist

RustFS is a high-performance distributed object storage, 100% compatible with S3 protocol, using Apache 2.0 open source license ([What is RustFS?](https://rustfs.com/docs/#:~:text=RustFS%E6%98%AF%E4%B8%80%E7%A7%8D%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%EF%BC%8C%E4%BD%BF%E7%94%A8Apache2%20%E8%AE%B8%E5%8F%AF%E8%AF%81%E5%8F%91%E8%A1%8C%E7%9A%84%E5%BC%80%E6%BA%90%E5%88%86%E5%B8%83%E5%BC%8F%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E3%80%82)). It's developed in Rust with memory safety features and can run on multiple platforms (including Linux, Windows, macOS, supporting x86/ARM architectures), with flexible and customizable deployment (supporting custom plugin extensions). To ensure stable and reliable production environment deployment, the following necessary check items are listed. Please **confirm first** whether the following settings are in place:

## System Requirements

- **Operating System**: Recommend using long-term support versions of Linux (such as Ubuntu 20.04+/22.04, RHEL 8/9, etc.), with kernel version preferably 5.x or higher. RustFS can utilize `io_uring` asynchronous I/O optimization under Linux 5.x+ kernels, providing better throughput performance.
- **CPU & Memory**: Supports mainstream CPU architectures like x86_64, ARM. Test environment requires at least 2 GB memory, production environment recommends at least 64 GB memory ([Linux Install RustFS](https://rustfs.com/docs/install/linux/#:~:text=2)). **Don't forget** to estimate required memory based on data scale and concurrency to avoid performance bottlenecks due to insufficient memory.
- **Disable Interfering Services**: To ensure performance, recommend disabling or ignoring services that scan/audit file systems (such as `mlocate`, `plocate`, `updatedb`, `auditd`, antivirus software, etc.), as these services may conflict with RustFS disk I/O. If they cannot be disabled, exclude RustFS data paths to avoid scanning performance impact.

RustFS strongly recommends running on Linux 5.x or higher kernel versions, especially 5.10+ versions.
Why?

Because RustFS prioritizes using Linux's **io_uring** technology in its underlying I/O model, and io_uring was introduced starting from Linux 5.1 and became more mature and stable in 5.10+ versions. Compared to traditional epoll or thread pools, io_uring provides more efficient, low-latency asynchronous I/O capabilities, very suitable for high-concurrency object storage scenarios.

### Recommendations

- Use mainstream enterprise distribution versions with 5.x kernels, for example:
- Ubuntu 20.04 LTS (can install HWE kernel to get 5.15+)
- Ubuntu 22.04 LTS (default 5.15+)
- CentOS Stream 9 / RHEL 9
- Debian 12 (default 6.x, even better)

- If you're still using old kernels (like 4.x), recommend upgrading or using distributions that support custom kernels to fully leverage RustFS performance advantages.

## Binary Package Verification and Deployment

- **Official Download**: Must download server binary packages from official RustFS channels (such as official website or official mirrors), don't use packages from unknown sources to prevent tampering.
- **Integrity Verification**: After downloading, **don't forget** to verify binary package integrity. Usually there are official SHA256 checksums or signature files provided, which can be verified using `sha256sum` or signature verification tools to ensure files are not corrupted or tampered with.
- **Consistency**: For distributed deployment, ensure all nodes use the same version of RustFS binaries, otherwise compatibility issues may arise due to version differences.
- **Installation Location**: For easier management, move binaries to global execution path (such as `/usr/local/bin`) and grant executable permissions (`chmod +x`). If using systemd to manage services, ensure the path in service files is correct.

## File System and Disk Layout

- **Dedicated Data Disks**: RustFS requires exclusive access to storage disks, don't mix system disks or other application data with RustFS data. Recommend using different disks or partitions for operating system and RustFS data separately; **confirm first** that data disk mount points are correct.
- **File System Type**: Recommend using mature and high-performance file systems like XFS or Ext4, and add performance options when mounting (such as `noatime,nodiratime,nobarrier`, etc., adjust according to actual conditions). This can reduce unnecessary I/O overhead and improve throughput.
- **Disk Configuration**: If using multiple disks, usually recommend configuring as independent volumes (JBOD), letting RustFS itself ensure data reliability through erasure coding and other mechanisms, rather than relying on hardware RAID, for more flexible storage capacity expansion.
- **Mount Options and Permissions**: Check mount parameters, ensure RustFS service running user has read/write permissions to data directories. Can add security options like `noexec`, `nodev` in `/etc/fstab` while ensuring RustFS process has access permissions.

## System Dependency Checks

- **Time Synchronization**: For multi-node deployment, **never forget** time synchronization. All nodes' system time must be consistent (use `ntp`, `chrony`, `timedatectl` and other tools to synchronize time), otherwise may cause cluster startup or data consistency anomalies ([Linux Install RustFS](https://rustfs.com/docs/install/linux/#:~:text=2)). Check if `timedatectl status` output shows "`synchronized`" ([Linux Install RustFS](https://rustfs.com/docs/install/linux/#:~:text=2)).
- **Hostname and DNS**: Configure **consistent hostnames** for each node and ensure these hostnames can resolve to correct IPs. Can use DNS or `/etc/hosts` for configuration ([Linux Install RustFS](https://rustfs.com/docs/install/linux/#:~:text=2)). For example, configure fixed IPs and corresponding hostnames for each node in `/etc/hosts` to avoid node interconnection failures due to DNS issues.
- **Network Connectivity**: Verify network connectivity between all nodes in the cluster. **Confirm first** that network is not blocked, can ping each other normally, and RustFS default listening port (usually 9000) is open between all nodes ([Linux Install RustFS](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A)). If firewall is enabled, please open RustFS ports; can use `firewall-cmd` to add permanent `--add-port=9000/tcp` rules ([Linux Install RustFS](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A)). All nodes should use the same port number during deployment.
- **TLS/Certificates**: If planning to enable HTTPS access, check if system has root certificates installed (such as `/etc/ssl/certs/ca-bundle.crt`, etc.), and prepare server TLS certificates and private key files. Correctly specify certificate paths in RustFS configuration files to ensure normal encrypted communication between nodes and clients.
- **Dependency Packages**: Confirm that the Linux distribution has necessary dependencies installed, such as common GNU toolchain (`bash`, `glibc`, etc.) and cryptographic libraries (`openssl`/`gnutls`, etc.). Different distributions may lack certain packages, please install required libraries according to actual documentation or error prompts.

## Running User and Security Context

- **Dedicated Running User**: Recommend creating a **dedicated user** (such as `rustfs-user`) to run RustFS service ([Linux Install RustFS](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D)). This user doesn't need login shell permissions but should have owner permissions to RustFS data directories. Use `groupadd`/`useradd` to create user groups and users, and use `chown` to assign data directory ownership to this user ([Linux Install RustFS](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D)).
- **File Permissions**: Ensure RustFS binaries and all configuration files are readable/writable by the running user, and restrict access permissions to directories unrelated to other users. For example, place binaries in `/usr/local/bin` with `755` permissions, allowing only the running user to modify. Data directories should have `700` or `750` permissions, allowing only RustFS user or administrators to access.
- **SELinux/AppArmor**: If system has SELinux or AppArmor enabled, please set corresponding security policies for RustFS binaries and data paths. Can temporarily set SELinux to `Permissive` mode for testing, or use `semanage fcontext` to add rules; on Ubuntu, can modify AppArmor configuration files to allow access. If unfamiliar with these mechanisms, consider temporarily disabling them but evaluate security implications.
- **Systemd Service**: If using systemd to manage RustFS service, check if `User=`, `ExecStart=`, and other items in service unit files (`rustfs.service`) are correct. Ensure environment variables (such as log paths) are set correctly and enable automatic restart policies to increase stability.

## Other Considerations

- **Monitoring and Logging**: Although not strictly pre-deployment checks, recommend installing and configuring monitoring systems (such as Prometheus + Grafana) to collect RustFS metrics. Also check if log directories are writable and set appropriate log rotation policies to prevent unlimited log file growth.
- **Operations Tools**: RustFS open source version may include CLI clients or be compatible with third-party tools (such as AWS CLI, s3cmd, etc.).
- **Flexible Expansion**: RustFS supports plugin extensions and multiple deployment modes, can be flexibly adjusted according to business needs. For example, can add nodes or expand disk capacity later. Can start with simplest basic configuration during deployment, verify correctness, then enable advanced features.
- **Rollback Plan**: Before actual deployment, **confirm first** whether there are complete configuration backups and rollback plans. If environment doesn't match actual conditions or serious problems occur, can quickly restore system state.

The above checklist covers the main aspects that should be considered when deploying RustFS at the software level. Please have operations personnel check each item according to project requirements and environment characteristics, combining actual conditions to ensure servers meet conditions and are configured as required. After successful deployment, RustFS will provide efficient and reliable object storage services with its **flexible and customizable** characteristics and optimization for io_uring on modern Linux systems.
