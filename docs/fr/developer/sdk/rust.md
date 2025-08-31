---
title: "SDK Rust"
description: "Ce document explique principalement l'utilisation du SDK Rust dans RustFS."
---

# RustFS Rust SDK

Étant donné que RustFS est un système de stockage d'objets entièrement compatible S3, il est possible de construire un SDK Rust adapté à RustFS en encapsulant le SDK Rust S3. Grâce au SDK, les opérations RustFS peuvent être effectuées, y compris la création et suppression de buckets/objets, ainsi que le téléchargement et téléversement de fichiers.

## Prérequis

- Une instance RustFS disponible (consultez le [guide d'installation](../../installation/index.md) pour l'installation).
- Clés d'accès (consultez la [gestion des clés d'accès](../../administration/iam/access-token.md) pour la création).

## Construction du SDK Rust RustFS

Construisez une structure de données Config à partir de `region`, `access_key_id`, `secret_access_key` et `endpoint_url`, et lisez les informations correspondantes depuis les variables d'environnement :

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

Utilisez la Config construite ci-dessus avec `aws_sdk_s3::Client` pour construire le client RustFS :

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

Ensuite, utilisez le `rustfs_client` construit pour effectuer les opérations correspondantes.

## Créer un bucket

```rust
match rustfs_client
    .create_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket créé avec succès");
    }
    Err(e) => {
        println!("Erreur lors de la création du bucket : {:?}", e);
        return Err(e.into());
    }
}
```

## Supprimer un bucket

```rust
match rustfs_client
    .delete_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket supprimé avec succès");
    }
    Err(e) => {
        println!("Erreur lors de la suppression du bucket : {:?}", e);
        return Err(e.into());
    }
}
```

## Lister les buckets

```rust
match rustfs_client.list_buckets().send().await {
    Ok(res) => {
        println!("Nombre total de buckets : {:?}", res.buckets().len());
        for bucket in res.buckets() {
            println!("Bucket : {:?}", bucket.name());
        }
    }
    Err(e) => {
        println!("Erreur lors de la liste des buckets : {:?}", e);
        return Err(e.into());
    }
}
```

## Lister les objets

```rust
match rustfs_client
    .list_objects_v2()
    .bucket("rust-sdk-demo")
    .send()
    .await
{
    Ok(res) => {
        println!("Nombre total d'objets : {:?}", res.contents().len());
        for object in res.contents() {
            println!("Objet : {:?}", object.key());
        }
    }
    Err(e) => {
        println!("Erreur lors de la liste des objets : {:?}", e);
        return Err(e.into());
    }
}
```

## Téléverser un fichier

```rust
let data = fs::read("/file-path/1.txt").await.expect("Impossible d'ouvrir le fichier");

match rustfs_client
    .put_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .body(ByteStream::from(data))
    .send()
    .await
{
    Ok(res) => {
        println!("Objet téléversé avec succès, réponse : {:?}", res);
    }
    Err(e) => {
        println!("Erreur lors du téléversement de l'objet : {:?}", e);
        return Err(e.into());
    }
}
```

## Télécharger un objet

```rust
match rustfs_client
    .get_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .send()
    .await
{
    Ok(res) => {
        println!("Objet téléchargé avec succès, réponse : {:?}", res);
        
        // Écrire les données de l'objet dans un fichier
        let mut body = res.body.collect().await?;
        let data = body.into_bytes();
        fs::write("/local-path/downloaded-1.txt", data).await?;
    }
    Err(e) => {
        println!("Erreur lors du téléchargement de l'objet : {:?}", e);
        return Err(e.into());
    }
}
```

## Utilisation supplémentaire

Pour d'autres utilisations, vous pouvez explorer par vous-même. Le SDK Rust offre une sécurité de type complète et une sécurité mémoire, ce qui le rend idéal pour les environnements de production. Avec Rust, vous obtenez :

- Des abstractions à coût nul
- Sécurité mémoire sans ramasse-miettes
- Concurrence sans courses de données
- Surcharges d'exécution minimales
- Performances excellentes

Toutes les fonctionnalités S3 avancées sont supportées, y compris les téléchargements multipart, les URL pré-signées et les politiques de bucket.

