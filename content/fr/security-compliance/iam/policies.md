---
title: "Users, Groups, and Policies"
description: "Managing RustFS IAM users and groups, the policy document JSON format, condition operators, and built-in policies."
---

This page covers day-to-day IAM administration: creating users and groups, attaching policies, and writing custom policy documents.

## Requirements

- Install [`rc`](/operations/rc) before using RustFS administrative commands.
- Configure an alias with credentials that permit the corresponding `admin:*` actions.

## Managing Users

Users can be managed from the Console (**Identity** section in the left navigation), with `rc admin`, or through the admin REST API. The native admin endpoints live under the `/rustfs/admin/v3` prefix. Requests must be signed (AWS Signature V4) by a credential whose policies allow the corresponding `admin:*` action.

| Operation | Method and path | Notes |
| --- | --- | --- |
| Create/update user | `PUT /rustfs/admin/v3/add-user?accessKey=<name>` | JSON body: `{"secretKey": "...", "status": "enabled"}`; `policy` is optional. Requires `admin:CreateUser`. |
| List users | `GET /rustfs/admin/v3/list-users` | Requires `admin:ListUsers`. |
| User details | `GET /rustfs/admin/v3/user-info?accessKey=<name>` | Requires `admin:GetUser`. |
| Enable/disable user | `PUT /rustfs/admin/v3/set-user-status?accessKey=<name>&status=<enabled\|disabled>` | You cannot change the status of the credential making the call. |
| Delete user | `DELETE /rustfs/admin/v3/remove-user?accessKey=<name>` | Requires `admin:DeleteUser`. |
| Export IAM data | `GET /rustfs/admin/v3/export-iam` | Dumps users, groups, policies, and mappings. |
| Import IAM data | `PUT /rustfs/admin/v3/import-iam` | Restores an exported dataset. |

:::note

A user name (access key) must not contain spaces and cannot equal the root access key. The secret key is required when creating a user.

:::

## Managing Groups

Groups collect users so a single policy binding covers all members. Group membership and status are managed with these endpoints (Console equivalents exist under **Identity**):

| Operation | Method and path | Notes |
| --- | --- | --- |
| List groups | `GET /rustfs/admin/v3/groups` | Requires `admin:ListGroups`. |
| Group details | `GET /rustfs/admin/v3/group?group=<name>` | Requires `admin:GetGroup`. |
| Add/remove members | `PUT /rustfs/admin/v3/update-group-members` | JSON body below. Adding members to a nonexistent group creates it. Requires `admin:AddUserToGroup` / `admin:RemoveUserFromGroup`. |
| Enable/disable group | `PUT /rustfs/admin/v3/set-group-status?group=<name>&status=<enabled\|disabled>` | Requires `admin:EnableGroup` / `admin:DisableGroup`. |
| Delete group | `DELETE /rustfs/admin/v3/group/{group}` | Fails while the group still has members. |

Membership update body:

```json
{
  "group": "developers",
  "members": ["alice", "bob"],
  "isRemove": false
}
```

Set `isRemove` to `true` to remove the listed members instead. Temporary (STS) users and the root credential cannot be added to groups.

## Attaching Policies

Policy bindings connect a named policy to a user or a group:

| Operation | Method and path | Notes |
| --- | --- | --- |
| Set policy for user or group | `PUT /rustfs/admin/v3/set-user-or-group-policy?policyName=<policy>&userOrGroup=<name>&isGroup=<true\|false>` | Replaces the binding. Also served as `/rustfs/admin/v3/set-policy`. Requires `admin:AttachUserOrGroupPolicy`. |
| Attach policies | `POST /rustfs/admin/v3/idp/builtin/policy/attach` | JSON body: `{"policies": ["readonly"], "user": "alice"}` (or `"group"`). Adds to the existing binding. |
| Detach policies | `POST /rustfs/admin/v3/idp/builtin/policy/detach` | Same body shape; removes policies from the binding. |
| List policy bindings | `GET /rustfs/admin/v3/idp/builtin/policy-entities` | Shows which users/groups have which policies. |

## Managing Policy Documents

