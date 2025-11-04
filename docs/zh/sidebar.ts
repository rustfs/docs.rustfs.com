export const sidebar = [
  {
    text: 'RustFS 安装指南',
    link: '/zh/installation/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Linux安装',
        link: '/zh/installation/linux/index',
        items: [
          {
            text: 'Linux快速安装',
            link: '/zh/installation/linux/quick-start'
          },
          {
            text: '单机单盘安装',
            link: '/zh/installation/linux/single-node-single-disk'
          },
          {
            text: '单机多盘安装',
            link: '/zh/installation/linux/single-node-multiple-disk'
          },
          {
            text: '多机多盘安装',
            link: '/zh/installation/linux/multiple-node-multiple-disk'
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
      {
        text: '云原生安装',
        link: '/zh/installation/cloud-native/index'
      },
    ]
  },
  {
    text: '安装检查清单',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '硬件要求',
        link: '/zh/installation/checklists/hardware-checklists'
      },
      {
        text: '硬件选择',
        link: '/zh/installation/checklists/hardware-selection'
      },
      {
        text: '网络检查',
        link: '/zh/installation/checklists/network-checklists'
      },
      {
        text: '软件检查',
        link: '/zh/installation/checklists/software-checklists'
      },
      {
        text: '安全检查',
        link: '/zh/installation/checklists/security-checklists'
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
        link: '/zh/concepts/comparison'
      },
      {
        text: 'RustFS设计架构',
        link: '/zh/concepts/architecture'
      },
      {
        text: '术语说明',
        link: '/zh/concepts/glossary'
      },
      {
        text: '使用限制',
        link: '/zh/concepts/limit'
      },
      {
        text: '核心概念',
        // collapsed: true,
        link: '/zh/concepts/principle',
        items: [
          {
            text: '纠删码',
            link: '/zh/concepts/principle/erasure-coding'
          },
          // {
          //   text: '条带',
          //   link: '/zh/concepts/principle/stripe'
          // },
          // {
          //   text: 'Data Scanner',
          //   link: '/zh/concepts/principle/data-scanner'
          // },
          // {
          //   text: 'bitrot',
          //   link: '/zh/concepts/principle/bitrot'
          // },
          // {
          //   text: '数据自愈',
          //   link: '/zh/concepts/principle/data-self-recovery',
          // },
          // {
          //   text: '使用限制',
          //   link: '/zh/concepts/principle/limit'
          // },
          // {
          //   text: '单机单盘',
          //   link: '/zh/concepts/principle/snsd'
          // },
          // {
          //   text: '单机多盘',
          //   link: '/zh/concepts/principle/snmd'
          // },
          // {
          //   text: '多机多盘',
          //   link: '/zh/concepts/principle/mnmd'
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
        link: '/zh/management/bucket/index',
        items: [
          {
            text: '存储桶创建',
            link: '/zh/management/bucket/creation'
          },
          {
            text: '存储桶删除',
            link: '/zh/management/bucket/deletion'
          },
          // {
          //   text: '存储桶配额',
          //   link: '/zh/management/bucket/bucket-quota'
          // },
          // {
          //   text: '存储桶复制管理',
          //   link: '/zh/management/bucket/bucket-rep'
          // }
        ]
      },
      {
        text: '对象管理',
        link: '/zh/management/object/index',
        // collapsed: true,
        items: [
          {
            text: '对象上传',
            link: '/zh/management/object/creation'
          },
          // {
          //   text: '对象下载',
          //   link: '/zh/management/object/download'
          // },
          {
            text: '对象删除',
            link: '/zh/management/object/deletion'
          },
          // {
          //   text: '对象分享',
          //   link: '/zh/management/object/sharing',
          // },
          // {
          //   text: '加密',
          //   link: '/zh/management/encryption',
          //   // collapsed: true,
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
        ]
      },
      // {
      //   text: '对象版本',
      //   // collapsed: true,
      //   items: [
      //     {
      //       text: '开通对象版本',
      //       link: '/zh/management/object-version/bucket-create-and-delete'
      //     },
      //     {
      //       text: '对象创建',
      //       link: '/zh/management/object-version/bucket-repulication'
      //     },
      //     {
      //       text: '对象回滚',
      //       link: '/zh/management/object-version/object-rollback'
      //     },
      //     {
      //       text: '对象历史版本查看',
      //       link: '/zh/management/object-version/version-history'
      //     }
      //   ]
      // },
      // {
      //   text: '对象锁',
      //   // collapsed: true,
      //   items: [
      //     {
      //       text: '合规模式',
      //       link: '/zh/management/iam/user',
      //     },
      //     {
      //       text: '保留模式',
      //       link: '/zh/management/iam/user-group',
      //     },
      //     {
      //       text: '治理模式',
      //       link: '/zh/management/iam/ak-sk',
      //     }
      //   ]
      // },
      {
        text: '对象扫描',
        link: '/zh/management/object/scanner'
      },
      // {
      //   text: '生命周期管理',
      //   link: '/zh/management/lifecycle/index',
      //   // collapsed: true,
      //   items: [
      //     {
      //       text: '对象过期',
      //       link: '/zh/management/lifecycle/object-expire'
      //     },
      //     {
      //       text: '对象分层',
      //       link: '/zh/management/lifecycle/object-layers'
      //     },
      //     {
      //       text: '与磁设备对接',
      //       link: '/zh/management/lifecycle/magnetic-devices'
      //     },
      //     {
      //       text: '与光设备对接',
      //       link: '/zh/management/lifecycle/optical-devices'
      //     }
      //   ]
      // },
      // {
      //   text: '事件通知管理',
      //   link: '/zh/management/event-notifaction',
      //   items: [
      //     {
      //       text: '创建分层',
      //       link: '/zh/'
      //     },
      //     {
      //       text: '添加事件源',
      //       link: '/zh/'
      //     }
      //   ]
      // }
    ]
  },
  {
    text: '升级、扩容和卸载',
    link: '/zh/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '可用性和扩展说明',
        link: '/zh/upgrade-scale/availability-and-resiliency'
      },
      {
        text: '升级',
        link: '/zh/upgrade-scale/upgrade',
     },
      // {
      //   text: '扩容',
      //   link: '/zh/upgrade-scale/scale',
      // },
      // {
      //   text: '退役',
      //   link: '/zh/upgrade-scale/retire'
      // },
      // {
      //   text: '再平衡',
      //   link: '/zh/upgrade-scale/re-balance'
      // },
      // {
      //   text: '卸载',
      //   link: '/zh/upgrade-scale/uninstall'
      // }
    ]
  },
  {
    text: '故障排查',
    link: '/zh/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '磁盘故障',
        link: '/zh/troubleshooting/driver'
      },
      {
        text: '对象检查与自动恢复',
        link: '/zh/troubleshooting/healing'
      },
      {
        text: '节点故障',
        link: '/zh/troubleshooting/node'
      }
    ]
  },
  {
    text: '系统管理',
    link: '/zh/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'IAM管理',
        link: '/zh/administration/iam',
        items: [
          // {
          //   text: '用户',
          //   link: '/zh/administration/user'
          // },
          // {
          //   text: '用户组',
          //   link: '/zh/administration/user-group'
          // },
          // {
          //   text: 'AK/SK',
          //   link: '/zh/administration/ak-sk'
          // },
          // {
          //   text: 'Policy',
          //   link: '/zh/administration/policy'
          // },
          // {
          //   text: '桶策略',
          //   link: '/zh/administration/bucket-policy'
          // },
          {
            text: '访问令牌',
            link: '/zh/administration/iam/access-token'
          }
        ]
      },
      // {
      //   text: '日志管理',
      //   link: '/zh/administration/logs',
      //   items: [
      //     {
      //       text: '日志配置',
      //       link: '/zh/administration/logs/configuration'
      //     },
      //     {
      //       text: 'Prometheus 配置',
      //       link: '/zh/administration/logs/prometheus'
      //     },
      //     {
      //       text: '可观测配置',
      //       link: '/zh/administration/logs/observility'
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
        link: '/zh/integration/nginx'
      },
      {
        text: '虚拟主机模式配置',
        link: '/zh/integration/virtual'
      },
      {
        text: 'Milvus 对象存储配置',
        link: '/zh/integration/milvus',
      },
      {
        text: 'GitLab 对象存储配置',
        link: '/zh/integration/gitlab'
      },
      {
        text: 'traefik 反向代理配置',
        link: '/zh/integration/traefik'
      },
      {
        text: 'TLS 配置',
        link: '/zh/integration/tls-configured'
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
        link: '/zh/developer/sdk/index',
        // collapsed: true,
        items: [
          {
            text: 'Java',
            link: '/zh/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/zh/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/zh/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/zh/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/zh/developer/sdk/typescript'
          },
          {
            text: 'Golang',
            link: '/zh/developer/sdk/go'
          },
          {
            text: '其他 SDK',
            link: '/zh/developer/sdk/other'
          }
        ],
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
    // collapsed: true,
    home: true,
    items: [
      {
        text: '分布式',
        link: '/zh/features/distributed/'
      },
      {
        text: '日志管理',
        link: '/zh/features/logging/'
      },
      {
        text: '版本控制',
        link: '/zh/features/versioning/'
      },
      {
        text: 'S3 兼容',
        link: '/zh/features/s3-compatibility/'
      },
      {
        text: '对象级与只读',
        link: '/zh/features/worm/'
      },
      {
        text: '跨区域复制',
        link: '/zh/features/replication/'
      },
      {
        text: '加密',
        link: '/zh/features/encryption/'
      },
      {
        text: '生命周期管理',
        link: '/zh/features/lifecycle/'
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
        link: '/zh/features/data-lake/'
      },
      {
        text: 'AI 和机器学习',
        link: '/zh/features/ai/'
      },
      {
        text: '云原生',
        link: '/zh/features/cloud-native/'
      },
      {
        text: '大数据计算存储分离',
        link: '/zh/features/hdfs/'
      },
      {
        text: 'SQL 支持',
        link: '/zh/features/sql-server/'
      },
      {
        text: '量化交易',
        link: '/zh/features/quantitative-trading/'
      },
      {
        text: '制造业降本',
        link: '/zh/features/industry/'
      },
      {
        text: '冷归档存储',
        link: '/zh/features/cold-archiving/'
      },
      {
        text: '视频存储方案',
        link: '/zh/features/video/'
      },
      {
        text: '国产信创和 SM 解决方案',
        link: '/zh/features/domestic/'
      },
    ],
  },
]
