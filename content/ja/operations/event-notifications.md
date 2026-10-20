---
title: "イベント通知"
description: "RustFS のバケットイベント通知を設定し、絞り込んだオブジェクトイベントを外部ターゲットへ配信する方法を説明します。"
---

RustFS のイベント通知は、S3 バケットのアクティビティを外部システムへ配信します。このガイドでは、Webhook ターゲットを設定してバケットに関連付け、AWS CLI で配信を確認します。

## 概要

イベント通知は、互いに独立した 2 つの部分で構成されます。

- **通知ターゲット**は、RustFS がイベントを送る先を定義します。
- **バケット通知設定**は、1 つのバケットについて、ターゲット、イベント種別、任意のオブジェクトキーフィルタを選びます。

RustFS は、Webhook、Kafka、MQTT、MySQL、PostgreSQL、NATS、Redis、AMQP、Pulsar のターゲット系統をサポートします。以下の Webhook の手順は、HTTP サービス、サーバーレス関数、連携プラットフォームに向いています。

バケットのルールは、S3 の `PutBucketNotificationConfiguration` と `GetBucketNotificationConfiguration` API を使います。RustFS が現在受け付けるのはキュー設定です。AWS SNS のトピックと Lambda 関数の設定はサポートしていません。

主なイベントの系統は次のとおりです。

| イベントの系統 | 例 |
| --- | --- |
| オブジェクトの作成 | `s3:ObjectCreated:Put`、`s3:ObjectCreated:Copy`、`s3:ObjectCreated:CompleteMultipartUpload` |
| オブジェクトの削除 | `s3:ObjectRemoved:Delete`、`s3:ObjectRemoved:DeleteMarkerCreated` |
| オブジェクトへのアクセス | `s3:ObjectAccessed:Get`、`s3:ObjectAccessed:Head` |
| オブジェクトのタグ付け | `s3:ObjectTagging:Put`、`s3:ObjectTagging:Delete` |
| ライフサイクルと階層化 | 有効期限切れ、復元、レプリケーション、移行の各イベント |

系統内のすべてのイベントを購読するには、`s3:ObjectCreated:*` のようなワイルドカードを使います。

## 設定

イベント通知は既定で無効です。次の環境変数でモジュールを有効にし、`primary` という名前の Webhook ターゲットを作成します。

```bash
export RUSTFS_NOTIFY_ENABLE="true"
export RUSTFS_NOTIFY_WEBHOOK_ENABLE_PRIMARY="on"
export RUSTFS_NOTIFY_WEBHOOK_ENDPOINT_PRIMARY="https://events.example.com/rustfs"
export RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN_PRIMARY="<your-webhook-token>"
export RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR_PRIMARY="/var/lib/rustfs/notify-primary"
export RUSTFS_OUTBOUND_ALLOW_ORIGINS="https://events.example.com"
```

環境変数で管理するターゲットを変更したあとは、RustFS を再起動します。ターゲット名は環境変数の接尾辞を小文字にしたものなので、`_PRIMARY` は `primary` を作成します。バケット設定では、ターゲット ARN `arn:rustfs:sqs:us-east-1:primary:webhook` を使います。

RustFS は、エンドポイントのオリジンのルートパス（`https://events.example.com/` など）へ `HEAD` のヘルスチェックを送り、設定された完全なエンドポイントへ JSON の `POST` リクエストを送ります。オリジンは `HEAD` に応答する必要があります。配信リクエストは、成功を示す HTTP ステータスを返す必要があります。RustFS プロセスの実行アカウントには、キューディレクトリへの書き込みを許可します。

### Webhook の設定

このターゲットのすべての設定で、同じ `_PRIMARY` 接尾辞を使います。

