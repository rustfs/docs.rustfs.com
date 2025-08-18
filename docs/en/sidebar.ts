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
      { text: 'Bare Metal and Virtualization', link: '/features/baremetal/' },
      { text: 'Alibaba Cloud', link: '/features/aliyun/' },
      { text: 'Tencent Cloud', link: '/features/qcloud/' },
      { text: 'Huawei Cloud', link: '/features/huaweicloud/' },
      { text: 'VMWare Tanzu', link: '/features/tanzu/' },
      { text: 'International Cloud Providers', link: '/features/aws-elastic/' },
    ],
  },
  {
    text: 'Product Features',
    collapsed: true,
    home: true,
    items: [
      { text: 'Distributed', link: '/features/distributed/' },
      { text: 'Logging', link: '/features/logging/' },
      { text: 'Versioning', link: '/features/versioning/' },
      { text: 'S3 Compatibility', link: '/features/s3-compatibility/' },
      { text: 'Object Lock & WORM', link: '/features/worm/' },
      { text: 'Cross-Region Replication', link: '/features/replication/' },
      { text: 'Encryption', link: '/features/encryption/' },
      { text: 'Lifecycle Management', link: '/features/lifecycle/' },
    ],
  },
  {
    text: 'Solutions',
    collapsed: true,
    home: true,
    items: [
      { text: 'Modern Data Lake', link: '/features/data-lake/' },
      { text: 'AI and Machine Learning', link: '/features/ai/' },
      { text: 'Cloud Native', link: '/features/cloud-native/' },
      { text: 'Big Data Compute-Storage Separation', link: '/features/hdfs/' },
      { text: 'SQL Support', link: '/features/sql-server/' },
      { text: 'Quantitative Trading', link: '/features/quantitative-trading/' },
      { text: 'Manufacturing Cost Reduction', link: '/features/industry/' },
      { text: 'Cold Archive Storage', link: '/features/cold-archiving/' },
      { text: 'Video Storage Solutions', link: '/features/video/' },
      { text: 'Domestic Innovation and SM Solutions', link: '/features/domestic/' },
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
      {
        text: 'Configuration Guides',
        link: '/guide/configured',
        items: [
          { text: 'TLS configuration', link: '/guide/configured/tls-configured' },
        ]
      },
    ]
  },
  {
    text: '​User Guide​',
    collapsed: true,
    home: true,
    items: [
      { text: 'Bucket Management', link: '/guide/bucket/bucket-create-and-delete' },
      { text: 'Object Management', link: '/guide/bucket/object-upload-and-delete' },
      { text: 'Access Keys', link: '/guide/access-token' },
      { text: 'MinIO Client (mc)', link: '/guide/mc' },
      { text: 'MCP Server', link: '/guide/mcp' },
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
