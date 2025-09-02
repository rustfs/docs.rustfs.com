---
title: "기타 SDK"
description: "이 문서는 RustFS에서 기타 다양한 언어의 SDK 사용에 대해 설명합니다."
---

# 기타 SDK

AWS S3 공식에서 사용하는 언어를 지원하지 않는 경우, RustFS에 연결하기 위해 다음과 같은 몇 가지 전략을 채택할 수 있습니다:

## 1. HTTP 인터페이스를 통한 직접 요청 사용(S3 API 프로토콜 기반)

S3 프로토콜은 표준 RESTful API입니다. HTTP 요청을 지원하는 모든 언어(예: C, Rust, Lua, Erlang)를 사용하여 액세스 로직을 직접 캡슐화할 수 있습니다.

### 핵심 포인트

* **서명 알고리즘**: AWS Signature Version 4 서명 구현(복잡함)
* **올바른 Header와 Canonical Request 구성**
* **HTTPS/HTTP 클라이언트를 사용하여 요청 전송**

👉 오픈소스 프로젝트의 서명 구현을 참조하는 것을 권장합니다. 예:

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. 기존 SDK의 CLI 도구 또는 중간 서비스 호출

서명을 직접 구현하고 싶지 않다면:

### 2.1. 기존 언어 지원 AWS CLI 도구 사용

예를 들어 Shell을 통해 호출:

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

또는 Node.js/Python SDK를 사용하여 간단한 중계 서비스를 작성하고, 언어가 이 서비스를 호출하여 업로드/다운로드합니다.

### 2.2. Proxy 구축(예: Flask, FastAPI, Express)

S3를 지원하지 않는 클라이언트가 캡슐화된 HTTP API를 호출하도록:

```http
POST /upload -> 서비스 내부에서 SDK를 호출하여 RustFS에 객체 업로드
GET /presigned-url -> 프론트엔드/클라이언트용 사전 서명된 URL 생성
```

---

## 3. 서드파티 커뮤니티 SDK 찾기

AWS에 공식 SDK가 없지만 일부 언어 커뮤니티에서 비공식 S3 클라이언트를 개발했습니다. 예:

* Haskell: `amazonka-s3`
* Rust: `rusoto`(사용 중단) 또는 `aws-sdk-rust`
* OCaml: `cohttp`를 통해 직접 구현 가능
* Delphi: S3 프로토콜을 지원하는 상용 라이브러리 있음

커뮤니티 SDK의 안정성은 크게 다르므로, 사용 전 활성도, 문서 및 호환성을 평가해야 합니다.

---

## 4. 핵심 업로드 로직을 플랫폼에 위임

예:

* 프론트엔드(Web/Mobile) 업로드 작업을 브라우저나 App 측에서 실행(사전 서명된 URL 사용)
* 백그라운드에서 Node.js/Python/Go 등을 사용하여 업로드 로직을 중계로 구현

---

## 요약 권장사항

| 시나리오 | 권장 솔루션 |
| ------------- | ---------------------------------- |
| 완전한 제어/임베디드 환경 필요 | Signature V4 자체 서명 구현 |
| 언어 지원이 약하지만 Shell 있음 | AWS CLI를 통한 업로드 호출 |
| 중계 서비스 배포 가능 | Python/Node를 사용하여 S3 API 게이트웨이 구축 |
| 프론트엔드 업로드 | 사전 서명된 URL 사용 |
