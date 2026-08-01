---
title: "AWS SDK for JavaScript"
description: "Connect the AWS SDK for JavaScript v3 to RustFS and perform basic object operations from Node.js."
---

The [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) connects to RustFS through a custom endpoint. This is the minimal connection recipe; see the [JavaScript SDK guide](../sdk/javascript.md) for a full program.

## Install

```bash
npm install @aws-sdk/client-s3
```

## Configure

Replace `http://localhost:9000` with your server address and use your own [access keys](../../security-compliance/iam/access-token.md). RustFS requires path-style addressing (`forcePathStyle: true`):

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

## Verify

```javascript
await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
await s3.send(new PutObjectCommand({ Bucket: "my-bucket", Key: "hello.txt", Body: readFileSync("/path/to/hello.txt") }));

const out = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
for (const obj of out.Contents ?? []) console.log(obj.Key, obj.Size);
```

```text
hello.txt 12
```

## Next steps

See the full [JavaScript SDK guide](../sdk/javascript.md), or manage objects with [`rc`](/operations/rc).