| Operation | Method and path | Notes |
| --- | --- | --- |
| List policies | `GET /rustfs/admin/v3/list-canned-policies` | Requires `admin:GetPolicy` scope for details. |
| Policy details | `GET /rustfs/admin/v3/info-canned-policy?name=<policy>` | Returns the JSON document. |
| Create/replace policy | `PUT /rustfs/admin/v3/add-canned-policy?name=<policy>` | Request body is the policy JSON document. Requires `admin:CreatePolicy`. |
| Delete policy | `DELETE /rustfs/admin/v3/remove-canned-policy?name=<policy>` | Requires `admin:DeletePolicy`. |

## Policy Document Format

A policy document is a JSON object with `Version` and `Statement` fields. The only accepted `Version` value is `2012-10-17`.

Each statement supports:

| Field | Required | Description |
| --- | --- | --- |
| `Sid` | No | Statement identifier. |
| `Effect` | Yes | `Allow` or `Deny`. |
| `Action` | Yes (or `NotAction`) | Action names, wildcards allowed (e.g. `s3:Get*`). |
| `NotAction` | No | Matches every action except the listed ones. |
| `Resource` | Yes for S3 actions (or `NotResource`) | ARNs in the form `arn:aws:s3:::bucket` or `arn:aws:s3:::bucket/prefix/*`. |
| `NotResource` | No | Matches every resource except the listed ones. |
| `Condition` | No | Condition operators keyed by context values. |

Action names are namespaced: `s3:*` for object/bucket operations (e.g. `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`, `s3:GetBucketLocation`, `s3:ListAllMyBuckets`), `admin:*` for management operations, `sts:AssumeRole` for STS, and `kms:*` for key management.

Supported condition operators include: `StringEquals`, `StringNotEquals`, `StringEqualsIgnoreCase`, `StringNotEqualsIgnoreCase`, `StringLike`, `StringNotLike`, `ArnEquals`, `ArnNotEquals`, `ArnLike`, `ArnNotLike`, `BinaryEquals`, `IpAddress`, `NotIpAddress`, `Null`, `Bool`, `NumericEquals`, `NumericNotEquals`, `NumericLessThan`, `NumericLessThanEquals`, `NumericGreaterThan`, `NumericGreaterThanEquals`, `DateEquals`, `DateNotEquals`, `DateLessThan`, `DateLessThanEquals`, `DateGreaterThan`, and `DateGreaterThanEquals`. Any operator can be suffixed with `IfExists` (the condition passes when the referenced context key is absent).

### Example: Read-Only Access to One Bucket

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

### Example: Read/Write Restricted to a Prefix

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

### Example: Full Access but Deletion Denied

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

An explicit `Deny` always overrides `Allow`, so the second statement wins for delete operations even though `s3:*` matches them. See the [evaluation semantics](./index.md#policy-evaluation-semantics).

:::

## Built-In Policies

RustFS defines five built-in policies that can be attached without creating them first:

| Policy | Grants |
| --- | --- |
| `readwrite` | All S3 actions (`s3:*`) on all resources, plus `sts:AssumeRole`. |
| `readonly` | `s3:GetBucketLocation`, `s3:GetObject`, and `s3:GetBucketQuota` on all resources, plus `sts:AssumeRole`. |
| `writeonly` | `s3:PutObject` on all resources, plus `sts:AssumeRole`. |
| `diagnostics` | Diagnostic admin actions (`admin:Profiling`, `admin:ServerTrace`, `admin:ConsoleLog`, `admin:ServerInfo`, `admin:TopLocksInfo`, `admin:OBDInfo`, `admin:Prometheus`, `admin:BandwidthMonitor`), plus `sts:AssumeRole`. |
| `consoleAdmin` | All admin actions (`admin:*`), all KMS actions (`kms:*`), all S3 actions (`s3:*`), plus `sts:AssumeRole`. |

:::warning

The built-in `readonly` policy is intentionally minimal — it does not include `s3:ListBucket` or `s3:ListAllMyBuckets`. Users with only `readonly` can fetch objects by key but cannot browse buckets. Create a custom policy if listing is needed.

:::
