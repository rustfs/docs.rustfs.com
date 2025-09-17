export const sidebar = [
  {
    text: 'Guide d\'installation RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Installation Linux',
        link: '/fr/installation/linux/index',
        items: [
          {
            text: 'Installation Linux rapide',
            link: '/fr/installation/linux/quick-start'
          },
          {
            text: 'Installation nœud unique disque unique',
            link: '/fr/installation/linux/single-node-single-disk'
          },
          {
            text: 'Installation nœud unique disques multiples',
            link: '/fr/installation/linux/single-node-multiple-disk'
          },
          {
            text: 'Installation nœuds multiples disques multiples',
            link: '/fr/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Installation Windows',
        link: '/fr/installation/windows/index'
      },
      {
        text: 'Installation macOS',
        link: '/fr/installation/macos/index'
      },
      {
        text: 'Installation Docker',
        link: '/fr/installation/docker/index'
      }
    ]
  },
  {
    text: 'Liste de vérification d\'installation',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Exigences matérielles',
        link: '/fr/installation/checklists/hardware-checklists'
      },
      {
        text: 'Sélection matérielle',
        link: '/fr/installation/checklists/hardware-selection'
      },
      {
        text: 'Vérification réseau',
        link: '/fr/installation/checklists/network-checklists'
      },
      {
        text: 'Vérification logicielle',
        link: '/fr/installation/checklists/software-checklists'
      },
      {
        text: 'Vérification sécurité',
        link: '/fr/installation/checklists/security-checklists'
      }
    ]
  },
  {
    text: 'Performance et framework RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Comparaison de performance RustFS',
        link: '/fr/concepts/comparison'
      },
      {
        text: 'Architecture de conception RustFS',
        link: '/fr/concepts/architecture'
      },
      {
        text: 'Explication terminologique',
        link: '/fr/concepts/glossary'
      },
      {
        text: 'Limitations d\'utilisation',
        link: '/fr/concepts/limit'
      },
      {
        text: 'Concepts fondamentaux',
        link: '/fr/concepts/principle',
        items: [
          {
            text: 'Code d\'effacement',
            link: '/fr/concepts/principle/erasure-coding'
          }
        ]
      }
    ]
  },
  {
    text: 'Gérer RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Gestion des buckets',
        link: '/fr/management/bucket/index',
        items: [
          {
            text: 'Création de bucket',
            link: '/fr/management/bucket/creation'
          },
          {
            text: 'Suppression de bucket',
            link: '/fr/management/bucket/deletion'
          }
        ]
      },
      {
        text: 'Gestion des objets',
        link: '/fr/management/object/index',
        items: [
          {
            text: 'Téléchargement d\'objet',
            link: '/fr/management/object/creation'
          },
          {
            text: 'Suppression d\'objet',
            link: '/fr/management/object/deletion'
          }
        ]
      },
      {
        text: 'Scanner d\'objets',
        link: '/fr/management/object/scanner'
      }
    ]
  },
  {
    text: 'Mise à niveau, expansion et désinstallation',
    link: '/fr/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Explication de disponibilité et d\'expansion',
        link: '/fr/upgrade-scale/availability-and-resiliency'
      }
    ]
  },
  {
    text: 'Dépannage',
    link: '/fr/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Défaillance de disque',
        link: '/fr/troubleshooting/driver'
      },
      {
        text: 'Vérification d\'objet et récupération automatique',
        link: '/fr/troubleshooting/healing'
      },
      {
        text: 'Défaillance de nœud',
        link: '/fr/troubleshooting/node'
      }
    ]
  },
  {
    text: 'Administration système',
    link: '/fr/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Gestion IAM',
        link: '/fr/administration/iam',
        items: [
          {
            text: 'Jeton d\'accès',
            link: '/fr/administration/iam/access-token'
          }
        ]
      }
    ]
  },
  {
    text: 'Intégration',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Configuration proxy inverse Nginx',
        link: '/fr/integration/nginx'
      },
      {
        text: 'Configuration mode hôte virtuel',
        link: '/fr/integration/virtual'
      },
      {
        text: 'Configuration TLS',
        link: '/fr/integration/tls-configured'
      }
    ]
  },
  {
    text: 'Développeur',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'MCP',
        link: '/fr/developer/mcp'
      },
      {
        text: 'Client MinIO',
        link: '/fr/developer/mc'
      },
      {
        text: 'SDK',
        link: '/fr/developer/sdk/index',
        items: [
          {
            text: 'Java',
            link: '/fr/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/fr/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/fr/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/fr/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/fr/developer/sdk/typescript'
          },
          {
            text: 'Golang',
            link: '/fr/developer/sdk/go'
          },
          {
            text: 'Autres SDK',
            link: '/fr/developer/sdk/other'
          }
        ]
      },
      {
        text: 'API compatible S3',
        link: '/fr/developer/api'
      },
      {
        text: 'Licence open source',
        link: '/fr/developer/license'
      }
    ]
  },
  {
    text: 'Fonctionnalités produit',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Distribué',
        link: '/fr/features/distributed/'
      },
      {
        text: 'Gestion des journaux',
        link: '/fr/features/logging/'
      },
      {
        text: 'Contrôle de version',
        link: '/fr/features/versioning/'
      },
      {
        text: 'Compatibilité S3',
        link: '/fr/features/s3-compatibility/'
      },
      {
        text: 'Niveau objet et lecture seule',
        link: '/fr/features/worm/'
      },
      {
        text: 'Réplication inter-régions',
        link: '/fr/features/replication/'
      },
      {
        text: 'Chiffrement',
        link: '/fr/features/encryption/'
      },
      {
        text: 'Gestion du cycle de vie',
        link: '/fr/features/lifecycle/'
      }
    ]
  },
  {
    text: 'Solutions',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Lac de données moderne',
        link: '/fr/features/data-lake/'
      },
      {
        text: 'IA et apprentissage automatique',
        link: '/fr/features/ai/'
      },
      {
        text: 'Cloud natif',
        link: '/fr/features/cloud-native/'
      },
      {
        text: 'Séparation calcul-stockage big data',
        link: '/fr/features/hdfs/'
      },
      {
        text: 'Support SQL',
        link: '/fr/features/sql-server/'
      },
      {
        text: 'Trading quantitatif',
        link: '/fr/features/quantitative-trading/'
      },
      {
        text: 'Réduction des coûts manufacturiers',
        link: '/fr/features/industry/'
      },
      {
        text: 'Stockage d\'archivage froid',
        link: '/fr/features/cold-archiving/'
      },
      {
        text: 'Solution de stockage vidéo',
        link: '/fr/features/video/'
      },
      {
        text: 'Solution d\'innovation domestique et SM',
        link: '/fr/features/domestic/'
      }
    ]
  }
]
