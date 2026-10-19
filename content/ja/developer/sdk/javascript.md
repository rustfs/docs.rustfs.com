---
title: "JavaScript"
description: "公式の AWS SDK for JavaScript v3 を RustFS で使います。"
---

## 概要

RustFS は独自の JavaScript SDK を提供していません。S3 互換であるため、公式の AWS SDK for JavaScript（v3）を、RustFS サーバーを指すように設定して使います。このガイドでは、RustFS への接続と、オブジェクトストレージの一般的な操作を説明します。

## 前提条件

* Node.js 18 以降
* 稼働している RustFS インスタンス（[インストールガイド](../../installation/index.md)を参照）。S3 API はポート `9000`、Console はポート `9001` で待ち受けます
* インストール時に環境変数 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` で設定するアクセスキー（[アクセスキーの管理](../../security-compliance/iam/access-token.md)を参照）

:::tip[ローカル検証]

インストール時に認証情報を設定しなかった場合、サーバーの既定値は `rustfsadmin` / `rustfsadmin` です。使い捨てのローカル検証であれば問題ありませんが、外部から到達できる環境では使わないでください。

:::

### SDK のインストール

npm で、必要な AWS SDK v3 のモジュールをインストールします。

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

以下の例は ES modules（`import`）を使います。`package.json` に `"type": "module"` を設定するか、ファイルの拡張子を `.mjs` にします。

---

## クライアントの初期化

次のスクリプトは、そのまま実行できます。RustFS が別のマシンで動作している場合は `localhost` をサーバーの IP アドレスに置き換え、アクセスキーも自分の値にします。

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

実行します。

```bash
node main.mjs
```

```text
[ 'my-bucket' ]
```

以下のコード片は、すべてこの `s3` クライアントを再利用します。

---

## 基本操作

### 4.1 バケットの作成

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket created");
```

```text
Bucket created
```

---

### 4.2 オブジェクトのアップロード

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

### 4.3 オブジェクトのダウンロード

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

### 4.4 オブジェクトの一覧

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

```text
hello.txt (12 bytes)
```

---

### 4.5 オブジェクトの削除

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("File deleted");
```

```text
File deleted
```

---

## 高度な機能

### 5.1 署名付き URL の生成

署名付き URL を使うと、ブラウザーのクライアントや第三者が、一時的なリンク経由でオブジェクトをアップロードまたはダウンロードできます。

#### ダウンロード（GET）

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

#### アップロード（PUT）

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

### 5.2 マルチパートアップロード

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

## トラブルシューティング

| 問題 | 原因 | 対処 |
| --- | --- | --- |
| SignatureDoesNotMatch | 署名の不一致 | SDK v3 は既定で SigV4 による署名を行います。認証情報、リージョン、エンドポイントを確認します |
| EndpointConnectionError | エンドポイントのアドレス設定が誤っているか、サービスが起動していない | RustFS のアドレスへ到達できるか確認します |
| NoSuchKey | オブジェクトが存在しない | `Key` の綴りが正しいか確認します |
| InvalidAccessKeyId / Secret | 認証情報の設定が誤っている | `accessKeyId` / `secretAccessKey` の設定を確認します |
| アップロードの失敗（パスの問題） | パススタイルアクセスが有効になっていない | `forcePathStyle: true` を設定します |

---

## 付録: ブラウザーからのアップロード

署名付き URL を使うと、ブラウザーは認証情報を持たずにオブジェクトを直接アップロードできます。

フロントエンド（HTML と JS）のアップロード例:

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

オブジェクトのタグ付けやバケットポリシーなどの操作については、[AWS SDK for JavaScript v3 のドキュメント](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)を参照します。ほとんどの S3 操作は、RustFS に対しても同じように動作します。例外は [S3 互換性](/ja/reference/s3-compatibility) を参照します。
