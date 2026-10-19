---
title: "Go-SDK-Anleitung"
description: "Führen Sie mit dem AWS SDK für Go v2 Operationen auf RustFS-Instanzen aus, einschließlich des Erstellens und Löschens von Buckets und Objekten."
---

RustFS enthält kein eigenes Go-SDK. Der Dienst ist S3-kompatibel, daher verwenden Sie das offizielle AWS SDK für Go v2 und richten es auf Ihren RustFS-Server aus. Mit dem SDK erstellen und löschen Sie Buckets und laden Objekte hoch, herunter und löschen sie.

## Voraussetzungen

- Go 1.21 oder höher
- Eine funktionsfähige RustFS-Instanz (siehe [Installationsanleitung](../../installation/index.md)). Die S3-API nimmt Verbindungen auf Port `9000` entgegen, die Console (Weboberfläche) auf Port `9001`
- Zugriffsschlüssel, die Sie bei der Installation über die Umgebungsvariablen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` setzen (siehe [Zugriffsschlüssel-Verwaltung](../../security-compliance/iam/access-token.md))

:::tip[Lokaler Test]

Wenn Sie bei der Installation keine Anmeldedaten gesetzt haben, verwendet der Server standardmäßig `rustfsadmin` / `rustfsadmin`. Das reicht für einen wegwerfbaren lokalen Test, niemals für eine Instanz, die andere erreichen können.

:::

Installieren Sie die SDK-Module:

```bash
go mod init rustfs-go-demo
go get github.com/aws/aws-sdk-go-v2/aws
go get github.com/aws/aws-sdk-go-v2/credentials
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## Client initialisieren

Das folgende Programm ist vollständig und ausführbar. Es liest seine Konfiguration aus Umgebungsvariablen und initialisiert den Client aus einer `aws.Config`:

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

Diese Namen von Umgebungsvariablen (`RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION`, `RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`) sind nur Konventionen auf der Client-Seite dieses Beispiels. Ihr Go-Programm liest sie, nicht RustFS. Sie unterscheiden sich von den serverseitigen Variablen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY`, die bei der Installation von RustFS verwendet werden.

:::

Führen Sie das Programm aus (ersetzen Sie `localhost` durch die IP-Adresse Ihres Servers, wenn RustFS auf einem anderen Rechner läuft):

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

Sie können nun Bucket- und Objektoperationen ausführen. Die folgenden Ausschnitte laufen in der Funktion `main` oben und verwenden `client` und `ctx` weiter.

## Bucket erstellen

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

## Buckets auflisten

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

## Bucket löschen

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

## Objekte auflisten

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

## Objekt hochladen

Einen String-Body hochladen (fügen Sie `"strings"` zu Ihren Imports hinzu):

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

## Objekt herunterladen

Den Objekt-Body lesen (fügen Sie `"io"` zu Ihren Imports hinzu):

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

Weitere Operationen (vorsignierte URLs, mehrteilige Uploads und mehr) stehen in der [Dokumentation zum AWS SDK für Go v2](https://aws.github.io/aws-sdk-go-v2/docs/). Die meisten S3-Operationen funktionieren gegenüber RustFS auf dieselbe Weise. Ausnahmen stehen unter [S3-Kompatibilität](/de/reference/s3-compatibility).
