---
title: "站点复制"
description: "使用 rc 命令行客户端配置和运维多站点 RustFS 复制。"
---

站点复制连接两个或更多独立的 **RustFS** 部署。它在关联站点之间同步存储桶、对象版本以及受支持的身份和访问管理（IAM）数据。当应用需要写入不同的 RustFS 站点，同时保持存储和身份配置一致时，请使用此工作流程。

站点复制不同于[存储桶复制](/administration/data/bucket/replication)。存储桶复制是在选定存储桶之间建立的单向规则；站点复制则在完整的 RustFS 部署之间建立更广泛的关系。

:::warning[单独规划恢复]

站点复制是异步的。在一个站点成功写入，并不表示另一个站点已经拥有复制的版本。站点复制也不提供 DNS 故障转移、流量路由或应用恢复编排。

:::

## 复制的资源

RustFS 站点复制会在关联站点之间同步以下资源系列：

- 存储桶和对象版本，包括删除标记。
- 站点复制工作流程所需的存储桶元数据。
- IAM 用户、组、策略、策略映射和服务账户。

每个参与站点都必须支持存储桶版本控制。添加站点时，RustFS 会配置站点关系和底层复制目标。

## 要求

关联站点前，请准备：

- 两个或更多独立的 RustFS 部署，运行提供站点复制 Admin API 的发行版。
- 每个部署具有唯一且稳定的 S3 API 端点。
- 每个站点端点之间通过 S3 API 端口（通常为 `9000`）双向网络连通。
- 生产端点使用可信 TLS 证书。
- 安全管理主机上的 RustFS [`rc`](/operations/rc) 客户端。
- 每个参与站点的根管理凭证。
- 每个站点支持兼容的存储桶版本控制。

首次验证工作流程时，请使用空的测试站点。关联现有站点前，请盘点存储桶名称、对象锁定设置、IAM 身份和策略，以发现冲突。

:::warning[保护管理凭证]

`add` 操作会从本地 `rc` 别名存储中解析每个对等端点和根凭证。请仅从可信管理主机运行此操作，限制对本地 `rc` 配置的访问，并且不要将凭证写入 shell 历史记录、日志或屏幕截图。

:::

## 1. 配置站点别名

为每个站点配置一个别名。替换两个部署的端点和凭证：

```bash
rc alias set site1 https://site1.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias set site2 https://site2.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

检查两个站点均可访问且已就绪：

```bash
rc ready site1
rc ready site2
rc admin info cluster site1
rc admin info cluster site2
```

生产环境请使用 HTTPS 端点。如果站点使用私有证书颁发机构，请先在管理主机的信任存储中安装该证书颁发机构，再继续操作。

:::warning[环回端点仅用于测试]

作为出站请求安全控制，RustFS 默认拒绝环回复制目标。服务器选项 `RUSTFS_REPLICATION_ALLOW_LOOPBACK_TARGET=true` 仅用于单主机开发和自动化测试。切勿在生产环境中启用。

:::

## 2. 关联站点

在一条命令中提交所有参与的别名。第一个别名接收管理请求：

```bash
rc admin replicate add site1 site2
```

要创建包含两个以上站点的关系，请在初始命令中包含每个别名：

```bash
rc admin replicate add site1 site2 site3
```

请勿运行单独的成对 `add` 命令来构建同一个多站点关系。

至少从两个站点检查生成的配置：

```bash
rc admin replicate info site1
rc admin replicate info site2
```

输出通过部署 ID、站点名称和端点标识每个关联部署。请保存部署 ID，因为编辑和重新同步操作可以按准确的部署 ID 或准确的唯一名称选择站点。

## 3. 检查复制状态

请求默认的存储桶和 IAM 摘要：

```bash
rc admin replicate status site1
```

调查问题时选择特定状态部分：

```bash
rc admin replicate status site1 --buckets
rc admin replicate status site1 --users --groups --policies
rc admin replicate status site1 --metrics
```

从每个站点检查状态。来自 `site1` 的健康响应确认该站点对关系的视图，不能替代对其他部署的检查。

## 4. 验证数据和 IAM 复制

在第一个站点创建测试存储桶和对象：

```bash
rc bucket create site1/my-bucket
printf 'hello rustfs\n' > hello.txt
rc object copy hello.txt site1/my-bucket/hello.txt
```

轮询第二个站点，直到对象出现：

```bash
rc object stat site2/my-bucket/hello.txt
rc object copy site2/my-bucket/hello.txt ./hello-from-site2.txt
```

在认为数据路径验证通过之前，请比较下载的内容：

```bash
cmp hello.txt hello-from-site2.txt
```

要验证 IAM，请在一个站点创建临时用户并附加测试策略，然后在另一个站点检查用户和策略映射。验证后删除临时身份：

```bash
rc admin user add site1 replication-test <temporary-secret-key>
rc admin policy attach site1 readonly --user replication-test

