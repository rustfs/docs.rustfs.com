---
title: "監査ターゲット"
description: "RustFS の監査ターゲットを設定し、リクエスト単位の監査レコードを外部システムへ配信します。"
---

RustFS の監査ターゲットは、セキュリティ監視、コンプライアンス、インシデント調査のために、リクエスト単位のアクティビティレコードを外部システムへ送ります。このガイドでは、Webhook ターゲットを設定し、S3 リクエストで監査配信を確認します。

## 概要

監査ターゲットとイベント通知は、目的が異なります。

| 機能 | 監査ターゲット | イベント通知 |
| --- | --- | --- |
| 対象範囲 | RustFS 全体のリクエストと API アクティビティ | 各バケットの設定で選択したイベント |
| ルーティング | 有効なすべての監査ターゲットが監査レコードを受け取る | 各バケットルールがターゲットを選択する |
| フィルタリング | ターゲットごとのイベントフィルタはない | イベント、プレフィックス、サフィックスのフィルタ |
| 主な用途 | セキュリティ情報およびイベント管理（SIEM）、コンプライアンス、調査 | アプリケーションのワークフローとデータパイプライン |

RustFS は、Webhook、Kafka、MQTT、MySQL、PostgreSQL、NATS、Redis、AMQP、Pulsar の監査ターゲットファミリーに対応しています。有効にした各ターゲットは、監査ストリームを独立して受け取ります。

監査レコードには、リクエストパス、クエリパラメータ、選択されたヘッダー、アイデンティティクレーム、アクセスキー識別子、リモートホスト、ユーザーエージェント、レスポンスステータス、エラーが含まれることがあります。保存期間とコンプライアンス要件に従って、送信先を保護し、アクセスを制限します。

## 設定

監査配信は、既定では無効です。次の環境変数は、モジュールを有効にし、`primary` という名前の Webhook ターゲットを作成します。

```bash
export RUSTFS_AUDIT_ENABLE="true"
export RUSTFS_AUDIT_WEBHOOK_ENABLE_PRIMARY="on"
export RUSTFS_AUDIT_WEBHOOK_ENDPOINT_PRIMARY="https://audit.example.com/rustfs"
export RUSTFS_AUDIT_WEBHOOK_AUTH_TOKEN_PRIMARY="<your-webhook-token>"
export RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY="/var/lib/rustfs/audit-primary"
export RUSTFS_OUTBOUND_ALLOW_ORIGINS="https://audit.example.com"
```

環境変数で管理するターゲットを変更したあとは、RustFS を再起動します。ターゲット名は環境変数のサフィックスを小文字にしたものなので、`_PRIMARY` は `primary` を作成します。

RustFS は、エンドポイントのオリジンのルートパス（`https://audit.example.com/` など）へ `HEAD` ヘルスチェックを送り、設定した完全なエンドポイントへ JSON の `POST` リクエストを送ります。オリジンは `HEAD` に応答する必要があり、配信リクエストは成功した HTTP ステータスを返す必要があります。RustFS プロセスの実行ユーザーが、キューディレクトリへ書き込めるようにします。

### Webhook の設定

このターゲットのすべての設定で、同じ `_PRIMARY` サフィックスを使います。

