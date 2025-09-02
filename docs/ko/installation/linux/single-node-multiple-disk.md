---
title: RustFS 단일 서버 다중 디스크 설치
description: 단일 서버의 다중 디스크에 RustFS 설치, 데이터가 다중 디스크에 저장됩니다.
---

# 단일 서버 다중 디스크 모드(SNMD, Single Node Multiple Disk)

## 1. 설치 전 필독

본 문서에는 단일 서버 다중 디스크 배포 모드가 포함되어 있습니다.

1. 세 가지 설치 활성화 모드를 명확히 해주십시오:
    - [단일 서버 단일 디스크 모드 (SNSD)](./single-node-single-disk.md)
    - [단일 서버 다중 디스크 모드 (SNMD)](./single-node-multiple-disk.md) (현재 문서)
    - [다중 서버 다중 디스크 모드 (MNMD)](./multiple-node-multiple-disk.md)

2. [설치 전 검사](../checklists/index.md), 각 지표가 프로덕션 지침 특성에 부합하는지 확인하십시오. 프로덕션 표준이 필요하지 않다면 이 지침을 읽지 않아도 됩니다;

> 현재 문서는 단일 서버 다중 디스크 모드에 적합합니다. 단일 서버 다중 디스크 모드는 중성 비중요 업무에 적용되며, 프로덕션 환경에서 보통 지정된 M개의 하드디스크 손상은 데이터 위험을 초래하지 않지만, 전체 서버가 손상되거나 M개 디스크를 초과하여 손상되면 데이터 손실이 발생합니다. 중요한 데이터의 백업에 주의하십시오.

1대 서버에는 다중 데이터 디스크만 있으며, 데이터는 분할된 형태로 다중 데이터 디스크에 저장됩니다.

하나의 데이터 블록은 지정된 K개의 데이터 블록과 M개의 검증 블록으로 분할되며, 최대 K개의 데이터 블록을 잃을 수 없고, 최대 M개의 검증 블록을 잃을 수 없습니다.

다음 그림을 예로 들면:

<img src="./images/single-node-multiple-disk.jpg" alt="RustFS Single Node Multiple Disk Mode" />

## 2. 선결 조건

1. 운영체제 버전;
2. 방화벽;
3. 메모리 조건;
4. 시간 동기화;
5. 용량 계획;
6. 디스크 계획;
7. 파일 시스템 선택;

### 2.1. 운영체제 버전

Linux 커널 4.x 이상 버전을 권장합니다. 5.x / 6.x 버전이면 더 나은 IO 처리량과 네트워크 성능을 얻을 수 있기 때문입니다.

Ubuntu 22.04와 RHEL8.x를 사용하여 RustFS를 설치할 수 있습니다.

### 2.2 방화벽

Linux 시스템은 기본적으로 방화벽을 활성화합니다. 다음 명령을 사용하여 방화벽 상태를 확인할 수 있습니다:

```bash
systemctl status firewalld
```

방화벽 상태가 "active"라면, 다음 명령을 사용하여 방화벽을 비활성화할 수 있습니다:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

