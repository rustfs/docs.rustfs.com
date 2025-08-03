---
title: "JS SDK"
description: "この記事では、RustFS での JS SDK の使用について主に説明します。"
---

以下は **RustFS で AWS S3 JS SDK を使用する**ための完全な開発ドキュメントで、SDK インストール、初期化設定、基本操作（アップロード、ダウンロード、削除、列挙）、事前署名 URL、マルチパートアップロードなどの機能を含み、Node.js 環境に適用されます。

---

# RustFS で AWS S3 JS SDK を使用するドキュメント（Node.js 用）

## 一、概要

RustFS は S3 プロトコル互換のオブジェクトストレージシステムで、AWS 公式 JavaScript SDK（v3）を通じてアクセスできます。このガイドでは、JS を使用して RustFS に接続し、一般的なオブジェクトストレージ操作を実行する方法を説明します。

---

## 二、準備作業

### 2.1 SDK インストール

NPM を使用して AWS SDK v3 の必要なモジュールをインストール：

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 RustFS サンプル設定

RustFS インスタンスが以下のようにデプロイされていると仮定：

```
Endpoint: http://192.168.1.100:9000
Access Key: rustfsadmin
Secret Key: rustfssecret
```

---

## 三、S3 クライアント初期化

```javascript
import { S3Client } from "@aws-sdk/client-s3";

// RustFS 接続設定
const ENDPOINT = "http://192.168.1.100:9000";
const ACCESS_KEY = "rustfsadmin";
const SECRET_KEY = "rustfssecret";

// S3 クライアント作成
const s3Client = new S3Client({
    endpoint: ENDPOINT,
    region: "us-east-1", // 任意のリージョン名
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
    },
    forcePathStyle: true, // RustFS では必須
});

console.log("RustFS 接続成功！");
```

---

## 四、バケット操作

### 4.1 バケット作成

```javascript
import { CreateBucketCommand } from "@aws-sdk/client-s3";

async function createBucket(bucketName) {
    try {
        const command = new CreateBucketCommand({
            Bucket: bucketName,
        });
        
        const response = await s3Client.send(command);
        console.log(`バケット '${bucketName}' 作成成功`);
        return response;
    } catch (error) {
        console.error("バケット作成エラー:", error);
        throw error;
    }
}

// 使用例
await createBucket("my-test-bucket");
```

### 4.2 バケット一覧

```javascript
import { ListBucketsCommand } from "@aws-sdk/client-s3";

async function listBuckets() {
    try {
        const command = new ListBucketsCommand({});
        const response = await s3Client.send(command);
        
        console.log("存在するバケット:");
        response.Buckets?.forEach(bucket => {
            console.log(`  - ${bucket.Name} (作成日: ${bucket.CreationDate})`);
        });
        
        return response.Buckets;
    } catch (error) {
        console.error("バケット一覧取得エラー:", error);
        throw error;
    }
}

// 使用例
await listBuckets();
```

### 4.3 バケット削除

```javascript
import { DeleteBucketCommand } from "@aws-sdk/client-s3";

async function deleteBucket(bucketName) {
    try {
        const command = new DeleteBucketCommand({
            Bucket: bucketName,
        });
        
        const response = await s3Client.send(command);
        console.log(`バケット '${bucketName}' 削除成功`);
        return response;
    } catch (error) {
        console.error("バケット削除エラー:", error);
        throw error;
    }
}

// 使用例
await deleteBucket("my-test-bucket");
```

---

## 五、オブジェクト操作

### 5.1 オブジェクトアップロード

