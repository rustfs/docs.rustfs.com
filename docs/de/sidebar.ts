export const deSidebar = [
  {
    text: 'Einführung',
    collapsed: true,
    home: true,
    items: [
      { text: 'RustFS Überblick', link: '/de/introduction' },
      { text: 'Architekturaufbau', link: '/de/architecture' },
      { text: 'Vergleich mit anderen Speicherlösungen', link: '/de/comparison' },
      { text: 'Open Source Lizenz', link: '/de/license' },
      {
        text: 'Kernkonzepte', items: [
          { text: 'Glossar', link: '/de/concepts/glossary' },
          { text: 'Erasure Coding Prinzip', link: '/de/concepts/erasure-coding' },
          { text: 'Verfügbarkeit und Skalierbarkeit', link: '/de/concepts/availability-and-resiliency' },
          { text: 'Objektprüfung und automatische Wiederherstellung', link: '/de/concepts/object-healing' },
          { text: 'Objektscan', link: '/de/concepts/object-scanner' },
          { text: 'Nutzungsbeschränkungen', link: '/de/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: 'Architektur-Support',
    collapsed: true,
    home: true,
    items: [
      { text: 'Bare Metal und Virtualisierung', link: '/de/features/baremetal/' },
      { text: 'Alibaba Cloud', link: '/de/features/aliyun/' },
      { text: 'Tencent Cloud', link: '/de/features/qcloud/' },
      { text: 'Huawei Cloud', link: '/de/features/huaweicloud/' },
      { text: 'VMWare Tanzu', link: '/de/features/tanzu/' },
      { text: 'Internationale Cloud-Anbieter', link: '/de/features/aws-elastic/' },
    ],
  },
  {
    text: 'Produktfunktionen',
    collapsed: true,
    home: true,
    items: [
      { text: 'Verteilt', link: '/de/features/distributed/' },
      { text: 'Log-Management', link: '/de/features/logging/' },
      { text: 'Versionskontrolle', link: '/de/features/versioning/' },
      { text: 'S3-Kompatibilität', link: '/de/features/s3-compatibility/' },
      { text: 'Objektebene und Nur-Lesen', link: '/de/features/worm/' },
      { text: 'Regionsübergreifende Replikation', link: '/de/features/replication/' },
      { text: 'Verschlüsselung', link: '/de/features/encryption/' },
      { text: 'Lifecycle-Management', link: '/de/features/lifecycle/' },
    ],
  },
  {
    text: 'Lösungen',
    collapsed: true,
    home: true,
    items: [
      { text: 'Moderner Data Lake', link: '/de/features/data-lake/' },
      { text: 'KI und maschinelles Lernen', link: '/de/features/ai/' },
      { text: 'Cloud Native', link: '/de/features/cloud-native/' },
      { text: 'Big Data Compute-Storage-Trennung', link: '/de/features/hdfs/' },
      { text: 'SQL-Unterstützung', link: '/de/features/sql-server/' },
      { text: 'Quantitativer Handel', link: '/de/features/quantitative-trading/' },
      { text: 'Fertigungskostensenkung', link: '/de/features/industry/' },
      { text: 'Cold-Archiv-Speicher', link: '/de/features/cold-archiving/' },
      { text: 'Video-Speicherlösung', link: '/de/features/video/' },
      { text: 'Nationale Informatisierung und SM-Lösungen', link: '/de/features/domestic/' },
    ],
  },
  {
    text: 'Installation und Bereitstellung',
    collapsed: true,
    home: true,
    items: [
      { text: 'Startmodus', link: '/de/installation/mode/' },
      { text: 'Hardware-Auswahl', link: '/de/installation/hardware-selection' },
      {
        text: 'Vorinstallationsprüfungen',
        link: '/de/installation/checklists',
        items: [
          { text: 'Checkliste', link: '/de/installation/checklists' },
          { text: 'Hardware-Checkliste', link: '/de/installation/hard-checklists' },
          { text: 'Software-Checkliste', link: '/de/installation/software-checklists' },
          { text: 'Netzwerk-Checkliste', link: '/de/installation/network-checklists' },
          { text: 'Sicherheits-Checkliste', link: '/de/installation/security-checklists' },
        ]
      },
      {
        text: 'Installationsanleitung',
        link: '/de/installation/linux',
        items: [
          { text: 'Linux-Installation', link: '/de/installation/linux' },
          { text: 'macOS-Installation', link: '/de/installation/macos/' },
          { text: 'Windows-Installation', link: '/de/installation/windows/' },
          { text: 'Docker-Installation', link: '/de/installation/docker' },
        ]
      },
    ]
  },
    {
    text: 'Funktions-Nutzungsanleitung',
    collapsed: true,
    home: true,
    items: [
      { text: 'MCP', link: '/de/guide/mcp' },
    ]
  },
  {
    text: 'SDK und API',
    collapsed: true,
    home: true,
    items: [
      { text: 'SDK-Übersicht', link: '/de/sdk/' },
      { text: 'Java SDK', link: '/de/sdk/java' },
      { text: 'Python SDK', link: '/de/sdk/python' },
      { text: 'JavaScript SDK', link: '/de/sdk/js' },
      { text: 'Andere SDKs', link: '/de/sdk/other' },
    ]
  }
]