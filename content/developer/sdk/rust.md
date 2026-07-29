---
title: "Rust SDK Guide"
description: "Operate RustFS instances through the AWS SDK for Rust, including creation and deletion of buckets and objects."
---

RustFS ships no first-party Rust client crate — it is fully S3-compatible, so you use the official AWS SDK for Rust (`aws-sdk-s3`) configured to point at your RustFS server. Through the SDK, you can operate RustFS, including creation and deletion of buckets/objects, file upload and download, etc.

## Prerequisites

- Rust 1.78 or later (install via [rustup](https://rustup.rs/))
- An available RustFS instance (refer to [Installation Guide](../../installation/index.md)) — the S3 API listens on port `9000`, the Console on port `9001`
- Access keys, set at install time via the `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` environment variables (refer to [Access Key Management](../../security-compliance/iam/access-token.md))

:::tip[Local test]

If you did not set credentials at install time, the server defaults to `rustfsadmin` / `rustfsadmin` — fine for a throwaway local trial, never for anything reachable by others.

:::

Create a project and add the dependencies:

```bash
cargo new rustfs-rust-demo && cd rustfs-rust-demo
cargo add aws-config aws-sdk-s3 anyhow
cargo add tokio --features full
```

Your `Cargo.toml` should contain:

```toml title="Cargo.toml"
[dependencies]
anyhow = "1"
aws-config = "1"
aws-sdk-s3 = "1"
tokio = { version = "1", features = ["full"] }
```

## Initializing the Client

The following is a complete, runnable program. It loads the connection settings from environment variables, initializes the S3 client, and lists your buckets:

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

These environment variable names (`RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION`, `RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`) are just this example's client-side conventions — they are read by your program, not by RustFS. They are distinct from the server-side `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` variables used when installing RustFS.

:::

Run it (replace `localhost` with your server's IP address if RustFS runs on another machine):

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

You can now use the client for the operations below. Each snippet runs inside `main`, reusing `rustfs_client`.

## Create Bucket

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

## Delete Bucket

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

## List Buckets

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

## List Objects

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

## Upload File

Add these imports at the top of `src/main.rs`:

```rust
use aws_sdk_s3::primitives::ByteStream;
use tokio::fs;
```

Then upload a local file:

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

## Download Object

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

For other operations (presigned URLs, multipart uploads, and more), see the [AWS SDK for Rust documentation](https://docs.aws.amazon.com/sdk-for-rust/latest/dg/) — every S3-compatible call works against RustFS the same way.