| 変数 | 用途 |
| --- | --- |
| `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT_PRIMARY` | HTTP または HTTPS の配信エンドポイント |
| `RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN_PRIMARY` | `Authorization` ヘッダーで送る Bearer トークン |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR_PRIMARY` | キューに入れた配信を置くディレクトリ |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_LIMIT_PRIMARY` | キューに入れられるイベントの最大数 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CERT_PRIMARY` | 相互 TLS（mTLS）用のクライアント証明書 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_KEY_PRIMARY` | クライアント証明書と対になる秘密鍵 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA_PRIMARY` | 受信側の検証に使う認証局 |
| `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` | サーバー証明書の検証を無効にします |

:::warning[証明書の検証は有効のままにする]

本番では `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` を有効にしないでください。受信側がプライベート認証局を使う場合は、`RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA_PRIMARY` を設定します。mTLS を使う場合は、クライアント証明書と秘密鍵の両方を指定します。

:::

すべてのターゲット系統と、ターゲット固有のキーについては、[環境変数](/ja/reference/environment-variables#event--audit-targets)を参照します。

## 使い方

次の例では、`uploads/` 配下の `.dat` オブジェクトに対する作成イベントと削除イベントを、`primary` の Webhook へ送ります。

### バケットルールを設定する

通知設定を作成します。

```json title="notification.json"
{
	"QueueConfigurations": [
		{
			"Id": "primary-uploads",
			"QueueArn": "arn:rustfs:sqs:us-east-1:primary:webhook",
			"Events": [
				"s3:ObjectCreated:*",
				"s3:ObjectRemoved:*"
			],
			"Filter": {
				"Key": {
					"FilterRules": [
						{ "Name": "prefix", "Value": "uploads/" },
						{ "Name": "suffix", "Value": ".dat" }
					]
				}
			}
		}
	]
}
```

[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) で `my-bucket` に適用します。

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api put-bucket-notification-configuration \
	--bucket my-bucket \
	--notification-configuration file://notification.json
```

バケットルールを保存しても、そのターゲットが存在することやオンラインであることは証明されません。モジュールとターゲットが有効であること、受信側がヘルスチェックに応答すること、テストのオブジェクト操作で配信が行われることを確認します。

有効な設定を読み取ります。

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api get-bucket-notification-configuration \
	--bucket my-bucket
```

プレフィックスとサフィックスのフィルタは大文字と小文字を区別し、AND 条件で組み合わせます。1 つのルールに含められるプレフィックスフィルタとサフィックスフィルタは、それぞれ最大 1 つです。

### rc でルールを管理する

`rc` クライアントでは、バケット通知ルールの追加、一覧、削除ができます。通知モジュールの設定や、基盤となる Webhook、ブローカー、データベースのターゲット作成は行いません。それらは先に、環境変数または Console（管理画面）で設定します。

`primary` ターゲットに、作成イベントと削除イベントを追加します。

```bash
rc bucket event add \
	rustfs/my-bucket \
	arn:rustfs:sqs:us-east-1:primary:webhook \
	--event put,delete
```

有効なルールを一覧します。

```bash
rc --json bucket event list rustfs/my-bucket
```

そのターゲット ARN に関連付けられたルールをすべて削除します。

```bash
rc bucket event remove \
	rustfs/my-bucket \
	arn:rustfs:sqs:us-east-1:primary:webhook
```

現在の `rc bucket event add` コマンドには、プレフィックスやサフィックスのフィルタオプションがありません。ルールでオブジェクトキーをフィルタする必要がある場合は、AWS CLI を使います。

### イベントを発生させて確認する

条件に一致するオブジェクトをアップロードし、削除します。

```bash
printf 'hello from RustFS\n' > hello.txt

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 cp hello.txt s3://my-bucket/uploads/hello.dat

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 rm s3://my-bucket/uploads/hello.dat
```

Webhook は S3 互換の JSON エンベロープを受け取ります。重要なフィールドには、イベント名、バケット、オブジェクトキー、サイズ、ETag、リクエスト識別子があります。

```json
{
	"EventName": "s3:ObjectCreated:Put",
	"Records": [
		{
			"eventName": "s3:ObjectCreated:Put",
			"s3": {
				"bucket": { "name": "my-bucket" },
				"object": { "key": "uploads%2Fhello.dat" }
			}
		}
	]
}
```

オブジェクトキーは、使う前に URL エンコードされたデータとしてデコードします。あわせて、コンシューマーは冪等であることを推奨します。キュー経由の配信は蓄積転送による回復を提供しますが、受信側は同じイベントを複数回観測できます。

### ルールを置き換える、または削除する

`PutBucketNotificationConfiguration` は、バケットの通知設定全体を置き換えます。更新するときは、残すルールをすべて含めます。

空の設定を適用して、すべてのルールを削除します。

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api put-bucket-notification-configuration \
	--bucket my-bucket \
	--notification-configuration '{}'
```

## 次のステップ

バケット単位のオブジェクトイベントではなく、リクエスト単位のセキュリティとコンプライアンスの記録が必要な場合は、[監査ターゲット](/ja/security-compliance/audit-logs)を設定します。RustFS サービスを監視するには、[オブザーバビリティ](/ja/operations/observability)を確認します。
