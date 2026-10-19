---
title: "Java-SDK-Anleitung"
description: "Verwenden Sie das offizielle AWS SDK für Java v2 mit RustFS."
---

RustFS enthält kein eigenes Java-SDK. Der Dienst ist S3-kompatibel, daher verwenden Sie das offizielle AWS SDK für Java v2 und richten es auf Ihren RustFS-Server aus.

## 1. Voraussetzungen

* Java 8 oder höher und Maven (oder Gradle)
* Eine laufende RustFS-Instanz (siehe [Installationsanleitung](../../installation/index.md)). Die S3-API nimmt Verbindungen auf Port `9000` entgegen, die Console (Weboberfläche) auf Port `9001`
* Zugriffsschlüssel, die Sie bei der Installation über die Umgebungsvariablen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` setzen (siehe [Zugriffsschlüssel-Verwaltung](../../security-compliance/iam/access-token.md))

:::tip[Lokaler Test]

Wenn Sie bei der Installation keine Anmeldedaten gesetzt haben, verwendet der Server standardmäßig `rustfsadmin` / `rustfsadmin`. Das reicht für einen wegwerfbaren lokalen Test, niemals für eine Instanz, die andere erreichen können.

:::

### 1.1 Maven-Projekt einrichten

Legen Sie ein neues Maven-Projekt an:

```text
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

Fügen Sie die AWS-SDK-Abhängigkeiten in `pom.xml` hinzu:

```xml title="pom.xml"
<dependencies>
  <dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.25.27</version>
  </dependency>
</dependencies>
```

Wir empfehlen das AWS SDK für Java v2. Es deckt mehr Funktionen ab und unterstützt asynchrone sowie reaktive Programmierung.

---

## 2. Verbindung mit RustFS

### 2.1 Vollständiges Beispiel

Die folgende Klasse kompiliert und läuft unverändert. Ersetzen Sie `localhost` durch die IP-Adresse Ihres Servers, wenn RustFS auf einem anderen Rechner läuft, und tragen Sie Ihre eigenen Zugriffsschlüssel ein:

```java title="RustfsS3Example.java"
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
        // 1. Initialize S3 client
        S3Client s3 = S3Client.builder()
            .endpointOverride(URI.create("http://localhost:9000")) // RustFS S3 API address
            .region(Region.US_EAST_1) // RustFS default region
            .credentialsProvider(
                StaticCredentialsProvider.create(
                    AwsBasicCredentials.create("<your-access-key>", "<your-secret-key>")
                )
            )
            // RustFS uses path-style URLs by default; virtual-host style requires RUSTFS_SERVER_DOMAINS
            .forcePathStyle(true)
            .build();

        // 2. Create bucket
        String bucket = "my-bucket";
        try {
            s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
            System.out.println("Bucket created: " + bucket);
        } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {
            System.out.println("Bucket already exists.");
        }

        // 3. Upload file
        s3.putObject(
            PutObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
            Paths.get("/path/to/hello.txt")
        );
        System.out.println("Uploaded hello.txt");

        // 4. Download file
        s3.getObject(
            GetObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
            Paths.get("downloaded-hello.txt")
        );
        System.out.println("Downloaded hello.txt");

        // 5. List objects
        ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());
        listResponse.contents().forEach(obj -> System.out.println("Found object: " + obj.key()));

        // 6. Delete object
        s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key("hello.txt").build());
        System.out.println("Deleted hello.txt");

        // 7. Delete bucket (optional)
        // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());
    }
}
```

Erwartete Ausgabe:

```text
Bucket created: my-bucket
Uploaded hello.txt
Downloaded hello.txt
Found object: hello.txt
Deleted hello.txt
```

---

## 3. Fehlerbehebung

| Problem | Ursache | Lösung |
| --- | --- | --- |
| `S3Exception: 301 Moved Permanently` | Pfadbasierte Adressierung (Path-Style) ist nicht aktiviert, oder die Region ist falsch | Setzen Sie `.forcePathStyle(true)` und verwenden Sie die Region `us-east-1` |
| `ConnectException: Connection refused` | RustFS ist nicht gestartet, oder der Port ist falsch | Prüfen Sie den Status und den Port von RustFS |
| `403 Forbidden` | Zugriffsschlüssel oder geheimer Zugriffsschlüssel ist falsch | Prüfen Sie Ihre Zugangsdaten |
| Upload schlägt ohne Antwort fehl | Das SDK verwendet standardmäßig HTTPS, und RustFS unterstützt nur HTTP (oder benötigt Zertifikate) | Verwenden Sie eine Adresse mit `http://` und setzen Sie `endpointOverride` |

