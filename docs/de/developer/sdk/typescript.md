---
title: "TypeScript SDK"
description: "Dieses Dokument erklärt hauptsächlich die Verwendung des TypeScript SDK in RustFS."
---

# TypeScript Rust SDK

Da RustFS ein vollständig S3-kompatibles Objektspeichersystem ist, kann durch einige Wrapper um das S3 TypeScript SDK ein für RustFS geeignetes TypeScript SDK erstellt werden. Über das SDK können RustFS-Operationen durchgeführt werden, einschließlich der Erstellung und Löschung von Buckets/Objekten sowie des Hoch- und Herunterladens von Dateien.

## Voraussetzungen

- Eine verfügbare RustFS-Instanz (siehe [Installationshandbuch](../../installation/index.md) für die Installation).
- Zugriffsschlüssel (siehe [Zugriffsschlüssel-Verwaltung](../../administration/iam/access-token.md) für die Erstellung).

## RustFS TypeScript SDK Konstruktion

Mit Hilfe des TypeScript S3Client wird unter Verwendung von `region`, `access_key_id`, `secret_access_key` und `endpoint_url` ein RustFS-Client konstruiert:

```typescript
import { S3Client, CreateBucketCommand, DeleteBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";

const rustfs_client = new S3Client({
    region: "cn-east-1",
    credentials: {
        accessKeyId: process.env.RUSTFS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.RUSTFS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.RUSTFS_ENDPOINT_URL!,
    forcePathStyle: true,
});
```

Anschließend wird der konstruierte `rustfs_client` für entsprechende Operationen verwendet.

## Bucket erstellen

```typescript
async function createBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new CreateBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket erfolgreich erstellt:", response);
    } catch (error) {
        console.error("Fehler beim Erstellen des Buckets:", error);
    }
}
```

## Bucket löschen

```typescript
async function deleteBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new DeleteBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket erfolgreich gelöscht:", response);
    } catch (error) {
        console.error("Fehler beim Löschen des Buckets:", error);
    }
}
```

## Buckets auflisten

```typescript
async function listBuckets(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListBucketsCommand({}));
        console.log("Verfügbare Buckets:");
        response.Buckets?.forEach(bucket => {
            console.log(`- ${bucket.Name} (erstellt: ${bucket.CreationDate})`);
        });
    } catch (error) {
        console.error("Fehler beim Auflisten der Buckets:", error);
    }
}
```

## Objekte auflisten

```typescript
async function listObjects(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListObjectsV2Command({
            Bucket: "my-bucket",
        }));
        console.log("Objekte im Bucket:");
        response.Contents?.forEach(obj => {
            console.log(`- ${obj.Key} (${obj.Size} bytes, ${obj.LastModified})`);
        });
    } catch (error) {
        console.error("Fehler beim Auflisten der Objekte:", error);
    }
}
```

## Datei hochladen

```typescript
async function uploadFile(): Promise<void> {
    try {
        const fileStream = fs.createReadStream("/path/to/local/file.txt");
        const response = await rustfs_client.send(new PutObjectCommand({
            Bucket: "my-bucket",
            Key: "uploaded-file.txt",
            Body: fileStream,
            ContentType: "text/plain",
        }));
        console.log("Datei erfolgreich hochgeladen:", response.ETag);
    } catch (error) {
        console.error("Fehler beim Hochladen der Datei:", error);
    }
}
```

## Objekt herunterladen

```typescript
async function getObject(): Promise<void> {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "my-bucket",
            Key: "uploaded-file.txt",
        }));
        
        // Objektinhalt abrufen
        if (response.Body) {
            const chunks: Buffer[] = [];
            const stream = response.Body as NodeJS.ReadableStream;
            
            for await (const chunk of stream) {
                chunks.push(chunk as Buffer);
            }
            
            const data = Buffer.concat(chunks).toString("utf-8");
            console.log("Objektinhalt:", data);
        }
    } catch (error) {
        console.error("Fehler beim Herunterladen des Objekts:", error);
    }
}
```

## Weitere Verwendung

Für weitere Verwendungen können Sie selbst erkunden. Mit TypeScript erhalten Sie vollständige Typsicherheit und IntelliSense-Unterstützung für alle RustFS-Operationen. Das SDK unterstützt auch erweiterte Funktionen wie:

- Vorsignierte URLs für temporären Zugriff
- Multipart-Uploads für große Dateien
- Bucket-Richtlinien und ACL-Verwaltung
- Objekt-Metadaten und Tags

Alle diese Funktionen können über die standardmäßigen AWS SDK v3 TypeScript-Interfaces verwendet werden.

