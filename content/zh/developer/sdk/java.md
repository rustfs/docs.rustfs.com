---
title: "Java SDK 指南"
description: "将官方 AWS SDK for Java v2 与 RustFS 配合使用。"
---

RustFS 不提供第一方 Java SDK。RustFS 与 S3 兼容，因此你可以配置官方 AWS SDK for Java v2，使其指向 RustFS 服务器。

## 1. 前提条件

* Java 8 或更高版本，以及 Maven（或 Gradle）
* 一个正在运行的 RustFS 实例（请参阅[安装指南](../../installation/index.md)）；S3 API 监听端口 `9000`，控制台监听端口 `9001`
* 安装时通过 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` 环境变量设置的访问密钥（请参阅[访问密钥管理](../../security-compliance/iam/access-token.md)）

:::tip[本地测试]

如果安装时未设置凭证，服务器默认使用 `rustfsadmin` / `rustfsadmin`。这仅适合一次性本地试用，切勿用于其他人可访问的环境。

:::

### 1.1 设置 Maven 项目

创建一个新的 Maven 项目：

```text
rustfs-java-s3-demo/
├── pom.xml
└── src/
    └── main/
        └── java/
            └── com/
                └── example/
                    └── RustfsS3Example.java
```

### 1.2 添加依赖项

在 `pom.xml` 中添加 AWS SDK 依赖项：

```xml title="pom.xml"
<dependencies>
  <dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.25.27</version>
  </dependency>
</dependencies>
```

> 建议使用 AWS SDK v2。该版本功能更完整，并支持异步、响应式等模式。

---

## 2. 连接到 RustFS

### 2.1 完整示例

以下类可直接编译和运行。如果 RustFS 在另一台计算机上运行，请将 `localhost` 替换为服务器 IP 地址，并填写你自己的访问密钥：

```java title="RustfsS3Example.java"
package com.example;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.net.URI;
import java.nio.file.Paths;

public class RustfsS3Example {

    public static void main(String[] args) {
        // 1. Initialize S3 client
        S3Client s3 = S3Client.builder()
            .endpointOverride(URI.create("http://localhost:9000")) // RustFS S3 API address
            .region(Region.US_EAST_1) // RustFS default region
            .credentialsProvider(
                StaticCredentialsProvider.create(
                    AwsBasicCredentials.create("<your-access-key>", "<your-secret-key>")
                )
            )
            // RustFS uses path-style URLs by default; virtual-host style requires RUSTFS_SERVER_DOMAINS
            .forcePathStyle(true)
            .build();

        // 2. Create bucket
        String bucket = "my-bucket";
        try {
            s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
            System.out.println("Bucket created: " + bucket);
        } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {
            System.out.println("Bucket already exists.");
        }

        // 3. Upload file
        s3.putObject(
            PutObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
            Paths.get("/path/to/hello.txt")
        );
        System.out.println("Uploaded hello.txt");

        // 4. Download file
        s3.getObject(
            GetObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
            Paths.get("downloaded-hello.txt")
        );
        System.out.println("Downloaded hello.txt");

        // 5. List objects
        ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());
        listResponse.contents().forEach(obj -> System.out.println("Found object: " + obj.key()));

        // 6. Delete object
        s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key("hello.txt").build());
        System.out.println("Deleted hello.txt");

        // 7. Delete bucket (optional)
        // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());
    }
}
```

预期输出：

```text
Bucket created: my-bucket
Uploaded hello.txt
Downloaded hello.txt
Found object: hello.txt
Deleted hello.txt
```

---

## 3. 常见问题与故障排除

| 问题 | 原因 | 解决方案 |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `S3Exception: 301 Moved Permanently` | 未启用路径风格或区域错误 | 设置 `.forcePathStyle(true)` 并使用区域 `us-east-1` |
| `ConnectException: Connection refused` | RustFS 未启动或端口不正确 | 检查 RustFS 状态和端口 |
| `403 Forbidden` | AccessKey / SecretKey 错误 | 检查身份验证配置 |
| 上传失败且无响应 | SDK 默认使用 HTTPS，而 RustFS 仅支持 HTTP（或需要证书） | 使用 `http://` 地址并配置 `endpointOverride` |

