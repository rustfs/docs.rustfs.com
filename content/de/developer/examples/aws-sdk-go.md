---
title: "AWS SDK für Go"
description: "Verbinden Sie das AWS SDK für Go v2 mit RustFS und führen Sie grundlegende Objektoperationen aus."
---

Das [AWS SDK für Go v2](https://aws.github.io/aws-sdk-go-v2/docs/) verbindet sich über einen benutzerdefinierten Basis-Endpunkt mit RustFS. Dies ist das minimale Verbindungsbeispiel. Ein vollständiges Programm steht in der [Go-SDK-Anleitung](../sdk/go.md).

## Installation

```bash
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/credentials
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## Konfiguration

Ersetzen Sie `http://localhost:9000` durch Ihre Serveradresse und verwenden Sie Ihre eigenen [Zugriffsschlüssel](../../security-compliance/iam/access-token.md). RustFS erfordert pfadbasierte Adressierung (Path-Style) (`UsePathStyle: true`):

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

## Überprüfung

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

## Nächste Schritte

Lesen Sie die vollständige [Go-SDK-Anleitung](../sdk/go.md), oder verwalten Sie Objekte mit [`rc`](/de/operations/rc).
