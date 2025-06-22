---
title: "Java SDK"
description: "This article mainly explains the use of Java SDK in RustFS."
---

# Java SDK

RustFS is an object storage system compatible with the S3 protocol, supporting integration with the system through AWS S3 SDK. This article will use the AWS S3 Java SDK as an example to introduce how to build a development environment from scratch, connect to RustFS, and complete basic object storage operations.

## 1. Integrating AWS S3 Java SDK

### 1.1 Create Maven Project

Use the following directory structure or create a new Maven project in IDE:

```
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

```xml
<dependencies>
    <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>s3</artifactId>
        <version>2.25.27</version>
    </dependency>
</dependencies>
```

> We recommend using AWS SDK v2 version, which has more complete functionality and supports asynchronous, reactive modes.

---

## 2. Connect and Use RustFS

### 2.1 Initialize S3 Client

```java
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
                .endpointOverride(URI.create("http://192.168.1.100:9000")) // RustFS address
                .region(Region.US_EAST_1) // Can be hardcoded, RustFS doesn't validate region
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
                        )
                )
                .forcePathStyle(true) // Key configuration! RustFS requires Path-Style enabled
                .build();

        // 2. Create Bucket
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
                Paths.get("hello.txt")
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

---

## 3. Common Issues and Troubleshooting

| Issue | Cause | Solution |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `S3Exception: 301 Moved Permanently` | Path-style not enabled or region error | Set `.forcePathStyle(true)` and use any region value |
| `ConnectException: Connection refused` | RustFS not started or incorrect port | Check RustFS status and port |
| `403 Forbidden` | AccessKey / SecretKey error | Check authentication configuration |
| Upload fails with no response | SDK defaults to HTTPS, RustFS only supports HTTP (or requires certificates) | Use `http://` address and configure `endpointOverride` |

---

## 4. Appendix

### 4.1 Maven Packaging

Package the project:

```bash
mvn clean package
```

Execute:

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 RustFS Configuration Recommendations

* Ensure SSL verification is disabled when service uses HTTP protocol.
* Enable CORS support (if used for web frontend).
* Recommend setting `max_object_size` and `max_part_size` limits to prevent large file transfer failures.

---

## 5. Advanced Java Feature Examples

### 5.1 Generate and Use Presigned URLs

> Presigned URLs allow clients to temporarily access private objects without exposing credentials, widely used for browser direct upload or download scenarios.

#### 5.1.1 Add Dependencies (URL signing for v2 SDK is in the `s3-presigner` module)

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3-presigner</artifactId>
    <version>2.25.27</version>
</dependency>
```

#### 5.1.2 Generate Download Link (GET)

```java
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

S3Presigner presigner = S3Presigner.builder()
        .endpointOverride(URI.create("http://192.168.1.100:9000"))
        .region(Region.US_EAST_1)
        .credentialsProvider(
                StaticCredentialsProvider.create(
                        AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
                )
        )
        .build();

GetObjectRequest getObjectRequest = GetObjectRequest.builder()
        .bucket("my-bucket")
        .key("hello.txt")
        .build();

GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
        .getObjectRequest(getObjectRequest)
        .signatureDuration(Duration.ofMinutes(15)) // Valid for 15 minutes
        .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
String url = presignedRequest.url().toString();

System.out.println("Presigned GET URL: " + url);
```

### 5.2 Multipart Upload

For files larger than 10 MB, you can manually control each part.

```java
import software.amazon.awssdk.services.s3.model.*;

String bucket = "my-bucket";
String key = "large-file.bin";

// 1. Initiate multipart upload
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
        .bucket(bucket)
        .key(key)
        .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();

// 2. Upload parts
List<CompletedPart> completedParts = new ArrayList<>();
// ... upload logic ...

// 3. Complete multipart upload
CompleteMultipartUploadRequest completeRequest = CompleteMultipartUploadRequest.builder()
        .bucket(bucket)
        .key(key)
        .uploadId(uploadId)
        .multipartUpload(CompletedMultipartUpload.builder().parts(completedParts).build())
        .build();

s3.completeMultipartUpload(completeRequest);
```
