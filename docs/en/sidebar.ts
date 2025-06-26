export const enSidebar = [
  {
    text: 'Introduction',
    collapsed: true,
    home: true,
    items: [
      { text: 'What is RustFS', link: '/en/introduction' },
      { text: 'Architecture', link: '/en/architecture' },
      { text: 'Comparison with Other Storage', link: '/en/comparison' },
      { text: 'Open Source License', link: '/en/license' },
      {
        text: 'Core Concepts', link: '/en/concepts/glossary',
        items: [
          { text: 'Glossary', link: '/en/concepts/glossary' },
          { text: 'Erasure Coding', link: '/en/concepts/erasure-coding' },
          { text: 'Availability and Resiliency', link: '/en/concepts/availability-and-resiliency' },
          { text: 'Object Healing and Auto Recovery', link: '/en/concepts/object-healing' },
          { text: 'Object Scanner', link: '/en/concepts/object-scanner' },
          { text: 'Usage Limits', link: '/en/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: 'Architecture Support',
    collapsed: true,
    home: true,
    items: [
      { text: 'Bare Metal and Virtualization', link: '/en/features/baremetal' },
      { text: 'Alibaba Cloud', link: '/en/features/aliyun' },
      { text: 'Tencent Cloud', link: '/en/features/qcloud' },
      { text: 'Huawei Cloud', link: '/en/features/huaweicloud' },
      { text: 'VMWare Tanzu', link: '/en/features/tanzu' },
      { text: 'International Cloud Providers', link: '/en/features/aws-elastic' },
    ],
  },
  {
    text: 'Product Features',
    collapsed: true,
    home: true,
    items: [
      { text: 'Distributed', link: '/en/features/distributed' },
      { text: 'Logging', link: '/en/features/logging' },
      { text: 'Versioning', link: '/en/features/versioning' },
      { text: 'S3 Compatibility', link: '/en/features/s3-compatibility' },
      { text: 'Object Lock & WORM', link: '/en/features/worm' },
      { text: 'Cross-Region Replication', link: '/en/features/replication' },
      { text: 'Encryption', link: '/en/features/encryption' },
      { text: 'Lifecycle Management', link: '/en/features/lifecycle' },
    ],
  },
  {
    text: 'Solutions',
    collapsed: true,
    home: true,
    items: [
      { text: 'Modern Data Lake', link: '/en/features/data-lake' },
      { text: 'AI and Machine Learning', link: '/en/features/ai' },
      { text: 'Cloud Native', link: '/en/features/cloud-native' },
      { text: 'Big Data Compute-Storage Separation', link: '/en/features/hdfs' },
      { text: 'SQL Support', link: '/en/features/sql-server' },
      { text: 'Quantitative Trading', link: '/en/features/quantitative-trading' },
      { text: 'Manufacturing Cost Reduction', link: '/en/features/industry' },
      { text: 'Cold Archive Storage', link: '/en/features/cold-archiving' },
      { text: 'Video Storage Solutions', link: '/en/features/video' },
      { text: 'Domestic Innovation and SM Solutions', link: '/en/features/domestic' },
    ],
  },
  {
    text: 'Installation and Deployment',
    collapsed: true,
    home: true,
    items: [
      { text: 'Startup Modes', link: '/en/installation/mode/' },
      { text: 'Hardware Selection', link: '/en/installation/hardware-selection' },
      {
        text: 'Pre-installation Checks',
        link: '/en/installation/checklists',
        items: [
          { text: 'Checklists', link: '/en/installation/checklists' },
          { text: 'Hardware Checklists', link: '/en/installation/hard-checklists' },
          { text: 'Software Checklists', link: '/en/installation/software-checklists' },
          { text: 'Network Checklists', link: '/en/installation/network-checklists' },
          { text: 'Security Checklists', link: '/en/installation/security-checklists' },
        ]
      },
      {
        text: 'Installation Guides',
        link: '/en/installation/linux',
        items: [
          { text: 'Linux Installation', link: '/en/installation/linux' },
          { text: 'macOS Installation', link: '/en/installation/macos/' },
          { text: 'Windows Installation', link: '/en/installation/windows/' },
          { text: 'Docker Installation', link: '/en/installation/docker' },
        ]
      },
    ]
  },
  {
    text: 'Operations and Monitoring',
    collapsed: true,
    home: true,
    items: [
      { text: 'Hardware Preparation', link: '/en/admin/industry' },
      { text: 'Software Preparation', link: '/en/admin/industry' },
      { text: 'Pre-installation Checks', link: '/en/admin/industry' },
    ]
  },
  {
    text: 'SDK and API',
    collapsed: true,
    home: true,
    items: [
      { text: 'SDK Overview', link: '/en/sdk/' },
      { text: 'Java SDK', link: '/en/sdk/java' },
      { text: 'Python SDK', link: '/en/sdk/python' },
      { text: 'JavaScript SDK', link: '/en/sdk/js' },
      { text: 'Other SDKs', link: '/en/sdk/other' },
    ]
  }
]
