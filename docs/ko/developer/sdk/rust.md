---
title: "Rust SDK"
description: "이 문서는 주로 RustFS에서 Rust SDK 사용에 대해 설명합니다."
---

# RustFS Rust SDK

RustFS는 완전한 S3 호환 객체 스토리지 시스템이므로, S3 Rust SDK를 래핑하여 RustFS에 적합한 Rust SDK를 구축할 수 있습니다. SDK를 통해 버킷/객체 생성 및 삭제, 파일 업로드 및 다운로드 등 RustFS 작업을 수행할 수 있습니다.

## 전제 조건

- 사용 가능한 RustFS 인스턴스(설치는 [설치 가이드](../../installation/index.md) 참조).
- 액세스 키(생성은 [액세스 키 관리](../../administration/iam/access-token.md) 참조).

## RustFS Rust SDK 구성

`region`, `access_key_id`, `secret_access_key`, `endpoint_url`로 Config 데이터 구조를 구성하고 환경 변수에서 해당 정보를 읽어옵니다:

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

위에서 구성한 Config를 `aws_sdk_s3::Client`와 함께 사용하여 RustFS 클라이언트를 구축합니다:

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

그런 다음 구성된 `rustfs_client`를 사용하여 해당 작업을 수행합니다.

## 버킷 생성

```rust
match rustfs_client
    .create_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("버킷이 성공적으로 생성되었습니다");
    }
    Err(e) => {
        println!("버킷 생성 오류: {:?}", e);
        return Err(e.into());
    }
}
```

## 버킷 삭제

```rust
match rustfs_client
    .delete_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("버킷이 성공적으로 삭제되었습니다");
    }
    Err(e) => {
        println!("버킷 삭제 오류: {:?}", e);
        return Err(e.into());
    }
}
```

## 버킷 목록

```rust
match rustfs_client.list_buckets().send().await {
    Ok(res) => {
        println!("버킷 총 개수: {:?}", res.buckets().len());
        for bucket in res.buckets() {
            println!("버킷: {:?}", bucket.name());
        }
    }
    Err(e) => {
        println!("버킷 목록 오류: {:?}", e);
        return Err(e.into());
    }
}
```

## 객체 목록

```rust
match rustfs_client
    .list_objects_v2()
    .bucket("rust-sdk-demo")
    .send()
    .await
{
    Ok(res) => {
        println!("객체 총 개수: {:?}", res.contents().len());
        for object in res.contents() {
            println!("객체: {:?}", object.key());
        }
    }
    Err(e) => {
        println!("객체 목록 오류: {:?}", e);
        return Err(e.into());
    }
}
```

## 파일 업로드

```rust
let data = fs::read("/file-path/1.txt").await.expect("파일을 열 수 없습니다");

match rustfs_client
    .put_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .body(ByteStream::from(data))
    .send()
    .await
{
    Ok(res) => {
        println!("객체 업로드가 성공했습니다, 응답: {:?}", res);
    }
    Err(e) => {
        println!("객체 업로드 오류: {:?}", e);
        return Err(e.into());
    }
}
```

## 객체 다운로드

```rust
match rustfs_client
    .get_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .send()
    .await
{
    Ok(res) => {
        println!("객체 다운로드가 성공했습니다, 응답: {:?}", res);

        // 객체 데이터를 파일에 쓰기
        let mut body = res.body.collect().await?;
        let data = body.into_bytes();
        fs::write("/local-path/downloaded-1.txt", data).await?;
    }
    Err(e) => {
        println!("객체 다운로드 오류: {:?}", e);
        return Err(e.into());
    }
}
```

## 추가 사용

다른 사용법에 대해서는 직접 탐색할 수 있습니다. Rust SDK는 완전한 타입 안전성과 메모리 안전성을 제공하여 프로덕션 환경에 이상적입니다. Rust를 사용하면 다음을 얻을 수 있습니다:

- 제로 코스트 추상화
- 가비지 콜렉션 없는 메모리 안전성
- 데이터 경합 없는 동시성
- 최소 런타임 오버헤드
- 훌륭한 성능

멀티파트 업로드, 사전 서명된 URL, 버킷 정책 등 모든 고급 S3 기능이 지원됩니다.
