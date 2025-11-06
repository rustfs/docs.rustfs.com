---
title: RustFS 단일 노드 단일 디스크 설치
description: 단일 서버의 단일 디스크에 RustFS를 설치하며, 데이터는 이 하나의 디스크에 저장됩니다.
---

# 단일 노드 단일 디스크 모드(SNSD, Single Node Single Disk)


## 1. 설치 전 필독사항

본 문서는 RustFS 단일 노드 다중 디스크 배포 모드를 포함합니다.

1. 세 가지 설치 시작 모드를 명확히 하세요:

    - [단일 노드 단일 디스크 모드(SNSD)](./single-node-single-disk.md)    (현재 문서)
    - [단일 노드 다중 디스크 모드(SNMD)](./single-node-multiple-disk.md)
    - [다중 노드 다중 디스크 모드(MNMD)](./multiple-node-multiple-disk.md)   

2. [설치 전 확인](../checklists/index.md)을 통해 각 지표가 프로덕션 가이드 특성에 부합하는지 확인하세요. 프로덕션 표준이 필요하지 않다면 이 가이드를 읽지 않아도 됩니다;


>  단일 노드 단일 디스크는 저밀도 비중요 업무에 적합하며, 프로덕션 환경에서는 데이터 백업을 권장하여 데이터 위험을 피하세요.

1대 서버에 데이터 디스크가 하나만 있어 모든 데이터가 이 하나의 데이터 디스크에 저장됩니다.

구체적인 아키텍처 다이어그램은 다음과 같습니다:

<img src="./images/single-node-single-disk.jpg" alt="RustFS Single Node Single Disk Mode" />




## 2. 전제조건

1. 운영 체제 버전;

2. 방화벽;

3. 메모리 조건;

4. 시간 동기화;

5. 용량 계획;

6. 디스크 계획;

7. 파일 시스템 선택;


### 2.1. 운영 체제 버전

Linux 커널 4.x 이상 버전을 권장합니다. 5.x / 6.x 버전에서는 더 나은 IO 처리량과 네트워크 성능을 얻을 수 있습니다.

Ubuntu 22.04와 RHEL8.x를 사용하여 RustFS를 설치할 수 있습니다.

### 2.2 방화벽

Linux 시스템은 기본적으로 방화벽이 활성화되어 있습니다. 다음 명령으로 방화벽 상태를 확인할 수 있습니다:

```bash
systemctl status firewalld
```

방화벽 상태가 "active"인 경우 다음 명령으로 방화벽을 비활성화할 수 있습니다:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

