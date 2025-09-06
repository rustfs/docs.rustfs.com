---
title: "Руководство по использованию SDK Golang RustFS"
description: "Используйте SDK Golang для работы с экземплярами RustFS, включая создание и удаление корзин и объектов."
---

# SDK Golang

Поскольку RustFS является полностью совместимой с S3 системой объектного хранения, вы можете создать подходящий для RustFS SDK Golang, обернув SDK Golang S3. Через SDK вы можете работать с RustFS, включая создание и удаление корзин/объектов, загрузку и скачивание файлов и т.д.

## Предварительные требования

- Рабочий экземпляр RustFS (см. [Руководство по установке](../../installation/index.md) для установки).
- Ключи доступа (см. [Управление ключами доступа](../../administration/iam/access-token.md) для создания).

## Построение SDK Golang RustFS

Используйте `RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`, `RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION` для построения `aws.Config`, затем используйте `s3.NewFromConfig` из SDK S3 Golang для создания клиента RustFS:

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

Затем вы можете использовать созданный клиент RustFS для выполнения операций с корзинами и объектами.

## Создание корзины

```
_, err = client.CreateBucket(ctx, &s3.CreateBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("create bucket failed: %v", err)
}
```

## Список корзин

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

## Удаление корзины

```
_, err = client.DeleteBucket(ctx, &s3.DeleteBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("delete bucket failed: %v", err)
}
```

## Список объектов

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

## Загрузка объекта

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

## Скачивание объекта

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

Для других применений вы можете исследовать самостоятельно. С Vibe Coding это становится еще проще!
