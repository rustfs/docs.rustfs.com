---
title: "Guide du SDK JavaScript"
description: "Utilisez le SDK AWS officiel pour JavaScript v3 avec RustFS."
---

## Présentation

RustFS ne fournit pas de SDK JavaScript propre. Il est compatible avec S3 : vous utilisez donc le SDK AWS officiel pour JavaScript (v3), configuré pour pointer vers votre serveur RustFS. Ce guide montre comment se connecter à RustFS et effectuer les opérations courantes de stockage objet.

## Prérequis

* Node.js 18 ou ultérieur
* Une instance RustFS en cours d’exécution (consultez le [guide d’installation](../../installation/index.md)) : l’API S3 écoute sur le port `9000`, la Console sur le port `9001`
* Des clés d’accès, définies à l’installation par les variables d’environnement `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` (consultez la [gestion des clés d’accès](../../security-compliance/iam/access-token.md))

:::tip[Essai local]

Si vous n’avez pas défini d’identifiants à l’installation, le serveur utilise par défaut `rustfsadmin` / `rustfsadmin`. Cela convient à un essai local jetable, jamais à une instance accessible à d’autres personnes.

:::

### Installer le SDK

Installez les modules requis du SDK AWS v3 avec npm :

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Les exemples ci-dessous utilisent les modules ES (`import`). Définissez `"type": "module"` dans votre `package.json`, ou enregistrez les fichiers avec l’extension `.mjs`.

---

## Initialiser le client

Le script suivant est complet et exécutable. Remplacez `localhost` par l’adresse IP de votre serveur si RustFS s’exécute sur une autre machine, et renseignez vos propres clés d’accès :

```js title="main.mjs"
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "http://localhost:9000", // RustFS S3 API address
  region: "us-east-1", // RustFS default region
  credentials: {
    accessKeyId: "<your-access-key>",
    secretAccessKey: "<your-secret-key>",
  },
  // RustFS uses path-style URLs by default; virtual-host style requires RUSTFS_SERVER_DOMAINS
  forcePathStyle: true,
});

const { Buckets } = await s3.send(new ListBucketsCommand({}));
console.log(Buckets?.map((b) => b.Name) ?? []);
```

Exécutez-le :

```bash
node main.mjs
```

```text
[ 'my-bucket' ]
```

Tous les extraits ci-dessous réutilisent ce client `s3`.

---

## Opérations de base

### 4.1 Créer un compartiment

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket created");
```

```text
Bucket created
```

---

### 4.2 Charger un objet

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";

const data = readFileSync("/path/to/hello.txt");

await s3.send(
  new PutObjectCommand({
    Bucket: "my-bucket",
    Key: "hello.txt",
    Body: data,
  })
);

console.log("File uploaded");
```

```text
File uploaded
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

console.log("File downloaded");
```

```text
File downloaded
```

---

### 4.4 Lister les objets

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

```text
hello.txt (12 bytes)
```

---

### 4.5 Supprimer un objet

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("File deleted");
```

```text
File deleted
```

---

## Fonctionnalités avancées

### 5.1 Générer des URL présignées

Les URL présignées permettent à des clients navigateur ou à des tiers de charger ou de télécharger des objets au moyen de liens temporaires.

#### Téléchargement (GET)

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

```text
Presigned GET URL: http://localhost:9000/my-bucket/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

#### Chargement (PUT)

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const url = await getSignedUrl(
  s3,
  new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
  { expiresIn: 600 }
);

console.log("Presigned PUT URL:", url);
```

---

### 5.2 Chargement partitionné

```js
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { statSync, openSync, readSync, closeSync } from "fs";

const bucket = "my-bucket";
const key = "large-file.zip";
const filePath = "./large-file.zip";
const partSize = 5 * 1024 * 1024; // 5 MB

// 1. Create upload task
const createRes = await s3.send(
  new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. Segmented upload
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

// 3. Complete upload
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

```text
Multipart upload completed
```

---

## Dépannage

| Problème | Cause | Solution |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | Incohérence de signature | Le SDK v3 signe par défaut avec SigV4 ; vérifiez les identifiants, la région et le point de terminaison |
| EndpointConnectionError | Adresse du point de terminaison mal configurée, ou service non démarré | Vérifiez que l’adresse RustFS est accessible |
| NoSuchKey | L’objet n’existe pas | Vérifiez l’orthographe de `Key` |
| InvalidAccessKeyId / Secret | Identifiants mal configurés | Vérifiez la configuration de `accessKeyId` et de `secretAccessKey` |
| Échec de chargement (problème de chemin) | Adressage de type chemin (path-style) non activé | Définissez `forcePathStyle: true` |

---

## Annexe : chargements depuis le navigateur

Avec les URL présignées, les navigateurs peuvent charger des objets directement, sans accès à vos identifiants.

Exemple de chargement côté frontal (HTML+JS) :

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

    if (res.ok) alert("Uploaded!");
  });
</script>
```

Pour les autres opérations (étiquetage d’objets, politiques de compartiment, etc.), consultez la [documentation de l’AWS SDK pour JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/). La plupart des opérations S3 fonctionnent de la même manière avec RustFS ; les exceptions sont décrites dans la [compatibilité S3](/fr/reference/s3-compatibility).
