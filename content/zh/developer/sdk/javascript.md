---
title: "JavaScript SDK 指南"
description: "将官方 AWS SDK for JavaScript v3 与 RustFS 配合使用。"
---

## I. 概述

RustFS 不提供第一方 JavaScript SDK。RustFS 与 S3 兼容，因此你可以配置官方 AWS SDK for JavaScript（v3），使其指向 RustFS 服务器。本指南介绍如何连接 RustFS 并执行常见的对象存储操作。

## II. 前提条件

* Node.js 18 或更高版本
* 一个正在运行的 RustFS 实例（请参阅[安装指南](../../installation/index.md)）；S3 API 监听端口 `9000`，控制台监听端口 `9001`
* 安装时通过 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` 环境变量设置的访问密钥（请参阅[访问密钥管理](../../security-compliance/iam/access-token.md)）

:::tip[本地测试]

如果安装时未设置凭证，服务器默认使用 `rustfsadmin` / `rustfsadmin`。这仅适合一次性本地试用，切勿用于其他人可访问的环境。

:::

### 2.1 安装 SDK

使用 NPM 安装所需的 AWS SDK v3 模块：

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

以下示例使用 ES 模块（`import`）。请在 `package.json` 中设置 `"type": "module"`，或使用 `.mjs` 扩展名保存文件。

---

## III. 初始化客户端

以下是一个可直接运行的完整脚本。如果 RustFS 在另一台计算机上运行，请将 `localhost` 替换为服务器 IP 地址，并填写你自己的访问密钥：

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

运行该脚本：

```bash
node main.mjs
```

```text
[ 'my-bucket' ]
```

以下所有代码片段都复用此 `s3` 客户端。

---

## IV. 基本操作

### 4.1 创建存储桶

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket created");
```

```text
Bucket created
```

---

### 4.2 上传对象

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

### 4.3 下载对象

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

### 4.4 列出对象

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

```text
hello.txt (12 bytes)
```

---

### 4.5 删除对象

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("File deleted");
```

```text
File deleted
```

---

## V. 高级功能

### 5.1 生成预签名 URL

> 允许前端或第三方使用临时链接上传或下载文件

#### 下载（GET）

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

#### 上传（PUT）

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

### 5.2 分段上传

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

## VI. 常见问题和注意事项

| 问题 | 原因 | 解决方案 |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | 签名版本错误 | JS SDK v3 默认使用 v4，请确保 RustFS 支持 v4 |
| EndpointConnectionError | 端点地址配置错误或服务未启动 | 检查 RustFS 地址是否可访问 |
| NoSuchKey | 文件不存在 | 检查 `Key` 拼写是否正确 |
| InvalidAccessKeyId / Secret | 凭证配置错误 | 检查 `accessKeyId` / `secretAccessKey` 配置 |
| 上传失败（路径问题） | 未启用路径风格 | 设置 `forcePathStyle: true` |

---

## VII. 附录：适配前端上传

使用预签名 URL 后，浏览器可以在不传递 AccessKey 的情况下直接上传文件。

前端（HTML+JS）上传示例：

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

有关其他操作（对象标签、存储桶策略等），请参阅 [AWS SDK for JavaScript v3 文档](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)。所有 S3 兼容调用都能以相同方式用于 RustFS。