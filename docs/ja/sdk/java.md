---
title: "Java SDK"
description: "RustFS での Java SDK の使用方法"
---

# Java SDK

RustFS は AWS S3 SDK for Java と完全互換性があります。既存の Java アプリケーションを変更することなく、エンドポイントと認証情報を変更するだけで RustFS を使用できます。

## 依存関係の追加

### Maven

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.20.26</version>
</dependency>
```

### Gradle

```gradle
implementation 'software.amazon.awssdk:s3:2.20.26'
```

## 基本設定

```java
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import java.net.URI;

public class RustFSExample {
    private static final String ENDPOINT = "http://localhost:9000";
    private static final String ACCESS_KEY = "rustfsadmin";
    private static final String SECRET_KEY = "rustfspassword";
    
    public static void main(String[] args) {
        // RustFS クライアント作成
        S3Client s3Client = S3Client.builder()
            .endpointOverride(URI.create(ENDPOINT))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(ACCESS_KEY, SECRET_KEY)))
            .region(Region.US_EAST_1)
            .forcePathStyle(true)
            .build();
            
        // 使用例
        createBucket(s3Client, "my-bucket");
        uploadFile(s3Client, "my-bucket", "test.txt", "Hello RustFS!");
        downloadFile(s3Client, "my-bucket", "test.txt");
    }
}
```

## 主要操作

### バケット操作

```java
// バケット作成
public static void createBucket(S3Client s3Client, String bucketName) {
    try {
        CreateBucketRequest createBucketRequest = CreateBucketRequest.builder()
            .bucket(bucketName)
            .build();
        s3Client.createBucket(createBucketRequest);
        System.out.println("バケット作成成功: " + bucketName);
    } catch (S3Exception e) {
        System.err.println("バケット作成エラー: " + e.getMessage());
    }
}

// バケット一覧
public static void listBuckets(S3Client s3Client) {
    try {
        ListBucketsResponse listBucketsResponse = s3Client.listBuckets();
        for (Bucket bucket : listBucketsResponse.buckets()) {
            System.out.println("バケット: " + bucket.name());
        }
    } catch (S3Exception e) {
        System.err.println("バケット一覧取得エラー: " + e.getMessage());
    }
}
```

### オブジェクト操作

```java
// ファイルアップロード
public static void uploadFile(S3Client s3Client, String bucketName, 
                             String objectKey, String content) {
    try {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .contentType("text/plain")
            .build();
            
        s3Client.putObject(putObjectRequest, 
            RequestBody.fromString(content));
        System.out.println("ファイルアップロード成功: " + objectKey);
    } catch (S3Exception e) {
        System.err.println("アップロードエラー: " + e.getMessage());
    }
}

// ファイルダウンロード
public static void downloadFile(S3Client s3Client, String bucketName, 
                               String objectKey) {
    try {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .build();
            
        ResponseBytes<GetObjectResponse> objectBytes = 
            s3Client.getObjectAsBytes(getObjectRequest);
        String content = objectBytes.asUtf8String();
        System.out.println("ファイル内容: " + content);
    } catch (S3Exception e) {
        System.err.println("ダウンロードエラー: " + e.getMessage());
    }
}
```

### マルチパートアップロード

```java
public static void multipartUpload(S3Client s3Client, String bucketName, 
                                  String objectKey, File file) {
    try {
        // マルチパートアップロード開始
        CreateMultipartUploadRequest createRequest = 
            CreateMultipartUploadRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();
        CreateMultipartUploadResponse createResponse = 
            s3Client.createMultipartUpload(createRequest);
        String uploadId = createResponse.uploadId();
        
        // パート分割とアップロード
        List<CompletedPart> completedParts = new ArrayList<>();
        long partSize = 5 * 1024 * 1024; // 5MB
        long fileSize = file.length();
        int partNumber = 1;
        
        try (FileInputStream fis = new FileInputStream(file)) {
            for (long position = 0; position < fileSize; position += partSize) {
                long currentPartSize = Math.min(partSize, fileSize - position);
                
                UploadPartRequest uploadPartRequest = UploadPartRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .uploadId(uploadId)
                    .partNumber(partNumber)
                    .build();
                    
                byte[] buffer = new byte[(int) currentPartSize];
                fis.read(buffer);
                
                UploadPartResponse uploadPartResponse = s3Client.uploadPart(
                    uploadPartRequest, RequestBody.fromBytes(buffer));
                    
                completedParts.add(CompletedPart.builder()
                    .partNumber(partNumber)
                    .eTag(uploadPartResponse.eTag())
                    .build());
                    
                partNumber++;
            }
        }
        
        // マルチパートアップロード完了
        CompleteMultipartUploadRequest completeRequest = 
            CompleteMultipartUploadRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .uploadId(uploadId)
                .multipartUpload(CompletedMultipartUpload.builder()
                    .parts(completedParts)
                    .build())
                .build();
        s3Client.completeMultipartUpload(completeRequest);
        
        System.out.println("マルチパートアップロード完了");
    } catch (Exception e) {
        System.err.println("マルチパートアップロードエラー: " + e.getMessage());
    }
}
```

## 設定オプション

### 接続プール設定

```java
NettyNioAsyncHttpClient httpClient = NettyNioAsyncHttpClient.builder()
    .maxConcurrency(100)
    .maxPendingConnectionAcquires(1000)
    .connectionTimeout(Duration.ofSeconds(30))
    .readTimeout(Duration.ofSeconds(30))
    .writeTimeout(Duration.ofSeconds(30))
    .build();

S3AsyncClient s3AsyncClient = S3AsyncClient.builder()
    .endpointOverride(URI.create(ENDPOINT))
    .credentialsProvider(StaticCredentialsProvider.create(
        AwsBasicCredentials.create(ACCESS_KEY, SECRET_KEY)))
    .region(Region.US_EAST_1)
    .forcePathStyle(true)
    .httpClient(httpClient)
    .build();
```

### リトライ設定

```java
S3Client s3Client = S3Client.builder()
    .endpointOverride(URI.create(ENDPOINT))
    .credentialsProvider(StaticCredentialsProvider.create(
        AwsBasicCredentials.create(ACCESS_KEY, SECRET_KEY)))
    .region(Region.US_EAST_1)
    .forcePathStyle(true)
    .overrideConfiguration(ClientOverrideConfiguration.builder()
        .retryPolicy(RetryPolicy.builder()
            .numRetries(3)
            .build())
        .build())
    .build();
```

## ベストプラクティス

1. **リソース管理**: try-with-resources を使用して S3Client を自動的にクローズ
2. **非同期処理**: 大容量ファイルには S3AsyncClient を使用
3. **エラーハンドリング**: 適切な例外処理を実装
4. **認証情報**: 環境変数や設定ファイルで管理

```java
// リソース自動管理例
try (S3Client s3Client = S3Client.builder()
    .endpointOverride(URI.create(ENDPOINT))
    .credentialsProvider(StaticCredentialsProvider.create(
        AwsBasicCredentials.create(ACCESS_KEY, SECRET_KEY)))
    .region(Region.US_EAST_1)
    .forcePathStyle(true)
    .build()) {
    
    // S3 操作
    createBucket(s3Client, "my-bucket");
    uploadFile(s3Client, "my-bucket", "test.txt", "Hello RustFS!");
    
} catch (Exception e) {
    System.err.println("操作エラー: " + e.getMessage());
}
```

RustFS は AWS S3 API と完全互換性があるため、既存の Java アプリケーションを簡単に移行できます。

