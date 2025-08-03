---
title: "RustFS MCP"
description: "RustFS MCP 使用指南"
---

# RustFS MCP

**RustFS MCP サーバー**は、高性能な[モデルコンテキストプロトコル（MCP）](https://spec.modelcontextprotocol.org)サーバーで、AI/LLMツールにS3互換オブジェクトストレージ操作へのシームレスなアクセスを提供します。このサーバーはRustで構築され、最大のパフォーマンスとセキュリティを実現し、Claude Desktopなどのアシスタントが標準化されたプロトコルを通じてクラウドストレージと対話できるようにします。

### MCPとは？

モデルコンテキストプロトコルは、AIアプリケーションが外部システムと安全で制御された接続を確立できるオープンスタンダードです。このサーバーは、AIツールとS3互換ストレージサービス間のブリッジとして機能し、セキュリティと観測性を維持しながらファイル操作への構造化アクセスを提供します。

## ✨ 特徴

### サポートされるS3操作

- **バケット一覧**：アクセス可能なすべてのS3バケットを一覧表示
- **オブジェクト一覧**：オプションのプレフィックスフィルタリングでバケット内容を閲覧
- **ファイルアップロード**：ローカルファイルのアップロード、MIMEタイプとキャッシュ制御の自動検出
- **オブジェクト取得**：S3ストレージからオブジェクトを取得、読み取りまたはダウンロードモード対応

## 🔧 インストール

### 前提条件

- Rust 1.88+（ソースからビルドする場合）
- 設定済みAWS認証情報（環境変数、AWS CLI、またはIAMロール経由）
- S3互換ストレージサービスへのアクセス

### ソースからビルド

```bash
# リポジトリをクローン
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# MCPサーバーをビルド
cargo build --release -p rustfs-mcp

# バイナリは以下のパスで利用可能
./target/release/rustfs-mcp
```

## ⚙️ 設定

### 環境変数

```bash
# AWS認証情報（必須）
export AWS_ACCESS_KEY_ID=あなたのアクセスキー
export AWS_SECRET_ACCESS_KEY=あなたのシークレットキー
export AWS_REGION=us-east-1  # オプション、デフォルトはus-east-1

# オプション：カスタムS3エンドポイント（MinIOなど用）
export AWS_ENDPOINT_URL=http://localhost:9000

# ログレベル（オプション）
export RUST_LOG=info
```

### コマンドラインオプション

```bash
rustfs-mcp --help
```

サーバーは動作をカスタマイズするための様々なコマンドラインオプションをサポートします：

- `--access-key-id`：S3認証用のAWSアクセスキーID
- `--secret-access-key`：S3認証用のAWSシークレットキー
- `--region`：S3操作に使用するAWSリージョン（デフォルト：us-east-1）
- `--endpoint-url`：カスタムS3エンドポイントURL（MinIO、LocalStackなど用）
- `--log-level`：ログレベル設定（デフォルト：rustfs_mcp_server=info）

-----

## 🚀 使用方法

### サーバー起動

```bash
# MCPサーバーを起動
rustfs-mcp

# またはカスタムオプションで起動
rustfs-mcp --log-level debug --region us-west-2
```

### チャットクライアントとの統合

#### オプション1：コマンドライン引数を使用

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "あなたのアクセスキー",
        "--secret-access-key", "あなたのシークレットキー",
        "--region", "us-west-2",
        "--log-level", "info"
      ]
    }
  }
}
```

#### オプション2：環境変数を使用

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "env": {
        "AWS_ACCESS_KEY_ID": "あなたのアクセスキー",
        "AWS_SECRET_ACCESS_KEY": "あなたのシークレットキー",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

## 🛠️ 利用可能なツール

MCPサーバーは、AIアシスタントが使用できる以下のツールを公開しています：

### `list_buckets`

設定された認証情報でアクセス可能なすべてのS3バケットを一覧表示します。

**パラメータ**：なし

### `list_objects`

S3バケット内のオブジェクトを一覧表示し、オプションのプレフィックスフィルタリングをサポートします。

**パラメータ**：
- `bucket_name` (文字列)：S3バケット名
- `prefix` (文字列, オプション)：オブジェクトをフィルタリングするプレフィックス

### `upload_file`

ローカルファイルをS3にアップロードし、MIMEタイプを自動検出します。

**パラメータ**：
- `local_file_path` (文字列)：ローカルファイルパス
- `bucket_name` (文字列)：対象S3バケット
- `object_key` (文字列)：S3オブジェクトキー（対象パス）
- `content_type` (文字列, オプション)：コンテンツタイプ（未提供の場合は自動検出）
- `storage_class` (文字列, オプション)：S3ストレージクラス
- `cache_control` (文字列, オプション)：キャッシュ制御ヘッダー

### `get_object`

S3からオブジェクトを取得し、2つの操作モードがあります：直接コンテンツ読み取りまたはファイルへのダウンロード。

**パラメータ**：
- `bucket_name` (文字列)：ソースS3バケット
- `object_key` (文字列)：S3オブジェクトキー
- `version_id` (文字列, オプション)：バージョン管理されたオブジェクトのバージョンID
- `mode` (文字列, オプション)：操作モード - "read"（デフォルト）で直接コンテンツを返す、"download"でローカルファイルに保存
- `local_path` (文字列, オプション)：ローカルファイルパス（モードが"download"の場合必須）
- `max_content_size` (数値, オプション)：読み取りモードの最大コンテンツサイズ（バイト）（デフォルト：1MB）

## アーキテクチャ

MCPサーバーはモジュラーアーキテクチャで構築されています：

```
rustfs-mcp/
├── src/
│   ├── main.rs          # エントリーポイント、CLI解析、サーバー初期化
│   ├── server.rs        # MCPサーバー実装とツールハンドラー
│   ├── s3_client.rs     # 非同期操作付きS3クライアントラッパー
│   ├── config.rs        # 設定管理とCLIオプション
│   └── lib.rs           # ライブラリエクスポートとパブリックAPI
└── Cargo.toml           # 依存関係、メタデータ、バイナリ設定
```

