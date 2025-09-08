---
title: "RustFS Golang SDK 使用ガイド"
description: "Golang SDK を使用して RustFS インスタンスを操作し、バケットやオブジェクトの作成・削除を行います。"
---

# Golang SDK

RustFS は完全に S3 互換のオブジェクトストレージシステムであるため、S3 の Golang SDK をラップして RustFS 用の Golang SDK を構築できます。SDK を通じて RustFS を操作し、バケット/オブジェクトの作成・削除、ファイルのアップロード・ダウンロードなどを行うことができます。

## 前提条件

- 動作する RustFS インスタンス（インストールについては[インストールガイド](../../installation/index.md)を参照）。
- アクセスキー（作成については[アクセスキー管理](../../administration/iam/access-token.md)を参照）。

## RustFS Golang SDK の構築

`RUSTFS_ACCESS_KEY_ID`、`RUSTFS_SECRET_ACCESS_KEY`、`RUSTFS_ENDPOINT_URL`、`RUSTFS_REGION` を使用して `aws.Config` を構築し、Golang S3 SDK の `s3.NewFromConfig` を使用して RustFS クライアントを構築します：

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

その後、構築された RustFS クライアントを使用してバケットやオブジェクトの操作を行うことができます。

## バケットの作成

```
_, err = client.CreateBucket(ctx, &s3.CreateBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("create bucket failed: %v", err)
}
```

## バケットの一覧表示

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

## バケットの削除

```
_, err = client.DeleteBucket(ctx, &s3.DeleteBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("delete bucket failed: %v", err)
}
```

## オブジェクトの一覧表示

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

## オブジェクトのアップロード

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

## オブジェクトのダウンロード

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

その他の使用法については、自分で探索できます。Vibe Coding を使えば、さらに簡単になります！
