---
title: "Rust SDK 指南"
description: "通过 AWS SDK for Rust 操作 RustFS 实例，包括创建和删除存储桶与对象。"
---

RustFS 不提供第一方 Rust 客户端 crate。RustFS 与 S3 完全兼容，因此你可以配置官方 AWS SDK for Rust（`aws-sdk-s3`），使其指向 RustFS 服务器。通过该 SDK，你可以操作 RustFS，包括创建和删除存储桶或对象、上传和下载文件等。

## 前提条件

- Rust 1.78 或更高版本（通过 [rustup](https://rustup.rs/) 安装）
- 一个可用的 RustFS 实例（请参阅[安装指南](../../installation/index.md)）；S3 API 监听端口 `9000`，控制台监听端口 `9001`
- 安装时通过 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` 环境变量设置的访问密钥（请参阅[访问密钥管理](../../security-compliance/iam/access-token.md)）

:::tip[本地测试]

如果安装时未设置凭证，服务器默认使用 `rustfsadmin` / `rustfsadmin`。这仅适合一次性本地试用，切勿用于其他人可访问的环境。

:::

创建项目并添加依赖项：

```bash
cargo new rustfs-rust-demo && cd rustfs-rust-demo
cargo add aws-config aws-sdk-s3 anyhow
cargo add tokio --features full
```

你的 `Cargo.toml` 应包含：

```toml title="Cargo.toml"
[dependencies]
anyhow = "1"
aws-config = "1"
aws-sdk-s3 = "1"
tokio = { version = "1", features = ["full"] }
```

## 初始化客户端

以下是一个可直接运行的完整程序。它从环境变量加载连接设置、初始化 S3 客户端并列出存储桶：

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

这些环境变量名（`RUSTFS_ENDPOINT_URL`、`RUSTFS_REGION`、`RUSTFS_ACCESS_KEY_ID`、`RUSTFS_SECRET_ACCESS_KEY`）只是本示例的客户端约定，由你的程序读取，而不是由 RustFS 读取。它们不同于安装 RustFS 时使用的服务器端变量 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY`。

:::

运行该程序（如果 RustFS 在另一台计算机上运行，请将 `localhost` 替换为服务器 IP 地址）：

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

现在可以使用该客户端执行以下操作。每个代码片段都在 `main` 内运行，并复用 `rustfs_client`。

## 创建存储桶

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

## 删除存储桶

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

## 列出存储桶

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

## 列出对象

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

## 上传文件

在 `src/main.rs` 顶部添加以下导入：

```rust
use aws_sdk_s3::primitives::ByteStream;
use tokio::fs;
```

然后上传本地文件：

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

## 下载对象

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

有关其他操作（预签名 URL、分段上传等），请参阅 [AWS SDK for Rust 文档](https://docs.aws.amazon.com/sdk-for-rust/latest/dg/)。所有 S3 兼容调用都能以相同方式用于 RustFS。