```javascript
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

// テキストアップロード
async function uploadText(bucketName, objectKey, textContent) {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            Body: textContent,
            ContentType: "text/plain",
        });
        
        const response = await s3Client.send(command);
        console.log(`テキスト '${objectKey}' アップロード成功`);
        return response;
    } catch (error) {
        console.error("テキストアップロードエラー:", error);
        throw error;
    }
}

// ファイルアップロード
async function uploadFile(bucketName, objectKey, filePath) {
    try {
        const fileContent = fs.readFileSync(filePath);
        
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            Body: fileContent,
        });
        
        const response = await s3Client.send(command);
        console.log(`ファイル '${filePath}' を '${objectKey}' としてアップロード成功`);
        return response;
    } catch (error) {
        console.error("ファイルアップロードエラー:", error);
        throw error;
    }
}

// 使用例
await uploadText("my-bucket", "hello.txt", "Hello, RustFS!");
await uploadFile("my-bucket", "data/file.txt", "/local/path/file.txt");
```

### 5.2 オブジェクトダウンロード

```javascript
import { GetObjectCommand } from "@aws-sdk/client-s3";

async function downloadObject(bucketName, objectKey) {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });
        
        const response = await s3Client.send(command);
        
        // ストリームを文字列に変換
        const str = await response.Body.transformToString();
        console.log(`オブジェクト '${objectKey}' 内容:`, str);
        
        return str;
    } catch (error) {
        console.error("オブジェクトダウンロードエラー:", error);
        throw error;
    }
}

// ファイルに保存
async function downloadToFile(bucketName, objectKey, savePath) {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });
        
        const response = await s3Client.send(command);
        const buffer = Buffer.from(await response.Body.transformToByteArray());
        
        fs.writeFileSync(savePath, buffer);
        console.log(`オブジェクト '${objectKey}' を '${savePath}' に保存成功`);
    } catch (error) {
        console.error("ファイル保存エラー:", error);
        throw error;
    }
}

// 使用例
await downloadObject("my-bucket", "hello.txt");
await downloadToFile("my-bucket", "data/file.txt", "/local/downloaded/file.txt");
```

### 5.3 オブジェクト削除

```javascript
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

async function deleteObject(bucketName, objectKey) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });
        
        const response = await s3Client.send(command);
        console.log(`オブジェクト '${objectKey}' 削除成功`);
        return response;
    } catch (error) {
        console.error("オブジェクト削除エラー:", error);
        throw error;
    }
}

// 使用例
await deleteObject("my-bucket", "hello.txt");
```

### 5.4 オブジェクト一覧

```javascript
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

async function listObjects(bucketName, prefix = "") {
    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefix,
        });
        
        const response = await s3Client.send(command);
        
        console.log(`バケット '${bucketName}' 内のオブジェクト:`);
        response.Contents?.forEach(obj => {
            console.log(`  - ${obj.Key} (サイズ: ${obj.Size}, 更新日: ${obj.LastModified})`);
        });
        
        return response.Contents;
    } catch (error) {
        console.error("オブジェクト一覧取得エラー:", error);
        throw error;
    }
}

// 使用例
await listObjects("my-bucket");
await listObjects("my-bucket", "data/"); // 'data/' プレフィックスのオブジェクトのみ
```

---

## 六、高度な機能

### 6.1 事前署名 URL 生成

```javascript
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

// ダウンロード用事前署名 URL
async function generateDownloadUrl(bucketName, objectKey, expiresIn = 3600) {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });
        
        const url = await getSignedUrl(s3Client, command, { expiresIn });
        console.log(`ダウンロード URL: ${url}`);
        return url;
    } catch (error) {
        console.error("ダウンロード URL 生成エラー:", error);
        throw error;
    }
}

// アップロード用事前署名 URL
async function generateUploadUrl(bucketName, objectKey, expiresIn = 3600) {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });
        
        const url = await getSignedUrl(s3Client, command, { expiresIn });
        console.log(`アップロード URL: ${url}`);
        return url;
    } catch (error) {
        console.error("アップロード URL 生成エラー:", error);
        throw error;
    }
}

// 使用例
await generateDownloadUrl("my-bucket", "hello.txt", 3600);
await generateUploadUrl("my-bucket", "new-file.txt", 1800);
```

