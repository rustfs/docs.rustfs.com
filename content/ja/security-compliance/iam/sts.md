---
title: "サービスアカウントと STS"
description: "RustFS のサービスアカウント（派生したアクセスキー）と、STS の AssumeRole API による一時認証情報を説明します。"
---

RustFS には、既存のアイデンティティから派生した認証情報を発行する仕組みが 2 つあります。**サービスアカウント**（親ユーザーが所有する長期のアクセスキー）と、**STS の一時認証情報**（セッショントークンを持つ短期間のキー）です。

## サービスアカウント

サービスアカウントは、親の IAM ユーザー（またはルートアカウント）に属するアクセスキーとシークレットキーの組です。通常のキーと同じように認証しますが、認可は親として行われます。

- **継承ポリシー（既定）。** ポリシーなしでサービスアカウントを作成すると、リクエスト時点で親ユーザーのポリシーを組み合わせた結果が許可する範囲を継承します。
- **セッションに結び付くポリシー。** 作成時にポリシードキュメントを指定すると、それがサービスアカウントに埋め込まれます。リクエストは、親のポリシーと埋め込まれたポリシーの両方で許可される必要があります。
- **有効期限。** 任意の有効期限タイムスタンプ（RFC 3339）を設定できます。その時刻を過ぎると、認証情報は動作しなくなります。

サービスアカウントは `AssumeRole` を呼び出せず、サービスアカウントのアクセスキーを通常の IAM ユーザーに変換することもできません。

Console では、サービスアカウントを **Access Keys**（アクセスキー）のページで管理します。[アクセスキーの管理](./access-token.md)を参照します。管理 API は次を提供します。

| 操作 | メソッドとパス | 備考 |
| --- | --- | --- |
| サービスアカウントの作成 | `PUT /rustfs/admin/v3/add-service-account` | 本文は下記のとおりです。`/add-service-accounts` でも提供されます。別のユーザー（`targetUser`）向けに作成する場合は `admin:CreateServiceAccount` が必要です。 |
| サービスアカウントの一覧 | `GET /rustfs/admin/v3/list-service-accounts?user=<name>` | 別のユーザーのアカウントを一覧する場合は `admin:ListServiceAccounts` が必要です。 |
| アクセスキーの一括一覧 | `GET /rustfs/admin/v3/list-access-keys-bulk` | ユーザーのみ、サービスアカウントのみ、または STS キーのみへの絞り込みに対応します。 |
| サービスアカウントの詳細 | `GET /rustfs/admin/v3/info-service-account?accessKey=<key>` | 名前、説明、親、有効期限、セッションポリシーを返します（継承時は `impliedPolicy: true`）。 |
| 一時アカウントの詳細 | `GET /rustfs/admin/v3/temporary-account-info?accessKey=<key>` | STS が発行したキー向けです。 |
| アクセスキーの詳細 | `GET /rustfs/admin/v3/info-access-key?accessKey=<key>` | ユーザー、サービスアカウント、STS キーを横断して検索します。 |
| サービスアカウントの更新 | `POST /rustfs/admin/v3/update-service-account?accessKey=<key>` | シークレットのローテーション、状態、名前、説明、有効期限の変更、またはポリシーの置き換えができます。 |
| サービスアカウントの削除 | `DELETE /rustfs/admin/v3/delete-service-account?accessKey=<key>` | `/delete-service-accounts` でも提供されます。管理者以外の呼び出し元は、自分のサービスアカウントだけを削除できます。 |

作成時の本文（注記がない限り、すべてのフィールドは任意です）。

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

`accessKey` と `secretKey` を省略すると、RustFS がランダムな組を生成します。`policy` を省略すると、継承ポリシーのサービスアカウントが作成されます。`targetUser` には管理者権限が必要です。一般ユーザーは、自分自身のサービスアカウントを作成します。

:::

## STS の一時認証情報

