export const ruSidebar = [
  {
    text: 'Введение',
    collapsed: true,
    home: true,
    items: [
      { text: 'Обзор RustFS', link: '/ru/introduction' },
      { text: 'Состав архитектуры', link: '/ru/architecture' },
      { text: 'Сравнение с другими хранилищами', link: '/ru/comparison' },
      { text: 'Лицензия с открытым исходным кодом', link: '/ru/license' },
      {
        text: 'Основные концепции', items: [
          { text: 'Глоссарий', link: '/ru/concepts/glossary' },
          { text: 'Принцип кодирования стирания', link: '/ru/concepts/erasure-coding' },
          { text: 'Доступность и масштабируемость', link: '/ru/concepts/availability-and-resiliency' },
          { text: 'Проверка объектов и автоматическое восстановление', link: '/ru/concepts/object-healing' },
          { text: 'Сканирование объектов', link: '/ru/concepts/object-scanner' },
          { text: 'Ограничения использования', link: '/ru/concepts/limit' },
        ],
      },
    ],
  },
  {
    text: 'Поддержка архитектуры',
    collapsed: true,
    home: true,
    items: [
      { text: 'Железо и виртуализация', link: '/ru/features/baremetal/' },
      { text: 'Alibaba Cloud', link: '/ru/features/aliyun/' },
      { text: 'Tencent Cloud', link: '/ru/features/qcloud/' },
      { text: 'Huawei Cloud', link: '/ru/features/huaweicloud/' },
      { text: 'VMWare Tanzu', link: '/ru/features/tanzu/' },
      { text: 'Международные облачные провайдеры', link: '/ru/features/aws-elastic/' },
    ],
  },
  {
    text: 'Функции продукта',
    collapsed: true,
    home: true,
    items: [
      { text: 'Распределенный', link: '/ru/features/distributed/' },
      { text: 'Управление логами', link: '/ru/features/logging/' },
      { text: 'Контроль версий', link: '/ru/features/versioning/' },
      { text: 'Совместимость с S3', link: '/ru/features/s3-compatibility/' },
      { text: 'Уровень объектов и только чтение', link: '/ru/features/worm/' },
      { text: 'Межрегиональная репликация', link: '/ru/features/replication/' },
      { text: 'Шифрование', link: '/ru/features/encryption/' },
      { text: 'Управление жизненным циклом', link: '/ru/features/lifecycle/' },
    ],
  },
  {
    text: 'Решения',
    collapsed: true,
    home: true,
    items: [
      { text: 'Современное озеро данных', link: '/ru/features/data-lake/' },
      { text: 'ИИ и машинное обучение', link: '/ru/features/ai/' },
      { text: 'Облачно-нативный', link: '/ru/features/cloud-native/' },
      { text: 'Разделение вычислений и хранения больших данных', link: '/ru/features/hdfs/' },
      { text: 'Поддержка SQL', link: '/ru/features/sql-server/' },
      { text: 'Количественная торговля', link: '/ru/features/quantitative-trading/' },
      { text: 'Снижение производственных затрат', link: '/ru/features/industry/' },
      { text: 'Холодное архивное хранилище', link: '/ru/features/cold-archiving/' },
      { text: 'Решение для хранения видео', link: '/ru/features/video/' },
      { text: 'Национальная информатизация и SM решения', link: '/ru/features/domestic/' },
    ],
  },
  {
    text: 'Установка и развертывание',
    collapsed: true,
    home: true,
    items: [
      { text: 'Режим запуска', link: '/ru/installation/mode/' },
      { text: 'Выбор оборудования', link: '/ru/installation/hardware-selection' },
      {
        text: 'Проверки перед установкой',
        link: '/ru/installation/checklists',
        items: [
          { text: 'Контрольный список', link: '/ru/installation/checklists' },
          { text: 'Контрольный список оборудования', link: '/ru/installation/hard-checklists' },
          { text: 'Контрольный список программного обеспечения', link: '/ru/installation/software-checklists' },
          { text: 'Контрольный список сети', link: '/ru/installation/network-checklists' },
          { text: 'Контрольный список безопасности', link: '/ru/installation/security-checklists' },
        ]
      },
      {
        text: 'Руководство по установке',
        link: '/ru/installation/linux',
        items: [
          { text: 'Установка Linux', link: '/ru/installation/linux' },
          { text: 'Установка macOS', link: '/ru/installation/macos/' },
          { text: 'Установка Windows', link: '/ru/installation/windows/' },
          { text: 'Установка Docker', link: '/ru/installation/docker' },
        ]
      },
    ]
  },
    {
    text: 'Руководство по использованию функций',
    collapsed: true,
    home: true,
    items: [
      { text: 'MCP', link: '/ru/guide/mcp' },
    ]
  },
  {
    text: 'SDK и API',
    collapsed: true,
    home: true,
    items: [
      { text: 'Обзор SDK', link: '/ru/sdk/' },
      { text: 'Java SDK', link: '/ru/sdk/java' },
      { text: 'Python SDK', link: '/ru/sdk/python' },
      { text: 'JavaScript SDK', link: '/ru/sdk/js' },
      { text: 'Другие SDK', link: '/ru/sdk/other' },
    ]
  }
]