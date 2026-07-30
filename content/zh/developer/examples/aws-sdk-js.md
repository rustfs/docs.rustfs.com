---
title: "AWS SDK for JavaScript"
description: "将 AWS SDK for JavaScript v3 连接到 RustFS，并通过 Node.js 执行基本对象操作。"
---

[AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) 可通过自定义端点连接到 RustFS。下面是最简连接方法；如需完整程序，请参阅 [JavaScript SDK 指南](../sdk/javascript.md)。

## 安装

```bash
npm install @aws-sdk/client-s3
```

## 配置

请将 `http://localhost:9000` 替换为您的服务器地址，并使用您自己的[访问密钥](../../security-compliance/iam/access-token.md)。RustFS 要求使用路径样式寻址 (`forcePathStyle: true`)：

```javascript title="index.mjs" {8}
import { S3Client, CreateBucketCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { readFileSync } from "node:fs";

const s3 = new S3Client({
  endpoint: "http://localhost:9000",
  region: "us-east-1",
  credentials: { accessKeyId: "<your-access-key>", secretAccessKey: "<your-secret-key>" },
  forcePathStyle: true,
});
```

## 验证

```javascript
await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
await s3.send(new PutObjectCommand({ Bucket: "my-bucket", Key: "hello.txt", Body: readFileSync("/path/to/hello.txt") }));

const out = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
for (const obj of out.Contents ?? []) console.log(obj.Key, obj.Size);
```

```text
hello.txt 12
```

## 后续步骤

请参阅完整的 [JavaScript SDK 指南](../sdk/javascript.md)，或使用 [`rc`](/operations/rc) 管理对象。