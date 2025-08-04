export const frSidebar = [
  {
    text: 'Introduction',
    collapsed: true,
    home: true,
    items: [
      { text: 'Présentation de RustFS', link: '/fr/introduction' },
      { text: 'Composition de l\'architecture', link: '/fr/architecture' },
      { text: 'Comparaison avec d\'autres stockages', link: '/fr/comparison' },
      { text: 'Licence open source', link: '/fr/license' },
      {
        text: 'Concepts clés', items: [
          { text: 'Glossaire', link: '/fr/concepts/glossary' },
          { text: 'Principe du codage d\'effacement', link: '/fr/concepts/erasure-coding' },
          { text: 'Disponibilité et extensibilité', link: '/fr/concepts/availability-and-resiliency' },
          { text: 'Vérification d\'objets et récupération automatique', link: '/fr/concepts/object-healing' },
          { text: 'Scan d\'objets', link: '/fr/concepts/object-scanner' },
          { text: 'Limitations d\'utilisation', link: '/fr/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: 'Support d\'architecture',
    collapsed: true,
    home: true,
    items: [
      { text: 'Métal nu et virtualisation', link: '/fr/features/baremetal/' },
      { text: 'Alibaba Cloud', link: '/fr/features/aliyun/' },
      { text: 'Tencent Cloud', link: '/fr/features/qcloud/' },
      { text: 'Huawei Cloud', link: '/fr/features/huaweicloud/' },
      { text: 'VMWare Tanzu', link: '/fr/features/tanzu/' },
      { text: 'Fournisseurs de cloud internationaux', link: '/fr/features/aws-elastic/' },
    ],
  },
  {
    text: 'Fonctionnalités du produit',
    collapsed: true,
    home: true,
    items: [
      { text: 'Distribué', link: '/fr/features/distributed/' },
      { text: 'Gestion des journaux', link: '/fr/features/logging/' },
      { text: 'Contrôle de version', link: '/fr/features/versioning/' },
      { text: 'Compatibilité S3', link: '/fr/features/s3-compatibility/' },
      { text: 'Niveau objet et lecture seule', link: '/fr/features/worm/' },
      { text: 'Réplication inter-régions', link: '/fr/features/replication/' },
      { text: 'Chiffrement', link: '/fr/features/encryption/' },
      { text: 'Gestion du cycle de vie', link: '/fr/features/lifecycle/' },
    ],
  },
  {
    text: 'Solutions',
    collapsed: true,
    home: true,
    items: [
      { text: 'Lac de données moderne', link: '/fr/features/data-lake/' },
      { text: 'IA et apprentissage automatique', link: '/fr/features/ai/' },
      { text: 'Cloud natif', link: '/fr/features/cloud-native/' },
      { text: 'Séparation calcul-stockage big data', link: '/fr/features/hdfs/' },
      { text: 'Support SQL', link: '/fr/features/sql-server/' },
      { text: 'Trading quantitatif', link: '/fr/features/quantitative-trading/' },
      { text: 'Réduction des coûts manufacturiers', link: '/fr/features/industry/' },
      { text: 'Stockage d\'archivage froid', link: '/fr/features/cold-archiving/' },
      { text: 'Solution de stockage vidéo', link: '/fr/features/video/' },
      { text: 'Solutions nationales d\'informatisation et SM', link: '/fr/features/domestic/' },
    ],
  },
  {
    text: 'Installation et déploiement',
    collapsed: true,
    home: true,
    items: [
      { text: 'Mode de démarrage', link: '/fr/installation/mode/' },
      { text: 'Sélection du matériel', link: '/fr/installation/hardware-selection' },
      {
        text: 'Vérifications pré-installation',
        link: '/fr/installation/checklists',
        items: [
          { text: 'Liste de contrôle', link: '/fr/installation/checklists' },
          { text: 'Liste de contrôle matériel', link: '/fr/installation/hard-checklists' },
          { text: 'Liste de contrôle logiciel', link: '/fr/installation/software-checklists' },
          { text: 'Liste de contrôle réseau', link: '/fr/installation/network-checklists' },
          { text: 'Liste de contrôle sécurité', link: '/fr/installation/security-checklists' },
        ]
      },
      {
        text: 'Guide d\'installation',
        link: '/fr/installation/linux',
        items: [
          { text: 'Installation Linux', link: '/fr/installation/linux' },
          { text: 'Installation macOS', link: '/fr/installation/macos/' },
          { text: 'Installation Windows', link: '/fr/installation/windows/' },
          { text: 'Installation Docker', link: '/fr/installation/docker' },
        ]
      },
    ]
  },
    {
    text: 'Guide d\'utilisation des fonctionnalités',
    collapsed: true,
    home: true,
    items: [
      { text: 'MCP', link: '/fr/guide/mcp' },
    ]
  },
  {
    text: 'SDK et API',
    collapsed: true,
    home: true,
    items: [
      { text: 'Aperçu des SDK', link: '/fr/sdk/' },
      { text: 'Java SDK', link: '/fr/sdk/java' },
      { text: 'Python SDK', link: '/fr/sdk/python' },
      { text: 'JavaScript SDK', link: '/fr/sdk/js' },
      { text: 'Autres SDK', link: '/fr/sdk/other' },
    ]
  }
]