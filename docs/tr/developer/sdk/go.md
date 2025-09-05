---
title: "RustFS Golang SDK Kullanım Kılavuzu"
description: "Golang SDK kullanarak RustFS örneklerinde işlem yapın, bucket ve nesnelerin oluşturulması ve silinmesi dahil."
---

# Golang SDK

RustFS tamamen S3 uyumlu bir nesne depolama sistemi olduğu için, S3'nin TypeScript SDK'sını sarmalayarak RustFS için uygun bir Golang SDK oluşturabilirsiniz. SDK aracılığıyla RustFS üzerinde işlem yapabilir, bucket/nesne oluşturma ve silme, dosya yükleme ve indirme vb. işlemleri gerçekleştirebilirsiniz.

## Önkoşullar

- Çalışan bir RustFS örneği (kurulum için [Kurulum Kılavuzu](../../installation/index.md) bölümüne bakın).
- Erişim anahtarları (oluşturma için [Erişim Anahtarı Yönetimi](../../administration/iam/access-token.md) bölümüne bakın).

## RustFS Golang SDK Yapısı

`RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`, `RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION` kullanarak bir `aws.Config` oluşturun, ardından Golang S3 SDK'sından `s3.NewFromConfig` kullanarak bir RustFS İstemcisi oluşturun:

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

Ardından oluşturulan RustFS İstemcisini kullanarak bucket ve nesne işlemlerini gerçekleştirebilirsiniz.

## Bucket Oluşturma

```
_, err = client.CreateBucket(ctx, &s3.CreateBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("create bucket failed: %v", err)
}
```

## Bucket Listeleme

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

## Bucket Silme

```
_, err = client.DeleteBucket(ctx, &s3.DeleteBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("delete bucket failed: %v", err)
}
```

## Nesne Listeleme

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

## Nesne Yükleme

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

## Nesne İndirme

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

Diğer kullanımlar için kendiniz keşfedebilirsiniz. Vibe Coding ile daha da basit hale gelir!
