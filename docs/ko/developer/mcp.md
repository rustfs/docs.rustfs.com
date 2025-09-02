---
title: "RustFS MCP"
description: "RustFS MCP 사용 가이드"
---

# RustFS MCP

**RustFS MCP 서버**는 AI/LLM 도구에 S3 호환 객체 저장소 작업에 대한 원활한 액세스를 제공하는 고성능 [모델 컨텍스트 프로토콜(MCP)](https://www.anthropic.com/news/model-context-protocol) 서버입니다. 이 서버는 최대 성능과 보안을 위해 Rust로 구축되었으며, Claude Desktop과 같은 AI 어시스턴트가 표준화된 프로토콜을 통해 클라우드 저장소와 상호작용할 수 있게 합니다.

### MCP란 무엇인가?

모델 컨텍스트 프로토콜은 AI 애플리케이션이 외부 시스템과 안전하고 제어된 연결을 설정할 수 있게 하는 개방형 표준입니다. 이 서버는 AI 도구와 S3 호환 저장소 서비스 간의 다리 역할을 하며, 보안성과 관찰 가능성을 유지하면서 파일 작업에 대한 구조화된 액세스를 제공합니다.

## ✨ 특징

### 지원되는 S3 작업

- **저장소 버킷 나열**: 모든 액세스 가능한 S3 저장소 버킷 나열
- **객체 나열**: 선택적 접두사 필터링을 통해 저장소 버킷 내용 탐색
- **파일 업로드**: 로컬 파일 업로드 및 MIME 유형과 캐시 제어 자동 감지
- **객체 가져오기**: S3 저장소에서 객체 검색, 읽기 또는 다운로드 모드 지원

## 🔧 설치

### 전제 조건

- Rust 1.88+(소스 코드에서 빌드용)
- 구성된 AWS 자격 증명(환경 변수, AWS CLI 또는 IAM 역할을 통해)
- S3 호환 저장소 서비스 액세스

### 소스 코드에서 빌드

```bash
# 저장소 클론
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# MCP 서버 빌드
cargo build --release -p rustfs-mcp

# 바이너리 파일은 다음 경로에서 사용 가능
./target/release/rustfs-mcp
```

## ⚙️ 구성

### 환경 변수

```bash
# AWS 자격 증명(필수)
export AWS_ACCESS_KEY_ID=귀하의_액세스_키
export AWS_SECRET_ACCESS_KEY=귀하의_시크릿_키
export AWS_REGION=us-east-1  # 선택사항, 기본값은 us-east-1

# 선택사항: 사용자 정의 S3 엔드포인트(MinIO 등용)
export AWS_ENDPOINT_URL=http://localhost:9000

# 로그 레벨(선택사항)
export RUST_LOG=info
```

### 명령줄 옵션

```bash
rustfs-mcp --help
```

서버는 동작을 사용자 정의하기 위한 다양한 명령줄 옵션을 지원합니다:

- `--access-key-id`: S3 인증을 위한 AWS 액세스 키 ID
- `--secret-access-key`: S3 인증을 위한 AWS 시크릿 키
- `--region`: S3 작업을 위한 AWS 지역(기본값: us-east-1)
- `--endpoint-url`: 사용자 정의 S3 엔드포인트 URL(MinIO, LocalStack 등용)
- `--log-level`: 로그 레벨 구성(기본값: rustfs\_mcp\_server=info)

-----

## 🚀 사용

### 서버 시작

```bash
# MCP 서버 시작
rustfs-mcp

# 또는 사용자 정의 옵션 사용
rustfs-mcp --log-level debug --region us-west-2
```

### 채팅 클라이언트와 통합

#### 옵션 1: 명령줄 매개변수 사용

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "귀하의_액세스_키",
        "--secret-access-key", "귀하의_시크릿_키",
        "--region", "us-west-2",
        "--log-level", "info"
      ]
    }
  }
}
```

#### 옵션 2: 환경 변수 사용

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "env": {
        "AWS_ACCESS_KEY_ID": "귀하의_액세스_키",
        "AWS_SECRET_ACCESS_KEY": "귀하의_시크릿_키",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

### Docker에서 사용

[RustFS MCP 공식에서 Dockerfile 제공](https://github.com/rustfs/rustfs/tree/main/crates/mcp), Dockerfile을 사용하여 컨테이너 이미지를 빌드하여 RustFS MCP를 사용할 수 있습니다.

```
# RustFS 저장소 코드 클론
git clone git@github.com:rustfs/rustfs.git

