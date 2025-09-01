---
title: "RustFS Windows 설치"
description: "Windows에서 원클릭으로 RustFS 시작하기."
---

# RustFS Windows 설치

## I. 준비 작업

참고사항:

> Windows 시작 **모드**는 단일 머신 단일 디스크 모드만 지원하며, 개발, 디버깅 및 테스트 환경에 더 적합합니다.


1. Windows 시작 모드의 자세한 소개에 대해서는 [시작 모드](../linux/index.md#mode)를 참조하십시오;

2. 설치 패키지를 다운로드하고, 권한을 수정한 후 시작하십시오.


## II. 다운로드

공식 다운로드 페이지를 방문하여 최신 버전의 RustFS 설치 패키지를 다운로드하십시오.


## III. 권한 수정

Windows 운영 체제에서 이 프로그램이 관련 실행 권한을 가지고 있는지 확인하십시오.


## 시작 아이콘을 더블 클릭

1. 시작 아이콘을 더블 클릭하십시오;

2. 디스크 구성을 클릭하십시오;

3. "Start Service"를 클릭하면 RustFS 서비스가 성공적으로 시작됩니다.


<img src="./images/windows-setup.jpg" alt="Windows 시작" />



## IV. 구성 수정

오른쪽 상단의 수정 버튼(톱니바퀴 모양 버튼)을 클릭하면 다음을 수정할 수 있습니다:

1. 서버 기본 포트;

2. 기본 관리자의 사용자명과 비밀번호;

3. 지정된 디스크 디렉토리;

<img src="./images/setting.jpg" alt="RustFS Windows 구성" />



## V. 콘솔 접근


시작이 성공한 후, `http://127.0.0.1:7001`을 방문하여 콘솔에 접근하십시오.

