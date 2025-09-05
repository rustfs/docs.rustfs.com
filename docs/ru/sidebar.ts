export const sidebar = [
  {
    text: 'Руководство по установке RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Установка Linux',
        link: '/ru/installation/linux/index',
        items: [
          {
            text: 'Быстрая установка Linux',
            link: '/ru/installation/linux/quick-start'
          },
          {
            text: 'Установка на один узел с одним диском',
            link: '/ru/installation/linux/single-node-single-disk'
          },
          {
            text: 'Установка на один узел с множественными дисками',
            link: '/ru/installation/linux/single-node-multiple-disk'
          },
          {
            text: 'Установка на множественные узлы с множественными дисками',
            link: '/ru/installation/linux/multiple-node-multiple-disk'
          }
        ]
      },
      {
        text: 'Установка Windows',
        link: '/ru/installation/windows/index'
      },
      {
        text: 'Установка macOS',
        link: '/ru/installation/macos/index'
      },
      {
        text: 'Установка Docker',
        link: '/ru/installation/docker/index'
      }
    ]
  },
  {
    text: 'Контрольный список установки',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Требования к аппаратному обеспечению',
        link: '/ru/installation/checklists/hardware-checklists'
      },
      {
        text: 'Выбор аппаратного обеспечения',
        link: '/ru/installation/checklists/hardware-selection'
      },
      {
        text: 'Проверка сети',
        link: '/ru/installation/checklists/network-checklists'
      },
      {
        text: 'Проверка программного обеспечения',
        link: '/ru/installation/checklists/software-checklists'
      },
      {
        text: 'Проверка безопасности',
        link: '/ru/installation/checklists/security-checklists'
      }
    ]
  },
  {
    text: 'Производительность и фреймворк RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Сравнение производительности RustFS',
        link: '/ru/concepts/comparison'
      },
      {
        text: 'Архитектура дизайна RustFS',
        link: '/ru/concepts/architecture'
      },
      {
        text: 'Глоссарий',
        link: '/ru/concepts/glossary'
      },
      {
        text: 'Ограничения использования',
        link: '/ru/concepts/limit'
      },
      {
        text: 'Основные концепции',
        // collapsed: true,
        link: '/ru/concepts/principle',
        items: [
          {
            text: 'Erasure Coding',
            link: '/ru/concepts/principle/erasure-coding'
          }
        ]
      }
    ]
  },
  {
    text: 'Управление RustFS',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Управление корзинами',
        link: '/ru/management/bucket/index',
        items: [
          {
            text: 'Создание корзин',
            link: '/ru/management/bucket/creation'
          },
          {
            text: 'Удаление корзин',
            link: '/ru/management/bucket/deletion'
          }
        ]
      },
      {
        text: 'Управление объектами',
        link: '/ru/management/object/index',
        // collapsed: true,
        items: [
          {
            text: 'Загрузка объектов',
            link: '/ru/management/object/creation'
          },
          {
            text: 'Удаление объектов',
            link: '/ru/management/object/deletion'
          }
        ]
      },
      {
        text: 'Сканирование объектов',
        link: '/ru/management/object/scanner'
      }
    ]
  },
  {
    text: 'Обновление, расширение и деинсталляция',
    link: '/ru/upgrade-scale/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Доступность и объяснение расширения',
        link: '/ru/upgrade-scale/availability-and-resiliency'
      }
    ]
  },
  {
    text: 'Устранение неполадок',
    link: '/ru/troubleshooting/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Отказ диска',
        link: '/ru/troubleshooting/driver'
      },
      {
        text: 'Проверка объектов и автоматическое восстановление',
        link: '/ru/troubleshooting/healing'
      },
      {
        text: 'Отказ узла',
        link: '/ru/troubleshooting/node'
      }
    ]
  },
  {
    text: 'Системное администрирование',
    link: '/ru/administration/index',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Управление IAM',
        link: '/ru/administration/iam',
        items: [
          {
            text: 'Токен доступа',
            link: '/ru/administration/iam/access-token'
          }
        ]
      }
    ]
  },
  {
    text: 'Интеграция',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Конфигурация обратного прокси Nginx',
        link: '/ru/integration/nginx'
      },
      {
        text: 'Конфигурация режима виртуального хоста',
        link: '/ru/integration/virtual'
      },
      {
        text: 'Конфигурация TLS',
        link: '/ru/integration/tls-configured'
      }
    ]
  },
  {
    text: 'Разработчик',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'MCP',
        link: '/ru/developer/mcp'
      },
      {
        text: 'MinIO Client',
        link: '/ru/developer/mc'
      },
      {
        text: 'SDK',
        link: '/ru/developer/sdk/index',
        // collapsed: true,
        items: [
          {
            text: 'Java',
            link: '/ru/developer/sdk/java'
          },
          {
            text: 'Python',
            link: '/ru/developer/sdk/python'
          },
          {
            text: 'Rust',
            link: '/ru/developer/sdk/rust'
          },
          {
            text: 'JavaScript',
            link: '/ru/developer/sdk/javascript'
          },
          {
            text: 'TypeScript',
            link: '/ru/developer/sdk/typescript'
          },
          {
            text: 'Golang',
            link: '/ru/developer/sdk/go'
          },
          {
            text: 'Другие SDK',
            link: '/ru/developer/sdk/other'
          }
        ],
      },
      {
        text: 'API совместимости S3',
        link: '/ru/developer/api'
      },
      {
        text: 'Лицензия Open Source',
        link: '/ru/developer/license'
      }
    ]
  },
  {
    text: 'Возможности продукта',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Распределенный',
        link: '/ru/features/distributed/'
      },
      {
        text: 'Управление логами',
        link: '/ru/features/logging/'
      },
      {
        text: 'Контроль версий',
        link: '/ru/features/versioning/'
      },
      {
        text: 'Совместимость S3',
        link: '/ru/features/s3-compatibility/'
      },
      {
        text: 'Уровень объекта и только для чтения',
        link: '/ru/features/worm/'
      },
      {
        text: 'Кросс-региональная репликация',
        link: '/ru/features/replication/'
      },
      {
        text: 'Шифрование',
        link: '/ru/features/encryption/'
      },
      {
        text: 'Управление жизненным циклом',
        link: '/ru/features/lifecycle/'
      },
    ],
  },
  {
    text: 'Решения',
    // collapsed: true,
    home: true,
    items: [
      {
        text: 'Современное озеро данных',
        link: '/ru/features/data-lake/'
      },
      {
        text: 'ИИ и машинное обучение',
        link: '/ru/features/ai/'
      },
      {
        text: 'Cloud Native',
        link: '/ru/features/cloud-native/'
      },
      {
        text: 'Разделение вычислений и хранения больших данных',
        link: '/ru/features/hdfs/'
      },
      {
        text: 'Поддержка SQL',
        link: '/ru/features/sql-server/'
      },
      {
        text: 'Количественная торговля',
        link: '/ru/features/quantitative-trading/'
      },
      {
        text: 'Снижение затрат в производстве',
        link: '/ru/features/industry/'
      },
      {
        text: 'Холодное архивное хранилище',
        link: '/ru/features/cold-archiving/'
      },
      {
        text: 'Решение для хранения видео',
        link: '/ru/features/video/'
      },
      {
        text: 'Отечественное инновационное и SM решение',
        link: '/ru/features/domestic/'
      },
    ],
  },
]
