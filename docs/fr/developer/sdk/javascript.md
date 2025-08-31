---
title: "SDK JavaScript"
description: "Ce document explique principalement l'utilisation du SDK JavaScript dans RustFS."
---

Voici la **documentation complète de développement pour l'utilisation du AWS S3 JS SDK avec RustFS**, incluant l'installation du SDK, la configuration d'initialisation, les opérations de base (téléchargement, téléversement, suppression, listage), les URL pré-signées et les téléchargements en plusieurs parties, adaptée aux environnements Node.js.

# Documentation RustFS AWS S3 JS SDK (pour Node.js)

## I. Aperçu

RustFS est un système de stockage d'objets compatible avec le protocole S3, accessible via le SDK JavaScript officiel d'AWS (v3). Ce guide vous montrera comment utiliser JS pour vous connecter à RustFS et effectuer des opérations courantes de stockage d'objets.

## II. Préparation

### 2.1 Installation du SDK

Installez les modules AWS SDK v3 requis avec NPM :

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 Configuration d'exemple RustFS

Supposons que l'instance RustFS soit déployée comme suit :

```
Endpoint: http://192.168.1.100:9000
Access Key: rustfsadmin
Secret Key: rustfssecret
```

---

## III. Initialisation du client S3

```js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000", // endpoint RustFS
 region: "us-east-1", // peut être rempli arbitrairement
 credentials: {
 accessKeyId: "rustfsadmin",
 secretAccessKey: "rustfssecret",
 },
 forcePathStyle: true, // Doit être activé pour la compatibilité RustFS
 requestHandler: new NodeHttpHandler({
 connectionTimeout: 3000,
 socketTimeout: 5000,
 }),
});
```

---

## IV. Opérations de base

### 4.1 Créer un bucket

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket créé");
```

---

### 4.2 Téléverser un objet

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

console.log("Fichier téléversé");
```

---

### 4.3 Télécharger un objet

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

console.log("Fichier téléchargé");
```

---

### 4.4 Lister les objets

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

---

### 4.5 Supprimer un objet

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("Fichier supprimé");
```

---

## V. Fonctionnalités avancées

### 5.1 Générer des URL pré-signées

> Permet au frontend ou aux tiers d'utiliser des liens temporaires pour téléverser/télécharger des fichiers

#### Téléchargement (GET)

```js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const url = await getSignedUrl(
 s3,
 new GetObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }),
 { expiresIn: 600 }
);

console.log("URL GET pré-signée:", url);
```

#### Téléversement (PUT)

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(
 s3,
 new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
 { expiresIn: 600 }
);

console.log("URL PUT pré-signée:", url);
```

---

### 5.2 Téléchargement en plusieurs parties (Multipart Upload)

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

// 1. Créer une tâche de téléchargement
const createRes = await s3.send(
 new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. Téléchargement segmenté
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

// 3. Terminer le téléchargement
await s3.send(
 new CompleteMultipartUploadCommand({
 Bucket: bucket,
 Key: key,
 UploadId: uploadId,
 MultipartUpload: { Parts: parts },
 })
);

console.log("Téléchargement en plusieurs parties terminé");
```

---

## VI. Problèmes courants et notes

| Problème | Cause | Solution |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | Version de signature incorrecte | JS SDK v3 utilise v4 par défaut, assurez-vous que RustFS supporte v4 |
| EndpointConnectionError | Adresse endpoint mal configurée ou non démarrée | Vérifiez si l'adresse RustFS est accessible |
| NoSuchKey | Le fichier n'existe pas | Vérifiez si `Key` est correctement orthographié |
| InvalidAccessKeyId / Secret | Identifiants mal configurés | Vérifiez la configuration `accessKeyId` / `secretAccessKey` |
| Échec de téléchargement (problème de chemin) | Path-style non activé | Définir `forcePathStyle: true` |

---

## VII. Annexe : Adaptation du téléchargement frontend

L'utilisation d'URL pré-signées permet aux navigateurs de télécharger directement des fichiers sans transmettre AccessKey.

Exemple de téléchargement frontend (HTML+JS) :

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

 if (res.ok) alert("Téléversé!");
 });
</script>
```

