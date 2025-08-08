---
title: "RustFS 버킷 관리"
description: "RustFS 버킷 생성과 삭제"
---

# RustFS 버킷

버킷은 RustFS에서 데이터를 구성하고 관리하는 기본 논리 컨테이너입니다. 각 버킷은 고유한 이름을 가지며 여러 객체를 포함할 수 있습니다. RustFS UI, `mc`(MinIO Client), API를 통해 버킷을 생성/삭제하고 데이터를 업로드/다운로드할 수 있습니다.

## 버킷 생성

사전 준비:

- 사용 가능한 RustFS 인스턴스 (../../installation/index.md 참조)

## RustFS UI에서 생성

1. RustFS UI 콘솔에 로그인합니다.
1. 홈 좌상단에서 "버킷 생성"을 클릭합니다.
1. 버킷 이름을 입력하고 "생성"을 클릭합니다.

![bucket creation](images/bucket-creation-by-ui.png)

### `mc`로 생성

> 설치/설정은 [`mc` 가이드](../mc.md)를 참조하세요.

```
# creat rustfs bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm bucket creation
mc ls rustfs/bucket-creation-by-mc
```

### API로 생성

```
PUT /{bucketName} HTTP/1.1
```

요청 예시:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

UI에서 `bucket-creation-by-api` 버킷이 생성되었음을 확인할 수 있습니다.

## 버킷 삭제

주의: 버킷 삭제는 버킷을 사용하는 애플리케이션에 오류를 유발할 수 있습니다. 삭제 전 데이터 백업 및 불필요 여부를 확인하세요.

### RustFS UI에서 삭제

1. RustFS UI 콘솔에 로그인합니다.
1. 홈에서 삭제할 버킷을 선택합니다.
1. 우측의 "삭제" 버튼을 클릭합니다.
1. 대화상자에서 "확인"을 클릭합니다.

![bucket deletion](images/bucket-deletion-on-ui.png)

### `mc`로 삭제

> [`mc` 가이드](../mc.md) 참조.

```
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

### API로 삭제

```
DELETE /{bucketName} HTTP/1.1
```

요청 예시:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

RustFS UI에서 `bucket-creation-by-api` 버킷이 삭제되었음을 확인할 수 있습니다.