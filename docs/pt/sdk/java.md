---
title: "Java SDK"
description: "Este documento explica como usar o AWS S3 Java SDK com o RustFS."
---

# Java SDK

RustFS é compatível com o protocolo S3 e integra com o AWS S3 SDK. Este guia usa o AWS SDK para Java como exemplo para configurar o ambiente, conectar ao RustFS e realizar operações básicas.

## 1. Integrar o AWS S3 Java SDK

### 1.1 Criar projeto Maven

Estrutura sugerida:

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

### 1.2 Dependências

Em `pom.xml`:

```xml
<dependencies>
 <dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3</artifactId>
 <version>2.25.27</version>
 </dependency>
</dependencies>
```

> Recomenda‑se o AWS SDK v2 (suporta assíncrono, reativo, etc.).

---

## 2. Conectar e usar o RustFS

### 2.1 Inicializar cliente S3

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
 // 1. Inicializar cliente S3
 S3Client s3 = S3Client.builder()
 .endpointOverride(URI.create("http://192.168.1.100:9000")) // endereço do RustFS
 .region(Region.US_EAST_1) // valor arbitrário; RustFS não valida a região
 .credentialsProvider(
 StaticCredentialsProvider.create(
 AwsBasicCredentials.create("rustfsadmin", "rustfssecret")
 )
 )
 .forcePathStyle(true) // necessário: RustFS requer Path‑Style
 .build();

 // 2. Criar bucket
 String bucket = "my-bucket";
 try {
 s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
 System.out.println("Bucket created: " + bucket);
 } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {
 System.out.println("Bucket already exists.");
 }

 // 3. Upload de arquivo
 s3.putObject(
 PutObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
 Paths.get("hello.txt")
 );
 System.out.println("Uploaded hello.txt");

 // 4. Download de arquivo
 s3.getObject(
 GetObjectRequest.builder().bucket(bucket).key("hello.txt").build(),
 Paths.get("downloaded-hello.txt")
 );
 System.out.println("Downloaded hello.txt");

 // 5. Listar objetos
 ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());
 listResponse.contents().forEach(obj -> System.out.println("Found object: " + obj.key()));

 // 6. Excluir objeto
 s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key("hello.txt").build());
 System.out.println("Deleted hello.txt");

 // 7. Excluir bucket (opcional)
 // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());
 }
}
```

---

## 3. FAQ e troubleshooting

| Problema | Causa | Solução |
| -------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `S3Exception: 301 Moved Permanently` | Path‑style desativado ou região incorreta | Ative `.forcePathStyle(true)` e use região arbitrária |
| `ConnectException: Connection refused` | RustFS inativo ou porta incorreta | Verifique serviço e porta |
| `403 Forbidden` | AccessKey/SecretKey incorretas | Corrija credenciais |
| Upload sem resposta | SDK usa HTTPS por padrão e RustFS pode exigir HTTP | Use `http://` em `endpointOverride` ou configure TLS |

---

## 4. Anexos

### 4.1 Pacote e execução Maven

```bash
mvn clean package
```

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 Recomendações de configuração do RustFS

- Se usar HTTP, desabilite validação SSL do cliente
- Habilite CORS (para front‑end Web)
- Configure limites como `max_object_size` e `max_part_size`

---

A seguir, exemplos avançados do Java SDK: Presigned URL e Multipart Upload.

---

## 5. Funcionalidades avançadas

### 5.1 Presigned URL

> Permite acesso temporário sem expor credenciais (útil para upload/download em navegador).

#### 5.1.1 Dependência (módulo `s3-presigner`)

```xml
<dependency>
 <groupId>software.amazon.awssdk</groupId>
 <artifactId>s3-presigner</artifactId>
 <version>2.25.27</version>
</dependency>
```

#### 5.1.2 Gerar link de download (GET)

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
 .signatureDuration(Duration.ofMinutes(15)) // válido por 15 minutos
 .build();

PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);

System.out.println("Presigned URL: " + presignedRequest.url());
```

> 🔗 Abra o link no navegador para acessar o objeto.

#### 5.1.3 Gerar link de upload (PUT)

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

### 5.2 Multipart Upload

> Recomendado para arquivos grandes; suporta retomada em redes instáveis.

#### 5.2.1 Iniciar upload multipart

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

#### 5.2.2 Enviar partes

```java
List<CompletedPart> completedParts = new ArrayList<>();
for (int i = 1; i <= 3; i++) {
 String partPath = "part" + i + ".bin"; // supondo arquivos locais
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

#### 5.2.3 Concluir upload multipart

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

#### 5.2.4 Abortar upload (opcional)

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
 .bucket("my-bucket")
 .key("bigfile.zip")
 .uploadId(uploadId)
 .build();

s3.abortMultipartUpload(abortRequest);
```
