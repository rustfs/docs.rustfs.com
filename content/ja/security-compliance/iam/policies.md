---
title: "ユーザー、グループ、ポリシー"
description: "RustFS の IAM ユーザーとグループの管理、ポリシードキュメントの JSON 形式、条件演算子、組み込みポリシーを説明します。"
---

このページでは、日常的な IAM 管理として、ユーザーとグループの作成、ポリシーの割り当て、カスタムポリシードキュメントの記述を説明します。

## 要件

- RustFS の管理コマンドを使う前に、[`rc`](/ja/operations/rc) をインストールします。
- 対応する `admin:*` アクションを許可する認証情報で、エイリアスを設定します。

## ユーザーの管理

ユーザーは Console（左ナビゲーションの **Identity**）、`rc admin`、または管理用 REST API から管理できます。ネイティブの管理エンドポイントは `/rustfs/admin/v3` プレフィックスの下にあります。リクエストは、対応する `admin:*` アクションをポリシーで許可された認証情報によって署名する必要があります（AWS Signature V4）。

| 操作 | メソッドとパス | 説明 |
| --- | --- | --- |
| ユーザーの作成または更新 | `PUT /rustfs/admin/v3/add-user?accessKey=<name>` | JSON 本文は `{"secretKey": "...", "status": "enabled"}` です。`policy` は任意です。`admin:CreateUser` が必要です。 |
| ユーザーの一覧 | `GET /rustfs/admin/v3/list-users` | `admin:ListUsers` が必要です。 |
| ユーザーの詳細 | `GET /rustfs/admin/v3/user-info?accessKey=<name>` | `admin:GetUser` が必要です。 |
| ユーザーの有効化または無効化 | `PUT /rustfs/admin/v3/set-user-status?accessKey=<name>&status=<enabled\|disabled>` | 呼び出しに使っている認証情報自身の状態は変更できません。 |
| ユーザーの削除 | `DELETE /rustfs/admin/v3/remove-user?accessKey=<name>` | `admin:DeleteUser` が必要です。 |
| IAM データのエクスポート | `GET /rustfs/admin/v3/export-iam` | ユーザー、グループ、ポリシー、対応付けを出力します。 |
| IAM データのインポート | `PUT /rustfs/admin/v3/import-iam` | エクスポートしたデータセットを復元します。 |

:::note

ユーザー名（アクセスキー）に空白を含めることはできず、ルートアクセスキーと同じ値にもできません。ユーザー作成時にはシークレットキーが必要です。

:::

## グループの管理

グループはユーザーをまとめ、1 つのポリシー割り当てを全メンバーに適用します。グループのメンバーシップと状態は、次のエンドポイントで管理します（Console では **Identity** に対応する操作があります）。

| 操作 | メソッドとパス | 説明 |
| --- | --- | --- |
| グループの一覧 | `GET /rustfs/admin/v3/groups` | `admin:ListGroups` が必要です。 |
| グループの詳細 | `GET /rustfs/admin/v3/group?group=<name>` | `admin:GetGroup` が必要です。 |
| メンバーの追加または削除 | `PUT /rustfs/admin/v3/update-group-members` | JSON 本文は下記のとおりです。存在しないグループにメンバーを追加すると、そのグループが作成されます。`admin:AddUserToGroup` または `admin:RemoveUserFromGroup` が必要です。 |
| グループの有効化または無効化 | `PUT /rustfs/admin/v3/set-group-status?group=<name>&status=<enabled\|disabled>` | `admin:EnableGroup` または `admin:DisableGroup` が必要です。 |
| グループの削除 | `DELETE /rustfs/admin/v3/group/{group}` | グループにメンバーが残っている間は失敗します。 |

メンバーシップ更新の本文は次のとおりです。

```json
{
  "group": "developers",
  "members": ["alice", "bob"],
  "isRemove": false
}
```

`isRemove` を `true` にすると、列挙したメンバーを追加ではなく削除します。一時ユーザー（STS）とルート認証情報は、グループに追加できません。

## ポリシーの割り当て

ポリシーの割り当ては、名前付きポリシーをユーザーまたはグループに接続します。

| 操作 | メソッドとパス | 説明 |
| --- | --- | --- |
| ユーザーまたはグループへのポリシー設定 | `PUT /rustfs/admin/v3/set-user-or-group-policy?policyName=<policy>&userOrGroup=<name>&isGroup=<true\|false>` | 割り当てを置き換えます。`/rustfs/admin/v3/set-policy` でも受け付けます。`admin:AttachUserOrGroupPolicy` が必要です。 |
| ポリシーのアタッチ | `POST /rustfs/admin/v3/idp/builtin/policy/attach` | JSON 本文は `{"policies": ["readonly"], "user": "alice"}`（または `"group"`）です。既存の割り当てに追加します。 |
| ポリシーのデタッチ | `POST /rustfs/admin/v3/idp/builtin/policy/detach` | 本文の形は同じです。割り当てからポリシーを外します。 |
| ポリシー割り当ての一覧 | `GET /rustfs/admin/v3/idp/builtin/policy-entities` | どのユーザーまたはグループがどのポリシーを持つかを表示します。 |

