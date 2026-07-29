---
title: "Golang SDK Guide"
description: "Use the AWS SDK for Go v2 to operate on RustFS instances, including creating and deleting buckets and objects."
---

RustFS ships no first-party Go SDK — it is fully S3-compatible, so you use the official AWS SDK for Go v2 configured to point at your RustFS server. Through the SDK, you can operate on RustFS, including creating and deleting buckets/objects, uploading and downloading files, etc.

## Prerequisites

- Go 1.21 or later
- A working RustFS instance (refer to [Installation Guide](../../installation/index.md)) — the S3 API listens on port `9000`, the Console on port `9001`
- Access keys, set at install time via the `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` environment variables (refer to [Access Key Management](../../security-compliance/iam/access-token.md))

:::tip[Local test]

If you did not set credentials at install time, the server defaults to `rustfsadmin` / `rustfsadmin` — fine for a throwaway local trial, never for anything reachable by others.

:::

Install the SDK modules:

```bash
go mod init rustfs-go-demo
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/credentials
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## Initializing the Client

The following is a complete, runnable program. It reads its configuration from environment variables and initializes the client from an `aws.Config`:

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

These environment variable names (`RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION`, `RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`) are just this example's client-side conventions — they are read by your Go program, not by RustFS. They are distinct from the server-side `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` variables used when installing RustFS.

:::

Run it (replace `localhost` with your server's IP address if RustFS runs on another machine):

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

You can now perform bucket and object operations. The snippets below run inside the `main` function above, reusing `client` and `ctx`.

## Create Bucket

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

## List Buckets

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

## Delete Bucket

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

## List Objects

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

## Upload Object

Uploading a string body (add `"strings"` to your imports):

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

## Download Object

Reading the object body (add `"io"` to your imports):

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

For other operations (presigned URLs, multipart uploads, and more), see the [AWS SDK for Go v2 documentation](https://aws.github.io/aws-sdk-go-v2/docs/) — every S3-compatible call works against RustFS the same way.
