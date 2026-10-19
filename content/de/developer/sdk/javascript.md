---
title: "JavaScript-SDK-Anleitung"
description: "Verwenden Sie das offizielle AWS SDK für JavaScript v3 mit RustFS."
---

## Überblick

RustFS enthält kein eigenes JavaScript-SDK. Der Dienst ist S3-kompatibel, daher verwenden Sie das offizielle AWS SDK für JavaScript (v3) und richten es auf Ihren RustFS-Server aus. In dieser Anleitung verbinden Sie sich mit RustFS und führen gängige Operationen im Objektspeicher aus.

## Voraussetzungen

* Node.js 18 oder höher
* Eine laufende RustFS-Instanz (siehe [Installationsanleitung](../../installation/index.md)). Die S3-API nimmt Verbindungen auf Port `9000` entgegen, die Console (Weboberfläche) auf Port `9001`
* Zugriffsschlüssel, die Sie bei der Installation über die Umgebungsvariablen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` setzen (siehe [Zugriffsschlüssel-Verwaltung](../../security-compliance/iam/access-token.md))

:::tip[Lokaler Test]

Wenn Sie bei der Installation keine Anmeldedaten gesetzt haben, verwendet der Server standardmäßig `rustfsadmin` / `rustfsadmin`. Das reicht für einen wegwerfbaren lokalen Test, niemals für eine Instanz, die andere erreichen können.

:::

### SDK installieren

Installieren Sie die erforderlichen Module des AWS SDK v3 mit npm:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Die folgenden Beispiele verwenden ES-Module (`import`). Setzen Sie `"type": "module"` in Ihrer `package.json`, oder speichern Sie die Dateien mit der Endung `.mjs`.

---

## Client initialisieren

Das folgende Skript ist vollständig und ausführbar. Ersetzen Sie `localhost` durch die IP-Adresse Ihres Servers, wenn RustFS auf einem anderen Rechner läuft, und tragen Sie Ihre eigenen Zugriffsschlüssel ein:

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

Führen Sie es aus:

```bash
node main.mjs
```

```text
[ 'my-bucket' ]
```

Alle folgenden Ausschnitte verwenden diesen Client `s3` weiter.

---

## Grundlegende Operationen

### 4.1 Bucket erstellen

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket created");
```

```text
Bucket created
```

---

### 4.2 Objekt hochladen

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

console.log("File downloaded");
```

```text
File downloaded
```

---

### 4.4 Objekte auflisten

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

```text
hello.txt (12 bytes)
```

---

### 4.5 Objekt löschen

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("File deleted");
```

```text
File deleted
```

---

## Erweiterte Funktionen

### 5.1 Vorsignierte URLs erzeugen

Vorsignierte URLs ermöglichen Browser-Clients oder Dritten, Objekte über zeitlich begrenzte Links hoch- oder herunterzuladen.

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

```text
Presigned GET URL: http://localhost:9000/my-bucket/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

#### Upload (PUT)

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

### 5.2 Mehrteiliger Upload

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

## Fehlerbehebung

| Problem | Ursache | Lösung |
| --- | --- | --- |
| SignatureDoesNotMatch | Die Signatur stimmt nicht überein | Das SDK v3 signiert standardmäßig mit SigV4. Prüfen Sie Zugangsdaten, Region und Endpunkt |
| EndpointConnectionError | Die Endpunktadresse ist falsch konfiguriert, oder der Dienst ist nicht gestartet | Prüfen Sie, ob die RustFS-Adresse erreichbar ist |
| NoSuchKey | Das Objekt ist nicht vorhanden | Prüfen Sie, ob `Key` richtig geschrieben ist |
| InvalidAccessKeyId / Secret | Zugangsdaten sind falsch konfiguriert | Prüfen Sie die Konfiguration von `accessKeyId` und `secretAccessKey` |
| Upload schlägt fehl (Pfadproblem) | Pfadbasierte Adressierung (Path-Style) ist nicht aktiviert | Setzen Sie `forcePathStyle: true` |

---

## Anhang: Uploads aus dem Browser

Mit vorsignierten URLs können Browser Objekte direkt hochladen, ohne Zugriff auf Ihre Zugangsdaten.

Beispiel für einen Upload im Frontend (HTML und JavaScript):

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

Weitere Operationen (Objekt-Tagging, Bucket-Richtlinien und mehr) stehen in der [Dokumentation zum AWS SDK für JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/). Die meisten S3-Operationen funktionieren gegenüber RustFS auf dieselbe Weise. Ausnahmen stehen unter [S3-Kompatibilität](/de/reference/s3-compatibility).
