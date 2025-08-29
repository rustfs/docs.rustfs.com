export const koSidebar = [
  {
    text: '소개',
    collapsed: true,
    home: true,
    items: [
      { text: 'RustFS 개요', link: '/ko/introduction' },
      { text: '아키텍처 구성', link: '/ko/architecture' },
      { text: '다른 스토리지와의 비교', link: '/ko/comparison' },
      { text: '오픈소스 라이선스', link: '/ko/license' },
      {
        text: '핵심 개념', items: [
          { text: 'RustFS란 무엇인가?', link: '/ko/concepts/introduction' },
          { text: '용어집', link: '/ko/concepts/glossary' },
          { text: '이레이저 코딩 원리', link: '/ko/concepts/erasure-coding' },
          { text: '가용성과 확장성', link: '/ko/concepts/availability-and-resiliency' },
          { text: '객체 검사 및 자동 복구', link: '/ko/concepts/object-healing' },
          { text: '객체 스캔', link: '/ko/concepts/object-scanner' },
          { text: '사용 제한', link: '/ko/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: '아키텍처 지원',
    collapsed: true,
    home: true,
    items: [
      { text: '베어메탈 및 가상화', link: '/ko/features/baremetal/' },
      { text: 'Alibaba Cloud', link: '/ko/features/aliyun/' },
      { text: 'Tencent Cloud', link: '/ko/features/qcloud/' },
      { text: 'Huawei Cloud', link: '/ko/features/huaweicloud/' },
      { text: 'VMWare Tanzu', link: '/ko/features/tanzu/' },
      { text: '국제 클라우드 업체', link: '/ko/features/aws-elastic/' },
    ],
  },
  {
    text: '제품 기능',
    collapsed: true,
    home: true,
    items: [
      { text: '분산형', link: '/ko/features/distributed/' },
      { text: '로그 관리', link: '/ko/features/logging/' },
      { text: '버전 관리', link: '/ko/features/versioning/' },
      { text: 'S3 호환성', link: '/ko/features/s3-compatibility/' },
      { text: '객체 수준 및 읽기 전용', link: '/ko/features/worm/' },
      { text: '교차 지역 복제', link: '/ko/features/replication/' },
      { text: '암호화', link: '/ko/features/encryption/' },
      { text: '라이프사이클 관리', link: '/ko/features/lifecycle/' },
    ],
  },
  {
    text: '솔루션',
    collapsed: true,
    home: true,
    items: [
      { text: '현대적 데이터 레이크', link: '/ko/features/data-lake/' },
      { text: 'AI 및 머신러닝', link: '/ko/features/ai/' },
      { text: '클라우드 네이티브', link: '/ko/features/cloud-native/' },
      { text: '빅데이터 컴퓨팅 스토리지 분리', link: '/ko/features/hdfs/' },
      { text: 'SQL 지원', link: '/ko/features/sql-server/' },
      { text: '정량적 거래', link: '/ko/features/quantitative-trading/' },
      { text: '제조업 비용 절감', link: '/ko/features/industry/' },
      { text: '콜드 아카이브 스토리지', link: '/ko/features/cold-archiving/' },
      { text: '비디오 스토리지 솔루션', link: '/ko/features/video/' },
      { text: '국산 정보화 및 SM 솔루션', link: '/ko/features/domestic/' },
    ],
  },
  {
    text: '설치 및 배포',
    collapsed: true,
    home: true,
    items: [
      { text: '시작 모드', link: '/ko/installation/mode/' },
      { text: '하드웨어 선택', link: '/ko/installation/hardware-selection' },
      {
        text: '설치 전 검사',
        link: '/ko/installation/checklists',
        items: [
          { text: '체크리스트', link: '/ko/installation/checklists' },
          { text: '하드웨어 체크리스트', link: '/ko/installation/hard-checklists' },
          { text: '소프트웨어 체크리스트', link: '/ko/installation/software-checklists' },
          { text: '네트워크 체크리스트', link: '/ko/installation/network-checklists' },
          { text: '보안 체크리스트', link: '/ko/installation/security-checklists' },
        ]
      },
      {
        text: '설치 가이드',
        link: '/ko/installation/linux',
        items: [
          { text: 'Linux 설치', link: '/ko/installation/linux' },
          { text: 'macOS 설치', link: '/ko/installation/macos/' },
          { text: 'Windows 설치', link: '/ko/installation/windows/' },
          { text: 'Docker 설치', link: '/ko/installation/docker' },
        ]
      },
    ]
  },
  {
    text: '관리',
    collapsed: true,
    home: true,
    items: [
      { text: 'RustFS 최적 관리', link: '/ko/management/' },
      { text: 'IAM 관리', link: '/ko/administration/iam/' },
    ]
  },
  {
    text: '개발자',
    collapsed: true,
    home: true,
    items: [
      { text: '개발자 가이드', link: '/ko/developer/' },
    ]
  },
    {
    text: '기능 사용 가이드',
    collapsed: true,
    home: true,
    items: [
      { text: 'MCP', link: '/ko/guide/mcp' },
    ]
  },
  {
    text: 'SDK 및 API',
    collapsed: true,
    home: true,
    items: [
      { text: 'SDK 개요', link: '/ko/sdk/' },
      { text: 'Java SDK', link: '/ko/sdk/java' },
      { text: 'Python SDK', link: '/ko/sdk/python' },
      { text: 'JavaScript SDK', link: '/ko/sdk/js' },
      { text: '기타 SDK', link: '/ko/sdk/other' },
    ]
  }
]