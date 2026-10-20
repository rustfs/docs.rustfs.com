---
title: "Guide du SDK Go"
description: "Utilisez le SDK AWS pour Go v2 afin d’agir sur des instances RustFS, notamment pour créer et supprimer des compartiments et des objets."
---

RustFS ne fournit pas de SDK Go propre. Il est compatible avec S3 : vous utilisez donc le SDK AWS officiel pour Go v2, configuré pour pointer vers votre serveur RustFS. Avec ce SDK, vous pouvez créer et supprimer des compartiments (buckets), charger (upload) et télécharger des objets, ainsi que les supprimer.

## Prérequis

- Go 1.21 ou ultérieur
- Une instance RustFS opérationnelle (reportez-vous au [guide d’installation](../../installation/index.md)) : l’API S3 écoute sur le port `9000`, la Console sur le port `9001`
- Des clés d’accès, définies à l’installation par les variables d’environnement `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` (reportez-vous à la [gestion des clés d’accès](../../security-compliance/iam/access-token.md))

:::tip[Essai local]

Si vous n’avez pas défini d’identifiants à l’installation, le serveur utilise par défaut `rustfsadmin` / `rustfsadmin`. Cela convient à un essai local jetable, jamais à une instance accessible à d’autres personnes.

:::

Installez les modules du SDK :

```bash
go mod init rustfs-go-demo
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/credentials
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## Initialiser le client

Le programme suivant est complet et exécutable. Il lit sa configuration dans les variables d’environnement et initialise le client à partir d’un `aws.Config` :

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

Ces noms de variables d’environnement (`RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION`, `RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`) ne sont que des conventions côté client propres à cet exemple : c’est votre programme Go qui les lit, et non RustFS. Ces noms sont distincts des variables côté serveur `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY`, utilisées lors de l’installation de RustFS.

:::

Exécutez-le (remplacez `localhost` par l’adresse IP de votre serveur si RustFS s’exécute sur une autre machine) :

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

Vous pouvez maintenant effectuer des opérations sur les compartiments et les objets. Les extraits ci-dessous s’exécutent dans la fonction `main` ci-dessus et réutilisent `client` et `ctx`.

## Créer un compartiment

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

## Lister les compartiments

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

## Supprimer un compartiment

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

## Lister les objets

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

## Charger un objet

Chargement d’un corps sous forme de chaîne (ajoutez `"strings"` à vos importations) :

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

## Télécharger un objet

Lecture du corps de l’objet (ajoutez `"io"` à vos importations) :

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

Pour les autres opérations (URL présignées, chargements partitionnés, etc.), consultez la [documentation de l’AWS SDK pour Go v2](https://aws.github.io/aws-sdk-go-v2/docs/). La plupart des opérations S3 fonctionnent de la même manière avec RustFS ; les exceptions sont décrites dans la [compatibilité S3](/fr/reference/s3-compatibility).
