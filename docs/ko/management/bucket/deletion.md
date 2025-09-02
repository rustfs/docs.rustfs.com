---
title: "RustFS 스토리지 버킷 삭제"
description: "RustFS UI에서 또는 MinIO Client 클라이언트와 API를 통해 스토리지 버킷을 삭제할 수 있습니다."
---

# RustFS 스토리지 버킷 삭제

이 섹션에서는 RustFS UI, `mc`(MinIO Client) 또는 API를 통해 스토리지 버킷을 삭제하는 방법을 공유합니다.

**주의**: 스토리지 버킷은 데이터를 저장하는 중요한 구성 요소입니다. 버킷을 삭제하면 이 버킷을 사용하는 애플리케이션에 오류가 발생할 수 있습니다. 버킷을 삭제하기 전에 버킷의 모든 데이터를 백업했고 더 이상 이 버킷을 사용할 필요가 없는지 확인하십시오.

## RustFS UI에서 스토리지 버킷 삭제

1. RustFS UI 콘솔에 로그인합니다.
1. 홈페이지에서 삭제할 버킷을 선택합니다.
1. 맨 오른쪽에서 **삭제** 버튼을 선택합니다.
1. 팝업 대화 상자에서 **확인**을 클릭하여 버킷 삭제를 완료합니다.

![bucket deletion](images/bucket-deletion-on-ui.png)

## `mc`를 사용하여 버킷 삭제

`mc` 설치 및 구성에 대해서는 [`mc` 사용 가이드](../../developer/mc.md) 섹션을 참조하십시오.

`mc rb` 명령을 사용하여 버킷을 삭제합니다:

```
# 버킷 삭제
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# 버킷 삭제 확인
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

## API를 사용하여 버킷 삭제

다음 API를 사용하여 버킷을 삭제합니다:

```
DELETE /{bucketName} HTTP/1.1
```

요청 예제:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

RustFS UI에서 `bucket-creation-by-api` 버킷이 삭제되었음을 확인할 수 있습니다.
