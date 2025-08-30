---
title: "SDK Java"
description: "Ce document explique principalement l'utilisation du SDK Java dans RustFS."
---

# SDK Java

RustFS est un système de stockage d'objets compatible avec le protocole S3, prenant en charge l'intégration avec le système via les SDK AWS S3. Ce document prendra l'exemple du SDK Java AWS S3 pour introduire comment construire un environnement de développement à partir de zéro, se connecter à RustFS et effectuer les opérations de base du stockage d'objets.

## 1. Intégration du SDK Java AWS S3

### 1.1 Créer un projet Maven

Utilisez la structure de répertoire suivante ou créez un nouveau projet Maven dans un IDE :

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

### 1.2 Ajouter des dépendances

Ajoutez la dépendance AWS SDK dans `pom.xml` :

```xml
<dependencies>
 <dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3</artifactId>
 <version>2.25.27</version>
 </dependency>
</dependencies>
```

> Il est recommandé d'utiliser la version AWS SDK v2, qui est plus fonctionnelle et prend en charge les modes asynchrone et réactif.

---

## 2. Connexion et utilisation de RustFS

### 2.1 Initialiser le client S3

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
 // 1. Initialiser le client S3
 S3Client s3 = S3Client.builder()
 .endpointOverride(URI.create("http://192.168.1.100:9000")) // Adresse RustFS
 .region(Region.US_EAST_1) // Peut être codé en dur, RustFS ne vérifie pas la région
 .credentialsProvider(
 StaticCredentialsProvider.create(
 AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
 )
 )
 .forcePathStyle(true) // Configuration clé ! RustFS nécessite d'activer Path-Style
 .build();

 // 2. Créer un Bucket
 String bucket = "my-bucket";
 try {
 s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
 System.out.println("Bucket created: " + bucket);
 } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {
 System.out.println("Bucket already exists.");
 }

 // 3. Télécharger un fichier
 s3.putObject(
 PutObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
 Paths.get("hello.txt")
 );
 System.out.println("Uploaded hello.txt");

 // 4. Télécharger un fichier
 s3.getObject(
 GetObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
 Paths.get("downloaded-hello.txt")
 );
 System.out.println("Downloaded hello.txt");

 // 5. Lister les objets
 ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());
 listResponse.contents().forEach(obj -> System.out.println("Found object: " + obj.key()));

 // 6. Supprimer un objet
 s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key("hello.txt").build());
 System.out.println("Deleted hello.txt");

 // 7. Supprimer le bucket (optionnel)
 // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());
 }
}
```

---

## 3. Problèmes courants et dépannage

| Problème | Cause | Solution |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `S3Exception: 301 Moved Permanently` | Path-style non activé ou région incorrecte | Définir `.forcePathStyle(true)` et utiliser n'importe quelle région |
| `ConnectException: Connection refused` | RustFS non démarré ou port incorrect | Vérifier le statut et le port de RustFS |
| `403 Forbidden` | AccessKey / SecretKey incorrect | Vérifier la configuration d'authentification |
| Échec du téléchargement sans réponse | Le SDK utilise HTTPS par défaut, RustFS ne prend en charge que HTTP (ou nécessite un certificat) | Utiliser l'adresse `http://` et configurer `endpointOverride` |

---

## 4. Annexe

### 4.1 Empaquetage Maven

Empaqueter le projet :

```bash
mvn clean package
```

Exécuter :

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 Suggestions de configuration RustFS

* S'assurer de désactiver la vérification SSL lors de l'utilisation du protocole HTTP.
* Activer le support CORS (si utilisé pour le front-end Web).
* Il est recommandé de définir des limites comme `max_object_size` et `max_part_size` pour éviter les échecs de transfert de gros fichiers.

---

Voici un **complément d'exemples de fonctionnalités avancées pour RustFS utilisant le SDK Java AWS S3**, incluant :

* Génération et utilisation d'URL pré-signées (Presigned URL)
* Processus complet de téléchargement en plusieurs parties (Multipart Upload)

---

## 5. Exemples de fonctionnalités avancées Java

### 5.1 Génération et utilisation d'URL pré-signées (Presigned URL)

> Les URL pré-signées permettent aux clients d'accéder temporairement à des objets privés sans exposer les informations d'identification, largement utilisées dans les scénarios de téléchargement ou de téléversement direct de fichiers par navigateur.

#### 5.1.1 Ajouter une dépendance (le module de signature d'URL du SDK v2 se trouve dans `s3-presigner`)

```xml
<dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3-presigner</artifactId>
 <version>2.25.27</version>
</dependency>
```

#### 5.1.2 Générer un lien de téléchargement (GET)

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
 .signatureDuration(Duration.ofMinutes(15)) // Valide pendant 15 minutes
 .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);

System.out.println("Presigned URL: " + presignedRequest.url());
```

> 🔗 Ouvrez le lien dans un navigateur pour accéder à cet objet.

#### 5.1.3 URL pré-signée pour téléchargement (PUT)

De même, vous pouvez aussi générer une URL de téléchargement :

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

### 5.2 Implémentation du téléchargement en plusieurs parties (Multipart Upload)

> Multipart Upload est la méthode recommandée pour télécharger de gros fichiers, permettant de reprendre le téléchargement en cas de fluctuation du réseau.

#### 5.2.1 Démarrer le téléchargement en plusieurs parties

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

#### 5.2.2 Télécharger chaque partie

```java
List<CompletedPart> completedParts = new ArrayList<>();
for (int i = 1; i <= 3; i++) {
 String partPath = "part" + i + ".bin"; // Supposons que chaque partie est un fichier local
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

#### 5.2.3 Terminer le téléchargement en plusieurs parties

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

#### 5.2.4 Abandonner le téléchargement en cas d'exception (optionnel)

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .uploadId(uploadId)
 .build();

s3.abortMultipartUpload(abortRequest);
```

