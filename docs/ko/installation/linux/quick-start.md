---
title: "Linux에서 RustFS 빠른 설치"
description: "RustFS 원클릭 설치 패키지를 사용하여 Linux 환경에서 빠른 배포 설치"
---

# Linux에서 RustFS 빠른 설치

<a id="mode"></a>

## 1. 설치 전 필독사항

이 페이지에는 RustFS의 세 가지 설치 모드에 대한 모든 문서와 설명이 포함되어 있습니다. 그 중 다중 노드 다중 디스크 모드는 엔터프라이즈급 사용 가능한 성능, 보안성 및 확장성을 포함합니다. 그리고 프로덕션 워크로드에 필요한 아키텍처 다이어그램을 제공합니다. 설치 전에 읽어주시기 바라며, 우리의 시작 모드와 체크리스트는 다음과 같습니다:

1. 세 가지 설치 시작 모드를 명확히 하세요:

    - [단일 노드 단일 디스크 모드(SNSD)](./single-node-single-disk.md)
    - [단일 노드 다중 디스크 모드(SNMD)](./single-node-multiple-disk.md)
    - [다중 노드 다중 디스크 모드(MNMD)](./multiple-node-multiple-disk.md)

2. [설치 전 확인](../checklists/index.md)을 통해 각 지표가 프로덕션 가이드 특성에 부합하는지 확인하세요. 프로덕션 표준이 필요하지 않다면 이 가이드를 읽지 않아도 됩니다;


## 2. 빠른 설치

빠른 설치 스크립트를 사용하면 **SNSD(단일 노드 단일 디스크)** 모드로 빠른 설치가 가능합니다. 스크립트는 다음과 같습니다:

~~~
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
~~~


비고:
1. 설치 기본 포트는 `9000` 포트입니다;
2. 설치 기본 경로는 `/data/rustfs0`입니다. 독립 디스크가 있다면 미리 마운트하세요;
3. RustFS zip 설치 패키지가 정상적으로 압축 해제될 수 있도록 미리 `unzip`을 설치하세요.


빠른 설치의 GitHub 주소: https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh



## 3. 기타 주의사항

1. 방화벽이 활성화되어 있는지 확인하세요;
2. NTP 시간 서버의 일관성을 확인하세요;
3. 현재 디스크의 용량과 디스크 계획을 확인하세요;
4. IO-Uring을 지원하는 운영 체제 커널 버전을 확인하세요;
5. SELinux를 확인하세요.
