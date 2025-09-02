---
title: "Java SDK"
description: "이 문서는 RustFS에서 Java SDK 사용에 대해 설명합니다."
---

# Java SDK

RustFS는 S3 프로토콜과 호환되는 객체 저장소 시스템으로, AWS S3 SDK를 통해 시스템과 통합할 수 있습니다. 이 문서는 AWS S3 Java SDK를 예시로 하여 개발 환경을 처음부터 구축하고, RustFS에 연결하며, 기본적인 객체 저장소 작업을 완료하는 방법을 소개합니다.

## 1. AWS S3 Java SDK 통합

### 1.1 Maven 프로젝트 생성

다음과 같은 디렉토리 구조를 사용하거나 IDE에서 새 Maven 프로젝트를 생성하세요:

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

### 1.2 종속성 추가

`pom.xml`에 AWS SDK 종속성을 추가하세요:

```xml
<dependencies>
 <dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3</artifactId>
 <version>2.25.27</version>
 </dependency>
</dependencies>
```

> AWS SDK v2 버전 사용을 권장하며, 기능이 더 완성도가 높고 비동기, 반응형 등의 모드를 지원합니다.

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
 .region(Region.US_EAST_1) // 하드코딩 가능, RustFS는 region을 검증하지 않음
 .credentialsProvider(
 StaticCredentialsProvider.create(
 AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
 )
 )
 .forcePathStyle(true) // 핵심 구성! RustFS는 Path-Style 활성화 필요
 .build();

 // 2. Bucket 생성
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

 // 5. 객체 나열
 ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());
 listResponse.contents().forEach(obj -> System.out.println("Found object: " + obj.key()));

 // 6. 객체 삭제
 s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key("hello.txt").build());
 System.out.println("Deleted hello.txt");

 // 7. 버킷 삭제(선택사항)
 // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());
 }
}
```

---

## 3. 일반적인 문제 및 해결

| 문제 | 원인 | 해결 방법 |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `S3Exception: 301 Moved Permanently` | path-style이 활성화되지 않았거나 region 오류 | `.forcePathStyle(true)` 설정하고 region은 임의 값 사용 |
| `ConnectException: Connection refused` | RustFS가 시작되지 않았거나 포트가 올바르지 않음 | RustFS 상태와 포트 확인 |
| `403 Forbidden` | AccessKey / SecretKey 오류 | 인증 구성 확인 |
| 업로드 실패 응답 없음 | SDK가 기본적으로 HTTPS 사용, RustFS는 HTTP만 지원(또는 인증서 필요) | `http://` 주소 사용하고 `endpointOverride` 구성 |

---

## 4. 부록

### 4.1 Maven 매니페스트 패키징

프로젝트 패키징:

```bash
mvn clean package
```

실행:

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 RustFS 구성 권장사항

* 서비스가 HTTP 프로토콜을 사용할 때 SSL 검증을 비활성화하세요.
* CORS 지원 활성화(Web 프론트엔드용인 경우).
* `max_object_size`와 `max_part_size` 등의 제한 설정을 권장하여 대용량 파일 전송 실패를 방지하세요.

---

좋습니다. 다음은 **RustFS에서 AWS S3 Java SDK 사용의 고급 기능 예시 보완**으로, 다음을 포함합니다:

* 사전 서명된 URL(Presigned URL) 생성 및 사용
* 분할 업로드(Multipart Upload) 완전한 프로세스

---

## 5. Java 고급 기능 예시

### 5.1 Presigned URL(사전 서명된 URL) 생성 및 사용

> Presigned URL은 클라이언트가 자격 증명을 노출하지 않고도 임시로 개인 객체에 액세스할 수 있게 하며, 브라우저에서 직접 파일을 업로드하거나 다운로드하는 시나리오에서 널리 사용됩니다.

#### 5.1.1 종속성 추가(v2 SDK의 URL 서명은 `s3-presigner` 모듈에 위치)

```xml
<dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3-presigner</artifactId>
 <version>2.25.27</version>
</dependency>
```

#### 5.1.2 다운로드 링크(GET) 생성

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
 .signatureDuration(Duration.ofMinutes(15)) // 유효 기간 15분
 .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);

System.out.println("Presigned URL: " + presignedRequest.url());
```

> 🔗 브라우저에서 링크를 열면 해당 객체에 액세스할 수 있습니다.

#### 5.1.3 업로드 Presigned URL(PUT)

유사하게 업로드 URL도 생성할 수 있습니다:

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

### 5.2 분할 업로드(Multipart Upload) 구현

> Multipart Upload는 대용량 파일 업로드의 권장 방식으로, 네트워크 변동 시 중단점 재개가 가능합니다.

#### 5.2.1 분할 업로드 시작

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

#### 5.2.2 각 분할(Part) 업로드

```java
List<CompletedPart> completedParts = new ArrayList<>();
for (int i = 1; i <= 3; i++) {
 String partPath = "part" + i + ".bin"; // 각 part가 로컬 파일이라고 가정
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

#### 5.2.3 분할 업로드 완료

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

#### 5.2.4 예외 시 업로드 중단(선택사항)

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .uploadId(uploadId)
 .build();

s3.abortMultipartUpload(abortRequest);
```

---
