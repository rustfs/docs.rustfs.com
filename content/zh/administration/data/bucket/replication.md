---
title: "存储桶复制"
description: "配置、验证和监控已启用版本控制的 RustFS 存储桶之间的异步复制。"
---

RustFS 存储桶复制会将选定的对象版本从源存储桶复制到目标存储桶。使用它可维护存储桶数据的远程副本、在部署之间分发对象，或为恢复工作流准备辅助副本。

## 概述

存储桶复制包含两层配置：

1. **远程目标**存储目标端点、存储桶、凭证和生成的目标 ARN。
2. S3 **复制配置**将规则附加到源存储桶，并引用该目标 ARN。

源存储桶和目标存储桶都必须启用版本控制。注册远程目标时，RustFS 会验证目标连接和目标存储桶的版本控制。如果已启用规则引用未知或过期的目标 ARN，RustFS 会拒绝该复制配置。

复制默认以异步方式进行。源端上传成功表示 RustFS 已接受源对象，并不表示目标副本已经完成。

规则可以按前缀或对象标签选择对象，并控制以下行为：

| 规则设置 | 行为 |
| --- | --- |
| `Status` | 启用或禁用规则。 |
| `Filter` | 按键前缀、对象标签或两者限制复制。 |
| `ExistingObjectReplication` | 设置为 `Enabled` 时，包括规则创建前已存在的对象。 |
| `DeleteMarkerReplication` | 设置为 `Enabled` 时，复制删除标记。 |
| `DeleteReplication` | 设置为 `Enabled` 时，复制特定对象版本的删除操作。 |
| `Destination` | 通过 ARN 标识已注册的远程目标。 |

存储桶复制是单向的。如果两个存储桶都必须接受写入并相互复制，请在相反方向配置单独的目标和规则。不要将存储桶复制与[站点复制](/operations/high-availability/site-replication)混淆，后者会同步更广泛的站点配置和身份数据。

## 配置

### 要求

- 一个源 RustFS 部署和一个可访问的 S3 兼容目标部署。
- 已启用版本控制的源存储桶和目标存储桶。
- 专用目标凭证，有权检查目标存储桶的版本控制，并写入复制的对象版本和删除标记。
- 有权管理远程目标和复制配置的源端管理员。
- 所有可能执行复制任务的源节点都能通过网络访问目标端点。
- 管理主机上已安装 RustFS [`rc`](/operations/rc) 客户端。

为每个部署配置一个 `rc` 别名。请使用专用凭证，并在运行命令前替换示例端点：

```bash
rc alias set source https://source.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias set target https://target.example.com:9000 \
	<target-access-key> <target-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias list
```

源部署注册远程目标时会使用目标别名凭证。`rc alias list` 会显示端点，但不会输出秘密密钥。

:::warning[保护目标凭证]

RustFS 会将目标凭证作为源存储桶远程目标配置的一部分进行存储。请使用访问范围仅限目标存储桶的专用凭证，不要重复使用根凭证。

:::

### 权限

源端管理使用以下策略操作权限：

| 操作 | 所需操作权限 |
| --- | --- |
| 注册、更新或删除远程目标 | `admin:SetBucketTarget` |
| 列出远程目标 | `admin:GetBucketTarget` |
| 读取复制指标 | `admin:GetReplicationMetrics` |
| 应用或删除复制配置 | `s3:PutReplicationConfiguration` |
| 读取复制配置 | `s3:GetReplicationConfiguration` |

目标凭证必须通过 RustFS 目标验证，该验证会检查存储桶访问、版本控制、复制对象写入、复制删除标记和对象版本删除。源存储桶启用对象锁定时，目标必须具有兼容的对象锁定支持。

### 创建存储桶并启用版本控制

创建源存储桶：

```bash
rc bucket create source/my-bucket
```

创建目标存储桶：

```bash
rc bucket create target/my-bucket-replica
```

为两个存储桶启用版本控制：

