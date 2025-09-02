export const sidebar = [
  {
    text: 'RustFS Installation Guide',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Linux Installation',
        link: '/en/installation/linux/index',
        items: [
          {
            text: 'Linux Quick Installation',
            link: '/en/installation/linux/quick-start'
          },
          {
            text: 'Single Node Single Disk Installation',
            link: '/en/installation/linux/single-node-single-disk'
          },
          {
            text: 'Single Node Multiple Disk Installation',
            link: '/en/installation/linux/single-node-multiple-disk'
          },
          {
            text: 'Multiple Node Multiple Disk Installation',
            link: '/en/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Windows Installation',
        link: '/en/installation/windows/index'
      },
      {
        text: 'macOS Installation',
        link: '/en/installation/macos/index'
      },
      {
        text: 'Docker Installation',
        link: '/en/installation/docker/index'
      }
    ]
  },
  {
    text: 'Installation Checklist',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Hardware Requirements',
        link: '/en/installation/checklists/hardware-checklists'
      },
      {
        text: 'Hardware Selection',
        link: '/en/installation/checklists/hardware-selection'
      },
      {
        text: 'Network Check',
        link: '/en/installation/checklists/network-checklists'
      },
      {
        text: 'Software Check',
        link: '/en/installation/checklists/software-checklists'
      },
      {
        text: 'Security Check',
        link: '/en/installation/checklists/security-checklists'
      }
    ]
  },
  {
    text: 'RustFS Performance and Framework',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'RustFS Performance Comparison',
        link: '/en/concepts/comparison'
      },
      {
        text: 'RustFS Design Architecture',
        link: '/en/concepts/architecture'
      },
      {
        text: 'Terminology Explanation',
        link: '/en/concepts/glossary'
      },
      {
        text: 'Usage Limitations',
        link: '/en/concepts/limit'
      },
      {
        text: 'Core Concepts',
        link: '/en/concepts/principle',
        items: [
          {
            text: 'Erasure Coding',
            link: '/en/concepts/principle/erasure-coding'
          }
        ]
      }
    ]
  },
  {
    text: 'Manage RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Bucket Management',
        link: '/en/management/bucket/index',
        items: [
          {
            text: 'Bucket Creation',
            link: '/en/management/bucket/creation'
          },
          {
            text: 'Bucket Deletion',
            link: '/en/management/bucket/deletion'
          }
        ]
      },
      {
        text: 'Object Management',
        link: '/en/management/object/index',
        items: [
          {
            text: 'Object Upload',
            link: '/en/management/object/creation'
          },
          {
            text: 'Object Deletion',
            link: '/en/management/object/deletion'
          }
        ]
      },
      {
        text: 'Object Scanner',
        link: '/en/management/object/scanner'
      }
    ]
  },
  {
    text: 'Upgrade, Expansion and Uninstallation',
    link: '/en/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Availability and Expansion Explanation',
        link: '/en/upgrade-scale/availability-and-resiliency'
      }
    ]
  },
  {
    text: 'Troubleshooting',
    link: '/en/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Disk Failure',
        link: '/en/troubleshooting/driver'
      },
      {
        text: 'Object Inspection and Automatic Recovery',
        link: '/en/troubleshooting/healing'
      },
      {
        text: 'Node Failure',
        link: '/en/troubleshooting/node'
      }
    ]
  },
  {
    text: 'System Administration',
    link: '/en/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'IAM Management',
        link: '/en/administration/iam',
        items: [
          {
            text: 'Access Token',
            link: '/en/administration/iam/access-token'
          }
        ]
      }
    ]
  },
  {
    text: 'Integration',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Nginx Reverse Proxy Configuration',
        link: '/en/integration/nginx'
      },
      {
        text: 'Virtual Host Mode Configuration',
        link: '/en/integration/virtual'
      },
      {
        text: 'TLS Configuration',
        link: '/en/integration/tls-configured'
      }
    ]
  },
  {
    text: 'Developer',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'MCP',
        link: '/en/developer/mcp'
      },
      {
        text: 'MinIO Client',
        link: '/en/developer/mc'
      },
      {
        text: 'SDK',
        link: '/en/developer/sdk/index',
        items: [
          {
            text: 'Java',
            link: '/en/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/en/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/en/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/en/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/en/developer/sdk/typescript'
          },
          {
            text: 'Other SDKs',
            link: '/en/developer/sdk/other'
          }
        ]
      },
      {
        text: 'S3 Compatible API',
        link: '/en/developer/api'
      },
      {
        text: 'Open Source License',
        link: '/en/developer/license'
      }
    ]
  },
  {
    text: 'Product Features',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Distributed',
        link: '/en/features/distributed/'
      },
      {
        text: 'Log Management',
        link: '/en/features/logging/'
      },
      {
        text: 'Version Control',
        link: '/en/features/versioning/'
      },
      {
        text: 'S3 Compatibility',
        link: '/en/features/s3-compatibility/'
      },
      {
        text: 'Object Level and Read-Only',
        link: '/en/features/worm/'
      },
      {
        text: 'Cross-Region Replication',
        link: '/en/features/replication/'
      },
      {
        text: 'Encryption',
        link: '/en/features/encryption/'
      },
      {
        text: 'Lifecycle Management',
        link: '/en/features/lifecycle/'
      }
    ]
  },
  {
    text: 'Solutions',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Modern Data Lake',
        link: '/en/features/data-lake/'
      },
      {
        text: 'AI and Machine Learning',
        link: '/en/features/ai/'
      },
      {
        text: 'Cloud Native',
        link: '/en/features/cloud-native/'
      },
      {
        text: 'Big Data Computing Storage Separation',
        link: '/en/features/hdfs/'
      },
      {
        text: 'SQL Support',
        link: '/en/features/sql-server/'
      },
      {
        text: 'Quantitative Trading',
        link: '/en/features/quantitative-trading/'
      },
      {
        text: 'Manufacturing Cost Reduction',
        link: '/en/features/industry/'
      },
      {
        text: 'Cold Archive Storage',
        link: '/en/features/cold-archiving/'
      },
      {
        text: 'Video Storage Solution',
        link: '/en/features/video/'
      },
      {
        text: 'Domestic Innovation and SM Solution',
        link: '/en/features/domestic/'
      }
    ]
  }
]
