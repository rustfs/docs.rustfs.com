---
title: "TypeScript SDK"
description: "This document mainly explains the use of TypeScript SDK in RustFS."
---

# TypeScript Rust SDK

Since RustFS is a fully S3-compatible object storage system, it's possible to build a TypeScript SDK suitable for RustFS by wrapping the S3 TypeScript SDK. Through the SDK, RustFS operations can be performed, including bucket/object creation and deletion, as well as file upload and download.

## Prerequisites

- An available RustFS instance (refer to the [Installation Guide](../../installation/index.md) for installation).
- Access keys (refer to [Access Key Management](../../administration/iam/access-token.md) for creation).

## RustFS TypeScript SDK Construction

With the help of TypeScript's S3Client, use `region`, `access_key_id`, `secret_access_key`, and `endpoint_url` to construct a RustFS client:

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

Then use the constructed `rustfs_client` to perform corresponding operations.

## Create Bucket

```typescript
async function createBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new CreateBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket created successfully:", response);
    } catch (error) {
        console.error("Error creating bucket:", error);
    }
}
```

## Delete Bucket

```typescript
async function deleteBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new DeleteBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket deleted successfully:", response);
    } catch (error) {
        console.error("Error deleting bucket:", error);
    }
}
```

## List Buckets

```typescript
async function listBuckets(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListBucketsCommand({}));
        console.log("Available buckets:");
        response.Buckets?.forEach(bucket => {
            console.log(`- ${bucket.Name} (created: ${bucket.CreationDate})`);
        });
    } catch (error) {
        console.error("Error listing buckets:", error);
    }
}
```

## List Objects

```typescript
async function listObjects(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListObjectsV2Command({
            Bucket: "my-bucket",
        }));
        console.log("Objects in bucket:");
        response.Contents?.forEach(obj => {
            console.log(`- ${obj.Key} (${obj.Size} bytes, ${obj.LastModified})`);
        });
    } catch (error) {
        console.error("Error listing objects:", error);
    }
}
```

## Upload File

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
        console.log("File uploaded successfully:", response.ETag);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}
```

## Download Object

```typescript
async function getObject(): Promise<void> {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "my-bucket",
            Key: "uploaded-file.txt",
        }));
        
        // Get object content
        if (response.Body) {
            const chunks: Buffer[] = [];
            const stream = response.Body as NodeJS.ReadableStream;
            
            for await (const chunk of stream) {
                chunks.push(chunk as Buffer);
            }
            
            const data = Buffer.concat(chunks).toString("utf-8");
            console.log("Object content:", data);
        }
    } catch (error) {
        console.error("Error downloading object:", error);
    }
}
```

## Additional Usage

For other uses, you can explore on your own. With TypeScript, you get complete type safety and IntelliSense support for all RustFS operations. The SDK also supports advanced features such as:

- Presigned URLs for temporary access
- Multipart uploads for large files
- Bucket policies and ACL management
- Object metadata and tags

All these features can be used through the standard AWS SDK v3 TypeScript interfaces.

