---
title: "Rust SDK"
description: "Este documento explica principalmente o uso do Rust SDK no RustFS."
---

# RustFS Rust SDK

Como o RustFS é um sistema de armazenamento de objetos totalmente compatível com S3, é possível construir um Rust SDK adequado para RustFS envolvendo o S3 Rust SDK. Através do SDK, as operações do RustFS podem ser executadas, incluindo criação e exclusão de buckets/objetos, bem como upload e download de arquivos.

## Pré-requisitos

- Uma instância RustFS disponível (consulte o [Guia de Instalação](../../installation/index.md) para instalação).
- Chaves de acesso (consulte [Gerenciamento de Chave de Acesso](../../administration/iam/access-token.md) para criação).

## Construção do RustFS Rust SDK

Construa uma estrutura de dados Config a partir de `region`, `access_key_id`, `secret_access_key` e `endpoint_url`, e leia as informações correspondentes das variáveis de ambiente:

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

Use a Config construída acima com `aws_sdk_s3::Client` para construir o cliente RustFS:

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

Em seguida, use o `rustfs_client` construído para executar as operações correspondentes.

## Criar Bucket

```rust
match rustfs_client
    .create_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket criado com sucesso");
    }
    Err(e) => {
        println!("Erro ao criar bucket: {:?}", e);
        return Err(e.into());
    }
}
```

## Excluir Bucket

```rust
match rustfs_client
    .delete_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket excluído com sucesso");
    }
    Err(e) => {
        println!("Erro ao excluir bucket: {:?}", e);
        return Err(e.into());
    }
}
```

## Listar Buckets

```rust
match rustfs_client.list_buckets().send().await {
    Ok(res) => {
        println!("Número total de buckets: {:?}", res.buckets().len());
        for bucket in res.buckets() {
            println!("Bucket: {:?}", bucket.name());
        }
    }
    Err(e) => {
        println!("Erro ao listar buckets: {:?}", e);
        return Err(e.into());
    }
}
```

## Listar Objetos

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
        println!("Erro ao listar objetos: {:?}", e);
        return Err(e.into());
    }
}
```

## Fazer Upload de Arquivo

```rust
let data = fs::read("/file-path/1.txt").await.expect("Não foi possível abrir o arquivo");

match rustfs_client
    .put_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .body(ByteStream::from(data))
    .send()
    .await
{
    Ok(res) => {
        println!("Objeto enviado com sucesso, resposta: {:?}", res);
    }
    Err(e) => {
        println!("Erro ao enviar objeto: {:?}", e);
        return Err(e.into());
    }
}
```

## Baixar Objeto

```rust
match rustfs_client
    .get_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .send()
    .await
{
    Ok(res) => {
        println!("Objeto baixado com sucesso, resposta: {:?}", res);
        
        // Escrever dados do objeto para arquivo
        let mut body = res.body.collect().await?;
        let data = body.into_bytes();
        fs::write("/local-path/downloaded-1.txt", data).await?;
    }
    Err(e) => {
        println!("Erro ao baixar objeto: {:?}", e);
        return Err(e.into());
    }
}
```

## Uso Adicional

Para outros usos, você pode explorar por conta própria. O Rust SDK fornece segurança de tipo completa e segurança de memória, tornando-o ideal para ambientes de produção. Com Rust, você obtém:

- Abstrações de custo zero
- Segurança de memória sem coleta de lixo
- Concorrência sem corridas de dados
- Overhead mínimo de tempo de execução
- Excelente performance

Todos os recursos avançados do S3 são suportados, incluindo uploads multipartes, URLs pré-assinadas e políticas de bucket.
