---
title: "Java SDK"
description: "Использование Java SDK (AWS S3) с RustFS."
---

# Java SDK

RustFS — объектное хранилище с совместимостью S3. Интеграция осуществляется через AWS S3 SDK. Ниже показано, как с нуля настроить окружение, подключиться к RustFS и выполнить базовые операции с объектами, используя AWS S3 Java SDK.

## 1. Интеграция AWS S3 Java SDK

### 1.1 Создание проекта Maven

Используйте следующую структуру или создайте Maven‑проект в IDE:

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

### 1.2 Зависимости

Добавьте зависимость AWS SDK в `pom.xml`:

```xml
<dependencies>
  <dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.25.27</version>
  </dependency>
</dependencies>
```

> Рекомендуется AWS SDK v2 — он функциональнее и поддерживает асинхронные/реактивные режимы.

---

## 2. Подключение и использование RustFS

### 2.1 Инициализация S3‑клиента

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
    // 1. Инициализация S3‑клиента
    S3Client s3 = S3Client.builder()
      .endpointOverride(URI.create("http://192.168.1.100:9000")) // адрес RustFS
      .region(Region.US_EAST_1) // фиксированное значение; RustFS не проверяет регион
      .credentialsProvider(
        StaticCredentialsProvider.create(
          AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
        )
      )
      .forcePathStyle(true) // критично: для RustFS требуется Path‑Style
      .build();

    // 2. Создание bucket
    String bucket = "my-bucket";
    try {
      s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
      System.out.println("Bucket created: " + bucket);
    } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {
      System.out.println("Bucket already exists.");
    }

    // 3. Загрузка объекта
    s3.putObject(
      PutObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
      Paths.get("hello.txt")
    );
    System.out.println("Uploaded hello.txt");

    // 4. Загрузка (скачивание) объекта
    s3.getObject(
      GetObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
      Paths.get("downloaded-hello.txt")
    );
    System.out.println("Downloaded hello.txt");

    // 5. Список объектов
    ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());
    listResponse.contents().forEach(obj -> System.out.println("Found object: " + obj.key()));

    // 6. Удаление объекта
    s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key("hello.txt").build());
    System.out.println("Deleted hello.txt");

    // 7. Удаление bucket (опционально)
    // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());
  }
}
```

---

## 3. Частые проблемы и диагностика

| Проблема | Причина | Решение |
| --- | --- | --- |
| `S3Exception: 301 Moved Permanently` | Не включён path‑style или неверный регион | Установить `.forcePathStyle(true)` и использовать любой регион |
| `ConnectException: Connection refused` | RustFS не запущен или неверный порт | Проверить состояние RustFS и порт |
| `403 Forbidden` | Неверные AccessKey/SecretKey | Проверить конфигурацию аутентификации |
| Загрузка зависает | SDK по умолчанию использует HTTPS, RustFS работает по HTTP (или нужен сертификат) | Использовать `http://` и `endpointOverride` |

---

## 4. Приложение

### 4.1 Сборка Maven

```bash
mvn clean package
```

Запуск:

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 Рекомендации по настройке RustFS

- Если используется HTTP, отключить проверку SSL.
- Включить CORS (для веб‑клиентов).
- Настроить ограничения вроде `max_object_size` и `max_part_size` для стабильной передачи крупных файлов.

---

## 5. Расширенные примеры Java

### 5.1 Presigned URL (предподписанные ссылки)

> Позволяют временный доступ к приватным объектам без раскрытия учётных данных. Удобно для прямой загрузки/скачивания из браузера.

Добавить зависимость (модуль `s3-presigner`):

```xml
<dependency>
  <groupId>software.amazon.awssdk</groupId>
  <artifactId>s3-presigner</artifactId>
  <version>2.25.27</version>
</dependency>
```

Пример генерации ссылки на скачивание (GET):

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
  .signatureDuration(Duration.ofMinutes(15))
  .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
System.out.println("Presigned URL: " + presignedRequest.url());
```

Загрузка по предподписанной ссылке (PUT):

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

### 5.2 Многокомпонентная (Multipart) загрузка

Инициализация:

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
  .bucket("my-bucket")
  .key("bigfile.zip")
  .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

Загрузка частей:

```java
List<CompletedPart> completedParts = new ArrayList<>();
for (int i = 1; i <= 3; i++) {
  String partPath = "part" + i + ".bin";
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

Завершение загрузки:

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

Аварийная отмена (опционально):

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
  .bucket("my-bucket")
  .key("bigfile.zip")
  .uploadId(uploadId)
  .build();

s3.abortMultipartUpload(abortRequest);
```

