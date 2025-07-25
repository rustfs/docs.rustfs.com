---
title: "JavaScript SDK"
description: "Bu makale, RustFS'ta JavaScript SDK'nın kullanımını temel olarak açıklamaktadır."
---

# JavaScript SDK

RustFS, AWS S3 JavaScript SDK ile entegrasyonu destekleyen, S3 protokolüyle uyumlu bir nesne depolama sistemidir. Bu makale, RustFS ile temel nesne depolama işlemlerini gerçekleştirmek için JavaScript/Node.js'nin nasıl kullanılacağını açıklayacaktır.

## 1. Ortam Kurulumu

### 1.1 Önkoşullar

- Node.js 14+ veya modern tarayıcı ortamı
- npm veya yarn paket yöneticisi

### 1.2 AWS SDK Kurulumu

npm kullanarak:

```bash
npm install @aws-sdk/client-s3
```

yarn kullanarak:

```bash
yarn add @aws-sdk/client-s3
```

Tarayıcı ortamları için CDN de kullanılabilir:

```html
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.1.24.min.js"></script>
```

## 2. Temel Yapılandırma

### 2.1 S3 İstemcisini Başlatma (Node.js)

```javascript
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: 'http://192.168.1.100:9000', // RustFS uç noktası
  region: 'us-east-1', // Herhangi bir değer olabilir, RustFS bölgeyi doğrulamaz
  credentials: {
    accessKeyId: 'rustfsadmin',
    secretAccessKey: 'rustfssecret'
  },
  forcePathStyle: true, // RustFS için gerekli
  s3ForcePathStyle: true // Eski SDK sürümleri için
});
```

### 2.2 Tarayıcı Ortamı

```javascript
// Tarayıcı ortamı için
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'rustfsadmin',
    secretAccessKey: 'rustfssecret'
  },
  forcePathStyle: true
});
```

## 3. Temel İşlemler

### 3.1 Bucket Oluşturma

```javascript
import { CreateBucketCommand } from '@aws-sdk/client-s3';

async function createBucket(bucketName) {
  try {
    const command = new CreateBucketCommand({
      Bucket: bucketName
    });

    const response = await s3Client.send(command);
    console.log('Bucket başarıyla oluşturuldu:', response);
    return response;
  } catch (error) {
    if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log('Bucket zaten mevcut');
    } else {
      console.error('Bucket oluşturulurken hata:', error);
      throw error;
    }
  }
}

// Kullanım
await createBucket('my-bucket');
```

### 3.2 Nesne Yükleme

```javascript
import { PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

async function uploadFile(bucketName, key, filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: 'application/octet-stream'
    });

    const response = await s3Client.send(command);
    console.log('Dosya başarıyla yüklendi:', response);
    return response;
  } catch (error) {
    console.error('Dosya yüklenirken hata:', error);
    throw error;
  }
}

// Kullanım
await uploadFile('my-bucket', 'hello.txt', './hello.txt');
```

### 3.3 String Yükleme

```javascript
async function uploadString(bucketName, key, content) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: content,
      ContentType: 'text/plain'
    });

    const response = await s3Client.send(command);
    console.log('String başarıyla yüklendi:', response);
    return response;
  } catch (error) {
    console.error('String yüklenirken hata:', error);
    throw error;
  }
}

// Kullanım
await uploadString('my-bucket', 'greeting.txt', 'Merhaba RustFS!');
```

### 3.4 Nesne İndirme

```javascript
import { GetObjectCommand } from '@aws-sdk/client-s3';

async function downloadFile(bucketName, key) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const response = await s3Client.send(command);

    // Akışı buffer'a dönüştür
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    return buffer;
  } catch (error) {
    console.error('Dosya indirilirken hata:', error);
    throw error;
  }
}

// Kullanım
const fileBuffer = await downloadFile('my-bucket', 'hello.txt');
console.log('Dosya içeriği:', fileBuffer.toString());
```

### 3.5 Nesneleri Listeleme

```javascript
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

async function listObjects(bucketName, prefix = '') {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix
    });

    const response = await s3Client.send(command);

    if (response.Contents) {
      response.Contents.forEach(obj => {
        console.log(`- ${obj.Key} (${obj.Size} bayt)`);
      });
    }

    return response.Contents;
  } catch (error) {
    console.error('Nesneler listelenirken hata:', error);
    throw error;
  }
}

// Kullanım
await listObjects('my-bucket');
```

