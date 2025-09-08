---
title: "RustFS Golang SDK Benutzerhandbuch"
description: "Verwenden Sie das Golang SDK, um RustFS-Instanzen zu verwalten, einschließlich der Erstellung und Löschung von Buckets und Objekten."
---

# Golang SDK

Da RustFS ein vollständig S3-kompatibles Objektspeichersystem ist, können Sie durch das Wrapping des S3 Golang SDK ein für RustFS geeignetes Golang SDK erstellen. Über das SDK können Sie RustFS verwalten, einschließlich der Erstellung und Löschung von Buckets/Objekten, dem Hoch- und Herunterladen von Dateien usw.

## Voraussetzungen

- Eine funktionierende RustFS-Instanz (siehe [Installationsanleitung](../../installation/index.md) für die Installation).
- Zugriffsschlüssel (siehe [Zugriffsschlüssel-Verwaltung](../../administration/iam/access-token.md) für die Erstellung).

## RustFS Golang SDK Konstruktion

Verwenden Sie `RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`, `RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION`, um eine `aws.Config` zu erstellen, und verwenden Sie dann `s3.NewFromConfig` aus dem Golang S3 SDK, um einen RustFS Client zu erstellen:

```
region := os.Getenv("RUSTFS_REGION")
access_key_id := os.Getenv("RUSTFS_ACCESS_KEY_ID")
secret_access_key := os.Getenv("RUSTFS_SECRET_ACCESS_KEY")
endpoint := os.Getenv("RUSTFS_ENDPOINT_URL")
// usePathStyle := strings.ToLower(os.Getenv("AWS_S3_USE_PATH_STYLE")) == "true"

if access_key_id == "" || secret_access_key == "" || region == "" || endpoint == "" {
    log.Fatal("missing the env: RUSTFS_ACCESS_KEY_ID / RUSTFS_SECRET_ACCESS_KEY / RUSTFS_REGION / RUSTFS_ENDPOINT_URL")
}

// build aws.Config
cfg := aws.Config{
    Region: region,
    EndpointResolver: aws.EndpointResolverFunc(func(service, region string) (aws.Endpoint, error) {
        return aws.Endpoint{
            URL: endpoint,
        }, nil
    }),
    Credentials: aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(access_key_id, secret_access_key, "")),
}

// build S3 client
client := s3.NewFromConfig(cfg, func(o *s3.Options) {
    o.UsePathStyle = true
})
```

Dann können Sie den erstellten RustFS Client für Bucket- und Objektoperationen verwenden.

## Bucket erstellen

```
_, err = client.CreateBucket(ctx, &s3.CreateBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("create bucket failed: %v", err)
}
```

## Buckets auflisten

```
resp, err := client.ListBuckets(ctx, &s3.ListBucketsInput{})
if err != nil {
    log.Fatalf("list buckets failed: %v", err)
}

fmt.Println("Buckets:")
for _, b := range resp.Buckets {
    fmt.Println(" -", *b.Name)
}
```

## Bucket löschen

```
_, err = client.DeleteBucket(ctx, &s3.DeleteBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("delete bucket failed: %v", err)
}
```

## Objekte auflisten

```
resp, err := client.ListObjectsV2(ctx, &s3.ListObjectsV2Input{
    Bucket: aws.String("bucket-target"),
})
if err != nil {
    log.Fatalf("list object failed: %v", err)
}
for _, obj := range resp.Contents {
    fmt.Println(" -", *obj.Key)
}
```

## Objekt hochladen

```
_, err = client.PutObject(ctx, &s3.PutObjectInput{
    Bucket: aws.String("bucket-target"),
    Key:    aws.String("test.txt"),
    Body:   strings.NewReader("hello rustfs"),
})
if err != nil {
    log.Fatalf("upload object failed: %v", err)
}
```

## Objekt herunterladen

```
resp, err := client.GetObject(ctx, &s3.GetObjectInput{
    Bucket: aws.String("bucket-target"),
    Key:    aws.String("1.txt"),
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

Für andere Verwendungen können Sie selbst erkunden. Mit Vibe Coding wird es noch einfacher!
