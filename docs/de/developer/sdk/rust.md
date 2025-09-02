---
title: "RustFS Rust SDK Verwendungsanleitung"
description: "Operationen auf RustFS-Instanzen über Rust SDK, einschließlich Erstellung und Löschung von Speicher-Buckets und Objekten."
---

# RustFS Rust SDK

Da RustFS ein vollständig S3-kompatibles Objektspeichersystem ist, kann ein für RustFS geeignetes Rust SDK durch Kapselung des S3 Rust SDK erstellt werden. Über das SDK können Operationen auf RustFS durchgeführt werden, einschließlich Erstellung und Löschung von Speicher-Buckets/Objekten, Hoch- und Herunterladen von Dateien usw.

## Voraussetzungen

- Eine verfügbare RustFS-Instanz (siehe [Installationsanleitung](../../installation/index.md) für die Installation).
- Zugriffsschlüssel (siehe [Zugriffsschlüsselverwaltung](../../administration/iam/access-token.md) für die Erstellung).

## RustFS Rust SDK-Konstruktion

Konstruieren Sie `region`, `access_key_id`, `secret_access_key` und `endpoint_url` als Config-Datenstruktur und lesen Sie entsprechende Informationen aus Umgebungsvariablen:

```
pub struct Config {
    pub region: String,
    pub access_key_id: String,
    pub secret_access_key: String,
    pub endpoint_url: String,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        let region = env::var("RUSTFS_REGION")?;
        let access_key_id = env::var("RUSTFS_ACCESS_KEY_ID")?;
        let secret_access_key = env::var("RUSTFS_SECRET_ACCESS_KEY")?;
        let endpoint_url = env::var("RUSTFS_ENDPOINT_URL")?;

        Ok(Config {
            region,
            access_key_id,
            secret_access_key,
            endpoint_url,
        })
    }
}
```

Verwenden Sie die oben konstruierte Config mit `aws_sdk_s3::Client`, um einen RustFS Client zu konstruieren:

```
let config = Config::from_env()?;

let credentials = Credentials::new(
    config.access_key_id,
    config.secret_access_key,
    None,
    None,
    "rustfs",
);

let s3_config = aws_sdk_s3::Config::builder()
    .region(Region::new(config.region))
    .credentials_provider(credentials)
    .endpoint_url(config.endpoint_url)
    .build();

let client = Client::from_conf(s3_config);
```

## Speicher-Bucket erstellen

```
async fn create_bucket(client: &Client, bucket_name: &str) -> Result<()> {
    let response = client
        .create_bucket()
        .bucket(bucket_name)
        .send()
        .await?;
    
    println!("Bucket erstellt: {:?}", response);
    Ok(())
}
```

## Speicher-Bucket löschen

```
async fn delete_bucket(client: &Client, bucket_name: &str) -> Result<()> {
    let response = client
        .delete_bucket()
        .bucket(bucket_name)
        .send()
        .await?;
    
    println!("Bucket gelöscht: {:?}", response);
    Ok(())
}
```

## Objekt hochladen

```
async fn upload_object(client: &Client, bucket_name: &str, key: &str, body: &str) -> Result<()> {
    let response = client
        .put_object()
        .bucket(bucket_name)
        .key(key)
        .body(body.as_bytes().to_vec().into())
        .send()
        .await?;
    
    println!("Objekt hochgeladen: {:?}", response);
    Ok(())
}
```

## Objekt herunterladen

```
async fn download_object(client: &Client, bucket_name: &str, key: &str) -> Result<String> {
    let response = client
        .get_object()
        .bucket(bucket_name)
        .key(key)
        .send()
        .await?;
    
    let body = response.body.collect().await?;
    let content = String::from_utf8(body.into_bytes())?;
    
    println!("Objekt-Inhalt: {}", content);
    Ok(content)
}
```

## Objekt löschen

