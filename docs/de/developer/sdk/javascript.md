---
title: "JavaScript SDK"
description: "Dieses Dokument erklärt hauptsächlich die Verwendung des JavaScript SDK in RustFS."
---

Im Folgenden finden Sie die **vollständige Entwicklerdokumentation für die Verwendung des AWS S3 JS SDK mit RustFS**, einschließlich SDK-Installation, Initialisierungskonfiguration, grundlegender Operationen (Upload, Download, Löschen, Auflisten), vorsignierter URLs und mehrteiliger Uploads, geeignet für Node.js-Umgebungen.

# RustFS AWS S3 JS SDK Dokumentation (für Node.js)

## I. Überblick

RustFS ist ein S3-protokollkompatibles Objektspeichersystem, das über das offizielle AWS JavaScript SDK (v3) zugänglich ist. Diese Anleitung zeigt Ihnen, wie Sie JS verwenden, um eine Verbindung zu RustFS herzustellen und gängige Objektspeicheroperationen auszuführen.

## II. Vorbereitung

### 2.1 SDK Installation

Installieren Sie die erforderlichen AWS SDK v3 Module mit NPM:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 RustFS Beispielkonfiguration

Angenommen, die RustFS-Instanz ist wie folgt bereitgestellt:

```
Endpoint: http://192.168.1.100:9000
Access Key: rustfsadmin
Secret Key: rustfssecret
```

---

## III. S3-Client Initialisierung

```js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000", // RustFS endpoint
 region: "us-east-1", // kann beliebig ausgefüllt werden
 credentials: {
 accessKeyId: "rustfsadmin",
 secretAccessKey: "rustfssecret",
 },
 forcePathStyle: true, // Muss für RustFS-Kompatibilität aktiviert werden
 requestHandler: new NodeHttpHandler({
 connectionTimeout: 3000,
 socketTimeout: 5000,
 }),
});
```

---

## IV. Grundlegende Operationen

### 4.1 Bucket erstellen

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket erstellt");
```

---

### 4.2 Objekt hochladen

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

console.log("Datei hochgeladen");
```

---

### 4.3 Objekt herunterladen

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

console.log("Datei heruntergeladen");
```

---

### 4.4 Objekte auflisten

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

---

### 4.5 Objekt löschen

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("Datei gelöscht");
```

---

## V. Erweiterte Funktionen

### 5.1 Vorsignierte URLs generieren

> Ermöglicht Frontend oder Drittanbietern die Verwendung temporärer Links zum Hochladen/Herunterladen von Dateien

#### Download (GET)

```js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const url = await getSignedUrl(
 s3,
 new GetObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }),
 { expiresIn: 600 }
);

console.log("Vorsignierte GET URL:", url);
```

#### Upload (PUT)

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(
 s3,
 new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
 { expiresIn: 600 }
);

console.log("Vorsignierte PUT URL:", url);
```

---

### 5.2 Mehrteiliger Upload (Multipart Upload)

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

// 1. Upload-Aufgabe erstellen
const createRes = await s3.send(
 new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. Segmentierter Upload
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

// 3. Upload abschließen
await s3.send(
 new CompleteMultipartUploadCommand({
 Bucket: bucket,
 Key: key,
 UploadId: uploadId,
 MultipartUpload: { Parts: parts },
 })
);

console.log("Mehrteiliger Upload abgeschlossen");
```

---

## VI. Häufige Probleme und Hinweise

| Problem | Ursache | Lösung |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | Falsche Signaturversion | JS SDK v3 verwendet standardmäßig v4, stellen Sie sicher, dass RustFS v4 unterstützt |
| EndpointConnectionError | Endpoint-Adresse falsch konfiguriert oder nicht gestartet | Prüfen Sie, ob die RustFS-Adresse erreichbar ist |
| NoSuchKey | Datei existiert nicht | Prüfen Sie, ob `Key` korrekt geschrieben ist |
| InvalidAccessKeyId / Secret | Falsche Anmeldedaten | Prüfen Sie die Konfiguration von `accessKeyId` / `secretAccessKey` |
| Upload-Fehler (Pfadproblem) | Path-style nicht aktiviert | Setzen Sie `forcePathStyle: true` |

---

## VII. Anhang: Frontend-Upload-Anpassung

Mit vorsignierten URLs können Browser Dateien direkt hochladen, ohne AccessKey zu übertragen.

Frontend (HTML+JS) Upload-Beispiel:

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

 if (res.ok) alert("Hochgeladen!");
 });
</script>
```

