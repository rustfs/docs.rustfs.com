export const sidebar = [
  {
    text: 'RustFS Kurulum Kılavuzu',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Linux Kurulumu',
        link: '/tr/installation/linux/index',
        items: [
          {
            text: 'Linux Hızlı Kurulum',
            link: '/tr/installation/linux/quick-start'
          },
          {
            text: 'Tek Düğüm Tek Disk Kurulumu',
            link: '/tr/installation/linux/single-node-single-disk'
          },
          {
            text: 'Tek Düğüm Çoklu Disk Kurulumu',
            link: '/tr/installation/linux/single-node-multiple-disk'
          },
          {
            text: 'Çoklu Düğüm Çoklu Disk Kurulumu',
            link: '/tr/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Windows Kurulumu',
        link: '/tr/installation/windows/index'
      },
      {
        text: 'macOS Kurulumu',
        link: '/tr/installation/macos/index'
      },
      {
        text: 'Docker Kurulumu',
        link: '/tr/installation/docker/index'
      }
    ]
  },
  {
    text: 'Kurulum Kontrol Listesi',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Donanım Gereksinimleri',
        link: '/tr/installation/checklists/hardware-checklists'
      },
      {
        text: 'Donanım Seçimi',
        link: '/tr/installation/checklists/hardware-selection'
      },
      {
        text: 'Ağ Kontrolü',
        link: '/tr/installation/checklists/network-checklists'
      },
      {
        text: 'Yazılım Kontrolü',
        link: '/tr/installation/checklists/software-checklists'
      },
      {
        text: 'Güvenlik Kontrolü',
        link: '/tr/installation/checklists/security-checklists'
      }
    ]
  },
  {
    text: 'RustFS Performans ve Framework',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'RustFS Performans Karşılaştırması',
        link: '/tr/concepts/comparison'
      },
      {
        text: 'RustFS Tasarım Mimarisi',
        link: '/tr/concepts/architecture'
      },
      {
        text: 'Terimler Sözlüğü',
        link: '/tr/concepts/glossary'
      },
      {
        text: 'Kullanım Kısıtlamaları',
        link: '/tr/concepts/limit'
      },
      {
        text: 'Temel Kavramlar',
        // collapsed: true,
        link: '/tr/concepts/principle',
        items: [
          {
            text: 'Erasure Coding',
            link: '/tr/concepts/principle/erasure-coding'
          }
        ]
      }
    ]
  },
  {
    text: 'RustFS Yönetimi',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Bucket Yönetimi',
        link: '/tr/management/bucket/index',
        items: [
          {
            text: 'Bucket Oluşturma',
            link: '/tr/management/bucket/creation'
          },
          {
            text: 'Bucket Silme',
            link: '/tr/management/bucket/deletion'
          }
        ]
      },
      {
        text: 'Nesne Yönetimi',
        link: '/tr/management/object/index',
        // collapsed: true,
        items: [
          {
            text: 'Nesne Yükleme',
            link: '/tr/management/object/creation'
          },
          {
            text: 'Nesne Silme',
            link: '/tr/management/object/deletion'
          }
        ]
      },
      {
        text: 'Nesne Tarayıcı',
        link: '/tr/management/object/scanner'
      }
    ]
  },
  {
    text: 'Yükseltme, Genişletme ve Kaldırma',
    link: '/tr/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Kullanılabilirlik ve Genişletme Açıklaması',
        link: '/tr/upgrade-scale/availability-and-resiliency'
      }
    ]
  },
  {
    text: 'Sorun Giderme',
    link: '/tr/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Disk Hatası',
        link: '/tr/troubleshooting/driver'
      },
      {
        text: 'Nesne Kontrol ve Otomatik Kurtarma',
        link: '/tr/troubleshooting/healing'
      },
      {
        text: 'Düğüm Hatası',
        link: '/tr/troubleshooting/node'
      }
    ]
  },
  {
    text: 'Sistem Yönetimi',
    link: '/tr/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'IAM Yönetimi',
        link: '/tr/administration/iam',
        items: [
          {
            text: 'Erişim Belirteci',
            link: '/tr/administration/iam/access-token'
          }
        ]
      }
    ]
  },
  {
    text: 'Entegrasyon',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Nginx Reverse Proxy Yapılandırması',
        link: '/tr/integration/nginx'
      },
      {
        text: 'Sanal Host Modu Yapılandırması',
        link: '/tr/integration/virtual'
      },
      {
        text: 'TLS Yapılandırması',
        link: '/tr/integration/tls-configured'
      }
    ]
  },
  {
    text: 'Geliştirici',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'MCP',
        link: '/tr/developer/mcp'
      },
      {
        text: 'MinIO Client',
        link: '/tr/developer/mc'
      },
      {
        text: 'SDK',
        link: '/tr/developer/sdk/index',
        // collapsed: true,
        items: [
          {
            text: 'Java',
            link: '/tr/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/tr/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/tr/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/tr/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/tr/developer/sdk/typescript'
          },
          {
            text: 'Golang',
            link: '/tr/developer/sdk/go'
          },
          {
            text: 'Diğer SDK\'lar',
            link: '/tr/developer/sdk/other'
          }
        ],
      },
      {
        text: 'S3 Uyumluluk API\'si',
        link: '/tr/developer/api'
      },
      {
        text: 'Açık Kaynak Lisansı',
        link: '/tr/developer/license'
      }
    ]
  },
  {
    text: 'Ürün Özellikleri',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Dağıtık',
        link: '/tr/features/distributed/'
      },
      {
        text: 'Log Yönetimi',
        link: '/tr/features/logging/'
      },
      {
        text: 'Sürüm Kontrolü',
        link: '/tr/features/versioning/'
      },
      {
        text: 'S3 Uyumluluğu',
        link: '/tr/features/s3-compatibility/'
      },
      {
        text: 'Nesne Seviyesi ve Salt Okunur',
        link: '/tr/features/worm/'
      },
      {
        text: 'Çapraz Bölge Çoğaltma',
        link: '/tr/features/replication/'
      },
      {
        text: 'Şifreleme',
        link: '/tr/features/encryption/'
      },
      {
        text: 'Yaşam Döngüsü Yönetimi',
        link: '/tr/features/lifecycle/'
      },
    ],
  },
  {
    text: 'Çözümler',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Modern Veri Gölü',
        link: '/tr/features/data-lake/'
      },
      {
        text: 'AI ve Makine Öğrenimi',
        link: '/tr/features/ai/'
      },
      {
        text: 'Cloud Native',
        link: '/tr/features/cloud-native/'
      },
      {
        text: 'Büyük Veri Hesaplama Depolama Ayrımı',
        link: '/tr/features/hdfs/'
      },
      {
        text: 'SQL Desteği',
        link: '/tr/features/sql-server/'
      },
      {
        text: 'Nicel Ticaret',
        link: '/tr/features/quantitative-trading/'
      },
      {
        text: 'İmalat Maliyet Azaltma',
        link: '/tr/features/industry/'
      },
      {
        text: 'Soğuk Arşiv Depolama',
        link: '/tr/features/cold-archiving/'
      },
      {
        text: 'Video Depolama Çözümü',
        link: '/tr/features/video/'
      },
      {
        text: 'Yerli İnovasyon ve SM Çözümü',
        link: '/tr/features/domestic/'
      },
    ],
  },
]
