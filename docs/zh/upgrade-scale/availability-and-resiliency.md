---
title: "可用性和扩展性说明"
description: "本文将详细说明 RustFS 扩容相关的技术和说明。"
---

# 可用性和扩展性说明

## 扩容方案概述

RustFS 支持通过新增存储池（Server Pool）的方式实现横向扩容。每个新增的存储池必须满足：

1. 存储池内节点需使用**连续主机名**（如 node5-node8）
2. 单个存储池内必须使用**相同规格**的磁盘（类型/容量/数量）
3. 新增存储池需与现有集群保持**时间同步**和**网络互通**

![RustFS 架构图](./images/s2-1.png)

---

## 一、扩容前准备

### 1.1 硬件规划要求

| 项目 | 最低要求 | 推荐生产配置 |
|---------------|---------------------------|---------------------------|
| 节点数量 | 4 节点/存储池 | 4 - 8 节点/存储池 |
| 单节点内存 | 128 GB | 128 GB |
| 磁盘类型 | SSD | NVMe SSD |
| 单磁盘容量 | ≥1 TB | ≥4 TB |
| 网络带宽 | 10 Gbps | 25 Gbps |

### 1.2 系统环境检查

```bash
# 检查主机名连续性（新节点示例）
cat /etc/hosts
192.168.10.5 node5
192.168.10.6 node6
192.168.10.7 node7
192.168.10.8 node8

# 验证时间同步状态
timedatectl status | grep synchronized

# 检查防火墙规则（所有节点需开放 7000/7001 端口）
firewall-cmd --list-ports | grep 7000
```

---

## 二、扩容实施步骤

### 2.1 新节点基础配置

```bash
# 创建专用用户（所有新节点执行）
groupadd rustfs-user
useradd -M -r -g rustfs-user rustfs-user

# 创建存储目录（以 8 磁盘为例）
mkdir -p /data/rustfs{0..7}
chown -R rustfs-user:rustfs-user /data/rustfs*
```

### 2.2 安装 RustFS 服务

```bash
# 下载最新二进制包（版本号需与现有集群一致）
wget https://dl.rustfs.com/rustfs/v2.3.0/rustfs -O /usr/local/bin/rustfs
chmod +x /usr/local/bin/rustfs

# 创建配置文件（/etc/default/rustfs）
cat <<EOF > /etc/default/rustfs
RUSTFS_ROOT_USER=admin
RUSTFS_ROOT_PASSWORD=YourSecurePassword
RUSTFS_VOLUMES="/data/rustfs{0...7}"
RUSTFS_ADDRESS=":7000"
RUSTFS_CONSOLE_ADDRESS=":7001"
EOF
```

### 2.3 集群扩容操作

```bash
# 在所有现有节点更新配置（添加新存储池）
sed -i '/RUSTFS_VOLUMES/s|"$| http://node{5...8}:7000/data/rustfs{0...7}"|' /etc/default/rustfs

# 全局服务重启（所有节点同时执行）
systemctl restart rustfs.service
```

---

## 三、扩容后验证

### 3.1 集群状态检查

```bash
# 检查节点加入状态
curl -s http://node1:7001/cluster/nodes | jq .poolMembers

# 验证存储池分布
rc admin info cluster
```

### 3.2 数据均衡验证

```bash
# 查看数据分布比例（应接近各存储池容量占比）
watch -n 5 "rustfs-admin metrics | grep 'PoolUsagePercent'"
```

---

## 四、注意事项

1. **滚动重启禁止**：必须同时重启所有节点，避免出现数据不一致
2. **容量规划建议**：当存储使用率达到 70% 前应规划下次扩容
3. **性能调优建议**：

 ```bash
 # 调整内核参数（所有节点）
 echo "vm.swappiness=10" >> /etc/sysctl.conf
 echo "net.core.somaxconn=32768" >> /etc/sysctl.conf
 sysctl -p
 ```

---

## 五、故障排查指引

| 现象 | 检查点 | 修复命令 |
|---------------------------|---------------------------------|-------------------------------|
| 新节点无法加入集群 | 检查 7000 端口连通性 | `telnet node5 7000` |
| 数据分布不均衡 | 检查存储池容量配置 | `rustfs-admin rebalance start`|
| 控制台显示节点状态异常 | 验证时间同步状态 | `chronyc sources` |

> 提示：本文档基于 RustFS 最新版编写，扩容操作前请务必进行全量数据备份。生产环境建议联系 RustFS 技术支持工程师进行方案评审。
