---
title: "RustFS TypeScript SDK 使用指南"
description: "通过 AWS SDK for JavaScript v3 从 TypeScript 操作 RustFS，包括创建和删除存储桶与对象。"
---

RustFS 不提供第一方 TypeScript SDK。RustFS 与 S3 兼容，因此你可以配置自带 TypeScript 类型定义的官方 AWS SDK for JavaScript v3，使其指向 RustFS 服务器。通过该 SDK，你可以操作 RustFS，包括创建和删除存储桶或对象、上传和下载文件等。

## 前提条件

- Node.js 18 或更高版本（示例使用 ES 模块，请将 `"type": "module"` 写入 `package.json`）
- 一个可用的 RustFS 实例（安装方法请参阅[安装指南](../../installation/index.md)）；S3 API 监听端口 `9000`，控制台监听端口 `9001`
- 安装时通过 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` 环境变量设置的访问密钥（创建方法请参阅[访问密钥管理](../../security-compliance/iam/access-token.md)）

:::tip[本地测试]

如果安装时未设置凭证，服务器默认使用 `rustfsadmin` / `rustfsadmin`。这仅适合一次性本地试用，切勿用于其他人可访问的环境。

:::

安装依赖项：

```bash
npm install @aws-sdk/client-s3
npm install --save-dev typescript tsx @types/node
```

## 初始化客户端

以下是一个可直接运行的完整示例。如果 RustFS 在另一台计算机上运行，请将 `localhost` 替换为服务器 IP 地址，并填写你自己的访问密钥：

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

运行该示例：

```bash
npx tsx main.ts
```

```text
[ 'my-bucket' ]
```

然后使用已构造的 `rustfs_client` 执行以下操作。

## 创建存储桶

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

## 删除存储桶

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

## 列出存储桶

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

## 列出对象

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

## 上传文件

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

## 下载对象

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

有关其他操作（预签名 URL、分段上传等），请参阅 [AWS SDK for JavaScript v3 文档](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)。所有 S3 兼容调用都能以相同方式用于 RustFS。