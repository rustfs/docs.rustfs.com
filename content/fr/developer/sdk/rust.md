---
title: "Guide du SDK Rust"
description: "Utilisez le SDK AWS pour Rust afin de créer et de supprimer des compartiments et des objets dans RustFS."
---

RustFS ne fournit pas de crate client Rust propre. Il est compatible avec S3 : vous utilisez donc le SDK AWS officiel pour Rust (`aws-sdk-s3`), configuré pour pointer vers votre serveur RustFS. Avec ce SDK, vous pouvez créer et supprimer des compartiments (buckets), charger (upload) et télécharger des objets, ainsi que les supprimer.

## Prérequis

- Rust 1.78 ou ultérieur (installation via [rustup](https://rustup.rs/))
- Une instance RustFS disponible (reportez-vous au [guide d’installation](../../installation/index.md)) : l’API S3 écoute sur le port `9000`, la Console sur le port `9001`
- Des clés d’accès, définies à l’installation par les variables d’environnement `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` (reportez-vous à la [gestion des clés d’accès](../../security-compliance/iam/access-token.md))

:::tip[Essai local]

Si vous n’avez pas défini d’identifiants à l’installation, le serveur utilise par défaut `rustfsadmin` / `rustfsadmin`. Cela convient à un essai local jetable, jamais à une instance accessible à d’autres personnes.

:::

Créez un projet et ajoutez les dépendances :

```bash
cargo new rustfs-rust-demo && cd rustfs-rust-demo
cargo add aws-config aws-sdk-s3 anyhow
cargo add tokio --features full
```

Votre `Cargo.toml` devrait contenir :

```toml title="Cargo.toml"
[dependencies]
anyhow = "1"
aws-config = "1"
aws-sdk-s3 = "1"
tokio = { version = "1", features = ["full"] }
```

## Initialisation du client

Le programme suivant est complet et exécutable. Il charge les paramètres de connexion depuis les variables d’environnement, initialise le client S3 et liste vos compartiments :

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

Ces noms de variables d’environnement (`RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION`, `RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`) ne sont que des conventions côté client propres à cet exemple : c’est votre programme qui les lit, et non RustFS. Ces noms sont distincts des variables côté serveur `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY`, utilisées lors de l’installation de RustFS.

:::

Exécutez-le (remplacez `localhost` par l’adresse IP de votre serveur si RustFS s’exécute sur une autre machine) :

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

Vous pouvez maintenant utiliser le client pour les opérations ci-dessous. Chaque extrait s’exécute dans `main` et réutilise `rustfs_client`.

## Créer un compartiment

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

## Supprimer un compartiment

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

## Lister les compartiments

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

## Lister les objets

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

## Charger un fichier

Ajoutez ces importations en tête de `src/main.rs` :

```rust
use aws_sdk_s3::primitives::ByteStream;
use tokio::fs;
```

Chargez ensuite un fichier local :

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

## Télécharger un objet

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

Pour les autres opérations (URL présignées, chargements partitionnés, etc.), consultez la [documentation de l’AWS SDK pour Rust](https://docs.aws.amazon.com/sdk-for-rust/latest/dg/). La plupart des opérations S3 fonctionnent de la même manière avec RustFS ; les exceptions sont décrites dans la [compatibilité S3](/fr/reference/s3-compatibility).
