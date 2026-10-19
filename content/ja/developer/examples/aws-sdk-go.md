---
title: "AWS SDK for Go"
description: "AWS SDK for Go v2 を RustFS に接続し、基本的なオブジェクト操作を行います。"
---

[AWS SDK for Go v2](https://aws.github.io/aws-sdk-go-v2/docs/) は、カスタムのベースエンドポイントを通じて RustFS に接続します。これは接続に必要な最小限の手順です。完全なプログラムについては、[Go SDK ガイド](../sdk/go.md)を参照します。

## インストール

```bash
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/credentials
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## 設定

`http://localhost:9000` を実際のサーバーアドレスに置き換え、独自の[アクセスキー](../../security-compliance/iam/access-token.md)を使います。RustFS ではパススタイルアクセス（`UsePathStyle: true`）が必要です。

```go {9,11}
import (
    "github.com/aws/aws-sdk-go-v2/aws"
    "github.com/aws/aws-sdk-go-v2/credentials"
    "github.com/aws/aws-sdk-go-v2/service/s3"
)

cfg := aws.Config{
    Region:      "us-east-1",
    Credentials: aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider("<your-access-key>", "<your-secret-key>", "")),
}
client := s3.NewFromConfig(cfg, func(o *s3.Options) {
    o.BaseEndpoint = aws.String("http://localhost:9000")
    o.UsePathStyle = true
})
```

## 検証

```go
ctx := context.Background()
client.CreateBucket(ctx, &s3.CreateBucketInput{Bucket: aws.String("my-bucket")})

out, _ := client.ListBuckets(ctx, &s3.ListBucketsInput{})
for _, b := range out.Buckets {
    fmt.Println(*b.Name)
}
```

```text
my-bucket
```

## 次のステップ

完全な [Go SDK ガイド](../sdk/go.md)を参照するか、[`rc`](/ja/operations/rc) でオブジェクトを管理します。