---

## 4. 附录

### 4.1 Maven 打包和运行

打包项目：

```bash
mvn clean package
```

执行：

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 RustFS 配置建议

* 服务使用 HTTP 协议时，确保已禁用 SSL 验证。
* 如果用于 Web 前端，请启用 CORS 支持。
* 建议设置 `max_object_size` 和 `max_part_size` 等限制，以防止大文件传输失败。

---

以下高级示例涵盖：

* 生成和使用预签名 URL
* 完整的分段上传流程

---

## 5. Java 高级功能示例

### 5.1 生成和使用预签名 URL

> 预签名 URL 允许客户端在不暴露凭证的情况下临时访问私有对象，广泛用于浏览器直接上传或下载文件等场景。

#### 5.1.1 生成下载链接（GET）

```java
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.net.URI;
import java.time.Duration;

S3Presigner presigner = S3Presigner.builder()
    .endpointOverride(URI.create("http://localhost:9000"))
    .region(Region.US_EAST_1)
    .credentialsProvider(
        StaticCredentialsProvider.create(
            AwsBasicCredentials.create("<your-access-key>", "<your-secret-key>")
        )
    )
    // The presigner must also sign path-style URLs
    .serviceConfiguration(
        S3Configuration.builder().pathStyleAccessEnabled(true).build()
    )
    .build();

GetObjectRequest getObjectRequest = GetObjectRequest.builder()
    .bucket("my-bucket")
    .key("hello.txt")
    .build();

GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
    .getObjectRequest(getObjectRequest)
    .signatureDuration(Duration.ofMinutes(15)) // 15 minutes validity
    .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);

System.out.println("Presigned URL: " + presignedRequest.url());
```

```text
Presigned URL: http://localhost:9000/my-bucket/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

> 🔗 在浏览器中打开该链接即可访问对象。

#### 5.1.2 上传预签名 URL（PUT）

同样，你也可以生成上传 URL：

```java
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

PutObjectRequest putRequest = PutObjectRequest.builder()
    .bucket("my-bucket")
    .key("upload.txt")
    .build();

PresignedPutObjectRequest presignedPut = presigner.presignPutObject(
    PutObjectPresignRequest.builder()
        .putObjectRequest(putRequest)
        .signatureDuration(Duration.ofMinutes(10))
        .build()
);

System.out.println("Upload URL: " + presignedPut.url());
```

---

### 5.2 实现分段上传

> 分段上传是上传大文件的建议方式，可在网络波动时实现断点续传。

以下示例复用第 2 节中的 `s3` 客户端，并需要额外导入：

```java
import software.amazon.awssdk.services.s3.model.*;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
```

#### 5.2.1 开始分段上传

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

#### 5.2.2 上传各分段

```java
List<CompletedPart> completedParts = new ArrayList<>();
for (int i = 1; i <= 3; i++) {
    String partPath = "part" + i + ".bin"; // Assume each part is a local file
    UploadPartRequest uploadPartRequest = UploadPartRequest.builder()
        .bucket("my-bucket")
        .key("bigfile.zip")
        .uploadId(uploadId)
        .partNumber(i)
        .build();

    UploadPartResponse uploadPartResponse = s3.uploadPart(uploadPartRequest, Paths.get(partPath));
    completedParts.add(
        CompletedPart.builder()
            .partNumber(i)
            .eTag(uploadPartResponse.eTag())
            .build()
    );
}
```

#### 5.2.3 完成分段上传

```java
CompletedMultipartUpload completedUpload = CompletedMultipartUpload.builder()
    .parts(completedParts)
    .build();

CompleteMultipartUploadRequest completeRequest = CompleteMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .uploadId(uploadId)
    .multipartUpload(completedUpload)
    .build();

s3.completeMultipartUpload(completeRequest);
System.out.println("Multipart upload completed.");
```

```text
Multipart upload completed.
```

#### 5.2.4 出现异常时中止上传（可选）

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .uploadId(uploadId)
    .build();

s3.abortMultipartUpload(abortRequest);
```

---

有关其他操作（对象标签、存储桶策略等），请参阅 [AWS SDK for Java v2 文档](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/)。所有 S3 兼容调用都能以相同方式用于 RustFS。