---
title: "MinIO Client로 RustFS 객체 관리"
description: "MinIO Client를 사용하여 RustFS 객체를 관리합니다"
---

# MinIO Client（`mc`）

MinIO Client（`mc`）는 MinIO 공식에서 제공하는 명령줄 도구로, MinIO 객체 저장소 서비스를 관리하는 데 사용됩니다. `mc`는 MinIO, Amazon S3 및 기타 S3 호환 객체 저장소 서비스와 상호작용할 수 있으며, 객체 저장소 서비스의 데이터를 관리하는 간단하고 효율적인 방법을 제공합니다. MinIO가 S3 호환이므로 `mc`는 RustFS 객체 관리에도 사용할 수 있습니다.

전제 조건:

- 사용 가능한 RustFS 인스턴스. [설치 가이드](../installation/index.md)를 참조하여 설치할 수 있습니다.
- `mc` 도구가 설치되어 있음.
- 사용 가능한 [액세스 키](../administration/iam/access-token.md).

## `mc`로 RustFS 작업

먼저 `mc alias` 명령을 사용하여 RustFS의 별칭을 구성해야 합니다:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

응답:

```
Added `rustfs` successfully.
```

다음으로, 별칭 `rustfs`를 사용하여 `mc` 작업을 수행하여 저장소 버킷 생성/삭제, 파일 업로드/다운로드 등을 할 수 있습니다.

### 저장소 버킷 나열

`mc ls`를 사용하여 현재 RustFS 인스턴스의 모든 저장소 버킷을 나열합니다:

```
mc ls rustfs
```

응답:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### 저장소 버킷 생성

`mc mb` 명령을 사용하여 저장소 버킷을 생성합니다:

```
mc mb rustfs/bucket-creation-by-mc
```

응답:

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### 저장소 버킷 삭제

`mc rb` 명령을 사용하여 저장소 버킷을 삭제합니다:

```
mc rb rustfs/bucket-creation-by-mc
```

응답:

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### 저장소 버킷에 파일 업로드

`mc cp` 명령을 사용하여 저장소 버킷에 파일을 업로드합니다:

```
mc cp file_name rustfs/bucket-creation-by-mc
```

응답:

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### 저장소 버킷에서 파일 삭제

`mc rm` 명령을 사용하여 저장소 버킷에서 파일을 삭제합니다:

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

응답:

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### 저장소에서 파일 다운로드

`mc get` 명령을 사용하여 저장소 버킷에서 파일을 다운로드합니다:

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

응답:

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```
