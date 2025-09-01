export const sidebar = [
  {
    text: 'Introduction',
    collapsed: true,
    home: true,
    items: [
      { text: 'What is RustFS?', link: '/en/concepts/introduction' },
      { text: 'Design Architecture', link: '/en/concepts/architecture' },
      { text: 'Product Comparison', link: '/en/concepts/comparison' },
      { text: 'Common Terminology', link: '/en/concepts/glossary' },
      { text: 'Usage Limitations', link: '/en/concepts/limit' },
      {
        text: 'Core Concepts',
        link: '/en/concepts/principle/index',
        items: [
          { text: 'Erasure Coding', link: '/en/concepts/principle/erasure-coding' },
        ],
      },
    ],
  },
  {
    text: 'Installation and Deployment',
    collapsed: true,
    home: true,
    items: [
      {
        text: 'Installation Guide',
        link: '/en/installation/index',
        items: [
          { text: 'Linux Installation', link: '/en/installation/linux/index' },
          { text: 'macOS Installation', link: '/en/installation/macos/index' },
          { text: 'Windows Installation', link: '/en/installation/windows/index' },
          { text: 'Docker Installation', link: '/en/installation/docker/index' },
        ]
      },
    ]
  },
  {
    text: 'Administrator Guide',
    collapsed: true,
    home: true,
    items: [
      {
        text: 'IAM Management',
        link: '/en/administration/iam/index',
        items: [
          { text: 'Access Token', link: '/en/administration/iam/access-token' },
        ]
      },
    ]
  },
  {
    text: 'Optimal Management',
    collapsed: true,
    home: true,
    items: [
      { text: 'Bucket Management', link: '/en/management/bucket/index' },
      { text: 'Object Management', link: '/en/management/object/index' },
      { text: 'IAM Management', link: '/en/administration/iam/index' },
    ]
  },
  {
    text: 'Developer Guide',
    collapsed: true,
    home: true,
    items: [
      { text: 'Developer Guide', link: '/en/developer/index' },
      { text: 'MCP Guide', link: '/en/developer/mcp' },
      { text: 'MinIO Client Guide', link: '/en/developer/mc' },
      {
        text: 'SDK Guide',
        link: '/en/developer/sdk/index',
        items: [
          { text: 'Java SDK', link: '/en/developer/sdk/java' },
          { text: 'JavaScript SDK', link: '/en/developer/sdk/javascript' },
          { text: 'Python SDK', link: '/en/developer/sdk/python' },
          { text: 'Rust SDK', link: '/en/developer/sdk/rust' },
          { text: 'TypeScript SDK', link: '/en/developer/sdk/typescript' },
        ]
      },
    ]
  }
]
