---
title: "RustFS Golang SDK 사용 가이드"
description: "Golang SDK를 사용하여 RustFS 인스턴스를 조작하고, 버킷과 객체의 생성 및 삭제를 수행합니다."
---

# Golang SDK

RustFS는 완전히 S3 호환되는 객체 스토리지 시스템이므로, S3의 TypeScript SDK를 래핑하여 RustFS에 적합한 Golang SDK를 구축할 수 있습니다. SDK를 통해 RustFS를 조작하고, 버킷/객체의 생성 및 삭제, 파일 업로드 및 다운로드 등을 수행할 수 있습니다.

## 사전 요구사항

- 작동하는 RustFS 인스턴스 (설치에 대해서는 [설치 가이드](../../installation/index.md) 참조).
- 액세스 키 (생성에 대해서는 [액세스 키 관리](../../administration/iam/access-token.md) 참조).

## RustFS Golang SDK 구성

`RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`, `RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION`을 사용하여 `aws.Config`를 구성한 다음, Golang S3 SDK의 `s3.NewFromConfig`를 사용하여 RustFS 클라이언트를 구축합니다:

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

그런 다음 구성된 RustFS 클라이언트를 사용하여 버킷 및 객체 작업을 수행할 수 있습니다.

## 버킷 생성

```
_, err = client.CreateBucket(ctx, &s3.CreateBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("create bucket failed: %v", err)
}
```

## 버킷 목록

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

## 버킷 삭제

```
_, err = client.DeleteBucket(ctx, &s3.DeleteBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("delete bucket failed: %v", err)
}
```

## 객체 목록

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

## 객체 업로드

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

## 객체 다운로드

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

다른 사용법은 직접 탐색할 수 있습니다. Vibe Coding을 사용하면 더욱 간단해집니다!
