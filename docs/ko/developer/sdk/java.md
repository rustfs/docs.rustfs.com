---
title: "Java SDK"
description: "본 문서는 주로 RustFS에서 Java SDK 사용법을 설명합니다."
---

# Java SDK

RustFS는 S3 프로토콜과 호환되는 객체 스토리지 시스템으로, AWS S3 SDK를 통해 시스템과 통합을 지원합니다. 본 문서는 AWS S3 Java SDK를 예시로, 개발 환경을 처음부터 구축하고, RustFS에 연결하여 기본적인 객체 스토리지 작업을 완료하는 방법을 소개합니다.

## 1. AWS S3 Java SDK 통합

### 1.1 Maven 프로젝트 생성

다음 디렉토리 구조를 사용하거나 IDE에서 Maven 프로젝트를 새로 생성합니다:

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

> AWS SDK v2 버전 사용을 권장합니다. 기능이 더 완벽하고 비동기, 리액티브 모드 등을 지원합니다.

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
 .region(Region.US_EAST_1) // 하드코딩 가능, RustFS는 region 검증하지 않음
 .credentialsProvider(
 StaticCredentialsProvider.create(
 AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
 )
 )
 .forcePathStyle(true) // 중요 설정! RustFS는 Path-Style 활성화 필요
 .build();

 // 기본 작업 예제...
 }
}
```

이 문서는 Java SDK의 기본 사용법을 다룹니다. 더 자세한 정보는 원본 문서를 참조하시기 바랍니다.