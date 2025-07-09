export const enSidebar = [
  {
    text: 'Introduction',
    collapsed: true,
    home: true,
    items: [
      { text: 'What is RustFS', link: '/introduction' },
      { text: 'Architecture', link: '/architecture' },
      { text: 'Comparison with Other Storage', link: '/comparison' },
      { text: 'Open Source License', link: '/license' },
      {
        text: 'Core Concepts', link: '/concepts/glossary',
        items: [
          { text: 'Glossary', link: '/concepts/glossary' },
          { text: 'Erasure Coding', link: '/concepts/erasure-coding' },
          { text: 'Availability and Resiliency', link: '/concepts/availability-and-resiliency' },
          { text: 'Object Healing and Auto Recovery', link: '/concepts/object-healing' },
          { text: 'Object Scanner', link: '/concepts/object-scanner' },
          { text: 'Usage Limits', link: '/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: 'Architecture Support',
    collapsed: true,
    home: true,
    items: [
      { text: 'Bare Metal and Virtualization', link: '/en/features/baremetal/' },
      { text: 'Alibaba Cloud', link: '/en/features/aliyun/' },
      { text: 'Tencent Cloud', link: '/en/features/qcloud/' },
      { text: 'Huawei Cloud', link: '/en/features/huaweicloud/' },
      { text: 'VMWare Tanzu', link: '/en/features/tanzu/' },
      { text: 'International Cloud Providers', link: '/en/features/aws-elastic/' },
    ],
  },
  {
    text: 'Product Features',
    collapsed: true,
    home: true,
    items: [
      { text: 'Distributed', link: '/en/features/distributed/' },
      { text: 'Logging', link: '/en/features/logging/' },
      { text: 'Versioning', link: '/en/features/versioning/' },
      { text: 'S3 Compatibility', link: '/en/features/s3-compatibility/' },
      { text: 'Object Lock & WORM', link: '/en/features/worm/' },
      { text: 'Cross-Region Replication', link: '/en/features/replication/' },
      { text: 'Encryption', link: '/en/features/encryption/' },
      { text: 'Lifecycle Management', link: '/en/features/lifecycle/' },
    ],
  },
  {
    text: 'Solutions',
    collapsed: true,
    home: true,
    items: [
      { text: 'Modern Data Lake', link: '/en/features/data-lake/' },
      { text: 'AI and Machine Learning', link: '/en/features/ai/' },
      { text: 'Cloud Native', link: '/en/features/cloud-native/' },
      { text: 'Big Data Compute-Storage Separation', link: '/en/features/hdfs/' },
      { text: 'SQL Support', link: '/en/features/sql-server/' },
      { text: 'Quantitative Trading', link: '/en/features/quantitative-trading/' },
      { text: 'Manufacturing Cost Reduction', link: '/en/features/industry/' },
      { text: 'Cold Archive Storage', link: '/en/features/cold-archiving/' },
      { text: 'Video Storage Solutions', link: '/en/features/video/' },
      { text: 'Domestic Innovation and SM Solutions', link: '/en/features/domestic/' },
    ],
  },
  {
    text: 'Installation and Deployment',
    collapsed: true,
    home: true,
    items: [
      { text: 'Startup Modes', link: '/installation/mode/' },
      { text: 'Hardware Selection', link: '/installation/hardware-selection' },
      {
        text: 'Pre-installation Checks',
        link: '/installation/checklists',
        items: [
          { text: 'Checklists', link: '/installation/checklists' },
          { text: 'Hardware Checklists', link: '/installation/hard-checklists' },
          { text: 'Software Checklists', link: '/installation/software-checklists' },
          { text: 'Network Checklists', link: '/installation/network-checklists' },
          { text: 'Security Checklists', link: '/installation/security-checklists' },
        ]
      },
      {
        text: 'Installation Guides',
        link: '/installation/linux',
        items: [
          { text: 'Linux Installation', link: '/installation/linux' },
          { text: 'macOS Installation', link: '/installation/macos/' },
          { text: 'Windows Installation', link: '/installation/windows/' },
          { text: 'Docker Installation', link: '/installation/docker' },
        ]
      },
    ]
  },
  {
    text: 'SDK and API',
    collapsed: true,
    home: true,
    items: [
      { text: 'SDK Overview', link: '/sdk/' },
      { text: 'Java SDK', link: '/sdk/java' },
      { text: 'Python SDK', link: '/sdk/python' },
      { text: 'JavaScript SDK', link: '/sdk/js' },
      { text: 'Other SDKs', link: '/sdk/other' },
    ]
  }
]
