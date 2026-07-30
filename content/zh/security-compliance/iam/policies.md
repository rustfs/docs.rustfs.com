---
title: "用户、组和策略"
description: "介绍 RustFS IAM 用户和组的管理、策略文档 JSON 格式、条件运算符和内置策略。"
---

本页介绍日常 IAM 管理：创建用户和组、附加策略以及编写自定义策略文档。

## 要求

- 使用 RustFS 管理命令之前，请安装 [`rc`](/operations/rc)。
- 使用允许相应 `admin:*` 操作的凭证配置别名。

## 管理用户

可以通过控制台（左侧导航中的**身份**部分）、`rc admin` 或管理 REST API 管理用户。原生管理端点使用 `/rustfs/admin/v3` 前缀。请求必须由策略允许相应 `admin:*` 操作的凭证签名（AWS Signature V4）。

| 操作 | 方法和路径 | 说明 |
| --- | --- | --- |
| 创建/更新用户 | `PUT /rustfs/admin/v3/add-user?accessKey=<name>` | JSON 正文：`{"secretKey": "...", "status": "enabled"}`；`policy` 可选。需要 `admin:CreateUser`。 |
| 列出用户 | `GET /rustfs/admin/v3/list-users` | 需要 `admin:ListUsers`。 |
| 用户详情 | `GET /rustfs/admin/v3/user-info?accessKey=<name>` | 需要 `admin:GetUser`。 |
| 启用/禁用用户 | `PUT /rustfs/admin/v3/set-user-status?accessKey=<name>&status=<enabled\|disabled>` | 不能更改发起调用的凭证状态。 |
| 删除用户 | `DELETE /rustfs/admin/v3/remove-user?accessKey=<name>` | 需要 `admin:DeleteUser`。 |
| 导出 IAM 数据 | `GET /rustfs/admin/v3/export-iam` | 导出用户、组、策略和映射。 |
| 导入 IAM 数据 | `PUT /rustfs/admin/v3/import-iam` | 恢复导出的数据集。 |

:::note

用户名（访问密钥）不得包含空格，也不能与根访问密钥相同。创建用户时必须提供秘密密钥。

:::

## 管理组

组用于集合用户，以便通过一次策略绑定覆盖所有成员。使用以下端点管理组成员关系和状态（控制台的**身份**部分提供等效操作）：

| 操作 | 方法和路径 | 说明 |
| --- | --- | --- |
| 列出组 | `GET /rustfs/admin/v3/groups` | 需要 `admin:ListGroups`。 |
| 组详情 | `GET /rustfs/admin/v3/group?group=<name>` | 需要 `admin:GetGroup`。 |
| 添加/移除成员 | `PUT /rustfs/admin/v3/update-group-members` | JSON 正文见下文。向不存在的组添加成员会创建该组。需要 `admin:AddUserToGroup` / `admin:RemoveUserFromGroup`。 |
| 启用/禁用组 | `PUT /rustfs/admin/v3/set-group-status?group=<name>&status=<enabled\|disabled>` | 需要 `admin:EnableGroup` / `admin:DisableGroup`。 |
| 删除组 | `DELETE /rustfs/admin/v3/group/{group}` | 组中仍有成员时会失败。 |

成员关系更新正文：

```json
{
  "group": "developers",
  "members": ["alice", "bob"],
  "isRemove": false
}
```

将 `isRemove` 设置为 `true` 可移除列出的成员。临时（STS）用户和根凭证不能添加到组中。

## 附加策略

策略绑定将具名策略关联到用户或组：

| 操作 | 方法和路径 | 说明 |
| --- | --- | --- |
| 为用户或组设置策略 | `PUT /rustfs/admin/v3/set-user-or-group-policy?policyName=<policy>&userOrGroup=<name>&isGroup=<true\|false>` | 替换绑定。也可通过 `/rustfs/admin/v3/set-policy` 访问。需要 `admin:AttachUserOrGroupPolicy`。 |
| 附加策略 | `POST /rustfs/admin/v3/idp/builtin/policy/attach` | JSON 正文：`{"policies": ["readonly"], "user": "alice"}`（也可使用 `"group"`）。添加到现有绑定。 |
| 分离策略 | `POST /rustfs/admin/v3/idp/builtin/policy/detach` | 正文格式相同；从绑定中移除策略。 |
| 列出策略绑定 | `GET /rustfs/admin/v3/idp/builtin/policy-entities` | 显示哪些用户/组绑定了哪些策略。 |

## 管理策略文档

| 操作 | 方法和路径 | 说明 |
| --- | --- | --- |
| 列出策略 | `GET /rustfs/admin/v3/list-canned-policies` | 查看详情需要 `admin:GetPolicy` 范围。 |
| 策略详情 | `GET /rustfs/admin/v3/info-canned-policy?name=<policy>` | 返回 JSON 文档。 |
| 创建/替换策略 | `PUT /rustfs/admin/v3/add-canned-policy?name=<policy>` | 请求正文为策略 JSON 文档。需要 `admin:CreatePolicy`。 |
| 删除策略 | `DELETE /rustfs/admin/v3/remove-canned-policy?name=<policy>` | 需要 `admin:DeletePolicy`。 |

