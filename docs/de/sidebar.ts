export const sidebar = [
  {
    text: 'RustFS 安装指南',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Linux安装',
        link: '/de/installation/linux/index',
        items: [
          {
            text: 'Linux快速安装',
            link: '/de/installation/linux/quick-start'
          },
          {
            text: '单机单盘安装',
            link: '/de/installation/linux/single-node-single-disk'
          },
          {
            text: '单机多盘安装',
            link: '/de/installation/linux/single-node-multiple-disk'
          },
          {
            text: '多机多盘安装',
            link: '/de/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Windows 安装',
        link: '/de/installation/windows/index'
      },
      {
        text: 'macOS 安装',
        link: '/de/installation/macos/index'
      },
      {
        text: 'Docker 安装',
        link: '/de/installation/docker/index'
      },
      // {
      //   text: '云原生安装',
      //   link: '/de/installation/cloud-native/index'
      // },

    ]
  },
  {
    text: '安装检查清单',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '硬件要求',
        link: '/de/installation/checklists/hardware-checklists'
      },
      {
        text: '硬件选择',
        link: '/de/installation/checklists/hardware-selection'
      },
      {
        text: '网络检查',
        link: '/de/installation/checklists/network-checklists'
      },
      {
        text: '软件检查',
        link: '/de/installation/checklists/software-checklists'
      },
      {
        text: '安全检查',
        link: '/de/installation/checklists/security-checklists'
      }
    ]
  },
  {
    text: 'RustFS 性能和框架',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'RustFS性能对比',
        link: '/de/concepts/comparison'
      },
      {
        text: 'RustFS设计架构',
        link: '/de/concepts/architecture'
      },
      {
        text: '术语说明',
        link: '/de/concepts/glossary'
      },
      {
        text: '使用限制',
        link: '/de/concepts/limit'
      },
      {
        text: '核心概念',
        // collapsed: true,
        link: '/de/concepts/principle',
        items: [
          {
            text: '纠删码',
            link: '/de/concepts/principle/erasure-coding'
          },
          // {
          //   text: '条带',
          //   link: '/de/concepts/principle/stripe'
          // },
          // {
          //   text: 'Data Scanner',
          //   link: '/de/concepts/principle/data-scanner'
          // },
          // {
          //   text: 'bitrot',
          //   link: '/de/concepts/principle/bitrot'
          // },
          // {
          //   text: '数据自愈',
          //   link: '/de/concepts/principle/data-self-recovery',
          // },
          // {
          //   text: '使用限制',
          //   link: '/de/concepts/principle/limit'
          // },
          // {
          //   text: '单机单盘',
          //   link: '/de/concepts/principle/snsd'
          // },
          // {
          //   text: '单机多盘',
          //   link: '/de/concepts/principle/snmd'
          // },
          // {
          //   text: '多机多盘',
          //   link: '/de/concepts/principle/mnmd'
          // }
        ]
      },
    ]
  },
  {
    text: '管理 RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '存储桶管理',
        link: '/de/management/bucket/index',
        items: [
          {
            text: '存储桶创建',
            link: '/de/management/bucket/creation'
          },
          {
            text: '存储桶删除',
            link: '/de/management/bucket/deletion'
          },
          // {
          //   text: '存储桶配额',
          //   link: '/de/management/bucket/bucket-quota'
          // },
          // {
          //   text: '存储桶复制管理',
          //   link: '/de/management/bucket/bucket-rep'
          // }
        ]
      },
      {
        text: '对象管理',
        link: '/de/management/object/index',
        // collapsed: true,
        items: [
          {
            text: '对象上传',
            link: '/de/management/object/creation'
          },
          // {
          //   text: '对象下载',
          //   link: '/de/management/object/download'
          // },
          {
            text: '对象删除',
            link: '/de/management/object/deletion'
          },
          // {
          //   text: '对象分享',
          //   link: '/de/management/object/sharing',
          // },
          // {
          //   text: '加密',
          //   link: '/de/management/encryption',
          //   // collapsed: true,
          //   items: [
          //     {
          //       text: 'SSE-C',
          //       link: '/de/management/encryption/sse-c',
          //     },
          //     {
          //       text: 'SSE-KMS',
          //       link: '/de/encryption/sse-kms',
          //     },
          //     {
          //       text: 'SSE-S3',
          //       link: '/de/management/encryption/sse-s3'
          //     }
          //   ]
          // },
        ]
      },
      // {
      //   text: '对象版本',
      //   // collapsed: true,
      //   items: [
      //     {
      //       text: '开通对象版本',
      //       link: '/de/management/object-version/bucket-create-and-delete'
      //     },
      //     {
      //       text: '对象创建',
      //       link: '/de/management/object-version/bucket-repulication'
      //     },
      //     {
      //       text: '对象回滚',
      //       link: '/de/management/object-version/object-rollback'
      //     },
      //     {
      //       text: '对象历史版本查看',
      //       link: '/de/management/object-version/version-history'
      //     }
      //   ]
      // },
      // {
      //   text: '对象锁',
      //   // collapsed: true,
      //   items: [
      //     {
      //       text: '合规模式',
      //       link: '/de/management/iam/user',
      //     },
      //     {
      //       text: '保留模式',
      //       link: '/de/management/iam/user-group',
      //     },
      //     {
      //       text: '治理模式',
      //       link: '/de/management/iam/ak-sk',
      //     }
      //   ]
      // },
      {
        text: '对象扫描',
        link: '/de/management/object/scanner'
      },
      // {
      //   text: '生命周期管理',
      //   link: '/de/management/lifecycle/index',
      //   // collapsed: true,
      //   items: [
      //     {
      //       text: '对象过期',
      //       link: '/de/management/lifecycle/object-expire'
      //     },
      //     {
      //       text: '对象分层',
      //       link: '/de/management/lifecycle/object-layers'
      //     },
      //     {
      //       text: '与磁设备对接',
      //       link: '/de/management/lifecycle/magnetic-devices'
      //     },
      //     {
      //       text: '与光设备对接',
      //       link: '/de/management/lifecycle/optical-devices'
      //     }
      //   ]
      // },
      // {
      //   text: '事件通知管理',
      //   link: '/de/management/event-notifaction',
      //   items: [
      //     {
      //       text: '创建分层',
      //       link: '/de/'
      //     },
      //     {
      //       text: '添加事件源',
      //       link: '/de/'
      //     }
      //   ]
      // }
    ]
  },
  {
    text: '升级、扩容和卸载',
    link: '/de/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '可用性和扩展说明',
        link: '/de/upgrade-scale/availability-and-resiliency'
      },
      {
        text: '升级',
        link: '/de/upgrade-scale/upgrade',
      },
      // {
      //   text: '扩容',
      //   link: '/de/upgrade-scale/scale',
      // },
      // {
      //   text: '退役',
      //   link: '/de/upgrade-scale/retire'
      // },
      // {
      //   text: '再平衡',
      //   link: '/de/upgrade-scale/re-balance'
      // },
      // {
      //   text: '卸载',
      //   link: '/de/upgrade-scale/uninstall'
      // }
    ]
  },
  {
    text: '故障排查',
    link: '/de/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '磁盘故障',
        link: '/de/troubleshooting/driver'
      },
      {
        text: '对象检查与自动恢复',
        link: '/de/troubleshooting/healing'
      },
      {
        text: '节点故障',
        link: '/de/troubleshooting/node'
      }
    ]
  },
  {
    text: '系统管理',
    link: '/de/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'IAM管理',
        link: '/de/administration/iam',
        items: [
          // {
          //   text: '用户',
          //   link: '/de/administration/user'
          // },
          // {
          //   text: '用户组',
          //   link: '/de/administration/user-group'
          // },
          // {
          //   text: 'AK/SK',
          //   link: '/de/administration/ak-sk'
          // },
          // {
          //   text: 'Policy',
          //   link: '/de/administration/policy'
          // },
          // {
          //   text: '桶策略',
          //   link: '/de/administration/bucket-policy'
          // },
          {
            text: '访问令牌',
            link: '/de/administration/iam/access-token'
          }
        ]
      },
      // {
      //   text: '日志管理',
      //   link: '/de/administration/logs',
      //   items: [
      //     {
      //       text: '日志配置',
      //       link: '/de/administration/logs/configuration'
      //     },
      //     {
      //       text: 'Prometheus 配置',
      //       link: '/de/administration/logs/prometheus'
      //     },
      //     {
      //       text: '可观测配置',
      //       link: '/de/administration/logs/observility'
      //     }
      //   ]
      // }
    ]
  },
  {
    text: '集成',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Nginx反向代理配置',
        link: '/de/integration/nginx'
      },
      {
        text: '虚拟主机模式配置',
        link: '/de/integration/virtual'
      },
      // {
      //   text: 'GitLab',
      //   link: '/de/integration/gitlab',
      // },
      // {
      //   text: 'HDFS',
      //   link: '/de/integration/hdfs'
      // },
      // {
      //   text: 'restic',
      //   link: '/de/integration/restic'
      // },
      {
        text: 'TLS 配置',
        link: '/de/integration/tls-configured'
      }
    ]
  },
  {
    text: '开发者',
    // collapsed: true,
    home: true,
    items: [
      // {
      //   text: 'STS',
      //   link: '/de/developer/sts'
      // },
      {
        text: 'MCP',
        link: '/de/developer/mcp'
      },
      {
        text: 'MinIO Client',
        link: '/de/developer/mc'
      },
      {
        text: 'SDK',
        link: '/de/developer/sdk/index',
        // collapsed: true,
        items: [
          {
            text: 'Java',
            link: '/de/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/de/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/de/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/de/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/de/developer/sdk/typescript'
          },
          {
            text: 'Golang',
            link: '/de/developer/sdk/go'
          },
          {
            text: '其他 SDK',
            link: '/de/developer/sdk/other'
          }
        ],
      },
      {
        text: 'S3 兼容性 API',
        link: '/de/developer/api'
      },
      {
        text: '开源许可证',
        link: '/de/developer/license'
      }
    ]
  },
  {
    text: '产品功能',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '分布式',
        link: '/de/features/distributed/'
      },
      {
        text: '日志管理',
        link: '/de/features/logging/'
      },
      {
        text: '版本控制',
        link: '/de/features/versioning/'
      },
      {
        text: 'S3 兼容',
        link: '/de/features/s3-compatibility/'
      },
      {
        text: '对象级与只读',
        link: '/de/features/worm/'
      },
      {
        text: '跨区域复制',
        link: '/de/features/replication/'
      },
      {
        text: '加密',
        link: '/de/features/encryption/'
      },
      {
        text: '生命周期管理',
        link: '/de/features/lifecycle/'
      },
    ],
  },
  {
    text: '解决方案',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '现代数据湖',
        link: '/de/features/data-lake/'
      },
      {
        text: 'AI 和机器学习',
        link: '/de/features/ai/'
      },
      {
        text: '云原生',
        link: '/de/features/cloud-native/'
      },
      {
        text: '大数据计算存储分离',
        link: '/de/features/hdfs/'
      },
      {
        text: 'SQL 支持',
        link: '/de/features/sql-server/'
      },
      {
        text: '量化交易',
        link: '/de/features/quantitative-trading/'
      },
      {
        text: '制造业降本',
        link: '/de/features/industry/'
      },
      {
        text: '冷归档存储',
        link: '/de/features/cold-archiving/'
      },
      {
        text: '视频存储方案',
        link: '/de/features/video/'
      },
      {
        text: '国产信创和 SM 解决方案',
        link: '/de/features/domestic/'
      },
    ],
  },
]
