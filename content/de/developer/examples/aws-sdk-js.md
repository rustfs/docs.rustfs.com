---
title: "AWS SDK für JavaScript"
description: "Verbinden Sie das AWS SDK für JavaScript v3 mit RustFS und führen Sie grundlegende Objektoperationen aus Node.js aus."
---

Das [AWS SDK für JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) verbindet sich über einen benutzerdefinierten Endpunkt mit RustFS. Dies ist das minimale Verbindungsbeispiel. Ein vollständiges Programm steht in der [JavaScript-SDK-Anleitung](../sdk/javascript.md).

## Installation

```bash
npm install @aws-sdk/client-s3
```

## Konfiguration

Ersetzen Sie `http://localhost:9000` durch Ihre Serveradresse und verwenden Sie Ihre eigenen [Zugriffsschlüssel](../../security-compliance/iam/access-token.md). RustFS erfordert pfadbasierte Adressierung (Path-Style) (`forcePathStyle: true`):

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

## Überprüfung

```javascript
await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
await s3.send(new PutObjectCommand({ Bucket: "my-bucket", Key: "hello.txt", Body: readFileSync("/path/to/hello.txt") }));

const out = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
for (const obj of out.Contents ?? []) console.log(obj.Key, obj.Size);
```

```text
hello.txt 12
```

## Nächste Schritte

Lesen Sie die vollständige [JavaScript-SDK-Anleitung](../sdk/javascript.md), oder verwalten Sie Objekte mit [`rc`](/de/operations/rc).
