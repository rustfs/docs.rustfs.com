---
title: "Java SDK"
description: "RustFS에서 AWS S3 Java SDK를 사용하는 방법."
---

# Java SDK

RustFS는 S3 호환 객체 스토리지로, AWS S3 SDK를 통해 손쉽게 연동할 수 있습니다. 이 문서는 AWS S3 Java SDK를 예로 들어 개발 환경 구성, RustFS 연결, 기본 객체 조작을 단계적으로 설명합니다.

## 1. AWS S3 Java SDK 연동

### 1.1 Maven 프로젝트 생성

다음과 같은 디렉터리 구조를 사용하거나 IDE에서 Maven 프로젝트를 생성합니다:

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

### 1.2 의존성 추가

`pom.xml`에 AWS SDK 의존성을 추가합니다:

```xml
<dependencies>
  <dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.25.27</version>
  </dependency>
</dependencies>
```

> AWS SDK v2 사용을 권장합니다. 기능이 더 완전하며 비동기/리액티브 모드를 지원합니다.

---

## 2. RustFS 연결 및 사용

### 2.1 S3 클라이언트 초기화

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
    // 1. S3 클라이언트 초기화
    S3Client s3 = S3Client.builder()
      .endpointOverride(URI.create("http://192.168.1.100:9000")) // RustFS 주소
      .region(Region.US_EAST_1) // 고정값 사용; RustFS는 region을 검증하지 않음
      .credentialsProvider(
        StaticCredentialsProvider.create(
          AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
        )
      )
      .forcePathStyle(true) // 중요: RustFS는 Path-Style 필요
      .build();

    // 2. 버킷 생성
    String bucket = "my-bucket";
    try {
      s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
      System.out.println("Bucket created: " + bucket);
    } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {
      System.out.println("Bucket already exists.");
    }

    // 3. 파일 업로드
    s3.putObject(
      PutObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
      Paths.get("hello.txt")
    );
    System.out.println("Uploaded hello.txt");

    // 4. 파일 다운로드
    s3.getObject(
      GetObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
      Paths.get("downloaded-hello.txt")
    );
    System.out.println("Downloaded hello.txt");

    // 5. 객체 목록 조회
    ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());
    listResponse.contents().forEach(obj -> System.out.println("Found object: " + obj.key()));

    // 6. 객체 삭제
    s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key("hello.txt").build());
    System.out.println("Deleted hello.txt");

    // 7. 버킷 삭제(옵션)
    // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());
  }
}
```

---

## 3. 자주 묻는 질문과 트러블슈팅

| 문제 | 원인 | 해결 방법 |
| --- | --- | --- |
| `S3Exception: 301 Moved Permanently` | path-style 미설정 또는 region 오류 | `.forcePathStyle(true)` 설정 및 임의 region 사용 |
| `ConnectException: Connection refused` | RustFS 미기동 또는 포트 오류 | RustFS 상태 및 포트 확인 |
| `403 Forbidden` | AccessKey / SecretKey 오류 | 인증 설정 확인 |
| 업로드 무응답 | SDK 기본 HTTPS, RustFS는 HTTP(또는 인증서 필요) | `http://` 주소와 `endpointOverride` 사용 |

---

## 4. 부록

### 4.1 Maven 빌드

```bash
mvn clean package
```

실행:

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 RustFS 설정 권장사항

- HTTP 사용 시 SSL 검증 비활성화
- CORS 활성화(웹 프런트 사용 시)
- `max_object_size`, `max_part_size` 등 제한 설정으로 대용량 전송 안정성 확보

---

## 5. 고급 예제

### 5.1 Presigned URL(사전 서명 URL)

> 자격 증명을 노출하지 않고 일정 기간 비공개 객체에 접근할 수 있게 해줍니다. 브라우저 직접 업/다운로드에 유용합니다.

의존성 추가(`s3-presigner` 모듈):

```xml
<dependency>
  <groupId>software.amazon.awssdk</groupId>
  <artifactId>s3-presigner</artifactId>
  <version>2.25.27</version>
</dependency>
```

다운로드 링크(GET) 생성 예:

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
  .signatureDuration(Duration.ofMinutes(15))
  .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
System.out.println("Presigned URL: " + presignedRequest.url());
```

업로드 링크(PUT) 생성 예:

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

### 5.2 Multipart 업로드

초기화:

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
  .bucket("my-bucket")
  .key("bigfile.zip")
  .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

파트 업로드:

```java
List<CompletedPart> completedParts = new ArrayList<>();
for (int i = 1; i <= 3; i++) {
  String partPath = "part" + i + ".bin";
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

완료:

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

중단(옵션):

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
  .bucket("my-bucket")
  .key("bigfile.zip")
  .uploadId(uploadId)
  .build();

s3.abortMultipartUpload(abortRequest);
```