RustFS は、サーバールートに AWS 互換の STS エンドポイントを実装しています（フォームエンコードされたパラメータによる `POST /`）。対応するアクションは 2 つです。

- `AssumeRole` — 既存の IAM アイデンティティ向けです。SigV4 で署名します。
- `AssumeRoleWithWebIdentity` — OIDC アイデンティティ向けです。JWT 自体で認証します（[外部アイデンティティ（OIDC）](../oidc/index.md)を参照）。

### AssumeRole

リクエストは、長期の IAM 認証情報で署名する必要があります（AWS Signature V4）。一時認証情報とサービスアカウントは `AssumeRole` を呼び出せません。組み込みの IAM 認可では、RustFS は通常の IAM ユーザーに対する `sts:AssumeRole` を拒否のみのモードで評価します。一致する明示的な `Deny` はリクエストを拒否しますが、別途 `Allow` は必須ではありません。ユーザーには、適用可能なユーザーまたはグループのポリシー割り当てが少なくとも 1 つ必要であり、割り当てられたポリシー名はすべて解決される必要があります。

フォームパラメータは次のとおりです。

| パラメータ | 必須 | 説明 |
| --- | --- | --- |
| `Action` | はい | `AssumeRole`。 |
| `Version` | はい | `2011-06-15` である必要があります。 |
| `DurationSeconds` | いいえ | 認証情報の有効期間（秒）です。既定値は 3600（1 時間）です。値は 900（15 分）から 43200（12 時間）の範囲に収められます。 |
| `Policy` | いいえ | 一時認証情報をさらに制限する、インラインのセッションポリシー（JSON）です。 |
| `RoleArn`、`RoleSessionName`、`ExternalId` | いいえ | AWS との互換のために受け付けます。 |

例は次のとおりです。

```bash
curl -s -X POST "https://rustfs.example.com/" \
  --user "$ACCESS_KEY:$SECRET_KEY" \
  --aws-sigv4 "aws:amz:us-east-1:s3" \
  -d "Action=AssumeRole" \
  -d "Version=2011-06-15" \
  -d "DurationSeconds=3600"
```

レスポンスは XML の `AssumeRoleResponse` で、`AccessKeyId`、`SecretAccessKey`、`SessionToken`、`Expiration` を含みます。後続の S3 リクエストでは、3 つの値をすべて使います（セッショントークンは `X-Amz-Security-Token` に入れます）。

一時認証情報は呼び出し元のポリシーを継承します。認証情報の `parent` は、呼び出しに使ったアクセスキーです。`Policy` パラメータを指定した場合、それはセッションに保存され、追加の制限として適用されます。

### AssumeRoleWithWebIdentity

OIDC フローで使います。アイデンティティプロバイダーの JWT が認証になるため、SigV4 署名は不要です。

| パラメータ | 必須 | 説明 |
| --- | --- | --- |
| `Action` | はい | `AssumeRoleWithWebIdentity`。 |
| `Version` | はい | `2011-06-15` である必要があります。 |
| `WebIdentityToken` | はい | 設定済みプロバイダーが発行した OIDC の ID トークンです。 |
| `DurationSeconds` | いいえ | `AssumeRole` と同じ既定値であり、900 から 43200 の範囲に収められます。 |
| `Policy` | いいえ | 任意のインラインセッションポリシーです。 |

RustFS は、設定されたプロバイダーに対してトークンを検証し（署名、発行者、オーディエンス、有効期限）、`groups` と `roles` のクレームを RustFS のポリシー名に対応付けます。ポリシーまたはグループを対応付けできない場合、リクエストは拒否されます。レスポンスは XML の `AssumeRoleWithWebIdentityResponse` で、同じ認証情報フィールドに加えて `SubjectFromWebIdentityToken` を含みます。

:::warning

ワークロードが許す限り、`DurationSeconds` を短くすることを推奨します。漏えいした一時認証情報は、有効期限まで有効なままです。

:::
