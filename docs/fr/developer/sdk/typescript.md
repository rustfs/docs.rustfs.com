---
title: "SDK TypeScript"
description: "Ce document explique principalement l'utilisation du SDK TypeScript dans RustFS."
---

# TypeScript Rust SDK

Étant donné que RustFS est un système de stockage d'objets entièrement compatible S3, il est possible de construire un SDK TypeScript adapté à RustFS en encapsulant le SDK TypeScript S3. Grâce au SDK, les opérations RustFS peuvent être effectuées, y compris la création et suppression de buckets/objets, ainsi que le téléchargement et téléversement de fichiers.

## Prérequis

- Une instance RustFS disponible (consultez le [guide d'installation](../../installation/index.md) pour l'installation).
- Clés d'accès (consultez la [gestion des clés d'accès](../../administration/iam/access-token.md) pour la création).

## Construction du SDK TypeScript RustFS

À l'aide du S3Client TypeScript, utilisez `region`, `access_key_id`, `secret_access_key` et `endpoint_url` pour construire un client RustFS :

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

Ensuite, utilisez le `rustfs_client` construit pour effectuer les opérations correspondantes.

## Créer un bucket

```typescript
async function createBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new CreateBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket créé avec succès:", response);
    } catch (error) {
        console.error("Erreur lors de la création du bucket:", error);
    }
}
```

## Supprimer un bucket

```typescript
async function deleteBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new DeleteBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket supprimé avec succès:", response);
    } catch (error) {
        console.error("Erreur lors de la suppression du bucket:", error);
    }
}
```

## Lister les buckets

```typescript
async function listBuckets(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListBucketsCommand({}));
        console.log("Buckets disponibles:");
        response.Buckets?.forEach(bucket => {
            console.log(`- ${bucket.Name} (créé: ${bucket.CreationDate})`);
        });
    } catch (error) {
        console.error("Erreur lors de la liste des buckets:", error);
    }
}
```

## Lister les objets

```typescript
async function listObjects(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListObjectsV2Command({
            Bucket: "my-bucket",
        }));
        console.log("Objets dans le bucket:");
        response.Contents?.forEach(obj => {
            console.log(`- ${obj.Key} (${obj.Size} bytes, ${obj.LastModified})`);
        });
    } catch (error) {
        console.error("Erreur lors de la liste des objets:", error);
    }
}
```

## Téléverser un fichier

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
        console.log("Fichier téléversé avec succès:", response.ETag);
    } catch (error) {
        console.error("Erreur lors du téléversement:", error);
    }
}
```

## Télécharger un objet

```typescript
async function getObject(): Promise<void> {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "my-bucket",
            Key: "uploaded-file.txt",
        }));
        
        // Récupérer le contenu de l'objet
        if (response.Body) {
            const chunks: Buffer[] = [];
            const stream = response.Body as NodeJS.ReadableStream;
            
            for await (const chunk of stream) {
                chunks.push(chunk as Buffer);
            }
            
            const data = Buffer.concat(chunks).toString("utf-8");
            console.log("Contenu de l'objet:", data);
        }
    } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
    }
}
```

## Utilisation supplémentaire

Pour d'autres utilisations, vous pouvez explorer par vous-même. Avec TypeScript, vous obtenez une sécurité de type complète et un support IntelliSense pour toutes les opérations RustFS. Le SDK prend également en charge des fonctionnalités avancées telles que :

- URLs pré-signées pour l'accès temporaire
- Téléchargements multipart pour les gros fichiers
- Politiques de bucket et gestion ACL
- Métadonnées d'objet et tags

Toutes ces fonctionnalités peuvent être utilisées via les interfaces TypeScript standard d'AWS SDK v3.

