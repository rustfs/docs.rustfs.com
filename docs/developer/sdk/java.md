---
title: "Java SDK Guide"
description: "Guide to using the Java SDK with RustFS."
---

# Java SDK

RustFS is S3-compatible. This guide demonstrates how to use the AWS SDK for Java v2 with RustFS.

## 1. Setup

### 1.1 Maven Project Setup

Create a new Maven project:

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

> Recommend using AWS SDK v2, which has more complete features and supports async, reactive, and other patterns.

---

## 2. Connecting to RustFS

### 2.1 Initialize the Client

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
 .region(Region.US_EAST_1) // RustFS does not validate regions
 .credentialsProvider(
 StaticCredentialsProvider.create(
 AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
 )
 )
 .forcePathStyle(true) // Required for RustFS compatibility
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
| `S3Exception: 301 Moved Permanently` | Path-style not enabled or region error | Set `.forcePathStyle(true)` and use any value for region |
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

Good, below is the **RustFS AWS S3 Java SDK Advanced Features Example Supplement**, including:

* Presigned URL generation and usage
* Multipart Upload complete process

---

## 5. Java Advanced Features Examples

### 5.1 Generate and Use Presigned URLs

> Presigned URLs allow clients to temporarily access private objects without exposing credentials, widely used for browser direct upload or download file scenarios.

#### 5.1.1 Add Dependencies (v2 SDK URL signing is in `s3-presigner` module)

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
 .signatureDuration(Duration.ofMinutes(15)) // 15 minutes validity
 .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);

System.out.println("Presigned URL: " + presignedRequest.url());
```

> 🔗 Open the link in browser to access the object.

#### 5.1.3 Upload Presigned URL (PUT)

Similarly, you can also generate upload URLs:

```java
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