또는 RustFS의 9000 포트를 허용합니다:

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```

배포의 모든 RustFS 서버는 **반드시** 동일한 수신 포트를 사용해야 합니다. 9000 포트를 사용하는 경우 다른 서버의 모든 포트도 9000 포트여야 합니다.



### 2.3 메모리 조건

RustFS는 테스트 환경을 실행하기 위해 최소 2GB의 메모리가 필요하며, 프로덕션 환경은 최소 128GB의 메모리가 필요합니다.

### 2.4 시간 동기화

다중 노드의 일관성을 위해서는 시간 서버를 사용하여 시간의 일관성을 유지해야 하며, 그렇지 않으면 서비스를 시작할 수 없는 상황이 발생할 수 있습니다. 관련 시간 서버로는 `ntp`, `timedatectl`, 또는 `timesyncd`를 사용할 수 있습니다.

RustFS는 시간 동기화가 필요합니다. 다음 명령으로 시간 동기화 상태를 확인할 수 있습니다:

```bash
timedatectl status
```

상태가 "synchronized"이면 시간 동기화가 정상입니다.


### 2.5 용량 및 EC 계획

객체 스토리지 용량을 계획할 때 다음을 고려하는 것을 권장합니다:

- 초기 데이터량: 한 번에 마이그레이션하거나 저장할 계획인 데이터량은? (예: 500 TB)
- 데이터 증가량: 일일/주간/월간 데이터 증가 용량;
- 계획 주기: 이번 하드웨어 계획이 얼마나 오래 지원되기를 원하는가? (권장: 3년)
- 회사의 하드웨어 반복 및 업데이트 주기를 고려하세요.

EC(삭제 코딩) 계획은 다음과 같습니다:

| 시나리오	| 권장 검증 수준 |	설명 |
|  -  |  - |  - | 
| 표준 프로덕션 환경	| EC:4	| 최대 4개의 디스크(또는 노드) 장애를 견딜 수 있으며, 신뢰성과 스토리지 효율성 간에 좋은 균형을 이룹니다.| 
| 고가용성 요구사항	| EC:4 - 8 또는 그 이상 | 데이터 가용성 요구사항이 극도로 높은 시나리오에 적합하지만 더 많은 스토리지 공간을 희생합니다.| 
| 개발 테스트 환경	| EC:2|  기본적인 중복 보호를 제공하며, 비중요 업무에 적합합니다.| 


### 2.6 디스크 계획

NFS는 높은 IO 상황에서 팬텀 쓰기와 잠금 문제를 일으키므로, RustFS 사용 시 **NFS를 RustFS의 기본 스토리지 매체로 사용하는 것을 금지**합니다. 공식적으로 **JBOD(Just a Bunch of Disks)** 모드, 즉 단순 디스크 번들링을 강력히 권장합니다. 이는 물리적 디스크를 운영 체제에 직접, 독립적으로 노출시키고 RustFS 소프트웨어 계층에서 데이터 중복성과 보호를 담당하는 것을 의미합니다.


이유는 다음과 같습니다:

- **더 나은 성능:** RustFS의 삭제 코딩(Erasure Coding) 엔진은 고도로 최적화되어 여러 디스크에 직접 동시 읽기/쓰기를 수행할 수 있어 하드웨어 RAID 컨트롤러보다 높은 처리량을 달성할 수 있습니다. 하드웨어 RAID는 성능 병목이 됩니다.
- **더 낮은 비용:** 비싼 RAID 카드가 필요하지 않아 하드웨어 구매 비용을 절감합니다.
- **더 간단한 관리:** RustFS가 디스크를 통합 관리하여 스토리지 계층의 운영을 단순화합니다.
- **더 빠른 장애 복구:** RustFS(healing) 프로세스는 기존 RAID 재구축(rebuild)보다 빠르며 클러스터 성능에 미치는 영향이 적습니다.

공식적으로 디스크에 NVMe SSD를 스토리지 매체로 사용하여 더 높은 성능과 처리량 능력을 보장하는 것을 권장합니다.

### 2.7 파일 시스템 선택

RustFS 공식적으로는 디스크 파일 시스템 형식에 대해 스토리지용 모든 디스크에서 XFS 파일 시스템 사용을 강력히 권장합니다. RustFS의 개발과 테스트는 모두 XFS를 기반으로 하여 최적의 성능과 안정성을 보장할 수 있습니다. ext4, BTRFS 또는 ZFS 등 다른 파일 시스템은 성능 저하나 예측할 수 없는 문제를 일으킬 수 있으므로 권장하지 않습니다.

RustFS는 고동시성, 고성능을 위해 설계된 객체 스토리지 시스템입니다. 클라이언트가 대형 객체를 업로드하거나 다운로드할 때 RustFS는 이를 분할하고 병렬 방식으로 삭제 집합(Erasure Set)의 여러 디스크에 동시에 읽기/쓰기를 수행합니다.

XFS의 장점: XFS(eXtents File System)는 처음부터 고성능과 확장성을 위해 설계되었습니다. 대용량 파일 처리와 고동시성 I/O 시나리오에서 뛰어난 성능을 보입니다. 내부 로그와 데이터 구조(B+트리 등)는 대량의 병렬 읽기/쓰기 요청을 효율적으로 처리할 수 있어 RustFS의 작업 모드와 완벽하게 일치합니다. 반면 ext4 등의 파일 시스템은 최근 몇 년간 성능이 크게 향상되었지만 극한 동시성 부하에 직면했을 때 XFS가 일반적으로 더 안정적이고 우수한 처리량을 제공할 수 있습니다.

객체 스토리지는 일반적으로 대량의 파일과 거대한 개별 파일(TB 수준)을 처리해야 하며, XFS는 64비트 파일 시스템으로 매우 큰 파일 크기(최대 8 EB)와 파일 시스템 규모를 지원할 수 있습니다. 메타데이터 관리가 매우 효율적이어서 단일 디렉터리에 수백만 개의 파일을 저장하더라도 성능 저하가 다른 파일 시스템보다 훨씬 적습니다. 이는 RustFS가 각 객체(또는 객체의 특정 버전)를 백엔드 파일 시스템의 독립적인 파일로 저장하는 방식에 매우 중요합니다.

RustFS가 새 객체나 객체 버전을 쓸 때 쓰기 성능을 보장하고 파일 단편화를 줄이기 위해 공간을 미리 할당하며, XFS는 fallocate라는 효율적인 API를 제공하여 애플리케이션이 연속적인 디스크 공간 블록을 미리 할당할 수 있게 합니다. RustFS는 이 특성을 활용하여 파일을 쓰기 전에 필요한 공간을 미리 할당하여 쓰기 과정에서 동적 확장과 메타데이터 업데이트로 인한 성능 오버헤드를 피하고 파일 단편화를 최대한 줄여 후속 읽기 성능을 보장합니다.

디스크를 더 잘 발견하기 위해 xfs 파일 시스템 포맷 시 **Label** 태그를 사용하여 디스크에 라벨을 붙이는 것을 권장합니다.

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

포맷 시 성능을 최적화하기 위한 권장 옵션을 추가할 수 있습니다:
- -L \<label\>: 파일 시스템에 라벨을 설정하여 후속 식별과 마운트가 편리합니다.
- -i size=512: RustFS 공식적으로 inode 크기를 512바이트로 설정하는 것을 권장하며, 이는 대량의 소형 객체(메타데이터)를 저장하는 시나리오에서 성능 장점이 있습니다.
- -n ftype=1: ftype 기능을 활성화합니다. 이를 통해 파일 시스템이 디렉터리 구조에서 파일 유형을 기록할 수 있어 readdir 및 unlink 같은 작업의 성능을 향상시킬 수 있어 RustFS에 매우 유리합니다.

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

RustFS 시작 시 RustFS 서비스를 시작하기 위한 전용 로그인 권한이 없는 사용자를 구성하는 것을 권장합니다. rustfs.service 시작 제어 스크립트에서.

1. **기본 시작 계정을 수정하지 않음**: 기본 사용자와 사용자 그룹은 `root`와 `root`입니다. 기본 `root`와 `root`를 사용하려면 수정할 필요가 없습니다.
2. **기본 시작 계정을 수정하지 않음**: groupadd와 useradd 명령을 사용하여 사용자와 그룹을 생성하고, 추가 후 systemctl 시작 구성 파일의 사용자명과 비밀번호를 수정할 수 있습니다.


다음 예제는 사용자, 그룹을 생성하고 RustFS 지정 데이터 디렉터리에 액세스할 수 있는 권한을 설정하는 것입니다(선택사항):

```
groupadd -r rustfs-user
useradd -M -r -g rustfs-user rustfs-user
chown rustfs-user:rustfs-user  /data/rustfs*
```

주의:
- rustfs-user 사용자와 그룹을 생성한 경우 `/etc/systemd/system/rustfs.service`의 User와 Group을 `rustfs-user`로 변경해야 합니다;
- ` /data/rustfs*`를 지정된 마운트 디렉터리로 조정하세요.

## 4. 설치 패키지 다운로드

먼저 wget 또는 curl을 설치하여 rustfs 설치 패키지를 다운로드하세요.

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
# 단일 노드 단일 디스크 모드
sudo tee /etc/default/rustfs <<EOF
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs0"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ENABLE=true
RUST_LOG=error
RUSTFS_OBS_LOG_DIRECTORY="/var/logs/rustfs/"
EOF
```




2. 스토리지 디렉터리 생성
```bash
sudo mkdir -p /data/rustfs0 /var/logs/rustfs /opt/tls
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

### 8. 서비스 시작 및 검증
1. 서비스 시작 및 부팅 시 자동 시작 설정
```bash
sudo systemctl enable --now rustfs
```

2. 서비스 상태 확인
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


5. 콘솔 액세스

서버의 IP 주소와 포트를 입력하여 콘솔에 액세스를 시도하면 다음과 같은 인터페이스를 볼 수 있습니다:

![Console](./images/console.jpg)
