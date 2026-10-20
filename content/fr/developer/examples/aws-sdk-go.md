---
title: "AWS SDK pour Go"
description: "Connectez l’AWS SDK pour Go v2 à RustFS et effectuez des opérations objet de base."
---

L’[AWS SDK pour Go v2](https://aws.github.io/aws-sdk-go-v2/docs/) se connecte à RustFS par un point de terminaison de base personnalisé. Voici la recette de connexion minimale ; le [guide du SDK Go](../sdk/go.md) présente un programme complet.

## Installation

```bash
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/credentials
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## Configuration

Remplacez `http://localhost:9000` par l’adresse de votre serveur et utilisez vos propres [clés d’accès](../../security-compliance/iam/access-token.md). RustFS exige l’adressage de type chemin (path-style) (`UsePathStyle: true`) :

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

## Vérification

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

## Étapes suivantes

Consultez le [guide complet du SDK Go](../sdk/go.md), ou gérez les objets avec [`rc`](/fr/operations/rc).
