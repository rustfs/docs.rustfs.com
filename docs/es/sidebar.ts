export const sidebar = [
  {
    text: 'Guía de instalación de RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Instalación de Linux',
        link: '/es/installation/linux/index',
        items: [
          {
            text: 'Instalación rápida de Linux',
            link: '/es/installation/linux/quick-start'
          },
          {
            text: 'Instalación de nodo único disco único',
            link: '/es/installation/linux/single-node-single-disk'
          },
          {
            text: 'Instalación de nodo único múltiples discos',
            link: '/es/installation/linux/single-node-multiple-disk'
          },
          {
            text: 'Instalación de múltiples nodos múltiples discos',
            link: '/es/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Instalación de Windows',
        link: '/es/installation/windows/index'
      },
      {
        text: 'Instalación de macOS',
        link: '/es/installation/macos/index'
      },
      {
        text: 'Instalación de Docker',
        link: '/es/installation/docker/index'
      }
    ]
  },
  {
    text: 'Lista de verificación de instalación',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Requisitos de hardware',
        link: '/es/installation/checklists/hardware-checklists'
      },
      {
        text: 'Selección de hardware',
        link: '/es/installation/checklists/hardware-selection'
      },
      {
        text: 'Verificación de red',
        link: '/es/installation/checklists/network-checklists'
      },
      {
        text: 'Verificación de software',
        link: '/es/installation/checklists/software-checklists'
      },
      {
        text: 'Verificación de seguridad',
        link: '/es/installation/checklists/security-checklists'
      }
    ]
  },
  {
    text: 'Rendimiento y framework de RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Comparación de rendimiento de RustFS',
        link: '/es/concepts/comparison'
      },
      {
        text: 'Arquitectura de diseño de RustFS',
        link: '/es/concepts/architecture'
      },
      {
        text: 'Explicación terminológica',
        link: '/es/concepts/glossary'
      },
      {
        text: 'Limitaciones de uso',
        link: '/es/concepts/limit'
      },
      {
        text: 'Conceptos fundamentales',
        link: '/es/concepts/principle',
        items: [
          {
            text: 'Código de borrado',
            link: '/es/concepts/principle/erasure-coding'
          }
        ]
      }
    ]
  },
  {
    text: 'Gestionar RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Gestión de buckets',
        link: '/es/management/bucket/index',
        items: [
          {
            text: 'Creación de bucket',
            link: '/es/management/bucket/creation'
          },
          {
            text: 'Eliminación de bucket',
            link: '/es/management/bucket/deletion'
          }
        ]
      },
      {
        text: 'Gestión de objetos',
        link: '/es/management/object/index',
        items: [
          {
            text: 'Carga de objeto',
            link: '/es/management/object/creation'
          },
          {
            text: 'Eliminación de objeto',
            link: '/es/management/object/deletion'
          }
        ]
      },
      {
        text: 'Escáner de objetos',
        link: '/es/management/object/scanner'
      }
    ]
  },
  {
    text: 'Actualización, expansión y desinstalación',
    link: '/es/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Explicación de disponibilidad y expansión',
        link: '/es/upgrade-scale/availability-and-resiliency'
      }
    ]
  },
  {
    text: 'Solución de problemas',
    link: '/es/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Fallo de disco',
        link: '/es/troubleshooting/driver'
      },
      {
        text: 'Verificación de objeto y recuperación automática',
        link: '/es/troubleshooting/healing'
      },
      {
        text: 'Fallo de nodo',
        link: '/es/troubleshooting/node'
      }
    ]
  },
  {
    text: 'Administración del sistema',
    link: '/es/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Gestión IAM',
        link: '/es/administration/iam',
        items: [
          {
            text: 'Token de acceso',
            link: '/es/administration/iam/access-token'
          }
        ]
      }
    ]
  },
  {
    text: 'Integración',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Configuración de proxy inverso Nginx',
        link: '/es/integration/nginx'
      },
      {
        text: 'Configuración de modo de host virtual',
        link: '/es/integration/virtual'
      },
      {
        text: 'Configuración TLS',
        link: '/es/integration/tls-configured'
      }
    ]
  },
  {
    text: 'Desarrollador',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'MCP',
        link: '/es/developer/mcp'
      },
      {
        text: 'Cliente MinIO',
        link: '/es/developer/mc'
      },
      {
        text: 'SDK',
        link: '/es/developer/sdk/index',
        items: [
          {
            text: 'Java',
            link: '/es/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/es/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/es/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/es/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/es/developer/sdk/typescript'
          },
          {
            text: 'Golang',
            link: '/es/developer/sdk/go'
          },
          {
            text: 'Otros SDK',
            link: '/es/developer/sdk/other'
          }
        ]
      },
      {
        text: 'API compatible con S3',
        link: '/es/developer/api'
      },
      {
        text: 'Licencia de código abierto',
        link: '/es/developer/license'
      }
    ]
  },
  {
    text: 'Funcionalidades del producto',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Distribuido',
        link: '/es/features/distributed/'
      },
      {
        text: 'Gestión de logs',
        link: '/es/features/logging/'
      },
      {
        text: 'Control de versiones',
        link: '/es/features/versioning/'
      },
      {
        text: 'Compatibilidad S3',
        link: '/es/features/s3-compatibility/'
      },
      {
        text: 'Nivel de objeto y solo lectura',
        link: '/es/features/worm/'
      },
      {
        text: 'Replicación entre regiones',
        link: '/es/features/replication/'
      },
      {
        text: 'Cifrado',
        link: '/es/features/encryption/'
      },
      {
        text: 'Gestión del ciclo de vida',
        link: '/es/features/lifecycle/'
      }
    ]
  },
  {
    text: 'Soluciones',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Lago de datos moderno',
        link: '/es/features/data-lake/'
      },
      {
        text: 'IA y aprendizaje automático',
        link: '/es/features/ai/'
      },
      {
        text: 'Cloud nativo',
        link: '/es/features/cloud-native/'
      },
      {
        text: 'Separación de computación y almacenamiento de big data',
        link: '/es/features/hdfs/'
      },
      {
        text: 'Soporte SQL',
        link: '/es/features/sql-server/'
      },
      {
        text: 'Trading cuantitativo',
        link: '/es/features/quantitative-trading/'
      },
      {
        text: 'Reducción de costos en manufactura',
        link: '/es/features/industry/'
      },
      {
        text: 'Almacenamiento de archivo frío',
        link: '/es/features/cold-archiving/'
      },
      {
        text: 'Solución de almacenamiento de video',
        link: '/es/features/video/'
      },
      {
        text: 'Solución de innovación doméstica y SM',
        link: '/es/features/domestic/'
      }
    ]
  }
]
