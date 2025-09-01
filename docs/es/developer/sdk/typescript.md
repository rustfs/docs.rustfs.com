---
title: "SDK TypeScript"
description: "Este documento explica principalmente el uso del SDK TypeScript en RustFS."
---

# TypeScript Rust SDK

Ya que RustFS es un sistema de almacenamiento de objetos completamente compatible con S3, es posible construir un SDK TypeScript adecuado para RustFS mediante algunos wrappers del SDK TypeScript de S3. A través del SDK se pueden realizar operaciones de RustFS, incluyendo creación y eliminación de buckets/objetos, así como subida y descarga de archivos.

## Prerrequisitos

- Una instancia RustFS disponible (consulte la [guía de instalación](../../installation/index.md) para la instalación).
- Claves de acceso (consulte la [gestión de claves de acceso](../../administration/iam/access-token.md) para la creación).

## Construcción del SDK TypeScript RustFS

Con la ayuda del S3Client de TypeScript, use `region`, `access_key_id`, `secret_access_key` y `endpoint_url` para construir un cliente RustFS:

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

Luego use el `rustfs_client` construido para realizar las operaciones correspondientes.

## Crear bucket

```typescript
async function createBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new CreateBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket creado exitosamente:", response);
    } catch (error) {
        console.error("Error al crear el bucket:", error);
    }
}
```

## Eliminar bucket

```typescript
async function deleteBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new DeleteBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket eliminado exitosamente:", response);
    } catch (error) {
        console.error("Error al eliminar el bucket:", error);
    }
}
```

## Listar buckets

```typescript
async function listBuckets(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListBucketsCommand({}));
        console.log("Buckets disponibles:");
        response.Buckets?.forEach(bucket => {
            console.log(`- ${bucket.Name} (creado: ${bucket.CreationDate})`);
        });
    } catch (error) {
        console.error("Error al listar buckets:", error);
    }
}
```

## Listar objetos

```typescript
async function listObjects(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListObjectsV2Command({
            Bucket: "my-bucket",
        }));
        console.log("Objetos en el bucket:");
        response.Contents?.forEach(obj => {
            console.log(`- ${obj.Key} (${obj.Size} bytes, ${obj.LastModified})`);
        });
    } catch (error) {
        console.error("Error al listar objetos:", error);
    }
}
```

## Subir archivo

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
        console.log("Archivo subido exitosamente:", response.ETag);
    } catch (error) {
        console.error("Error al subir archivo:", error);
    }
}
```

## Descargar objeto

```typescript
async function getObject(): Promise<void> {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "my-bucket",
            Key: "uploaded-file.txt",
        }));
        
        // Obtener contenido del objeto
        if (response.Body) {
            const chunks: Buffer[] = [];
            const stream = response.Body as NodeJS.ReadableStream;
            
            for await (const chunk of stream) {
                chunks.push(chunk as Buffer);
            }
            
            const data = Buffer.concat(chunks).toString("utf-8");
            console.log("Contenido del objeto:", data);
        }
    } catch (error) {
        console.error("Error al descargar objeto:", error);
    }
}
```

## Uso adicional

Para otros usos, puede explorar por sí mismo. Con TypeScript obtiene seguridad de tipos completa y soporte IntelliSense para todas las operaciones de RustFS. El SDK también soporta funcionalidades avanzadas como:

- URLs prefirmadas para acceso temporal
- Subidas multipart para archivos grandes
- Políticas de bucket y gestión ACL
- Metadatos de objeto y etiquetas

Todas estas funcionalidades pueden ser utilizadas a través de las interfaces TypeScript estándar de AWS SDK v3.

