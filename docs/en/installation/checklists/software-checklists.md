---
title: "Software Checklist"
description: "This article mainly explains software considerations when installing RustFS, including operating systems, binary packages, etc."
---

# RustFS Software Deployment Checklist

RustFS is a high-performance distributed object storage system that is 100% S3 protocol compatible, released under Apache 2.0 open-source license ([What is RustFS?](https://rustfs.com/docs/#:~:text=RustFS%E6%98%AF%E4%B8%80%E7%A7%8D%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%EF%BC%8C%E4%BD%BF%E7%94%A8Apache2%20%E8%AE%B8%E5%8F%AF%E8%AF%81%E5%8F%91%E8%A1%8C%E7%9A%84%E5%BC%80%E6%BA%90%E5%88%86%E5%B8%83%E5%BC%8F%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E3%80%82)). It is developed in Rust language with memory safety features and can run on multiple platforms (including Linux, Windows, MacOS, supporting x86/ARM architectures, flexible deployment and customizable with custom plugin extensions). To ensure stable and reliable production environment deployment, the following necessary check items are listed. Please **confirm first** whether the following settings are in place:

## System Requirements

- **Operating System**: Recommended to use long-term support versions of Linux (such as Ubuntu 20.04+/22.04, RHEL 8/9, etc.), with kernel version preferably 5.x or higher. RustFS can utilize `io_uring` asynchronous I/O optimization under Linux 5.x+ kernel, bringing better throughput performance.
- **CPU & Memory**: Supports mainstream CPU architectures like x86_64, ARM, etc. Test environment requires at least 2 GB memory, production environment recommends at least 64 GB memory ([Linux RustFS Installation](https://rustfs.com/docs/install/linux/#:~:text=2)). **Don't forget** to estimate required memory based on data scale and concurrency to avoid performance bottlenecks due to insufficient memory.
- **Disable Interfering Services**: For performance reasons, it's recommended to close or ignore services that scan/audit file systems (such as `mlocate`, `plocate`, `updatedb`, `auditd`, antivirus software, etc.), as these services may conflict with RustFS disk I/O. If they cannot be closed, RustFS data paths should also be excluded to avoid scanning affecting performance.

RustFS strongly recommends running on Linux 5.x or higher kernel versions, especially 5.10+ versions.
Why?

Because RustFS will prioritize using Linux's **io_uring** technology in the underlying I/O model, and io_uring was introduced starting from Linux 5.1 and became more mature and stable in 5.10+ versions. Compared to traditional epoll or thread pools, io_uring provides more efficient, low-latency asynchronous I/O capabilities, which are very suitable for high-concurrency object storage scenarios.

### Recommendations:

- Use mainstream enterprise distribution versions with 5.x kernels, for example:
 - Ubuntu 20.04 LTS (can install HWE kernel to get 5.15+)
 - Ubuntu 22.04 LTS (default 5.15+)
 - CentOS Stream 9 / RHEL 9
 - Debian 12 (default 6.x, even stronger)

- If you're still using old kernels (like 4.x), it's recommended to upgrade or use distributions that support custom kernels to fully leverage RustFS performance advantages.

## Binary Package Verification and Deployment

- **Official Download**: Always download server binary packages from RustFS official channels (such as official website or official mirrors), don't use software packages from unknown sources to prevent tampering.
- **Integrity Verification**: After downloading, **don't forget** to verify binary package integrity. Usually there will be official SHA256 checksums or signature files, which can be verified through `sha256sum` or signature verification tools to ensure files are not corrupted or tampered with.
- **Consistency**: For distributed deployments, ensure all nodes use the same version of RustFS binaries, otherwise compatibility issues may occur due to version differences.
- **Installation Location**: For convenient management, binaries can be moved to global execution paths (such as `/usr/local/bin`) and given executable permissions (`chmod +x`). If using systemd to manage services, confirm that paths in service files are correct.

## File System and Disk Layout

- **Dedicated Data Disks**: RustFS requires exclusive access to storage disks, don't mix system disks or other application data with RustFS data. It's recommended to use different disks or partitions for the operating system and RustFS data; **confirm first** whether data disk mount points are correct.
- **File System Type**: Recommended to use mature and high-performance file systems like XFS or Ext4, and add performance options when mounting (such as `noatime,nodiratime,nobarrier`, etc., adjust according to actual situations). This can reduce unnecessary I/O overhead and improve throughput.
- **Disk Configuration**: If using multiple disks, it's usually recommended to configure them as independent volumes (JBOD), letting RustFS itself ensure data reliability through mechanisms like erasure coding, rather than relying on hardware RAID, for more flexible storage capacity expansion.
- **Mount Options and Permissions**: Check mount parameters to ensure RustFS service running user has read-write permissions to data directories. You can add security options like `noexec`, `nodev` in `/etc/fstab`, while ensuring RustFS processes have permission to access.

## System Dependency Checks

- **Time Synchronization**: For multi-node deployments, **never forget** time synchronization. System time of all nodes must be consistent (use tools like `ntp`, `chrony`, `timedatectl` to synchronize time), otherwise cluster startup or data consistency anomalies may occur ([Linux RustFS Installation](https://rustfs.com/docs/install/linux/#:~:text=2)). Check if `timedatectl status` output shows "`synchronized`" ([Linux RustFS Installation](https://rustfs.com/docs/install/linux/#:~:text=2)).
- **Hostname and DNS**: Configure **continuous hostnames** for each node and ensure these hostnames can resolve to correct IPs. You can use DNS or `/etc/hosts` for configuration ([Linux RustFS Installation](https://rustfs.com/docs/install/linux/#:~:text=2)). For example, configure fixed IPs and corresponding hostnames for each node in `/etc/hosts` to avoid node interconnection failures due to DNS issues.
- **Network Connectivity**: Verify network connectivity between nodes in the cluster. **Confirm first** that the network is not blocked, can ping each other normally, and RustFS default listening ports (usually 9000) are unobstructed between all nodes ([Linux RustFS Installation](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A)). If firewall is enabled, please open RustFS ports; you can use `firewall-cmd` to add permanent rules with `--add-port=9000/tcp` ([Linux RustFS Installation](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A)). All nodes should use the same port number during deployment.
- **TLS/Certificates**: If planning to enable HTTPS access, check if the system has installed root certificates (such as `/etc/ssl/certs/ca-bundle.crt`, etc.), and prepare server TLS certificates and private key files. Correctly specify certificate paths in RustFS configuration files to ensure encrypted communication between nodes and client connections.
- **Dependency Software Packages**: Confirm that the Linux distribution being used has installed necessary dependencies, such as common GNU toolchains (`bash`, `glibc`, etc.) and encryption libraries (`openssl`/`gnutls`, etc.). Different distributions may lack certain packages, please install required libraries according to actual documentation or error prompts.

## Running User and Security Context

- **Dedicated Running User**: It's recommended to create a **dedicated user** (such as `rustfs-user`) for RustFS to run services ([Linux RustFS Installation](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D)). This user doesn't need login shell permissions but should have owner permissions to RustFS data directories. Please use `groupadd`/`useradd` to create user groups and users, and use `chown` to give data directory ownership to this user ([Linux RustFS Installation](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D)).
- **File Permissions**: Ensure RustFS binaries and all configuration files are readable and writable by the running user, and restrict access permissions for directories unrelated to other users. For example, put binaries in `/usr/local/bin` and set `755` permissions, only allowing running users to modify. Data directory permissions are recommended to be `700` or `750`, only allowing RustFS users or administrators to access.
- **SELinux/AppArmor**: If the system has SELinux or AppArmor enabled, please set corresponding security policies for RustFS binaries and data paths. You can temporarily set SELinux to `Permissive` mode for testing, or use `semanage fcontext` to add rules; on Ubuntu, you can modify AppArmor configuration files to allow access. If you don't understand these mechanisms, you can consider temporarily disabling them, but assess security impacts.
- **Systemd Service**: If using systemd to manage RustFS services, check whether items like `User=`, `ExecStart=` specified in service unit files (`rustfs.service`) are correct. Ensure environment variables (such as log paths, etc.) are set correctly, and enable automatic restart policies to increase stability.

## Other Considerations

- **Monitoring and Logging**: Although not strictly pre-deployment checks, it's recommended to install and configure monitoring systems (such as Prometheus + Grafana) to collect RustFS metrics. Also check if log directories are writable, and set appropriate log rotation policies to prevent log files from growing infinitely.
- **Operations Tools**: RustFS open-source version may come with CLI clients or be compatible with third-party tools (such as AWS CLI, s3cmd, etc.).
- **Flexible Expansion**: RustFS supports plugin extensions and multiple deployment modes, which can be flexibly adjusted according to business needs. For example, nodes can be added later or disk capacity can be expanded. During deployment, you can start with the simplest basic configuration, and after verification, enable advanced features.
- **Rollback Plan**: Before actual deployment, **confirm first** whether there are complete configuration backups and rollback plans. Once environment inconsistencies or serious problems are found, system status can be quickly restored.

The above checklist covers the main aspects that should be focused on when deploying RustFS at the software level. Please ask operations personnel to check item by item according to project requirements and environment characteristics, combined with actual situations, to ensure servers meet conditions and are configured as required. After successful deployment, RustFS will provide efficient and reliable object storage services with its **flexible and customizable** characteristics, as well as optimizations for io_uring on modern Linux systems.
