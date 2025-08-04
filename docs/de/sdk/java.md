---
title: "Java SDK"
description: "Dieser Artikel erklärt hauptsächlich die Verwendung des Java SDK in RustFS."
---

Das Folgende ist eine vollständige Entwicklungsdokumentation für die **Verwendung des S3 Java SDK in RustFS**, einschließlich SDK-Installation, Verbindungskonfiguration, grundlegender Operationen (Upload, Download, Löschen, Auflisten), Pre-Signed URLs, Multipart-Upload und anderen Funktionen, anwendbar für Java-Entwicklungsumgebungen.

---

## Inhaltsverzeichnis

1. [Java SDK-Konfiguration](#java-sdk-konfiguration)
2. [Client-Initialisierung](#client-initialisierung)
3. [Grundlegende Operationen](#grundlegende-operationen)
4. [Pre-Signed URLs](#pre-signed-urls)
5. [Multipart-Upload](#multipart-upload)
6. [Erweiterte Funktionen](#erweiterte-funktionen)

---

## Java SDK-Konfiguration

### Abhängigkeiten hinzufügen

#### Maven
Fügen Sie das AWS S3 Java SDK zu Ihrer `pom.xml` hinzu:

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.20.15</version>
</dependency>
```

#### Gradle
Fügen Sie zu Ihrer `build.gradle` hinzu:

```gradle
implementation 'software.amazon.awssdk:s3:2.20.15'
```

---

## Client-Initialisierung

### Grundlegende Client-Konfiguration

```java
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.core.sync.RequestBody;

import java.net.URI;

public class RustFSClient {
    private final S3Client s3Client;
    
    public RustFSClient(String endpoint, String accessKey, String secretKey) {
        // Authentifizierungsinformationen erstellen
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);
        
        // S3-Client erstellen
        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .region(Region.US_EAST_1) // RustFS ist mit jeder Region kompatibel
                .build();
    }
    
    public S3Client getClient() {
        return s3Client;
    }
}
```

### Verwendungsbeispiel

```java
public class RustFSExample {
    public static void main(String[] args) {
        // RustFS-Client initialisieren
        RustFSClient rustfsClient = new RustFSClient(
            "http://localhost:9000",  // RustFS-Endpunkt
            "rustfsadmin",            // Access Key
            "rustfsadmin"             // Secret Key
        );
        
        S3Client s3 = rustfsClient.getClient();
        
        // Beginne mit S3-Operationen...
    }
}
```

---

## Grundlegende Operationen

### 1. Bucket erstellen

```java
public void createBucket(S3Client s3, String bucketName) {
    try {
        CreateBucketRequest createBucketRequest = CreateBucketRequest.builder()
                .bucket(bucketName)
                .build();
        
        s3.createBucket(createBucketRequest);
        System.out.println("Bucket erfolgreich erstellt: " + bucketName);
        
    } catch (BucketAlreadyExistsException e) {
        System.err.println("Bucket existiert bereits: " + bucketName);
    } catch (S3Exception e) {
        System.err.println("Bucket-Erstellung fehlgeschlagen: " + e.awsErrorDetails().errorMessage());
    }
}
```

### 2. Buckets auflisten

```java
public void listBuckets(S3Client s3) {
    try {
        ListBucketsResponse listBucketsResponse = s3.listBuckets();
        
        listBucketsResponse.buckets().forEach(bucket -> {
            System.out.println("Bucket: " + bucket.name() + 
                             " (Erstellungszeit: " + bucket.creationDate() + ")");
        });
        
    } catch (S3Exception e) {
        System.err.println("Bucket-Auflistung fehlgeschlagen: " + e.awsErrorDetails().errorMessage());
    }
}
```

### 3. Objekt hochladen

```java
public void putObject(S3Client s3, String bucketName, String objectKey, String content) {
    try {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType("text/plain")
                .build();
        
        s3.putObject(putObjectRequest, RequestBody.fromString(content));
        System.out.println("Objekt erfolgreich hochgeladen: " + objectKey);
        
    } catch (S3Exception e) {
        System.err.println("Objekt-Upload fehlgeschlagen: " + e.awsErrorDetails().errorMessage());
    }
}
```

### 4. Von Datei hochladen

```java
import java.nio.file.Paths;

public void putObjectFromFile(S3Client s3, String bucketName, String objectKey, String filePath) {
    try {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();
        
        s3.putObject(putObjectRequest, RequestBody.fromFile(Paths.get(filePath)));
        System.out.println("Upload von Datei erfolgreich: " + filePath + " -> " + objectKey);
        
    } catch (S3Exception e) {
        System.err.println("Datei-Upload fehlgeschlagen: " + e.awsErrorDetails().errorMessage());
    }
}
```

### 5. Objekt herunterladen

```java
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

public void getObject(S3Client s3, String bucketName, String objectKey) {
    try {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();
        
        ResponseInputStream<GetObjectResponse> response = s3.getObject(getObjectRequest);
        
        // Inhalt lesen
        String content = new String(response.readAllBytes());
        System.out.println("Objektinhalt: " + content);
        
        response.close();
        
    } catch (S3Exception e) {
        System.err.println("Objekt-Download fehlgeschlagen: " + e.awsErrorDetails().errorMessage());
    } catch (Exception e) {
        System.err.println("Objektinhalt-Lesung fehlgeschlagen: " + e.getMessage());
    }
}
```

## Zusammenfassung

Diese Dokumentation deckt alle Kernfunktionen der Verwendung des Java SDK in RustFS ab:

1. **Grundkonfiguration**: Maven/Gradle-Abhängigkeiten und Client-Initialisierung
2. **Grundoperationen**: Erstellen, Auflisten, Hochladen, Herunterladen, Löschen
3. **Pre-Signed URLs**: Temporäre Zugriffslinks generieren
4. **Multipart-Upload**: Effizienter Upload großer Dateien
5. **Erweiterte Funktionen**: Metadaten-Operationen, Präfix-Abfragen etc.

Durch diese Beispiele können Java-Entwickler RustFS schnell in ihre eigenen Projekte integrieren und die Hochleistungs-Objektspeicherfunktionen von RustFS voll ausnutzen.

