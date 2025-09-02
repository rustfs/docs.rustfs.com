export const sidebar = [
  {
    text: 'RustFS インストールガイド',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Linuxインストール',
        link: '/ja/installation/linux/index',
        items: [
          {
            text: 'Linuxクイックインストール',
            link: '/ja/installation/linux/quick-start'
          },
          {
            text: '単一ノード単一ディスクインストール',
            link: '/ja/installation/linux/single-node-single-disk'
          },
          {
            text: '単一ノード複数ディスクインストール',
            link: '/ja/installation/linux/single-node-multiple-disk'
          },
          {
            text: '複数ノード複数ディスクインストール',
            link: '/ja/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Windows インストール',
        link: '/ja/installation/windows/index'
      },
      {
        text: 'macOS インストール',
        link: '/ja/installation/macos/index'
      },
      {
        text: 'Docker インストール',
        link: '/ja/installation/docker/index'
      }
    ]
  },
  {
    text: 'インストールチェックリスト',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'ハードウェア要件',
        link: '/ja/installation/checklists/hardware-checklists'
      },
      {
        text: 'ハードウェア選択',
        link: '/ja/installation/checklists/hardware-selection'
      },
      {
        text: 'ネットワークチェック',
        link: '/ja/installation/checklists/network-checklists'
      },
      {
        text: 'ソフトウェアチェック',
        link: '/ja/installation/checklists/software-checklists'
      },
      {
        text: 'セキュリティチェック',
        link: '/ja/installation/checklists/security-checklists'
      }
    ]
  },
  {
    text: 'RustFS パフォーマンスとフレームワーク',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'RustFSパフォーマンス比較',
        link: '/ja/concepts/comparison'
      },
      {
        text: 'RustFS設計アーキテクチャ',
        link: '/ja/concepts/architecture'
      },
      {
        text: '用語説明',
        link: '/ja/concepts/glossary'
      },
      {
        text: '使用制限',
        link: '/ja/concepts/limit'
      },
      {
        text: 'コアコンセプト',
        link: '/ja/concepts/principle',
        items: [
          {
            text: 'イレイジャーコーディング',
            link: '/ja/concepts/principle/erasure-coding'
          }
        ]
      }
    ]
  },
  {
    text: 'RustFS管理',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'バケット管理',
        link: '/ja/management/bucket/index',
        items: [
          {
            text: 'バケット作成',
            link: '/ja/management/bucket/creation'
          },
          {
            text: 'バケット削除',
            link: '/ja/management/bucket/deletion'
          }
        ]
      },
      {
        text: 'オブジェクト管理',
        link: '/ja/management/object/index',
        items: [
          {
            text: 'オブジェクトアップロード',
            link: '/ja/management/object/creation'
          },
          {
            text: 'オブジェクト削除',
            link: '/ja/management/object/deletion'
          }
        ]
      },
      {
        text: 'オブジェクトスキャン',
        link: '/ja/management/object/scanner'
      }
    ]
  },
  {
    text: 'アップグレード、拡張、アンインストール',
    link: '/ja/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '可用性と拡張性の説明',
        link: '/ja/upgrade-scale/availability-and-resiliency'
      }
    ]
  },
  {
    text: 'トラブルシューティング',
    link: '/ja/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'ディスク障害',
        link: '/ja/troubleshooting/driver'
      },
      {
        text: 'オブジェクト検査と自動復旧',
        link: '/ja/troubleshooting/healing'
      },
      {
        text: 'ノード障害',
        link: '/ja/troubleshooting/node'
      }
    ]
  },
  {
    text: 'システム管理',
    link: '/ja/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'IAM管理',
        link: '/ja/administration/iam',
        items: [
          {
            text: 'アクセストークン',
            link: '/ja/administration/iam/access-token'
          }
        ]
      }
    ]
  },
  {
    text: '統合',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Nginxリバースプロキシ設定',
        link: '/ja/integration/nginx'
      },
      {
        text: '仮想ホストモード設定',
        link: '/ja/integration/virtual'
      },
      {
        text: 'TLS設定',
        link: '/ja/integration/tls-configured'
      }
    ]
  },
  {
    text: '開発者',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'MCP',
        link: '/ja/developer/mcp'
      },
      {
        text: 'MinIO Client',
        link: '/ja/developer/mc'
      },
      {
        text: 'SDK',
        link: '/ja/developer/sdk/index',
        items: [
          {
            text: 'Java',
            link: '/ja/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/ja/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/ja/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/ja/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/ja/developer/sdk/typescript'
          },
          {
            text: 'その他のSDK',
            link: '/ja/developer/sdk/other'
          }
        ]
      },
      {
        text: 'S3互換性API',
        link: '/ja/developer/api'
      },
      {
        text: 'オープンソースライセンス',
        link: '/ja/developer/license'
      }
    ]
  },
  {
    text: '製品機能',
    // collapsed: true,
    home: true,
    items: [
      {
        text: '分散型',
        link: '/ja/features/distributed/'
      },
      {
        text: 'ログ管理',
        link: '/ja/features/logging/'
      },
      {
        text: 'バージョン管理',
        link: '/ja/features/versioning/'
      },
      {
        text: 'S3互換性',
        link: '/ja/features/s3-compatibility/'
      },
      {
        text: 'オブジェクトレベルと読み取り専用',
        link: '/ja/features/worm/'
      },
      {
        text: 'クロスリージョン複製',
        link: '/ja/features/replication/'
      },
      {
        text: '暗号化',
        link: '/ja/features/encryption/'
      },
      {
        text: 'ライフサイクル管理',
        link: '/ja/features/lifecycle/'
      }
    ]
  },
  {
    text: 'ソリューション',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'モダンデータレイク',
        link: '/ja/features/data-lake/'
      },
      {
        text: 'AIと機械学習',
        link: '/ja/features/ai/'
      },
      {
        text: 'クラウドネイティブ',
        link: '/ja/features/cloud-native/'
      },
      {
        text: 'ビッグデータ計算ストレージ分離',
        link: '/ja/features/hdfs/'
      },
      {
        text: 'SQLサポート',
        link: '/ja/features/sql-server/'
      },
      {
        text: '量的取引',
        link: '/ja/features/quantitative-trading/'
      },
      {
        text: '製造業コスト削減',
        link: '/ja/features/industry/'
      },
      {
        text: 'コールドアーカイブストレージ',
        link: '/ja/features/cold-archiving/'
      },
      {
        text: 'ビデオストレージソリューション',
        link: '/ja/features/video/'
      },
      {
        text: '国産情報化とSMソリューション',
        link: '/ja/features/domestic/'
      }
    ]
  }
]
