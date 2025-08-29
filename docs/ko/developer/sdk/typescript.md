---
title: "RustFS TypeScript SDK 사용 가이드"
description: "TypeScript SDK를 통해 RustFS 인스턴스를 조작하며, 스토리지 버킷과 객체의 생성 및 삭제를 포함합니다."
---

# TypeScript Rust SDK

RustFS는 완전히 S3 호환 객체 스토리지 시스템이므로, S3용 TypeScript SDK를 일부 래핑하여 RustFS에 적합한 TypeScript SDK를 구축할 수 있습니다.

## 전제 조건

- 사용 가능한 RustFS 인스턴스([설치 가이드](../../installation/index.md) 참조)
- 액세스 키([액세스 키 관리](../../administration/iam/access-token.md) 참조)

## RustFS TypeScript SDK 구성

TypeScript의 S3Client를 사용하여 RustFS 클라이언트 구성:

```typescript
const rustfs_client = new S3Client({
 region: "cn-east-1",
 credentials: {
 accessKeyId: process.env.RUSTFS_ACCESS_KEY_ID!,
 secretAccessKey: process.env.RUSTFS_SECRET_ACCESS_KEY!,
 },
 endpoint: process.env.RUSTFS_ENDPOINT_URL!,
});
```

## 기본 작업

### 스토리지 버킷 생성
```typescript
async function createBucket() {
 const response = await rustfs_client.send(new CreateBucketCommand({
 Bucket: "my-bucket",
 }));
 console.log(response);
}
```

### 파일 업로드
```typescript
async function uploadFile() {
 const response = await rustfs_client.send(new PutObjectCommand({
 Bucket: "my-bucket",
 Key: "/test/1.txt",
 Body: fs.createReadStream("/Users/jhma/Desktop/1.txt"),
 }));
}
```

### 객체 다운로드
```typescript
async function getObject() {
 const response = await rustfs_client.send(new GetObjectCommand({
 Bucket: "rust-sdk-demo",
 Key: "1.txt",
 }));
 
 if (response.Body) {
 const chunks: Buffer[] = [];
 for await (const chunk of response.Body as any) {
 chunks.push(chunk as Buffer);
 }
 const data = Buffer.concat(chunks).toString("utf-8");
 console.log("Object content:", data);
 }
}
```

기타 사용법은 자유롭게 탐색해 보세요!