## 策略文档格式

策略文档是一个包含 `Version` 和 `Statement` 字段的 JSON 对象。`Version` 唯一可接受的值是 `2012-10-17`。

每条语句支持以下字段：

| 字段 | 必需 | 描述 |
| --- | --- | --- |
| `Sid` | 否 | 语句标识符。 |
| `Effect` | 是 | `Allow` 或 `Deny`。 |
| `Action` | 是（或使用 `NotAction`） | 操作名称，允许使用通配符（例如 `s3:Get*`）。 |
| `NotAction` | 否 | 匹配除列出操作之外的所有操作。 |
| `Resource` | S3 操作需要（或使用 `NotResource`） | ARN 格式为 `arn:aws:s3:::bucket` 或 `arn:aws:s3:::bucket/prefix/*`。 |
| `NotResource` | 否 | 匹配除列出资源之外的所有资源。 |
| `Condition` | 否 | 以上下文值为键的条件运算符。 |

操作名称具有命名空间：对象/存储桶操作使用 `s3:*`（例如 `s3:GetObject`、`s3:PutObject`、`s3:DeleteObject`、`s3:ListBucket`、`s3:GetBucketLocation`、`s3:ListAllMyBuckets`），管理操作使用 `admin:*`，STS 使用 `sts:AssumeRole`，密钥管理使用 `kms:*`。

支持的条件运算符包括：`StringEquals`、`StringNotEquals`、`StringEqualsIgnoreCase`、`StringNotEqualsIgnoreCase`、`StringLike`、`StringNotLike`、`ArnEquals`、`ArnNotEquals`、`ArnLike`、`ArnNotLike`、`BinaryEquals`、`IpAddress`、`NotIpAddress`、`Null`、`Bool`、`NumericEquals`、`NumericNotEquals`、`NumericLessThan`、`NumericLessThanEquals`、`NumericGreaterThan`、`NumericGreaterThanEquals`、`DateEquals`、`DateNotEquals`、`DateLessThan`、`DateLessThanEquals`、`DateGreaterThan` 和 `DateGreaterThanEquals`。任何运算符都可以添加 `IfExists` 后缀（引用的上下文键不存在时，条件通过）。

### 示例：对单个存储桶的只读访问

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetBucketLocation", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::reports"]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::reports/*"]
    }
  ]
}
```

### 示例：限制到前缀的读写访问

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::app-data"],
      "Condition": {
        "StringLike": {
          "s3:prefix": ["tenant-42/*"]
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": ["arn:aws:s3:::app-data/tenant-42/*"]
    }
  ]
}
```

### 示例：完全访问但禁止删除

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:*"],
      "Resource": ["arn:aws:s3:::archive", "arn:aws:s3:::archive/*"]
    },
    {
      "Effect": "Deny",
      "Action": ["s3:DeleteObject", "s3:DeleteObjectVersion", "s3:DeleteBucket"],
      "Resource": ["arn:aws:s3:::archive", "arn:aws:s3:::archive/*"]
    }
  ]
}
```

:::note

显式 `Deny` 始终覆盖 `Allow`，因此即使 `s3:*` 与删除操作匹配，第二条语句仍然优先。请参阅[评估语义](./index.md#policy-evaluation-semantics)。

:::

## 内置策略

RustFS 定义了五个内置策略，无需预先创建即可附加：

| 策略 | 授予的权限 |
| --- | --- |
| `readwrite` | 对所有资源执行所有 S3 操作（`s3:*`），以及 `sts:AssumeRole`。 |
| `readonly` | 对所有资源执行 `s3:GetBucketLocation`、`s3:GetObject` 和 `s3:GetBucketQuota`，以及 `sts:AssumeRole`。 |
| `writeonly` | 对所有资源执行 `s3:PutObject`，以及 `sts:AssumeRole`。 |
| `diagnostics` | 诊断管理操作（`admin:Profiling`、`admin:ServerTrace`、`admin:ConsoleLog`、`admin:ServerInfo`、`admin:TopLocksInfo`、`admin:OBDInfo`、`admin:Prometheus`、`admin:BandwidthMonitor`），以及 `sts:AssumeRole`。 |
| `consoleAdmin` | 所有管理操作（`admin:*`）、所有 KMS 操作（`kms:*`）、所有 S3 操作（`s3:*`），以及 `sts:AssumeRole`。 |

:::warning

内置 `readonly` 策略有意保持最小权限，不包括 `s3:ListBucket` 或 `s3:ListAllMyBuckets`。仅有 `readonly` 权限的用户可以按键获取对象，但不能浏览存储桶。如需列出内容，请创建自定义策略。

:::