---
title: "Java SDK"
description: "Dieser Artikel erklärt hauptsächlich die Verwendung des Java SDK in RustFS."
---

# Java SDK

RustFS ist ein S3-kompatibles Objektspeichersystem, das die Integration über das AWS S3 SDK unterstützt. Dieser Artikel verwendet das AWS S3 Java SDK als Beispiel, um zu erklären, wie man von Grund auf eine Entwicklungsumgebung aufbaut, sich mit RustFS verbindet und grundlegende Objektspeicher-Operationen durchführt.

## I. Integration des AWS S3 Java SDK

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

Fügen Sie AWS SDK-Abhängigkeiten in `pom.xml` hinzu:

```xml
<dependencies>
 <dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3</artifactId>
 <version>2.25.27</version>
 </dependency>
</dependencies>
```

> Es wird empfohlen, AWS SDK v2 zu verwenden, das vollständigere Funktionen bietet und asynchrone, reaktive Modi unterstützt.

---

## II. Verbindung zu RustFS und Verwendung

### 2.1 S3-Client initialisieren

```java
package com.example;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.net.URI;

public class RustfsS3Example {
    private static final String ACCESS_KEY = "your-access-key";
    private static final String SECRET_KEY = "your-secret-key";
    private static final String ENDPOINT = "http://your-rustfs-endpoint:9000";
    private static final String REGION = "us-east-1";

    public static void main(String[] args) {
        // S3-Client konfigurieren
        S3Client s3Client = S3Client.builder()
            .endpointOverride(URI.create(ENDPOINT))
            .region(Region.of(REGION))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(ACCESS_KEY, SECRET_KEY)
            ))
            .forcePathStyle(true) // Wichtig für S3-kompatible Dienste
            .build();

        // Grundlegende Operationen durchführen
        listBuckets(s3Client);
        createBucket(s3Client);
        uploadObject(s3Client);
        downloadObject(s3Client);
        deleteObject(s3Client);
        deleteBucket(s3Client);

        s3Client.close();
    }
}
```

### 2.2 Speicher-Buckets auflisten

```java
private static void listBuckets(S3Client s3Client) {
    try {
        ListBucketsResponse response = s3Client.listBuckets();
        System.out.println("Verfügbare Speicher-Buckets:");
        for (Bucket bucket : response.buckets()) {
            System.out.println("- " + bucket.name() + " (erstellt: " + bucket.creationDate() + ")");
        }
    } catch (S3Exception e) {
        System.err.println("Fehler beim Auflisten der Speicher-Buckets: " + e.getMessage());
    }
}
```

### 2.3 Speicher-Bucket erstellen

```java
private static void createBucket(S3Client s3Client) {
    String bucketName = "mein-test-bucket";

    try {
        CreateBucketRequest request = CreateBucketRequest.builder()
            .bucket(bucketName)
            .build();

        CreateBucketResponse response = s3Client.createBucket(request);
        System.out.println("Speicher-Bucket '" + bucketName + "' erfolgreich erstellt.");
    } catch (BucketAlreadyExistsException e) {
        System.out.println("Speicher-Bucket '" + bucketName + "' existiert bereits.");
    } catch (S3Exception e) {
        System.err.println("Fehler beim Erstellen des Speicher-Buckets: " + e.getMessage());
    }
}
```

### 2.4 Objekt hochladen

```java
private static void uploadObject(S3Client s3Client) {
    String bucketName = "mein-test-bucket";
    String objectKey = "test-dokument.txt";
    String content = "Hallo, RustFS! Dies ist ein Test-Dokument.";

    try {
        PutObjectRequest request = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .contentType("text/plain")
            .build();

        s3Client.putObject(request, RequestBody.fromString(content));
        System.out.println("Objekt '" + objectKey + "' erfolgreich hochgeladen.");
    } catch (S3Exception e) {
        System.err.println("Fehler beim Hochladen des Objekts: " + e.getMessage());
    }
}
```

### 2.5 Objekt herunterladen

```java
private static void downloadObject(S3Client s3Client) {
    String bucketName = "mein-test-bucket";
    String objectKey = "test-dokument.txt";

    try {
        GetObjectRequest request = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .build();

        GetObjectResponse response = s3Client.getObject(request);
        String content = response.readUtf8String();
        System.out.println("Objekt-Inhalt: " + content);
    } catch (S3Exception e) {
        System.err.println("Fehler beim Herunterladen des Objekts: " + e.getMessage());
    }
}
```

### 2.6 Objekt löschen

```java
private static void deleteObject(S3Client s3Client) {
    String bucketName = "mein-test-bucket";
    String objectKey = "test-dokument.txt";

    try {
        DeleteObjectRequest request = DeleteObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .build();

        s3Client.deleteObject(request);
        System.out.println("Objekt '" + objectKey + "' erfolgreich gelöscht.");
    } catch (S3Exception e) {
        System.err.println("Fehler beim Löschen des Objekts: " + e.getMessage());
    }
}
```

### 2.7 Speicher-Bucket löschen

```java
private static void deleteBucket(S3Client s3Client) {
    String bucketName = "mein-test-bucket";

    try {
        DeleteBucketRequest request = DeleteBucketRequest.builder()
            .bucket(bucketName)
            .build();

        s3Client.deleteBucket(request);
        System.out.println("Speicher-Bucket '" + bucketName + "' erfolgreich gelöscht.");
    } catch (S3Exception e) {
        System.err.println("Fehler beim Löschen des Speicher-Buckets: " + e.getMessage());
    }
}
```