### 6.2 マルチパートアップロード

```javascript
import {
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand
} from "@aws-sdk/client-s3";

async function multipartUpload(bucketName, objectKey, filePath) {
    let uploadId;
    
    try {
        // マルチパートアップロード開始
        const createCommand = new CreateMultipartUploadCommand({
            Bucket: bucketName,
            Key: objectKey,
        });
        
        const createResponse = await s3Client.send(createCommand);
        uploadId = createResponse.UploadId;
        console.log(`マルチパートアップロード開始: ${uploadId}`);
        
        // ファイル読み取りと分割
        const fileBuffer = fs.readFileSync(filePath);
        const partSize = 5 * 1024 * 1024; // 5MB
        const parts = [];
        
        let partNumber = 1;
        for (let start = 0; start < fileBuffer.length; start += partSize) {
            const end = Math.min(start + partSize, fileBuffer.length);
            const partData = fileBuffer.slice(start, end);
            
            const uploadCommand = new UploadPartCommand({
                Bucket: bucketName,
                Key: objectKey,
                PartNumber: partNumber,
                UploadId: uploadId,
                Body: partData,
            });
            
            const uploadResponse = await s3Client.send(uploadCommand);
            parts.push({
                ETag: uploadResponse.ETag,
                PartNumber: partNumber,
            });
            
            console.log(`パート ${partNumber} アップロード完了`);
            partNumber++;
        }
        
        // マルチパートアップロード完了
        const completeCommand = new CompleteMultipartUploadCommand({
            Bucket: bucketName,
            Key: objectKey,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: parts,
            },
        });
        
        const completeResponse = await s3Client.send(completeCommand);
        console.log(`マルチパートアップロード完了: ${objectKey}`);
        return completeResponse;
        
    } catch (error) {
        console.error("マルチパートアップロードエラー:", error);
        
        // エラー発生時はアップロードを中止
        if (uploadId) {
            try {
                const abortCommand = new AbortMultipartUploadCommand({
                    Bucket: bucketName,
                    Key: objectKey,
                    UploadId: uploadId,
                });
                await s3Client.send(abortCommand);
                console.log("マルチパートアップロード中止");
            } catch (abortError) {
                console.error("アップロード中止エラー:", abortError);
            }
        }
        
        throw error;
    }
}

// 使用例
await multipartUpload("my-bucket", "large-file.zip", "/path/to/large-file.zip");
```

---

## 七、エラーハンドリング

```javascript
import { HeadObjectCommand } from "@aws-sdk/client-s3";

async function checkObjectExists(bucketName, objectKey) {
    try {
        const command = new HeadObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });
        
        const response = await s3Client.send(command);
        console.log(`オブジェクト '${objectKey}' 存在確認: 存在`);
        return true;
    } catch (error) {
        if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
            console.log(`オブジェクト '${objectKey}' 存在確認: 存在しない`);
            return false;
        } else {
            console.error("オブジェクト確認エラー:", error);
            throw error;
        }
    }
}

// 使用例
const exists = await checkObjectExists("my-bucket", "hello.txt");
```

---

## 八、ベストプラクティス

### 8.1 環境変数設定

```javascript
// .env ファイルを使用
import dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
    endpoint: process.env.RUSTFS_ENDPOINT,
    region: process.env.RUSTFS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.RUSTFS_ACCESS_KEY,
        secretAccessKey: process.env.RUSTFS_SECRET_KEY,
    },
    forcePathStyle: true,
});
```

### 8.2 再試行とタイムアウト設定

```javascript
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    endpoint: ENDPOINT,
    region: "us-east-1",
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
    },
    forcePathStyle: true,
    maxAttempts: 3, // 最大再試行回数
    requestTimeout: 30000, // リクエストタイムアウト（ミリ秒）
});
```

この JS SDK ガイドにより、RustFS と JavaScript アプリケーションを効果的に統合できます。

