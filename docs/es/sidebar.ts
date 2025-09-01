export const sidebar = [
  {
    text: 'Introducción',
    collapsed: true,
    home: true,
    items: [
      { text: '¿Qué es RustFS?', link: '/es/concepts/introduction' },
      { text: 'Arquitectura de diseño', link: '/es/concepts/architecture' },
      { text: 'Comparación de productos', link: '/es/concepts/comparison' },
      { text: 'Terminología común', link: '/es/concepts/glossary' },
      { text: 'Limitaciones de uso', link: '/es/concepts/limit' },
      {
        text: 'Conceptos clave',
        link: '/es/concepts/principle/index',
        items: [
          { text: 'Código de borrado', link: '/es/concepts/principle/erasure-coding' },
        ],
      },
    ],
  },
  {
    text: 'Instalación y despliegue',
    collapsed: true,
    home: true,
    items: [
      {
        text: 'Guía de instalación',
        link: '/es/installation/index',
        items: [
          { text: 'Instalación Linux', link: '/es/installation/linux/index' },
          { text: 'Instalación macOS', link: '/es/installation/macos/index' },
          { text: 'Instalación Windows', link: '/es/installation/windows/index' },
          { text: 'Instalación Docker', link: '/es/installation/docker/index' },
        ]
      },
    ]
  },
  {
    text: 'Guía de administrador',
    collapsed: true,
    home: true,
    items: [
      {
        text: 'Gestión IAM',
        link: '/es/administration/iam/index',
        items: [
          { text: 'Token de acceso', link: '/es/administration/iam/access-token' },
        ]
      },
    ]
  },
  {
    text: 'Gestión óptima',
    collapsed: true,
    home: true,
    items: [
      { text: 'Gestión de buckets', link: '/es/management/bucket/index' },
      { text: 'Gestión de objetos', link: '/es/management/object/index' },
      { text: 'Gestión IAM', link: '/es/administration/iam/index' },
    ]
  },
  {
    text: 'Guía del desarrollador',
    collapsed: true,
    home: true,
    items: [
      { text: 'Guía del desarrollador', link: '/es/developer/index' },
      { text: 'Guía MCP', link: '/es/developer/mcp' },
      { text: 'Guía MinIO Client', link: '/es/developer/mc' },
      {
        text: 'Guía SDK',
        link: '/es/developer/sdk/index',
        items: [
          { text: 'SDK Java', link: '/es/developer/sdk/java' },
          { text: 'SDK JavaScript', link: '/es/developer/sdk/javascript' },
          { text: 'SDK Python', link: '/es/developer/sdk/python' },
          { text: 'SDK Rust', link: '/es/developer/sdk/rust' },
          { text: 'SDK TypeScript', link: '/es/developer/sdk/typescript' },
        ]
      },
    ]
  }
]
