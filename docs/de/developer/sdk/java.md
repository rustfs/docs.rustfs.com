---
title: "Java SDK"
description: "Dieses Dokument erklärt hauptsächlich die Verwendung des Java SDK in RustFS."
---

# Java SDK

RustFS ist ein S3-protokollkompatibles Objektspeichersystem, das die Integration über das AWS S3 SDK unterstützt. Dieser Artikel verwendet das AWS S3 Java SDK als Beispiel, um zu zeigen, wie man von Grund auf eine Entwicklungsumgebung aufbaut, sich mit RustFS verbindet und grundlegende Objektspeicheroperationen durchführt.

## I. AWS S3 Java SDK Integration

### 1.1 Maven-Projekt erstellen

Verwenden Sie die folgende Verzeichnisstruktur oder erstellen Sie ein neues Maven-Projekt in der IDE:

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

### 1.2 Abhängigkeiten hinzufügen

Fügen Sie die AWS SDK-Abhängigkeit in `pom.xml` hinzu:

```xml
<dependencies>
 <dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3</artifactId>
 <version>2.25.27</version>
 </dependency>
</dependencies>
```

> Es wird empfohlen, AWS SDK v2 zu verwenden, das vollständigere Funktionen und Unterstützung für asynchrone und reaktive Modi bietet.

---

## II. Verbindung und Verwendung von RustFS

### 2.1 S3-Client initialisieren

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
 // 1. S3-Client initialisieren
 S3Client s3 = S3Client.builder()
 .endpointOverride(URI.create("http://192.168.1.100:9000")) // RustFS-Adresse
 .region(Region.US_EAST_1) // Kann fest codiert werden, RustFS validiert Region nicht
 .credentialsProvider(
 StaticCredentialsProvider.create(
 AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
 )
 )
 .forcePathStyle(true) // Wichtige Konfiguration! RustFS benötigt Path-Style
 .build();

 // 2. Bucket erstellen
 String bucket = "my-bucket";
 try {
 s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
 System.out.println("Bucket erstellt: " + bucket);
 } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {
 System.out.println("Bucket existiert bereits.");
 }

 // 3. Datei hochladen
 s3.putObject(
 PutObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
 Paths.get("hello.txt")
 );
 System.out.println("hello.txt hochgeladen");

 // 4. Datei herunterladen
 s3.getObject(
 GetObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
 Paths.get("downloaded-hello.txt")
 );
 System.out.println("hello.txt heruntergeladen");

 // 5. Objekte auflisten
 ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());
 listResponse.contents().forEach(obj -> System.out.println("Objekt gefunden: " + obj.key()));

 // 6. Objekt löschen
 s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key("hello.txt").build());
 System.out.println("hello.txt gelöscht");

 // 7. Bucket löschen (optional)
 // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());
 }
}
```

---

## III. Häufige Probleme und Fehlerbehebung

| Problem | Ursache | Lösung |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `S3Exception: 301 Moved Permanently` | Path-style nicht aktiviert oder Region-Fehler | Setzen Sie `.forcePathStyle(true)` und verwenden Sie beliebige Region |
| `ConnectException: Connection refused` | RustFS nicht gestartet oder Port falsch | RustFS-Status und Port prüfen |
| `403 Forbidden` | AccessKey / SecretKey falsch | Authentifizierungskonfiguration prüfen |
| Upload fehlschlägt ohne Antwort | SDK verwendet standardmäßig HTTPS, RustFS unterstützt nur HTTP (oder benötigt Zertifikat) | Verwenden Sie `http://`-Adresse und konfigurieren Sie `endpointOverride` |

---

## IV. Anhang

### 4.1 Maven-Projekt verpacken

Projekt verpacken:

```bash
mvn clean package
```

Ausführen:

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 RustFS-Konfigurationsempfehlungen

* SSL-Validierung deaktivieren, wenn der Service HTTP-Protokoll verwendet.
* CORS-Unterstützung aktivieren (für Web-Frontend).
* Es wird empfohlen, `max_object_size` und `max_part_size` zu setzen, um Übertragungsfehler bei großen Dateien zu verhindern.

---

## V. Erweiterte Java-Funktionsbeispiele

### 5.1 Presigned URLs generieren und verwenden

> Presigned URLs ermöglichen es Clients, temporär auf private Objekte zuzugreifen, ohne Anmeldedaten preiszugeben, und werden häufig für direktes Upload/Download von Browsern verwendet.

#### 5.1.1 Abhängigkeit hinzufügen (v2 SDK URL-Signierung befindet sich im `s3-presigner`-Modul)

```xml
<dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3-presigner</artifactId>
 <version>2.25.27</version>
</dependency>
```

#### 5.1.2 Download-Link generieren (GET)

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
 .signatureDuration(Duration.ofMinutes(15)) // 15 Minuten gültig
 .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);

System.out.println("Presigned URL: " + presignedRequest.url());
```

> 🔗 Öffnen Sie den Link im Browser, um auf das Objekt zuzugreifen.

#### 5.1.3 Upload Presigned URL (PUT)

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

### 5.2 Multipart Upload implementieren

> Multipart Upload ist die empfohlene Methode für große Dateien und ermöglicht Wiederaufnahme bei Netzwerkproblemen.

#### 5.2.1 Multipart Upload starten

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

#### 5.2.2 Teile hochladen

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

#### 5.2.3 Multipart Upload abschließen

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
System.out.println("Multipart Upload abgeschlossen.");
```

#### 5.2.4 Upload abbrechen (optional)

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .uploadId(uploadId)
 .build();

s3.abortMultipartUpload(abortRequest);
```