또는 RustFS의 9000 포트를 허용하십시오:

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```

배포 중인 모든 RustFS 서버는 **반드시** 동일한 수신 포트를 사용해야 합니다. 9000 포트를 사용한다면, 다른 서버의 모든 포트도 9000 포트여야 합니다.

### 2.3 메모리 조건

RustFS는 테스트 환경을 실행하기 위해 최소 2GB의 메모리가 필요하며, 프로덕션 환경은 최소 128GB의 메모리가 필요합니다.

### 2.4 시간 동기화

다중 노드의 일관성을 위해서는 시간 서버를 사용하여 시간의 일관성을 유지해야 합니다. 그렇지 않으면 서비스 시작에 실패할 수 있습니다. 관련 시간 서버로는 `ntp`, `timedatectl`, 또는 `timesyncd`를 사용하십시오.

RustFS는 시간 동기화가 필요합니다. 다음 명령을 사용하여 시간 동기화 상태를 확인할 수 있습니다:

```bash
timedatectl status
```

상태가 "synchronized"라면 시간 동기화가 정상입니다.

### 2.5 용량과 EC 계획

객체 스토리지 용량을 계획할 때 다음을 기준으로 권장합니다:

- 초기 데이터량: 한 번에 마이그레이션하거나 저장할 계획인 데이터는 얼마나 됩니까? (예: 500TB)
- 데이터 증가량: 매일/매주/매월의 데이터 증가 용량;
- 계획 주기: 이번 하드웨어 계획이 얼마나 오래 지원되기를 원하십니까? (권장: 3년)
- 회사의 하드웨어 갱신 및 업데이트 주기를 고려하십시오.

EC(소거 코드) 계획은 다음과 같습니다:

| 시나리오 | 권장 검증 레벨 | 설명 |
| - | - | - |
| 표준 프로덕션 환경 | EC:4 | 최대 4개 디스크(또는 노드) 장애를 견딜 수 있으며, 신뢰성과 저장 효율성 사이에서 좋은 균형을 이룹니다. |
| 고가용성 요구 | EC:4 - 8 또는 그 이상 | 데이터 가용성 요구가 매우 높은 시나리오에 적합하지만, 더 많은 저장 공간을 희생합니다. |
| 개발 테스트 환경 | EC:2 | 기본적인 중복 보호를 제공하며, 비중요 업무에 적합합니다. |

### 2.6 디스크 계획

NFS는 고IO 상황에서 팬텀 쓰기와 잠금 문제를 발생시키므로, RustFS 사용 시 **NFS 사용을 금지**해야 합니다. 공식에서 **JBOD(Just a Bunch of Disks)** 모드, 즉 단순 디스크 묶음 사용을 강력히 권장합니다. 이는 물리 디스크를 직접적이고 독립적으로 운영체제에 노출시켜, RustFS 소프트웨어 레이어에서 데이터 중복성과 보호를 담당하게 하는 것을 의미합니다.

이유는 다음과 같습니다:

- **더 나은 성능:** RustFS의 소거 코드(Erasure Coding) 엔진은 고도로 최적화되어 여러 디스크에 직접 병렬로 읽기/쓰기를 수행할 수 있어 하드웨어 RAID 컨트롤러보다 높은 처리량을 달성할 수 있습니다. 하드웨어 RAID가 성능 병목이 될 수 있습니다.
- **더 낮은 비용:** 비싼 RAID 카드가 필요 없어 하드웨어 구매 비용이 절감됩니다.
- **더 간단한 관리:** RustFS가 통합적으로 디스크를 관리하여 스토리지 레이어의 운영을 간소화합니다.
- **더 빠른 장애 복구:** RustFS의 복구(healing) 과정이 기존 RAID 재구축(rebuild)보다 빠르며, 클러스터 성능에 미치는 영향이 적습니다.

공식적으로 NVMe SSD를 저장 매체로 사용하여 더 높은 성능과 처리량을 보장할 것을 권장합니다.

### 2.7 파일 시스템 선택

RustFS 공식에서는 디스크 파일 시스템 형식에 대해 모든 저장용 디스크에 XFS 파일 시스템 사용을 강력히 권장합니다. RustFS의 개발과 테스트는 모두 XFS를 기반으로 하여 최적의 성능과 안정성을 보장할 수 있습니다. ext4, BTRFS, ZFS 등 다른 파일 시스템은 성능 저하나 예측할 수 없는 문제를 야기할 수 있으므로 권장하지 않습니다.

RustFS는 고병렬성, 고성능을 위해 설계된 객체 스토리지 시스템입니다. 클라이언트가 대용량 객체를 업로드하거나 다운로드할 때, RustFS는 이를 분할하여 소거 집합(Erasure Set) 내의 여러 디스크에 병렬 방식으로 동시에 읽기/쓰기를 수행합니다.

XFS의 장점: XFS(eXtents File System)는 설계 초기부터 고성능과 확장성을 위해 만들어졌습니다. 대용량 파일 처리와 고병렬성 I/O 시나리오에서 뛰어난 성능을 보여줍니다. 내부 로그와 데이터 구조(B+트리 등)는 대량의 병렬 읽기/쓰기 요청을 효율적으로 처리할 수 있어 RustFS의 작업 모드와 완벽하게 맞습니다. 이에 반해 ext4 등 파일 시스템은 최근 몇 년간 성능이 크게 향상되었지만, 극한의 병렬 부하에 직면했을 때 XFS는 보통 더 안정적이고 우수한 처리량을 제공할 수 있습니다.

객체 스토리지는 보통 대량의 파일과 거대한 단일 파일(TB 레벨)을 처리해야 합니다. XFS는 64비트 파일 시스템으로 매우 큰 파일 크기(최대 8EB)와 파일 시스템 규모를 지원할 수 있습니다. 메타데이터 관리가 매우 효율적이어서 단일 디렉토리에 수백만 개의 파일이 있어도 성능 저하가 다른 파일 시스템보다 훨씬 적습니다. 이는 RustFS가 각 객체(또는 객체의 특정 버전)를 백엔드 파일 시스템의 독립 파일로 저장하는 방식에 매우 중요합니다.

RustFS가 새 객체나 객체 버전을 쓸 때, 쓰기 성능을 보장하고 파일 단편화를 줄이기 위해 공간 예약을 수행합니다. XFS는 fallocate라는 효율적인 API를 제공하여 애플리케이션이 연속된 디스크 공간 블록을 미리 예약할 수 있게 합니다. RustFS는 이 특성을 이용하여 파일을 쓰기 전에 필요한 공간을 미리 할당하여 쓰기 과정 중 동적 확장과 메타데이터 업데이트로 인한 성능 오버헤드를 피하고, 동시에 파일 단편화 생성을 최대한 줄여 후속 읽기 성능을 보장합니다.

디스크 발견을 더 잘 하기 위해, xfs 파일 시스템을 포맷할 때 **Label** 태그를 사용하여 디스크를 표시할 것을 권장합니다.

먼저 디스크 시스템 상황을 확인해야 합니다:

```
sudo lsblk

NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    0 465.7G  0 disk
├─sda1        8:1    0   512M  0 part /boot/efi
└─sda2        8:2    0 465.2G  0 part /
nvme0n1           8:16   0   3.7T  0 disk  <-- if this is our format new disk
nvme1n1           8:32   0   3.7T  0 disk  <-- if this is our format new disk
nvme2n1          8:48   0   3.7T   0  disk
```

구체적인 포맷 명령은 다음과 같습니다:

```
sudo mkfs.xfs  -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

포맷할 때 성능을 최적화하기 위한 권장 옵션을 추가할 수 있습니다:
- -L \<label\>: 파일 시스템에 레이블을 설정하여 후속 식별과 마운트를 용이하게 합니다.
- -i size=512: RustFS 공식에서는 inode 크기를 512바이트로 설정할 것을 권장합니다. 이는 대량의 작은 객체(메타데이터) 저장 시나리오에서 성능 이점을 제공합니다.
- -n ftype=1: ftype 기능을 활성화합니다. 이는 파일 시스템이 디렉토리 구조에서 파일 유형을 기록할 수 있게 하여 readdir과 unlink 작업 등의 성능을 향상시킬 수 있어 RustFS에 매우 유리합니다.

마운트:

```
# write new line
vim /etc/fstab
LABEL=RUSTFS0 /data/rustfs0   xfs   defaults,noatime,nodiratime   0   0

#save & exit

# mount disk
sudo mount -a 
```

## 3. 사용자명 구성

