---
title: "Rust SDK"
description: "This document mainly explains the use of Rust SDK in RustFS."
---

# RustFS Rust SDK

Since RustFS is a fully S3-compatible object storage system, it's possible to build a Rust SDK suitable for RustFS by wrapping the S3 Rust SDK. Through the SDK, RustFS operations can be performed, including bucket/object creation and deletion, as well as file upload and download.

## Prerequisites

- An available RustFS instance (refer to the [Installation Guide](../../installation/index.md) for installation).
- Access keys (refer to [Access Key Management](../../administration/iam/access-token.md) for creation).

## RustFS Rust SDK Construction

Construct a Config data structure from `region`, `access_key_id`, `secret_access_key`, and `endpoint_url`, and read the corresponding information from environment variables:

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

Use the Config constructed above with `aws_sdk_s3::Client` to build the RustFS client:

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

Then use the constructed `rustfs_client` to perform corresponding operations.

## Create Bucket

```rust
match rustfs_client
    .create_bucket()
    .bucket("your-bucket-name")
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

## Delete Bucket

```rust
match rustfs_client
    .delete_bucket()
    .bucket("your-bucket-name")
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

## List Buckets

```rust
match rustfs_client.list_buckets().send().await {
    Ok(res) => {
        println!("Total number of buckets: {:?}", res.buckets().len());
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

## List Objects

```rust
match rustfs_client
    .list_objects_v2()
    .bucket("rust-sdk-demo")
    .send()
    .await
{
    Ok(res) => {
        println!("Total number of objects: {:?}", res.contents().len());
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

## Upload File

```rust
let data = fs::read("/file-path/1.txt").await.expect("Cannot open the file");

match rustfs_client
    .put_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .body(ByteStream::from(data))
    .send()
    .await
{
    Ok(res) => {
        println!("Object uploaded successfully, response: {:?}", res);
    }
    Err(e) => {
        println!("Error uploading object: {:?}", e);
        return Err(e.into());
    }
}
```

## Download Object

```rust
match rustfs_client
    .get_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .send()
    .await
{
    Ok(res) => {
        println!("Object downloaded successfully, response: {:?}", res);
        
        // Write object data to file
        let mut body = res.body.collect().await?;
        let data = body.into_bytes();
        fs::write("/local-path/downloaded-1.txt", data).await?;
    }
    Err(e) => {
        println!("Error downloading object: {:?}", e);
        return Err(e.into());
    }
}
```

## Additional Usage

For other uses, you can explore on your own. The Rust SDK provides complete type safety and memory safety, making it ideal for production environments. With Rust, you get:

- Zero-cost abstractions
- Memory safety without garbage collection
- Concurrency without data races
- Minimal runtime overhead
- Excellent performance

All advanced S3 features are supported, including multipart uploads, presigned URLs, and bucket policies.

