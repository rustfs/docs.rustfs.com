export const trSidebar = [
  {
    text: 'Giriş',
    collapsed: true,
    home: true,
    items: [
      { text: 'RustFS Nedir?', link: '/introduction' },
      { text: 'Mimari', link: '/architecture' },
      { text: 'Diğer Depolama Çözümleriyle Karşılaştırma', link: '/comparison' },
      { text: 'Açık Kaynak Lisansı', link: '/license' },
      {
        text: 'Temel Kavramlar', link: '/concepts/glossary',
        items: [
          { text: 'Terimler Sözlüğü', link: '/concepts/glossary' },
          { text: 'Erasure Coding', link: '/concepts/erasure-coding' },
          { text: 'Erişilebilirlik ve Dayanıklılık', link: '/concepts/availability-and-resiliency' },
          { text: 'Nesne İyileştirme ve Otomatik Kurtarma', link: '/concepts/object-healing' },
          { text: 'Nesne Tarayıcı', link: '/concepts/object-scanner' },
          { text: 'Kullanım Limitleri', link: '/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: 'Mimari Desteği',
    collapsed: true,
    home: true,
    items: [
      { text: 'Bare Metal ve Sanallaştırma', link: '/features/baremetal/' },
      { text: 'Alibaba Cloud', link: '/features/aliyun/' },
      { text: 'Tencent Cloud', link: '/features/qcloud/' },
      { text: 'Huawei Cloud', link: '/features/huaweicloud/' },
      { text: 'VMWare Tanzu', link: '/features/tanzu/' },
      { text: 'Uluslararası Bulut Sağlayıcılar', link: '/features/aws-elastic/' },
    ],
  },
  {
    text: 'Ürün Özellikleri',
    collapsed: true,
    home: true,
    items: [
      { text: 'Dağıtık', link: '/features/distributed/' },
      { text: 'Loglama', link: '/features/logging/' },
      { text: 'Sürümleme', link: '/features/versioning/' },
      { text: 'S3 Uyumluluğu', link: '/features/s3-compatibility/' },
      { text: 'Nesne Kilitleme & WORM', link: '/features/worm/' },
      { text: 'Çapraz Bölge Çoğaltma', link: '/features/replication/' },
      { text: 'Şifreleme', link: '/features/encryption/' },
      { text: 'Yaşam Döngüsü Yönetimi', link: '/features/lifecycle/' },
    ],
  },
  {
    text: 'Çözümler',
    collapsed: true,
    home: true,
    items: [
      { text: 'Modern Data Lake', link: '/features/data-lake/' },
      { text: 'AI ve Makine Öğrenimi', link: '/features/ai/' },
      { text: 'Cloud Native', link: '/features/cloud-native/' },
      { text: 'Büyük Veri Hesaplama-Depolama Ayrımı', link: '/features/hdfs/' },
      { text: 'SQL Desteği', link: '/features/sql-server/' },
      { text: 'Kantitatif Ticaret', link: '/features/quantitative-trading/' },
      { text: 'Üretim Maliyetlerini Düşürme', link: '/features/industry/' },
      { text: 'Soğuk Arşiv Depolama', link: '/features/cold-archiving/' },
      { text: 'Video Depolama Çözümleri', link: '/features/video/' },
      { text: 'Yerli İnovasyon ve SM Çözümleri', link: '/features/domestic/' },
    ],
  },
  {
    text: 'Kurulum ve Dağıtım',
    collapsed: true,
    home: true,
    items: [
      { text: 'Başlatma Modları', link: '/installation/mode/' },
      { text: 'Donanım Seçimi', link: '/installation/hardware-selection' },
      {
        text: 'Kurulum Öncesi Kontroller',
        link: '/installation/checklists',
        items: [
          { text: 'Kontrol Listeleri', link: '/installation/checklists' },
          { text: 'Donanım Kontrol Listeleri', link: '/installation/hard-checklists' },
          { text: 'Yazılım Kontrol Listeleri', link: '/installation/software-checklists' },
          { text: 'Ağ Kontrol Listeleri', link: '/installation/network-checklists' },
          { text: 'Güvenlik Kontrol Listeleri', link: '/installation/security-checklists' },
        ]
      },
      {
        text: 'Kurulum Kılavuzları',
        link: '/installation/linux',
        items: [
          { text: 'Linux Kurulumu', link: '/installation/linux' },
          { text: 'macOS Kurulumu', link: '/installation/macos/' },
          { text: 'Windows Kurulumu', link: '/installation/windows/' },
          { text: 'Docker Kurulumu', link: '/installation/docker' },
        ]
      },
    ]
  },
  {
    text: 'SDK ve API',
    collapsed: true,
    home: true,
    items: [
      { text: 'SDK Genel Bakış', link: '/sdk/' },
      { text: 'Java SDK', link: '/sdk/java' },
      { text: 'Python SDK', link: '/sdk/python' },
      { text: 'JavaScript SDK', link: '/sdk/js' },
      { text: 'Diğer SDK\'lar', link: '/sdk/other' },
    ]
  }
]