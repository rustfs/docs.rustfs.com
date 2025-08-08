---
title: "MinIO Client로 RustFS 객체 관리"
description: "MinIO Client를 사용하여 RustFS 객체를 관리"
---

# MinIO Client (`mc`)

MinIO Client(`mc`)는 MinIO가 제공하는 공식 CLI 도구로, MinIO, Amazon S3 및 S3 호환 오브젝트 스토리지와 상호 작용합니다. S3 호환인 RustFS도 `mc`로 관리할 수 있습니다.

사전 준비:

- RustFS 인스턴스 (../../ko/installation/index.md)
- `mc` 설치됨
- 사용 가능한 [액세스 키](access-token.md)

## `mc`로 RustFS 사용하기

먼저 `mc alias` 명령으로 RustFS 별칭을 설정합니다:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

응답:

```
Added `rustfs` successfully.
```

이후 `rustfs` 별칭으로 버킷 생성/삭제, 파일 업/다운로드를 수행할 수 있습니다.

### 버킷 목록 조회

```
mc ls rustfs
```

응답:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### 버킷 생성

```
mc mb rustfs/bucket-creation-by-mc
```

응답:

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### 버킷 삭제

```
mc rb rustfs/bucket-creation-by-mc
```

응답:

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### 파일 업로드

```
mc cp file_name rustfs/bucket-creation-by-mc
```

응답:

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### 파일 삭제

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

응답:

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### 파일 다운로드

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

응답:

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```