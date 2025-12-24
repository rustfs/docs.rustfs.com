---
title: "Rust SDK Guide"
description: "Operating RustFS instances through Rust SDK, including creation and deletion of buckets and objects."
---

# Rust SDK

RustFS is fully S3-compatible. You can use the official AWS SDK for Rust. Through the SDK, you can operate RustFS, including creation and deletion of buckets/objects, file upload and download, etc.

## Prerequisites

- An available RustFS instance (refer to [Installation Guide](../../installation/index.md)).
- Access keys (refer to [Access Key Management](../../administration/iam/access-token.md)).

## Initializing the Client

Create a configuration struct and load credentials from environment variables:

```rust
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

Initialize the S3 client:

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

let shard_config = aws_config::defaults(BehaviorVersion::latest())
    .region(region)
    .credentials_provider(credentials)
    .endpoint_url(endpoint_url)
    .load()
    .await;

let rustfs_client = Client::new(&shard_config);
```

You can now use the client for operations.

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
    .bucket("cn-east-1rust-sdk")
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

## List Objects

```rust
match rustfs_client
    .list_objects_v2()
    .bucket("rust-sdk-demo")
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

## Upload File

```rust
let data = fs::read("/file-path/1.txt").await.expect("can not open the file");

match rustfs_client
    .put_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
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
        println!("Object downloaded successfully, res: {:?}", res);
    }
    Err(e) => {
        println!("Error downloading object: {:?}", e);
        return Err(e.into());
    }
}
```

For other usage, you can explore on your own. If you use Vibe Coding, it becomes even simpler!
