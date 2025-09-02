export const sidebar = [
  {
    text: 'RustFS Installationsanleitung',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Linux-Installation',
        link: '/de/installation/linux/index',
        items: [
          {
            text: 'Schnelle Linux-Installation',
            link: '/de/installation/linux/quick-start'
          },
          {
            text: 'Einzelserver-Einzelfestplatte-Installation',
            link: '/de/installation/linux/single-node-single-disk'
          },
          {
            text: 'Einzelserver-Mehrfachfestplatte-Installation',
            link: '/de/installation/linux/single-node-multiple-disk'
          },
          {
            text: 'Mehrfachserver-Mehrfachfestplatte-Installation',
            link: '/de/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Windows Installation',
        link: '/de/installation/windows/index'
      },
      {
        text: 'macOS Installation',
        link: '/de/installation/macos/index'
      },
      {
        text: 'Docker Installation',
        link: '/de/installation/docker/index'
      }
    ]
  },
  {
    text: 'Installations-Checkliste',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Hardware-Anforderungen',
        link: '/de/installation/checklists/hardware-checklists'
      },
      {
        text: 'Hardware-Auswahl',
        link: '/de/installation/checklists/hardware-selection'
      },
      {
        text: 'Netzwerk-Check',
        link: '/de/installation/checklists/network-checklists'
      },
      {
        text: 'Software-Check',
        link: '/de/installation/checklists/software-checklists'
      },
      {
        text: 'Sicherheits-Check',
        link: '/de/installation/checklists/security-checklists'
      }
    ]
  },
  {
    text: 'RustFS Leistung und Framework',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'RustFS Leistungsvergleich',
        link: '/de/concepts/comparison'
      },
      {
        text: 'RustFS Designarchitektur',
        link: '/de/concepts/architecture'
      },
      {
        text: 'Terminologie-Erklärung',
        link: '/de/concepts/glossary'
      },
      {
        text: 'Nutzungsbeschränkungen',
        link: '/de/concepts/limit'
      },
      {
        text: 'Kernkonzepte',
        link: '/de/concepts/principle',
        items: [
          {
            text: 'Erasure Coding',
            link: '/de/concepts/principle/erasure-coding'
          }
        ]
      }
    ]
  },
  {
    text: 'RustFS verwalten',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Bucket-Verwaltung',
        link: '/de/management/bucket/index',
        items: [
          {
            text: 'Bucket-Erstellung',
            link: '/de/management/bucket/creation'
          },
          {
            text: 'Bucket-Löschung',
            link: '/de/management/bucket/deletion'
          }
        ]
      },
      {
        text: 'Objektverwaltung',
        link: '/de/management/object/index',
        items: [
          {
            text: 'Objekt-Upload',
            link: '/de/management/object/creation'
          },
          {
            text: 'Objekt-Löschung',
            link: '/de/management/object/deletion'
          }
        ]
      },
      {
        text: 'Objekt-Scanner',
        link: '/de/management/object/scanner'
      }
    ]
  },
  {
    text: 'Upgrade, Erweiterung und Deinstallation',
    link: '/de/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Verfügbarkeit und Erweiterungserklärung',
        link: '/de/upgrade-scale/availability-and-resiliency'
      }
    ]
  },
  {
    text: 'Fehlerbehebung',
    link: '/de/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Festplattenfehler',
        link: '/de/troubleshooting/driver'
      },
      {
        text: 'Objektprüfung und automatische Wiederherstellung',
        link: '/de/troubleshooting/healing'
      },
      {
        text: 'Knotenfehler',
        link: '/de/troubleshooting/node'
      }
    ]
  },
  {
    text: 'Systemverwaltung',
    link: '/de/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'IAM-Verwaltung',
        link: '/de/administration/iam',
        items: [
          {
            text: 'Zugriffstoken',
            link: '/de/administration/iam/access-token'
          }
        ]
      }
    ]
  },
  {
    text: 'Integration',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Nginx Reverse-Proxy-Konfiguration',
        link: '/de/integration/nginx'
      },
      {
        text: 'Virtueller Host-Modus-Konfiguration',
        link: '/de/integration/virtual'
      },
      {
        text: 'TLS-Konfiguration',
        link: '/de/integration/tls-configured'
      }
    ]
  },
  {
    text: 'Entwickler',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'MCP',
        link: '/de/developer/mcp'
      },
      {
        text: 'MinIO Client',
        link: '/de/developer/mc'
      },
      {
        text: 'SDK',
        link: '/de/developer/sdk/index',
        items: [
          {
            text: 'Java',
            link: '/de/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/de/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/de/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/de/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/de/developer/sdk/typescript'
          },
          {
            text: 'Andere SDKs',
            link: '/de/developer/sdk/other'
          }
        ]
      },
      {
        text: 'S3-kompatible API',
        link: '/de/developer/api'
      },
      {
        text: 'Open-Source-Lizenz',
        link: '/de/developer/license'
      }
    ]
  },
  {
    text: 'Produktfunktionen',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Verteilt',
        link: '/de/features/distributed/'
      },
      {
        text: 'Protokollverwaltung',
        link: '/de/features/logging/'
      },
      {
        text: 'Versionskontrolle',
        link: '/de/features/versioning/'
      },
      {
        text: 'S3-Kompatibilität',
        link: '/de/features/s3-compatibility/'
      },
      {
        text: 'Objektstufe und schreibgeschützt',
        link: '/de/features/worm/'
      },
      {
        text: 'Regionsübergreifende Replikation',
        link: '/de/features/replication/'
      },
      {
        text: 'Verschlüsselung',
        link: '/de/features/encryption/'
      },
      {
        text: 'Lebenszyklusverwaltung',
        link: '/de/features/lifecycle/'
      }
    ]
  },
  {
    text: 'Lösungen',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Moderner Data Lake',
        link: '/de/features/data-lake/'
      },
      {
        text: 'KI und maschinelles Lernen',
        link: '/de/features/ai/'
      },
      {
        text: 'Cloud-nativ',
        link: '/de/features/cloud-native/'
      },
      {
        text: 'Big Data Computing-Speicher-Trennung',
        link: '/de/features/hdfs/'
      },
      {
        text: 'SQL-Unterstützung',
        link: '/de/features/sql-server/'
      },
      {
        text: 'Quantitativer Handel',
        link: '/de/features/quantitative-trading/'
      },
      {
        text: 'Herstellungsindustrie-Kostensenkung',
        link: '/de/features/industry/'
      },
      {
        text: 'Kaltarchiv-Speicher',
        link: '/de/features/cold-archiving/'
      },
      {
        text: 'Videospeicher-Lösung',
        link: '/de/features/video/'
      },
      {
        text: 'Inländische Innovation und SM-Lösung',
        link: '/de/features/domestic/'
      }
    ]
  }
]
