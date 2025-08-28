---
title: "RustFS Rust SDK 使用指南"
description: "通过 Rust SDK 来对 RustFS 实例进行操作,包括存储桶、对象的创建和删除."
---

# RustFS Rust SDK

由于 RustFS 是完全兼容 S3 的对象存储系统，因此可以通过对 S3 的 Rust SDK 做一些封装来构建适用于 RustFS 的 Rust SDK，通过 SDK 对 RustFS 进行操作，包括存储桶/对象的创建和删除、文件的上传和下载等。

## 前提条件

- 一个可用的 RustFS 实例（可参考[安装指南](../../installation/index.md)进行安装）。
- 访问密钥（可参考[访问密钥管理](../../administration/iam/access-token.md)进行创建）。

## RustFS Rust SDK 构造

将 `region`、`access_key_id`、`secret_access_key` 以及 `endpoint_url` 构造为一个 Config 数据结构，并从环境变量读取对应信息：

```
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

利用上述构造好的 Config，借助 `aws_sdk_s3::Client` 构造 RustFS Client：

```
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

接着使用构造好的 `rustfs_client` 进行响应的操作。

## 创建存储桶

```
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

## 删除存储桶

```
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

## 列出存储桶

```
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

## 列出对象

```
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

## 上传文件

```
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

## 下载对象

```
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

其他的使用，大家可以自行探索，如果借助 Vibe Coding，就更简单了！