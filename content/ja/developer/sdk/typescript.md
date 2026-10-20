---
title: "TypeScript"
description: "AWS SDK for JavaScript v3 を使い、TypeScript から RustFS のバケットとオブジェクトを作成および削除します。"
---

RustFS は独自の TypeScript SDK を提供していません。S3 互換であるため、公式の AWS SDK for JavaScript v3（TypeScript の型定義を含みます）を、RustFS サーバーを指すように設定して使います。この SDK で、バケットの作成と削除、およびオブジェクトのアップロード、ダウンロード、削除ができます。

## 前提条件

- Node.js 18 以降（例は ES modules を使います。`package.json` に `"type": "module"` を設定します）
- 稼働している RustFS インスタンス（[インストールガイド](../../installation/index.md)を参照）。S3 API はポート `9000`、Console はポート `9001` で待ち受けます
- インストール時に環境変数 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` で設定するアクセスキー（作成方法は[アクセスキーの管理](../../security-compliance/iam/access-token.md)を参照）

:::tip[ローカル検証]

インストール時に認証情報を設定しなかった場合、サーバーの既定値は `rustfsadmin` / `rustfsadmin` です。使い捨てのローカル検証であれば問題ありませんが、外部から到達できる環境では使わないでください。

:::

依存関係をインストールします。

```bash
npm install @aws-sdk/client-s3
npm install --save-dev typescript tsx @types/node
```

## クライアントの初期化

次の例は、そのまま実行できます。RustFS が別のマシンで動作している場合は `localhost` をサーバーの IP アドレスに置き換え、アクセスキーも自分の値にします。

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

実行します。

```bash
npx tsx main.ts
```

```text
[ 'my-bucket' ]
```

以降の操作では、ここで構築した `rustfs_client` を使います。

## バケットの作成

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

## バケットの削除

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

## バケットの一覧

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

## オブジェクトの一覧

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

## ファイルのアップロード

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

## オブジェクトのダウンロード

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

署名付き URL、マルチパートアップロードなどの操作については、[AWS SDK for JavaScript v3 のドキュメント](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)を参照します。ほとんどの S3 操作は、RustFS に対しても同じように動作します。例外は [S3 互換性](/ja/reference/s3-compatibility) を参照します。
