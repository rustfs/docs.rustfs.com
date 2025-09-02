# Amazon Elastic Kubernetes Service용 RustFS

## 고객이 Amazon EKS에서 RustFS를 실행하는 세 가지 이유

- RustFS는 하이브리드 클라우드 또는 멀티클라우드 배포 시나리오에서 일관된 저장소 계층 역할을 합니다
- RustFS는 Kubernetes 네이티브 고성능 제품으로, 공용 클라우드, 프라이빗 클라우드 및 엣지 클라우드 환경에서 예측 가능한 성능을 제공할 수 있습니다
- EKS에서 RustFS를 실행하면 소프트웨어 스택을 제어하고 클라우드 잠금을 피하는 데 필요한 유연성을 가질 수 있습니다

Amazon Elastic Kubernetes Service(Amazon EKS)는 AWS에서 Kubernetes를 실행할 수 있는 관리형 서비스로, 자체 Kubernetes 제어 평면이나 노드를 설치, 운영 및 유지 관리할 필요가 없습니다.

RustFS는 모든 주요 Kubernetes 플랫폼(알리바바 클라우드 ACK, Tanzu, Azure, GCP, 알리바바 클라우드 ACK)에서 이식 가능한 고성능 객체 저장소 시스템을 제공합니다. AWS에서 RustFS는 Amazon EKS 서비스와 네이티브 통합되어 자체 대규모 멀티테넌트 객체 저장소를 서비스로 실행하는 것이 더 쉬워집니다. RustFS는 AWS S3 저장소 서비스의 완전한 대안입니다.

![RustFS 아키텍처 다이어그램](images/sec1-1.png)

AWS S3와 달리 RustFS는 애플리케이션이 비용이 많이 드는 소프트웨어 재작성이나 독점 통합 없이 멀티클라우드 및 하이브리드 클라우드 인프라를 통해 확장할 수 있게 합니다. RustFS가 컨테이너화되고 Kubernetes 네이티브이기 때문에 대규모 저장소 인프라를 운영하는 전문 기술 없이도 이러한 플랫폼에서 롤아웃할 수 있습니다.

## RustFS Operator와 VMWare Tanzu 기능 네이티브 통합

### 기능 개요

- **저장소 클래스 및 계층화**
- **외부 로드 밸런싱**
- **암호화 키 관리**
- **신원 관리**
- **인증서 관리**
- **모니터링 및 경고**
- **로깅 및 감사**

## 저장소 클래스 및 계층화

Amazon EKS에서 대규모로 RustFS를 배포하는 핵심 요구사항은 저장소 클래스(NVMe, HDD, 공용 클라우드)를 넘어 계층화할 수 있는 능력입니다. 이는 기업이 비용과 성능을 동시에 관리할 수 있게 합니다.

RustFS는 오래된 객체를 빠른 NVMe 계층에서 비용 효율적인 HDD 계층으로, 심지어 비용 최적화된 차가운 공용 클라우드 저장소 계층으로 자동 전환하는 것을 지원합니다.

계층화 시 RustFS는 계층을 넘어 통합된 네임스페이스를 제공합니다. 계층 간 이동은 애플리케이션에 투명하며 고객이 결정한 정책에 의해 트리거됩니다.

RustFS는 소스에서 객체를 암호화하여 Amazon EKS 하이브리드 클라우드에서 안전한 저장소를 제공하여 고객이 항상 데이터를 완전히 제어할 수 있도록 보장합니다. Amazon EKS가 공용 클라우드에 배포될 때 계층화 기능은 Amazon EKS가 영구 블록 저장소와 더 저렴한 객체 저장소 계층을 넘어 데이터를 효율적으로 관리하는 데 도움이 됩니다.

**더 알아보기:**

## 외부 로드 밸런싱

RustFS의 모든 통신은 HTTP, RESTful API를 기반으로 하며 모든 표준 Kubernetes 호환 인그레스 컨트롤러를 지원합니다. 여기에는 하드웨어 및 소프트웨어 정의 솔루션이 포함됩니다. 가장 인기 있는 선택은 NGINX입니다. OperatorHub 또는 OpenShift Marketplace를 사용하여 설치한 다음 주석을 사용하여 RustFS 테넌트를 노출합니다.

## 암호화 키 관리