rc admin user info site2 replication-test
rc admin policy entities site2 --user replication-test

rc admin user rm site1 replication-test
```

请使用随机生成的临时密钥，并且不要重复使用应用或管理员凭证。

## 5. 编辑站点

当关联站点的名称、端点或 TLS 信任设置发生变化时，请使用 `edit`。首先检查当前部署 ID 和名称：

```bash
rc admin replicate info site1
```

重命名站点：

```bash
rc admin replicate edit site1 \
	--site <deployment-id> \
	--name site2-dr \
	--yes
```

替换端点并保持 TLS 验证启用：

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--endpoint https://site2-dr.example.com:9000 \
	--verify-tls \
	--yes
```

对于私有证书颁发机构，请提供仅含证书的 PEM 包：

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--ca-cert ./site2-ca.pem \
	--yes
```

当端点迁移到使用系统信任存储所信任的证书时，清除之前配置的自定义 CA：

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--clear-ca-cert \
	--verify-tls \
	--yes
```

端点必须是没有路径、查询、片段或嵌入凭证的 HTTP 或 HTTPS 源。请优先使用可信证书，而不是 `--skip-tls-verify`。

## 6. 重新同步站点

修复不可用的站点后，或状态检查显示复制状态缺失时，请使用重新同步。为一个准确的对等站点启动重新同步：

```bash
rc admin replicate resync start site1 \
	--site <deployment-id> \
	--yes
```

读取上次持久化的重新同步快照：

```bash
rc admin replicate resync status site1 \
	--site <deployment-id>
```

仅当已确认应停止时，才取消选定的重新同步：

```bash
rc admin replicate resync cancel site1 \
	--site <deployment-id> \
	--yes
```

:::warning[重新同步状态不是实时进度]

当前 RustFS 重新同步状态端点返回最近启动或取消请求的持久化结果。它不会检查实时工作线程，其生命周期状态报告为未知。启动操作可能重叠，取消操作不具有幂等性，网络超时可能使修改结果未知。出现不明确的结果后，请先检查 `replicate info`、`replicate status` 和目标数据，再发出其他修改操作。

:::

## 7. 删除站点复制

删除站点会更改复制关系。它不提供应用切换，也不能证明所有排队对象都已到达。继续之前，请检查状态并保留所有必需数据。

删除一个命名站点：

```bash
rc admin replicate remove site1 --site site2-dr
```

重复 `--site`，在一个请求中删除多个命名站点：

```bash
rc admin replicate remove site1 \
	--site site2-dr \
	--site site3
```

解除完整的站点复制关系：

```bash
rc admin replicate remove site1 --all
```

从剩余部署验证结果：

```bash
rc admin replicate info site1
rc admin replicate status site1
```

## 故障排除

### 对等端点被拒绝

确认端点是可访问的 HTTP 或 HTTPS 源，并且不会解析为环回地址。对于生产环境，请使每个站点都可通过其稳定网络地址访问，并保持环回覆盖禁用。

### TLS 验证失败

确认端点证书包含对等主机名，并且颁发证书的证书颁发机构受信任。对于私有 CA 包，请使用 `replicate edit --ca-cert`。请勿将 `--skip-tls-verify` 作为永久修复方法。

### 修改操作超时

请勿立即重复 `add`、`edit`、`resync start`、`resync cancel` 或 `remove`。服务器可能已在客户端丢失响应前应用更改。请先检查关系和数据：

```bash
rc admin replicate info site1
rc admin replicate status site1
```

### 复制落后

检查每个部署的站点状态和指标，然后验证端点可访问性和存储就绪状态：

```bash
rc admin replicate status site1 --metrics
rc ready site1
rc ready site2
```

应用写入速度可能超过异步复制。请勿从单个状态样本推断恢复点目标；请测量工作负载下的延迟，并针对持续积压发出告警。

## 后续步骤

- 当您需要为选定存储桶进行单向复制，而不是建立完整站点关系时，请查看[存储桶复制](/administration/data/bucket/replication)。
- 监控每个站点的[集群状态和就绪状态](/operations/status-check)。
- 查看 [`rc` 命令指南](/operations/rc)，并保持客户端与 RustFS 服务器发行版一致。