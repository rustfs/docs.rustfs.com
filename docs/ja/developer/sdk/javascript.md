---
title: "JavaScript SDK"
description: "この文書は主にRustFSでのJavaScript SDKの使用について説明します。"
---

以下は**RustFSでのAWS S3 JS SDK使用の完全な開発ドキュメント**で、SDK インストール、初期化設定、基本操作（アップロード、ダウンロード、削除、一覧表示）、事前署名URLとマルチパートアップロードなどを含み、Node.js環境に適用されます。

# RustFS AWS S3 JS SDK ドキュメント（Node.js用）

## I. 概要

RustFSはS3プロトコル互換のオブジェクトストレージシステムで、AWSの公式JavaScript SDK（v3）を通じてアクセスできます。このガイドでは、JSを使用してRustFSに接続し、一般的なオブジェクトストレージ操作を実行する方法を説明します。

## II. 準備

### 2.1 SDK インストール

NPMで必要なAWS SDK v3モジュールをインストール：

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 RustFS 設定例

RustFSインスタンスが以下のようにデプロイされているとします：

```
Endpoint: http://192.168.1.100:9000
Access Key: rustfsadmin
Secret Key: rustfssecret
```

---

## III. S3クライアント初期化

```js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000", // RustFS endpoint
 region: "us-east-1", // 任意に入力可能
 credentials: {
 accessKeyId: "rustfsadmin",
 secretAccessKey: "rustfssecret",
 },
 forcePathStyle: true, // RustFS互換性のため有効化必須
 requestHandler: new NodeHttpHandler({
 connectionTimeout: 3000,
 socketTimeout: 5000,
 }),
});
```

---

## IV. 基本操作

### 4.1 バケット作成

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("バケット作成完了");
```

---

### 4.2 オブジェクトアップロード

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

console.log("ファイルアップロード完了");
```

---

### 4.3 オブジェクトダウンロード

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

console.log("ファイルダウンロード完了");
```

---

### 4.4 オブジェクト一覧

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

---

### 4.5 オブジェクト削除

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("ファイル削除完了");
```

---

## V. 高度な機能

### 5.1 事前署名URL生成

> フロントエンドやサードパーティが一時的なリンクでファイルをアップロード/ダウンロードできるようにします

#### ダウンロード（GET）

```js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const url = await getSignedUrl(
 s3,
 new GetObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }),
 { expiresIn: 600 }
);

console.log("事前署名GET URL:", url);
```

#### アップロード（PUT）

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(
 s3,
 new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
 { expiresIn: 600 }
);

console.log("事前署名PUT URL:", url);
```

---

### 5.2 マルチパートアップロード

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

// 1. アップロードタスク作成
const createRes = await s3.send(
 new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. セグメント化アップロード
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

// 3. アップロード完了
await s3.send(
 new CompleteMultipartUploadCommand({
 Bucket: bucket,
 Key: key,
 UploadId: uploadId,
 MultipartUpload: { Parts: parts },
 })
);

console.log("マルチパートアップロード完了");
```

---

## VI. 一般的な問題と注意事項

| 問題 | 原因 | 解決方法 |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | 署名バージョン間違い | JS SDK v3はデフォルトでv4を使用、RustFSがv4をサポートしていることを確認 |
| EndpointConnectionError | エンドポイントアドレス設定間違いまたは未起動 | RustFSアドレスにアクセス可能か確認 |
| NoSuchKey | ファイルが存在しない | `Key`のスペルが正しいか確認 |
| InvalidAccessKeyId / Secret | 認証情報設定間違い | `accessKeyId` / `secretAccessKey`設定を確認 |
| アップロード失敗（パス問題） | Path-styleが無効 | `forcePathStyle: true`を設定 |

---

## VII. 付録：フロントエンドアップロード対応

事前署名URLを使用することで、ブラウザがAccessKeyを渡すことなく直接ファイルをアップロードできます。

フロントエンド（HTML+JS）アップロード例：

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

 if (res.ok) alert("アップロード完了！");
 });
</script>
```