```bash
rc bucket version enable source/my-bucket
rc bucket version enable target/my-bucket-replica

rc bucket version info source/my-bucket
rc bucket version info target/my-bucket-replica
```

配置复制期间，不要暂停源存储桶的版本控制。

## 使用

### 在控制台中配置复制

RustFS 控制台将远程目标注册和复制规则配置合并在一个表单中。

1. 登录源部署的控制台。
2. 打开 **Buckets**，找到源存储桶并选择 **Settings**。
3. 在 **Data Protection** 下，如果 **Versioning** 已禁用，请将其启用。
4. 在 **Automation** 下，选择 **Open Bucket Replication**。
5. 选择 **Add Replication Rule**。
6. 配置目标和规则：

| 控制台字段 | 值 |
| --- | --- |
| **Priority** | 规则评估优先级。初始值为 `1`。 |
| **Mode** | 选择 **Asynchronous** 或 **Synchronous**。默认选择异步模式。 |
| **Endpoint** | 目标 S3 API 地址，格式为 `host:port`，不含 URL 方案。 |
| **Bucket** | 已启用版本控制的目标存储桶名称。 |
| **Access Key** 和 **Secret Key** | 有权复制到目标存储桶的专用凭证。 |
| **Region** | 目标区域。初始值为 `us-east-1`。 |
| **Storage Class** | 在目标端应用的存储类。初始值为 `STANDARD`。 |
| **Prefix** | 用于限制匹配对象的可选键前缀。 |
| **Tags** | 可选的对象标签名称和值筛选条件。选择 **Add Tag** 可添加更多筛选条件。 |
| **Use TLS** | 为目标连接启用 HTTPS。 |
| **Replicate Existing Objects** | 包括规则创建前的对象。默认启用。 |
| **Replicate Delete Markers** | 将删除标记复制到目标。默认启用。 |
| **Replicate Delete** | 复制特定对象版本的删除操作。默认启用。 |
| **Health Check Interval** | 目标健康检查间隔，以秒为单位。初始值为 `60`。 |
| **Bandwidth Limit** | 每个目标的传输限制，可选择 KiB/s、MiB/s 或 GiB/s。 |

7. 选择 **Save**。RustFS 会先验证源存储桶、目标连接、目标凭证和目标存储桶的版本控制，再接受该规则。
8. 返回 **Bucket Replication** 查看规则，或选择 **Refresh** 更新显示的状态。

:::warning[在两个部署上启用版本控制]

保存规则前，源存储桶和目标存储桶都必须启用版本控制。需要时，请登录目标部署的控制台，并在 **Buckets** → **Settings** → **Data Protection** 下启用版本控制。

:::

如需可重复的自动化或配置管理，请使用下面的 `rc` 工作流。

### 使用 rc 添加复制规则

创建异步规则，复制新对象和现有对象，并传播删除标记和显式版本删除：

```bash
rc bucket replication add source/my-bucket \
	--remote-bucket target/my-bucket-replica \
	--id replicate-all \
	--priority 1 \
	--replicate delete,delete-marker,existing-objects
```

`rc` 会注册目标、获取生成的 ARN，并在一次操作中应用复制规则。不需要某种行为时，请省略相应的 `--replicate` 标志。仅当写入必须等待同步复制时添加 `--sync`。

要将复制限制到某个前缀，请添加 `--prefix`：

```bash
rc bucket replication add source/my-bucket \
	--remote-bucket target/my-bucket-replica \
	--id replicate-documents \
	--priority 2 \
	--prefix documents/ \
	--replicate delete-marker,existing-objects
```

不匹配任何已启用规则的对象只会保留在源存储桶中。使用 `--bandwidth` 设置每秒字节数限制，使用 `--healthcheck-seconds` 更改目标健康检查间隔，使用 `--storage-class` 覆盖目标存储类。

### 列出和更新规则

列出活动规则：

```bash
rc bucket replication list source/my-bucket
rc bucket replication list source/my-bucket --json
```

