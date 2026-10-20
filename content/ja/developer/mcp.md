---
title: "RustFS MCP サーバー"
description: "RustFS MCP サーバーで、AI アシスタントを RustFS のオブジェクトストレージに接続します。"
---

**RustFS MCP Server** は、[Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) のサーバーです。Claude Desktop などの AI アシスタントに、S3 互換のオブジェクトストレージへのアクセスを提供します。

### MCP とは

Model Context Protocol は、AI アプリケーションが外部システムとの間に、安全で制御された接続を確立するためのオープン標準です。このサーバーは AI ツールと S3 互換ストレージサービスをつなぎ、セキュリティとオブザーバビリティを保ったまま、ファイル操作を構造化された形で提供します。

## 機能

### 対応する S3 操作

- **バケットの一覧**: アクセスできる S3 バケットをすべて列挙します。
- **オブジェクトの一覧**: 任意のプレフィックスで絞り込みながら、バケットの内容を参照します。
- **ファイルのアップロード**: MIME タイプの自動判定とキャッシュ制御を使って、ローカルファイルをアップロードします。
- **オブジェクトの取得**: S3 ストレージからオブジェクトを取得します。読み取りとダウンロードの両モードに対応します。

## インストール

:::warning[ビルド手順が古い可能性があります]

`rustfs-mcp` クレートは、現在の `rustfs/rustfs` の main ブランチには含まれていません。そのため、新しいクローンに対して以下のビルドコマンドは失敗することがあります。ソースからビルドする前に、[RustFS の GitHub 組織](https://github.com/rustfs) で MCP サーバーの現在の場所を確認します。

:::

### 前提条件

- Rust 1.75 以降（ソースからビルドする場合）
- 設定済みの AWS 認証情報（環境変数、AWS CLI、または IAM ロール）
- S3 互換のストレージサービスへのアクセス

### ソースからのビルド

```bash
# Clone the repository
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# Build the MCP server
cargo build --release -p rustfs-mcp

# Binary will be available at
./target/release/rustfs-mcp
```

## 設定

### 環境変数

```bash
# AWS credentials (required)
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1  # optional, defaults to us-east-1

# Optional: Custom S3 endpoint (for MinIO, etc.)
export AWS_ENDPOINT_URL=http://localhost:9000

# Log level (optional)
export RUST_LOG=info
```

### コマンドラインオプション

```bash
rustfs-mcp --help
```

サーバーは、動作をカスタマイズする複数のコマンドラインオプションに対応しています。

- `--access-key-id`: S3 認証に使う AWS のアクセスキー ID
- `--secret-access-key`: S3 認証に使う AWS のシークレットキー
- `--region`: S3 操作に使う AWS リージョン（既定: us-east-1）
- `--endpoint-url`: カスタムの S3 エンドポイント URL（MinIO や LocalStack など）
- `--log-level`: ログレベルの設定（既定: rustfs_mcp_server=info）

## 使い方

### サーバーの起動

```bash
# Start the MCP server
rustfs-mcp

# Or with custom options
rustfs-mcp --log-level debug --region us-east-1
```

### チャットクライアントとの連携

#### 方法 1: コマンドライン引数を使う

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "your_access_key",
        "--secret-access-key", "your_secret_key",
        "--region", "us-east-1",
        "--log-level", "info"
      ]
    }
  }
}
```

#### 方法 2: 環境変数を使う

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "env": {
        "AWS_ACCESS_KEY_ID": "your_access_key",
        "AWS_SECRET_ACCESS_KEY": "your_secret_key",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

### Docker で使う

コンテナイメージのビルドには、RustFS MCP の[公式 Dockerfile](https://github.com/rustfs/rustfs/tree/main/crates/mcp) を使えます。

```bash
# Clone RustFS repository code
git clone https://github.com/rustfs/rustfs.git

