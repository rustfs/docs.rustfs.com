---
title: "Rust SDK"
description: "Dieses Dokument erklärt hauptsächlich die Verwendung des Rust SDK in RustFS."
---

# RustFS Rust SDK

Da RustFS ein vollständig S3-kompatibles Objektspeichersystem ist, kann durch einige Wrapper um das S3 Rust SDK ein für RustFS geeignetes Rust SDK erstellt werden. Über das SDK können RustFS-Operationen durchgeführt werden, einschließlich der Erstellung und Löschung von Buckets/Objekten sowie des Hoch- und Herunterladens von Dateien.

## Voraussetzungen

- Eine verfügbare RustFS-Instanz (siehe [Installationshandbuch](../../installation/index.md) für die Installation).
- Zugriffsschlüssel (siehe [Zugriffsschlüssel-Verwaltung](../../administration/iam/access-token.md) für die Erstellung).

## RustFS Rust SDK Konstruktion

Erstellen Sie eine Config-Datenstruktur aus `region`, `access_key_id`, `secret_access_key` und `endpoint_url` und lesen Sie die entsprechenden Informationen aus Umgebungsvariablen:

```rust
use std::env;
use aws_sdk_s3::{Client, Config as AwsConfig};
use aws_config::BehaviorVersion;
use aws_credential_types::Credentials;
use aws_types::region::Region;
use aws_smithy_types::byte_stream::ByteStream;
use tokio::fs;

pub struct Config {
    pub region: String,
    pub access_key_id: String,
    pub secret_access_key: String,
    pub endpoint_url: String,
}

impl Config {
    pub fn from_env() -> Result<Self, Box<dyn std::error::Error>> {
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

Verwenden Sie die oben erstellte Config mit `aws_sdk_s3::Client`, um einen RustFS-Client zu erstellen:

```rust
let config = Config::from_env()?;

let credentials = Credentials::new(
    config.access_key_id,
    config.secret_access_key,
    None,
    None,
    "rustfs",
);

let region = Region::new(config.region);
let endpoint_url = config.endpoint_url;

let shared_config = aws_config::defaults(BehaviorVersion::latest())
    .region(region)
    .credentials_provider(credentials)
    .endpoint_url(endpoint_url)
    .load()
    .await;

let rustfs_client = Client::new(&shared_config);
```

Anschließend verwenden Sie den erstellten `rustfs_client` für entsprechende Operationen.

## Bucket erstellen

```rust
match rustfs_client
    .create_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket erfolgreich erstellt");
    }
    Err(e) => {
        println!("Fehler beim Erstellen des Buckets: {:?}", e);
        return Err(e.into());
    }
}
```

## Bucket löschen

```rust
match rustfs_client
    .delete_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket erfolgreich gelöscht");
    }
    Err(e) => {
        println!("Fehler beim Löschen des Buckets: {:?}", e);
        return Err(e.into());
    }
}
```

## Buckets auflisten

```rust
match rustfs_client.list_buckets().send().await {
    Ok(res) => {
        println!("Gesamtanzahl der Buckets: {:?}", res.buckets().len());
        for bucket in res.buckets() {
            println!("Bucket: {:?}", bucket.name());
        }
    }
    Err(e) => {
        println!("Fehler beim Auflisten der Buckets: {:?}", e);
        return Err(e.into());
    }
}
```

## Objekte auflisten

```rust
match rustfs_client
    .list_objects_v2()
    .bucket("rust-sdk-demo")
    .send()
    .await
{
    Ok(res) => {
        println!("Gesamtanzahl der Objekte: {:?}", res.contents().len());
        for object in res.contents() {
            println!("Objekt: {:?}", object.key());
        }
    }
    Err(e) => {
        println!("Fehler beim Auflisten der Objekte: {:?}", e);
        return Err(e.into());
    }
}
```

## Datei hochladen

```rust
let data = fs::read("/file-path/1.txt").await.expect("Datei kann nicht geöffnet werden");

match rustfs_client
    .put_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .body(ByteStream::from(data))
    .send()
    .await
{
    Ok(res) => {
        println!("Objekt erfolgreich hochgeladen, Antwort: {:?}", res);
    }
    Err(e) => {
        println!("Fehler beim Hochladen des Objekts: {:?}", e);
        return Err(e.into());
    }
}
```

## Objekt herunterladen

```rust
match rustfs_client
    .get_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .send()
    .await
{
    Ok(res) => {
        println!("Objekt erfolgreich heruntergeladen, Antwort: {:?}", res);
        
        // Objektdaten in Datei schreiben
        let mut body = res.body.collect().await?;
        let data = body.into_bytes();
        fs::write("/local-path/downloaded-1.txt", data).await?;
    }
    Err(e) => {
        println!("Fehler beim Herunterladen des Objekts: {:?}", e);
        return Err(e.into());
    }
}
```

## Weitere Verwendung

Für weitere Verwendungen können Sie selbst erkunden. Das Rust SDK bietet vollständige Typsicherheit und Speichersicherheit, wodurch es ideal für Produktionsumgebungen ist. Mit Rust erhalten Sie:

- Zero-Cost Abstractions
- Speichersicherheit ohne Garbage Collection
- Concurrency ohne Datenrennen
- Minimale Laufzeitüberheads
- Hervorragende Performance

Alle erweiterten S3-Funktionen werden unterstützt, einschließlich Multipart-Uploads, vorsignierter URLs und Bucket-Richtlinien.