| 変数 | 用途 |
| --- | --- |
| `RUSTFS_AUDIT_WEBHOOK_ENDPOINT_PRIMARY` | HTTP または HTTPS の配信エンドポイント |
| `RUSTFS_AUDIT_WEBHOOK_AUTH_TOKEN_PRIMARY` | `Authorization` ヘッダーで送る Bearer トークン |
| `RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY` | キューに入れた監査レコードのディレクトリ |
| `RUSTFS_AUDIT_WEBHOOK_QUEUE_LIMIT_PRIMARY` | キューに入れられるレコードの最大数 |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_CERT_PRIMARY` | 相互 TLS（mTLS）用のクライアント証明書 |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_KEY_PRIMARY` | クライアント証明書と対になる秘密鍵 |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_CA_PRIMARY` | 受信側を検証するための認証局 |
| `RUSTFS_AUDIT_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` | サーバー証明書の検証を無効にする |

:::warning[監査データを保護する]

リモートのコレクターには HTTPS を使います。証明書の検証は有効のままにし、Bearer トークンはソース管理の外に保管し、mTLS を使う場合はクライアント証明書と鍵の両方を指定します。監査ペイロードには、セキュリティ上機密なリクエストとアイデンティティのメタデータが含まれることがあります。

:::

すべてのターゲットファミリーとターゲット固有のキーについては、[環境変数](/ja/reference/environment-variables#event--audit-targets)を参照します。

### 複数のターゲット

別のインスタンスを定義するには、区別できる大文字のサフィックスを追加します。たとえば、`RUSTFS_AUDIT_WEBHOOK_ENABLE_ARCHIVE` と対応する `_ARCHIVE` の設定を使うと、`primary` と並んで `archive` Webhook を作成できます。

RustFS は、各監査レコードを有効なすべてのターゲットへファンアウトします。1 つのターゲットの失敗は、他のターゲットへの配信試行を妨げません。

:::note[環境変数で管理するターゲット]

環境変数で定義したターゲットは、Console または管理 API から編集または削除できません。環境変数を変更し、RustFS を再起動します。同じターゲットを、環境変数と永続化された設定の両方で定義しないでください。

:::

## 使い方

:::note[rc のコマンドライン対応]

現在の `rc` クライアントには、監査ターゲットを作成、一覧、削除するコマンドがありません。環境変数または Console で設定します。`rc bucket event` コマンドが管理するのはバケット通知ルールだけであり、監査配信は管理しません。

:::

### 受信側を確認する

トラフィックを生成する前に、コレクターが RustFS ホストから到達でき、設定した Bearer トークンを受け付けることを確認します。

```bash
curl --fail --head \
	https://audit.example.com/
```

ヘルスチェックはオリジンの到達性を測るもので、Webhook の認可トークンは含めません。別に、設定した `/rustfs` 配信パスが `POST` リクエストで `Authorization: Bearer <your-webhook-token>` を受け付けることを確認します。

ターゲットがオフラインのままの場合は、DNS、ファイアウォールポリシー、`RUSTFS_OUTBOUND_ALLOW_ORIGINS`、証明書の信頼、オリジンの `HEAD /` への応答を確認します。

### 監査レコードを生成する

RustFS に対して認証済みの S3 操作を実行します。

```bash
printf 'hello from RustFS\n' > hello.txt

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 cp hello.txt s3://my-bucket/hello.txt
```

Webhook は JSON の監査エントリを受け取ります。フィールドは操作によって異なり、空の任意フィールドは省略されることがあります。代表的な一部は次のとおりです。

```json
{
	"version": "1",
	"time": 1719331200000,
	"event": "s3:ObjectCreated:Put",
	"trigger": "s3",
	"api": {
		"name": "PutObject",
		"bucket": "my-bucket",
		"object": "hello.txt",
		"status": "OK",
		"statusCode": 200
	},
	"remotehost": "192.0.2.10",
	"requestID": "<request-id>",
	"userAgent": "aws-cli",
	"requestPath": "/my-bucket/hello.txt",
	"accessKey": "<your-access-key>"
}
```

ペイロードのスキーマは追加型として扱います。必要なフィールドを解析し、未知のフィールドや欠落したフィールドを許容することで、コレクターが今後の RustFS リリースとの互換性を保てます。

### 配信の動作

`RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY` を設定すると、RustFS は未送信のレコードをディスクに保存し、一時的な配信失敗のあとで再送します。想定する停止時間に合わせて、キューディレクトリと `RUSTFS_AUDIT_WEBHOOK_QUEUE_LIMIT_PRIMARY` の容量を決め、ディスク使用量とターゲットの健全性の両方を監視します。

Webhook の配信は少なくとも 1 回です。受信側がリクエストを処理したあと、RustFS が応答を観測する前にタイムアウトすることがあります。必要な場合は、`requestID` とその他の安定したフィールドでレコードを重複排除します。

受信側は、レコードを永続的に受け付けたあとでのみ応答確認することを推奨します。成功以外のステータスを返すと、失敗が配信経路から見える状態を保てます。黙って受け付けて破棄したレコードは、RustFS から回復できません。

## 次のステップ

バケット単位のアプリケーションワークフローには、[イベント通知](/ja/operations/event-notifications)を設定します。サービスの健全性を監視するには[オブザーバビリティ](/ja/operations/observability)を、管理アクセスを制限するには[認証情報](/ja/operations/credentials)を確認します。