### 3.6 Nesne Silme

```javascript
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

async function deleteObject(bucketName, key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const response = await s3Client.send(command);
    console.log('Nesne başarıyla silindi:', response);
    return response;
  } catch (error) {
    console.error('Nesne silinirken hata:', error);
    throw error;
  }
}

// Kullanım
await deleteObject('my-bucket', 'hello.txt');
```

## 4. Gelişmiş Özellikler

### 4.1 Ön İmzalı URL Oluşturma

```javascript
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// İndirme URL'si oluştur
async function getDownloadUrl(bucketName, key, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    console.log('İndirme URL:', url);
    return url;
  } catch (error) {
    console.error('İndirme URL oluşturulurken hata:', error);
    throw error;
  }
}

// Yükleme URL'si oluştur
async function getUploadUrl(bucketName, key, expiresIn = 3600) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    console.log('Yükleme URL:', url);
    return url;
  } catch (error) {
    console.error('Yükleme URL oluşturulurken hata:', error);
    throw error;
  }
}

// Kullanım
const downloadUrl = await getDownloadUrl('my-bucket', 'hello.txt');
const uploadUrl = await getUploadUrl('my-bucket', 'new-file.txt');
```

### 4.2 Çok Parçalı Yükleme

```javascript
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand
} from '@aws-sdk/client-s3';

async function multipartUpload(bucketName, key, file) {
  const partSize = 5 * 1024 * 1024; // 5MB parçalar
  const fileSize = file.size || file.length;

  if (fileSize <= partSize) {
    // Küçük dosyalar için normal yükleme kullan
    return uploadFile(bucketName, key, file);
  }

  try {
    // 1. Çok parçalı yüklemeyi başlat
    const createCommand = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: key
    });

    const { UploadId } = await s3Client.send(createCommand);

    // 2. Parçaları yükle
    const parts = [];
    const numParts = Math.ceil(fileSize / partSize);

    for (let i = 0; i < numParts; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, fileSize);
      const partNumber = i + 1;

      const partData = file.slice(start, end);

      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucketName,
        Key: key,
        PartNumber: partNumber,
        UploadId,
        Body: partData
      });

      const partResult = await s3Client.send(uploadPartCommand);

      parts.push({
        ETag: partResult.ETag,
        PartNumber: partNumber
      });

      console.log(`Yüklenen parça ${partNumber}/${numParts}`);
    }

    // 3. Çok parçalı yüklemeyi tamamla
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      UploadId,
      MultipartUpload: {
        Parts: parts
      }
    });

    const result = await s3Client.send(completeCommand);
    console.log('Çok parçalı yükleme tamamlandı:', result);
    return result;

  } catch (error) {
    console.error('Çok parçalı yükleme başarısız:', error);

    // Hata durumunda yüklemeyi iptal et
    try {
      const abortCommand = new AbortMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        UploadId
      });
      await s3Client.send(abortCommand);
    } catch (abortError) {
      console.error('Yükleme iptal edilirken hata:', abortError);
    }

    throw error;
  }
}
```

## 5. Tarayıcı Entegrasyonu

### 5.1 Tarayıcıdan Dosya Yükleme

```html
<!DOCTYPE html>
<html>
<head>
    <title>RustFS Dosya Yükleme</title>
</head>
<body>
    <input type="file" id="fileInput" />
    <button onclick="uploadFile()">Yükle</button>
    <div id="progress"></div>

    <script type="module">
        import { S3Client, PutObjectCommand } from 'https://cdn.skypack.dev/@aws-sdk/client-s3';

        const s3Client = new S3Client({
            endpoint: 'http://localhost:9000',
            region: 'us-east-1',
            credentials: {
                accessKeyId: 'rustfsadmin',
                secretAccessKey: 'rustfssecret'
            },
            forcePathStyle: true
        });

        window.uploadFile = async function() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];

            if (!file) {
                alert('Lütfen bir dosya seçin');
                return;
            }

            try {
                const command = new PutObjectCommand({
                    Bucket: 'my-bucket',
                    Key: file.name,
                    Body: file,
                    ContentType: file.type
                });

                const response = await s3Client.send(command);
                document.getElementById('progress').innerHTML = 'Yükleme başarılı!';
                console.log('Yükleme yanıtı:', response);
            } catch (error) {
                document.getElementById('progress').innerHTML = 'Yükleme başarısız: ' + error.message;
                console.error('Yükleme hatası:', error);
            }
        };
    </script>
</body>
</html>
```