# Docker 이미지 빌드
docker build -f crates/mcp/Dockerfile -t rustfs/rustfs-mcp .
```

빌드 성공 후 AI IDE의 MCP 구성에서 사용하도록 구성할 수 있습니다.

#### AI IDE에서 MCP 구성

현재 주류 AI IDE인 Cursor, Windsurf, Trae 등은 모두 MCP를 지원합니다. 예를 들어, Trae에서 MCP 구성에 다음 내용을 추가합니다(**MCP --> 추가**):

```
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "AWS_ACCESS_KEY_ID",
        "-e",
        "AWS_SECRET_ACCESS_KEY",
        "-e",
        "AWS_REGION",
        "-e",
        "AWS_ENDPOINT_URL",
        "rustfs/rustfs-mcp"
      ],
      "env": {
        "AWS_ACCESS_KEY_ID": "rustfs_access_key",
        "AWS_SECRET_ACCESS_KEY": "rustfs_secret_key",
        "AWS_REGION": "cn-east-1",
        "AWS_ENDPOINT_URL": "rustfs_instance_url"
      }
    }
  }
}
```

> `AWS_ACCESS_KEY_ID`와 `AWS_SECRET_ACCESS_KEY`는 RustFS의 액세스 키이며, [액세스 키 관리 장](../administration/iam/access-token.md)을 참조하여 생성할 수 있습니다.

추가가 성공하면 MCP 구성 페이지에 [사용 가능한 도구](#️-사용-가능한-도구)가 나열됩니다.

![Trae MCP 구성에서 rustfs mcp 추가 성공](images/add-rustfs-mcp-succ.png)

Trae에서 해당 프롬프트를 입력하면 해당 도구(Tool)를 사용할 수 있습니다. 예를 들어 Trae의 채팅 대화 상자에 입력:

```
현재 rustfs 인스턴스의 저장소 버킷을 나열해 주세요, 감사합니다!
```

다음과 같은 응답을 반환합니다:

![rustfs mcp로 rustfs 버킷 나열](images/list-rustfs-bucket-with-mcp.png)

Trae는 **Builder with MCP** 모드를 사용하여 `list_buckets` 도구를 호출하고, 구성된 RustFS 인스턴스의 모든 저장소 버킷을 나열했습니다. 다른 도구 호출도 동일합니다.

## 🛠️ 사용 가능한 도구

MCP 서버는 AI 어시스턴트가 사용할 수 있는 다음 도구를 공개합니다:

### `list_buckets`

구성된 자격 증명으로 액세스 가능한 모든 S3 저장소 버킷을 나열합니다.

**매개변수**: 없음

### `list_objects`

S3 저장소 버킷의 객체를 나열하며, 선택적 접두사 필터링을 지원합니다.

**매개변수**:

- `bucket_name` (문자열): S3 저장소 버킷의 이름
- `prefix` (문자열, 선택사항): 객체를 필터링하는 데 사용되는 접두사

### `upload_file`

로컬 파일을 S3에 업로드하고 MIME 유형을 자동 감지합니다.

**매개변수**:

- `local_file_path` (문자열): 로컬 파일 경로
- `bucket_name` (문자열): 대상 S3 저장소 버킷
- `object_key` (문자열): S3 객체 키(대상 경로)
- `content_type` (문자열, 선택사항): 콘텐츠 유형(제공되지 않은 경우 자동 감지)
- `storage_class` (문자열, 선택사항): S3 저장소 클래스
- `cache_control` (문자열, 선택사항): 캐시 제어 헤더

### `get_object`

S3에서 객체를 검색하며, 두 가지 작업 모드가 있습니다: 콘텐츠를 직접 읽거나 파일로 다운로드.

**매개변수**:

- `bucket_name` (문자열): 소스 S3 저장소 버킷
- `object_key` (문자열): S3 객체 키
- `version_id` (문자열, 선택사항): 버전화된 객체의 버전 ID
- `mode` (문자열, 선택사항): 작업 모드 - "read"(기본값) 콘텐츠를 직접 반환, "download" 로컬 파일로 저장
- `local_path` (문자열, 선택사항): 로컬 파일 경로(mode가 "download"일 때 필수)
- `max_content_size` (숫자, 선택사항): 읽기 모드의 최대 콘텐츠 크기(바이트)(기본값: 1MB)

### `create_bucket`

새로운 RustFS 저장소 버킷을 생성합니다.

**매개변수**:

- `bucket_name` (문자열): 생성할 저장소 버킷의 이름.

### `delete_bucket`

지정된 RustFS 저장소 버킷을 삭제합니다.

**매개변수**:

- `bucket_name` (문자열): 삭제할 저장소 버킷의 이름.

## 아키텍처

MCP 서버는 모듈화된 아키텍처로 구축됩니다:

```
rustfs-mcp/
├── src/
│   ├── main.rs          # 진입점, CLI 파싱 및 서버 초기화
│   ├── server.rs        # MCP 서버 구현 및 도구 핸들러
│   ├── s3_client.rs     # 비동기 작업이 있는 S3 클라이언트 래퍼
│   ├── config.rs        # 구성 관리 및 CLI 옵션
│   └── lib.rs           # 라이브러리 내보내기 및 공개 API
└── Cargo.toml           # 종속성, 메타데이터 및 바이너리 구성
```
