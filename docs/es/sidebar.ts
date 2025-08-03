export const esSidebar = [
  {
    text: 'Introducción',
    collapsed: true,
    home: true,
    items: [
      { text: 'Resumen de RustFS', link: '/es/introduction' },
      { text: 'Composición de arquitectura', link: '/es/architecture' },
      { text: 'Comparación con otros almacenamientos', link: '/es/comparison' },
      { text: 'Licencia de código abierto', link: '/es/license' },
      {
        text: 'Conceptos básicos', items: [
          { text: 'Glosario', link: '/es/concepts/glossary' },
          { text: 'Principio de codificación de borrado', link: '/es/concepts/erasure-coding' },
          { text: 'Disponibilidad y escalabilidad', link: '/es/concepts/availability-and-resiliency' },
          { text: 'Verificación de objetos y recuperación automática', link: '/es/concepts/object-healing' },
          { text: 'Escaneo de objetos', link: '/es/concepts/object-scanner' },
          { text: 'Limitaciones de uso', link: '/es/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: 'Soporte de arquitectura',
    collapsed: true,
    home: true,
    items: [
      { text: 'Metal desnudo y virtualización', link: '/es/features/baremetal/' },
      { text: 'Alibaba Cloud', link: '/es/features/aliyun/' },
      { text: 'Tencent Cloud', link: '/es/features/qcloud/' },
      { text: 'Huawei Cloud', link: '/es/features/huaweicloud/' },
      { text: 'VMWare Tanzu', link: '/es/features/tanzu/' },
      { text: 'Proveedores de nube internacionales', link: '/es/features/aws-elastic/' },
    ],
  },
  {
    text: 'Funciones del producto',
    collapsed: true,
    home: true,
    items: [
      { text: 'Distribuido', link: '/es/features/distributed/' },
      { text: 'Gestión de registros', link: '/es/features/logging/' },
      { text: 'Control de versiones', link: '/es/features/versioning/' },
      { text: 'Compatibilidad S3', link: '/es/features/s3-compatibility/' },
      { text: 'Nivel de objeto y solo lectura', link: '/es/features/worm/' },
      { text: 'Replicación entre regiones', link: '/es/features/replication/' },
      { text: 'Cifrado', link: '/es/features/encryption/' },
      { text: 'Gestión del ciclo de vida', link: '/es/features/lifecycle/' },
    ],
  },
  {
    text: 'Soluciones',
    collapsed: true,
    home: true,
    items: [
      { text: 'Lago de datos moderno', link: '/es/features/data-lake/' },
      { text: 'IA y aprendizaje automático', link: '/es/features/ai/' },
      { text: 'Nativo de la nube', link: '/es/features/cloud-native/' },
      { text: 'Separación de cómputo-almacenamiento de big data', link: '/es/features/hdfs/' },
      { text: 'Soporte SQL', link: '/es/features/sql-server/' },
      { text: 'Trading cuantitativo', link: '/es/features/quantitative-trading/' },
      { text: 'Reducción de costos de manufactura', link: '/es/features/industry/' },
      { text: 'Almacenamiento de archivo frío', link: '/es/features/cold-archiving/' },
      { text: 'Solución de almacenamiento de video', link: '/es/features/video/' },
      { text: 'Informatización nacional y soluciones SM', link: '/es/features/domestic/' },
    ],
  },
  {
    text: 'Instalación y despliegue',
    collapsed: true,
    home: true,
    items: [
      { text: 'Modo de inicio', link: '/es/installation/mode/' },
      { text: 'Selección de hardware', link: '/es/installation/hardware-selection' },
      {
        text: 'Verificaciones pre-instalación',
        link: '/es/installation/checklists',
        items: [
          { text: 'Lista de verificación', link: '/es/installation/checklists' },
          { text: 'Lista de verificación de hardware', link: '/es/installation/hard-checklists' },
          { text: 'Lista de verificación de software', link: '/es/installation/software-checklists' },
          { text: 'Lista de verificación de red', link: '/es/installation/network-checklists' },
          { text: 'Lista de verificación de seguridad', link: '/es/installation/security-checklists' },
        ]
      },
      {
        text: 'Guía de instalación',
        link: '/es/installation/linux',
        items: [
          { text: 'Instalación Linux', link: '/es/installation/linux' },
          { text: 'Instalación macOS', link: '/es/installation/macos/' },
          { text: 'Instalación Windows', link: '/es/installation/windows/' },
          { text: 'Instalación Docker', link: '/es/installation/docker' },
        ]
      },
    ]
  },
    {
    text: 'Guía de uso de funciones',
    collapsed: true,
    home: true,
    items: [
      { text: 'MCP', link: '/es/guide/mcp' },
    ]
  },
  {
    text: 'SDK y API',
    collapsed: true,
    home: true,
    items: [
      { text: 'Resumen de SDK', link: '/es/sdk/' },
      { text: 'Java SDK', link: '/es/sdk/java' },
      { text: 'Python SDK', link: '/es/sdk/python' },
      { text: 'JavaScript SDK', link: '/es/sdk/js' },
      { text: 'Otros SDKs', link: '/es/sdk/other' },
    ]
  }
]