## III. Erweiterte Funktionen

### 3.1 Objekt-Metadaten abrufen

```java
private static void getObjectMetadata(S3Client s3Client, String bucketName, String objectKey) {
    try {
        HeadObjectRequest request = HeadObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .build();

        HeadObjectResponse response = s3Client.headObject(request);
        System.out.println("Objekt-Metadaten:");
        System.out.println("- Größe: " + response.contentLength() + " Bytes");
        System.out.println("- Content-Type: " + response.contentType());
        System.out.println("- Letzte Änderung: " + response.lastModified());
        System.out.println("- ETag: " + response.eTag());
    } catch (S3Exception e) {
        System.err.println("Fehler beim Abrufen der Objekt-Metadaten: " + e.getMessage());
    }
}
```

### 3.2 Objekte in einem Speicher-Bucket auflisten

```java
private static void listObjects(S3Client s3Client, String bucketName) {
    try {
        ListObjectsV2Request request = ListObjectsV2Request.builder()
            .bucket(bucketName)
            .maxKeys(10)
            .build();

        ListObjectsV2Response response = s3Client.listObjectsV2(request);
        System.out.println("Objekte im Speicher-Bucket '" + bucketName + "':");
        for (S3Object object : response.contents()) {
            System.out.println("- " + object.key() + " (" + object.size() + " Bytes)");
        }
    } catch (S3Exception e) {
        System.err.println("Fehler beim Auflisten der Objekte: " + e.getMessage());
    }
}
```

### 3.3 Objekt mit benutzerdefinierten Metadaten hochladen

```java
private static void uploadObjectWithMetadata(S3Client s3Client, String bucketName, String objectKey) {
    try {
        Map<String, String> metadata = new HashMap<>();
        metadata.put("author", "RustFS Benutzer");
        metadata.put("version", "1.0");
        metadata.put("description", "Test-Dokument mit Metadaten");

        PutObjectRequest request = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .contentType("text/plain")
            .metadata(metadata)
            .build();

        String content = "Dieses Objekt enthält benutzerdefinierte Metadaten.";
        s3Client.putObject(request, RequestBody.fromString(content));
        System.out.println("Objekt mit Metadaten erfolgreich hochgeladen.");
    } catch (S3Exception e) {
        System.err.println("Fehler beim Hochladen des Objekts mit Metadaten: " + e.getMessage());
    }
}
```

## IV. Fehlerbehandlung

### 4.1 Häufige Fehler

```java
private static void handleCommonErrors(S3Exception e) {
    switch (e.statusCode()) {
        case 403:
            System.err.println("Zugriff verweigert. Überprüfen Sie Ihre Anmeldedaten und Berechtigungen.");
            break;
        case 404:
            System.err.println("Ressource nicht gefunden. Überprüfen Sie den Speicher-Bucket-Namen und Objekt-Schlüssel.");
            break;
        case 409:
            System.err.println("Konflikt. Der Speicher-Bucket existiert möglicherweise bereits.");
            break;
        default:
            System.err.println("Unbekannter Fehler: " + e.getMessage());
    }
}
```

## V. Best Practices

### 5.1 Ressourcenverwaltung

```java
// Verwenden Sie try-with-resources für automatische Ressourcenverwaltung
try (S3Client s3Client = S3Client.builder()
    .endpointOverride(URI.create(ENDPOINT))
    .region(Region.of(REGION))
    .credentialsProvider(StaticCredentialsProvider.create(
        AwsBasicCredentials.create(ACCESS_KEY, SECRET_KEY)
    ))
    .forcePathStyle(true)
    .build()) {

    // S3-Operationen durchführen
    // ...
} // Client wird automatisch geschlossen
```

### 5.2 Asynchrone Operationen

```java
// Verwenden Sie S3AsyncClient für bessere Leistung
S3AsyncClient asyncClient = S3AsyncClient.builder()
    .endpointOverride(URI.create(ENDPOINT))
    .region(Region.of(REGION))
    .credentialsProvider(StaticCredentialsProvider.create(
        AwsBasicCredentials.create(ACCESS_KEY, SECRET_KEY)
    ))
    .forcePathStyle(true)
    .build();

// Asynchrone Operationen
CompletableFuture<PutObjectResponse> future = asyncClient.putObject(
    PutObjectRequest.builder()
        .bucket(bucketName)
        .key(objectKey)
        .build(),
    RequestBody.fromString(content)
);

future.thenAccept(response -> {
    System.out.println("Objekt erfolgreich hochgeladen.");
}).exceptionally(throwable -> {
    System.err.println("Fehler beim Hochladen: " + throwable.getMessage());
    return null;
});
```

## VI. Zusammenfassung

Dieser Artikel hat gezeigt, wie man:

1. AWS S3 Java SDK in ein Maven-Projekt integriert
2. Eine Verbindung zu RustFS herstellt
3. Grundlegende Objektspeicher-Operationen durchführt
4. Erweiterte Funktionen wie Metadaten und asynchrone Operationen nutzt
5. Fehlerbehandlung implementiert

RustFS ist vollständig kompatibel mit dem AWS S3 SDK, sodass Sie alle Standard-S3-Operationen verwenden können. Weitere Informationen finden Sie in der [AWS S3 Java SDK Dokumentation](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/examples-s3.html).
