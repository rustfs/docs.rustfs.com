---
title: "JavaScript SDK"
description: "Este documento explica principalmente o uso do JavaScript SDK no RustFS."
---

Aqui está a **documentação completa de desenvolvimento para usar o AWS S3 JS SDK com RustFS**, incluindo instalação do SDK, configuração de inicialização, operações básicas (upload, download, exclusão, listagem), URLs pré-assinadas e uploads multipartes, adequada para ambientes Node.js.

# Documentação do RustFS AWS S3 JS SDK (para Node.js)

## I. Visão Geral

O RustFS é um sistema de armazenamento de objetos compatível com o protocolo S3, acessível através do SDK oficial JavaScript (v3) da AWS. Este guia mostrará como usar JS para conectar ao RustFS e executar operações comuns de armazenamento de objetos.

## II. Preparação

### 2.1 Instalação do SDK

Instale os módulos AWS SDK v3 necessários com NPM:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 Configuração de Exemplo do RustFS

Assumindo que a instância RustFS está implantada da seguinte forma:

```
Endpoint: http://192.168.1.100:9000
Access Key: rustfsadmin
Secret Key: rustfssecret
```

---

## III. Inicialização do Cliente S3

```js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000", // endpoint RustFS
 region: "us-east-1", // pode ser preenchido arbitrariamente
 credentials: {
 accessKeyId: "rustfsadmin",
 secretAccessKey: "rustfssecret",
 },
 forcePathStyle: true, // Deve ser habilitado para compatibilidade com RustFS
 requestHandler: new NodeHttpHandler({
 connectionTimeout: 3000,
 socketTimeout: 5000,
 }),
});
```

---

## IV. Operações Básicas

### 4.1 Criar Bucket

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket criado");
```

---

### 4.2 Fazer Upload de Objeto

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

console.log("Arquivo enviado");
```

---

### 4.3 Baixar Objeto

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

console.log("Arquivo baixado");
```

---

### 4.4 Listar Objetos

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

---

### 4.5 Excluir Objeto

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("Arquivo excluído");
```

---

## V. Recursos Avançados

### 5.1 Gerar URLs Pré-assinadas

> Permite que frontend ou terceiros usem links temporários para upload/download de arquivos

#### Download (GET)

```js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const url = await getSignedUrl(
 s3,
 new GetObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }),
 { expiresIn: 600 }
);

console.log("URL GET pré-assinada:", url);
```

#### Upload (PUT)

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(
 s3,
 new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
 { expiresIn: 600 }
);

console.log("URL PUT pré-assinada:", url);
```

---

### 5.2 Upload Multipartes

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

// 2. Upload segmentado
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

// 3. Completar upload
await s3.send(
 new CompleteMultipartUploadCommand({
 Bucket: bucket,
 Key: key,
 UploadId: uploadId,
 MultipartUpload: { Parts: parts },
 })
);

console.log("Upload multipartes concluído");
```

---

## VI. Problemas Comuns e Observações

| Problema | Causa | Solução |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | Versão de assinatura incorreta | JS SDK v3 usa v4 por padrão, assegurar que RustFS suporte v4 |
| EndpointConnectionError | Endereço endpoint mal configurado ou não iniciado | Verificar se endereço RustFS é acessível |
| NoSuchKey | Arquivo não existe | Verificar se `Key` está escrito corretamente |
| InvalidAccessKeyId / Secret | Credenciais mal configuradas | Verificar configuração `accessKeyId` / `secretAccessKey` |
| Falha no upload (problema de caminho) | Estilo de caminho não habilitado | Definir `forcePathStyle: true` |

---

## VII. Apêndice: Adaptação de Upload Frontend

Usar URLs pré-assinadas permite que navegadores façam upload de arquivos diretamente sem passar AccessKey.

Exemplo de upload frontend (HTML+JS):

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

 if (res.ok) alert("Enviado!");
 });
</script>
```
