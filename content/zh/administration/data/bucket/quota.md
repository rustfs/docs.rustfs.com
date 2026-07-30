---
title: "存储桶配额"
description: "为单个 RustFS 存储桶配置、检查和验证硬存储配额。"
---

RustFS 存储桶配额限制单个存储桶中存储的对象数据总量。使用配额可防止一个工作负载占用超过分配的容量，同时允许其他存储桶使用剩余存储空间。

## 概述

RustFS 目前支持基于字节的硬配额。接受写入前，RustFS 会将存储桶当前用量加上请求的对象大小，并与配置的限制比较。超过限制的写入会被拒绝，并返回 `InvalidRequest` 和 `Bucket quota exceeded` 消息。

配额检查涵盖以下操作：

| 操作 | 配额行为 |
| --- | --- |
| 上传对象 | 当前用量加对象大小超过限制时拒绝上传。 |
| 完成分段上传 | 提交上传前检查完成后的对象大小。 |
| 将对象复制到存储桶 | 根据目标存储桶配额检查源对象大小。 |
| 删除对象 | 始终允许，以便释放容量。 |

配额适用于对象数据，而不是对象数量或请求速率。未配置限制的存储桶不受容量限制。

:::note[替换上传]

配额检查会根据存储桶当前用量为传入对象的完整大小预留空间。因此，替换现有键可能需要足以容纳整个替换对象的可用空间。

:::

## 在控制台中配置

1. 登录 RustFS 控制台并打开 **Browser**。
2. 找到存储桶并选择 **Settings**。
3. 在 **Capacity & Metadata** 下找到 **Bucket Quota**，然后选择 **Edit**。
4. 启用 **Bucket Quota**。
5. 输入配额大小并选择 **MiB**、**GiB**、**TiB** 或 **PiB**。
6. 选择 **Save Quota**。

![包含配额大小和单位控件的存储桶配额设置对话框](./images/bucket-quota-console.png)

如需取消限制，请再次打开对话框，禁用 **Bucket Quota** 并保存更改。

## 使用 rc

为 RustFS 部署配置别名：

```bash
rc alias set rustfs http://localhost:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

当 `rc` 在其他主机上运行时，请将 `localhost` 替换为 RustFS 服务器地址。

### 权限

配额操作需要以下策略操作权限：

| 操作 | 所需操作权限 |
| --- | --- |
| 设置或清除配额 | `admin:SetBucketQuota` |
| 读取配额配置或统计信息 | `s3:GetBucketQuota` |
| 检查建议操作是否符合配额 | `s3:GetBucketQuota` |

根凭证拥有这些权限。进行委派管理时，只附加工作流所需的操作权限。

### 设置配额

设置 1 GiB 硬配额。`rc` 接受字节值或 `1G`、`500M` 和 `10KB` 等单位：

```bash
rc bucket quota set rustfs/my-bucket 1G
```

响应包含配置的限制和当前用量：

```text
Bucket: my-bucket
Quota: 1 GiB
Usage: 0 B
Type:  HARD
```

### 读取配额

```bash
rc bucket quota info rustfs/my-bucket
```

其他工具需要处理结果时，请使用 `--json`：

```bash
rc bucket quota info rustfs/my-bucket --json
```

未配置限制时，人类可读输出会报告 `Quota: unlimited`。

:::note[配置传播]

设置或清除配额后立即查询，可能会短暂返回之前的状态。开始验证工作流前，请再次查询配额并确认值符合预期。

:::

### 清除配额

删除限制但不删除对象：

```bash
rc bucket quota clear rustfs/my-bucket
rc bucket quota info rustfs/my-bucket
```

应用配置更改后，存储桶将不再受容量限制。

## 高级配额检查

`rc 0.1.29` 不提供详细用量统计或建议写入检查命令。请使用 RustFS Admin API 执行这些操作。请求必须使用 AWS Signature Version 4 和有效的 RustFS 凭证。

示例使用以下 shell 变量：

```bash
export RUSTFS_ENDPOINT=http://localhost:9000
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>
export BUCKET_NAME=my-bucket
```

:::warning[保护凭证]

环境变量便于本地测试，但可能对以同一操作系统用户身份运行的进程可见。生产环境请使用平台的密钥管理器或权限受限的凭证文件。

:::

### 读取详细用量统计信息

使用统计端点获取限制、当前用量、剩余字节数和已用百分比：

```bash
curl --fail-with-body \
	--aws-sigv4 "aws:amz:us-east-1:s3" \
	--user "${RUSTFS_ACCESS_KEY}:${RUSTFS_SECRET_KEY}" \
	"${RUSTFS_ENDPOINT}/rustfs/admin/v3/quota-stats/${BUCKET_NAME}"
```

```json
{
	"bucket": "my-bucket",
	"quota_limit": 1073741824,
	"current_usage": 1048576,
	"remaining_quota": 1072693248,
	"usage_percentage": 0.09765625
}
```

用量值来自 RustFS 数据用量统计。将统计响应用于外部计费或编排前，请留出时间让该视图反映最近的更改。

### 检查建议上传

在不写入对象的情况下，检查 64 MiB 上传是否符合配额：

```bash
curl --fail-with-body \
	--aws-sigv4 "aws:amz:us-east-1:s3" \
	--user "${RUSTFS_ACCESS_KEY}:${RUSTFS_SECRET_KEY}" \
	--request POST \
	--header "Content-Type: application/json" \
	--data '{"operation_type":"PUT","operation_size":67108864}' \
	"${RUSTFS_ENDPOINT}/rustfs/admin/v3/quota-check/${BUCKET_NAME}"
```

`allowed` 字段报告判定结果。此检查仅供参考：另一个写入可能在计划的上传开始前消耗容量，因此实际上传结果才是最终依据。

## 验证

设置较小的测试配额，上传一个符合配额的对象，然后尝试上传超过剩余容量的对象：

```bash
rc bucket quota set rustfs/my-bucket 1M

dd if=/dev/zero of=/tmp/quota-small.bin bs=1024 count=256
dd if=/dev/zero of=/tmp/quota-large.bin bs=1048576 count=2

rc object copy /tmp/quota-small.bin rustfs/my-bucket/hello.bin
rc object copy /tmp/quota-large.bin rustfs/my-bucket/too-large.bin
```

256 KiB 对象可成功上传。2 MiB 对象超过 1 MiB 存储桶配额，因此 `rc` 会报错退出，RustFS 不会创建 `too-large.bin`。

删除第一个对象并清除测试配额：

```bash
rc object remove rustfs/my-bucket/hello.bin --force
rc bucket quota clear rustfs/my-bucket
rc bucket quota info rustfs/my-bucket
```

确认最终查询报告 `Quota: unlimited`。

如果配额执行无法读取或解析其内部配置，RustFS 会记录 `Bucket quota check degraded to allow` 并允许写入。请监控此警告，因为它表示配额执行暂时不可用。

## 后续步骤

- [创建存储桶](./creation.md)
- [管理生命周期规则](../lifecycle-management.md)
- [配置可观测性](/operations/observability)