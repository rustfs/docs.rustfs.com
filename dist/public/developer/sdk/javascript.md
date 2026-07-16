# JavaScript SDK Guide (/developer/sdk/javascript)



## I. Overview [#i-overview]

RustFS is S3-compatible and works with the official AWS SDK for JavaScript (v3). This guide will show you how to use JS to connect to RustFS and perform common object storage operations.

## II. Prerequisites [#ii-prerequisites]

### 2.1 SDK Installation [#21-sdk-installation]

Install the required AWS SDK v3 modules with NPM:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 Example Configuration [#22-example-configuration]

Assume the RustFS instance is deployed as follows:

```
Endpoint: http://192.168.1.100:9000
Access Key: <your-access-key>
Secret Key: <your-secret-key>
```

***

## III. Initializing the Client [#iii-initializing-the-client]

```js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000", // RustFS endpoint
 region: "us-east-1", // Any value is accepted
 credentials: {
 // Use a unique access key and a strong secret (e.g. openssl rand -base64 24)
 accessKeyId: "<your-access-key>",
 secretAccessKey: "<your-secret-key>",
 },
 forcePathStyle: true, // Must be enabled for RustFS compatibility
 requestHandler: new NodeHttpHandler({
 connectionTimeout: 3000,
 socketTimeout: 5000,
 }),
});
```

***

## IV. Basic Operations [#iv-basic-operations]

### 4.1 Create Bucket [#41-create-bucket]

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket created");
```

***

### 4.2 Upload Object [#42-upload-object]

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

console.log("File uploaded");
```

***

### 4.3 Download Object [#43-download-object]

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

***

### 4.4 List Objects [#44-list-objects]

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

***

### 4.5 Delete Object [#45-delete-object]

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("File deleted");
```

***

## V. Advanced Features [#v-advanced-features]

### 5.1 Generate Presigned URLs [#51-generate-presigned-urls]

> Allows frontend or third parties to use temporary links for uploading/downloading files

#### Download (GET) [#download-get]

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

#### Upload (PUT) [#upload-put]

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(
 s3,
 new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
 { expiresIn: 600 }
);

console.log("Presigned PUT URL:", url);
```

***

### 5.2 Multipart Upload [#52-multipart-upload]

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

// 1. Create upload task
const createRes = await s3.send(
 new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. Segmented upload
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

***

## VI. Common Issues and Notes [#vi-common-issues-and-notes]

| Problem                     | Cause                                         | Solution                                                |
| --------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| SignatureDoesNotMatch       | Wrong signature version                       | JS SDK v3 uses v4 by default, ensure RustFS supports v4 |
| EndpointConnectionError     | Endpoint address misconfigured or not started | Check if RustFS address is accessible                   |
| NoSuchKey                   | File does not exist                           | Check if `Key` is spelled correctly                     |
| InvalidAccessKeyId / Secret | Credentials misconfigured                     | Check `accessKeyId` / `secretAccessKey` configuration   |
| Upload failure (path issue) | Path-style not enabled                        | Set `forcePathStyle: true`                              |

***

## VII. Appendix: Frontend Upload Adaptation [#vii-appendix-frontend-upload-adaptation]

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