```
async fn delete_object(client: &Client, bucket_name: &str, key: &str) -> Result<()> {
    let response = client
        .delete_object()
        .bucket(bucket_name)
        .key(key)
        .send()
        .await?;
    
    println!("Objekt gelöscht: {:?}", response);
    Ok(())
}
```

## Objekte auflisten

```
async fn list_objects(client: &Client, bucket_name: &str) -> Result<()> {
    let response = client
        .list_objects_v2()
        .bucket(bucket_name)
        .send()
        .await?;
    
    if let Some(contents) = response.contents {
        for object in contents {
            println!("Objekt: {}", object.key.unwrap_or_default());
        }
    }
    
    Ok(())
}
```

## Presigned URL generieren

```
async fn generate_presigned_url(client: &Client, bucket_name: &str, key: &str) -> Result<String> {
    let presigned_request = client
        .get_object()
        .bucket(bucket_name)
        .key(key)
        .presigned(PresigningConfig::expires_in(Duration::from_secs(3600))?)
        .await?;
    
    println!("Presigned URL: {}", presigned_request.uri());
    Ok(presigned_request.uri().to_string())
}
```

## Fehlerbehandlung

```
use aws_sdk_s3::error::S3Error;

async fn handle_errors(client: &Client, bucket_name: &str, key: &str) -> Result<()> {
    match client
        .get_object()
        .bucket(bucket_name)
        .key(key)
        .send()
        .await
    {
        Ok(response) => {
            println!("Objekt erfolgreich abgerufen: {:?}", response);
        }
        Err(S3Error::NoSuchBucket(_)) => {
            println!("Bucket existiert nicht");
        }
        Err(S3Error::NoSuchKey(_)) => {
            println!("Objekt existiert nicht");
        }
        Err(e) => {
            println!("Unbekannter Fehler: {}", e);
        }
    }
    
    Ok(())
}
```

## Vollständiges Beispiel

```
use aws_sdk_s3::{Client, Config as S3Config, Credentials, Region};
use aws_sdk_s3::presigning::PresigningConfig;
use std::env;
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Config::from_env()?;
    
    let credentials = Credentials::new(
        config.access_key_id,
        config.secret_access_key,
        None,
        None,
        "rustfs",
    );
    
    let s3_config = S3Config::builder()
        .region(Region::new(config.region))
        .credentials_provider(credentials)
        .endpoint_url(config.endpoint_url)
        .build();
    
    let client = Client::from_conf(s3_config);
    
    let bucket_name = "my-bucket";
    let key = "my-object";
    let body = "Hello, RustFS!";
    
    // Bucket erstellen
    create_bucket(&client, bucket_name).await?;
    
    // Objekt hochladen
    upload_object(&client, bucket_name, key, body).await?;
    
    // Objekt herunterladen
    let content = download_object(&client, bucket_name, key).await?;
    println!("Heruntergeladener Inhalt: {}", content);
    
    // Objekte auflisten
    list_objects(&client, bucket_name).await?;
    
    // Presigned URL generieren
    let presigned_url = generate_presigned_url(&client, bucket_name, key).await?;
    println!("Presigned URL: {}", presigned_url);
    
    // Objekt löschen
    delete_object(&client, bucket_name, key).await?;
    
    // Bucket löschen
    delete_bucket(&client, bucket_name).await?;
    
    Ok(())
}
```

## Zusammenfassung

Dieses Tutorial hat gezeigt, wie Sie:

1. RustFS Rust SDK konfigurieren
2. Speicher-Buckets erstellen und löschen
3. Objekte hochladen, herunterladen und löschen
4. Objekte auflisten
5. Presigned URLs generieren
6. Fehlerbehandlung implementieren

RustFS ist vollständig kompatibel mit dem AWS S3 SDK, sodass Sie alle Standard-S3-Operationen mit Rust verwenden können. Weitere Informationen finden Sie in der [AWS SDK für Rust Dokumentation](https://docs.aws.amazon.com/sdk-for-rust/).