네이티브 OpenShift 키 관리 기능이 없습니다. 따라서 RustFS는 HashiCorp Vault를 사용하여 객체 저장소 시스템 외부에 키를 저장하는 것을 권장합니다. 이는 클라우드 네이티브 애플리케이션의 모범 사례입니다.

모든 프로덕션 환경에 대해 기본적으로 모든 버킷에서 암호화를 활성화하는 것을 권장합니다. RustFS는 AES-256-GCM 또는 ChaCha20-Poly1305 암호화를 사용하여 데이터 무결성과 기밀성을 보호하며, 성능에 미치는 영향은 무시할 수 있습니다.

RustFS는 세 가지 서버 사이드 암호화(SSE-KMS, SSE-S3 및 SSE-C) 모드를 모두 지원합니다. SSE-S3 및 SSE-KMS는 서버 사이드 KMS와 통합되고 SSE-C는 클라이언트가 제공한 키를 사용합니다.

RustFS는 이 KMS를 사용하여 고성능 객체별 암호화를 위한 내부 키 암호화 서버(KES 서비스)를 부트스트랩합니다. 각 테넌트는 격리된 네임스페이스에서 자체 KES 서버를 실행합니다.

## 신원 관리

OpenShift에서 RustFS를 실행할 때 고객은 Keycloak, Okta/Auth0, Google, Facebook, ActiveDirectory 및 OpenLDAP와 같은 타사 OpenID Connect/LDAP 호환 신원 공급자(IdP)를 통해 단일 사인온(SSO)을 관리할 수 있습니다. RustFS는 OpenID Connect 호환 Keycloak IdP를 권장합니다.

외부 IdP를 사용하면 관리자가 사용자/애플리케이션 신원을 중앙에서 관리할 수 있습니다. RustFS는 IdP 위에 구축되어 AWS IAM 스타일의 사용자, 그룹, 역할, 정책 및 토큰 서비스 API를 제공합니다. 인프라와 독립적인 통합 신원 및 액세스 관리(IAM) 계층의 능력은 상당한 아키텍처 유연성을 제공합니다.

## 인증서 관리

애플리케이션에서 RustFS까지의 모든 트래픽, 노드 간 트래픽을 포함하여 TLS 암호화를 사용합니다. TLS 인증서는 네트워크 통신을 보호하고 RustFS 서버 도메인과 같은 네트워크 연결 리소스의 신원을 설정하는 데 사용됩니다.

RustFS는 OpenShift 인증서 관리자와 통합되어 RustFS 운영자가 RustFS 테넌트에 대한 인증서를 자동으로 구성, 설정, 관리 및 업데이트할 수 있습니다. 테넌트는 보안을 향상시키기 위해 자체 인증서를 가진 자체 Kubernetes 네임스페이스에서 완전히 서로 격리됩니다.

## 모니터링 및 경고

RustFS는 Grafana, OpenShift-user-workload-monitoring 프로젝트에 설치된 플랫폼 모니터링 구성 요소 또는 RustFS에 연결할 수 있는 기타 OpenShift 컨테이너 모니터링 도구를 사용하는 것을 권장합니다. RustFS는 버킷 용량부터 액세스 메트릭까지 저장소와 관련된 모든 상상 가능한 Prometheus 메트릭을 게시합니다. 이러한 메트릭은 Prometheus 호환 도구나 RustFS 콘솔에서 수집하고 시각화할 수 있습니다.

외부 모니터링 솔루션은 RustFS Prometheus 엔드포인트를 정기적으로 스크랩합니다. RustFS는 Grafana 또는 OpenShift-user-workload-monitoring 프로젝트에 설치된 플랫폼 모니터링 구성 요소를 사용하여 RustFS에 연결하는 것을 권장합니다. 이러한 동일한 도구는 기준선을 설정하고 알림 경고 임계값을 설정하는 데에도 사용할 수 있으며, 그런 다음 PagerDuty, Freshservice 또는 SNMP와 같은 알림 플랫폼으로 라우팅할 수 있습니다.

## 로깅 및 감사

RustFS 감사를 활성화하면 객체 저장소 클러스터의 모든 작업에 대한 로그가 생성됩니다. 감사 로그 외에도 RustFS는 운영 문제 해결을 위한 콘솔 오류를 기록합니다.

RustFS는 분석 및 경고를 위해 로그를 Elastic Stack(또는 타사)으로 출력하는 것을 지원합니다.
