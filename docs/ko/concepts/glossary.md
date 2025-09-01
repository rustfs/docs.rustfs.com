---
title: "용어 설명"
description: "객체 스토리지에서 자주 사용되는 용어들을 소개하여 사용자가 객체 스토리지를 빠르게 이해할 수 있도록 합니다"
---

# 객체 스토리지 핵심 용어 전집（100항）

| 번호 | 용어 | 영문 | 설명 |
|------|--------------------------|------------------------------|--------------------------------------------------------------------------|
| 1 | 객체 스토리지 | Object Storage | 데이터를 객체(Object) 형태로 저장하는 아키텍처, 기존 파일 계층 구조를 대체 |
| 2 | 버킷 | Bucket | 객체를 저장하는 컨테이너, 전역 고유 네임스페이스 |
| 3 | 객체 | Object | 스토리지 기본 단위, 데이터, 메타데이터 및 고유 식별자(Object Key) 포함 |
| 4 | 메타데이터 | Metadata | 객체 속성을 설명하는 키-값 쌍 정보(파일 유형, 생성 시간 등) |
| 5 | S3 호환 | S3-Compatible | 아마존 S3 API 표준과 호환되는 스토리지 서비스 |
| 6 | 데이터 내구성 | Data Durability | 데이터가 시스템에서 장기간 보존되어 손실되지 않을 확률(예: 99.999999999%) |
| 7 | 다중 복제 | Replication | 여러 복사본을 통해 데이터 안전성을 보장하는 중복 기술 |
| 8 | 소거 코딩 | Erasure Coding | 데이터를 분할하여 인코딩 저장, 더 적은 공간으로 높은 신뢰성 구현 |
| 9 | 콜드 스토리지 | Cold Storage | 저빈도 접근 데이터를 위한 저비용 스토리지 유형(아카이브 데이터 등) |
| 10 | 라이프사이클 관리 | Lifecycle Management | 객체 자동 이전/삭제 정책(예: 30일 후 콜드 스토리지로 이전) |
| 11 | 버전 관리 | Versioning | 객체의 이전 버전을 보관하여 덮어쓰기 방지 |
| 12 | 스토리지 클래스 | Storage Class | 성능/비용이 다른 스토리지 계층(표준형, 저빈도형, 아카이브형) |
| 13 | 액세스 키 | Access Key | API 요청의 신원 인증 키(Access Key ID + Secret Access Key) |
| 14 | 리전 | Region | 스토리지 인프라의 지리적 위치(예: 동중국 1, 미서부) |
| 15 | 가용 영역 | Availability Zone (AZ) | 동일 리전 내 독립적인 전력/네트워크의 격리된 데이터센터 |
| 16 | 엔드포인트 | Endpoint | 스토리지 서비스 접근을 위한 도메인 주소(예: us-east1.rustfs.com) |
| 17 | RESTful API | RESTful API | HTTP 프로토콜 기반의 API 설계 규범 |
| 18 | 멀티파트 업로드 | Multipart Upload | 대용량 파일을 분할 업로드 후 병합하는 메커니즘 |
| 19 | 사전 서명 URL | Pre-Signed URL | 시효성이 있는 임시 접근 링크 |
| 20 | 서버 사이드 암호화 | SSE | 서버 측에서 자동으로 데이터 암호화(SSE-S3/SSE-KMS/SSE-C) |
| 21 | 클라이언트 암호화 | CSE | 클라이언트 로컬에서 암호화 후 업로드 |
| 22 | 교차 리전 복제 | Cross-Region Replication | 지리적 리전 간 객체 자동 복제 |
| 23 | 액세스 제어 목록 | ACL | 버킷/객체 접근 권한을 제어하는 규칙 목록 |
| 24 | 버킷 정책 | Bucket Policy | JSON 기반의 세밀한 권한 제어 정책 |
| 25 | IAM | Identity and Access Management | 사용자/역할의 접근 권한을 중앙 관리하는 시스템 |
| 26 | 이벤트 알림 | Event Notification | 이벤트 발생 시 메시지 큐/함수 컴퓨팅으로 알림 전송 |
| 27 | 데이터 레이크 | Data Lake | 구조화/비구조화 데이터를 중앙 집중 저장하는 저장소 |
| 28 | 컴플라이언스 | Compliance | GDPR, HIPAA 등 데이터 저장 법규 준수 요구사항 |
| 29 | 로그 감사 | Logging & Audit | 모든 API 작업 로그를 기록하여 감사 |
| 30 | 모니터링 알림 | Monitoring & Alerting | 스토리지 사용량/요청 수를 실시간 모니터링하고 알림 트리거 |
| 31 | 교차 도메인 리소스 공유 | CORS | 브라우저의 교차 도메인 리소스 접근을 제어하는 규칙 |
| 32 | 전송 가속 | Transfer Acceleration | 엣지 노드를 통한 업로드/다운로드 속도 최적화 |
| 33 | CDN 가속 | CDN Integration | 콘텐츠 전송 네트워크와 결합한 캐시 가속 |
| 34 | 데이터 내보내기 | Data Export | 데이터를 다른 스토리지 시스템으로 마이그레이션하는 프로세스 |
| 35 | 데이터 가져오기 | Data Import | 외부 시스템에서 객체 스토리지로 데이터 일괄 마이그레이션 |
| 36 | 정적 웹사이트 호스팅 | Static Website Hosting | 버킷을 통해 HTML/CSS/JS 등 정적 파일 직접 호스팅 |
| 37 | 핫링크 보호 | Hotlink Protection | 외부 웹사이트의 리소스 링크 도용을 방지하는 기술 |
| 38 | 요청 비율 제한 | Request Rate Limiting | 개별 사용자/IP의 API 요청 빈도 제어 |
| 39 | 태그 | Tagging | 버킷/객체에 분류 태그를 추가하여 관리 편의성 제공 |
| 40 | 인벤토리 보고서 | Inventory Report | 저장된 객체 목록을 정기적으로 생성하는 CSV/ORC 파일 |
| 41 | 데이터 복구 | Data Restoration | 아카이브 스토리지에서 데이터를 접근 가능한 상태로 복구 |
| 42 | 스토리지 게이트웨이 | Storage Gateway | 객체 스토리지를 로컬 파일 시스템으로 매핑하는 접근 계층 |
| 43 | 데이터 압축 | Data Compression | 업로드 전 데이터 압축으로 스토리지 공간 절약 |
| 44 | 데이터 중복 제거 | Data Deduplication | 중복 데이터 제거로 스토리지 사용량 감소 |
| 45 | 다이렉트 읽기 아카이브 | Direct Read Archive | 복구 없이 아카이브 데이터를 직접 읽는 기술 |
| 46 | 트래픽 제어 | Bandwidth Control | 다운로드 대역폭 제한으로 네트워크 혼잡 방지 |
| 47 | 동시 연결 수 | Concurrent Connections | 동시 처리되는 데이터 전송 연결 수량 |
| 48 | 데이터 마이그레이션 서비스 | Data Migration Service | 자동화된 마이그레이션 도구(AWS Snowball 등) |
| 49 | 클라이언트 SDK | Client SDK | 개발자가 스토리지 서비스를 통합하는 도구킷(Python/Java SDK 등) |
| 50 | CLI 도구 | Command Line Interface | 명령줄 관리 도구(aws s3 cp 등) |
| 51 | 그래픽 콘솔 | Web Console | 웹 페이지 관리 인터페이스 |
| 52 | 데이터 검증 | Data Integrity Check | MD5/SHA를 통한 전송 완전성 검증 |
| 53 | 단점 계속 전송 | Resumable Upload/Download | 네트워크 중단 후 단점에서 계속 전송 |
| 54 | 미러 백투소스 | Mirror Back to Source | 존재하지 않는 객체 요청 시 지정된 원본에서 가져와 저장 |
| 55 | 그레이 릴리즈 | Canary Release | 신기능을 일부 사용자에게 점진적으로 공개하는 릴리즈 전략 |
| 56 | 소프트 삭제 | Soft Delete | 객체를 삭제 표시하되 복구 가능 기간 유지 |
| 57 | 객체 잠금 | Object Lock | 객체 삭제나 덮어쓰기를 방지하는 컴플라이언스 보호 메커니즘 |
| 58 | 워터마크 | Watermarking | 이미지/비디오에 식별 정보 추가 |
| 59 | 썸네일 생성 | Thumbnail Generation | 이미지의 축소판 버전 자동 생성 |
| 60 | 이미지 처리 | Image Processing | 온라인 자르기/크기 조정/회전 등 처리 기능 |
| 61 | 비디오 트랜스코딩 | Video Transcoding | 다양한 기기에 맞는 비디오 포맷/해상도 변환 |
| 62 | 콘텐츠 조정 | Content Moderation | 위반 이미지/비디오/텍스트 자동 감지 |
| 63 | 비용 분석 | Cost Analysis | 스토리지 유형/요청 횟수 등 차원별 비용 통계 |
| 64 | 사용량 모니터링 | Usage Monitoring | 스토리지량/트래픽/요청 횟수의 실시간 대시보드 |
| 65 | 스토리지 분석 | Storage Analytics | 스토리지 패턴 분석으로 비용 최적화 도구 |
| 66 | 요청자 결제 | Requester Pays | 데이터 다운로드 측이 비용을 부담하는 과금 모델 |
| 67 | 데이터 티어링 | Tiered Storage | 데이터를 더 저렴한 스토리지 계층으로 자동 이전 |
| 68 | 인텔리전트 티어링 | Intelligent Tiering | 접근 패턴 기반으로 최적의 스토리지 유형 자동 선택 |
| 69 | 프라이빗 링크 | PrivateLink | 내부망을 통한 직접 객체 스토리지 접근으로 공인망 노출 방지 |
| 70 | VPC 엔드포인트 | VPC Endpoint | 가상 프라이빗 클라우드 내 스토리지 서비스 안전 접근 진입점 |
| 71 | 전송 암호화 | SSL/TLS | HTTPS 프로토콜을 통한 데이터 전송 암호화 |
| 72 | 클라이언트 암호화 | Client-Side Encryption | 사용자가 업로드 전 스스로 데이터 암호화 |
| 73 | KMS | Key Management Service | 암호화 키를 중앙 관리하는 서비스 |
| 74 | 권한 경계 | Permission Boundary | IAM 역할/사용자의 최대 권한 범위 제한 |
| 75 | 임시 자격증명 | Temporary Credentials | 단기 유효한 접근 토큰(STS Token 등) |
| 76 | MFA 삭제 보호 | MFA Delete | 다요소 인증이 필요한 데이터 삭제 |
| 77 | 데이터 불변성 | Immutability | 데이터 변조를 방지하는 특성(WORM 모델과 결합) |
| 78 | 법적 보존 | Legal Hold | 컴플라이언스 시나리오에서 데이터 삭제/수정을 금지하는 강제 보호 |
| 79 | 교차 계정 공유 | Cross-Account Sharing | 다른 클라우드 계정이 지정된 스토리지 리소스에 접근 허용 |
| 80 | 프리페치 정책 | Prefetch Policy | 데이터를 미리 캐시에 로드하여 후속 접근 가속 |
| 81 | 캐시 제어 | Cache-Control | HTTP 헤더를 통한 브라우저/CDN 캐시 동작 지정 |
| 82 | 지연 삭제 | Delayed Deletion | 실수 방지를 위한 삭제 작업 지연 실행 |
| 83 | 배치 작업 | Batch Operations | 다수 객체에 대한 통합 작업(삭제/복사/복구) |
| 84 | 데이터 계보 | Data Lineage | 데이터 출처와 변경 이력을 추적하는 메타데이터 기록 |
| 85 | 데이터 카탈로그 | Data Catalog | 메타데이터 정보를 저장하는 검색 시스템 |
| 86 | 스토리지 게이트웨이 | Storage Gateway | 로컬 시스템과 클라우드 스토리지를 연결하는 하이브리드 클라우드 솔루션 |
| 87 | 하이브리드 클라우드 스토리지 | Hybrid Cloud Storage | 로컬 스토리지와 클라우드 스토리지를 동시 사용하는 아키텍처 |
| 88 | 엣지 스토리지 | Edge Storage | 데이터 소스에 가까운 엣지 노드에서 스토리지 서비스 제공 |
| 89 | 멀티 클라우드 스토리지 | Multi-Cloud Storage | 서로 다른 클라우드 서비스 제공업체의 스토리지 방안 |
| 90 | 스토리지 연합 | Storage Federation | 여러 스토리지 시스템을 통합 관리하는 추상화 계층 |
| 91 | 객체 태그 | Object Tag | 객체에 커스텀 분류 태그 추가 |
| 92 | 버킷 태그 | Bucket Tag | 버킷에 관리/과금 관련 태그 추가 |
| 93 | 스토리지 할당량 | Storage Quota | 버킷의 최대 용량 제한 |
| 94 | 요청 스로틀링 | Request Throttling | 단위 시간 내 API 요청 횟수 제한 |
| 95 | 서비스 수준 계약 | SLA | 서비스 가용성/내구성의 약속 지표(99.9% 가용성 등) |
| 96 | 재해 복구 | Disaster Recovery | 교차 리전 백업을 통한 비즈니스 연속성 보장 |
| 97 | 스토리지 토폴로지 | Storage Topology | 데이터의 물리적/논리적 계층 분산 구조 |
| 98 | 근접 접근 | Proximity Access | 사용자 요청을 가장 가까운 스토리지 노드로 라우팅 |
| 99 | 글로벌 통합 네임스페이스 | Global Namespace | 교차 리전 버킷의 통합된 보기 관리 |
| 100 | 제로 카피 마이그레이션 | Zero-Copy Migration | 메타데이터 작업을 통한 빠른 데이터 마이그레이션 |
