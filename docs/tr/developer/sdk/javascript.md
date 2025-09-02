---
title: "RustFS JavaScript SDK"
description: "Bu makale RustFS'de JavaScript SDK kullanımını açıklar."
---

Aşağıda **RustFS ile AWS S3 JS SDK kullanımı** için yazılan eksiksiz geliştirme dokümantasyonu bulunmaktadır. İçerik SDK kurulumu, başlatma yapılandırması, temel işlemler (yükleme, indirme, silme, listeleme), önceden imzalı URL ve parçalı yükleme gibi işlevleri kapsar ve Node.js ortamı için uygundur.

# RustFS ile AWS S3 JS SDK Dokümantasyonu (Node.js için uygulanabilir)

## Bir. Genel Bakış

RustFS, S3 protokolü uyumlu bir nesne depolama sistemidir ve AWS resmi JavaScript SDK (v3) aracılığıyla erişilebilir. Bu rehber, JS kullanarak RustFS'e nasıl bağlanacağınızı ve yaygın nesne depolama işlemlerini nasıl gerçekleştireceğinizi gösterecektir.

## İki. Hazırlık Çalışması

### 2.1 SDK Kurulumu

NPM kullanarak AWS SDK v3 gerekli modüllerini kurun:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2.2 RustFS Örnek Yapılandırması

RustFS örneğinin aşağıdaki şekilde dağıtıldığını varsayın:

```
Endpoint: http://192.168.1.100:9000
Access Key: rustfsadmin
Secret Key: rustfssecret
```

---

## Üç. S3 İstemcisini Başlatma

```js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const s3 = new S3Client({
 endpoint: "http://192.168.1.100:9000", // RustFS endpoint
 region: "us-east-1", // İsteğe bağlı olarak doldurulabilir
 credentials: {
 accessKeyId: "rustfsadmin",
 secretAccessKey: "rustfssecret",
 },
 forcePathStyle: true, // RustFS uyumluluğu için Path-style'ı etkinleştirmek gereklidir
 requestHandler: new NodeHttpHandler({
 connectionTimeout: 3000,
 socketTimeout: 5000,
 }),
});
```

---

## Dört. Temel İşlemler

### 4.1 Bucket Oluşturma

```js
import { CreateBucketCommand } from "@aws-sdk/client-s3";

await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
console.log("Bucket created");
```

---

### 4.2 Nesne Yükleme

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

console.log("File uploaded");
```

---

### 4.3 Nesne İndirme

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

---

### 4.4 Nesneleri Listeleme

```js
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const res = await s3.send(new ListObjectsV2Command({ Bucket: "my-bucket" }));
res.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
```

---

### 4.5 Nesne Silme

```js
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new DeleteObjectCommand({ Bucket: "my-bucket", Key: "hello.txt" }));
console.log("File deleted");
```

---

## Beş. Gelişmiş Özellikler

### 5.1 Önceden İmzalı URL Oluşturma

> Frontend veya üçüncü taraf kullanıcıların geçici bağlantı kullanarak dosya yüklemesi/indirmesi yapmasına olanak tanır

#### İndirme (GET)

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

#### Yükleme (PUT)

```js
import { PutObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(
 s3,
 new PutObjectCommand({ Bucket: "my-bucket", Key: "upload.txt" }),
 { expiresIn: 600 }
);

console.log("Presigned PUT URL:", url);
```

---

### 5.2 Parçalı Yükleme (Multipart Upload)

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

// 1. Yükleme görevi oluştur
const createRes = await s3.send(
 new CreateMultipartUploadCommand({ Bucket: bucket, Key: key })
);
const uploadId = createRes.UploadId;

// 2. Parçalı yükleme
import { statSync, openSync, readSync } from "fs";

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

// 3. Yüklemeyi tamamla
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

---

## Altı. Yaygın Sorunlar ve Dikkat Edilecek Hususlar

| Sorun | Sebep | Çözüm |
| --------------------------- | -------------------- | --------------------------------------- |
| SignatureDoesNotMatch | İmza sürümü hatası | JS SDK v3 varsayılan olarak v4 kullanır, RustFS'in v4 desteklediğinden emin olun |
| EndpointConnectionError | Endpoint adres yapılandırması yanlış veya başlatılmamış | RustFS adresinin erişilebilir olup olmadığını kontrol edin |
| NoSuchKey | Dosya mevcut değil | `Key`'in doğru yazıldığını kontrol edin |
| InvalidAccessKeyId / Secret | Kimlik bilgisi yapılandırması hatası | `accessKeyId` / `secretAccessKey` yapılandırmasını kontrol edin |
| Yükleme başarısız (yol sorunu) | Path-style etkinleştirilmemiş | `forcePathStyle: true` ayarlayın |

---

## Yedi. Ek: Frontend Yükleme Uyumluluğu

Önceden imzalı URL kullanarak tarayıcının doğrudan dosya yüklemesine olanak tanır, AccessKey'i iletmeye gerek yoktur.

Frontend (HTML+JS) yükleme örneği:

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