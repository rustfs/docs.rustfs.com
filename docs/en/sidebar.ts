export const sidebar = [
  {
    text: 'RustFS Installation Guide',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Linux Installation',
        link: '/installation/linux/index',
        items: [
          {
            text: 'Linux Quick Installation',
            link: '/installation/linux/quick-start'
          },
          {
            text: 'Single Node Single Disk Installation',
            link: '/installation/linux/single-node-single-disk'
          },
          {
            text: 'Single Node Multiple Disk Installation',
            link: '/installation/linux/single-node-multiple-disk'
          },
          {
            text: 'Multiple Node Multiple Disk Installation',
            link: '/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Windows Installation',
        link: '/installation/windows/index'
      },
      {
        text: 'macOS Installation',
        link: '/installation/macos/index'
      },
      {
        text: 'Docker Installation',
        link: '/installation/docker/index'
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
        link: '/installation/checklists/hardware-checklists'
      },
      {
        text: 'Hardware Selection',
        link: '/installation/checklists/hardware-selection'
      },
      {
        text: 'Network Check',
        link: '/installation/checklists/network-checklists'
      },
      {
        text: 'Software Check',
        link: '/installation/checklists/software-checklists'
      },
      {
        text: 'Security Check',
        link: '/installation/checklists/security-checklists'
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
        link: '/concepts/comparison'
      },
      {
        text: 'RustFS Design Architecture',
        link: '/concepts/architecture'
      },
      {
        text: 'Terminology Explanation',
        link: '/concepts/glossary'
      },
      {
        text: 'Usage Limitations',
        link: '/concepts/limit'
      },
      {
        text: 'Core Concepts',
        link: '/concepts/principle',
        items: [
          {
            text: 'Erasure Coding',
            link: '/concepts/principle/erasure-coding'
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
        link: '/management/bucket/index',
        items: [
          {
            text: 'Bucket Creation',
            link: '/management/bucket/creation'
          },
          {
            text: 'Bucket Deletion',
            link: '/management/bucket/deletion'
          }
        ]
      },
      {
        text: 'Object Management',
        link: '/management/object/index',
        items: [
          {
            text: 'Object Upload',
            link: '/management/object/creation'
          },
          {
            text: 'Object Deletion',
            link: '/management/object/deletion'
          }
        ]
      },
      {
        text: 'Object Scanner',
        link: '/management/object/scanner'
      }
    ]
  },
  {
    text: 'Upgrade, Expansion and Uninstallation',
    link: '/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Availability and Expansion Explanation',
        link: '/upgrade-scale/availability-and-resiliency'
      }
    ]
  },
  {
    text: 'Troubleshooting',
    link: '/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Disk Failure',
        link: '/troubleshooting/driver'
      },
      {
        text: 'Object Inspection and Automatic Recovery',
        link: '/troubleshooting/healing'
      },
      {
        text: 'Node Failure',
        link: '/troubleshooting/node'
      }
    ]
  },
  {
    text: 'System Administration',
    link: '/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'IAM Management',
        link: '/administration/iam',
        items: [
          {
            text: 'Access Token',
            link: '/administration/iam/access-token'
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
        link: '/integration/nginx'
      },
      {
        text: 'Virtual Host Mode Configuration',
        link: '/integration/virtual'
      },
      {
        text: 'TLS Configuration',
        link: '/integration/tls-configured'
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
        link: '/developer/mcp'
      },
      {
        text: 'MinIO Client',
        link: '/developer/mc'
      },
      {
        text: 'SDK',
        link: '/developer/sdk/index',
        items: [
          {
            text: 'Java',
            link: '/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/developer/sdk/typescript'
          },
          {
            text: 'Other SDKs',
            link: '/developer/sdk/other'
          }
        ]
      },
      {
        text: 'S3 Compatible API',
        link: '/developer/api'
      },
      {
        text: 'Open Source License',
        link: '/developer/license'
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
        link: '/features/distributed/'
      },
      {
        text: 'Log Management',
        link: '/features/logging/'
      },
      {
        text: 'Version Control',
        link: '/features/versioning/'
      },
      {
        text: 'S3 Compatibility',
        link: '/features/s3-compatibility/'
      },
      {
        text: 'Object Level and Read-Only',
        link: '/features/worm/'
      },
      {
        text: 'Cross-Region Replication',
        link: '/features/replication/'
      },
      {
        text: 'Encryption',
        link: '/features/encryption/'
      },
      {
        text: 'Lifecycle Management',
        link: '/features/lifecycle/'
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
        link: '/features/data-lake/'
      },
      {
        text: 'AI and Machine Learning',
        link: '/features/ai/'
      },
      {
        text: 'Cloud Native',
        link: '/features/cloud-native/'
      },
      {
        text: 'Big Data Computing Storage Separation',
        link: '/features/hdfs/'
      },
      {
        text: 'SQL Support',
        link: '/features/sql-server/'
      },
      {
        text: 'Quantitative Trading',
        link: '/features/quantitative-trading/'
      },
      {
        text: 'Manufacturing Cost Reduction',
        link: '/features/industry/'
      },
      {
        text: 'Cold Archive Storage',
        link: '/features/cold-archiving/'
      },
      {
        text: 'Video Storage Solution',
        link: '/features/video/'
      },
      {
        text: 'Domestic Innovation and SM Solution',
        link: '/features/domestic/'
      }
    ]
  }
]