---

## 4. Anhang

### 4.1 Mit Maven paketieren und ausführen

Paketieren Sie das Projekt:

```bash
mvn clean package
```

Führen Sie es aus:

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 Empfohlene RustFS-Einstellungen

* Wenn RustFS unverschlüsseltes HTTP ausliefert, deaktivieren Sie die Prüfung von TLS-Zertifikaten im SDK.
* Aktivieren Sie die CORS-Unterstützung, wenn Sie ein Web-Frontend verwenden.
* Wir empfehlen, Grenzwerte wie `max_object_size` und `max_part_size` zu setzen, damit die Übertragung großer Dateien nicht fehlschlägt.

---

Die folgenden fortgeschrittenen Beispiele behandeln:

* Erzeugen und Verwenden vorsignierter URLs
* den vollständigen Ablauf eines mehrteiligen Uploads

---

## 5. Fortgeschrittene Beispiele

### 5.1 Vorsignierte URLs erzeugen und verwenden

Vorsignierte URLs geben Clients zeitlich begrenzten Zugriff auf private Objekte, ohne Zugangsdaten offenzulegen. Sie werden häufig für direkte Uploads und Downloads aus einem Browser verwendet.

#### 5.1.1 Download-Link erzeugen (GET)

```java
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.net.URI;
import java.time.Duration;

S3Presigner presigner = S3Presigner.builder()
    .endpointOverride(URI.create("http://localhost:9000"))
    .region(Region.US_EAST_1)
    .credentialsProvider(
        StaticCredentialsProvider.create(
            AwsBasicCredentials.create("<your-access-key>", "<your-secret-key>")
        )
    )
    // The presigner must also sign path-style URLs
    .serviceConfiguration(
        S3Configuration.builder().pathStyleAccessEnabled(true).build()
    )
    .build();

GetObjectRequest getObjectRequest = GetObjectRequest.builder()
    .bucket("my-bucket")
    .key("hello.txt")
    .build();

GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
    .getObjectRequest(getObjectRequest)
    .signatureDuration(Duration.ofMinutes(15)) // expires in 15 minutes
    .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);

System.out.println("Presigned URL: " + presignedRequest.url());
```

```text
Presigned URL: http://localhost:9000/my-bucket/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

Öffnen Sie die URL in einem Browser, um auf das Objekt zuzugreifen.

#### 5.1.2 Vorsignierte Upload-URL (PUT)

Sie können auch Upload-URLs erzeugen:

```java
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

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

### 5.2 Mehrteiligen Upload implementieren

Der mehrteilige Upload ist der empfohlene Weg, große Dateien hochzuladen. Bei einer Unterbrechung des Netzwerks können Sie fehlgeschlagene Teile erneut senden, statt den gesamten Upload neu zu starten.

Die folgenden Beispiele verwenden den Client `s3` aus Abschnitt 2 weiter und benötigen diese zusätzlichen Imports:

```java
import software.amazon.awssdk.services.s3.model.*;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
```

#### 5.2.1 Mehrteiligen Upload starten

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

#### 5.2.2 Jeden Teil hochladen

```java
List<CompletedPart> completedParts = new ArrayList<>();
for (int i = 1; i <= 3; i++) {
    String partPath = "part" + i + ".bin"; // Assume each part is a local file
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

#### 5.2.3 Mehrteiligen Upload abschließen

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

```text
Multipart upload completed.
```

#### 5.2.4 Upload bei einer Ausnahme abbrechen (optional)

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .uploadId(uploadId)
    .build();

s3.abortMultipartUpload(abortRequest);
```

---

Weitere Operationen (Objekt-Tagging, Bucket-Richtlinien und mehr) stehen in der [Dokumentation zum AWS SDK für Java v2](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/). Die meisten S3-Operationen funktionieren gegenüber RustFS auf dieselbe Weise. Ausnahmen stehen unter [S3-Kompatibilität](/de/reference/s3-compatibility).
