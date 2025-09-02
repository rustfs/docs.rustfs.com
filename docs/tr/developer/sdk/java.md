---
title: "Java SDK"
description: "Bu makale RustFS'de Java SDK kullanımını açıklar."
---

# Java SDK

RustFS, S3 protokolü uyumlu bir nesne depolama sistemidir ve AWS S3 SDK aracılığıyla sistem entegrasyonunu destekler. Bu makale, AWS S3 Java SDK örneği olarak, sıfırdan geliştirme ortamının nasıl kurulacağını, RustFS'e nasıl bağlanılacağını ve temel nesne depolama işlemlerinin nasıl tamamlanacağını tanıtacaktır.

## Bir. AWS S3 Java SDK Entegrasyonu

### 1.1 Maven Projesi Oluşturma

Aşağıdaki dizin yapısını kullanın veya IDE'de yeni bir Maven projesi oluşturun:

```
rustfs-java-s3-demo/
├── pom.xml
└── src/
 └── main/
 └── java/
 └── com/
 └── example/
 └── RustfsS3Example.java
```

### 1.2 Bağımlılık Ekleme

`pom.xml` dosyasına AWS SDK bağımlılığını ekleyin:

```xml
<dependencies>
 <dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3</artifactId>
 <version>2.25.27</version>
 </dependency>
</dependencies>
```

> AWS SDK v2 sürümü kullanılması önerilir, daha eksiksiz özellikler sunar ve asenkron, reaktif modları destekler.

---

## İki. RustFS'e Bağlanma ve Kullanım

### 2.1 S3 İstemcisini Başlatma

```java
package com.example;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.net.URI;
import java.nio.file.Paths;

public class RustfsS3Example {

 public static void main(String[] args) {
 // 1. S3 istemcisini başlat
 S3Client s3 = S3Client.builder()
 .endpointOverride(URI.create("http://192.168.1.100:9000")) // RustFS adresi
 .region(Region.US_EAST_1) // Sabit yazılabilir, RustFS region doğrulaması yapmaz
 .credentialsProvider(
 StaticCredentialsProvider.create(
 AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
 )
 )
 .forcePathStyle(true) // Kritik yapılandırma! RustFS Path-Style etkinleştirme gerektirir
 .build();

 // 2. Bucket oluştur
 String bucket = "my-bucket";
 try {
 s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
 System.out.println("Bucket created: " + bucket);
 } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {
 System.out.println("Bucket already exists.");
 }

 // 3. Dosya yükle
 s3.putObject(
 PutObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
 Paths.get("hello.txt")
 );
 System.out.println("Uploaded hello.txt");

 // 4. Dosya indir
 s3.getObject(
 GetObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
 Paths.get("downloaded-hello.txt")
 );
 System.out.println("Downloaded hello.txt");

 // 5. Nesneleri listele
 ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());
 listResponse.contents().forEach(obj -> System.out.println("Found object: " + obj.key()));

 // 6. Nesne sil
 s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key("hello.txt").build());
 System.out.println("Deleted hello.txt");

 // 7. Bucket sil (isteğe bağlı)
 // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());
 }
}
```

---

## Üç. Yaygın Sorunlar ve Sorun Giderme

| Sorun | Sebep | Çözüm |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `S3Exception: 301 Moved Permanently` | Path-style etkinleştirilmemiş veya region hatası | `.forcePathStyle(true)` ayarlayın ve region için herhangi bir değer kullanın |
| `ConnectException: Connection refused` | RustFS başlatılmamış veya port yanlış | RustFS durumunu ve portunu kontrol edin |
| `403 Forbidden` | AccessKey / SecretKey hatası | Kimlik doğrulama yapılandırmasını kontrol edin |
| Yükleme başarısız, yanıt yok | SDK varsayılan olarak HTTPS kullanır, RustFS sadece HTTP destekler (veya sertifika gerektirir) | `http://` adresi kullanın ve `endpointOverride` yapılandırın |

---

## Dört. Ek

### 4.1 Maven Listesi Paketleme

Projeyi paketleyin:

```bash
mvn clean package
```

Çalıştırın:

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 RustFS Yapılandırma Önerileri

