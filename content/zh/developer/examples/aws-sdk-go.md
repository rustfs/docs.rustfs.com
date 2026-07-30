---
title: "AWS SDK for Go"
description: "将 AWS SDK for Go v2 连接到 RustFS，并执行基本对象操作。"
---

[AWS SDK for Go v2](https://aws.github.io/aws-sdk-go-v2/docs/) 可通过自定义基础端点连接到 RustFS。下面是最简连接方法；如需完整程序，请参阅 [Go SDK 指南](../sdk/go.md)。

## 安装

```bash
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/credentials
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## 配置

请将 `http://localhost:9000` 替换为您的服务器地址，并使用您自己的[访问密钥](../../security-compliance/iam/access-token.md)。RustFS 要求使用路径样式寻址 (`UsePathStyle: true`)：

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

## 验证

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

## 后续步骤

请参阅完整的 [Go SDK 指南](../sdk/go.md)，或使用 [`rc`](/operations/rc) 管理对象。