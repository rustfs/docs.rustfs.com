---
title: "AWS SDK for JavaScript"
description: "AWS SDK for JavaScript v3 を RustFS に接続し、Node.js から基本的なオブジェクト操作を行います。"
---

[AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) は、カスタムエンドポイントを通じて RustFS に接続します。これは接続に必要な最小限の手順です。完全なプログラムについては、[JavaScript SDK ガイド](../sdk/javascript.md)を参照します。

## インストール

```bash
npm install @aws-sdk/client-s3
```

## 設定

`http://localhost:9000` を実際のサーバーアドレスに置き換え、独自の[アクセスキー](../../security-compliance/iam/access-token.md)を使います。RustFS ではパススタイルアクセス（`forcePathStyle: true`）が必要です。

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

## 検証

```javascript
await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
await s3.send(new PutObjectCommand({ Bucket: "my-bucket", Key: "hello.txt", Body: readFileSync("/path/to/hello.txt") }));

const out = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
for (const obj of out.Contents ?? []) console.log(obj.Key, obj.Size);
```

```text
hello.txt 12
```

## 次のステップ

完全な [JavaScript SDK ガイド](../sdk/javascript.md)を参照するか、[`rc`](/ja/operations/rc) でオブジェクトを管理します。
