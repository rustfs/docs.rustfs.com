
export const zhSidebar = [
  {
    text: '介绍',
    collapsed: true,
    items: [
      { text: 'RustFS 简介', link: '/zh/introduction' },
      { text: '架构组成', link: '/zh/architecture' },
      { text: '与其他存储的对比', link: '/zh/comparison' },
      { text: '开源许可证', link: '/zh/license' },
      {
        text: '核心概念', items: [
          { text: '词汇说明', link: '/zh/concepts/glossary' },
          { text: '纠删码原理', link: '/zh/concepts/erasure-coding' },
          { text: '可用性和扩展性', link: '/zh/concepts/availability-and-resiliency' },
          { text: '对象检查和自动恢复', link: '/zh/concepts/object-healing' },
          { text: '对象扫描', link: '/zh/concepts/object-scanner' },
          { text: '使用限制', link: '/zh/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: '架构支持',
    collapsed: true,
    items: [
      { text: '裸金属和虚拟化', link: '/zh/features/baremetal' },
      { text: '阿里云', link: '/zh/features/aliyun' },
      { text: '腾讯云', link: '/zh/features/qcloud' },
      { text: '华为云', link: '/zh/features/huaweicloud' },
      { text: 'VMWare Tanzu', link: '/zh/features/tanzu' },
      { text: '国际云厂商', link: '/zh/features/aws-elastic' },
    ],
  },
  {
    text: '产品功能',
    collapsed: true,
    items: [
      { text: '分布式', link: '/zh/features/distributed' },
      { text: '日志管理', link: '/zh/features/logging' },
      { text: '版本控制', link: '/zh/features/versioning' },
      { text: 'S3 兼容', link: '/zh/features/s3-compatibility' },
      { text: '对象级与只读', link: '/zh/features/worm' },
      { text: '跨区域复制', link: '/zh/features/replication' },
      { text: '加密', link: '/zh/features/encryption' },
      { text: '生命周期管理', link: '/zh/features/lifecycle' },
    ],
  },
  {
    text: '解决方案',
    collapsed: true,
    items: [
      { text: '现代数据湖', link: '/zh/features/data-lake' },
      { text: 'AI 和机器学习', link: '/zh/features/ai' },
      { text: '云原生', link: '/zh/features/cloud-native' },
      { text: '大数据计算存储分离', link: '/zh/features/hdfs' },
      { text: 'SQL 支持', link: '/zh/features/sql' },
      { text: '量化交易', link: '/zh/features/quantitative-trading' },
      { text: '制造业降本', link: '/zh/features/industry' },
      { text: '冷归档存储', link: '/zh/features/cold-archiving' },
      { text: '视频存储方案', link: '/zh/features/video' },
      { text: '国产信创和 SM 解决方案', link: '/zh/features/domestic' },
    ],
  },
  {
    text: '安装和部署',
    collapsed: true,
    items: [
      { text: '启动模式', link: '/zh/installation/mode/' },
      { text: '硬件选择', link: '/zh/installation/hardware-selection' },
      {
        text: '安装前检查', items: [
          { text: '检查清单', link: '/zh/installation/checklists' },
          { text: '硬件检查清单', link: '/zh/installation/hard-checklists' },
          { text: '软件检查清单', link: '/zh/installation/software-checklists' },
          { text: '网络检查清单', link: '/zh/installation/network-checklists' },
          { text: '安全检查清单', link: '/zh/installation/security-checklists' },
        ]
      },
      {
        text: '安装指南', items: [
          { text: 'Linux 安装', link: '/zh/installation/linux' },
          { text: 'macOS 安装', link: '/zh/installation/macos/' },
          { text: 'Windows 安装', link: '/zh/installation/windows/' },
          { text: 'Docker 安装', link: '/zh/installation/docker' },
        ]
      },
    ]
  },
  {
    text: '运维和监控',
    collapsed: true,
    items: [
      { text: '硬件准备', link: '/zh/admin/industry' },
      { text: '软件准备', link: '/zh/admin/industry' },
      { text: '安装前检查', link: '/zh/admin/industry' },
    ]
  },
  {
    text: 'SDK 和 API',
    collapsed: true,
    items: [
      { text: 'SDK 概述', link: '/zh/sdk/' },
      { text: 'Java SDK', link: '/zh/sdk/java' },
      { text: 'Python SDK', link: '/zh/sdk/python' },
      { text: 'JavaScript SDK', link: '/zh/sdk/js' },
      { text: '其他 SDK', link: '/zh/sdk/other' },
    ]
  }
]
