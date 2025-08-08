---
title: "JS SDK"
description: "Este documento explica como usar o SDK JavaScript da AWS (v3) com o RustFS."
---

A seguir está a documentação para usar o **AWS S3 JS SDK** com o RustFS: instalação, configuração, operações básicas (upload, download, delete, list), URL pré‑assinada e upload multipart, para ambiente Node.js.

---

# RustFS com AWS S3 JS SDK (Node.js)

## 1. Visão geral

RustFS é compatível com o protocolo S3 e pode ser acessado com o AWS SDK para JavaScript (v3). Este guia mostra como conectar e realizar operações comuns.

---

## 2. Preparação

### 2.1 Instalar SDK

Instale os módulos necessários do AWS SDK v3:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 Configuração de exemplo do RustFS

Suponha a seguinte instância RustFS:

```
Endpoint: http://192.168.1.100:9000
Access Key: rustfsadmin
Secret Key: rustfssecret
```

---

## 3. Inicializar o cliente S3

```js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000", // endpoint do RustFS
 region: "us-east-1", // valor arbitrário
 credentials: {
 accessKeyId: "rustfsadmin",
 secretAccessKey: "rustfssecret",
 },
 forcePathStyle: true, // necessário para compatibilidade com RustFS
 requestHandler: new NodeHttpHandler({
 connectionTimeout: 3000,
 socketTimeout: 5000,
 }),
});
```

---

## 4. Operações básicas

### 4.1 Criar bucket

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket created");
```

---

### 4.2 Upload de objeto

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

### 4.3 Download de objeto

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

### 4.4 Listar objetos

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

---

### 4.5 Excluir objeto

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("File deleted");
```

---

## 5. Funcionalidades avançadas

### 5.1 URL pré‑assinada

> Permite a terceiros usar links temporários para upload/download

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

#### Upload (PUT)

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

### 5.2 Upload multipart

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

// 1. Criar tarefa de upload
const createRes = await s3.send(
 new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. Enviar partes
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

// 3. Concluir upload
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

## 6. FAQ e notas

| Problema | Causa | Solução |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | Versão de assinatura incorreta | JS SDK v3 usa v4; confirme suporte v4 no RustFS |
| EndpointConnectionError | Endpoint incorreto ou serviço inativo | Verifique acessibilidade do RustFS |
| NoSuchKey | Objeto inexistente | Verifique `Key` |
| InvalidAccessKeyId / Secret | Credenciais incorretas | Verifique `accessKeyId` / `secretAccessKey` |
| Falha de upload (path‑style) | Path‑style desativado | Defina `forcePathStyle: true` |

---

## 7. Anexo: upload via front‑end

É possível permitir uploads diretos do navegador com URL pré‑assinada, sem expor AccessKey.

Exemplo (HTML+JS):

```html
<input type="file" id="fileInput" />
<script>
document.getElementById("fileInput").addEventListener("change", async (e) => {
 const file = e.target.files[0];
 const url = await fetch("/api/presigned-put-url?key=" + file.name).then((r) => r.text());

 const res = await fetch(url, {
 method: "PUT",
 body: file,
 });

 if (res.ok) alert("Uploaded!");
});
</script>
```

