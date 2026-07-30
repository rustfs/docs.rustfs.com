---
title: "Golang SDK 指南"
description: "使用 AWS SDK for Go v2 操作 RustFS 实例，包括创建和删除存储桶与对象。"
---

RustFS 不提供第一方 Go SDK。RustFS 与 S3 完全兼容，因此你可以配置官方 AWS SDK for Go v2，使其指向 RustFS 服务器。通过该 SDK，你可以操作 RustFS，包括创建和删除存储桶或对象、上传和下载文件等。

## 前提条件

- Go 1.21 或更高版本
- 一个正常运行的 RustFS 实例（请参阅[安装指南](../../installation/index.md)）；S3 API 监听端口 `9000`，控制台监听端口 `9001`
- 安装时通过 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` 环境变量设置的访问密钥（请参阅[访问密钥管理](../../security-compliance/iam/access-token.md)）

:::tip[本地测试]

如果安装时未设置凭证，服务器默认使用 `rustfsadmin` / `rustfsadmin`。这仅适合一次性本地试用，切勿用于其他人可访问的环境。

:::

安装 SDK 模块：

```bash
go mod init rustfs-go-demo
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/credentials
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## 初始化客户端

以下是一个可直接运行的完整程序。它从环境变量读取配置，并通过 `aws.Config` 初始化客户端：

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

这些环境变量名（`RUSTFS_ENDPOINT_URL`、`RUSTFS_REGION`、`RUSTFS_ACCESS_KEY_ID`、`RUSTFS_SECRET_ACCESS_KEY`）只是本示例的客户端约定，由你的 Go 程序读取，而不是由 RustFS 读取。它们不同于安装 RustFS 时使用的服务器端变量 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY`。

:::

运行该程序（如果 RustFS 在另一台计算机上运行，请将 `localhost` 替换为服务器 IP 地址）：

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

现在可以执行存储桶和对象操作。以下代码片段在上述 `main` 函数内运行，并复用 `client` 和 `ctx`。

## 创建存储桶

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

## 列出存储桶

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

## 删除存储桶

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

## 列出对象

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

## 上传对象

上传字符串正文（在 import 中添加 `"strings"`）：

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

## 下载对象

读取对象正文（在 import 中添加 `"io"`）：

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

有关其他操作（预签名 URL、分段上传等），请参阅 [AWS SDK for Go v2 文档](https://aws.github.io/aws-sdk-go-v2/docs/)。所有 S3 兼容调用都能以相同方式用于 RustFS。