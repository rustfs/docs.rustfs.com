---
title: "AWS SDK for Go"
description: "Connect the AWS SDK for Go v2 to RustFS and perform basic object operations."
---

The [AWS SDK for Go v2](https://aws.github.io/aws-sdk-go-v2/docs/) connects to RustFS through a custom base endpoint. This is the minimal connection recipe; see the [Go SDK guide](../sdk/go.md) for a full program.

## Install

```bash
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/credentials
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## Configure

Replace `http://localhost:9000` with your server address and use your own [access keys](../../security-compliance/iam/access-token.md). RustFS requires path-style addressing (`UsePathStyle: true`):

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

## Verify

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

## Next steps

See the full [Go SDK guide](../sdk/go.md), or manage objects with [`rc`](/operations/rc).