RustFS 시작을 위해 로그인 권한이 없는 전용 사용자를 구성하여 RustFS 서비스를 시작할 것을 권장합니다. rustfs.service 시작 제어 스크립트에서.

1. **기본 시작 계정 수정하지 않기**: 기본 사용자와 사용자 그룹은 `root`와 `root`입니다. 기본 `root`와 `root`를 사용하고 싶다면 어떠한 수정도 필요하지 않습니다.
2. **기본 시작 계정 수정하지 않기**: groupadd와 useradd 명령을 사용하여 사용자와 그룹을 생성하고, 추가 후 systemctl 시작 구성 파일의 사용자명과 비밀번호를 수정할 수 있습니다.

다음 예시는 사용자, 그룹을 생성하고 RustFS 지정 데이터 디렉토리에 액세스할 권한을 설정하는 방법입니다(선택사항):

```
groupadd -r rustfs-user
useradd -M -r -g rustfs-user rustfs-user
chown rustfs-user:rustfs-user  /data/rustfs*
```

주의:
- rustfs-user 사용자와 그룹을 생성했다면 `/etc/systemd/system/rustfs.service`의 User와 Group을 `rustfs-user`로 변경해야 합니다;
- `/data/rustfs*`를 지정된 마운트 디렉토리로 조정하십시오.

## 4. 설치 패키지 다운로드

먼저 wget 또는 curl을 설치하여 rustfs 설치 패키지를 다운로드하십시오.

```bash
# 다운로드 주소
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip
unzip rustfs-linux-x86_64-musl-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

### 5. 환경 변수 구성

1. 구성 파일 생성

```bash
# 단일 서버 다중 디스크 모드
sudo tee /etc/default/rustfs <<EOF
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ENABLE=true
RUST_LOG=error
RUSTFS_OBS_LOG_DIRECTORY="/var/logs/rustfs/"
EOF
```

2. 저장 디렉토리 생성
```bash
sudo mkdir -p /data/rustfs{0..3} /var/logs/rustfs /opt/tls
sudo chmod -R 750 /data/rustfs* /var/logs/rustfs
```

### 7. 시스템 서비스 구성
1. systemd 서비스 파일 생성

```bash
sudo tee /etc/systemd/system/rustfs.service <<EOF
[Unit]
Description=RustFS Object Storage Server
Documentation=https://rustfs.com/docs/
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
NotifyAccess=main
User=root
Group=root

WorkingDirectory=/usr/local
EnvironmentFile=-/etc/default/rustfs
ExecStart=/usr/local/bin/rustfs \$RUSTFS_VOLUMES

LimitNOFILE=1048576
LimitNPROC=32768
TasksMax=infinity

Restart=always
RestartSec=10s

OOMScoreAdjust=-1000
SendSIGKILL=no

TimeoutStartSec=30s
TimeoutStopSec=30s

NoNewPrivileges=true
ProtectSystem=full
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectClock=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictRealtime=true

# service log configuration
StandardOutput=append:/var/logs/rustfs/rustfs.log
StandardError=append:/var/logs/rustfs/rustfs-err.log

[Install]
WantedBy=multi-user.target
EOF
```

2. 서비스 구성 다시 로드
```bash
sudo systemctl daemon-reload
```

### 8. 서비스 시작과 검증
1. 서비스 시작 및 부팅 시 자동 시작 설정
```bash
sudo systemctl enable --now rustfs
```

2. 서비스 상태 검증
```bash
systemctl status rustfs
```

3. 서비스 포트 확인
```bash
netstat -ntpl
```

4. 로그 파일 확인
```bash
tail -f /var/logs/rustfs/rustfs*.log
```

5. 액세스 콘솔 접근

서버의 IP 주소와 포트를 입력하여 액세스 콘솔에 접근을 시도하십시오. 표시되는 인터페이스는 다음과 같습니다:

![Console](./images/console.jpg)
