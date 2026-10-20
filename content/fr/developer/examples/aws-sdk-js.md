---
title: "AWS SDK pour JavaScript"
description: "Connectez l’AWS SDK pour JavaScript v3 à RustFS et effectuez des opérations objet de base depuis Node.js."
---

L’[AWS SDK pour JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) se connecte à RustFS par un point de terminaison personnalisé. Voici la recette de connexion minimale ; le [guide du SDK JavaScript](../sdk/javascript.md) présente un programme complet.

## Installation

```bash
npm install @aws-sdk/client-s3
```

## Configuration

Remplacez `http://localhost:9000` par l’adresse de votre serveur et utilisez vos propres [clés d’accès](../../security-compliance/iam/access-token.md). RustFS exige l’adressage de type chemin (path-style) (`forcePathStyle: true`) :

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

## Vérification

```javascript
await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
await s3.send(new PutObjectCommand({ Bucket: "my-bucket", Key: "hello.txt", Body: readFileSync("/path/to/hello.txt") }));

const out = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
for (const obj of out.Contents ?? []) console.log(obj.Key, obj.Size);
```

```text
hello.txt 12
```

## Étapes suivantes

Consultez le [guide complet du SDK JavaScript](../sdk/javascript.md), ou gérez les objets avec [`rc`](/fr/operations/rc).
