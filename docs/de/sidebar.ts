export const deSidebar = [
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
  }
]