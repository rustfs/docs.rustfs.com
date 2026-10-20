---
title: "Rust-SDK-Anleitung"
description: "Erstellen und löschen Sie Buckets und Objekte in RustFS mit dem AWS SDK für Rust."
---

RustFS enthält kein eigenes Rust-Client-Crate. Der Dienst ist S3-kompatibel, daher verwenden Sie das offizielle AWS SDK für Rust (`aws-sdk-s3`) und richten es auf Ihren RustFS-Server aus. Mit dem SDK erstellen und löschen Sie Buckets und laden Objekte hoch, herunter und löschen sie.

## Voraussetzungen

- Rust 1.78 oder höher (Installation über [rustup](https://rustup.rs/))
- Eine verfügbare RustFS-Instanz (siehe [Installationsanleitung](../../installation/index.md)). Die S3-API nimmt Verbindungen auf Port `9000` entgegen, die Console (Weboberfläche) auf Port `9001`
- Zugriffsschlüssel, die Sie bei der Installation über die Umgebungsvariablen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` setzen (siehe [Zugriffsschlüssel-Verwaltung](../../security-compliance/iam/access-token.md))

:::tip[Lokaler Test]

Wenn Sie bei der Installation keine Anmeldedaten gesetzt haben, verwendet der Server standardmäßig `rustfsadmin` / `rustfsadmin`. Das reicht für einen wegwerfbaren lokalen Test, niemals für eine Instanz, die andere erreichen können.

:::

Legen Sie ein Projekt an und fügen Sie die Abhängigkeiten hinzu:

```bash
cargo new rustfs-rust-demo && cd rustfs-rust-demo
cargo add aws-config aws-sdk-s3 anyhow
cargo add tokio --features full
```

Ihre `Cargo.toml` sollte Folgendes enthalten:

```toml title="Cargo.toml"
[dependencies]
anyhow = "1"
aws-config = "1"
aws-sdk-s3 = "1"
tokio = { version = "1", features = ["full"] }
```

## Client initialisieren

Das folgende Programm ist vollständig und ausführbar. Es lädt die Verbindungseinstellungen aus Umgebungsvariablen, initialisiert den S3-Client und listet Ihre Buckets auf:

```rust title="src/main.rs"
use anyhow::Result;
use aws_config::BehaviorVersion;
use aws_sdk_s3::config::{Credentials, Region};
use aws_sdk_s3::Client;
use std::env;

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

#[tokio::main]
async fn main() -> Result<()> {
    let config = Config::from_env()?;

    let credentials = Credentials::new(
        config.access_key_id,
        config.secret_access_key,
        None,
        None,
        "rustfs",
    );

    let region = Region::new(config.region);

    let shared_config = aws_config::defaults(BehaviorVersion::latest())
        .region(region)
        .credentials_provider(credentials)
        .endpoint_url(config.endpoint_url)
        .load()
        .await;

    // RustFS uses path-style URLs by default; virtual-host style requires RUSTFS_SERVER_DOMAINS
    let s3_config = aws_sdk_s3::config::Builder::from(&shared_config)
        .force_path_style(true)
        .build();

    let rustfs_client = Client::from_conf(s3_config);

    let res = rustfs_client.list_buckets().send().await?;
    for bucket in res.buckets() {
        println!("Bucket: {:?}", bucket.name());
    }

    Ok(())
}
```

:::note

Diese Namen von Umgebungsvariablen (`RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION`, `RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`) sind nur Konventionen auf der Client-Seite dieses Beispiels. Ihr Programm liest sie, nicht RustFS. Sie unterscheiden sich von den serverseitigen Variablen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY`, die bei der Installation von RustFS verwendet werden.

:::

Führen Sie das Programm aus (ersetzen Sie `localhost` durch die IP-Adresse Ihres Servers, wenn RustFS auf einem anderen Rechner läuft):

```bash
export RUSTFS_ENDPOINT_URL="http://localhost:9000"
export RUSTFS_REGION="us-east-1"
export RUSTFS_ACCESS_KEY_ID="<your-access-key>"
export RUSTFS_SECRET_ACCESS_KEY="<your-secret-key>"
cargo run
```

```text
Bucket: Some("my-bucket")
```

Sie können den Client nun für die folgenden Operationen verwenden. Jeder Ausschnitt läuft in `main` und verwendet `rustfs_client` weiter.

## Bucket erstellen

```rust
match rustfs_client
    .create_bucket()
    .bucket("my-bucket")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket created successfully");
    }
    Err(e) => {
        println!("Error creating bucket: {:?}", e);
        return Err(e.into());
    }
}
```

```text
Bucket created successfully
```

## Bucket löschen

```rust
match rustfs_client
    .delete_bucket()
    .bucket("my-bucket")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket deleted successfully");
    }
    Err(e) => {
        println!("Error deleting bucket: {:?}", e);
        return Err(e.into());
    }
}
```

```text
Bucket deleted successfully
```

## Buckets auflisten

```rust
match rustfs_client.list_buckets().send().await {
    Ok(res) => {
        println!("Total buckets number is {:?}", res.buckets().len());
        for bucket in res.buckets() {
            println!("Bucket: {:?}", bucket.name());
        }
    }
    Err(e) => {
        println!("Error listing buckets: {:?}", e);
        return Err(e.into());
    }
}
```

```text
Total buckets number is 1
Bucket: Some("my-bucket")
```

## Objekte auflisten

```rust
match rustfs_client
    .list_objects_v2()
    .bucket("my-bucket")
    .send()
    .await
{
    Ok(res) => {
        println!("Total objects number is {:?}", res.contents().len());
        for object in res.contents() {
            println!("Object: {:?}", object.key());
        }
    }
    Err(e) => {
        println!("Error listing objects: {:?}", e);
        return Err(e.into());
    }
}
```

```text
Total objects number is 1
Object: Some("hello.txt")
```

## Datei hochladen

Fügen Sie diese Imports am Anfang von `src/main.rs` hinzu:

```rust
use aws_sdk_s3::primitives::ByteStream;
use tokio::fs;
```

Laden Sie anschließend eine lokale Datei hoch:

```rust
let data = fs::read("/path/to/hello.txt").await.expect("can not open the file");

match rustfs_client
    .put_object()
    .bucket("my-bucket")
    .key("hello.txt")
    .body(ByteStream::from(data))
    .send()
    .await
{
    Ok(res) => {
        println!("Object uploaded successfully, res: {:?}", res);
    }
    Err(e) => {
        println!("Error uploading object: {:?}", e);
        return Err(e.into());
    }
}
```

```text
Object uploaded successfully, res: PutObjectOutput { e_tag: Some("\"...\""), ... }
```

## Objekt herunterladen

```rust
match rustfs_client
    .get_object()
    .bucket("my-bucket")
    .key("hello.txt")
    .send()
    .await
{
    Ok(res) => {
        let data = res.body.collect().await?.into_bytes();
        println!("Object content: {}", String::from_utf8_lossy(&data));
    }
    Err(e) => {
        println!("Error downloading object: {:?}", e);
        return Err(e.into());
    }
}
```

```text
Object content: hello rustfs
```

Weitere Operationen (vorsignierte URLs, mehrteilige Uploads und mehr) stehen in der [Dokumentation zum AWS SDK für Rust](https://docs.aws.amazon.com/sdk-for-rust/latest/dg/). Die meisten S3-Operationen funktionieren gegenüber RustFS auf dieselbe Weise. Ausnahmen stehen unter [S3-Kompatibilität](/de/reference/s3-compatibility).
