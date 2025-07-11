---
title: "Linux 安装 RustFS"
description: "使用 Linux 操作系统安装 RustFS 的快速指导"
---

# Linux 安装 RustFS


## 一、安装前必读

本页面包含了 RustFS 的三种安装模式的全部文档和说明。其中，多机多盘的模式包含了企业级可用的性能、安全性和扩展性。并且，提供了生产工作负载需要的架构图。
请装前请阅读，我们的启动模式与检查清单，如下：

1. 启动模式，前明确您的 Linux 启动模式；

2. 检查清单，检查各项指标是否符合生产指导特征，若不需要生产标准可不阅读此指导；


## 二、先决条件

1. 操作系统版本；

2. 防火墙；

3. 主机名；

4. 内存条件；

5. 时间同步；

6. 容量规划；

7. 磁盘规划；

8. 容量规划；

9. 数据分层规划。

### 2.1. 操作系统版本

我们推荐 Linux 内核为 4.x 及以上的版本，但是 5.x 及以上的版本可以获得更好的 IO 吞吐和网络性能。

您可以使用 Ubuntu 22.04 和 RHEL8.x 来安装 RustFS。

### 2.2 防火墙

Linux 系统默认开启防火墙，您可以使用以下命令查看防火墙状态：

```bash
systemctl status firewalld
```

如果您的防火墙状态为“active”，您可以使用以下命令禁用防火墙：

```bash
systemctl stop firewalld
systemctl disable firewalld
```

或者放行 RustFS 的 9000 端口：

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```
部署中的所有 RustFS 服务器 **必须** 使用相同的监听端口。如果您使用的是 9000 端口，其他服务器的所有端口均需要为 9000 端口。




### 2.3 主机名

创建 RustFS 集群必须要使用 **相同的、具备连续性** 的主机名。有两种方式实现连续性的主机名：

1. DNS 配置；

2. HOSTS 配置。


```bash

vim /etc/hosts
127.0.0.1 localhost localhost.localdomain localhost4 localhost4.localdomain4
::1 localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```



### 2.4 内存条件

RustFS 需要至少 2 GB 的内存来运行测试环境，生产的环境最低需要 64 GB 的内存。

### 2.5 时间同步

多节点的一致性必须要使用时间服务器维护时间的一致性，不然可能会出现无法启动服务的情况。相关时间服务器例如使用 `ntp` , `timedatectl` , 或者 `timesyncd` 。

RustFS 需要时间同步，您可以使用以下命令检查时间同步状态：

```bash
timedatectl status
```

如果状态为“synchronized”，则表示时间同步正常。




## 三、配置用户名

RustFS 启动，我们建议您配置一个专门的无登录权限的用户进行启动 RustFS 的服务。在 rustfs.service 启动控制脚本中，默认的用户和用户组是 `rustfs-user` 和 `rustfs-user` 。

您可以使用 groupadd 和 useradd 命令创建用户和组。以下示例创建用户、组并设置权限以访问 RustFS 指定的数据目录。

## 四、下载安装包

请先安装 wge 或者 curl 下载 rustfs 安装包。

```bash
# 下载地址
wget https://dl.rustfs.com/rustfs/rustfs
chmod +x rustfs
mv rustfs /usr/local/bin/
```



### 五、配置环境变量
1. 创建配置文件 


```bash
sudo tee /etc/default/rustfs <<EOF
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:9000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_ENDPOINT=""
RUSTFS_TLS_PATH="/opt/tls"
EOF
```

2. 创建存储目录
```bash
sudo mkdir -p /data/rustfs{0..3} /var/logs/rustfs /opt/tls
sudo chmod -R 750 /data/rustfs* /var/logs/rustfs
```

### 六、配置可观测性系统
1. 创建观测配置文件
```
export RUSTFS_OBS_ENDPOINT=http://localhost:4317 # OpenTelemetry Collector 的地址
export RUSTFS_OBS_USE_STDOUT=false # 是否使用标准输出
export RUSTFS_OBS_SAMPLE_RATIO=2.0 # 采样率，0.0-1.0之间，0.0表示不采样，1.0表示全部采样
export RUSTFS_OBS_METER_INTERVAL=1 # 采样间隔，单位为秒
export RUSTFS_OBS_SERVICE_NAME=rustfs # 服务名称
export RUSTFS_OBS_SERVICE_VERSION=0.1.0 # 服务版本
export RUSTFS_OBS_ENVIRONMENT=develop # 环境名称
export RUSTFS_OBS_LOGGER_LEVEL=debug # 日志级别，支持 trace, debug, info, warn, error
export RUSTFS_OBS_LOCAL_LOGGING_ENABLED=true # 是否启用本地日志记录
# 日志目录 当 `RUSTFS_OBS_ENDPOINT` 值为空时，默认执行下面的日志处理规则
export RUSTFS_OBS_LOG_DIRECTORY="$current_dir/deploy/logs" # Log directory
export RUSTFS_OBS_LOG_ROTATION_TIME="minute" # Log rotation time unit, can be "second", "minute", "hour", "day"
export RUSTFS_OBS_LOG_ROTATION_SIZE_MB=1 # Log rotation size in MB

# 配置日志记录
export RUSTFS_SINKS_FILE_PATH="$current_dir/deploy/logs/rustfs.log"
export RUSTFS_SINKS_FILE_BUFFER_SIZE=12
export RUSTFS_SINKS_FILE_FLUSH_INTERVAL_MS=1000
export RUSTFS_SINKS_FILE_FLUSH_THRESHOLD=100
```

2. 设置日志轮转
```bash
sudo tee /etc/logrotate.d/rustfs <<EOF
/var/logs/rustfs/*.log {
 daily
 rotate 7
 missingok
 notifempty
 compress
 delaycompress
 sharedscripts
 postrotate
 systemctl restart rustfs >/dev/null 2>&1 || true
 endscript
}
EOF
```

### 七、配置系统服务
1. 创建 systemd 服务文件
```bash
sudo tee /etc/systemd/system/rustfs.service <<EOF
[Unit]
Description=RustFS Object Storage Server
Documentation=https://rustfs.com/docs/
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
NotifyAccess=main
User=root
Group=root

WorkingDirectory=/usr/local
EnvironmentFile=-/etc/default/rustfs
ExecStart=/usr/local/bin/rustfs \$RUSTFS_VOLUMES

LimitNOFILE=1048576
LimitNPROC=32768
TasksMax=infinity

Restart=always
RestartSec=10s

OOMScoreAdjust=-1000
SendSIGKILL=no

TimeoutStartSec=30s
TimeoutStopSec=30s

NoNewPrivileges=true
ProtectSystem=full
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectClock=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictRealtime=true

# service log configuration
StandardOutput=append:/var/logs/rustfs/rustfs.log
StandardError=append:/var/logs/rustfs/rustfs-err.log

[Install]
WantedBy=multi-user.target
EOF
```

2. 重新加载服务配置
```bash
sudo systemctl daemon-reload
```

### 八、启动服务与验证
1. 启动服务并设置开机自启
```bash
sudo systemctl enable --now rustfs
```

2. 验证服务状态
```bash
systemctl status rustfs
```

3. 检查服务端口
```bash
```

4. 验证控制台访问
```bash
curl -u rustfsadmin:rustfsadmin http://localhost:9000/
```

5. 查看日志文件
```bash
tail -f /var/logs/rustfs/app.log
```

6. 测试存储接口（示例）
```bash
curl -X PUT -u rustfsadmin:rustfsadmin \
-H "Content-Type: application/octet-stream" \
--data-binary @testfile \
http://localhost:9000/bucket1/object1
```


