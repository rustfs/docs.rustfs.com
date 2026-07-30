---
title: "RustFS TypeScript SDK Usage Guide"
description: "Operate RustFS from TypeScript with the AWS SDK for JavaScript v3, including creation and deletion of buckets and objects."
---

RustFS ships no first-party TypeScript SDK — it is fully S3-compatible, so you use the official AWS SDK for JavaScript v3 (which ships its own TypeScript type definitions) configured to point at your RustFS server. Through the SDK, you can operate RustFS, including creation and deletion of buckets/objects, file upload and download, etc.

## Prerequisites

- Node.js 18 or later (the examples use ES modules — set `"type": "module"` in your `package.json`)
- An available RustFS instance (refer to [Installation Guide](../../installation/index.md) for installation) — the S3 API listens on port `9000`, the Console on port `9001`
- Access keys, set at install time via the `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` environment variables (refer to [Access Key Management](../../security-compliance/iam/access-token.md) for creation)

:::tip[Local test]

If you did not set credentials at install time, the server defaults to `rustfsadmin` / `rustfsadmin` — fine for a throwaway local trial, never for anything reachable by others.

:::

Install the dependencies:

```bash
npm install @aws-sdk/client-s3
npm install --save-dev typescript tsx @types/node
```

## Initializing the Client

The following is a complete, runnable example. Replace `localhost` with your server's IP address if RustFS runs on another machine, and fill in your own access keys:

```typescript title="main.ts"
import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import * as fs from "fs";

const rustfs_client = new S3Client({
  region: "us-east-1", // RustFS default region
  endpoint: "http://localhost:9000", // RustFS S3 API address
  credentials: {
    accessKeyId: "<your-access-key>",
    secretAccessKey: "<your-secret-key>",
  },
  // RustFS uses path-style URLs by default; virtual-host style requires RUSTFS_SERVER_DOMAINS
  forcePathStyle: true,
});

const response = await rustfs_client.send(new ListBucketsCommand({}));
console.log(response.Buckets?.map((bucket) => bucket.Name) ?? []);
```

Run it:

```bash
npx tsx main.ts
```

```text
[ 'my-bucket' ]
```

Then use the constructed `rustfs_client` for the operations below.

## Create Bucket

```typescript
async function createBucket() {
  try {
    const response = await rustfs_client.send(
      new CreateBucketCommand({
        Bucket: "my-bucket",
      })
    );
    console.log("Bucket created:", response.Location);
  } catch (error) {
    console.log(error);
  }
}
```

```text
Bucket created: /my-bucket
```

## Delete Bucket

```typescript
async function deleteBucket() {
  try {
    await rustfs_client.send(
      new DeleteBucketCommand({
        Bucket: "my-bucket",
      })
    );
    console.log("Bucket deleted");
  } catch (error) {
    console.log(error);
  }
}
```

```text
Bucket deleted
```

## List Buckets

```typescript
async function listBuckets() {
  try {
    const response = await rustfs_client.send(new ListBucketsCommand({}));
    response.Buckets?.forEach((bucket) => console.log(bucket.Name));
  } catch (error) {
    console.log(error);
  }
}
```

```text
my-bucket
```

## List Objects

```typescript
async function listObjects() {
  try {
    const response = await rustfs_client.send(
      new ListObjectsV2Command({
        Bucket: "my-bucket",
      })
    );
    response.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
  } catch (error) {
    console.log(error);
  }
}
```

```text
test/hello.txt (12 bytes)
```

## Upload File

```typescript
async function uploadFile() {
  try {
    await rustfs_client.send(
      new PutObjectCommand({
        Bucket: "my-bucket",
        Key: "test/hello.txt",
        Body: fs.createReadStream("/path/to/hello.txt"),
      })
    );
    console.log("Object uploaded");
  } catch (error) {
    console.log(error);
  }
}
```

```text
Object uploaded
```

## Download Object

```typescript
async function getObject() {
  try {
    const response = await rustfs_client.send(
      new GetObjectCommand({
        Bucket: "my-bucket",
        Key: "test/hello.txt",
      })
    );

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

```text
Object content: hello rustfs
```

For other operations (presigned URLs, multipart uploads, and more), see the [AWS SDK for JavaScript v3 documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) — every S3-compatible call works against RustFS the same way.
