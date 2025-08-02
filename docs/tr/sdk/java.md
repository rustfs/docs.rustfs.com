---
title: "Java SDK"
description: "Bu makale, RustFS'ta Java SDK'nın kullanımını temel olarak açıklamaktadır."
---

# Java SDK

RustFS, AWS S3 SDK ile sistem entegrasyonunu destekleyen, S3 protokolüyle uyumlu bir nesne depolama sistemidir. Bu makale, AWS S3 Java SDK örneği kullanılarak sıfırdan bir geliştirme ortamının nasıl oluşturulacağını, RustFS'a nasıl bağlanılacağını ve temel nesne depolama işlemlerinin nasıl tamamlanacağını açıklayacaktır.

## 1. AWS S3 Java SDK Entegrasyonu

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

### 1.2 Bağımlılıkların Eklenmesi

`pom.xml` dosyasına AWS SDK bağımlılıklarını ekleyin:

```xml
<dependencies>
    <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>s3</artifactId>
        <version>2.25.27</version>
    </dependency>
</dependencies>
```

> AWS SDK v2 sürümünü kullanmanızı öneririz, daha fazla işlevsellik sunar ve asenkron, reaktif modları destekler.

---

## 2. RustFS'a Bağlanma ve Kullanma

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
                .region(Region.US_EAST_1) // Sabit kodlanabilir, RustFS bölgeyi doğrulamaz
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
                        )
                )
                .forcePathStyle(true) // Önemli yapılandırma! RustFS Path-Style etkinleştirilmesini gerektirir
                .build();

        // 2. Bucket oluştur
        String bucket = "my-bucket";
        try {
            s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
            System.out.println("Bucket oluşturuldu: " + bucket);
        } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {
            System.out.println("Bucket zaten mevcut.");
        }

        // 3. Dosya yükle
        s3.putObject(
                PutObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
                Paths.get("hello.txt")
        );
        System.out.println("hello.txt yüklendi");

        // 4. Dosya indir
        s3.getObject(
                GetObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
                Paths.get("downloaded-hello.txt")
        );
        System.out.println("hello.txt indirildi");

        // 5. Nesneleri listele
        ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());
        listResponse.contents().forEach(obj -> System.out.println("Bulunan nesne: " + obj.key()));

        // 6. Nesneyi sil
        s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key("hello.txt").build());
        System.out.println("hello.txt silindi");

        // 7. Bucket'i sil (isteğe bağlı)
        // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());
    }
}
```

---

## 3. Yaygın Sorunlar ve Çözümleri

| Sorun | Nedeni | Çözüm |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `S3Exception: 301 Moved Permanently` | Path-style etkin değil veya bölge hatası | `.forcePathStyle(true)` ayarla ve herhangi bir bölge değeri kullan |
| `ConnectException: Connection refused` | RustFS başlatılmamış veya yanlış port | RustFS durumunu ve portu kontrol et |
| `403 Forbidden` | AccessKey / SecretKey hatası | Kimlik doğrulama yapılandırmasını kontrol et |
| Yanıt olmadan yükleme başarısız | SDK varsayılan olarak HTTPS kullanır, RustFS yalnızca HTTP'yi destekler (veya sertifikalar gerektirir) | `http://` adresi kullan ve `endpointOverride` yapılandır |

---

## 4. Ekler

### 4.1 Maven Paketleme

Projeyi paketle:

```bash
mvn clean package
```

Çalıştır:

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 RustFS Yapılandırma Önerileri

* Hizmet HTTP protokolünü kullandığında SSL doğrulamanın devre dışı olduğundan emin olun.
* CORS desteğini etkinleştirin (web önyüzü için kullanılıyorsa).
* Büyük dosya aktarım hatalarını önlemek için `max_object_size` ve `max_part_size` sınırlarını ayarlamanız önerilir.

---

## 5. Gelişmiş Java Özellik Örnekleri

### 5.1 Ön İmzalı URL'ler Oluşturma ve Kullanma

> Ön imzalı URL'ler, istemcilerin kimlik bilgilerini açığa çıkarmadan özel nesnelere geçici olarak erişmesine izin verir, tarayıcıdan doğrudan yükleme veya indirme senaryolarında yaygın olarak kullanılır.

#### 5.1.1 Bağımlılıkları Ekleme (v2 SDK için URL imzalama `s3-presigner` modülündedir)

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
        .signatureDuration(Duration.ofMinutes(15)) // 15 dakika geçerli
        .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
String url = presignedRequest.url().toString();

System.out.println("Ön imzalı GET URL: " + url);
```

### 5.2 Çok Parçalı Yükleme

10 MB'tan büyük dosyalar için her parçayı manuel olarak kontrol edebilirsiniz.

```java
import software.amazon.awssdk.services.s3.model.*;

String bucket = "my-bucket";
String key = "large-file.bin";

// 1. Çok parçalı yüklemeyi başlat
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
        .bucket(bucket)
        .key(key)
        .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();

// 2. Parçaları yükle
List<CompletedPart> completedParts = new ArrayList<>();
// ... yükleme mantığı ...

// 3. Çok parçalı yüklemeyi tamamla
CompleteMultipartUploadRequest completeRequest = CompleteMultipartUploadRequest.builder()
        .bucket(bucket)
        .key(key)
        .uploadId(uploadId)
        .multipartUpload(CompletedMultipartUpload.builder().parts(completedParts).build())
        .build();

s3.completeMultipartUpload(completeRequest);