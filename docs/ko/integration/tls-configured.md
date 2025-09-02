---
title: "RustFS TLS 구성 가이드"
description: "RustFS 인스턴스에 TLS 구성을 통해 HTTPS로 RustFS에 액세스하여 안전한 파일 저장 및 접근을 구현합니다."
---

# RustFS TLS 구성

RustFS는 [TLS 구성](../integration/tls-configured.md)을 통해 더욱 안전한 방식으로 RustFS 인스턴스에 액세스하고 사용할 수 있도록 지원합니다. 환경 변수 `RUSTFS_TLS_PATH`를 통해 TLS에 필요한 인증서 경로를 지정해야 합니다.

## 구성

### 전제 조건

- 사용 가능한 RustFS 인스턴스 (설치 세부 사항은 [설치 가이드](../installation/index.md) 참조)
- 사용 가능한 인증서 쌍 (인증서 파일과 개인 키 파일 포함)

**참고**: 인증서 쌍의 이름은 반드시 `rustfs_cert.pem`과 `rustfs_key.pem`이어야 하며, 지정된 인증서 경로에 배치되어야 합니다.

### 구성 단계

* Linux 설치

1. RustFS 인스턴스의 구성 파일(기본 파일: `/etc/default/rustfs`)을 편집하여 `RUSTFS_TLS_PATH` 환경 변수를 추가합니다.

    ```bash
    # RustFS 인스턴스의 구성 파일 편집
    sudo vi /etc/default/rustfs

    # RUSTFS_TLS_PATH 환경 변수 추가
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**참고**: `RUSTFS_TLS_PATH`에는 임의의 경로를 지정할 수 있지만, 반드시 `rustfs_cert.pem`과 `rustfs_key.pem` 두 파일이 포함되어야 합니다.

2. RustFS 인스턴스를 재시작하여 구성을 적용합니다.

    ```bash
    systemctl restart rustfs
    ```

`https://rustfs.example.com:9000`을 통해 인스턴스에 액세스합니다.


* Docker 설치

1. `-v` 매개변수를 통해 인증서 경로를 마운트하고, `-e` 매개변수를 통해 `RUSTFS_TLS_PATH` 환경 변수를 지정합니다.

    ```bash
        docker pull rustfs/rustfs:latest
        docker run -d \
        --name rustfs \
        -e RUSTFS_TLS_PATH="/opt/tls/"
        -v /opt/tls:/opt/tls \
        -p 9000:9000 \
        -v /data:/data \
        rustfs/rustfs:latest
    ```

1. RustFS 인스턴스 컨테이너를 재시작한 후, `https://rustfs.example.com:9000`을 통해 인스턴스에 액세스합니다.

**참고**: RustFS 인스턴스 컨테이너는 기본적으로 `rustfs` 사용자로 실행되므로, 인증서 파일(`rustfs_key.pem`과 `rustfs_cert.pem`)의 소유자가 `rustfs`인지 확인해야 합니다. 그렇지 않으면 권한 문제로 인해 RustFS 인스턴스가 인증서 파일을 읽을 수 없어 TLS 구성이 실패할 수 있습니다.