### 5.2 Sürükle Bırak Yükleme

```javascript
// Sürükle bırak işlevselliği
function setupDragAndDrop(dropZoneId) {
  const dropZone = document.getElementById(dropZoneId);

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    const files = e.dataTransfer.files;

    for (const file of files) {
      try {
        await uploadFileToRustFS(file);
        console.log(`${file.name} başarıyla yüklendi`);
      } catch (error) {
        console.error(`${file.name} yüklenirken hata:`, error);
      }
    }
  });
}

async function uploadFileToRustFS(file) {
  const command = new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: file.name,
    Body: file,
    ContentType: file.type
  });

  return await s3Client.send(command);
}
```

## 6. Hata Yönetimi

### 6.1 Yaygın Hata Türleri

```javascript
async function handleS3Operation(operation) {
  try {
    return await operation();
  } catch (error) {
    switch (error.name) {
      case 'NoSuchBucket':
        console.error('Bucket mevcut değil');
        break;
      case 'NoSuchKey':
        console.error('Nesne mevcut değil');
        break;
      case 'AccessDenied':
        console.error('Erişim reddedildi - kimlik bilgilerini kontrol edin');
        break;
      case 'NetworkError':
        console.error('Ağ bağlantısı başarısız');
        break;
      default:
        console.error('Bilinmeyen hata:', error);
    }
    throw error;
  }
}
```

### 6.2 Tekrar Mantığı

```javascript
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      console.log(`Deneme ${attempt} başarısız, ${delay}ms sonra tekrar denenecek...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Üstel geri çekilme
    }
  }
}

// Kullanım
const result = await retryOperation(async () => {
  return await downloadFile('my-bucket', 'important-file.txt');
});
```

## 7. En İyi Uygulamalar

1. **Hata Yönetimi**: S3 işlemlerini her zaman try-catch blokları içine alın
2. **Kimlik Bilgisi Güvenliği**: Kimlik bilgilerini asla ön uç kodunda açıkta bırakmayın; geçici kimlik bilgileri veya ön imzalı URL'ler kullanın
3. **Dosya Boyutu**: 5MB'tan büyük dosyalar için çok parçalı yükleme kullanın
4. **İçerik Türü**: Daha iyi uyumluluk için uygun Content-Type ayarlayın
5. **İlerleme Takibi**: Büyük dosya yüklemeleri için ilerleme göstergeleri uygulayın
6. **Bağlantı Havuzlama**: Performansı optimize etmek için S3 istemci örneklerini yeniden kullanın

## 8. Tam Örnek

```javascript
class RustFSClient {
  constructor(config) {
    this.s3Client = new S3Client({
      endpoint: config.endpoint,
      region: config.region || 'us-east-1',
      credentials: config.credentials,
      forcePathStyle: true
    });
  }

  async uploadFile(bucketName, key, file, onProgress) {
    const fileSize = file.size || file.length;
    const partSize = 5 * 1024 * 1024;

    if (fileSize <= partSize) {
      return this.simpleUpload(bucketName, key, file);
    } else {
      return this.multipartUpload(bucketName, key, file, onProgress);
    }
  }

  async simpleUpload(bucketName, key, file) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: file.type || 'application/octet-stream'
    });

    return await this.s3Client.send(command);
  }

  // ... diğer metodlar
}

// Kullanım
const rustfs = new RustFSClient({
  endpoint: 'http://localhost:9000',
  credentials: {
    accessKeyId: 'rustfsadmin',
    secretAccessKey: 'rustfssecret'
  }
});

// İlerleme takibi ile yükleme
await rustfs.uploadFile('my-bucket', 'large-file.zip', file, (progress) => {
  console.log(`Yükleme ilerlemesi: ${progress}%`);
});