按 ID 更新规则。只有提供的设置会被更改：

```bash
rc bucket replication update source/my-bucket \
	--id replicate-all \
	--priority 2 \
	--bandwidth 104857600 \
	--healthcheck-seconds 60
```

使用 `--status Enabled|Disabled` 启用或禁用规则，使用 `--sync true|false` 更改复制模式。

### 导出和导入配置

导出完整复制配置以供检查或备份：

```bash
rc bucket replication export source/my-bucket --json > replication.json
```

导出内容包括远程目标元数据和目标 Access Key，但不包括 Secret Key。请将该文件作为敏感配置加以保护。

导入之前导出的配置：

```bash
rc bucket replication import source/my-bucket replication.json
```

### 删除复制配置

```bash
rc bucket replication remove source/my-bucket --id replicate-all

# Remove every replication rule from the bucket.
rc bucket replication remove source/my-bucket --all
```

RustFS 还会删除被已删除配置引用的复制远程目标。它不会删除已复制到目标存储桶的对象或版本。请根据目标存储桶的生命周期和保留要求删除或保留这些对象。

:::note[rc 0.1.29 删除响应]

RustFS 删除复制配置及其目标后，`rc 0.1.29` 在尝试再次清理目标时可能会报告 `Remote target not found`。运行 `rc bucket replication list source/my-bucket --json`；空的 `rules` 数组可确认配置已删除。

:::

## 验证

### 检查目标就绪状态

创建规则前，`rc bucket replication add` 会检查源端访问、目标连接、目标凭证和存储桶版本控制。确认生成的目标和规则设置：

```bash
rc bucket replication list source/my-bucket --json
```

### 复制对象

将测试对象上传到源端：

```bash
printf 'hello from RustFS replication\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt source/my-bucket/hello.txt
```

检查源对象：

```bash
rc object stat source/my-bucket/hello.txt --json
```

复制默认以异步方式进行，因此目标对象可能不会立即出现。重复运行以下命令，直到成功：

```bash
rc object stat target/my-bucket-replica/hello.txt --json
rc object show target/my-bucket-replica/hello.txt
```

比较源对象和目标对象的 `etag` 与 `size_bytes` 值，然后确认 `object show` 返回预期内容。

要验证删除标记复制，请删除源对象并列出两个存储桶上的版本：

```bash
rc object remove source/my-bucket/hello.txt --force

rc bucket version list source/my-bucket/hello.txt --json
rc bucket version list target/my-bucket-replica/hello.txt --json
```

删除标记复制成功后，两个存储桶的最新条目均显示 `is_delete_marker: true`。

### 检查复制指标

```bash
rc bucket replication status source/my-bucket
rc bucket replication status source/my-bucket --json
```

该命令返回源节点当前的内存中复制统计信息。即使对象已到达目标端，指标仍可能为零，因此请将其与目标对象和版本检查结合使用，不要将其作为唯一验证信号。

### 排查故障

| 现象 | 检查项 |
| --- | --- |
| `bucket versioning must be enabled` | 在源存储桶上启用版本控制。 |
| 目标注册报告 `not versioned` | 在目标存储桶上启用版本控制。 |
| `replication target configuration not found` | 重新检查目标别名、凭证和目标存储桶，然后再次运行 `replication add`。 |
| 规则报告目标已过期 | 刷新规则列表并重试 `replication add`；如果问题仍然存在，请删除失败的配置并重新创建目标。 |
| 目标对象未出现 | 检查目标可访问性、凭证、目标配额和 `rc bucket replication status`。 |
| 复制失败 | 在源节点日志中检查目标 ARN 和对象键。 |
| 不允许删除目标 | 删除或替换复制配置后，再删除被引用的目标。 |

## 后续步骤

- [管理存储桶生命周期](../lifecycle-management.md)
- [配置存储桶配额](./quota.md)
- [配置可观测性](/operations/observability)