---
title: "RustFS Rust SDK 사용 가이드"
description: "Rust SDK를 통해 RustFS 인스턴스를 조작하며, 스토리지 버킷과 객체의 생성 및 삭제를 포함합니다."
---

# RustFS Rust SDK

RustFS는 완전히 S3 호환 객체 스토리지 시스템이므로, S3용 Rust SDK를 일부 래핑하여 RustFS에 적합한 Rust SDK를 구축할 수 있습니다.

## 전제 조건

- 사용 가능한 RustFS 인스턴스([설치 가이드](../../installation/index.md) 참조)
- 액세스 키([액세스 키 관리](../../administration/iam/access-token.md) 참조)

## RustFS Rust SDK 구성

환경 변수에서 구성 정보 읽기:

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

## RustFS 클라이언트 구성

```rust
let config = Config::from_env()?;
let credentials = Credentials::new(
 config.access_key_id,
 config.secret_access_key,
 None,
 None,
 "rustfs",
);

let rustfs_client = Client::new(&shard_config);
```

## 기본 작업

### 스토리지 버킷 생성
```rust
rustfs_client
 .create_bucket()
 .bucket("your-bucket-name")
 .send()
 .await
```

### 파일 업로드
```rust
rustfs_client
 .put_object()
 .bucket("rust-sdk-demo")
 .key("1.txt")
 .body(ByteStream::from(data))
 .send()
 .await
```

기타 사용법은 자유롭게 탐색해 보세요!