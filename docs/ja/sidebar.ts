export const jaSidebar = [
  {
    text: '紹介',
    collapsed: true,
    home: true,
    items: [
      { text: 'RustFS概要', link: '/ja/introduction' },
      { text: 'アーキテクチャ構成', link: '/ja/architecture' },
      { text: '他のストレージとの比較', link: '/ja/comparison' },
      { text: 'オープンソースライセンス', link: '/ja/license' },
      {
        text: 'コアコンセプト', items: [
          { text: '用語説明', link: '/ja/concepts/glossary' },
          { text: 'イレイジャーコーディング原理', link: '/ja/concepts/erasure-coding' },
          { text: '可用性と拡張性', link: '/ja/concepts/availability-and-resiliency' },
          { text: 'オブジェクト検査と自動回復', link: '/ja/concepts/object-healing' },
          { text: 'オブジェクトスキャン', link: '/ja/concepts/object-scanner' },
          { text: '使用制限', link: '/ja/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: 'アーキテクチャサポート',
    collapsed: true,
    home: true,
    items: [
      { text: 'ベアメタルと仮想化', link: '/ja/features/baremetal/' },
      { text: 'Alibaba Cloud', link: '/ja/features/aliyun/' },
      { text: 'Tencent Cloud', link: '/ja/features/qcloud/' },
      { text: 'Huawei Cloud', link: '/ja/features/huaweicloud/' },
      { text: 'VMWare Tanzu', link: '/ja/features/tanzu/' },
      { text: '国際クラウドベンダー', link: '/ja/features/aws-elastic/' },
    ],
  },
  {
    text: '製品機能',
    collapsed: true,
    home: true,
    items: [
      { text: '分散型', link: '/ja/features/distributed/' },
      { text: 'ログ管理', link: '/ja/features/logging/' },
      { text: 'バージョン管理', link: '/ja/features/versioning/' },
      { text: 'S3互換性', link: '/ja/features/s3-compatibility/' },
      { text: 'オブジェクトレベルと読み取り専用', link: '/ja/features/worm/' },
      { text: 'クロスリージョン複製', link: '/ja/features/replication/' },
      { text: '暗号化', link: '/ja/features/encryption/' },
      { text: 'ライフサイクル管理', link: '/ja/features/lifecycle/' },
    ],
  },
  {
    text: 'ソリューション',
    collapsed: true,
    home: true,
    items: [
      { text: 'モダンデータレイク', link: '/ja/features/data-lake/' },
      { text: 'AIと機械学習', link: '/ja/features/ai/' },
      { text: 'クラウドネイティブ', link: '/ja/features/cloud-native/' },
      { text: 'ビッグデータ計算ストレージ分離', link: '/ja/features/hdfs/' },
      { text: 'SQLサポート', link: '/ja/features/sql-server/' },
      { text: '量的取引', link: '/ja/features/quantitative-trading/' },
      { text: '製造業コスト削減', link: '/ja/features/industry/' },
      { text: 'コールドアーカイブストレージ', link: '/ja/features/cold-archiving/' },
      { text: 'ビデオストレージソリューション', link: '/ja/features/video/' },
      { text: '国産情報化とSMソリューション', link: '/ja/features/domestic/' },
    ],
  },
  {
    text: 'インストールと展開',
    collapsed: true,
    home: true,
    items: [
      { text: '起動モード', link: '/ja/installation/mode/' },
      { text: 'ハードウェア選択', link: '/ja/installation/hardware-selection' },
      {
        text: 'インストール前チェック',
        link: '/ja/installation/checklists',
        items: [
          { text: 'チェックリスト', link: '/ja/installation/checklists' },
          { text: 'ハードウェアチェックリスト', link: '/ja/installation/hard-checklists' },
          { text: 'ソフトウェアチェックリスト', link: '/ja/installation/software-checklists' },
          { text: 'ネットワークチェックリスト', link: '/ja/installation/network-checklists' },
          { text: 'セキュリティチェックリスト', link: '/ja/installation/security-checklists' },
        ]
      },
      {
        text: 'インストールガイド',
        link: '/ja/installation/linux',
        items: [
          { text: 'Linuxインストール', link: '/ja/installation/linux' },
          { text: 'macOSインストール', link: '/ja/installation/macos/' },
          { text: 'Windowsインストール', link: '/ja/installation/windows/' },
          { text: 'Dockerインストール', link: '/ja/installation/docker' },
        ]
      },
    ]
  },
    {
    text: '機能使用ガイド',
    collapsed: true,
    home: true,
    items: [
      { text: 'MCP', link: '/ja/guide/mcp' },
    ]
  },
  {
    text: 'SDKとAPI',
    collapsed: true,
    home: true,
    items: [
      { text: 'SDK概要', link: '/ja/sdk/' },
      { text: 'Java SDK', link: '/ja/sdk/java' },
      { text: 'Python SDK', link: '/ja/sdk/python' },
      { text: 'JavaScript SDK', link: '/ja/sdk/js' },
      { text: 'その他のSDK', link: '/ja/sdk/other' },
    ]
  }
]