---
title: "TypeScript-SDK-Anleitung"
description: "Führen Sie aus TypeScript mit dem AWS SDK für JavaScript v3 Operationen auf RustFS aus, einschließlich des Erstellens und Löschens von Buckets und Objekten."
---

RustFS enthält kein eigenes TypeScript-SDK. Der Dienst ist S3-kompatibel, daher verwenden Sie das offizielle AWS SDK für JavaScript v3 (es enthält TypeScript-Typdefinitionen) und richten es auf Ihren RustFS-Server aus. Mit dem SDK erstellen und löschen Sie Buckets und laden Objekte hoch, herunter und löschen sie.

## Voraussetzungen

- Node.js 18 oder höher (die Beispiele verwenden ES-Module; setzen Sie `"type": "module"` in Ihrer `package.json`)
- Eine laufende RustFS-Instanz (siehe [Installationsanleitung](../../installation/index.md)). Die S3-API nimmt Verbindungen auf Port `9000` entgegen, die Console (Weboberfläche) auf Port `9001`
- Zugriffsschlüssel, die Sie bei der Installation über die Umgebungsvariablen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` setzen (zum Anlegen siehe [Zugriffsschlüssel-Verwaltung](../../security-compliance/iam/access-token.md))

:::tip[Lokaler Test]

Wenn Sie bei der Installation keine Anmeldedaten gesetzt haben, verwendet der Server standardmäßig `rustfsadmin` / `rustfsadmin`. Das reicht für einen wegwerfbaren lokalen Test, niemals für eine Instanz, die andere erreichen können.

:::

Installieren Sie die Abhängigkeiten:

```bash
npm install @aws-sdk/client-s3
npm install --save-dev typescript tsx @types/node
```

## Client initialisieren

Das folgende Beispiel ist vollständig und ausführbar. Ersetzen Sie `localhost` durch die IP-Adresse Ihres Servers, wenn RustFS auf einem anderen Rechner läuft, und tragen Sie Ihre eigenen Zugriffsschlüssel ein:

```typescript title="main.ts"
import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import * as fs from "fs";

const rustfs_client = new S3Client({
  region: "us-east-1", // RustFS default region
  endpoint: "http://localhost:9000", // RustFS S3 API address
  credentials: {
    accessKeyId: "<your-access-key>",
    secretAccessKey: "<your-secret-key>",
  },
  // RustFS uses path-style URLs by default; virtual-host style requires RUSTFS_SERVER_DOMAINS
  forcePathStyle: true,
});

const response = await rustfs_client.send(new ListBucketsCommand({}));
console.log(response.Buckets?.map((bucket) => bucket.Name) ?? []);
```

Führen Sie es aus:

```bash
npx tsx main.ts
```

```text
[ 'my-bucket' ]
```

Verwenden Sie anschließend den erzeugten Client `rustfs_client` für die folgenden Operationen.

## Bucket erstellen

```typescript
async function createBucket() {
  try {
    const response = await rustfs_client.send(
      new CreateBucketCommand({
        Bucket: "my-bucket",
      })
    );
    console.log("Bucket created:", response.Location);
  } catch (error) {
    console.log(error);
  }
}
```

```text
Bucket created: /my-bucket
```

## Bucket löschen

```typescript
async function deleteBucket() {
  try {
    await rustfs_client.send(
      new DeleteBucketCommand({
        Bucket: "my-bucket",
      })
    );
    console.log("Bucket deleted");
  } catch (error) {
    console.log(error);
  }
}
```

```text
Bucket deleted
```

## Buckets auflisten

```typescript
async function listBuckets() {
  try {
    const response = await rustfs_client.send(new ListBucketsCommand({}));
    response.Buckets?.forEach((bucket) => console.log(bucket.Name));
  } catch (error) {
    console.log(error);
  }
}
```

```text
my-bucket
```

## Objekte auflisten

```typescript
async function listObjects() {
  try {
    const response = await rustfs_client.send(
      new ListObjectsV2Command({
        Bucket: "my-bucket",
      })
    );
    response.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
  } catch (error) {
    console.log(error);
  }
}
```

```text
test/hello.txt (12 bytes)
```

## Datei hochladen

```typescript
async function uploadFile() {
  try {
    await rustfs_client.send(
      new PutObjectCommand({
        Bucket: "my-bucket",
        Key: "test/hello.txt",
        Body: fs.createReadStream("/path/to/hello.txt"),
      })
    );
    console.log("Object uploaded");
  } catch (error) {
    console.log(error);
  }
}
```

```text
Object uploaded
```

## Objekt herunterladen

```typescript
async function getObject() {
  try {
    const response = await rustfs_client.send(
      new GetObjectCommand({
        Bucket: "my-bucket",
        Key: "test/hello.txt",
      })
    );

    // get object content
    if (response.Body) {
      const chunks: Buffer[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk as Buffer);
      }
      const data = Buffer.concat(chunks).toString("utf-8");
      console.log("Object content:", data);
    }
  } catch (error) {
    console.log(error);
  }
}
```

```text
Object content: hello rustfs
```

Weitere Operationen (vorsignierte URLs, mehrteilige Uploads und mehr) stehen in der [Dokumentation zum AWS SDK für JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/). Die meisten S3-Operationen funktionieren gegenüber RustFS auf dieselbe Weise. Ausnahmen stehen unter [S3-Kompatibilität](/de/reference/s3-compatibility).
