---
title: "OpenStack Swift API"
description: "オプションの Swift API を有効にして RustFS をビルドし、OpenStack Keystone 認証に接続します。"
---

RustFS は、S3 API と同じ HTTP エンドポイントで OpenStack Swift 互換 API を提供できます。このガイドでは、オプションの `swift` 機能を有効にしたビルド、Keystone トークン検証の設定、基本的なアカウント、コンテナ、オブジェクト操作の確認方法を説明します。

:::warning[互換性の範囲]

Swift サポートはオプションであり、OpenStack Swift のすべての動作を網羅していません。アカウントに対する `HEAD` リクエストと JSON 以外の一覧形式は未実装です。本番環境で使用する前に、クライアントのワークフローを検証してください。

:::

## Swift と RustFS の対応関係

Swift リクエストは、RustFS の S3 API エンドポイント上の `/v1/AUTH_<project-id>/...` パスを使用します。

| Swift リソース | リクエストパス | RustFS での対応 |
| --- | --- | --- |
| アカウント | `/v1/AUTH_<project-id>` | 認証済み Keystone プロジェクト |
| コンテナ | `/v1/AUTH_<project-id>/<container>` | プロジェクトごとに分離された RustFS バケット |
| オブジェクト | `/v1/AUTH_<project-id>/<container>/<object>` | 対応するバケット内のオブジェクト |

URL のプロジェクト ID は、検証済み Keystone トークンのプロジェクト ID と一致する必要があります。RustFS は `X-Auth-Token` または `X-Storage-Token` でトークンを受け取ります。

確認済みの主要操作は次のとおりです。

| 範囲 | 操作 |
| --- | --- |
| アカウント | コンテナの一覧、アカウントメタデータの更新 |
| コンテナ | 作成、一覧、確認、メタデータの更新、削除 |
| オブジェクト | アップロード、ダウンロード、範囲ダウンロード、確認、メタデータの更新、コピー、削除 |

## Swift サポートを有効にしてビルドする

RustFS のデフォルト機能セットには Swift が含まれません。`rustfs/rustfs` リポジトリで明示的にビルドします。

```bash
cargo build --release --features swift
```

生成されたバイナリは、設定済みの S3 API アドレスで Swift パスを提供します。Swift 専用のリスナーやポートはありません。

## Keystone を設定する

RustFS を起動する前に、Keystone を有効にして認証エンドポイントを設定します。

```bash
export RUSTFS_KEYSTONE_ENABLE=true
export RUSTFS_KEYSTONE_AUTH_URL=https://keystone.example.com
export RUSTFS_KEYSTONE_VERSION=v3
export RUSTFS_KEYSTONE_VERIFY_SSL=true
```

| 変数 | 用途 | デフォルト |
| --- | --- | --- |
| `RUSTFS_KEYSTONE_ENABLE` | Keystone トークン検証を有効にします。 | `false` |
| `RUSTFS_KEYSTONE_AUTH_URL` | Keystone 認証エンドポイントを設定します。Keystone 有効時は必須です。 | 未設定 |
| `RUSTFS_KEYSTONE_VERSION` | Keystone API バージョンを選択します。 | `v3` |
| `RUSTFS_KEYSTONE_VERIFY_SSL` | Keystone の TLS 証明書を検証します。 | `true` |
| `RUSTFS_KEYSTONE_CACHE_SIZE` | トークンキャッシュの最大エントリ数を設定します。 | `10000` |
| `RUSTFS_KEYSTONE_CACHE_TTL` | トークンキャッシュの有効期間を秒単位で設定します。 | `300` |
| `RUSTFS_KEYSTONE_TIMEOUT` | Keystone リクエストのタイムアウトを秒単位で設定します。 | `30` |

TLS 検証は有効のままにすることを推奨します。Keystone が送信されたトークンを拒否した場合、RustFS は `401 Unauthorized` を返し、そのリクエストをローカル認証情報へフォールバックしません。

## API を確認する

Keystone からスコープ付きトークンとプロジェクト ID を取得し、次のシェル変数を設定します。

```bash
export SWIFT_TOKEN='<your-keystone-token>'
export SWIFT_ACCOUNT='AUTH_<your-project-id>'
export SWIFT_URL="http://localhost:9000/v1/${SWIFT_ACCOUNT}"
```

プロジェクトから参照できるコンテナを一覧表示します。

```bash
curl --fail-with-body \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}"
```

`my-bucket` を作成し、`hello.txt` をアップロードしてダウンロードします。

```bash
curl --fail-with-body --request PUT \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}/my-bucket"

curl --fail-with-body --request PUT \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	--upload-file /path/to/hello.txt \
	"${SWIFT_URL}/my-bucket/hello.txt"

curl --fail-with-body \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}/my-bucket/hello.txt"
```

トークンのプロジェクトと一致しない `AUTH_<project-id>` アカウントへのリクエストには、`403 Forbidden` が返されます。

## 次のステップ

- [S3 互換性マトリックスを確認する](/ja/reference/s3-compatibility)
- [RustFS の認証情報を管理する](/ja/operations/credentials)
- [RustFS の TLS を設定する](/ja/integration/tls-configured)
