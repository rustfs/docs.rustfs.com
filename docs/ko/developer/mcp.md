---
title: "RustFS MCP"
description: "RustFS MCP 사용 가이드"
---

# RustFS MCP

**RustFS MCP 서버**는 [모델 컨텍스트 프로토콜(MCP)](https://www.anthropic.com/news/model-context-protocol)을 지원하는 고성능 서버로, AI/LLM 도구가 S3 호환 객체 스토리지 작업에 원활하게 액세스할 수 있도록 합니다. 이 서버는 최대 성능과 보안을 위해 Rust로 구축되었으며, Claude Desktop과 같은 AI 어시스턴트가 표준화된 프로토콜을 통해 클라우드 스토리지와 상호작용할 수 있게 합니다.

### MCP란 무엇인가요?

모델 컨텍스트 프로토콜은 AI 애플리케이션이 외부 시스템과 안전하고 제어된 연결을 설정할 수 있게 하는 개방 표준입니다. 이 서버는 AI 도구와 S3 호환 스토리지 서비스 간의 브리지 역할을 하며, 보안과 관찰성을 유지하면서 파일 작업에 대한 구조화된 액세스를 제공합니다.

## ✨ 기능

### 지원되는 S3 작업

- **버킷 목록**: 모든 접근 가능한 S3 버킷 목록
- **객체 목록**: 선택적 접두사 필터링으로 버킷 내용 탐색
- **파일 업로드**: 로컬 파일 업로드, MIME 타입 및 캐시 제어 자동 감지
- **객체 가져오기**: S3 스토리지에서 객체 검색, 읽기 또는 다운로드 모드 지원

## 🔧 설치

### 필수 조건

- Rust 1.88+ (소스에서 빌드용)
- 구성된 AWS 자격 증명 (환경 변수, AWS CLI 또는 IAM 역할을 통해)
- S3 호환 스토리지 서비스에 대한 액세스

### 소스에서 빌드

```bash
# 저장소 복제
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# MCP 서버 빌드
cargo build --release -p rustfs-mcp

# 바이너리는 다음 경로에서 사용할 수 있습니다
./target/release/rustfs-mcp
```

## ⚙️ 구성

### 환경 변수

```bash
# AWS 자격 증명 (필수)
export AWS_ACCESS_KEY_ID=액세스키
export AWS_SECRET_ACCESS_KEY=시크릿키
export AWS_REGION=us-east-1  # 선택사항, 기본값 us-east-1

# 선택사항: 사용자 정의 S3 엔드포인트 (MinIO 등용)
export AWS_ENDPOINT_URL=http://localhost:9000

# 로그 레벨 (선택사항)
export RUST_LOG=info
```

## 🛠️ 사용 가능한 도구

MCP 서버는 AI 어시스턴트가 사용할 수 있는 다음 도구들을 제공합니다:

### `list_buckets`
구성된 자격 증명으로 액세스할 수 있는 모든 S3 버킷을 나열합니다.

### `list_objects`
선택적 접두사 필터링을 지원하여 S3 버킷의 객체를 나열합니다.

### `upload_file`
로컬 파일을 S3에 업로드하고 MIME 타입을 자동 감지합니다.

### `get_object`
S3에서 객체를 검색합니다. 두 가지 작업 모드: 직접 내용 읽기 또는 파일 다운로드.

### `create_bucket`
새로운 RustFS 버킷을 생성합니다.

### `delete_bucket`
지정된 RustFS 버킷을 삭제합니다.