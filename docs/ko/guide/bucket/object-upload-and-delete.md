---
title: "RustFS 객체 관리"
description: "객체 업로드와 삭제"
---

# RustFS 객체

객체(Object)는 RustFS 저장의 기본 단위로, 데이터, 메타데이터, 고유 식별자(Object Key)로 구성됩니다. 본 문서는 파일 업로드와 삭제 예시를 통해 객체 관리를 설명합니다.

> 객체 관련 개념은 [핵심 개념](../../concepts/glossary.md)을 참고하세요.

## 객체 생성

사전 준비:

- 사용 가능한 RustFS 인스턴스 (../../installation/index.md 참조)

[버킷 생성](bucket-create-and-delete.md) 후 해당 버킷으로 파일을 업로드하면 객체가 생성됩니다. RustFS UI, `mc`, API로 업로드할 수 있습니다.

### RustFS UI로 업로드

1. RustFS UI 콘솔에 로그인합니다.
1. 업로드할 버킷을 선택합니다.
1. 버킷 페이지 우측 상단에서 "새 디렉토리", "새 파일", "파일/폴더 업로드"를 선택합니다.
1. 로컬 업로드의 경우 "파일/폴더 업로드"를 클릭해 항목을 선택한 후 "업로드 시작"을 클릭합니다.

![object creation from ui](images/upload_file_from_ui.png)

업로드 후 객체를 클릭하면 상세 정보를 볼 수 있습니다.

![object details info](images/object_details_info.png)

### `mc`로 업로드

> 설치/설정은 [`mc` 가이드](../mc.md)를 참고하세요.

```
# upload file
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirm file uploaded
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

### API로 업로드

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

요청 예시:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

## 객체 삭제

UI, `mc`, API로 객체를 삭제할 수 있습니다. 위에서 업로드한 파일을 삭제해 봅니다.

## RustFS UI로 삭제

1. RustFS UI 콘솔에 로그인합니다.
1. 파일이 있는 버킷을 선택합니다.
1. 삭제할 파일을 선택합니다.
1. 우측 상단의 "선택 항목 삭제"를 클릭하고 확인합니다.

![object deletion from ui](images/delete_file_from_ui.png)

### `mc`로 삭제

```
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

### API로 삭제

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

요청 예시:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```