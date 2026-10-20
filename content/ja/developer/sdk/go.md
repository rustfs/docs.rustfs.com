---
title: "Golang"
description: "AWS SDK for Go v2 で RustFS インスタンスを操作し、バケットとオブジェクトの作成および削除を行います。"
---

RustFS は独自の Go SDK を提供していません。S3 互換であるため、公式の AWS SDK for Go v2 を、RustFS サーバーを指すように設定して使います。この SDK で、バケットの作成と削除、およびオブジェクトのアップロード、ダウンロード、削除ができます。

## 前提条件

- Go 1.21 以降
- 動作している RustFS インスタンス（[インストールガイド](../../installation/index.md)を参照）。S3 API はポート `9000`、Console はポート `9001` で待ち受けます
- インストール時に環境変数 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` で設定するアクセスキー（[アクセスキーの管理](../../security-compliance/iam/access-token.md)を参照）

:::tip[ローカル検証]

インストール時に認証情報を設定しなかった場合、サーバーの既定値は `rustfsadmin` / `rustfsadmin` です。使い捨てのローカル検証であれば問題ありませんが、外部から到達できる環境では使わないでください。

:::

SDK モジュールをインストールします。

```bash
go mod init rustfs-go-demo
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/credentials
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## クライアントの初期化

次のプログラムは、そのまま実行できます。環境変数から設定を読み取り、`aws.Config` でクライアントを初期化します。

```go title="main.go"
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func main() {
	region := os.Getenv("RUSTFS_REGION")
	accessKeyID := os.Getenv("RUSTFS_ACCESS_KEY_ID")
	secretAccessKey := os.Getenv("RUSTFS_SECRET_ACCESS_KEY")
	endpoint := os.Getenv("RUSTFS_ENDPOINT_URL")

	if accessKeyID == "" || secretAccessKey == "" || region == "" || endpoint == "" {
		log.Fatal("missing the env: RUSTFS_ACCESS_KEY_ID / RUSTFS_SECRET_ACCESS_KEY / RUSTFS_REGION / RUSTFS_ENDPOINT_URL")
	}

	// build aws.Config
	cfg := aws.Config{
		Region:      region,
		Credentials: aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(accessKeyID, secretAccessKey, "")),
	}

	// build S3 client
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(endpoint)
		// RustFS uses path-style URLs by default; virtual-host style requires RUSTFS_SERVER_DOMAINS
		o.UsePathStyle = true
	})

	ctx := context.Background()

	resp, err := client.ListBuckets(ctx, &s3.ListBucketsInput{})
	if err != nil {
		log.Fatalf("list buckets failed: %v", err)
	}

	fmt.Println("Buckets:")
	for _, b := range resp.Buckets {
		fmt.Println(" -", *b.Name)
	}
}
```

:::note

これらの環境変数名（`RUSTFS_ENDPOINT_URL`、`RUSTFS_REGION`、`RUSTFS_ACCESS_KEY_ID`、`RUSTFS_SECRET_ACCESS_KEY`）は、この例だけのクライアント側の取り決めです。Go プログラムが読み取り、RustFS サーバーは参照しません。インストール時に使うサーバー側の `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` とは別の変数です。

:::

実行します（RustFS が別のマシンで動作している場合は、`localhost` をそのサーバーの IP アドレスに置き換えます）。

```bash
export RUSTFS_ENDPOINT_URL="http://localhost:9000"
export RUSTFS_REGION="us-east-1"
export RUSTFS_ACCESS_KEY_ID="<your-access-key>"
export RUSTFS_SECRET_ACCESS_KEY="<your-secret-key>"
go run main.go
```

```text
Buckets:
 - my-bucket
```

これで、バケットとオブジェクトを操作できます。以下のコード片は、上の `main` 関数の中で、`client` と `ctx` を再利用して実行します。

## バケットの作成

```go
_, err = client.CreateBucket(ctx, &s3.CreateBucketInput{
	Bucket: aws.String("my-bucket"),
})
if err != nil {
	log.Fatalf("create bucket failed: %v", err)
}
fmt.Println("bucket created")
```

```text
bucket created
```

## バケットの一覧

```go
resp, err := client.ListBuckets(ctx, &s3.ListBucketsInput{})
if err != nil {
	log.Fatalf("list buckets failed: %v", err)
}

fmt.Println("Buckets:")
for _, b := range resp.Buckets {
	fmt.Println(" -", *b.Name)
}
```

```text
Buckets:
 - my-bucket
```

## バケットの削除

```go
_, err = client.DeleteBucket(ctx, &s3.DeleteBucketInput{
	Bucket: aws.String("my-bucket"),
})
if err != nil {
	log.Fatalf("delete bucket failed: %v", err)
}
fmt.Println("bucket deleted")
```

```text
bucket deleted
```

## オブジェクトの一覧

```go
resp, err := client.ListObjectsV2(ctx, &s3.ListObjectsV2Input{
	Bucket: aws.String("my-bucket"),
})
if err != nil {
	log.Fatalf("list object failed: %v", err)
}
for _, obj := range resp.Contents {
	fmt.Println(" -", *obj.Key)
}
```

```text
 - hello.txt
```

## オブジェクトのアップロード

文字列をボディとしてアップロードします（import に `"strings"` を追加します）。

```go
_, err = client.PutObject(ctx, &s3.PutObjectInput{
	Bucket: aws.String("my-bucket"),
	Key:    aws.String("hello.txt"),
	Body:   strings.NewReader("hello rustfs"),
})
if err != nil {
	log.Fatalf("upload object failed: %v", err)
}
fmt.Println("object uploaded")
```

```text
object uploaded
```

## オブジェクトのダウンロード

オブジェクトのボディを読み取ります（import に `"io"` を追加します）。

```go
resp, err := client.GetObject(ctx, &s3.GetObjectInput{
	Bucket: aws.String("my-bucket"),
	Key:    aws.String("hello.txt"),
})
if err != nil {
	log.Fatalf("download object fail: %v", err)
}
defer resp.Body.Close()

// read object content
data, err := io.ReadAll(resp.Body)
if err != nil {
	log.Fatalf("read object content fail: %v", err)
}
fmt.Println("content is :", string(data))
```

```text
content is : hello rustfs
```

署名付き URL、マルチパートアップロードなどの操作については、[AWS SDK for Go v2 のドキュメント](https://aws.github.io/aws-sdk-go-v2/docs/)を参照します。ほとんどの S3 操作は、RustFS に対しても同じように動作します。例外は [S3 互換性](/ja/reference/s3-compatibility) を参照します。
