---
title: "Java"
description: "公式の AWS SDK for Java v2 を RustFS で使います。"
---

RustFS は独自の Java SDK を提供していません。S3 互換であるため、公式の AWS SDK for Java v2 を、RustFS サーバーを指すように設定して使います。

## 1. 前提条件

* Java 8 以降と Maven（または Gradle）
* 稼働している RustFS インスタンス（[インストールガイド](../../installation/index.md)を参照）。S3 API はポート `9000`、Console はポート `9001` で待ち受けます
* インストール時に環境変数 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` で設定するアクセスキー（[アクセスキーの管理](../../security-compliance/iam/access-token.md)を参照）

:::tip[ローカル検証]

インストール時に認証情報を設定しなかった場合、サーバーの既定値は `rustfsadmin` / `rustfsadmin` です。使い捨てのローカル検証であれば問題ありませんが、外部から到達できる環境では使わないでください。

:::

### 1.1 Maven プロジェクトの準備

新しい Maven プロジェクトを作成します。

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

### 1.2 依存関係の追加

`pom.xml` に AWS SDK の依存関係を追加します。

```xml title="pom.xml"
<dependencies>
  <dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.25.27</version>
  </dependency>
</dependencies>
```

AWS SDK for Java v2 の使用を推奨します。機能が充実しており、非同期プログラミングとリアクティブプログラミングに対応しています。

---

## 2. RustFS への接続

### 2.1 完全な例

次のクラスは、そのままコンパイルして実行できます。RustFS が別のマシンで動作している場合は `localhost` をサーバーの IP アドレスに置き換え、アクセスキーも自分の値にします。

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

想定される出力:

```text
Bucket created: my-bucket
Uploaded hello.txt
Downloaded hello.txt
Found object: hello.txt
Deleted hello.txt
```

---

## 3. トラブルシューティング

| 問題 | 原因 | 対処 |
| --- | --- | --- |
| `S3Exception: 301 Moved Permanently` | パススタイルアクセスが有効でない、またはリージョンが誤っている | `.forcePathStyle(true)` を設定し、リージョンには `us-east-1` を使います |
| `ConnectException: Connection refused` | RustFS が起動していない、またはポートが誤っている | RustFS の状態とポートを確認します |
| `403 Forbidden` | アクセスキーまたはシークレットキーが誤っている | 認証情報を確認します |
| 応答がないままアップロードが失敗する | SDK の既定は HTTPS であり、RustFS は HTTP のみに対応している（HTTPS には証明書が必要） | `http://` のアドレスを使い、`endpointOverride` を設定します |

---

## 4. 付録

### 4.1 Maven でのパッケージ化と実行

プロジェクトをパッケージ化します。

```bash
mvn clean package
```

実行します。

```bash
java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example
```

### 4.2 推奨する RustFS の設定

* RustFS が平文の HTTP で提供している場合は、SDK 側で TLS 証明書の検証を無効にします。
* Web フロントエンドで使う場合は、CORS を有効にします。
* 大きなファイルの転送失敗を防ぐため、`max_object_size` や `max_part_size` などの上限を設定することを推奨します。

---

応用例では、次の内容を扱います。

* 署名付き URL の生成と利用
* マルチパートアップロードの一連の手順

---

## 5. 応用例

### 5.1 署名付き URL の生成と利用

署名付き URL を使うと、認証情報を公開せずに、クライアントが非公開オブジェクトへ一時的にアクセスできます。ブラウザーからの直接アップロードやダウンロードでよく使います。

#### 5.1.1 ダウンロードリンクの生成（GET）

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

ブラウザーで URL を開くと、オブジェクトにアクセスできます。

#### 5.1.2 アップロード用の署名付き URL（PUT）

アップロード用の URL も生成できます。

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

### 5.2 マルチパートアップロードの実装

大きなファイルのアップロードには、マルチパートアップロードを推奨します。ネットワークが中断しても、アップロード全体をやり直さず、失敗したパートだけを再試行できます。

以下の例では、セクション 2 の `s3` クライアントを再利用します。次の import も必要です。

```java
import software.amazon.awssdk.services.s3.model.*;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
```

#### 5.2.1 マルチパートアップロードの開始

```java
CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .build();

CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);
String uploadId = createResponse.uploadId();
```

#### 5.2.2 各パートのアップロード

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

#### 5.2.3 マルチパートアップロードの完了

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

#### 5.2.4 例外時のアップロード中止（任意）

```java
AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()
    .bucket("my-bucket")
    .key("bigfile.zip")
    .uploadId(uploadId)
    .build();

s3.abortMultipartUpload(abortRequest);
```

---

オブジェクトのタグ付けやバケットポリシーなどの操作については、[AWS SDK for Java v2 のドキュメント](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/)を参照します。ほとんどの S3 操作は、RustFS に対しても同じように動作します。例外は [S3 互換性](/ja/reference/s3-compatibility) を参照します。
