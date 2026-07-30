---
title: "存储桶策略"
description: "使用 S3 API 创建、应用、检查和验证 RustFS 存储桶策略。"
---

RustFS 存储桶策略是直接附加到存储桶的 S3 兼容资源策略。使用它们可允许或拒绝访问存储桶及其中的对象，包括为公开下载提供受控的匿名访问。

## 概述

存储桶策略包含一条或多条语句，用于匹配主体、操作、资源和可选条件。RustFS 在允许存储操作前，会针对存储桶请求评估该策略。

存储桶策略和 IAM 策略的用途不同：

| 策略类型 | 附加到 | 常见用途 |
| --- | --- | --- |
| 存储桶策略 | 存储桶 | 授予公共访问权限、添加资源级限制，或授权访问某个存储桶。 |
| IAM 策略 | 用户或组 | 定义已验证身份可对一个或多个资源执行的操作。 |

显式 `Deny` 优先于 `Allow`。存储桶所有者仍可获取、替换或删除存储桶策略，避免拒绝语句永久锁定策略管理。

RustFS 实现标准 S3 操作 `PutBucketPolicy`、`GetBucketPolicy`、`GetBucketPolicyStatus` 和 `DeleteBucketPolicy`。

:::warning[公共策略]

包含 `"Principal": "*"` 的语句可授予无需身份验证的访问权限。请尽可能缩小操作和资源范围，并在生产环境使用策略前以匿名方式验证结果。

:::

## 配置

### 要求

- 应用策略前先创建目标存储桶。
- 使用 RustFS 凭证和区域 `us-east-1` 配置 AWS CLI。
- 使用有权执行所需策略管理操作的凭证。

设置可复用变量：

```bash
export RUSTFS_ENDPOINT=http://localhost:9000
export BUCKET_NAME=my-bucket
```

策略管理需要以下操作：

| 操作 | 所需操作权限 |
| --- | --- |
| 应用或替换策略 | `s3:PutBucketPolicy` |
| 读取策略 | `s3:GetBucketPolicy` |
| 读取公共状态 | `s3:GetBucketPolicyStatus` |
| 删除策略 | `s3:DeleteBucketPolicy` |

### 策略文档结构

存储桶策略使用版本 `2012-10-17` 和 `Statement` 数组：

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::my-bucket/public/*"]
		}
	]
}
```

存储桶 ARN 与对象 ARN 不同：

| 资源 | ARN 格式 | 操作示例 |
| --- | --- | --- |
| 存储桶 | `arn:aws:s3:::my-bucket` | `s3:ListBucket`、`s3:GetBucketLocation` |
| 对象 | `arn:aws:s3:::my-bucket/*` | `s3:GetObject`、`s3:PutObject`、`s3:DeleteObject` |

在对象 ARN 中使用前缀（如 `arn:aws:s3:::my-bucket/public/*`），可将访问权限限制到存储桶的一部分。完整的语句格式和支持的条件运算符请参阅[用户、组和策略](/security-compliance/iam/policies#policy-document-format)。

### 公共访问阻止

如果存储桶的公共访问阻止配置启用了 `BlockPublicPolicy`，RustFS 会拒绝包含通配符主体 `Allow` 语句的新策略。除非确实需要匿名访问，否则请保持启用此保护。

公共访问阻止不能替代细致的策略审查。现有的显式 `Deny` 仍会覆盖允许，已验证身份的请求也会继续根据 IAM 和存储桶策略进行评估。

## 使用

### 创建公共读取策略

创建仅允许从 `public/` 前缀匿名下载的策略：

```bash
cat > /tmp/my-bucket-policy.json <<'EOF'
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::my-bucket/public/*"]
		}
	]
}
EOF
```

此策略不允许匿名列出存储桶、上传、覆盖或删除对象。

### 应用策略

```bash
aws s3api put-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--policy file:///tmp/my-bucket-policy.json \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

应用另一个策略会替换完整的现有策略。更新前请获取并检查当前文档；系统不会自动合并语句。

### 读取策略

```bash
aws s3api get-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT" \
	--query Policy \
	--output text
```

RustFS 会保留提交的策略 JSON。如果策略不存在，API 会返回 `NoSuchBucketPolicy`。

### 检查公共状态

```bash
aws s3api get-bucket-policy-status \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

响应包含概要公共访问状态：

```json
{
	"PolicyStatus": {
		"IsPublic": false
	}
}
```

当前状态检查会检测匿名列出存储桶（`s3:ListBucket`）和上传（`s3:PutObject`）。仅公开对象下载的策略（如上面的 `public/` 示例）仍可能报告 `false`。请始终测试准确的匿名操作、对象前缀和条件，不要将此状态视为完整的访问分析。

### 删除策略

```bash
aws s3api delete-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

删除存储桶策略只会删除该资源策略。附加到用户和组的 IAM 策略保持不变。

## 验证

使用已验证身份的凭证上传测试对象：

```bash
printf 'hello from RustFS\n' > /tmp/hello.txt

aws s3api put-object \
	--bucket "$BUCKET_NAME" \
	--key public/hello.txt \
	--body /tmp/hello.txt \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

确认无需凭证即可下载允许访问的对象：

```bash
curl --fail-with-body \
	"${RUSTFS_ENDPOINT}/${BUCKET_NAME}/public/hello.txt"
```

然后确认允许范围之外的对象不是公开对象：

```bash
aws s3api put-object \
	--bucket "$BUCKET_NAME" \
	--key private/hello.txt \
	--body /tmp/hello.txt \
	--endpoint-url "$RUSTFS_ENDPOINT"

curl --fail-with-body \
	"${RUSTFS_ENDPOINT}/${BUCKET_NAME}/private/hello.txt"
```

第二个 `curl` 请求应以 `AccessDenied` 失败。还应测试依赖该策略的每种已验证身份用户角色，尤其是文档包含条件或显式拒绝语句时。

## 后续步骤

- [管理 IAM 策略](/security-compliance/iam/policies)
- [管理凭证](/operations/credentials)
- [配置审计日志](/security-compliance/audit-logs)