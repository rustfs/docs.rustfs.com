import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
import { t as console_default } from "./console-BD9arb_L.js";
//#region content/installation/linux/single-node-single-disk.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "RustFS Single Node Single Disk Installation",
	"description": "Install RustFS on a single disk of a single server, data will be stored on this one disk."
};
var _markdown = "\n\n\n\n# Single Node Single Disk Mode (SNSD, Single Node Single Disk) [#single-node-single-disk-mode-snsd-single-node-single-disk]\n\n<div className=\"fd-steps\">\n  <div className=\"fd-step\">\n    ## Pre-Installation Reading [#1-pre-installation-reading]\n\n    This document contains RustFS single-node single-disk deployment mode.\n\n    1. Review the three installation startup modes:\n\n       * [Single Node Single Disk Mode (SNSD)](./single-node-single-disk.md)    (Current document)\n       * [Single Node Multiple Disk Mode (SNMD)](./single-node-multiple-disk.md)\n       * [Multiple Node Multiple Disk Mode (MNMD)](./multiple-node-multiple-disk.md)\n\n    2. [Pre-Installation Check](../checklists/index.md), ensure all items meet production guidance. If production standards are not needed, this guidance can be skipped;\n\n    > Single node single disk is suitable for low-density non-critical businesses. In production environments, it's recommended to have experience with data backup to avoid data risks.\n\n    1 server with only one data disk, all data falls into this one data disk.\n\n    Specific architecture diagram is as follows:\n\n    <Mermaid\n      chart=\"flowchart TD\n    S[Server Node] --> D1[(Disk1)]\n\n    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n    classDef disk fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    class S server\n    class D1 disk\"\n    />\n  </div>\n\n  <div className=\"fd-step\">\n    ## Prerequisites [#2-prerequisites]\n\n    1. Operating system version;\n    2. Firewall;\n    3. Memory conditions;\n    4. Time synchronization;\n    5. Capacity planning;\n    6. Disk planning;\n    7. File system selection;\n\n    ### 2.1. Operating System Version [#21-operating-system-version]\n\n    We recommend Linux kernel version 4.x and above. Because versions 5.x/6.x can achieve better IO throughput and network performance.\n\n    You can use Ubuntu 22.04 and RHEL8.x to install RustFS.\n\n    ### 2.2 Firewall [#22-firewall]\n\n    Linux systems have firewalls enabled by default. You can use the following command to check firewall status:\n\n    ```bash\n    systemctl status firewalld\n    ```\n\n    If your firewall status is \"active\", you can use the following commands to disable the firewall:\n\n    ```bash\n    systemctl stop firewalld\n    systemctl disable firewalld\n    ```\n\n    Or allow the RustFS ports — 9000 (S3 API) and 9001 (Console):\n\n    ```bash\n    firewall-cmd --zone=public --add-port=9000/tcp --permanent\n    firewall-cmd --zone=public --add-port=9001/tcp --permanent\n    firewall-cmd --reload\n    ```\n\n    All RustFS servers in the deployment **must** use the same listening port. If you're using port 9000, all ports on other servers need to be port 9000.\n\n    ### 2.3 Memory Conditions [#23-memory-conditions]\n\n    RustFS needs at least 2 GB of memory to run test environments, production environments need a minimum of 128 GB of memory.\n\n    ### 2.4 Time Synchronization [#24-time-synchronization]\n\n    Multi-node consistency must use time servers to maintain time consistency, otherwise there may be situations where services cannot start. Related time servers such as using `ntp`, `timedatectl`, or `timesyncd`.\n\n    RustFS needs time synchronization. You can use the following command to check time synchronization status:\n\n    ```bash\n    timedatectl status\n    ```\n\n    If the status is \"synchronized\", time synchronization is working properly.\n\n    ### 2.5 Capacity and EC Planning [#25-capacity-and-ec-planning]\n\n    When planning object storage capacity, we recommend you base it on:\n\n    * Initial data volume: How much data do you plan to migrate or store at once? (e.g., 500 TB)\n    * Data growth volume: Daily/weekly/monthly data growth capacity;\n    * Planning cycle: How long do you hope this hardware planning can support? (Recommendation: 3 years)\n    * Consider your company's hardware iteration and update cycles.\n\n    EC (Erasure Coding) planning is as follows:\n\n    | Scenario                        | Recommended Check Level | Description                                                                                                                  |\n    | ------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |\n    | Standard Production Environment | EC:4                    | Can tolerate up to 4 disk (or node) failures, achieving good balance between reliability and storage efficiency.             |\n    | High Availability Requirements  | EC:4 - 8                | Or higher, suitable for scenarios with extremely high data availability requirements, but will sacrifice more storage space. |\n    | Development Test Environment    | EC:2                    | Provides basic redundancy protection, suitable for non-critical businesses.                                                  |\n\n    ### 2.6 Disk Planning [#26-disk-planning]\n\n    Due to NFS generating phantom writes and lock issues under high IO conditions, **NFS is prohibited** as the underlying storage medium for RustFS. The official strongly recommends using &#x2A;*JBOD (Just a Bunch of Disks)** mode, which means simple disk bundling. This means exposing physical disks directly and independently to the operating system, with RustFS software layer responsible for data redundancy and protection.\n\n    Reasons are as follows:\n\n    * **Better Performance**: RustFS's Erasure Coding engine is highly optimized, able to directly read and write multiple disks concurrently, achieving higher throughput than hardware RAID controllers. Hardware RAID becomes a performance bottleneck.\n    * **Lower Cost**: No expensive RAID cards needed, reducing hardware procurement costs.\n    * **Simpler Management**: Unified disk management by RustFS, simplifying storage layer operations.\n    * **Faster Fault Recovery**: RustFS (healing) process is faster than traditional RAID rebuild, with less impact on cluster performance.\n\n    The official recommends using NVMe SSD as your storage medium on disks to ensure higher performance and throughput capabilities.\n\n    ### 2.7 File System Selection [#27-file-system-selection]\n\n    For disk file system formatting, RustFS strongly recommends using XFS file system on all disks used for storage. RustFS development and testing are based on XFS, ensuring optimal performance and stability. Avoid using other file systems such as ext4, BTRFS, or ZFS, as they may cause performance degradation or unpredictable issues.\n\n    RustFS is an object storage system designed for high concurrency and high performance. When clients upload or download large objects, RustFS will shard them and read/write in parallel to multiple disks in the erasure set (Erasure Set).\n\n    XFS advantages: XFS (eXtents File System) was designed from the beginning for high performance and scalability. It performs extremely well in large file processing and high-concurrency I/O scenarios. Its internal journal and data structures (such as B+ trees) can efficiently handle large numbers of parallel read/write requests, perfectly matching RustFS's working mode. In comparison, although file systems like ext4 have made great performance improvements in recent years, when facing extreme concurrent loads, XFS usually provides more stable and superior throughput.\n\n    Object storage typically needs to handle massive files and huge individual files (TB level). XFS is a 64-bit file system that can support extremely large file sizes (up to 8 EB) and file system scale. Its metadata management is very efficient, even when storing millions of files in a single directory, its performance degradation is much smaller than other file systems. This is crucial for RustFS's approach of storing each object (or version of an object) as an independent file on the backend file system.\n\n    When RustFS writes new objects or object versions, to ensure write performance and reduce file fragmentation, it performs space reservation. XFS provides an efficient API called fallocate, allowing applications to reserve a continuous block of disk space. RustFS leverages this feature to allocate required space for files before writing, avoiding performance overhead from dynamic expansion and metadata updates during the write process, while also minimizing file fragmentation to the greatest extent, ensuring subsequent read performance.\n\n    For better disk discovery, when formatting xfs file systems, we recommend using **Label** tags to mark disks.\n\n    First, you need to check the disk system situation:\n\n    ```bash\n    sudo lsblk\n\n    NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT\n    sda           8:0    0 465.7G  0 disk\n    ├─sda1        8:1    0   512M  0 part /boot/efi\n    └─sda2        8:2    0 465.2G  0 part /\n    nvme0n1           8:16   0   3.7T  0 disk  <-- if this is our format new disk\n    nvme1n1           8:32   0   3.7T  0 disk  <-- if this is our format new disk\n    nvme2n1          8:48   0   3.7T   0  disk\n    ```\n\n    Specific formatting command is as follows:\n\n    ```bash\n    sudo mkfs.xfs  -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb\n    ```\n\n    You can add the following options during formatting to optimize performance:\n\n    * -L \\<label>: Set a label for the file system, convenient for subsequent identification and mounting.\n    * -i size=512: RustFS officially recommends setting inode size to 512 bytes, which has performance advantages for scenarios storing large numbers of small objects (metadata).\n    * -n ftype=1: Enable ftype functionality. This allows the file system to record file types in directory structures, improving performance of operations like readdir and unlink, beneficial for RustFS.\n\n    Mounting:\n\n    ```bash\n    # write new line\n    vim /etc/fstab\n    LABEL=RUSTFS0 /data/rustfs0   xfs   defaults,noatime,nodiratime   0   0\n\n    #save & exit\n\n    # mount disk\n    sudo mount -a\n    ```\n  </div>\n\n  <div className=\"fd-step\">\n    ## Configure Username [#3-configure-username]\n\n    When RustFS starts, we recommend you configure a dedicated user without login permissions to start RustFS services. In the rustfs.service startup control script.\n\n    1. **Don't modify default startup account**: Default user and group are `root` and `root`. If you want to use the default `root` and `root`, no modifications are needed.\n    2. **Modify default startup account**: You can use groupadd and useradd commands to create users and groups, then modify the username and password in the systemctl startup configuration file.\n\n    The following example shows creating users, groups, and setting permissions to access RustFS specified data directories (optional):\n\n    ```bash\n    groupadd -r rustfs-user\n    useradd -M -r -g rustfs-user rustfs-user\n    chown rustfs-user:rustfs-user  /data/rustfs*\n    ```\n\n    <Callout type=\"info\">\n      * If rustfs-user user and group are created, you need to change User and Group in `/etc/systemd/system/rustfs.service` to `rustfs-user`;\n      * Adjust `/data/rustfs*` to the specified mount directory.\n    </Callout>\n  </div>\n\n  <div className=\"fd-step\">\n    ## Download Installation Package [#4-download-installation-package]\n\n    First, install wget or curl to download the rustfs installation package.\n\n    ```bash\n    # Download address\n    wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip\n    unzip rustfs-linux-x86_64-musl-latest.zip\n    chmod +x rustfs\n    mv rustfs /usr/local/bin/\n    ```\n  </div>\n\n  <div className=\"fd-step\">\n    ## Configure Environment Variables [#5-configure-environment-variables]\n\n    1. Create configuration file\n\n    ```bash\n    # Single node single disk mode\n    sudo tee /etc/default/rustfs <<EOF\n    # Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)\n    RUSTFS_ACCESS_KEY=<your-access-key>\n    RUSTFS_SECRET_KEY=<your-secret-key>\n    RUSTFS_VOLUMES=\"/data/rustfs0\"\n    RUSTFS_ADDRESS=\":9000\"\n    RUSTFS_CONSOLE_ENABLE=true\n    RUST_LOG=error\n    RUSTFS_OBS_LOG_DIRECTORY=\"/var/logs/rustfs/\"\n    EOF\n    ```\n\n    2. Create storage directories\n\n    ```bash\n    sudo mkdir -p /data/rustfs0 /var/logs/rustfs /opt/tls\n    sudo chmod -R 750 /data/rustfs* /var/logs/rustfs\n    ```\n  </div>\n\n  <div className=\"fd-step\">\n    ## Configure System Service [#6-configure-system-service]\n\n    1. Create systemd service file\n\n    ```bash\n    sudo tee /etc/systemd/system/rustfs.service <<EOF\n    [Unit]\n    Description=RustFS Object Storage Server\n    Documentation=https://rustfs.com/docs/\n    After=network-online.target\n    Wants=network-online.target\n\n    [Service]\n    Type=notify\n    NotifyAccess=main\n    User=root\n    Group=root\n\n    WorkingDirectory=/usr/local\n    EnvironmentFile=-/etc/default/rustfs\n    ExecStart=/usr/local/bin/rustfs \\$RUSTFS_VOLUMES\n\n    LimitNOFILE=1048576\n    LimitNPROC=32768\n    TasksMax=infinity\n\n    Restart=always\n    RestartSec=10s\n\n    OOMScoreAdjust=-1000\n    SendSIGKILL=no\n\n    # RustFS reports READY only after storage and peer checks pass; allow up to 120s.\n    TimeoutStartSec=120s\n    TimeoutStopSec=30s\n\n    NoNewPrivileges=true\n\n    ProtectHome=true\n    PrivateTmp=true\n    PrivateDevices=true\n    ProtectClock=true\n    ProtectKernelTunables=true\n    ProtectKernelModules=true\n    ProtectControlGroups=true\n    RestrictSUIDSGID=true\n    RestrictRealtime=true\n\n    # service log configuration\n    StandardOutput=append:/var/logs/rustfs/rustfs.log\n    StandardError=append:/var/logs/rustfs/rustfs-err.log\n\n    [Install]\n    WantedBy=multi-user.target\n    EOF\n    ```\n\n    2. Reload service configuration\n\n    ```bash\n    sudo systemctl daemon-reload\n    ```\n  </div>\n\n  <div className=\"fd-step\">\n    ## Start Service and Verification [#7-start-service-and-verification]\n\n    1. Start service and set auto-start on boot\n\n    ```bash\n    sudo systemctl enable --now rustfs\n    ```\n\n    2. Verify service status\n\n    ```bash\n    systemctl status rustfs\n    ```\n\n    3. Check service port\n\n    ```bash\n    netstat -ntpl\n    ```\n\n    4. View log files\n\n    ```bash\n    tail -f /var/logs/rustfs/rustfs*.log\n    ```\n\n    5. Access console\n\n    Enter the server's IP address and port (default port for the UI is 9001), try to access the console, the interface you see is as follows:\n\n        <img alt=\"Console\" src=\"__img0\" />\n  </div>\n</div>\n";
var structuredData = {
	"contents": [
		{
			"heading": "1-pre-installation-reading",
			"content": "This document contains RustFS single-node single-disk deployment mode."
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Review the three installation startup modes:"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Single Node Single Disk Mode (SNSD)    (Current document)"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Single Node Multiple Disk Mode (SNMD)"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Multiple Node Multiple Disk Mode (MNMD)"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Pre-Installation Check, ensure all items meet production guidance. If production standards are not needed, this guidance can be skipped;"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "> Single node single disk is suitable for low-density non-critical businesses. In production environments, it's recommended to have experience with data backup to avoid data risks."
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "1 server with only one data disk, all data falls into this one data disk."
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Specific architecture diagram is as follows:"
		},
		{
			"heading": "2-prerequisites",
			"content": "Operating system version;"
		},
		{
			"heading": "2-prerequisites",
			"content": "Firewall;"
		},
		{
			"heading": "2-prerequisites",
			"content": "Memory conditions;"
		},
		{
			"heading": "2-prerequisites",
			"content": "Time synchronization;"
		},
		{
			"heading": "2-prerequisites",
			"content": "Capacity planning;"
		},
		{
			"heading": "2-prerequisites",
			"content": "Disk planning;"
		},
		{
			"heading": "2-prerequisites",
			"content": "File system selection;"
		},
		{
			"heading": "21-operating-system-version",
			"content": "We recommend Linux kernel version 4.x and above. Because versions 5.x/6.x can achieve better IO throughput and network performance."
		},
		{
			"heading": "21-operating-system-version",
			"content": "You can use Ubuntu 22.04 and RHEL8.x to install RustFS."
		},
		{
			"heading": "22-firewall",
			"content": "Linux systems have firewalls enabled by default. You can use the following command to check firewall status:"
		},
		{
			"heading": "22-firewall",
			"content": "If your firewall status is \"active\", you can use the following commands to disable the firewall:"
		},
		{
			"heading": "22-firewall",
			"content": "Or allow the RustFS ports — 9000 (S3 API) and 9001 (Console):"
		},
		{
			"heading": "22-firewall",
			"content": "All RustFS servers in the deployment **must** use the same listening port. If you're using port 9000, all ports on other servers need to be port 9000."
		},
		{
			"heading": "23-memory-conditions",
			"content": "RustFS needs at least 2 GB of memory to run test environments, production environments need a minimum of 128 GB of memory."
		},
		{
			"heading": "24-time-synchronization",
			"content": "Multi-node consistency must use time servers to maintain time consistency, otherwise there may be situations where services cannot start. Related time servers such as using `ntp`, `timedatectl`, or `timesyncd`."
		},
		{
			"heading": "24-time-synchronization",
			"content": "RustFS needs time synchronization. You can use the following command to check time synchronization status:"
		},
		{
			"heading": "24-time-synchronization",
			"content": "If the status is \"synchronized\", time synchronization is working properly."
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "When planning object storage capacity, we recommend you base it on:"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Initial data volume: How much data do you plan to migrate or store at once? (e.g., 500 TB)"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Data growth volume: Daily/weekly/monthly data growth capacity;"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Planning cycle: How long do you hope this hardware planning can support? (Recommendation: 3 years)"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Consider your company's hardware iteration and update cycles."
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "EC (Erasure Coding) planning is as follows:"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Scenario"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Recommended Check Level"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Description"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Standard Production Environment"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "EC:4"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Can tolerate up to 4 disk (or node) failures, achieving good balance between reliability and storage efficiency."
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "High Availability Requirements"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "EC:4 - 8"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Or higher, suitable for scenarios with extremely high data availability requirements, but will sacrifice more storage space."
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Development Test Environment"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "EC:2"
		},
		{
			"heading": "25-capacity-and-ec-planning",
			"content": "Provides basic redundancy protection, suitable for non-critical businesses."
		},
		{
			"heading": "26-disk-planning",
			"content": "Due to NFS generating phantom writes and lock issues under high IO conditions, **NFS is prohibited** as the underlying storage medium for RustFS. The official strongly recommends using &#x2A;*JBOD (Just a Bunch of Disks)** mode, which means simple disk bundling. This means exposing physical disks directly and independently to the operating system, with RustFS software layer responsible for data redundancy and protection."
		},
		{
			"heading": "26-disk-planning",
			"content": "Reasons are as follows:"
		},
		{
			"heading": "26-disk-planning",
			"content": "**Better Performance**: RustFS's Erasure Coding engine is highly optimized, able to directly read and write multiple disks concurrently, achieving higher throughput than hardware RAID controllers. Hardware RAID becomes a performance bottleneck."
		},
		{
			"heading": "26-disk-planning",
			"content": "**Lower Cost**: No expensive RAID cards needed, reducing hardware procurement costs."
		},
		{
			"heading": "26-disk-planning",
			"content": "**Simpler Management**: Unified disk management by RustFS, simplifying storage layer operations."
		},
		{
			"heading": "26-disk-planning",
			"content": "**Faster Fault Recovery**: RustFS (healing) process is faster than traditional RAID rebuild, with less impact on cluster performance."
		},
		{
			"heading": "26-disk-planning",
			"content": "The official recommends using NVMe SSD as your storage medium on disks to ensure higher performance and throughput capabilities."
		},
		{
			"heading": "27-file-system-selection",
			"content": "For disk file system formatting, RustFS strongly recommends using XFS file system on all disks used for storage. RustFS development and testing are based on XFS, ensuring optimal performance and stability. Avoid using other file systems such as ext4, BTRFS, or ZFS, as they may cause performance degradation or unpredictable issues."
		},
		{
			"heading": "27-file-system-selection",
			"content": "RustFS is an object storage system designed for high concurrency and high performance. When clients upload or download large objects, RustFS will shard them and read/write in parallel to multiple disks in the erasure set (Erasure Set)."
		},
		{
			"heading": "27-file-system-selection",
			"content": "XFS advantages: XFS (eXtents File System) was designed from the beginning for high performance and scalability. It performs extremely well in large file processing and high-concurrency I/O scenarios. Its internal journal and data structures (such as B+ trees) can efficiently handle large numbers of parallel read/write requests, perfectly matching RustFS's working mode. In comparison, although file systems like ext4 have made great performance improvements in recent years, when facing extreme concurrent loads, XFS usually provides more stable and superior throughput."
		},
		{
			"heading": "27-file-system-selection",
			"content": "Object storage typically needs to handle massive files and huge individual files (TB level). XFS is a 64-bit file system that can support extremely large file sizes (up to 8 EB) and file system scale. Its metadata management is very efficient, even when storing millions of files in a single directory, its performance degradation is much smaller than other file systems. This is crucial for RustFS's approach of storing each object (or version of an object) as an independent file on the backend file system."
		},
		{
			"heading": "27-file-system-selection",
			"content": "When RustFS writes new objects or object versions, to ensure write performance and reduce file fragmentation, it performs space reservation. XFS provides an efficient API called fallocate, allowing applications to reserve a continuous block of disk space. RustFS leverages this feature to allocate required space for files before writing, avoiding performance overhead from dynamic expansion and metadata updates during the write process, while also minimizing file fragmentation to the greatest extent, ensuring subsequent read performance."
		},
		{
			"heading": "27-file-system-selection",
			"content": "For better disk discovery, when formatting xfs file systems, we recommend using **Label** tags to mark disks."
		},
		{
			"heading": "27-file-system-selection",
			"content": "First, you need to check the disk system situation:"
		},
		{
			"heading": "27-file-system-selection",
			"content": "Specific formatting command is as follows:"
		},
		{
			"heading": "27-file-system-selection",
			"content": "You can add the following options during formatting to optimize performance:"
		},
		{
			"heading": "27-file-system-selection",
			"content": "-L \\<label>: Set a label for the file system, convenient for subsequent identification and mounting."
		},
		{
			"heading": "27-file-system-selection",
			"content": "-i size=512: RustFS officially recommends setting inode size to 512 bytes, which has performance advantages for scenarios storing large numbers of small objects (metadata)."
		},
		{
			"heading": "27-file-system-selection",
			"content": "-n ftype=1: Enable ftype functionality. This allows the file system to record file types in directory structures, improving performance of operations like readdir and unlink, beneficial for RustFS."
		},
		{
			"heading": "27-file-system-selection",
			"content": "Mounting:"
		},
		{
			"heading": "3-configure-username",
			"content": "When RustFS starts, we recommend you configure a dedicated user without login permissions to start RustFS services. In the rustfs.service startup control script."
		},
		{
			"heading": "3-configure-username",
			"content": "**Don't modify default startup account**: Default user and group are `root` and `root`. If you want to use the default `root` and `root`, no modifications are needed."
		},
		{
			"heading": "3-configure-username",
			"content": "**Modify default startup account**: You can use groupadd and useradd commands to create users and groups, then modify the username and password in the systemctl startup configuration file."
		},
		{
			"heading": "3-configure-username",
			"content": "The following example shows creating users, groups, and setting permissions to access RustFS specified data directories (optional):"
		},
		{
			"heading": "3-configure-username",
			"content": ":::note"
		},
		{
			"heading": "3-configure-username",
			"content": "If rustfs-user user and group are created, you need to change User and Group in `/etc/systemd/system/rustfs.service` to `rustfs-user`;"
		},
		{
			"heading": "3-configure-username",
			"content": "Adjust `/data/rustfs*` to the specified mount directory."
		},
		{
			"heading": "3-configure-username",
			"content": ":::"
		},
		{
			"heading": "4-download-installation-package",
			"content": "First, install wget or curl to download the rustfs installation package."
		},
		{
			"heading": "5-configure-environment-variables",
			"content": "Create configuration file"
		},
		{
			"heading": "5-configure-environment-variables",
			"content": "Create storage directories"
		},
		{
			"heading": "6-configure-system-service",
			"content": "Create systemd service file"
		},
		{
			"heading": "6-configure-system-service",
			"content": "Reload service configuration"
		},
		{
			"heading": "7-start-service-and-verification",
			"content": "Start service and set auto-start on boot"
		},
		{
			"heading": "7-start-service-and-verification",
			"content": "Verify service status"
		},
		{
			"heading": "7-start-service-and-verification",
			"content": "Check service port"
		},
		{
			"heading": "7-start-service-and-verification",
			"content": "View log files"
		},
		{
			"heading": "7-start-service-and-verification",
			"content": "Access console"
		},
		{
			"heading": "7-start-service-and-verification",
			"content": "Enter the server's IP address and port (default port for the UI is 9001), try to access the console, the interface you see is as follows:"
		}
	],
	"headings": [
		{
			"id": "single-node-single-disk-mode-snsd-single-node-single-disk",
			"content": "Single Node Single Disk Mode (SNSD, Single Node Single Disk)"
		},
		{
			"id": "1-pre-installation-reading",
			"content": "1\\. Pre-Installation Reading"
		},
		{
			"id": "2-prerequisites",
			"content": "2\\. Prerequisites"
		},
		{
			"id": "21-operating-system-version",
			"content": "2.1. Operating System Version"
		},
		{
			"id": "22-firewall",
			"content": "2.2 Firewall"
		},
		{
			"id": "23-memory-conditions",
			"content": "2.3 Memory Conditions"
		},
		{
			"id": "24-time-synchronization",
			"content": "2.4 Time Synchronization"
		},
		{
			"id": "25-capacity-and-ec-planning",
			"content": "2.5 Capacity and EC Planning"
		},
		{
			"id": "26-disk-planning",
			"content": "2.6 Disk Planning"
		},
		{
			"id": "27-file-system-selection",
			"content": "2.7 File System Selection"
		},
		{
			"id": "3-configure-username",
			"content": "3\\. Configure Username"
		},
		{
			"id": "4-download-installation-package",
			"content": "4\\. Download Installation Package"
		},
		{
			"id": "5-configure-environment-variables",
			"content": "5\\. Configure Environment Variables"
		},
		{
			"id": "6-configure-system-service",
			"content": "6\\. Configure System Service"
		},
		{
			"id": "7-start-service-and-verification",
			"content": "7\\. Start Service and Verification"
		}
	]
};
var toc = [
	{
		depth: 1,
		url: "#single-node-single-disk-mode-snsd-single-node-single-disk",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Single Node Single Disk Mode (SNSD, Single Node Single Disk)" })
	},
	{
		depth: 2,
		url: "#1-pre-installation-reading",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Pre-Installation Reading" }),
		_step: 1
	},
	{
		depth: 2,
		url: "#2-prerequisites",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Prerequisites" }),
		_step: 2
	},
	{
		depth: 3,
		url: "#21-operating-system-version",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.1. Operating System Version" })
	},
	{
		depth: 3,
		url: "#22-firewall",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.2 Firewall" })
	},
	{
		depth: 3,
		url: "#23-memory-conditions",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.3 Memory Conditions" })
	},
	{
		depth: 3,
		url: "#24-time-synchronization",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.4 Time Synchronization" })
	},
	{
		depth: 3,
		url: "#25-capacity-and-ec-planning",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.5 Capacity and EC Planning" })
	},
	{
		depth: 3,
		url: "#26-disk-planning",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.6 Disk Planning" })
	},
	{
		depth: 3,
		url: "#27-file-system-selection",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.7 File System Selection" })
	},
	{
		depth: 2,
		url: "#3-configure-username",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Configure Username" }),
		_step: 3
	},
	{
		depth: 2,
		url: "#4-download-installation-package",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Download Installation Package" }),
		_step: 4
	},
	{
		depth: 2,
		url: "#5-configure-environment-variables",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Configure Environment Variables" }),
		_step: 5
	},
	{
		depth: 2,
		url: "#6-configure-system-service",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Configure System Service" }),
		_step: 6
	},
	{
		depth: 2,
		url: "#7-start-service-and-verification",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Start Service and Verification" }),
		_step: 7
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		blockquote: "blockquote",
		code: "code",
		div: "div",
		h1: "h1",
		h2: "h2",
		h3: "h3",
		img: "img",
		li: "li",
		ol: "ol",
		p: "p",
		pre: "pre",
		span: "span",
		strong: "strong",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	}, { Callout, Mermaid } = _components;
	if (!Callout) _missingMdxReference("Callout", true);
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h1, {
			id: "single-node-single-disk-mode-snsd-single-node-single-disk",
			children: "Single Node Single Disk Mode (SNSD, Single Node Single Disk)"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
			className: "fd-steps",
			children: [
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "1-pre-installation-reading",
							"data-fd-step": "1",
							children: "Pre-Installation Reading"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This document contains RustFS single-node single-disk deployment mode." }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Review the three installation startup modes:" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
									"\n",
									(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.a, {
										href: "./single-node-single-disk.md",
										children: "Single Node Single Disk Mode (SNSD)"
									}), "    (Current document)"] }),
									"\n",
									(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
										href: "./single-node-multiple-disk.md",
										children: "Single Node Multiple Disk Mode (SNMD)"
									}) }),
									"\n",
									(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
										href: "./multiple-node-multiple-disk.md",
										children: "Multiple Node Multiple Disk Mode (MNMD)"
									}) }),
									"\n"
								] }),
								"\n"
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.a, {
									href: "../checklists/index.md",
									children: "Pre-Installation Check"
								}), ", ensure all items meet production guidance. If production standards are not needed, this guidance can be skipped;"] }),
								"\n"
							] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Single node single disk is suitable for low-density non-critical businesses. In production environments, it's recommended to have experience with data backup to avoid data risks." }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "1 server with only one data disk, all data falls into this one data disk." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Specific architecture diagram is as follows:" }),
						(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart TD\n    S[Server Node] --> D1[(Disk1)]\n\n    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n    classDef disk fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    class S server\n    class D1 disk" })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "2-prerequisites",
							"data-fd-step": "2",
							children: "Prerequisites"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Operating system version;" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Firewall;" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Memory conditions;" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Time synchronization;" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Capacity planning;" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Disk planning;" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "File system selection;" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "21-operating-system-version",
							children: "2.1. Operating System Version"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "We recommend Linux kernel version 4.x and above. Because versions 5.x/6.x can achieve better IO throughput and network performance." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "You can use Ubuntu 22.04 and RHEL8.x to install RustFS." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "22-firewall",
							children: "2.2 Firewall"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Linux systems have firewalls enabled by default. You can use the following command to check firewall status:" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "systemctl"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " status"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " firewalld"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If your firewall status is \"active\", you can use the following commands to disable the firewall:" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "systemctl"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " stop"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " firewalld"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "systemctl"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " disable"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " firewalld"
										})
									]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Or allow the RustFS ports — 9000 (S3 API) and 9001 (Console):" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "firewall-cmd"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " --zone=public"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " --add-port=9000/tcp"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " --permanent"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "firewall-cmd"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " --zone=public"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " --add-port=9001/tcp"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " --permanent"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "firewall-cmd"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " --reload"
									})]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"All RustFS servers in the deployment ",
							(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "must" }),
							" use the same listening port. If you're using port 9000, all ports on other servers need to be port 9000."
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "23-memory-conditions",
							children: "2.3 Memory Conditions"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS needs at least 2 GB of memory to run test environments, production environments need a minimum of 128 GB of memory." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "24-time-synchronization",
							children: "2.4 Time Synchronization"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"Multi-node consistency must use time servers to maintain time consistency, otherwise there may be situations where services cannot start. Related time servers such as using ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "ntp" }),
							", ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "timedatectl" }),
							", or ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "timesyncd" }),
							"."
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS needs time synchronization. You can use the following command to check time synchronization status:" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-dark": "#B392F0"
									},
									children: "timedatectl"
								}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " status"
								})]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If the status is \"synchronized\", time synchronization is working properly." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "25-capacity-and-ec-planning",
							children: "2.5 Capacity and EC Planning"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "When planning object storage capacity, we recommend you base it on:" }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Initial data volume: How much data do you plan to migrate or store at once? (e.g., 500 TB)" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Data growth volume: Daily/weekly/monthly data growth capacity;" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Planning cycle: How long do you hope this hardware planning can support? (Recommendation: 3 years)" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Consider your company's hardware iteration and update cycles." }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "EC (Erasure Coding) planning is as follows:" }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
							(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Scenario" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Recommended Check Level" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Description" })
						] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Standard Production Environment" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "EC:4" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Can tolerate up to 4 disk (or node) failures, achieving good balance between reliability and storage efficiency." })
							] }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "High Availability Requirements" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "EC:4 - 8" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Or higher, suitable for scenarios with extremely high data availability requirements, but will sacrifice more storage space." })
							] }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Development Test Environment" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "EC:2" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Provides basic redundancy protection, suitable for non-critical businesses." })
							] })
						] })] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "26-disk-planning",
							children: "2.6 Disk Planning"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"Due to NFS generating phantom writes and lock issues under high IO conditions, ",
							(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "NFS is prohibited" }),
							" as the underlying storage medium for RustFS. The official strongly recommends using ",
							(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "JBOD (Just a Bunch of Disks)" }),
							" mode, which means simple disk bundling. This means exposing physical disks directly and independently to the operating system, with RustFS software layer responsible for data redundancy and protection."
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Reasons are as follows:" }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Better Performance" }), ": RustFS's Erasure Coding engine is highly optimized, able to directly read and write multiple disks concurrently, achieving higher throughput than hardware RAID controllers. Hardware RAID becomes a performance bottleneck."] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Lower Cost" }), ": No expensive RAID cards needed, reducing hardware procurement costs."] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Simpler Management" }), ": Unified disk management by RustFS, simplifying storage layer operations."] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Faster Fault Recovery" }), ": RustFS (healing) process is faster than traditional RAID rebuild, with less impact on cluster performance."] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The official recommends using NVMe SSD as your storage medium on disks to ensure higher performance and throughput capabilities." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "27-file-system-selection",
							children: "2.7 File System Selection"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "For disk file system formatting, RustFS strongly recommends using XFS file system on all disks used for storage. RustFS development and testing are based on XFS, ensuring optimal performance and stability. Avoid using other file systems such as ext4, BTRFS, or ZFS, as they may cause performance degradation or unpredictable issues." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is an object storage system designed for high concurrency and high performance. When clients upload or download large objects, RustFS will shard them and read/write in parallel to multiple disks in the erasure set (Erasure Set)." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "XFS advantages: XFS (eXtents File System) was designed from the beginning for high performance and scalability. It performs extremely well in large file processing and high-concurrency I/O scenarios. Its internal journal and data structures (such as B+ trees) can efficiently handle large numbers of parallel read/write requests, perfectly matching RustFS's working mode. In comparison, although file systems like ext4 have made great performance improvements in recent years, when facing extreme concurrent loads, XFS usually provides more stable and superior throughput." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Object storage typically needs to handle massive files and huge individual files (TB level). XFS is a 64-bit file system that can support extremely large file sizes (up to 8 EB) and file system scale. Its metadata management is very efficient, even when storing millions of files in a single directory, its performance degradation is much smaller than other file systems. This is crucial for RustFS's approach of storing each object (or version of an object) as an independent file on the backend file system." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "When RustFS writes new objects or object versions, to ensure write performance and reduce file fragmentation, it performs space reservation. XFS provides an efficient API called fallocate, allowing applications to reserve a continuous block of disk space. RustFS leverages this feature to allocate required space for files before writing, avoiding performance overhead from dynamic expansion and metadata updates during the write process, while also minimizing file fragmentation to the greatest extent, ensuring subsequent read performance." }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"For better disk discovery, when formatting xfs file systems, we recommend using ",
							(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Label" }),
							" tags to mark disks."
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "First, you need to check the disk system situation:" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "sudo"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " lsblk"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "NAME"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "        MAJ:MIN"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " RM"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "   SIZE"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " RO"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " TYPE"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " MOUNTPOINT"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "sda"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "           8:0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "    0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " 465.7G"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "  0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " disk"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "├─sda1"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "        8:1"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "    0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "   512M"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "  0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " part"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /boot/efi"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "└─sda2"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "        8:2"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "    0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " 465.2G"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "  0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " part"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "nvme0n1"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "           8:16"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "   0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "   3.7T"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "  0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " disk"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "  <"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "--"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " if"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " this"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " is"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " our"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " format"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " new"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " disk"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "nvme1n1"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "           8:32"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "   0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "   3.7T"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "  0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " disk"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "  <"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "--"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " if"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " this"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " is"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " our"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " format"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " new"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " disk"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "nvme2n1"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "          8:48"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "   0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "   3.7T"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "   0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "  disk"
										})
									]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Specific formatting command is as follows:" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "sudo"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " mkfs.xfs"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "  -i"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " size="
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "512"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " -n"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " ftype="
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "1"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " -L"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " RUSTFS0"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " /dev/sdb"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "You can add the following options during formatting to optimize performance:" }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "-L <label>: Set a label for the file system, convenient for subsequent identification and mounting." }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "-i size=512: RustFS officially recommends setting inode size to 512 bytes, which has performance advantages for scenarios storing large numbers of small objects (metadata)." }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "-n ftype=1: Enable ftype functionality. This allows the file system to record file types in directory structures, improving performance of operations like readdir and unlink, beneficial for RustFS." }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Mounting:" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: "# write new line"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "vim"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " /etc/fstab"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "LABEL"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "RUSTFS0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: " /data/rustfs0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "   xfs"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "   defaults,noatime,nodiratime"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "   0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "   0"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: "#save & exit"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: "# mount disk"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "sudo"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " mount"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " -a"
										})
									]
								})
							] })
						}) })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "3-configure-username",
							"data-fd-step": "3",
							children: "Configure Username"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "When RustFS starts, we recommend you configure a dedicated user without login permissions to start RustFS services. In the rustfs.service startup control script." }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Don't modify default startup account" }),
								": Default user and group are ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "root" }),
								" and ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "root" }),
								". If you want to use the default ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "root" }),
								" and ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "root" }),
								", no modifications are needed."
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Modify default startup account" }), ": You can use groupadd and useradd commands to create users and groups, then modify the username and password in the systemctl startup configuration file."] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The following example shows creating users, groups, and setting permissions to access RustFS specified data directories (optional):" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "groupadd"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " -r"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " rustfs-user"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "useradd"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " -M"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " -r"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " -g"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " rustfs-user"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " rustfs-user"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "chown"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " rustfs-user:rustfs-user"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "  /data/rustfs"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "*"
										})
									]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(Callout, {
							type: "info",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
									"If rustfs-user user and group are created, you need to change User and Group in ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/systemd/system/rustfs.service" }),
									" to ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs-user" }),
									";"
								] }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
									"Adjust ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/data/rustfs*" }),
									" to the specified mount directory."
								] }),
								"\n"
							] })
						})
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "4-download-installation-package",
							"data-fd-step": "4",
							children: "Download Installation Package"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "First, install wget or curl to download the rustfs installation package." }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: "# Download address"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "wget"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "unzip"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " rustfs-linux-x86_64-musl-latest.zip"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "chmod"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " +x"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " rustfs"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "mv"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " rustfs"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /usr/local/bin/"
										})
									]
								})
							] })
						}) })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "5-configure-environment-variables",
							"data-fd-step": "5",
							children: "Configure Environment Variables"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Create configuration file" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: "# Single node single disk mode"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "sudo"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " tee"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /etc/default/rustfs"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " <<"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "EOF"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "# Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RUSTFS_ACCESS_KEY=<your-access-key>"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RUSTFS_SECRET_KEY=<your-secret-key>"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RUSTFS_VOLUMES=\"/data/rustfs0\""
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RUSTFS_ADDRESS=\":9000\""
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RUSTFS_CONSOLE_ENABLE=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RUST_LOG=error"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RUSTFS_OBS_LOG_DIRECTORY=\"/var/logs/rustfs/\""
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "EOF"
									})
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "2",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Create storage directories" }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "sudo"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " mkdir"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " -p"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /data/rustfs0"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /var/logs/rustfs"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /opt/tls"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "sudo"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " chmod"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " -R"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " 750"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /data/rustfs"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "*"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /var/logs/rustfs"
										})
									]
								})
							] })
						}) })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "6-configure-system-service",
							"data-fd-step": "6",
							children: "Configure System Service"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Create systemd service file" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "sudo"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " tee"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /etc/systemd/system/rustfs.service"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " <<"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "EOF"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "[Unit]"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "Description=RustFS Object Storage Server"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "Documentation=https://rustfs.com/docs/"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "After=network-online.target"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "Wants=network-online.target"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "[Service]"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "Type=notify"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "NotifyAccess=main"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "User=root"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "Group=root"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "WorkingDirectory=/usr/local"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "EnvironmentFile=-/etc/default/rustfs"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "ExecStart=/usr/local/bin/rustfs "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "\\$"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "RUSTFS_VOLUMES"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "LimitNOFILE=1048576"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "LimitNPROC=32768"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "TasksMax=infinity"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "Restart=always"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RestartSec=10s"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "OOMScoreAdjust=-1000"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "SendSIGKILL=no"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "# RustFS reports READY only after storage and peer checks pass; allow up to 120s."
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "TimeoutStartSec=120s"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "TimeoutStopSec=30s"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "NoNewPrivileges=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "ProtectHome=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "PrivateTmp=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "PrivateDevices=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "ProtectClock=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "ProtectKernelTunables=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "ProtectKernelModules=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "ProtectControlGroups=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RestrictSUIDSGID=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RestrictRealtime=true"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "# service log configuration"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "StandardOutput=append:/var/logs/rustfs/rustfs.log"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "StandardError=append:/var/logs/rustfs/rustfs-err.log"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "[Install]"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "WantedBy=multi-user.target"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "EOF"
									})
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "2",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Reload service configuration" }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "sudo"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " systemctl"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " daemon-reload"
									})
								]
							}) })
						}) })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "7-start-service-and-verification",
							"data-fd-step": "7",
							children: "Start Service and Verification"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Start service and set auto-start on boot" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "sudo"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " systemctl"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " enable"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " --now"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " rustfs"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "2",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Verify service status" }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "systemctl"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " status"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " rustfs"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "3",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Check service port" }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-dark": "#B392F0"
									},
									children: "netstat"
								}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: " -ntpl"
								})]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "4",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "View log files" }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "tail"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " -f"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " /var/logs/rustfs/rustfs"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "*"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: ".log"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "5",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Access console" }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Enter the server's IP address and port (default port for the UI is 9001), try to access the console, the interface you see is as follows:" }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
							alt: "Console",
							src: console_default
						}) })
					]
				})
			]
		})
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime_react_server.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime_react_server.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
export { _markdown, MDXContent as default, frontmatter, structuredData, toc };
