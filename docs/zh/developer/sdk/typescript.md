---
title: "RustFS TypeScript SDK 使用指南"
description: "通过 TypeScript SDK 来对 RustFS 实例进行操作,包括存储桶、对象的创建和删除."
---

# TypeScript SDK

由于 RustFS 是完全兼容 S3 的对象存储系统，因此可以通过对 S3 的 TypeScript SDK 做一些封装来构建适用于 RustFS 的 TypeScript SDK，通过 SDK 对 RustFS 进行操作，包括存储桶/对象的创建和删除、文件的上传和下载等。

## 前提条件

- 一个可用的 RustFS 实例（可参考[安装指南](../../installation/index.md)进行安装）。
- 访问密钥（可参考[访问密钥管理](../../administration/iam/access-token.md)进行创建）。

## RustFS TypeScript SDK 构造

借助于 TypeScript 的 S3Client，使用 `region`、`access_key_id`、`secret_access_key` 以及 `endpoint_url` 构造一个 RustFS 客户端：

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

接着使用构造好的 `rustfs_client` 进行相应的操作。

## 创建存储桶

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

## 删除存储桶

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

## 列出存储桶

```
async function listBuckets() {
    try {
        const response = await rustfs_client.send(new ListBucketsCommand({}));
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```

## 列出对象

```
async function listObjects() {
    try {
        const response = await rustfs_client.send(new ListObjectsV2Command({
            Bucket: "rust-sdk-demo",
        }));
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```

## 上传文件

```
async function uploadFile() {
    try {
        const response = await rustfs_client.send(new PutObjectCommand({
            Bucket: "my-bucket",
            Key: "/test/1.txt",
            Body: fs.createReadStream("/Users/jhma/Desktop/1.txt"),
        }));
    } catch (error) {
        console.log(error);
    }
}
```

## 下载对象

```
async function getObject() {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "rust-sdk-demo",
            Key: "1.txt",
        }));

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

其他的使用，大家可以自行探索，如果借助 Vibe Coding，就更简单了！
