---
title: "Java SDK Guide"
description: "Use the official AWS SDK for Java v2 with RustFS."
---

RustFS ships no first-party Java SDK — it is S3-compatible, so you use the official AWS SDK for Java v2 configured to point at your RustFS server.

## 1. Prerequisites

* Java 8 or later and Maven (or Gradle)
* A running RustFS instance (see the [Installation Guide](../../installation/index.md)) — the S3 API listens on port `9000`, the Console on port `9001`
* Access keys, set at install time via the `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` environment variables (see [Access Key Management](../../security-compliance/iam/access-token.md))

:::tip[Local test]

If you did not set credentials at install time, the server defaults to `rustfsadmin` / `rustfsadmin` — fine for a throwaway local trial, never for anything reachable by others.

:::

### 1.1 Maven Project Setup

Create a new Maven project:

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

### 1.2 Add Dependencies

Add AWS SDK dependencies in `pom.xml`:

```xml title="pom.xml"
<dependencies>
  <dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.25.27</version>
  </dependency>
</dependencies>
```

> Recommend using AWS SDK v2, which has more complete features and supports async, reactive, and other patterns.

---

## 2. Connecting to RustFS

### 2.1 Complete Example

The following class compiles and runs as-is. Replace `localhost` with your server's IP address if RustFS runs on another machine, and fill in your own access keys:

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

Expected output:

```text
Bucket created: my-bucket
Uploaded hello.txt
Downloaded hello.txt
Found object: hello.txt
Deleted hello.txt
```

---

## 3. Common Issues and Troubleshooting

| Issue | Cause | Solution |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `S3Exception: 301 Moved Permanently` | Path-style not enabled or region error | Set `.forcePathStyle(true)` and use region `us-east-1` |
| `ConnectException: Connection refused` | RustFS not started or incorrect port | Check RustFS status and port |
| `403 Forbidden` | AccessKey / SecretKey error | Check authentication configuration |
| Upload fails with no response | SDK defaults to HTTPS, RustFS only supports HTTP (or needs certificates) | Use `http://` address and configure `endpointOverride` |

---

## 4. Appendix

### 4.1 Maven Package and Run

Package project:

```bash
mvn clean package
```

Execute:

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 RustFS Configuration Recommendations

* Ensure SSL validation is disabled when service uses HTTP protocol.
* Enable CORS support (if used for web frontend).
* Recommend setting limits like `max_object_size` and `max_part_size` to prevent large file transfer failures.

---

The following advanced examples cover:

* Presigned URL generation and usage
* Multipart Upload complete process

---

## 5. Java Advanced Features Examples

### 5.1 Generate and Use Presigned URLs

> Presigned URLs allow clients to temporarily access private objects without exposing credentials, widely used for browser direct upload or download file scenarios.

#### 5.1.1 Generate Download Link (GET)

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

> 🔗 Open the link in browser to access the object.

#### 5.1.2 Upload Presigned URL (PUT)

Similarly, you can also generate upload URLs:

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

### 5.2 Implement Multipart Upload

> Multipart Upload is the recommended way for large file uploads, enabling resume from breakpoint during network fluctuations.

The examples below reuse the `s3` client from section 2 and need these additional imports:

```java
import software.amazon.awssdk.services.s3.model.*;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
```

#### 5.2.1 Start Multipart Upload

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

#### 5.2.2 Upload Each Part

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

#### 5.2.3 Complete Multipart Upload

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

#### 5.2.4 Abort Upload on Exception (Optional)

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .uploadId(uploadId)
    .build();

s3.abortMultipartUpload(abortRequest);
```

---

For other operations (object tagging, bucket policies, and more), see the [AWS SDK for Java v2 documentation](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/) — every S3-compatible call works against RustFS the same way.