## ポリシードキュメントの管理

| 操作 | メソッドとパス | 説明 |
| --- | --- | --- |
| ポリシーの一覧 | `GET /rustfs/admin/v3/list-canned-policies` | 詳細を得るには `admin:GetPolicy` の範囲が必要です。 |
| ポリシーの詳細 | `GET /rustfs/admin/v3/info-canned-policy?name=<policy>` | JSON ドキュメントを返します。 |
| ポリシーの作成または置換 | `PUT /rustfs/admin/v3/add-canned-policy?name=<policy>` | リクエスト本文はポリシーの JSON ドキュメントです。`admin:CreatePolicy` が必要です。 |
| ポリシーの削除 | `DELETE /rustfs/admin/v3/remove-canned-policy?name=<policy>` | `admin:DeletePolicy` が必要です。 |

## ポリシードキュメントの形式 [#policy-document-format]

ポリシードキュメントは、`Version` と `Statement` フィールドを持つ JSON オブジェクトです。受け付ける `Version` の値は `2012-10-17` だけです。

各ステートメントで使えるフィールドは次のとおりです。

| フィールド | 必須 | 説明 |
| --- | --- | --- |
| `Sid` | いいえ | ステートメントの識別子です。 |
| `Effect` | はい | `Allow` または `Deny` です。 |
| `Action` | はい（または `NotAction`） | アクション名です。ワイルドカードを使えます（例: `s3:Get*`）。 |
| `NotAction` | いいえ | 列挙したアクション以外のすべてに一致します。 |
| `Resource` | S3 アクションでははい（または `NotResource`） | `arn:aws:s3:::bucket` または `arn:aws:s3:::bucket/prefix/*` の形式の ARN です。 |
| `NotResource` | いいえ | 列挙したリソース以外のすべてに一致します。 |
| `Condition` | いいえ | コンテキスト値をキーとする条件演算子です。 |

アクション名には名前空間があります。オブジェクトとバケットの操作は `s3:*`（例: `s3:GetObject`、`s3:PutObject`、`s3:DeleteObject`、`s3:ListBucket`、`s3:GetBucketLocation`、`s3:ListAllMyBuckets`）、管理操作は `admin:*`、STS は `sts:AssumeRole`、キー管理は `kms:*` です。

対応する条件演算子には、次が含まれます。`StringEquals`、`StringNotEquals`、`StringEqualsIgnoreCase`、`StringNotEqualsIgnoreCase`、`StringLike`、`StringNotLike`、`ArnEquals`、`ArnNotEquals`、`ArnLike`、`ArnNotLike`、`BinaryEquals`、`IpAddress`、`NotIpAddress`、`Null`、`Bool`、`NumericEquals`、`NumericNotEquals`、`NumericLessThan`、`NumericLessThanEquals`、`NumericGreaterThan`、`NumericGreaterThanEquals`、`DateEquals`、`DateNotEquals`、`DateLessThan`、`DateLessThanEquals`、`DateGreaterThan`、`DateGreaterThanEquals`。任意の演算子には `IfExists` を付けられます（参照するコンテキストキーが存在しない場合、その条件は成立します）。

### 例: 1 つのバケットへの読み取り専用アクセス

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

### 例: プレフィックスに制限した読み書き

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

### 例: フルアクセスだが削除は拒否

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

明示的な `Deny` は常に `Allow` より優先されるため、`s3:*` が削除操作に一致しても、削除については 2 つ目のステートメントが適用されます。[評価の意味](./index.md#policy-evaluation-semantics)を参照してください。

:::

## 組み込みポリシー

RustFS には、事前に作成しなくても割り当てられる 5 つの組み込みポリシーがあります。

| ポリシー | 付与内容 |
| --- | --- |
| `readwrite` | すべてのリソースに対するすべての S3 アクション（`s3:*`）と、`sts:AssumeRole`。 |
| `readonly` | すべてのリソースに対する `s3:GetBucketLocation`、`s3:GetObject`、`s3:GetBucketQuota` と、`sts:AssumeRole`。 |
| `writeonly` | すべてのリソースに対する `s3:PutObject` と、`sts:AssumeRole`。 |
| `diagnostics` | 診断用の管理アクション（`admin:Profiling`、`admin:ServerTrace`、`admin:ConsoleLog`、`admin:ServerInfo`、`admin:TopLocksInfo`、`admin:OBDInfo`、`admin:Prometheus`、`admin:BandwidthMonitor`）と、`sts:AssumeRole`。 |
| `consoleAdmin` | すべての管理アクション（`admin:*`）、すべての KMS アクション（`kms:*`）、すべての S3 アクション（`s3:*`）と、`sts:AssumeRole`。 |

:::warning

組み込みの `readonly` ポリシーには、`s3:ListBucket` と `s3:ListAllMyBuckets` は含まれません。このポリシーの `s3:GetBucketLocation` 権限により RustFS でバケット名を確認でき、`s3:GetObject` 権限により既知のオブジェクトキーを指定してオブジェクトを取得できます。バケット内のオブジェクトを一覧表示するには、そのバケットに対する `s3:ListBucket` 権限を付与するカスタムポリシーを追加します。

:::
