---
title: "RustFS TypeScript SDK Kullanım Kılavuzu"
description: "TypeScript SDK aracılığıyla RustFS örneğini çalıştırın, bucket'lar ve nesnelerin oluşturulması ve silinmesi dahil."
---

# TypeScript Rust SDK

RustFS tamamen S3 uyumlu bir nesne depolama sistemi olduğundan, S3'ün TypeScript SDK'sını sarmalayarak RustFS için uygun TypeScript SDK'sını oluşturabilir ve SDK aracılığıyla RustFS'yi çalıştırabilirsiniz; bucket/nesne oluşturma ve silme, dosya yükleme ve indirme vb. işlemleri yapabilirsiniz.

## Ön Koşullar

- Kullanılabilir bir RustFS örneği ([Kurulum Kılavuzu](../../installation/index.md)'na başvurarak kurulum yapabilirsiniz).
- Erişim anahtarı ([Erişim Anahtarı Yönetimi](../../administration/iam/access-token.md)'ne başvurarak oluşturabilirsiniz).

## RustFS TypeScript SDK Oluşturma

TypeScript'in S3Client'ını kullanarak, `region`, `access_key_id`, `secret_access_key` ve `endpoint_url` ile bir RustFS istemcisi oluşturun:

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

Ardından oluşturulan `rustfs_client`'ı kullanarak ilgili işlemleri gerçekleştirin.

## Bucket Oluşturma

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

## Bucket Silme

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

## Bucket'ları Listeleme

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

## Nesneleri Listeleme

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

## Dosya Yükleme

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

## Nesne İndirme

```
async function getObject() {
    try {
        const response = await rustfs_client.send(new GetObjectCommand({
            Bucket: "rust-sdk-demo",
            Key: "1.txt",
        }));
        
        // nesne içeriği al
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

Diğer kullanımları kendiniz keşfedebilirsiniz; Vibe Coding yardımıyla daha da basit olur!