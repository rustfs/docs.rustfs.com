---
title: "RustFS JavaScript SDK"
description: "本文主要讲解 RustFS 中 JavaScript SDK 的使用。"
---

下面是为 **RustFS 使用 AWS S3 JS SDK** 编写的完整开发文档，内容涵盖 SDK 安装、初始化配置、基础操作（上传、下载、删除、列举）、预签名 URL 和分片上传等功能，适用于 Node.js 环境。

# RustFS 使用 AWS S3 JS SDK 文档（适用于 Node.js）

## 一、概述

RustFS 是一款兼容 S3 协议的对象存储系统，可通过 AWS 官方 JavaScript SDK（v3）进行访问。本指南将指导你如何使用 JS 连接 RustFS 并执行常见对象存储操作。

## 二、准备工作

### 2.1 安装 SDK

使用 NPM 安装 AWS SDK v3 所需模块：

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 RustFS 示例配置

假设 RustFS 实例部署如下：

```
Endpoint: http://192.168.1.100:9000
Access Key: rustfsadmin
Secret Key: rustfssecret
```

---

## 三、初始化 S3 客户端

```js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000", // RustFS endpoint
 region: "us-east-1", // 可随意填写
 credentials: {
 accessKeyId: "rustfsadmin",
 secretAccessKey: "rustfssecret",
 },
 forcePathStyle: true, // 必须启用 Path-style 以兼容 RustFS
 requestHandler: new NodeHttpHandler({
 connectionTimeout: 3000,
 socketTimeout: 5000,
 }),
});
```

---

## 四、基本操作

### 4.1 创建 Bucket

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket created");
```

---

### 4.2 上传对象

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

---

### 4.4 列举对象

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

---

### 4.5 删除对象

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("File deleted");
```

---

## 五、高级功能

### 5.1 生成预签名 URL

> 允许前端或第三方用户使用临时链接上传/下载文件

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

#### 上传（PUT）

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(
 s3,
 new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
 { expiresIn: 600 }
);

console.log("Presigned PUT URL:", url);
```

---

### 5.2 分片上传（Multipart Upload）

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

// 1. 创建上传任务
const createRes = await s3.send(
 new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. 分段上传
import { statSync, openSync, readSync } from "fs";

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

// 3. 完成上传
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

---

## 六、常见问题与注意事项

| 问题 | 原因 | 解决方法 |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | 签名版本错误 | JS SDK v3 默认使用 v4，确保 RustFS 支持 v4 |
| EndpointConnectionError | Endpoint 地址配置不正确或未启动 | 检查 RustFS 地址是否可访问 |
| NoSuchKey | 文件不存在 | 检查 `Key` 是否拼写正确 |
| InvalidAccessKeyId / Secret | 凭证配置错误 | 检查 `accessKeyId` / `secretAccessKey` 配置 |
| 上传失败（路径问题） | 未启用 Path-style | 设置 `forcePathStyle: true` |

---

## 七、附录：适配前端上传

使用预签名 URL 可允许浏览器直接上传文件，无需传递 AccessKey。

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

