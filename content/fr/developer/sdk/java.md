---
title: "Guide du SDK Java"
description: "Utilisez le SDK AWS officiel pour Java v2 avec RustFS."
---

RustFS ne fournit pas de SDK Java propre. Il est compatible avec S3 : vous utilisez donc le SDK AWS officiel pour Java v2, configuré pour pointer vers votre serveur RustFS.

## 1. Prérequis

* Java 8 ou ultérieur et Maven (ou Gradle)
* Une instance RustFS en cours d’exécution (consultez le [guide d’installation](../../installation/index.md)) : l’API S3 écoute sur le port `9000`, la Console sur le port `9001`
* Des clés d’accès, définies à l’installation par les variables d’environnement `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` (consultez la [gestion des clés d’accès](../../security-compliance/iam/access-token.md))

:::tip[Essai local]

Si vous n’avez pas défini d’identifiants à l’installation, le serveur utilise par défaut `rustfsadmin` / `rustfsadmin`. Cela convient à un essai local jetable, jamais à une instance accessible à d’autres personnes.

:::

### 1.1 Mise en place du projet Maven

Créez un projet Maven :

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

### 1.2 Ajouter les dépendances

Ajoutez les dépendances du SDK AWS dans `pom.xml` :

```xml title="pom.xml"
<dependencies>
  <dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.25.27</version>
  </dependency>
</dependencies>
```

Nous recommandons le SDK AWS pour Java v2, plus complet, qui prend en charge la programmation asynchrone et réactive.

---

## 2. Connexion à RustFS

### 2.1 Exemple complet

La classe suivante se compile et s’exécute telle quelle. Remplacez `localhost` par l’adresse IP de votre serveur si RustFS s’exécute sur une autre machine, et renseignez vos propres clés d’accès :

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

Sortie attendue :

```text
Bucket created: my-bucket
Uploaded hello.txt
Downloaded hello.txt
Found object: hello.txt
Deleted hello.txt
```

---

## 3. Dépannage

| Problème | Cause | Solution |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `S3Exception: 301 Moved Permanently` | Adressage de type chemin (path-style) non activé, ou erreur de région | Définissez `.forcePathStyle(true)` et utilisez la région `us-east-1` |
| `ConnectException: Connection refused` | RustFS n’est pas démarré, ou le port est incorrect | Vérifiez l’état de RustFS et le port |
| `403 Forbidden` | Clé d’accès ou clé secrète incorrecte | Vérifiez vos identifiants |
| Le chargement (upload) échoue sans réponse | Le SDK utilise HTTPS par défaut, et RustFS ne prend en charge que HTTP (ou nécessite des certificats) | Utilisez une adresse `http://` et définissez `endpointOverride` |

---

## 4. Annexe

### 4.1 Empaqueter et exécuter avec Maven

Empaquetez le projet :

```bash
mvn clean package
```

Exécutez-le :

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 Réglages RustFS recommandés

* Si RustFS sert du HTTP non chiffré, désactivez la validation des certificats TLS dans le SDK.
* Activez la prise en charge CORS si vous l’utilisez pour un frontal web.
* Nous recommandons de définir des limites telles que `max_object_size` et `max_part_size` afin d’éviter les échecs de transfert des fichiers volumineux.

---

Les exemples avancés suivants portent sur :

* La génération et l’utilisation d’URL présignées
* Le flux complet de chargement partitionné

---

## 5. Exemples avancés

### 5.1 Générer et utiliser des URL présignées

Les URL présignées donnent aux clients un accès temporaire à des objets privés sans exposer les identifiants. Elles servent couramment aux chargements et aux téléchargements directs depuis un navigateur.

#### 5.1.1 Générer un lien de téléchargement (GET)

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
    .signatureDuration(Duration.ofMinutes(15)) // 15 minutes validity
    .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);

System.out.println("Presigned URL: " + presignedRequest.url());
```

```text
Presigned URL: http://localhost:9000/my-bucket/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

Ouvrez l’URL dans un navigateur pour accéder à l’objet.

#### 5.1.2 URL présignée de chargement (PUT)

Vous pouvez aussi générer des URL de chargement :

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

### 5.2 Mettre en œuvre le chargement partitionné

Le chargement partitionné est la méthode recommandée pour charger des fichiers volumineux. Si le réseau est interrompu, vous pouvez réessayer les parties en échec au lieu de recommencer tout le chargement.

Les exemples ci-dessous réutilisent le client `s3` de la section 2 et nécessitent ces importations supplémentaires :

```java
import software.amazon.awssdk.services.s3.model.*;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
```

#### 5.2.1 Démarrer le chargement partitionné

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

#### 5.2.2 Charger chaque partie

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

#### 5.2.3 Terminer le chargement partitionné

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

#### 5.2.4 Abandonner le chargement en cas d’exception (facultatif)

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .uploadId(uploadId)
    .build();

s3.abortMultipartUpload(abortRequest);
```

---

Pour les autres opérations (étiquetage d’objets, politiques de compartiment, etc.), consultez la [documentation de l’AWS SDK pour Java v2](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/). La plupart des opérations S3 fonctionnent de la même manière avec RustFS ; les exceptions sont décrites dans la [compatibilité S3](/fr/reference/s3-compatibility).