# Build Docker image
docker build -f crates/mcp/Dockerfile -t rustfs/rustfs-mcp .
```

ビルドが成功したら、IDE の MCP 設定にサーバーを追加します。

#### AI IDE での MCP 設定

Cursor、Windsurf、Trae など、多くの AI IDE が MCP に対応しています。たとえば Trae では、MCP 設定の **MCP --> Add**（追加）に次の内容を追加します。

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "AWS_ACCESS_KEY_ID",
        "-e",
        "AWS_SECRET_ACCESS_KEY",
        "-e",
        "AWS_REGION",
        "-e",
        "AWS_ENDPOINT_URL",
        "rustfs/rustfs-mcp"
      ],
      "env": {
        "AWS_ACCESS_KEY_ID": "rustfs_access_key",
        "AWS_SECRET_ACCESS_KEY": "rustfs_secret_key",
        "AWS_REGION": "us-east-1",
        "AWS_ENDPOINT_URL": "rustfs_instance_url"
      }
    }
  }
}
```

> `AWS_ACCESS_KEY_ID` と `AWS_SECRET_ACCESS_KEY` は、RustFS のアクセスキーです。作成方法は[アクセスキーの管理](../security-compliance/iam/access-token.md)を参照します。

サーバーの追加に成功すると、MCP の設定ページに[利用できるツール](#available-tools)が一覧表示されます。

![Trae の MCP 設定に追加された RustFS MCP サーバー](images/add-rustfs-mcp-succ.png)

Trae で MCP ツールを呼び出すには、チャットにプロンプトを入力します。例:

```text
List the buckets in this RustFS instance.
```

Trae は次の応答を返します。

![RustFS MCP でバケットを一覧した画面](images/list-rustfs-bucket-with-mcp.png)

Trae は **Builder with MCP**（MCP を使うビルダー）モードで `list_buckets` ツールを呼び出し、設定済みの RustFS インスタンスにあるバケットをすべて列挙します。他のツールも同じように動作します。

## 利用できるツール [#available-tools]

MCP サーバーは、AI アシスタントが使える次のツールを公開します。

### `list_buckets`

設定済みの認証情報でアクセスできる S3 バケットをすべて列挙します。

**パラメータ**: なし

### `list_objects`

任意のプレフィックスで絞り込みながら、S3 バケット内のオブジェクトを列挙します。

**パラメータ**:

- `bucket_name` (string): S3 バケットの名前
- `prefix` (string, optional): オブジェクトを絞り込むプレフィックス

### `upload_file`

MIME タイプを自動判定して、ローカルファイルを S3 にアップロードします。

**パラメータ**:

- `local_file_path` (string): ローカルファイルのパス
- `bucket_name` (string): アップロード先の S3 バケット
- `object_key` (string): S3 オブジェクトキー（保存先のパス）
- `content_type` (string, optional): コンテンツタイプ（未指定の場合は自動判定）
- `storage_class` (string, optional): S3 ストレージクラス
- `cache_control` (string, optional): Cache-Control ヘッダー

### `get_object`

S3 からオブジェクトを取得します。内容を直接読むモードと、ファイルへダウンロードするモードがあります。

**パラメータ**:

- `bucket_name` (string): 取得元の S3 バケット
- `object_key` (string): S3 オブジェクトキー
- `version_id` (string, optional): バージョニングされたオブジェクトのバージョン ID
- `mode` (string, optional): 操作モード。"read"（既定）は内容を直接返し、"download" はローカルファイルへ保存します
- `local_path` (string, optional): ローカルファイルのパス（mode が "download" の場合は必須です）
- `max_content_size` (number, optional): read モードで返す内容の最大サイズ。単位はバイト（既定: 1MB）

### `create_bucket`

新しい RustFS バケットを作成します。

**パラメータ**:

- `bucket_name` (string): 作成するバケットの名前。

### `delete_bucket`

指定した RustFS バケットを削除します。

**パラメータ**:

- `bucket_name` (string): 削除するバケットの名前。

## アーキテクチャ

MCP サーバーは、モジュール構成で構築されています。

```text
rustfs-mcp/
├── src/
│   ├── main.rs          # Entry point, CLI parsing and server initialization
│   ├── server.rs        # MCP server implementation and tool handlers
│   ├── s3_client.rs     # S3 client wrapper with async operations
│   ├── config.rs        # Configuration management and CLI options
│   └── lib.rs           # Library exports and public API
└── Cargo.toml           # Dependencies, metadata and binary configuration
```
