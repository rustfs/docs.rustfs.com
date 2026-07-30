---
title: "JavaScript SDK Guide"
description: "Use the official AWS SDK for JavaScript v3 with RustFS."
---

## I. Overview

RustFS ships no first-party JavaScript SDK — it is S3-compatible, so you use the official AWS SDK for JavaScript (v3) configured to point at your RustFS server. This guide shows how to connect to RustFS and perform common object storage operations.

## II. Prerequisites

* Node.js 18 or later
* A running RustFS instance (see the [Installation Guide](../../installation/index.md)) — the S3 API listens on port `9000`, the Console on port `9001`
* Access keys, set at install time via the `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` environment variables (see [Access Key Management](../../security-compliance/iam/access-token.md))

:::tip[Local test]

If you did not set credentials at install time, the server defaults to `rustfsadmin` / `rustfsadmin` — fine for a throwaway local trial, never for anything reachable by others.

:::

### 2.1 SDK Installation

Install the required AWS SDK v3 modules with NPM:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

The examples below use ES modules (`import`). Set `"type": "module"` in your `package.json`, or save the files with the `.mjs` extension.

---

## III. Initializing the Client

The following is a complete, runnable script. Replace `localhost` with your server's IP address if RustFS runs on another machine, and fill in your own access keys:

```js title="main.mjs"
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "http://localhost:9000", // RustFS S3 API address
  region: "us-east-1", // RustFS default region
  credentials: {
    accessKeyId: "<your-access-key>",
    secretAccessKey: "<your-secret-key>",
  },
  // RustFS uses path-style URLs by default; virtual-host style requires RUSTFS_SERVER_DOMAINS
  forcePathStyle: true,
});

const { Buckets } = await s3.send(new ListBucketsCommand({}));
console.log(Buckets?.map((b) => b.Name) ?? []);
```

Run it:

```bash
node main.mjs
```

```text
[ 'my-bucket' ]
```

All snippets below reuse this `s3` client.

---

## IV. Basic Operations

### 4.1 Create Bucket

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket created");
```

```text
Bucket created
```

---

### 4.2 Upload Object

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";

const data = readFileSync("/path/to/hello.txt");

await s3.send(
  new PutObjectCommand({
    Bucket: "my-bucket",
    Key: "hello.txt",
    Body: data,
  })
);

console.log("File uploaded");
```

```text
File uploaded
```

---

### 4.3 Download Object

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

console.log("File downloaded");
```

```text
File downloaded
```

---

### 4.4 List Objects

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

```text
hello.txt (12 bytes)
```

---

### 4.5 Delete Object

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("File deleted");
```

```text
File deleted
```

---

## V. Advanced Features

### 5.1 Generate Presigned URLs

> Allows frontend or third parties to use temporary links for uploading/downloading files

#### Download (GET)

```js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const url = await getSignedUrl(
  s3,
  new GetObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }),
  { expiresIn: 600 }
);

console.log("Presigned GET URL:", url);
```

```text
Presigned GET URL: http://localhost:9000/my-bucket/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

#### Upload (PUT)

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const url = await getSignedUrl(
  s3,
  new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
  { expiresIn: 600 }
);

console.log("Presigned PUT URL:", url);
```

---

### 5.2 Multipart Upload

```js
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { statSync, openSync, readSync, closeSync } from "fs";

const bucket = "my-bucket";
const key = "large-file.zip";
const filePath = "./large-file.zip";
const partSize = 5 * 1024 * 1024; // 5 MB

// 1. Create upload task
const createRes = await s3.send(
  new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. Segmented upload
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

// 3. Complete upload
await s3.send(
  new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  })
);

console.log("Multipart upload completed");
```

```text
Multipart upload completed
```

---

## VI. Common Issues and Notes

| Problem | Cause | Solution |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | Wrong signature version | JS SDK v3 uses v4 by default, ensure RustFS supports v4 |
| EndpointConnectionError | Endpoint address misconfigured or not started | Check if RustFS address is accessible |
| NoSuchKey | File does not exist | Check if `Key` is spelled correctly |
| InvalidAccessKeyId / Secret | Credentials misconfigured | Check `accessKeyId` / `secretAccessKey` configuration |
| Upload failure (path issue) | Path-style not enabled | Set `forcePathStyle: true` |

---

## VII. Appendix: Frontend Upload Adaptation

Using presigned URLs allows browsers to upload files directly without passing AccessKey.

Frontend (HTML+JS) upload example:

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

    if (res.ok) alert("Uploaded!");
  });
</script>
```

For other operations (object tagging, bucket policies, and more), see the [AWS SDK for JavaScript v3 documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) — every S3-compatible call works against RustFS the same way.
