---
title: "JavaScript SDK"
description: "이 문서는 주로 RustFS에서 JavaScript SDK 사용에 대해 설명합니다."
---

다음은 **RustFS에서 AWS S3 JS SDK 사용을 위한 완전한 개발 문서**로, SDK 설치, 초기화 구성, 기본 작업(업로드, 다운로드, 삭제, 목록), 사전 서명된 URL 및 멀티파트 업로드 등을 포함하며, Node.js 환경에 적용됩니다.

# RustFS AWS S3 JS SDK 문서 (Node.js용)

## I. 개요

RustFS는 S3 프로토콜 호환 객체 스토리지 시스템으로, AWS 공식 JavaScript SDK(v3)를 통해 액세스할 수 있습니다. 이 가이드는 JS를 사용하여 RustFS에 연결하고 일반적인 객체 스토리지 작업을 수행하는 방법을 보여줍니다.

## II. 준비

### 2.1 SDK 설치

NPM으로 필요한 AWS SDK v3 모듈을 설치하세요:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 RustFS 예제 구성

RustFS 인스턴스가 다음과 같이 배포되었다고 가정합니다:

```
Endpoint: http://192.168.1.100:9000
Access Key: rustfsadmin
Secret Key: rustfssecret
```

---

## III. S3 클라이언트 초기화

```js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000", // RustFS endpoint
 region: "us-east-1", // 임의로 입력 가능
 credentials: {
 accessKeyId: "rustfsadmin",
 secretAccessKey: "rustfssecret",
 },
 forcePathStyle: true, // RustFS 호환성을 위해 활성화 필수
 requestHandler: new NodeHttpHandler({
 connectionTimeout: 3000,
 socketTimeout: 5000,
 }),
});
```

---

## IV. 기본 작업

### 4.1 버킷 생성

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("버킷 생성됨");
```

---

### 4.2 객체 업로드

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";

const data = readFileSync("hello.txt");

await s3.send(
 new PutObjectCommand({
 Bucket: "my-bucket",
 Key: "hello.txt",
 Body: data,
 })
);

console.log("파일 업로드됨");
```

---

### 4.3 객체 다운로드

```js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { writeFile } from "fs/promises";

const response = await s3.send(
 new GetObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" })
);

const streamToBuffer = async (stream) => {
 const chunks = [];
 for await (const chunk of stream) chunks.push(chunk);
 return Buffer.concat(chunks);
};

const buffer = await streamToBuffer(response.Body);
await writeFile("downloaded.txt", buffer);

console.log("파일 다운로드됨");
```

---

### 4.4 객체 목록

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

---

### 4.5 객체 삭제

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("파일 삭제됨");
```

---

## V. 고급 기능

### 5.1 사전 서명된 URL 생성

> 프론트엔드나 제3자가 임시 링크를 사용하여 파일을 업로드/다운로드할 수 있도록 허용

#### 다운로드 (GET)

```js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const url = await getSignedUrl(
 s3,
 new GetObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }),
 { expiresIn: 600 }
);

console.log("사전 서명된 GET URL:", url);
```

#### 업로드 (PUT)

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(
 s3,
 new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
 { expiresIn: 600 }
);

console.log("사전 서명된 PUT URL:", url);
```

---

### 5.2 멀티파트 업로드

```js
import {
 CreateMultipartUploadCommand,
 UploadPartCommand,
 CompleteMultipartUploadCommand,
 AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { createReadStream } from "fs";

const bucket = "my-bucket";
const key = "large-file.zip";
const filePath = "./large-file.zip";
const partSize = 5 * 1024 * 1024; // 5 MB

// 1. 업로드 작업 생성
const createRes = await s3.send(
 new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. 세그먼트 업로드
import { statSync, openSync, readSync, closeSync } from "fs";

const fileSize = statSync(filePath).size;
const fd = openSync(filePath, "r");
const parts = [];

for (let partNumber = 1, offset = 0; offset < fileSize; partNumber++) {
 const buffer = Buffer.alloc(Math.min(partSize, fileSize - offset));
 readSync(fd, buffer, 0, buffer.length, offset);

 const uploadPartRes = await s3.send(
 new UploadPartCommand({
 Bucket: bucket,
 Key: key,
 UploadId: uploadId,
 PartNumber: partNumber,
 Body: buffer,
 })
 );

 parts.push({ ETag: uploadPartRes.ETag, PartNumber: partNumber });
 offset += partSize;
}

closeSync(fd);

// 3. 업로드 완료
await s3.send(
 new CompleteMultipartUploadCommand({
 Bucket: bucket,
 Key: key,
 UploadId: uploadId,
 MultipartUpload: { Parts: parts },
 })
);

console.log("멀티파트 업로드 완료");
```

---

## VI. 일반적인 문제 및 주의사항

| 문제 | 원인 | 해결책 |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | 잘못된 서명 버전 | JS SDK v3는 기본적으로 v4 사용, RustFS가 v4를 지원하는지 확인 |
| EndpointConnectionError | 엔드포인트 주소 잘못 설정 또는 미시작 | RustFS 주소에 액세스할 수 있는지 확인 |
| NoSuchKey | 파일이 존재하지 않음 | `Key`가 올바르게 작성되었는지 확인 |
| InvalidAccessKeyId / Secret | 자격 증명 잘못 설정 | `accessKeyId` / `secretAccessKey` 설정 확인 |
| 업로드 실패 (경로 문제) | Path-style 미활성화 | `forcePathStyle: true` 설정 |

---

## VII. 부록: 프론트엔드 업로드 적응

사전 서명된 URL을 사용하면 브라우저가 AccessKey를 전달하지 않고도 파일을 직접 업로드할 수 있습니다.

프론트엔드 (HTML+JS) 업로드 예제:

```html
<input type="file" id="fileInput" />
<script>
 document.getElementById("fileInput").addEventListener("change", async (e) => {
 const file = e.target.files[0];
 const url = await fetch("/api/presigned-put-url?key=" + file.name).then((r) =>
 r.text()
 );

 const res = await fetch(url, {
 method: "PUT",
 body: file,
 });

 if (res.ok) alert("업로드됨!");
 });
</script>
```
