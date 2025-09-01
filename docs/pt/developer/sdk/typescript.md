---
title: "TypeScript SDK"
description: "Este documento explica principalmente o uso do TypeScript SDK no RustFS."
---

# TypeScript Rust SDK

Como o RustFS é um sistema de armazenamento de objetos totalmente compatível com S3, é possível construir um TypeScript SDK adequado para RustFS envolvendo o S3 TypeScript SDK. Através do SDK, as operações do RustFS podem ser executadas, incluindo criação e exclusão de buckets/objetos, bem como upload e download de arquivos.

## Pré-requisitos

- Uma instância RustFS disponível (consulte o [Guia de Instalação](../../installation/index.md) para instalação).
- Chaves de acesso (consulte [Gerenciamento de Chave de Acesso](../../administration/iam/access-token.md) para criação).

## Construção do RustFS TypeScript SDK

Com a ajuda do S3Client do TypeScript, use `region`, `access_key_id`, `secret_access_key` e `endpoint_url` para construir um cliente RustFS:

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

Em seguida, use o `rustfs_client` construído para executar as operações correspondentes.

## Criar Bucket

```typescript
async function createBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new CreateBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket criado com sucesso:", response);
    } catch (error) {
        console.error("Erro ao criar bucket:", error);
    }
}
```

## Excluir Bucket

```typescript
async function deleteBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new DeleteBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("Bucket excluído com sucesso:", response);
    } catch (error) {
        console.error("Erro ao excluir bucket:", error);
    }
}
```

## Listar Buckets

```typescript
async function listBuckets(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListBucketsCommand({}));
        console.log("Buckets disponíveis:");
        response.Buckets?.forEach(bucket => {
            console.log(`- ${bucket.Name} (criado: ${bucket.CreationDate})`);
        });
    } catch (error) {
        console.error("Erro ao listar buckets:", error);
    }
}
```

## Listar Objetos

```typescript
async function listObjects(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListObjectsV2Command({
            Bucket: "my-bucket",
        }));
        console.log("Objetos no bucket:");
        response.Contents?.forEach(obj => {
            console.log(`- ${obj.Key} (${obj.Size} bytes, ${obj.LastModified})`);
        });
    } catch (error) {
        console.error("Erro ao listar objetos:", error);
    }
}
```

## Fazer Upload de Arquivo

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
        console.log("Arquivo enviado com sucesso:", response.ETag);
    } catch (error) {
        console.error("Erro ao enviar arquivo:", error);
    }
}
```

## Baixar Objeto

```typescript
async function getObject(): Promise<void> {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "my-bucket",
            Key: "uploaded-file.txt",
        }));
        
        // Obter conteúdo do objeto
        if (response.Body) {
            const chunks: Buffer[] = [];
            const stream = response.Body as NodeJS.ReadableStream;
            
            for await (const chunk of stream) {
                chunks.push(chunk as Buffer);
            }
            
            const data = Buffer.concat(chunks).toString("utf-8");
            console.log("Conteúdo do objeto:", data);
        }
    } catch (error) {
        console.error("Erro ao baixar objeto:", error);
    }
}
```

## Uso Adicional

Para outros usos, você pode explorar por conta própria. Com TypeScript, você obtém segurança de tipo completa e suporte IntelliSense para todas as operações do RustFS. O SDK também suporta recursos avançados como:

- URLs pré-assinadas para acesso temporário
- Uploads multipartes para arquivos grandes
- Políticas de bucket e gerenciamento de ACL
- Metadados e tags de objetos

Todos esses recursos podem ser usados através das interfaces TypeScript padrão do AWS SDK v3.
