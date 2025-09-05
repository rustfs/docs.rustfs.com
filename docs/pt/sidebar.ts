export const sidebar = [
  {
    text: 'Guia de Instalação do RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Instalação Linux',
        link: '/pt/installation/linux/index',
        items: [
          {
            text: 'Instalação Rápida Linux',
            link: '/pt/installation/linux/quick-start'
          },
          {
            text: 'Instalação Nó Único Disco Único',
            link: '/pt/installation/linux/single-node-single-disk'
          },
          {
            text: 'Instalação Nó Único Múltiplos Discos',
            link: '/pt/installation/linux/single-node-multiple-disk'
          },
          {
            text: 'Instalação Múltiplos Nós Múltiplos Discos',
            link: '/pt/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Instalação Windows',
        link: '/pt/installation/windows/index'
      },
      {
        text: 'Instalação macOS',
        link: '/pt/installation/macos/index'
      },
      {
        text: 'Instalação Docker',
        link: '/pt/installation/docker/index'
      }
    ]
  },
  {
    text: 'Lista de Verificação de Instalação',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Requisitos de Hardware',
        link: '/pt/installation/checklists/hardware-checklists'
      },
      {
        text: 'Seleção de Hardware',
        link: '/pt/installation/checklists/hardware-selection'
      },
      {
        text: 'Verificação de Rede',
        link: '/pt/installation/checklists/network-checklists'
      },
      {
        text: 'Verificação de Software',
        link: '/pt/installation/checklists/software-checklists'
      },
      {
        text: 'Verificação de Segurança',
        link: '/pt/installation/checklists/security-checklists'
      }
    ]
  },
  {
    text: 'Performance e Framework do RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Comparação de Performance do RustFS',
        link: '/pt/concepts/comparison'
      },
      {
        text: 'Arquitetura de Design do RustFS',
        link: '/pt/concepts/architecture'
      },
      {
        text: 'Glossário',
        link: '/pt/concepts/glossary'
      },
      {
        text: 'Limitações de Uso',
        link: '/pt/concepts/limit'
      },
      {
        text: 'Conceitos Fundamentais',
        // collapsed: true,
        link: '/pt/concepts/principle',
        items: [
          {
            text: 'Erasure Coding',
            link: '/pt/concepts/principle/erasure-coding'
          }
        ]
      }
    ]
  },
  {
    text: 'Gerenciar RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Gerenciamento de Buckets',
        link: '/pt/management/bucket/index',
        items: [
          {
            text: 'Criação de Buckets',
            link: '/pt/management/bucket/creation'
          },
          {
            text: 'Exclusão de Buckets',
            link: '/pt/management/bucket/deletion'
          }
        ]
      },
      {
        text: 'Gerenciamento de Objetos',
        link: '/pt/management/object/index',
        // collapsed: true,
        items: [
          {
            text: 'Upload de Objetos',
            link: '/pt/management/object/creation'
          },
          {
            text: 'Exclusão de Objetos',
            link: '/pt/management/object/deletion'
          }
        ]
      },
      {
        text: 'Scanner de Objetos',
        link: '/pt/management/object/scanner'
      }
    ]
  },
  {
    text: 'Upgrade, Expansão e Desinstalação',
    link: '/pt/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Disponibilidade e Explicação de Expansão',
        link: '/pt/upgrade-scale/availability-and-resiliency'
      }
    ]
  },
  {
    text: 'Solução de Problemas',
    link: '/pt/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Falha de Disco',
        link: '/pt/troubleshooting/driver'
      },
      {
        text: 'Verificação e Recuperação Automática de Objetos',
        link: '/pt/troubleshooting/healing'
      },
      {
        text: 'Falha de Nó',
        link: '/pt/troubleshooting/node'
      }
    ]
  },
  {
    text: 'Administração do Sistema',
    link: '/pt/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Gerenciamento IAM',
        link: '/pt/administration/iam',
        items: [
          {
            text: 'Token de Acesso',
            link: '/pt/administration/iam/access-token'
          }
        ]
      }
    ]
  },
  {
    text: 'Integração',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Configuração de Proxy Reverso Nginx',
        link: '/pt/integration/nginx'
      },
      {
        text: 'Configuração de Modo de Host Virtual',
        link: '/pt/integration/virtual'
      },
      {
        text: 'Configuração TLS',
        link: '/pt/integration/tls-configured'
      }
    ]
  },
  {
    text: 'Desenvolvedor',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'MCP',
        link: '/pt/developer/mcp'
      },
      {
        text: 'MinIO Client',
        link: '/pt/developer/mc'
      },
      {
        text: 'SDK',
        link: '/pt/developer/sdk/index',
        // collapsed: true,
        items: [
          {
            text: 'Java',
            link: '/pt/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/pt/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/pt/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/pt/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/pt/developer/sdk/typescript'
          },
          {
            text: 'Golang',
            link: '/pt/developer/sdk/go'
          },
          {
            text: 'Outros SDK',
            link: '/pt/developer/sdk/other'
          }
        ],
      },
      {
        text: 'API de Compatibilidade S3',
        link: '/pt/developer/api'
      },
      {
        text: 'Licença Open Source',
        link: '/pt/developer/license'
      }
    ]
  },
  {
    text: 'Funcionalidades do Produto',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Distribuído',
        link: '/pt/features/distributed/'
      },
      {
        text: 'Gerenciamento de Logs',
        link: '/pt/features/logging/'
      },
      {
        text: 'Controle de Versão',
        link: '/pt/features/versioning/'
      },
      {
        text: 'Compatibilidade S3',
        link: '/pt/features/s3-compatibility/'
      },
      {
        text: 'Nível de Objeto e Somente Leitura',
        link: '/pt/features/worm/'
      },
      {
        text: 'Replicação Cross-Region',
        link: '/pt/features/replication/'
      },
      {
        text: 'Criptografia',
        link: '/pt/features/encryption/'
      },
      {
        text: 'Gerenciamento de Ciclo de Vida',
        link: '/pt/features/lifecycle/'
      },
    ],
  },
  {
    text: 'Soluções',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Data Lake Moderno',
        link: '/pt/features/data-lake/'
      },
      {
        text: 'IA e Machine Learning',
        link: '/pt/features/ai/'
      },
      {
        text: 'Cloud Native',
        link: '/pt/features/cloud-native/'
      },
      {
        text: 'Separação de Computação e Armazenamento de Big Data',
        link: '/pt/features/hdfs/'
      },
      {
        text: 'Suporte SQL',
        link: '/pt/features/sql-server/'
      },
      {
        text: 'Trading Quantitativo',
        link: '/pt/features/quantitative-trading/'
      },
      {
        text: 'Redução de Custos na Manufatura',
        link: '/pt/features/industry/'
      },
      {
        text: 'Armazenamento de Arquivo Frio',
        link: '/pt/features/cold-archiving/'
      },
      {
        text: 'Solução de Armazenamento de Vídeo',
        link: '/pt/features/video/'
      },
      {
        text: 'Solução Doméstica de Inovação e SM',
        link: '/pt/features/domestic/'
      },
    ],
  },
]
