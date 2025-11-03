---
title: "RustFS Golang SDK 使用指南"
description: "通过 Golang SDK 来对 RustFS 实例进行操作,包括存储桶、对象的创建和删除."
---

# Golang SDK

由于 RustFS 是完全兼容 S3 的对象存储系统，因此可以通过对 S3 的 Golang SDK 做一些封装来构建适用于 RustFS 的 Golang SDK，通过 SDK 对 RustFS 进行操作，包括存储桶/对象的创建和删除、文件的上传和下载等。

## 前提条件

- 一个可用的 RustFS 实例（可参考[安装指南](../../installation/index.md)进行安装）。
- 访问密钥（可参考[访问密钥管理](../../administration/iam/access-token.md)进行创建）。

## RustFS Golang SDK 构造

利用 `RUSTFS_ACCESS_KEY_ID`、`RUSTFS_SECRET_ACCESS_KEY`、`RUSTFS_ENDPOINT_URL`、`RUSTFS_REGION` 构造一个 `aws.Config`，然后使用 Golang S3 SDK 中的 `s3.NewFromConfig` 构建一个 RustFS Client：

```go
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

接着就可以使用构造好的 RustFS Client 进行存储桶、对象的操作了。

## 创建存储桶

```go
_, err = client.CreateBucket(ctx, &s3.CreateBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("create bucket failed: %v", err)
}
```

## 列出存储桶

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

## 删除存储桶

```go
_, err = client.DeleteBucket(ctx, &s3.DeleteBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("delete bucket failed: %v", err)
}
```

## 列出存储对象

```go
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

## 上传对象

```go
_, err = client.PutObject(ctx, &s3.PutObjectInput{
    Bucket: aws.String("bucket-target"),
    Key:    aws.String("test.txt"),
    Body:   strings.NewReader("hello rustfs"),
})
if err != nil {
    log.Fatalf("upload object failed: %v", err)
}
```

## 下载对象

```go
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

## 获取预签名上传URL

```go
presignClient := s3.NewPresignClient(client, func(options *s3.PresignOptions) {
    options.ClientOptions = []func(oo *s3.Options){
        func(oo *s3.Options) {
            oo.UsePathStyle = true
        },
    }
})
filename := "a/a.txt"
putObjectInput := s3.PutObjectInput{
    Bucket: aws.String(config.Cfg.Oss.Bucket),
    Key:    aws.String(filename),
}
presignResult, err := presignClient.PresignPutObject(ctx, &putObjectInput, func(po *s3.PresignOptions) {
    po.ClientOptions = []func(oo *s3.Options){
        func(oo *s3.Options) {
            oo.UsePathStyle = true
        },
    }
    po.Expires = uploadConfig.Expiration // 授权时效
})
if err != nil {
    return nil, errors.New("Couldn't get presigned URL for GetObject" + err.Error())
}
fmt.Printf("上传URL: %s\n", presignResult.URL)
```

## 获取预签名下载URL

```go
presignClient := s3.NewPresignClient(client, func(options *s3.PresignOptions) {
    options.ClientOptions = []func(oo *s3.Options){
        func(oo *s3.Options) {
            oo.UsePathStyle = true
        },
    }
})
filename := "a/a.txt"
getObjectInput := s3.GetObjectInput{
    Bucket: aws.String(config.Cfg.Oss.Bucket),
    Key:    aws.String(filename),
}
presignResult, err := presignClient.PresignGetObject(ctx, &getObjectInput, func(po *s3.PresignOptions) {
    // 授权时效
    po.Expires = expiration
})
if err != nil {
    return nil, errors.New("Couldn't get presigned URL for GetObject,err: " + err.Error())
}
fmt.Printf("访问URL: %s\n", presignResult.URL)
```

其他的使用，大家可以自行探索，如果借助 Vibe Coding，就更简单了！
