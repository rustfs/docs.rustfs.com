export const zhSidebar = [
  {
    text: 'Introdução',
    collapsed: true,
    home: true,
    items: [
      { text: 'Introdução ao RustFS', link: '/pt/introduction' },
      { text: 'Arquitetura', link: '/pt/architecture' },
      { text: 'Comparação com outros armazenamentos', link: '/pt/comparison' },
      { text: 'Licença de código aberto', link: '/pt/license' },
      {
        text: 'Conceitos', items: [
          { text: 'Glossário', link: '/pt/concepts/glossary' },
          { text: 'Erasure Coding', link: '/pt/concepts/erasure-coding' },
          { text: 'Disponibilidade e escalabilidade', link: '/pt/concepts/availability-and-resiliency' },
          { text: 'Verificação e auto‑recuperação de objetos', link: '/pt/concepts/object-healing' },
          { text: 'Scanner de objetos', link: '/pt/concepts/object-scanner' },
          { text: 'Limites de uso', link: '/pt/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: 'Plataformas',
    collapsed: true,
    home: true,
    items: [
      { text: 'Bare metal e virtualização', link: '/pt/features/baremetal/' },
      { text: 'Alibaba Cloud', link: '/pt/features/aliyun/' },
      { text: 'Tencent Cloud', link: '/pt/features/qcloud/' },
      { text: 'Huawei Cloud', link: '/pt/features/huaweicloud/' },
      { text: 'VMWare Tanzu', link: '/pt/features/tanzu/' },
      { text: 'Nuvens internacionais', link: '/pt/features/aws-elastic/' },
    ],
  },
  {
    text: 'Funcionalidades',
    collapsed: true,
    home: true,
    items: [
      { text: 'Distribuído', link: '/pt/features/distributed/' },
      { text: 'Registo e auditoria', link: '/pt/features/logging/' },
      { text: 'Versionamento', link: '/pt/features/versioning/' },
      { text: 'Compatibilidade S3', link: '/pt/features/s3-compatibility/' },
      { text: 'WORM (Só leitura)', link: '/pt/features/worm/' },
      { text: 'Replicação', link: '/pt/features/replication/' },
      { text: 'Encriptação', link: '/pt/features/encryption/' },
      { text: 'Lifecycle', link: '/pt/features/lifecycle/' },
    ],
  },
  {
    text: 'Soluções',
    collapsed: true,
    home: true,
    items: [
      { text: 'Data Lake moderno', link: '/pt/features/data-lake/' },
      { text: 'IA e ML', link: '/pt/features/ai/' },
      { text: 'Cloud‑native', link: '/pt/features/cloud-native/' },
      { text: 'Separação compute/storage', link: '/pt/features/hdfs/' },
      { text: 'SQL', link: '/pt/features/sql-server/' },
      { text: 'Transação quantitativa', link: '/pt/features/quantitative-trading/' },
      { text: 'Indústria', link: '/pt/features/industry/' },
      { text: 'Arquivo a frio', link: '/pt/features/cold-archiving/' },
      { text: 'Vídeo', link: '/pt/features/video/' },
      { text: 'Soluções domésticas', link: '/pt/features/domestic/' },
    ],
  },
  {
    text: 'Instalação e Deployment',
    collapsed: true,
    home: true,
    items: [
      { text: 'Modos de arranque', link: '/pt/installation/mode/' },
      { text: 'Seleção de hardware', link: '/pt/installation/hardware-selection' },
      {
        text: 'Pré‑verificações',
        link: '/pt/installation/checklists',
        items: [
          { text: 'Checklist geral', link: '/pt/installation/checklists' },
          { text: 'Checklist de hardware', link: '/pt/installation/hard-checklists' },
          { text: 'Checklist de software', link: '/pt/installation/software-checklists' },
          { text: 'Checklist de rede', link: '/pt/installation/network-checklists' },
          { text: 'Checklist de segurança', link: '/pt/installation/security-checklists' },
        ]
      },
      {
        text: 'Guias de instalação',
        link: '/pt/installation/linux',
        items: [
          { text: 'Instalação no Linux', link: '/pt/installation/linux' },
          { text: 'Instalação no macOS', link: '/pt/installation/macos/' },
          { text: 'Instalação no Windows', link: '/pt/installation/windows/' },
          { text: 'Instalação com Docker', link: '/pt/installation/docker' },
        ]
      },
    ]
  },
  {
    text: 'Guias de utilização',
    collapsed: true,
    home: true,
    items: [
      { text: 'Gestão de buckets', link: '/pt/guide/bucket/bucket-create-and-delete' },
      { text: 'Gestão de objetos', link: '/pt/guide/bucket/object-upload-and-delete' },
      { text: 'Gestão de chaves de acesso', link: '/pt/guide/access-token' },
      { text: 'Uso do mc (MinIO Client)', link: '/pt/guide/mc' },
      { text: 'MCP', link: '/pt/guide/mcp' },
    ]
  },
  {
    text: 'SDK e API',
    collapsed: true,
    home: true,
    items: [
      { text: 'Visão geral do SDK', link: '/pt/sdk/' },
      { text: 'Java SDK', link: '/pt/sdk/java' },
      { text: 'Python SDK', link: '/pt/sdk/python' },
      { text: 'JavaScript SDK', link: '/pt/sdk/js' },
      { text: 'Outros SDK', link: '/pt/sdk/other' },
    ]
  }
]