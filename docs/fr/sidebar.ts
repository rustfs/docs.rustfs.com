export const sidebar = [
  {
    text: 'Introduction',
    collapsed: true,
    home: true,
    items: [
      { text: 'Qu\'est-ce que RustFS ?', link: '/fr/concepts/introduction' },
      { text: 'Architecture de conception', link: '/fr/concepts/architecture' },
      { text: 'Comparaison des produits', link: '/fr/concepts/comparison' },
      { text: 'Terminologie courante', link: '/fr/concepts/glossary' },
      { text: 'Limitations d\'utilisation', link: '/fr/concepts/limit' },
      {
        text: 'Concepts fondamentaux',
        link: '/fr/concepts/principle/index',
        items: [
          { text: 'Code d\'effacement', link: '/fr/concepts/principle/erasure-coding' },
        ],
      },
    ],
  },
  {
    text: 'Installation et déploiement',
    collapsed: true,
    home: true,
    items: [
      {
        text: 'Guide d\'installation',
        link: '/fr/installation/index',
        items: [
          { text: 'Installation Linux', link: '/fr/installation/linux/index' },
          { text: 'Installation macOS', link: '/fr/installation/macos/index' },
          { text: 'Installation Windows', link: '/fr/installation/windows/index' },
          { text: 'Installation Docker', link: '/fr/installation/docker/index' },
        ]
      },
    ]
  },
  {
    text: 'Guide administrateur',
    collapsed: true,
    home: true,
    items: [
      {
        text: 'Gestion IAM',
        link: '/fr/administration/iam/index',
        items: [
          { text: 'Jeton d\'accès', link: '/fr/administration/iam/access-token' },
        ]
      },
    ]
  },
  {
    text: 'Gestion optimale',
    collapsed: true,
    home: true,
    items: [
      { text: 'Gestion des buckets', link: '/fr/management/bucket/index' },
      { text: 'Gestion des objets', link: '/fr/management/object/index' },
      { text: 'Gestion IAM', link: '/fr/administration/iam/index' },
    ]
  },
  {
    text: 'Guide du développeur',
    collapsed: true,
    home: true,
    items: [
      { text: 'Guide du développeur', link: '/fr/developer/index' },
      { text: 'Guide MCP', link: '/fr/developer/mcp' },
      { text: 'Guide MinIO Client', link: '/fr/developer/mc' },
      {
        text: 'Guide SDK',
        link: '/fr/developer/sdk/index',
        items: [
          { text: 'SDK Java', link: '/fr/developer/sdk/java' },
          { text: 'SDK JavaScript', link: '/fr/developer/sdk/javascript' },
          { text: 'SDK Python', link: '/fr/developer/sdk/python' },
          { text: 'SDK Rust', link: '/fr/developer/sdk/rust' },
        ]
      },
    ]
  }
]
