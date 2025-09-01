---
title: Donanım Seçimi
description: RustFS çalıştırmak için hangi donanımları kullanabilirim
---

# Donanım Seçimi

> RustFS daha düşük bellek gereksinimleri ve daha stabil bellek dalgalanması sağlar.

## Test Ortamı Donanım Seçimi

> Test ortamı hızlı kullanım için, yüksek yük ve üretim garantisinden sorumlu olmasına gerek yoktur, sadece deneyim gereksinimlerini karşılaması yeterlidir.

| No | Donanım Türü | Parametre |
| - | - | - |
| 1 | CPU | 1 çekirdek+ |
| 2 | CPU Mimarisi | X86, ARM her ikisi de desteklenir |
| 3 | Bellek | 1 GB+ |
| 4 | Sabit Disk | HDD, SSD her ikisi de desteklenir |
| 5 | Docker Desteği | Desteklenir |
| 6 | Ağ Gereksinimleri | Yerel iletişim ve ağsız ortam her ikisi de desteklenir |
| 7 | İşletim Sistemi | Windows, Linux, MacOS her ikisi de desteklenir |
| 8 | Yük Dengeleyici | Yok |
| 9 | Minimum Düğüm | 1 |

## Üretim Ortamı Donanım Seçimi

| No | Donanım Türü | Parametre |
| - | - | - |
| 1 | CPU | 2 x 12 çekirdek+ |
| 2 | CPU Türü | X86, ARM gibi çoklu CPU mimarisi |
| 3 | Bellek | 64 GB+ |
| 4 | Sabit Disk | HDD, SSD her ikisi de desteklenir, SSD önerilir |
| 5 | Ağ Gereksinimleri | 10 Gbps+ |
| 6 | İşletim Sistemi | Linux öncelikli |
| 8 | Yük Dengeleyici | Yük dengeleyici kullanılması önerilir |
| 9 | Minimum Düğüm | 4 düğümden başlayarak |

## Uzman Hizmeti

Donanım ortamınızın gerçek üretim gereksinimlerini karşılayıp karşılamayacağından endişe duyuyorsanız veya depolama maliyet azaltma ihtiyacınız varsa.
RustFS ekibine soru sorabilir ve uzman danışmanlığı başlatabilirsiniz. İletişim: 400-033-5363.