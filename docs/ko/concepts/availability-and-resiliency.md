---
title: "가용성 및 확장성 설명"
description: "이 문서는 RustFS 확장 관련 기술과 설명을 자세히 설명합니다."
---

# 가용성 및 확장성 설명

## 확장 계획 개요

RustFS는 새로운 스토리지 풀(Server Pool) 추가를 통한 수평 확장을 지원합니다. 새로 추가되는 각 스토리지 풀은 다음을 만족해야 합니다:

1. 스토리지 풀 내 노드는 **연속적인 호스트명**을 사용해야 함 (예: node5-node8)
2. 단일 스토리지 풀 내에서는 **동일한 사양**의 디스크를 사용해야 함 (타입/용량/수량)
3. 새로운 스토리지 풀은 기존 클러스터와 **시간 동기화** 및 **네트워크 연결**을 유지해야 함

![RustFS 아키텍처 다이어그램](./images/s2-1.png)

---

## I. 확장 전 준비

### 1.1 하드웨어 계획 요구사항

| 항목 | 최소 요구사항 | 권장 프로덕션 구성 |
|---------------|---------------------------|---------------------------|
| 노드 수 | 4 노드/스토리지 풀 | 4 - 8 노드/스토리지 풀 |
| 노드당 메모리 | 128 GB | 128 GB |
| 디스크 타입 | SSD | NVMe SSD |
| 디스크당 용량 | ≥1 TB | ≥4 TB |
| 네트워크 대역폭 | 10 Gbps | 25 Gbps |

### 1.2 시스템 환경 검사

```bash
# 호스트명 연속성 확인 (새 노드 예시)
cat /etc/hosts
192.168.10.5 node5
192.168.10.6 node6
192.168.10.7 node7
192.168.10.8 node8

# 시간 동기화 상태 확인
timedatectl status | grep synchronized

# 방화벽 규칙 확인 (모든 노드에서 7000/7001 포트 열어야 함)
firewall-cmd --list-ports | grep 7000
```

---

## II. 확장 구현 단계

### 2.1 새 노드 기본 구성

```bash
# 전용 사용자 생성 (모든 새 노드에서 실행)
groupadd rustfs-user
useradd -M -r -g rustfs-user rustfs-user

# 스토리지 디렉토리 생성 (8개 디스크 예시)
mkdir -p /data/rustfs{0..7}
chown -R rustfs-user:rustfs-user /data/rustfs*
```

### 2.2 RustFS 서비스 설치

```bash
# 최신 바이너리 패키지 다운로드 (버전은 기존 클러스터와 일치해야 함)
wget https://dl.rustfs.com/rustfs/v2.3.0/rustfs -O /usr/local/bin/rustfs
chmod +x /usr/local/bin/rustfs

# 구성 파일 생성 (/etc/default/rustfs)
cat <<EOF > /etc/default/rustfs
RUSTFS_ROOT_USER=admin
RUSTFS_ROOT_PASSWORD=YourSecurePassword
RUSTFS_VOLUMES="/data/rustfs{0...7}"
RUSTFS_ADDRESS=":7000"
RUSTFS_CONSOLE_ADDRESS=":7001"
EOF
```

### 2.3 클러스터 확장 작업

```bash
# 모든 기존 노드에서 구성 업데이트 (새 스토리지 풀 추가)
sed -i '/RUSTFS_VOLUMES/s|"$| http://node{5...8}:7000/data/rustfs{0...7}"|' /etc/default/rustfs

# 전역 서비스 재시작 (모든 노드에서 동시 실행)
systemctl restart rustfs.service
```

---

## III. 확장 후 검증

### 3.1 클러스터 상태 확인

```bash
# 노드 가입 상태 확인
curl -s http://node1:7001/cluster/nodes | jq .poolMembers

# 스토리지 풀 분산 확인
rc admin info cluster
```

### 3.2 데이터 균형 검증

```bash
# 데이터 분산 비율 확인 (각 스토리지 풀의 용량 비율과 유사해야 함)
watch -n 5 "rustfs-admin metrics | grep 'PoolUsagePercent'"
```

---

## IV. 주의사항

1. **롤링 재시작 금지**: 데이터 불일치를 피하기 위해 모든 노드를 동시에 재시작해야 함
2. **용량 계획 권장사항**: 스토리지 사용률이 70%에 도달하기 전에 다음 확장을 계획해야 함
3. **성능 튜닝 권장사항**:

```bash
# 커널 매개변수 조정 (모든 노드)
echo "vm.swappiness=10" >> /etc/sysctl.conf
echo "net.core.somaxconn=32768" >> /etc/sysctl.conf
sysctl -p
```

---

## V. 장애 해결 가이드

| 현상 | 확인점 | 수정 명령 |
|---------------------------|---------------------------------|-------------------------------|
| 새 노드가 클러스터에 참여할 수 없음 | 7000 포트 연결성 확인 | `telnet node5 7000` |
| 데이터 분산 불균형 | 스토리지 풀 용량 구성 확인 | `rustfs-admin rebalance start`|
| 콘솔에서 노드 상태 이상 표시 | 시간 동기화 상태 확인 | `chronyc sources` |

> 팁: 이 문서는 RustFS 최신 버전을 기반으로 작성되었습니다. 확장 작업 전에 반드시 전체 데이터 백업을 수행하세요. 프로덕션 환경의 경우 RustFS 기술 지원 엔지니어에게 연락하여 계획 검토를 받을 것을 권장합니다.

