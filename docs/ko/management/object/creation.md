---
title: "RustFS 객체 생성"
description: "RustFS UI에서 또는 MinIO Client 클라이언트와 API를 통해 객체를 생성할 수 있습니다."
---

# RustFS 객체

객체(Object)는 RustFS 스토리지의 기본 단위로, 데이터, 메타데이터 및 고유 식별자(Object Key)를 포함합니다. 데이터는 객체의 형태로 저장됩니다. 이 섹션에서는 파일 업로드 및 삭제를 예로 들어 객체 관리를 소개합니다.

> 객체(Object) 관련 개념에 대해서는 [핵심 개념](../../concepts/glossary.md) 섹션을 참조하십시오.

## 객체 생성

전제 조건:

- 사용 가능한 RustFS 인스턴스. 설치에 대해서는 [설치 가이드](../../installation/index.md)를 참조하십시오.

[스토리지 버킷을 생성](../bucket/creation.md)한 다음 파일을 버킷에 업로드하면 객체 생성이 완료됩니다. RustFS UI, `mc` 및 API 방식으로 파일을 업로드할 수 있습니다.

### RustFS UI에서 파일 업로드

1. RustFS UI 콘솔에 로그인합니다.
1. 파일을 업로드할 버킷을 선택합니다.
1. 버킷 페이지 오른쪽 상단에서 **새 디렉토리**, **새 파일** 또는 **파일/폴더 업로드**를 선택하여 파일/폴더 생성을 완료합니다.
1. 로컬에서 파일/폴더를 업로드하려면 **파일/폴더 업로드** 버튼을 클릭하고 로컬 파일/폴더를 선택한 다음 **업로드 시작**을 클릭하여 파일 업로드를 완료합니다.

![object creation from ui](images/upload_file_from_ui.png)

업로드가 완료되면 해당 객체를 클릭하여 객체의 자세한 정보를 볼 수 있습니다.

![object details info](images/object_details_info.png)

### `mc`를 사용하여 파일 업로드

> `mc` 설치 및 구성에 대해서는 [`mc` 사용 가이드](../../developer/mc.md) 섹션을 참조하십시오.

`mc cp` 명령을 사용하여 파일을 업로드합니다:

```
# 파일 업로드
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# 파일 업로드 확인
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

업로드가 완료되면 RustFS 콘솔에서 확인할 수 있습니다.

### API를 사용하여 파일 업로드

다음 API를 사용하여 파일을 업로드합니다:

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

요청 예제:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

업로드가 완료되면 RustFS 콘솔에서 확인할 수 있습니다.

## 객체 삭제

마찬가지로 UI에서, `mc` 또는 API 방식으로 객체를 삭제할 수 있습니다. 예를 들어 위 단계에서 생성한 파일을 삭제하면 객체 삭제가 완료됩니다.

## RustFS UI에서 파일 삭제

1. RustFS UI 콘솔에 로그인합니다.
1. 파일을 삭제할 버킷을 선택합니다.
1. 버킷 페이지에서 삭제할 파일을 선택합니다.
1. 오른쪽 상단의 **선택 항목 삭제**를 클릭하고, 팝업 대화 상자에서 **확인**을 클릭하여 파일 삭제를 완료합니다.

![object deletion from ui](images/delete_file_from_ui.png)

### `mc`를 사용하여 파일 삭제

`mc rm` 명령을 사용하여 파일을 삭제합니다:

```
# 파일 삭제
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# 삭제 확인
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

RustFS UI에서 파일이 삭제되었음을 확인할 수 있습니다.

### API를 사용하여 파일 삭제

다음 API를 사용하여 파일을 삭제합니다:

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

요청 예제:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```

RustFS UI에서 파일이 삭제되었음을 확인할 수 있습니다.
