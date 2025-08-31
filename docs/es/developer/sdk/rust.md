---
title: "SDK Rust"
description: "Este documento explica principalmente el uso del SDK Rust en RustFS."
---

# RustFS Rust SDK

Ya que RustFS es un sistema de almacenamiento de objetos completamente compatible con S3, es posible construir un SDK Rust adecuado para RustFS mediante algunos wrappers del SDK Rust de S3. A través del SDK se pueden realizar operaciones de RustFS, incluyendo creación y eliminación de buckets/objetos, así como subida y descarga de archivos.

## Prerrequisitos

- Una instancia RustFS disponible (consulte la [guía de instalación](../../installation/index.md) para la instalación).
- Claves de acceso (consulte la [gestión de claves de acceso](../../administration/iam/access-token.md) para la creación).

## Construcción del SDK Rust RustFS

Construya una estructura de datos Config a partir de `region`, `access_key_id`, `secret_access_key` y `endpoint_url`, y lea la información correspondiente desde las variables de entorno:

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

Utilice la Config construida anteriormente con `aws_sdk_s3::Client` para construir el cliente RustFS:

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

Luego use el `rustfs_client` construido para realizar las operaciones correspondientes.

## Crear bucket

```rust
match rustfs_client
    .create_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket creado exitosamente");
    }
    Err(e) => {
        println!("Error al crear el bucket: {:?}", e);
        return Err(e.into());
    }
}
```

## Eliminar bucket

```rust
match rustfs_client
    .delete_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket eliminado exitosamente");
    }
    Err(e) => {
        println!("Error al eliminar el bucket: {:?}", e);
        return Err(e.into());
    }
}
```

## Listar buckets

```rust
match rustfs_client.list_buckets().send().await {
    Ok(res) => {
        println!("Número total de buckets: {:?}", res.buckets().len());
        for bucket in res.buckets() {
            println!("Bucket: {:?}", bucket.name());
        }
    }
    Err(e) => {
        println!("Error al listar buckets: {:?}", e);
        return Err(e.into());
    }
}
```

## Listar objetos

```rust
match rustfs_client
    .list_objects_v2()
    .bucket("rust-sdk-demo")
    .send()
    .await
{
    Ok(res) => {
        println!("Número total de objetos: {:?}", res.contents().len());
        for object in res.contents() {
            println!("Objeto: {:?}", object.key());
        }
    }
    Err(e) => {
        println!("Error al listar objetos: {:?}", e);
        return Err(e.into());
    }
}
```

## Subir archivo

```rust
let data = fs::read("/file-path/1.txt").await.expect("No se puede abrir el archivo");

match rustfs_client
    .put_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .body(ByteStream::from(data))
    .send()
    .await
{
    Ok(res) => {
        println!("Objeto subido exitosamente, respuesta: {:?}", res);
    }
    Err(e) => {
        println!("Error al subir objeto: {:?}", e);
        return Err(e.into());
    }
}
```

## Descargar objeto

```rust
match rustfs_client
    .get_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .send()
    .await
{
    Ok(res) => {
        println!("Objeto descargado exitosamente, respuesta: {:?}", res);
        
        // Escribir datos del objeto a archivo
        let mut body = res.body.collect().await?;
        let data = body.into_bytes();
        fs::write("/local-path/downloaded-1.txt", data).await?;
    }
    Err(e) => {
        println!("Error al descargar objeto: {:?}", e);
        return Err(e.into());
    }
}
```

## Uso adicional

Para otros usos, puede explorar por sí mismo. El SDK Rust ofrece seguridad de tipos completa y seguridad de memoria, lo que lo hace ideal para entornos de producción. Con Rust obtiene:

- Abstracciones de coste cero
- Seguridad de memoria sin recolector de basura
- Concurrencia sin carreras de datos
- Sobrecarga mínima en tiempo de ejecución
- Rendimiento excelente

Todas las funcionalidades avanzadas de S3 están soportadas, incluyendo subidas multipart, URLs prefirmadas y políticas de bucket.

