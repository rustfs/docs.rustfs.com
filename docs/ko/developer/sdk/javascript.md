---
title: "RustFS JavaScript SDK"
description: "본 문서는 주로 RustFS에서 JavaScript SDK 사용법을 설명합니다."
---

# RustFS JavaScript SDK (Node.js용)

## 개요

RustFS는 S3 프로토콜과 호환되는 객체 스토리지 시스템으로, AWS 공식 JavaScript SDK(v3)를 통해 액세스할 수 있습니다.

## 준비 작업

### SDK 설치

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## S3 클라이언트 초기화

```js
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000",
 region: "us-east-1",
 credentials: {
 accessKeyId: "rustfsadmin",
 secretAccessKey: "rustfssecret",
 },
 forcePathStyle: true, // RustFS 호환을 위해 Path-style 활성화 필수
});
```

## 기본 작업

### 버킷 생성
```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";
await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
```

### 파일 업로드
```js
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";

const data = readFileSync("hello.txt");
await s3.send(new PutObjectCommand({
 Bucket: "my-bucket",
 Key: "hello.txt",
 Body: data,
}));
```

더 자세한 사용법은 원본 문서를 참조하세요.