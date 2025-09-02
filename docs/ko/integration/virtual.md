---
title: "Virtual 모드 구성"
description: "RustFS S3의 Virtual 모드 구성 방식과 Path Style 모드 구성"
---

# RustFS S3 모드 소개

RustFS는 S3 저장소 프로토콜 요구 사항을 100% 준수하며, S3 저장소 시 요청 경로는 두 가지 모드로 나뉩니다:

1. 가상 호스트 모드 (Virtual Host Style)

2. 경로 모드 (Path Style)

이 두 모드의 핵심 차이점은 저장소 버킷(Bucket)의 이름을 요청 URL에 배치하는 방식에 있습니다.


## 1. Path Style 모드

시작할 때 기본적으로 Path Style 모드를 사용합니다. Path Style 모드의 특징은 버킷 이름이 엔드포인트 접속점 뒤에 위치하는 것입니다. 호스트 이름이 rustfs.com이고 버킷 이름이 test라고 가정하면, Path Style로 연결된 경로는 다음과 같습니다:

~~~
http://rustfs.com/test
~~~

참고:
- 기본값은 Path Style입니다
- 사용자가 별도의 설정을 하지 않아도 Path Style 모드입니다


## 2. Virtual Host Style


시작할 때 모드를 Virtual Host Style로 변경할 수 있습니다. Virtual Host Style 모드의 특징은 버킷 이름이 도메인의 일부가 되는 것입니다. 호스트 이름이 rustfs.com이고 버킷 이름이 test라고 가정하면, Virtual Host Style로 연결된 경로는 다음과 같습니다:

~~~
http://test.rustfs.com/
~~~


Virtual Host Style 설정 단계는 다음과 같습니다:

1. 도메인을 지정된 서버로 와일드카드 해석합니다. 도메인이 rustfs.com이라고 가정하면, *.rustfs.com을 지정된 서버로 해석할 수 있습니다.
2. Linux의 경우 `/etc/default/rustfs` 파일을 수정하고, Docker 또는 Kubernetes의 경우 yaml 또는 시작 구성 매개변수를 수정합니다.
3. 구성 파일에 `RUSTFS_SERVER_DOMAINS`를 추가하고, 이 매개변수를 `RUSTFS_SERVER_DOMAINS = "rustfs.com"`으로 설정합니다.
4. 구성 파일을 저장한 후 `systemctl restart rustfs`를 사용하여 서비스를 재시작합니다.
