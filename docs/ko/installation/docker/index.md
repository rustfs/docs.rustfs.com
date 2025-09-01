---
title: "RustFS Docker 설치"
description: "RustFS Docker 배포."
---

# RustFS Docker 설치

RustFS는 고성능, 100% S3 호환 오픈소스 분산 객체 저장소 시스템입니다. 단일 노드 단일 디스크(SNSD) 배포 모드에서 백엔드는 제로 소거 코딩을 채택하여 추가 데이터 중복성을 제공하지 않으며, 로컬 테스트와 소규모 시나리오에 적합합니다.
이 문서는 RustFS 공식 Linux 바이너리 패키지를 기반으로 사용자 정의 Dockerfile을 통해 RustFS와 그 런타임 환경을 컨테이너에 패키징하고, 데이터 볼륨과 환경 변수를 구성하여 원클릭으로 서비스를 시작할 수 있습니다.

---

## I. 사전 준비

1. **호스트 요구사항**

 * Docker(≥ 20.10)가 설치되어 있고 정상적으로 이미지를 pull하고 컨테이너를 실행할 수 있어야 합니다
 * 객체 데이터 마운트를 위한 로컬 경로 `/mnt/rustfs/data`(또는 사용자 정의 경로)
2. **네트워크 및 방화벽**

 * 호스트 머신의 9000 포트가 외부에 열려 있는지 확인하십시오(또는 사용자 정의 포트와 일치)
3. **구성 파일 준비**

 * 호스트 머신의 `/etc/rustfs/config.toml`에서 리스닝 포트, 관리자 계정, 데이터 경로 등을 정의하십시오(4절 참조)

---

## II. RustFS 공식 이미지 빠른 풀링

공식 Ubuntu 베이스 이미지를 사용하여 RustFS 공식 이미지를 빠르게 풀링하십시오:


```bash
docker pull rustfs/rustfs

```

---

## III. 환경 구성 작성

호스트 머신에 구성 파일 `/etc/rustfs/config.toml`을 생성하십시오. 예시 내용:

```bash
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:7000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_ENDPOINT=""
RUSTFS_TLS_PATH="/opt/tls"
```

> **설명:** 구성 항목 형식 및 기본값에 대해서는 공식 Linux 설치 문서를 참조하십시오.

---

## IV. RustFS 컨테이너 실행

RustFS SNSD Docker 실행 방식, 위의 이미지와 구성을 결합하여 실행:

```bash
 docker run -d \
  --name rustfs_local \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest \
  /data
```

매개변수 설명:

* `-p 9000:9000`: 호스트 9000 포트를 컨테이너에 매핑
* `-v /mnt/rustfs/data:/data`: 데이터 볼륨 마운트
* `--name rustfs_local`: 컨테이너 사용자 정의 이름
* `-d`: 백그라운드 실행

---

### 완전한 매개변수 구성 예시

```bash
docker run -d \
  --name rustfs_container \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY=rustfsadmin \
  -e RUSTFS_SECRET_KEY=rustfsadmin \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_SERVER_DOMAINS=example.com \
  rustfs/rustfs:latest \
  --address :9000 \
  --console-enable \
  --server-domains example.com \
  --access-key rustfsadmin \
  --secret-key rustfsadmin \
  /data
```

### 매개변수 설명 및 대응 방법

1. **환경 변수 방식** (추천):
   ```bash
   -e RUSTFS_ADDRESS=:9000 \
   -e RUSTFS_SERVER_DOMAINS=example.com \
   -e RUSTFS_ACCESS_KEY=rustfsadmin \
   -e RUSTFS_SECRET_KEY=rustfsadmin \
   -e RUSTFS_CONSOLE_ENABLE=true \
   ```

2. **명령줄 매개변수 방식**:
   ```
   --address :9000 \
   --server-domains example.com \
   --access-key rustfsadmin \
   --secret-key rustfsadmin \
   --console-enable \
   ```

3. **필수 매개변수**:
    - `<VOLUMES>`: 명령 마지막에 지정, 예: `/data`

### 일반적인 구성 조합

1. **기본 구성**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     rustfs/rustfs:latest \
     /data
   ```

2. **콘솔 활성화**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_CONSOLE_ENABLE=true \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --console-enable \
     /data
   ```

3. **사용자 정의 인증 키**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_ACCESS_KEY=rustfsadmin \
     -e RUSTFS_SECRET_KEY=rustfsadmin \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --access-key rustfsadmin \
     --secret-key rustfsadmin \
     /data
   ```

### 주의사항

1. 포트 매핑이 일치해야 합니다:
    - 서비스 포트 기본값 9000 (`-p 9000:9000`)

2. 데이터 볼륨을 지속화해야 합니다:
    - `-v /host/path:/container/path`

3. 환경 변수와 명령줄 매개변수를 혼합 사용할 수 있지만, 명령줄 매개변수가 더 높은 우선순위를 가집니다

4. [TLS 사용](../../integration/tls-configured.md) 시 인증서 경로를 추가로 마운트해야 합니다:

   ```bash
   -v /path/to/certs:/certs \
   -e RUSTFS_TLS_PATH=/certs \
   ```

## V. 검증 및 접근

1. **컨테이너 상태와 로그 보기:**

 ```bash
 docker logs rustfs_local
 ```

 로그는 서비스 시작 성공과 9000 포트 모니터링을 표시해야 합니다.

2. **S3 API 테스트:**

 `mc` 또는 기타 S3 클라이언트 사용:

 ```bash
 mc alias set rustfs http://localhost:9000 rustfsadmin ChangeMe123!
 mc mb rustfs/mybucket
 mc ls rustfs
 ```

 버킷을 성공적으로 생성하고 나열할 수 있다면 배포가 효과적입니다.


## VI. 기타 권장사항

1. 운영 환경 권장사항:
- 다중 노드 배포 아키텍처 사용
- [TLS 암호화 통신 활성화](../../integration/tls-configured.md)
- 로그 로테이션 전략 구성
- 정기 백업 전략 설정

2. 저장소 권장사항:
- 로컬 SSD/NVMe 저장소 사용
- 네트워크 파일 시스템(NFS) 사용 피하기
- 저장소 디렉토리에 대한 독점 접근 보장

---

## 요약

이 문서는 RustFS 단일 노드 단일 디스크 컨테이너화 베스트 프랙티스를 결합하여 Docker를 통해 직접 RustFS 이미지를 구축하고 SNSD 환경을 배포하는 방법을 상세히 시연했습니다.
이 솔루션은 빠른 시작과 실험에 용이하며, 추후 Kubernetes, Swarm 등의 플랫폼에서 동일한 접근 방식으로 다중 노드 다중 디스크 운영 레벨 클러스터로 확장할 수 있습니다.

