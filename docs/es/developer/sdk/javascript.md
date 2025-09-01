---
title: "SDK JavaScript"
description: "Este documento explica principalmente el uso del SDK JavaScript en RustFS."
---

Aquí está la **documentación completa de desarrollo para el uso del AWS S3 JS SDK con RustFS**, incluyendo instalación del SDK, configuración de inicialización, operaciones básicas (subida, descarga, eliminación, listado), URLs prefirmadas y subidas multi-parte, adecuada para entornos Node.js.

# Documentación RustFS AWS S3 JS SDK (para Node.js)

## I. Resumen

RustFS es un sistema de almacenamiento de objetos compatible con el protocolo S3, accesible a través del SDK JavaScript oficial de AWS (v3). Esta guía le mostrará cómo usar JS para conectarse a RustFS y realizar operaciones comunes de almacenamiento de objetos.

## II. Preparación

### 2.1 Instalación del SDK

Instale los módulos AWS SDK v3 requeridos con NPM:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 Configuración de ejemplo RustFS

Supongamos que la instancia RustFS está desplegada como sigue:

```
Endpoint: http://192.168.1.100:9000
Access Key: rustfsadmin
Secret Key: rustfssecret
```

---

## III. Inicialización del cliente S3

```js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000", // endpoint RustFS
 region: "us-east-1", // puede llenarse arbitrariamente
 credentials: {
 accessKeyId: "rustfsadmin",
 secretAccessKey: "rustfssecret",
 },
 forcePathStyle: true, // Debe estar habilitado para compatibilidad RustFS
 requestHandler: new NodeHttpHandler({
 connectionTimeout: 3000,
 socketTimeout: 5000,
 }),
});
```

---

## IV. Operaciones básicas

### 4.1 Crear bucket

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket creado");
```

---

### 4.2 Subir objeto

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

console.log("Archivo subido");
```

---

### 4.3 Descargar objeto

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

console.log("Archivo descargado");
```

---

### 4.4 Listar objetos

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

---

### 4.5 Eliminar objeto

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("Archivo eliminado");
```

---

## V. Funcionalidades avanzadas

### 5.1 Generar URLs prefirmadas

> Permite al frontend o terceros usar enlaces temporales para subir/descargar archivos

#### Descarga (GET)

```js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const url = await getSignedUrl(
 s3,
 new GetObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }),
 { expiresIn: 600 }
);

console.log("URL GET prefirmada:", url);
```

#### Subida (PUT)

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(
 s3,
 new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
 { expiresIn: 600 }
);

console.log("URL PUT prefirmada:", url);
```

---

### 5.2 Subida multi-parte (Multipart Upload)

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

// 1. Crear tarea de subida
const createRes = await s3.send(
 new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. Subida segmentada
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

// 3. Completar subida
await s3.send(
 new CompleteMultipartUploadCommand({
 Bucket: bucket,
 Key: key,
 UploadId: uploadId,
 MultipartUpload: { Parts: parts },
 })
);

console.log("Subida multi-parte completada");
```

---

## VI. Problemas comunes y notas

| Problema | Causa | Solución |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | Versión de firma incorrecta | JS SDK v3 usa v4 por defecto, asegúrese de que RustFS soporte v4 |
| EndpointConnectionError | Dirección endpoint mal configurada o no iniciada | Verifique si la dirección RustFS es accesible |
| NoSuchKey | El archivo no existe | Verifique si `Key` está escrito correctamente |
| InvalidAccessKeyId / Secret | Credenciales mal configuradas | Verifique la configuración `accessKeyId` / `secretAccessKey` |
| Fallo de subida (problema de ruta) | Path-style no habilitado | Establecer `forcePathStyle: true` |

---

## VII. Apéndice: Adaptación de subida frontend

Usar URLs prefirmadas permite a los navegadores subir archivos directamente sin transmitir AccessKey.

Ejemplo de subida frontend (HTML+JS):

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

 if (res.ok) alert("¡Subido!");
 });
</script>
```

