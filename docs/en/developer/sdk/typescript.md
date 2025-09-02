---
title: "RustFS TypeScript SDK Usage Guide"
description: "Operating RustFS instances through TypeScript SDK, including creation and deletion of buckets and objects."
---

# TypeScript Rust SDK

Since RustFS is a fully S3-compatible object storage system, you can build a TypeScript SDK suitable for RustFS by wrapping the S3 TypeScript SDK. Through the SDK, you can operate RustFS, including creation and deletion of buckets/objects, file upload and download, etc.

## Prerequisites

- An available RustFS instance (refer to [Installation Guide](../../installation/index.md) for installation).
- Access keys (refer to [Access Key Management](../../administration/iam/access-token.md) for creation).

## RustFS TypeScript SDK Construction

Using TypeScript's S3Client, construct a RustFS client with `region`, `access_key_id`, `secret_access_key`, and `endpoint_url`:

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

Then use the constructed `rustfs_client` for corresponding operations.

## Create Bucket

```typescript
async function createBucket() {
    try {
        const response = await rustfs_client.send(new CreateBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```

## Delete Bucket

```typescript
async function deleteBucket() {
    try {
        const response = await rustfs_client.send(new DeleteBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```

## List Buckets

```typescript
async function listBuckets() {
    try {
        const response = await rustfs_client.send(new ListBucketsCommand({}));
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```

## List Objects

```typescript
async function listObjects() {
    try {
        const response = await rustfs_client.send(new ListObjectsV2Command({
            Bucket: "rust-sdk-demo",
        }));
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```

## Upload File

```typescript
async function uploadFile() {
    try {
        const response = await rustfs_client.send(new PutObjectCommand({
            Bucket: "my-bucket",
            Key: "/test/1.txt",
            Body: fs.createReadStream("/Users/jhma/Desktop/1.txt"),
        }));
    } catch (error) {
        console.log(error);
    }
}
```

## Download Object

```typescript
async function getObject() {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "rust-sdk-demo",
            Key: "1.txt",
        }));

        // get object content
        if (response.Body) {
            const chunks: Buffer[] = [];
            for await (const chunk of response.Body as any) {
                chunks.push(chunk as Buffer);
            }
            const data = Buffer.concat(chunks).toString("utf-8");
            console.log("Object content:", data);
        }
    } catch (error) {
        console.log(error);
    }
}
```

For other usage, you can explore on your own. If you use Vibe Coding, it becomes even simpler!
