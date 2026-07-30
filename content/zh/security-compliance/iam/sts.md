---
title: "服务账户和 STS"
description: "介绍 RustFS 服务账户（派生访问密钥）以及通过 STS AssumeRole API 获取的临时凭证。"
---

RustFS 提供两种从现有身份派生凭证的机制：**服务账户**（由父用户拥有的长期访问密钥）和 **STS 临时凭证**（包含会话令牌的短期密钥）。

## 服务账户

服务账户是属于父 IAM 用户（或根账户）的访问密钥/秘密密钥对。它像普通密钥一样进行身份验证，但使用父身份的权限进行授权：

- **继承策略（默认）。** 如果创建服务账户时未提供策略，它会继承父用户的组合策略在请求时允许的所有权限。
- **会话绑定策略。** 如果创建时提供策略文档，该策略会嵌入服务账户。请求必须同时获得父用户策略和嵌入策略的允许。
- **过期时间。** 可以设置可选的过期时间戳（RFC 3339）；到达该时间后凭证将停止工作。

服务账户不能调用 `AssumeRole`，也不能将服务账户访问密钥转换为普通 IAM 用户。

在控制台中，通过**访问密钥**页面管理服务账户，请参阅[访问密钥管理](./access-token.md)。管理 API 提供以下端点：

| 操作 | 方法和路径 | 说明 |
| --- | --- | --- |
| 创建服务账户 | `PUT /rustfs/admin/v3/add-service-account` | 正文见下文。也可通过 `/add-service-accounts` 访问。需要 `admin:CreateServiceAccount` 才能为其他用户（`targetUser`）创建。 |
| 列出服务账户 | `GET /rustfs/admin/v3/list-service-accounts?user=<name>` | 列出其他用户的账户需要 `admin:ListServiceAccounts`。 |
| 批量列出访问密钥 | `GET /rustfs/admin/v3/list-access-keys-bulk` | 支持仅筛选用户、仅筛选服务账户或仅筛选 STS 密钥。 |
| 服务账户详情 | `GET /rustfs/admin/v3/info-service-account?accessKey=<key>` | 返回名称、描述、父身份、过期时间和会话策略（继承时返回 `impliedPolicy: true`）。 |
| 临时账户详情 | `GET /rustfs/admin/v3/temporary-account-info?accessKey=<key>` | 用于 STS 签发的密钥。 |
| 访问密钥详情 | `GET /rustfs/admin/v3/info-access-key?accessKey=<key>` | 统一查询用户、服务账户和 STS 密钥。 |
| 更新服务账户 | `POST /rustfs/admin/v3/update-service-account?accessKey=<key>` | 可以轮换秘密密钥，更改状态、名称、描述和过期时间，或替换策略。 |
| 删除服务账户 | `DELETE /rustfs/admin/v3/delete-service-account?accessKey=<key>` | 也可通过 `/delete-service-accounts` 访问。非管理员调用方只能删除自己的服务账户。 |

创建请求正文（除特别说明外，所有字段均可选）：

```json
{
  "policy": { "Version": "2012-10-17", "Statement": [] },
  "targetUser": "alice",
  "accessKey": "myserviceaccount",
  "secretKey": "mysecret",
  "name": "ci-pipeline",
  "description": "Key used by CI",
  "expiration": "2027-01-01T00:00:00Z"
}
```

:::note

省略 `accessKey`/`secretKey` 可让 RustFS 随机生成密钥对。省略 `policy` 可创建继承策略的服务账户。使用 `targetUser` 需要管理员权限；普通用户为自己创建服务账户。

:::

## STS 临时凭证

RustFS 在服务器根路径实现了与 AWS 兼容的 STS 端点（使用表单编码参数的 `POST /`）。支持两种操作：

- `AssumeRole`：用于现有 IAM 身份，使用 SigV4 签名。
- `AssumeRoleWithWebIdentity`：用于 OIDC 身份，通过 JWT 本身进行身份验证（请参阅[外部身份（OIDC）](../oidc/index.md)）。

### AssumeRole

请求必须由长期 IAM 凭证签名（AWS Signature V4），临时凭证和服务账户不能调用 `AssumeRole`。调用身份还需要其策略允许 `sts:AssumeRole` 操作（所有内置策略均包含此操作）。

表单参数：

| 参数 | 必需 | 描述 |
| --- | --- | --- |
| `Action` | 是 | `AssumeRole`。 |
| `Version` | 是 | 必须为 `2011-06-15`。 |
| `DurationSeconds` | 否 | 凭证有效期（秒）。默认为 3600（1 小时）；值会被限制在 900（15 分钟）到 43200（12 小时）范围内。 |
| `Policy` | 否 | 进一步限制临时凭证的内联会话策略（JSON）。 |
| `RoleArn`, `RoleSessionName`, `ExternalId` | 否 | 为兼容 AWS 而接受。 |

示例：

```bash
curl -s -X POST "https://rustfs.example.com/" \
  --user "$ACCESS_KEY:$SECRET_KEY" \
  --aws-sigv4 "aws:amz:us-east-1:s3" \
  -d "Action=AssumeRole" \
  -d "Version=2011-06-15" \
  -d "DurationSeconds=3600"
```

响应是一个 XML `AssumeRoleResponse`，包含 `AccessKeyId`、`SecretAccessKey`、`SessionToken` 和 `Expiration`。后续 S3 请求需使用全部三个凭证值（会话令牌放在 `X-Amz-Security-Token` 中）。

临时凭证继承调用方的策略；凭证的 `parent` 是发起调用的访问密钥。如果提供了 `Policy` 参数，该参数会存储在会话中并作为额外限制应用。

### AssumeRoleWithWebIdentity

用于 OIDC 流程；由于使用身份提供商的 JWT 进行身份验证，因此不需要 SigV4 签名：

| 参数 | 必需 | 描述 |
| --- | --- | --- |
| `Action` | 是 | `AssumeRoleWithWebIdentity`。 |
| `Version` | 是 | 必须为 `2011-06-15`。 |
| `WebIdentityToken` | 是 | 由已配置提供商签发的 OIDC ID 令牌。 |
| `DurationSeconds` | 否 | 默认值和 900–43200 范围限制与 `AssumeRole` 相同。 |
| `Policy` | 否 | 可选的内联会话策略。 |

RustFS 根据配置的提供商验证令牌（签名、签发者、受众、有效期），将令牌的 `groups`/`roles` 声明映射到 RustFS 策略名称；如果无法映射到任何策略或组，则拒绝请求。响应是 XML `AssumeRoleWithWebIdentityResponse`，包含相同的凭证字段以及 `SubjectFromWebIdentityToken`。

:::warning

请根据工作负载的实际需要，将 `DurationSeconds` 设置得尽可能短；泄露的临时凭证在过期前仍然有效。

:::