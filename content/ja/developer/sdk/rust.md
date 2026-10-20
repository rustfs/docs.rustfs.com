---
title: "Rust"
description: "AWS SDK for Rust を使い、RustFS でバケットとオブジェクトを作成および削除します。"
---

RustFS は独自の Rust クライアントクレートを提供していません。S3 互換であるため、公式の AWS SDK for Rust（`aws-sdk-s3`）を、RustFS サーバーを指すように設定して使います。この SDK で、バケットの作成と削除、およびオブジェクトのアップロード、ダウンロード、削除ができます。

## 前提条件

- Rust 1.78 以降（[rustup](https://rustup.rs/) でインストールします）
- 利用できる RustFS インスタンス（[インストールガイド](../../installation/index.md)を参照）。S3 API はポート `9000`、Console はポート `9001` で待ち受けます
- インストール時に環境変数 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` で設定するアクセスキー（[アクセスキーの管理](../../security-compliance/iam/access-token.md)を参照）

:::tip[ローカル検証]

インストール時に認証情報を設定しなかった場合、サーバーの既定値は `rustfsadmin` / `rustfsadmin` です。使い捨てのローカル検証であれば問題ありませんが、外部から到達できる環境では使わないでください。

:::

プロジェクトを作成し、依存関係を追加します。

```bash
cargo new rustfs-rust-demo && cd rustfs-rust-demo
cargo add aws-config aws-sdk-s3 anyhow
cargo add tokio --features full
```

`Cargo.toml` は、次の内容になっているはずです。

```toml title="Cargo.toml"
[dependencies]
anyhow = "1"
aws-config = "1"
aws-sdk-s3 = "1"
tokio = { version = "1", features = ["full"] }
```

## クライアントの初期化

次のプログラムは、そのまま実行できます。環境変数から接続設定を読み込み、S3 クライアントを初期化して、バケットを一覧します。

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

これらの環境変数名（`RUSTFS_ENDPOINT_URL`、`RUSTFS_REGION`、`RUSTFS_ACCESS_KEY_ID`、`RUSTFS_SECRET_ACCESS_KEY`）は、この例だけのクライアント側の取り決めです。このプログラムが読み取り、RustFS サーバーは参照しません。インストール時に使うサーバー側の `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` とは別の変数です。

:::

実行します（RustFS が別のマシンで動作している場合は、`localhost` をサーバーの IP アドレスに置き換えます）。

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

これで、以下の操作にクライアントを使えます。各コード片は `main` の中で実行し、`rustfs_client` を再利用します。

## バケットの作成

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

## バケットの削除

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

## バケットの一覧

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

## オブジェクトの一覧

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

## ファイルのアップロード

`src/main.rs` の先頭に、次の import を追加します。

```rust
use aws_sdk_s3::primitives::ByteStream;
use tokio::fs;
```

続けて、ローカルファイルをアップロードします。

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

## オブジェクトのダウンロード

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

署名付き URL、マルチパートアップロードなどの操作については、[AWS SDK for Rust のドキュメント](https://docs.aws.amazon.com/sdk-for-rust/latest/dg/)を参照します。ほとんどの S3 操作は、RustFS に対しても同じように動作します。例外は [S3 互換性](/ja/reference/s3-compatibility) を参照します。
