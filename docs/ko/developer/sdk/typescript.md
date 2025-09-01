---
title: "TypeScript SDK"
description: "이 문서는 주로 RustFS에서 TypeScript SDK 사용법에 대해 설명합니다."
---

# TypeScript RustFS SDK

RustFS는 완전히 S3 호환되는 객체 저장 시스템이므로, S3 TypeScript SDK를 래핑하여 RustFS에 적합한 TypeScript SDK를 구축할 수 있습니다. 이 SDK를 통해 버킷/객체 생성 및 삭제뿐만 아니라 파일 업로드 및 다운로드를 포함한 RustFS 작업을 수행할 수 있습니다.

## 전제 조건

- 사용 가능한 RustFS 인스턴스 ([설치 가이드](../../installation/index.md) 참조).
- 접근 키 ([접근 키 관리](../../administration/iam/access-token.md) 참조).

## RustFS TypeScript SDK 구성

TypeScript의 S3Client를 사용하여 `region`, `access_key_id`, `secret_access_key`, `endpoint_url`로 RustFS 클라이언트를 구성합니다:

```typescript
import { S3Client, CreateBucketCommand, DeleteBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";

const rustfs_client = new S3Client({
    region: "cn-east-1",
    credentials: {
        accessKeyId: process.env.RUSTFS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.RUSTFS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.RUSTFS_ENDPOINT_URL!,
    forcePathStyle: true,
});
```

그런 다음 구성된 `rustfs_client`를 사용하여 해당 작업을 수행합니다.

## 버킷 생성

```typescript
async function createBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new CreateBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("버킷이 성공적으로 생성되었습니다:", response);
    } catch (error) {
        console.error("버킷 생성 중 오류 발생:", error);
    }
}
```

## 버킷 삭제

```typescript
async function deleteBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new DeleteBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("버킷이 성공적으로 삭제되었습니다:", response);
    } catch (error) {
        console.error("버킷 삭제 중 오류 발생:", error);
    }
}
```

## 버킷 목록 조회

```typescript
async function listBuckets(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListBucketsCommand({}));
        console.log("사용 가능한 버킷:");
        response.Buckets?.forEach(bucket => {
            console.log(`- ${bucket.Name} (생성일: ${bucket.CreationDate})`);
        });
    } catch (error) {
        console.error("버킷 목록 조회 중 오류 발생:", error);
    }
}
```

## 객체 목록 조회

```typescript
async function listObjects(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListObjectsV2Command({
            Bucket: "my-bucket",
        }));
        console.log("버킷의 객체:");
        response.Contents?.forEach(obj => {
            console.log(`- ${obj.Key} (${obj.Size} bytes, ${obj.LastModified})`);
        });
    } catch (error) {
        console.error("객체 목록 조회 중 오류 발생:", error);
    }
}
```

## 파일 업로드

```typescript
async function uploadFile(): Promise<void> {
    try {
        const fileStream = fs.createReadStream("/path/to/local/file.txt");
        const response = await rustfs_client.send(new PutObjectCommand({
            Bucket: "my-bucket",
            Key: "uploaded-file.txt",
            Body: fileStream,
            ContentType: "text/plain",
        }));
        console.log("파일이 성공적으로 업로드되었습니다:", response.ETag);
    } catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
    }
}
```

## 객체 다운로드

```typescript
async function getObject(): Promise<void> {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "my-bucket",
            Key: "uploaded-file.txt",
        }));
        
        // 객체 내용 가져오기
        if (response.Body) {
            const chunks: Buffer[] = [];
            const stream = response.Body as NodeJS.ReadableStream;
            
            for await (const chunk of stream) {
                chunks.push(chunk as Buffer);
            }
            
            const data = Buffer.concat(chunks).toString("utf-8");
            console.log("객체 내용:", data);
        }
    } catch (error) {
        console.error("객체 다운로드 중 오류 발생:", error);
    }
}
```

## 추가 사용법

다른 용도는 직접 탐색해 보실 수 있습니다. TypeScript를 사용하면 모든 RustFS 작업에 대해 완전한 타입 안전성과 IntelliSense 지원을 받을 수 있습니다. SDK는 다음과 같은 고급 기능도 지원합니다:

- 임시 접근을 위한 Presigned URL
- 대용량 파일을 위한 멀티파트 업로드
- 버킷 정책 및 ACL 관리
- 객체 메타데이터 및 태그

이러한 모든 기능은 표준 AWS SDK v3 TypeScript 인터페이스를 통해 사용할 수 있습니다.