* HTTP protokolü kullanırken SSL doğrulamasının kapatıldığından emin olun.
* CORS desteğini etkinleştirin (Web frontend için kullanılacaksa).
* Büyük dosya aktarım hatalarını önlemek için `max_object_size` ve `max_part_size` gibi sınırlamaları ayarlamayı önerilir.

---

İyi, aşağıda **RustFS AWS S3 Java SDK gelişmiş özellik örnekleri** tamamlaması bulunmaktadır:

* Presigned URL (Önceden İmzalı URL) oluşturma ve kullanım
* Multipart Upload (Parçalı Yükleme) tam akışı

---

## Beş. Java Gelişmiş Özellik Örnekleri

### 5.1 Presigned URL Oluşturma ve Kullanım (Önceden İmzalı URL)

> Presigned URL, istemcilerin kimlik bilgilerini açığa çıkarmadan özel nesnelere geçici erişim sağlamasına olanak tanır, tarayıcının doğrudan dosya yükleme veya indirme senaryolarında yaygın olarak kullanılır.

#### 5.1.1 Bağımlılık Ekleme (v2 SDK'nın URL imzalama `s3-presigner` modülünde bulunur)

```xml
<dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3-presigner</artifactId>
 <version>2.25.27</version>
</dependency>
```

#### 5.1.2 İndirme Bağlantısı Oluşturma (GET)

```java
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

S3Presigner presigner = S3Presigner.builder()
 .endpointOverride(URI.create("http://192.168.1.100:9000"))
 .region(Region.US_EAST_1)
 .credentialsProvider(
 StaticCredentialsProvider.create(
 AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
 )
 )
 .build();

GetObjectRequest getObjectRequest = GetObjectRequest.builder()
 .bucket("my-bucket")
 .key("hello.txt")
 .build();

GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
 .getObjectRequest(getObjectRequest)
 .signatureDuration(Duration.ofMinutes(15)) // 15 dakika geçerlilik süresi
 .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);

System.out.println("Presigned URL: " + presignedRequest.url());
```

> 🔗 Bu bağlantıyı tarayıcıda açarak nesneye erişebilirsiniz.

#### 5.1.3 Yükleme Presigned URL (PUT)

Benzer şekilde, yükleme URL'si de oluşturulabilir:

```java
PutObjectRequest putRequest = PutObjectRequest.builder()
 .bucket("my-bucket")
 .key("upload.txt")
 .build();

PresignedPutObjectRequest presignedPut = presigner.presignPutObject(
 PutObjectPresignRequest.builder()
 .putObjectRequest(putRequest)
 .signatureDuration(Duration.ofMinutes(10))
 .build()
);

System.out.println("Upload URL: " + presignedPut.url());
```

---

### 5.2 Parçalı Yükleme Uygulama (Multipart Upload)

> Multipart Upload, büyük dosya yüklemesi için önerilen yöntemdir, ağ dalgalanması durumunda kesme noktasından devam etmeye olanak tanır.

#### 5.2.1 Parçalı Yüklemeyi Başlatma

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

#### 5.2.2 Her Parçayı Yükleme (Part)

```java
List<CompletedPart> completedParts = new ArrayList<>();
for (int i = 1; i <= 3; i++) {
 String partPath = "part" + i + ".bin"; // Her part'ın yerel dosya olduğunu varsayalım
 UploadPartRequest uploadPartRequest = UploadPartRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .uploadId(uploadId)
 .partNumber(i)
 .build();

 UploadPartResponse uploadPartResponse = s3.uploadPart(uploadPartRequest, Paths.get(partPath));
 completedParts.add(
 CompletedPart.builder()
 .partNumber(i)
 .eTag(uploadPartResponse.eTag())
 .build()
 );
}
```

#### 5.2.3 Parçalı Yüklemeyi Tamamlama

```java
CompletedMultipartUpload completedUpload = CompletedMultipartUpload.builder()
 .parts(completedParts)
 .build();

CompleteMultipartUploadRequest completeRequest = CompleteMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .uploadId(uploadId)
 .multipartUpload(completedUpload)
 .build();

s3.completeMultipartUpload(completeRequest);
System.out.println("Multipart upload completed.");
```

#### 5.2.4 İstisna Durumunda Yüklemeyi Durdurma (isteğe bağlı)

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .uploadId(uploadId)
 .build();

s3.abortMultipartUpload(abortRequest);
```

---