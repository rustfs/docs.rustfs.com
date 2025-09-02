---
title: "RustFS TypeScript SDK Verwendungsanleitung"
description: "Operationen auf RustFS-Instanzen über TypeScript SDK, einschließlich Erstellung und Löschung von Speicher-Buckets und Objekten."
---

# TypeScript Rust SDK

Da RustFS ein vollständig S3-kompatibles Objektspeichersystem ist, kann ein für RustFS geeignetes TypeScript SDK durch Kapselung des S3 TypeScript SDK erstellt werden. Über das SDK können Operationen auf RustFS durchgeführt werden, einschließlich Erstellung und Löschung von Speicher-Buckets/Objekten, Hoch- und Herunterladen von Dateien usw.

## Voraussetzungen

- Eine verfügbare RustFS-Instanz (siehe [Installationsanleitung](../../installation/index.md) für die Installation).
- Zugriffsschlüssel (siehe [Zugriffsschlüsselverwaltung](../../administration/iam/access-token.md) für die Erstellung).

## RustFS TypeScript SDK-Konstruktion

Mit Hilfe des TypeScript S3Client wird ein RustFS-Client mit `region`, `access_key_id`, `secret_access_key` und `endpoint_url` konstruiert:

```
const rustfs_client = new S3Client({
    region: "cn-east-1",
    credentials: {
        accessKeyId: process.env.RUSTFS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.RUSTFS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.RUSTFS_ENDPOINT_URL!,
});
```

Verwenden Sie dann den konstruierten `rustfs_client` für entsprechende Operationen.

## Speicher-Bucket erstellen

```
async function createBucket() {
    try {
        const response = await rustfs_client.send(new CreateBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```

## Speicher-Bucket löschen

```
async function deleteBucket() {
    try {
        const response = await rustfs_client.send(new DeleteBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```

## Objekt hochladen

```
async function uploadObject() {
    try {
        const response = await rustfs_client.send(new PutObjectCommand({
            Bucket: "my-bucket",
            Key: "my-object",
            Body: "Hello, RustFS!",
        }));
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```

## Objekt herunterladen

```
async function downloadObject() {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "my-bucket",
            Key: "my-object",
        }));
        const body = await response.Body?.transformToString();
        console.log(body);
    } catch (error) {
        console.log(error);
    }
}
```

## Objekt löschen

```
async function deleteObject() {
    try {
        const response = await rustfs_client.send(new DeleteObjectCommand({
            Bucket: "my-bucket",
            Key: "my-object",
        }));
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```

## Objekte auflisten

```
async function listObjects() {
    try {
        const response = await rustfs_client.send(new ListObjectsV2Command({
            Bucket: "my-bucket",
        }));
        console.log(response.Contents);
    } catch (error) {
        console.log(error);
    }
}
```

## Presigned URL generieren

```
async function generatePresignedUrl() {
    try {
        const command = new GetObjectCommand({
            Bucket: "my-bucket",
            Key: "my-object",
        });
        const url = await getSignedUrl(rustfs_client, command, { expiresIn: 3600 });
        console.log(url);
    } catch (error) {
        console.log(error);
    }
}
```

## Fehlerbehandlung

```
async function handleErrors() {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "non-existent-bucket",
            Key: "non-existent-object",
        }));
    } catch (error) {
        if (error instanceof NoSuchBucket) {
            console.log("Bucket existiert nicht");
        } else if (error instanceof NoSuchKey) {
            console.log("Objekt existiert nicht");
        } else {
            console.log("Unbekannter Fehler:", error);
        }
    }
}
```

## Vollständiges Beispiel

```
import { S3Client, CreateBucketCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteBucketCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const rustfs_client = new S3Client({
    region: "cn-east-1",
    credentials: {
        accessKeyId: process.env.RUSTFS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.RUSTFS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.RUSTFS_ENDPOINT_URL!,
});

async function main() {
    try {
        // Bucket erstellen
        await rustfs_client.send(new CreateBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket erstellt");

        // Objekt hochladen
        await rustfs_client.send(new PutObjectCommand({
            Bucket: "my-bucket",
            Key: "my-object",
            Body: "Hello, RustFS!",
        }));
        console.log("Objekt hochgeladen");

        // Objekt herunterladen
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "my-bucket",
            Key: "my-object",
        }));
        const body = await response.Body?.transformToString();
        console.log("Objekt-Inhalt:", body);

        // Objekt löschen
        await rustfs_client.send(new DeleteObjectCommand({
            Bucket: "my-bucket",
            Key: "my-object",
        }));
        console.log("Objekt gelöscht");

        // Bucket löschen
        await rustfs_client.send(new DeleteBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket gelöscht");
    } catch (error) {
        console.error("Fehler:", error);
    }
}

main();
```

## Zusammenfassung

Dieses Tutorial hat gezeigt, wie Sie:

1. RustFS TypeScript SDK konfigurieren
2. Speicher-Buckets erstellen und löschen
3. Objekte hochladen, herunterladen und löschen
4. Objekte auflisten
5. Presigned URLs generieren
6. Fehlerbehandlung implementieren

RustFS ist vollständig kompatibel mit dem AWS S3 SDK, sodass Sie alle Standard-S3-Operationen mit TypeScript verwenden können. Weitere Informationen finden Sie in der [AWS SDK für JavaScript v3 Dokumentation](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/).
