---
title: "RustFS 스토리지 버킷 생성"
description: "RustFS UI에서 또는 MinIO Client 클라이언트와 API를 통해 스토리지 버킷을 생성할 수 있습니다."
---

# RustFS 스토리지 버킷 생성

이 섹션에서는 RustFS UI, `mc`(MinIO Client) 또는 API를 통해 스토리지 버킷을 생성하는 방법을 공유합니다.

## 스토리지 버킷 생성

전제 조건:

- 사용 가능한 RustFS 인스턴스. 설치에 대해서는 [설치 가이드](../../installation/index.md)를 참조하십시오.

## RustFS UI에서 스토리지 버킷 생성

1. RustFS UI 콘솔에 로그인합니다.
1. 홈페이지 왼쪽 상단에서 **버킷 생성**을 선택합니다.
1. 버킷 이름을 입력하고 **생성**을 클릭하여 버킷 생성을 완료합니다.

![bucket creation](images/bucket-creation-by-ui.png)

### `mc`를 사용하여 버킷 생성

> `mc` 설치 및 구성에 대해서는 [`mc` 사용 가이드](../../developer/mc.md) 섹션을 참조하십시오.

`mc mb` 명령을 사용하여 버킷을 생성합니다:

```
# rustfs 버킷 생성
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# 버킷 생성 확인
mc ls rustfs/bucket-creation-by-mc
```

### API를 사용하여 버킷 생성

다음 API를 사용하여 버킷을 생성합니다:

```
PUT /{bucketName} HTTP/1.1
```

요청 예제:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

RustFS UI에서 `bucket-creation-by-api` 버킷이 성공적으로 생성되었음을 확인할 수 있습니다.
