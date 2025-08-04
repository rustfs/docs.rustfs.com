---
title: "S3 互換性"
description: "RustFS の S3 プロトコル互換性について説明します"
---

# S3 互換性

RustFS は Amazon S3 API と 100% 互換性があり、既存の S3 ベースのアプリケーションやツールをそのまま使用できます。

## 主要機能

### サポートされている S3 API

- **バケット操作**: CreateBucket, DeleteBucket, ListBuckets
- **オブジェクト操作**: PutObject, GetObject, DeleteObject, ListObjects
- **マルチパートアップロード**: CreateMultipartUpload, UploadPart, CompleteMultipartUpload
- **アクセス制御**: Bucket Policy, ACL
- **メタデータ**: カスタムヘッダーとタグ

### 互換性のあるツールとSDK

- **AWS CLI**: 完全サポート
- **AWS SDK**: 全言語版サポート（Python, Java, JavaScript, Go, Rust等）
- **MinIO Client (mc)**: 完全互換
- **サードパーティツール**: s3cmd, s3fs-fuse, rclone等

## 設定例

### AWS CLI 設定

```bash
aws configure set aws_access_key_id YOUR_ACCESS_KEY
aws configure set aws_secret_access_key YOUR_SECRET_KEY
aws configure set region us-east-1

# RustFS エンドポイントを使用
aws --endpoint-url http://localhost:9000 s3 ls
```

### Python SDK 使用例

```python
import boto3

# RustFS に接続
s3_client = boto3.client(
    's3',
    endpoint_url='http://localhost:9000',
    aws_access_key_id='YOUR_ACCESS_KEY',
    aws_secret_access_key='YOUR_SECRET_KEY'
)

# バケット作成
s3_client.create_bucket(Bucket='my-bucket')

# ファイルアップロード
s3_client.upload_file('local-file.txt', 'my-bucket', 'remote-file.txt')
```

## 互換性マトリックス

| 機能 | サポート状況 | 備考 |
|------|------------|------|
| 基本オブジェクト操作 | ✅ 完全 | GET, PUT, DELETE, HEAD |
| マルチパートアップロード | ✅ 完全 | 大容量ファイル対応 |
| バージョニング | ✅ 完全 | 同一オブジェクトの複数バージョン |
| サーバーサイド暗号化 | ✅ 完全 | SSE-S3, SSE-KMS |
| ライフサイクル管理 | ✅ 完全 | 自動アーカイブと削除 |
| バケットポリシー | ✅ 完全 | JSON ベースのアクセス制御 |
| CORS 設定 | ✅ 完全 | クロスオリジンリクエスト |
| バケット通知 | ✅ 完全 | イベント駆動型処理 |

## パフォーマンス最適化

### 推奨設定

```bash
# 並列アップロード設定
export AWS_S3_MAX_CONCURRENT_REQUESTS=50
export AWS_S3_MAX_BANDWIDTH=1000MB/s

# マルチパート閾値設定
export AWS_S3_MULTIPART_THRESHOLD=100MB
export AWS_S3_MULTIPART_CHUNKSIZE=50MB
```

### ベストプラクティス

1. **大容量ファイル**: マルチパートアップロードを使用
2. **小容量ファイル**: 単一 PUT 操作を使用
3. **並列処理**: 複数の同時接続を活用
4. **リージョン**: 近い地理的位置のエンドポイントを選択

## トラブルシューティング

### よくある問題

| 問題 | 原因 | 解決方法 |
|------|------|----------|
| 接続エラー | エンドポイント設定ミス | `--endpoint-url` パラメータを確認 |
| 認証エラー | 不正な認証情報 | Access Key と Secret Key を確認 |
| 権限エラー | バケットポリシー設定 | IAM ポリシーまたはバケットポリシーを確認 |

RustFS の S3 互換性により、既存の S3 ワークフローを変更することなく移行できます。

