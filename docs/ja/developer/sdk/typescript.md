---
title: "TypeScript SDK"
description: "この文書は主にRustFSでのTypeScript SDKの使用について説明します。"
---

# TypeScript Rust SDK

RustFSはS3完全互換のオブジェクトストレージシステムであるため、S3のTypeScript SDKをラッピングすることでRustFSに適したTypeScript SDKを構築できます。SDKを通じてRustFSの操作を実行でき、バケット/オブジェクトの作成と削除、ファイルのアップロードとダウンロードなどが含まれます。

## 前提条件

- 使用可能なRustFSインスタンス（インストールについては[インストールガイド](../../installation/index.md)を参照）。
- アクセスキー（作成については[アクセスキー管理](../../administration/iam/access-token.md)を参照）。

## RustFS TypeScript SDK 構築

TypeScriptのS3Clientを使用し、`region`、`access_key_id`、`secret_access_key`、`endpoint_url`を使用してRustFSクライアントを構築します：

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

続いて、構築した`rustfs_client`を使用して対応する操作を実行します。

## バケット作成

```typescript
async function createBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new CreateBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("バケットが正常に作成されました:", response);
    } catch (error) {
        console.error("バケット作成エラー:", error);
    }
}
```

## バケット削除

```typescript
async function deleteBucket(): Promise<void> {
    try {
        const response = await rustfs_client.send(new DeleteBucketCommand({
            Bucket: "my-bucket",
        }));
        console.log("バケットが正常に削除されました:", response);
    } catch (error) {
        console.error("バケット削除エラー:", error);
    }
}
```

## バケット一覧

```typescript
async function listBuckets(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListBucketsCommand({}));
        console.log("利用可能なバケット:");
        response.Buckets?.forEach(bucket => {
            console.log(`- ${bucket.Name} (作成日: ${bucket.CreationDate})`);
        });
    } catch (error) {
        console.error("バケット一覧エラー:", error);
    }
}
```

## オブジェクト一覧

```typescript
async function listObjects(): Promise<void> {
    try {
        const response = await rustfs_client.send(new ListObjectsV2Command({
            Bucket: "my-bucket",
        }));
        console.log("バケット内のオブジェクト:");
        response.Contents?.forEach(obj => {
            console.log(`- ${obj.Key} (${obj.Size} bytes, ${obj.LastModified})`);
        });
    } catch (error) {
        console.error("オブジェクト一覧エラー:", error);
    }
}
```

## ファイルアップロード

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
        console.log("ファイルのアップロードが成功しました:", response.ETag);
    } catch (error) {
        console.error("ファイルアップロードエラー:", error);
    }
}
```

## オブジェクトダウンロード

```typescript
async function getObject(): Promise<void> {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "my-bucket",
            Key: "uploaded-file.txt",
        }));
        
        // オブジェクトの内容を取得
        if (response.Body) {
            const chunks: Buffer[] = [];
            const stream = response.Body as NodeJS.ReadableStream;
            
            for await (const chunk of stream) {
                chunks.push(chunk as Buffer);
            }
            
            const data = Buffer.concat(chunks).toString("utf-8");
            console.log("オブジェクトの内容:", data);
        }
    } catch (error) {
        console.error("オブジェクトダウンロードエラー:", error);
    }
}
```

## その他の使用

その他の使用については、自由に探索することができます。TypeScriptでは、すべてのRustFS操作に対して完全な型安全性とIntelliSenseサポートを得られます。SDKは次のような高度な機能もサポートしています：

- 一時的アクセス用の事前署名URL
- 大きなファイル用のマルチパートアップロード
- バケットポリシーとACL管理
- オブジェクトのメタデータとタグ

これらの機能はすべて、標準のAWS SDK v3 TypeScriptインターフェースを通じて使用できます。

