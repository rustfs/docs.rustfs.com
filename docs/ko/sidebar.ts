export const koSidebar = [
  {
    text: 'RustFS 설치 가이드',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Linux 설치',
        link: '/ko/installation/linux/index',
        items: [
          {
            text: 'Linux 빠른 설치',
            link: '/ko/installation/linux/quick-start'
          },
          {
            text: '단일 머신 단일 디스크 설치',
            link: '/ko/installation/linux/single-node-single-disk'
          },
          {
            text: '단일 머신 다중 디스크 설치',
            link: '/ko/installation/linux/single-node-multiple-disk'
          },
          {
            text: '다중 머신 다중 디스크 설치',
            link: '/ko/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Windows 설치',
        link: '/ko/installation/windows/index'
      },
      {
        text: 'macOS 설치',
        link: '/ko/installation/macos/index'
      },
      {
        text: 'Docker 설치',
        link: '/ko/installation/docker/index'
      }
    ]
  },
  {
        text: '설치 검사 체크리스트',
        // collapsed: true,
        home: true,
        items: [
          {
            text: '하드웨어 요구사항',
            link: '/ko/installation/checklists/hardware-checklists'
          },
          {
            text: '하드웨어 선택',
            link: '/ko/installation/checklists/hardware-selection'
          },
          {
            text: '네트워크 검사',
            link: '/ko/installation/checklists/network-checklists'
          },
          {
            text: '소프트웨어 검사',
            link: '/ko/installation/checklists/software-checklists'
          },
          {
            text: '보안 검사',
            link: '/ko/installation/checklists/security-checklists'
          }
        ]
  },  
  {
    text: 'RustFS 성능과 프레임워크',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'RustFS 성능 비교',
        link: '/ko/concepts/comparison'
      },
      {
        text: 'RustFS 설계 아키텍처',
        link: '/ko/concepts/architecture'
      },
      {
        text: '용어 설명',
        link: '/ko/concepts/glossary'
      },
      {
        text: '사용 제한',
        link: '/ko/concepts/limit'
      },
      {
        text: '핵심 개념',
        // collapsed: true,
        link: '/ko/concepts/principle',
        items: [
          {
            text: '삭제 부호화',
            link: '/ko/concepts/principle/erasure-coding'
          }
        ]
      },
    ]
  },
  {
    text: 'RustFS 관리',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '버킷 관리',
        link: '/ko/management/bucket/index',
        items: [
          {
            text: '버킷 생성',
            link: '/ko/management/bucket/creation'
          },
          {
            text: '버킷 삭제',
            link: '/ko/management/bucket/deletion'
          }
        ]
      },
      {
        text: '객체 관리',
        link: '/ko/management/object/index',
        // collapsed: true,
        items: [
          {
            text: '객체 업로드',
            link: '/ko/management/object/creation'
          },
          {
            text: '객체 삭제',
            link: '/ko/management/object/deletion'
          }
        ]
      },
      {
        text: '객체 스캔',
        link: '/ko/management/object/scanner'
      }
    ]
  },
  {
    text: '업그레이드, 확장 및 제거',
    link: '/ko/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '가용성 및 확장 설명',
        link: '/ko/upgrade-scale/availability-and-resiliency'
      }
    ]
  },
  {
    text: '장애 해결',
    link: '/ko/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '디스크 장애',
        link: '/ko/troubleshooting/driver'
      },
      {
        text: '객체 검사 및 자동 복구',
        link: '/ko/troubleshooting/healing'      
      },
      {
        text: '노드 장애',
        link: '/ko/troubleshooting/node'      
      }
    ]
  },
  {
    text: '시스템 관리',
    link: '/ko/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'IAM 관리',
        link: '/ko/administration/iam',
        items: [
          {
            text: '액세스 토큰',
            link: '/ko/administration/iam/access-token'  
          }
        ]
      }
    ]
  },
  {
    text: '통합',
    // collapsed: true,
    home: true,
    items: [
         {
          text: 'Nginx 리버스 프록시 구성',
          link: '/ko/integration/nginx'
         },
         {
          text: '가상 호스트 모드 구성',
          link: '/ko/integration/virtual'
        },
      {
        text: 'TLS 구성',
        link: '/ko/integration/tls-configured'
      }
    ]
  },
  {
    text: '개발자',
    // collapsed: true,
    home: true, 
    items: [
      {
        text: 'MCP',
        link: '/ko/developer/mcp'
      },
      {
        text: 'MinIO Client',
        link: '/ko/developer/mc'
      },
      {
        text: 'SDK',
        link: '/ko/developer/sdk/index',
        // collapsed: true,
        items: [
          {
            text: 'Java',
            link: '/ko/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/ko/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/ko/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/ko/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/ko/developer/sdk/typescript'
          },
          {
            text: '기타 SDK',
            link: '/ko/developer/sdk/other'
          }
        ],
      },
      {
        text: 'S3 호환성 API',
        link: '/ko/developer/api'
      },
      {
        text: '오픈소스 라이선스',
        link: '/ko/developer/license'
      }
    ]
  },
  {
    text: '제품 기능',
    // collapsed: true,
    home: true,
    items: [
      { 
        text: '분산', 
        link: '/ko/features/distributed/' 
      },
      { 
        text: '로그 관리', 
        link: '/ko/features/logging/' 
      },
      { 
        text: '버전 제어', 
        link: '/ko/features/versioning/' 
      },
      { 
        text: 'S3 호환', 
        link: '/ko/features/s3-compatibility/' 
      },
      { 
        text: '객체 수준 및 읽기 전용', 
        link: '/ko/features/worm/' 
      },
      { 
        text: '교차 지역 복제', 
        link: '/ko/features/replication/' 
      },
      { 
        text: '암호화', 
        link: '/ko/features/encryption/' 
      },
      { 
        text: '라이프사이클 관리', 
        link: '/ko/features/lifecycle/' 
      },
    ],
  },
  {
    text: '솔루션',
    // collapsed: true,
    home: true,
    items: [
      { 
        text: '현대적 데이터 레이크', 
        link: '/ko/features/data-lake/' 
      },
      { 
        text: 'AI 및 머신러닝', 
        link: '/ko/features/ai/' 
      },
      { 
        text: '클라우드 네이티브', 
        link: '/ko/features/cloud-native/' 
      },
      { 
        text: '빅데이터 컴퓨팅 스토리지 분리', 
        link: '/ko/features/hdfs/' 
      },
      { 
        text: 'SQL 지원', 
        link: '/ko/features/sql-server/' 
      },
      { 
        text: '정량적 거래', 
        link: '/ko/features/quantitative-trading/' 
      },
      { 
        text: '제조업 비용 절감', 
        link: '/ko/features/industry/' 
      },
      { 
        text: '콜드 아카이브 스토리지', 
        link: '/ko/features/cold-archiving/' 
      },
      { 
        text: '비디오 스토리지 솔루션', 
        link: '/ko/features/video/' 
      },
      { 
        text: '국산 정보화 및 SM 솔루션', 
        link: '/ko/features/domestic/' 
      },
    ],
  },
]