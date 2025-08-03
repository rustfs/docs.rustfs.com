---
title: "RustFS MCP"
description: "RustFS MCP 사용 가이드"
---

# RustFS MCP

**RustFS MCP 서버**는 AI/LLM 도구에 S3 호환 객체 스토리지 작업에 대한 원활한 액세스를 제공하는 고성능 [모델 컨텍스트 프로토콜(MCP)](https://spec.modelcontextprotocol.org) 서버입니다. 이 서버는 최대 성능과 보안을 위해 Rust로 구축되었으며, Claude Desktop과 같은 AI 어시스턴트가 표준화된 프로토콜을 통해 클라우드 스토리지와 상호 작용할 수 있게 합니다.

### MCP란 무엇입니까?

모델 컨텍스트 프로토콜은 AI 애플리케이션이 외부 시스템과 안전하고 제어된 연결을 설정할 수 있게 하는 오픈 표준입니다. 이 서버는 AI 도구와 S3 호환 스토리지 서비스 간의 브리지 역할을 하며, 보안과 관찰성을 유지하면서 파일 작업에 대한 구조화된 액세스를 제공합니다.

## ✨ 특징

### 지원되는 S3 작업

- **버킷 나열**: 접근 가능한 모든 S3 버킷 나열
- **객체 나열**: 선택적 접두사 필터링으로 버킷 내용 탐색
- **파일 업로드**: 로컬 파일 업로드, MIME 타입 및 캐시 제어 자동 감지
- **객체 가져오기**: S3 스토리지에서 객체 검색, 읽기 또는 다운로드 모드 지원

## 🔧 설치

### 전제 조건

- Rust 1.88+ (소스에서 빌드하는 경우)
- 구성된 AWS 자격 증명 (환경 변수, AWS CLI 또는 IAM 역할을 통해)
- S3 호환 스토리지 서비스에 대한 액세스

### 소스에서 빌드

```bash
# 저장소 클론
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# MCP 서버 빌드
cargo build --release -p rustfs-mcp

# 바이너리는 다음 경로에서 사용 가능
./target/release/rustfs-mcp
```

## ⚙️ 구성

### 환경 변수

```bash
# AWS 자격 증명 (필수)
export AWS_ACCESS_KEY_ID=당신의_액세스_키
export AWS_SECRET_ACCESS_KEY=당신의_시크릿_키
export AWS_REGION=us-east-1  # 선택사항, 기본값은 us-east-1

# 선택사항: 사용자 정의 S3 엔드포인트 (MinIO 등용)
export AWS_ENDPOINT_URL=http://localhost:9000

# 로그 레벨 (선택사항)
export RUST_LOG=info
```

### 명령행 옵션

```bash
rustfs-mcp --help
```

서버는 동작을 사용자 정의하기 위한 다양한 명령행 옵션을 지원합니다:

- `--access-key-id`: S3 인증용 AWS 액세스 키 ID
- `--secret-access-key`: S3 인증용 AWS 시크릿 키
- `--region`: S3 작업에 사용할 AWS 리전 (기본값: us-east-1)
- `--endpoint-url`: 사용자 정의 S3 엔드포인트 URL (MinIO, LocalStack 등용)
- `--log-level`: 로그 레벨 구성 (기본값: rustfs_mcp_server=info)

-----

## 🚀 사용법

### 서버 시작

```bash
# MCP 서버 시작
rustfs-mcp

# 또는 사용자 정의 옵션으로
rustfs-mcp --log-level debug --region us-west-2
```

### 채팅 클라이언트와의 통합

#### 옵션 1: 명령행 인수 사용

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "당신의_액세스_키",
        "--secret-access-key", "당신의_시크릿_키",
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
        "AWS_ACCESS_KEY_ID": "당신의_액세스_키",
        "AWS_SECRET_ACCESS_KEY": "당신의_시크릿_키",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

## 🛠️ 사용 가능한 도구

MCP 서버는 AI 어시스턴트가 사용할 수 있는 다음 도구들을 제공합니다:

### `list_buckets`

구성된 자격 증명으로 액세스 가능한 모든 S3 버킷을 나열합니다.

**매개변수**: 없음

### `list_objects`

선택적 접두사 필터링을 지원하여 S3 버킷의 객체를 나열합니다.

**매개변수**:
- `bucket_name` (문자열): S3 버킷 이름
- `prefix` (문자열, 선택사항): 객체를 필터링할 접두사

### `upload_file`

MIME 타입 자동 감지로 로컬 파일을 S3에 업로드합니다.

**매개변수**:
- `local_file_path` (문자열): 로컬 파일 경로
- `bucket_name` (문자열): 대상 S3 버킷
- `object_key` (문자열): S3 객체 키 (대상 경로)
- `content_type` (문자열, 선택사항): 콘텐츠 타입 (제공되지 않으면 자동 감지)
- `storage_class` (문자열, 선택사항): S3 스토리지 클래스
- `cache_control` (문자열, 선택사항): 캐시 제어 헤더

### `get_object`

S3에서 객체를 검색하며, 두 가지 작업 모드가 있습니다: 직접 콘텐츠 읽기 또는 파일로 다운로드.

**매개변수**:
- `bucket_name` (문자열): 소스 S3 버킷
- `object_key` (문자열): S3 객체 키
- `version_id` (문자열, 선택사항): 버전화된 객체의 버전 ID
- `mode` (문자열, 선택사항): 작업 모드 - "read" (기본값)는 콘텐츠를 직접 반환, "download"는 로컬 파일에 저장
- `local_path` (문자열, 선택사항): 로컬 파일 경로 (모드가 "download"일 때 필수)
- `max_content_size` (숫자, 선택사항): 읽기 모드의 최대 콘텐츠 크기 (바이트) (기본값: 1MB)

## 아키텍처

MCP 서버는 모듈식 아키텍처로 구축되었습니다:

```
rustfs-mcp/
├── src/
│   ├── main.rs          # 진입점, CLI 파싱 및 서버 초기화
│   ├── server.rs        # MCP 서버 구현 및 도구 핸들러
│   ├── s3_client.rs     # 비동기 작업을 포함한 S3 클라이언트 래퍼
│   ├── config.rs        # 구성 관리 및 CLI 옵션
│   └── lib.rs           # 라이브러리 익스포트 및 공개 API
└── Cargo.toml           # 의존성, 메타데이터 및 바이너리 구성
```

