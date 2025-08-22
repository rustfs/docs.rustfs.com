export const zhSidebar = [
  {
    text: 'RustFS 安装指南',
    link: '/zh/installation/index',
    collapsed: true,
    home: true,
    items: [
      { text: 'Linux 安装',
        link: '/zh/installation/linux/index',
        collapsed: true,
        items: [
          {
            text: 'Linux 快速安装',
            link: '/zh/installation/linux/quick-start',
          },
          {
            text: '单机单盘安装',
            link: '/zh/installation/linux/single-node-single-disk',
          },
          {
            text: '单机多盘安装',
            link: '/zh/installation/linux/single-node-multiple-disk',
          },
          {
            text: '多机多盘安装',
            link: '/zh/installation/linux/multiple-node-multiple-disk',
          }
        ]
      },
      {
        text: 'Windows 安装',
        link: '/zh/installation/windows/index'
      },
      {
        text: 'macOS 安装',
        link: '/zh/installation/macos/index'
      },
      {
        text: 'Docker 安装',
        link: '/zh/installation/docker/index'
      }, 
      // {
      //   text: '云原生安装',
      //   link: '/zh/installation/cloud-native/index'
      // },   
      {
        text: '安装检查',
        link: '/zh/installation/checklists',
        collapsed: true,
        items: [
          {
            text: '硬件要求',
            link: '/zh/installation/checklists/hardware-checklists',
          },
          {
            text: '硬件选择',
            link: '/zh/installation/checklists/hardware-selection'
          },
          {
            text: '网络检查',
            link: '/zh/installation/checklists/network-checklists',
          },
          {
            text: '软件检查',
            link: '/zh/installation/checklists/software-checklists',
          },
          {
            text: '安全检查',
            link: '/zh/installation/checklists/security-checklists'
          }
        ]
      },  
    ]
  },
  {
    text: '管理 RustFS',
    link: '/zh/management/index',
    collapsed: true,
    home: true,
    items: [
      {
        text: '对象管理',
        link: '/zh/management/object',
        collapsed: true,
        items: [
          {
            text: '对象的上传和下载',
            link: '/zh/management/object/object-upload-and-delete',
          },
          // {
          //   text: '对象版本',
          //   link: '/zh/management/object/object-version',
          // },
          // {
          //   text: '对象锁',
          //   link: '/zh/management/object/object-lock',
          // },
          // {
          //   text: '对象分享',
          //   link: '/zh/management/object/object-share',
          // },
          // {
          //   text: '对象扫描',
          //   link: '/zh/management/object/object-scanner'
          // },
          {
            text: '对象检查与自动恢复',
            link: '/zh/management/object/object-healing'
          }
        ]
      },
      {
        text: '存储桶管理',
        link: '/zh/management/bucket',
        collapsed: true,
        items: [
          {
            text: '创建与删除',
            link: '/zh/management/bucket/bucket-create-and-delete'
          },
          // {
          //   text: '存储桶复制',
          //   link: '/zh/management/bucket/bucket-repulication'
          // }
        ]
      },
      // {
      //   text: '生命周期管理',
      //   link: '/zh/management/lifecycle',
      // },
      // {
      //     text: '事件通知管理',
      //     link: '/zh/management/event-notification',
      // },
      // {
      //   text: '日志管理',
      //   link: '/zh/management/logs',
      //   collapsed: true,
      //   items: [
      //     {
      //       text: '日志配置',
      //       link: '/zh/management/logs/configuration',
      //     },
      //     {
      //       text: 'Prometheus 配置',
      //       link: '/zh/management/logs/prometheus',
      //     },
      //     {
      //       text: '可观测性配置',
      //       link: '/zh/management/logs/observability'
      //     }
      //   ]
      // },
      {
        text: 'IAM 管理',
        link: '/zh/management/iam/index',
        collapsed: true,
        items: [
          // {
          //   text: '用户',
          //   link: '/zh/management/iam/user',
          // },
          // {
          //   text: '用户组',
          //   link: '/zh/management/iam/user-group',
          // },
          // {
          //   text: 'AK/SK',
          //   link: '/zh/management/iam/ak-sk',
          // },
          // {
          //   text: '策略',
          //   link: '/zh/management/iam/policy',
          // },
          // {
          //   text: '桶策略',
          //   link: '/zh/management/iam/bucket-policy',
          // },
          {
            text: '访问令牌',
            link: '/zh/management/iam/access-token'
          }
        ]
      },
      // {
      //   text: '加密',
      //   link: '/zh/management/encryption',
      //   collapsed: true,
      //   items: [
      //     {
      //       text: 'SSE-C',
      //       link: '/zh/management/encryption/sse-c',
      //     },
      //     {
      //       text: 'SSE-KMS',
      //       link: '/zh/encryption/sse-kms',
      //     },
      //     {
      //       text: 'SSE-S3',
      //       link: '/zh/management/encryption/sse-s3'
      //     }
      //   ]
      // },
      {
        text: '故障排查',
        link: '/zh/management/troubleshooting',
        collapsed: true,
        items: [
          {
            text: '节点故障',
            link: '/zh/management/troubleshooting/node'
          },
          {
            text: '驱动故障',
            link: '/zh/management/troubleshooting/driver'
          },
        ]
      }
    ]
  },
  {
    text: '关于 RustFS',
    collapsed: true,
    home: true,
    items: [
      {
        text: 'RustFS 介绍',
        link: '/zh/concepts/introduction'
      },
      {
        text: 'RustFS性能对比',
        link: '/zh/concepts/comparison'
      },
      {
        text: 'RustFS设计架构',
        link: '/zh/concepts/architecture',
      },
      {
        text: '术语说明',
        link: '/zh/concepts/glossary',
      },
      // {
      //   text: '核心概念',
      //   collapsed: true,
      //   link: '/zh/concepts/principle',
      //   items: [
      //     {
      //       text: '纠删码',
      //       link: '/zh/concepts/principle/erasure-coding'
      //     },
      //     {
      //       text: '条带',
      //       link: '/zh/concepts/principle/stripe'
      //     },
      //     {
      //       text: 'Data Scanner',
      //       link: '/zh/concepts/principle/data-scanner'
      //     },
      //     {
      //       text: 'bitrot',
      //       link: '/zh/concepts/principle/bitrot'
      //     },
      //     {
      //       text: '数据自愈',
      //       link: '/zh/concepts/principle/data-self-recovery',
      //     },
      //     {
      //       text: '使用限制',
      //       link: '/zh/concepts/principle/limit'
      //     }
      //   ]
      // },
    ]
  },
  // {
  //   text: '升级和扩容',
  //   link: '/zh/upgrade-scale/index',
  //   collapsed: true,
  //   home: true,
  //   items: [
  //     {
  //       text: '升级',
  //       link: '/zh/upgrade-scale/upgrade',
  //     },
  //     {
  //       text: '扩容',
  //       link: '/zh/upgrade-scale/scale',
  //     },
  //     {
  //       text: '退役',
  //       link: '/zh/upgrade-scale/retire'
  //     },
  //     {
  //       text: '再平衡',
  //       link: '/zh/upgrade-scale/re-balance'
  //     }
  //   ]
  // },
  {
    text: '集成',
    collapsed: true,
    home: true,
    items: [
      // {
      //   text: 'Nginx',
      //   link: '/zh/integration/nginx'
      // },
      // {
      //   text: 'GitLab',
      //   link: '/zh/integration/gitlab',
      // },
      // {
      //   text: 'HDFS',
      //   link: '/zh/integration/hdfs'
      // },
      // {
      //   text: 'restic',
      //   link: '/zh/integration/restic'
      // },
      {
        text: 'TLS 配置',
        link: '/zh/integration/tls-configured'
      }
    ]
  },
  {
    text: '开发者',
    link: '/zh/developer/index',
    collapsed: true,
    home: true, 
    items: [
      // {
      //   text: 'STS',
      //   link: '/zh/developer/sts'
      // },
      {
        text: 'MCP',
        link: '/zh/developer/mcp'
      },
      {
        text: 'MinIO Client',
        link: '/zh/developer/mc'
      },
      {
        text: 'SDK',
        link: '/zh/developer/sdk',
        collapsed: true,
        items: [
          {
            text: 'Java',
            link: '/zh/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/zh/developer/sdk/python'
          },
          // {
          //   text: 'Rust',
          //   link: '/zh/developer/sdk/rust'
          // },
          {
            text: 'JavaScript',
            link: '/zh/developer/sdk/javascript'
          },
          // {
          //   text: '.Net',
          //   link: '/zh/developer/sdk/dotnet'
          // },
          // {
          //   text: 'PHP',
          //   link: '/zh/developer/sdk/php'
          // },
          // {
          //   text: 'Go',
          //   link: '/zh/developer/sdk/go'
          // },
          {
            text: '其他 SDK',
            link: '/zh/developer/other'
          }
        ]
      },
      {
        text: 'S3 兼容性 API',
        link: '/zh/developer/api'
      },
      {
        text: '开源许可证',
        link: '/zh/developer/license'
      }
    ]
  },
  {
    text: '产品功能',
    collapsed: true,
    home: true,
    items: [
      { text: '分布式', link: '/zh/features/distributed/' },
      { text: '日志管理', link: '/zh/features/logging/' },
      { text: '版本控制', link: '/zh/features/versioning/' },
      { text: 'S3 兼容', link: '/zh/features/s3-compatibility/' },
      { text: '对象级与只读', link: '/zh/features/worm/' },
      { text: '跨区域复制', link: '/zh/features/replication/' },
      { text: '加密', link: '/zh/features/encryption/' },
      { text: '生命周期管理', link: '/zh/features/lifecycle/' },
    ],
  },
  {
    text: '解决方案',
    collapsed: true,
    home: true,
    items: [
      { text: '现代数据湖', link: '/zh/features/data-lake/' },
      { text: 'AI 和机器学习', link: '/zh/features/ai/' },
      { text: '云原生', link: '/zh/features/cloud-native/' },
      { text: '大数据计算存储分离', link: '/zh/features/hdfs/' },
      { text: 'SQL 支持', link: '/zh/features/sql-server/' },
      { text: '量化交易', link: '/zh/features/quantitative-trading/' },
      { text: '制造业降本', link: '/zh/features/industry/' },
      { text: '冷归档存储', link: '/zh/features/cold-archiving/' },
      { text: '视频存储方案', link: '/zh/features/video/' },
      { text: '国产信创和 SM 解决方案', link: '/zh/features/domestic/' },
    ],
  },
]
