---
title: "Dapr"
description: "任意の Dapr アプリケーションから AWS S3 バインディング経由で RustFS オブジェクトを読み書きする。"
---

このガイドは、分散アプリケーション向けの CNCF ポータブルランタイム [Dapr](https://github.com/dapr/dapr) を、AWS S3 バインディングを通じて **RustFS** に接続します。RustFS バケットをバックエンドに持つバインディングコンポーネントを宣言し、サイドカーを実行して、バインディングの HTTP API でオブジェクトを作成・読み戻し・独立に確認します。このワークフローは `daprio/dapr:1.19.0` をパススタイル addressing で RustFS バケットに対して実行して検証しました。

Docker が必要です。このデプロイはローカルでの結合テスト用であり、本番環境向けではありません。

## アーキテクチャ

```mermaid
flowchart LR
	App["Your app"] -->|"POST /v1.0/bindings/rustfs-s3"| Daprd["daprd sidecar :3500"]
	Daprd -->|"bindings.aws.s3"| RustFS["RustFS :9000"]
```

アプリケーションは S3 の認証情報やエンドポイントを一切持ちません。サイドカーがバケットを名前付きバインディングとして公開し、すべての操作は `operation` と任意の `metadata` を添えてバインディングエンドポイントへ POST するだけです。

## 1. バインディングコンポーネントを定義する

コンポーネントファイルを作成します。`endpoint` にはスキーマを含め、`forcePathStyle` は RustFS のパススタイル addressing に合わせます：

```yaml title="rustfs-s3.yaml"
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: rustfs-s3
spec:
  type: bindings.aws.s3
  version: v1
  metadata:
  - name: bucket
    value: my-bucket
  - name: endpoint
    value: http://<your-rustfs-endpoint>:9000
  - name: accessKey
    value: <your-access-key>
  - name: secretKey
    value: <your-secret-key>
  - name: region
    value: us-east-1
  - name: forcePathStyle
    value: "true"
```

## 2. サイドカーを起動する

コンポーネントディレクトリをマウントして `daprd` を実行します。`--resources-path` は非推奨の `--components-path` を置き換えるものです：

```bash
docker run -d --name dapr \
  -v "$PWD:/components" \
  daprio/dapr:1.19.0 /daprd \
  --app-id s3demo \
  --dapr-http-port 3500 \
  --resources-path /components
```

バインディングの初期化を確認します。ログは次の行で終わります：

```bash
docker logs dapr 2>&1 | grep "successful init"
```

```text
successful init for output binding (rustfs-s3 (bindings.aws.s3/v1))
```

## 3. バインディング経由でオブジェクトを作成する

サイドカーに到達できる任意の HTTP クライアントからバインディングを呼び出します。`key` メタデータがオブジェクト名を決めます：

```bash
curl -s -X POST http://localhost:3500/v1.0/bindings/rustfs-s3 \
  -H "Content-Type: application/json" \
  -d '{"operation":"create","data":"hello from dapr","metadata":{"key":"dapr/hello.txt"}}'
```

```json
{"location":"http://<your-rustfs-endpoint>:9000/my-bucket/dapr/hello.txt","versionID":null}
```

## 4. オブジェクトを読み戻す

`get` 操作はオブジェクトの内容をレスポンスボディで返します：

```bash
curl -s -X POST http://localhost:3500/v1.0/bindings/rustfs-s3 \
  -H "Content-Type: application/json" \
  -d '{"operation":"get","metadata":{"key":"dapr/hello.txt"}}'
```

```text
hello from dapr
```

独立したクライアントから同じオブジェクトを確認します：

```bash
aws s3 cp s3://my-bucket/dapr/hello.txt - \
  --endpoint-url http://<your-rustfs-endpoint>:9000
```

```text
hello from dapr
```

![RustFS コンソール上の Dapr バインディングのオブジェクト](./images/rustfs-dapr-binding.png)

## 5. 停止またはリセット

バケットのオブジェクトを残したままサイドカーを解体するには：

```bash
docker rm -f dapr
```

デモのオブジェクトを削除するには：

```bash
aws s3 rm s3://my-bucket/dapr/hello.txt \
  --endpoint-url http://<your-rustfs-endpoint>:9000
```

## トラブルシューティング

### バインディングの初期化が S3 エラーで失敗する

4 つの addressing 値をまとめて確認してください。`endpoint` はスキーマを含むこと、`region` は AWS 以外のエンドポイントでも必須、`forcePathStyle` は `"true"` であることが必要です。`forcePathStyle` がないと、RustFS が拒否するバーチャルホスト形式のリクエストが送られます。

### 呼び出し時に `no such binding`

サイドカーがコンポーネントをロードしていません。ファイルが `.yaml` で終わり、`--resources-path` に渡したディレクトリに置かれていること、手順 2 の初期化行がログに出ていることを確認してください。

### `get` が空の内容を返す

`metadata.key` が作成時に使ったキーと一致していません。キーは大文字小文字を区別し、プレフィックスを含みます。

## 次のステップ

- バインディングの `list`・`delete`・`presign` 操作を採用する前に [S3 互換性についての注意](/administration/protocols/s3) を確認してください。
- [アクセスキー管理](/security-compliance/iam/access-token) で本番用の専用認証情報を作成し、コンポーネントへの平文ではなく Dapr のシークレットストアから参照してください。
- [Dapr S3 バインディングのドキュメント](https://docs.dapr.io/reference/components-reference/supported-bindings/s3/) に従い、全操作セットとリトライ動作を利用してください。
