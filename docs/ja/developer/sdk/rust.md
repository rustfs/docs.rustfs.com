---
title: "Rust SDK"
description: "この文書は主にRustFSでのRust SDKの使用について説明します。"
---

# RustFS Rust SDK

RustFSは完全にS3互換のオブジェクトストレージシステムであるため、S3のRust SDKをラッピングすることでRustFSに適したRust SDKを構築することができます。SDKを通じてRustFSの操作を実行でき、バケット/オブジェクトの作成と削除、ファイルのアップロードとダウンロードなどが含まれます。

## 前提条件

- 使用可能なRustFSインスタンス（インストールについては[インストールガイド](../../installation/index.md)を参照）。
- アクセスキー（作成については[アクセスキー管理](../../administration/iam/access-token.md)を参照）。

## RustFS Rust SDK 構築

`region`、`access_key_id`、`secret_access_key`、`endpoint_url`からConfig データ構造を構築し、環境変数から対応する情報を読み取ります：

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

上記で構築したConfigを`aws_sdk_s3::Client`と共に使用してRustFSクライアントを構築します：

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

続いて、構築した`rustfs_client`を使用して対応する操作を実行します。

## バケット作成

```rust
match rustfs_client
    .create_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("バケットが正常に作成されました");
    }
    Err(e) => {
        println!("バケット作成エラー: {:?}", e);
        return Err(e.into());
    }
}
```

## バケット削除

```rust
match rustfs_client
    .delete_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("バケットが正常に削除されました");
    }
    Err(e) => {
        println!("バケット削除エラー: {:?}", e);
        return Err(e.into());
    }
}
```

## バケット一覧

```rust
match rustfs_client.list_buckets().send().await {
    Ok(res) => {
        println!("バケットの総数: {:?}", res.buckets().len());
        for bucket in res.buckets() {
            println!("バケット: {:?}", bucket.name());
        }
    }
    Err(e) => {
        println!("バケット一覧エラー: {:?}", e);
        return Err(e.into());
    }
}
```

## オブジェクト一覧

```rust
match rustfs_client
    .list_objects_v2()
    .bucket("rust-sdk-demo")
    .send()
    .await
{
    Ok(res) => {
        println!("オブジェクトの総数: {:?}", res.contents().len());
        for object in res.contents() {
            println!("オブジェクト: {:?}", object.key());
        }
    }
    Err(e) => {
        println!("オブジェクト一覧エラー: {:?}", e);
        return Err(e.into());
    }
}
```

## ファイルアップロード

```rust
let data = fs::read("/file-path/1.txt").await.expect("ファイルを開けません");

match rustfs_client
    .put_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .body(ByteStream::from(data))
    .send()
    .await
{
    Ok(res) => {
        println!("オブジェクトのアップロードが成功しました、レスポンス: {:?}", res);
    }
    Err(e) => {
        println!("オブジェクトアップロードエラー: {:?}", e);
        return Err(e.into());
    }
}
```

## オブジェクトダウンロード

```rust
match rustfs_client
    .get_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .send()
    .await
{
    Ok(res) => {
        println!("オブジェクトのダウンロードが成功しました、レスポンス: {:?}", res);
        
        // オブジェクトデータをファイルに書き込み
        let mut body = res.body.collect().await?;
        let data = body.into_bytes();
        fs::write("/local-path/downloaded-1.txt", data).await?;
    }
    Err(e) => {
        println!("オブジェクトダウンロードエラー: {:?}", e);
        return Err(e.into());
    }
}
```

## その他の使用

その他の使用については、自由に探索することができます。Rust SDKは完全な型安全性とメモリ安全性を提供し、本番環境に理想的です。Rustでは以下を得られます：

- ゼロコスト抽象化
- ガベージコレクションなしのメモリ安全性
- データ競合のない並行性
- 最小限のランタイムオーバーヘッド
- 優れたパフォーマンス

マルチパートアップロード、事前署名URL、バケットポリシーなど、すべての高度なS3機能がサポートされています。

