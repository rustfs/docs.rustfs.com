---
title: Donanım Seçimi
description: RustFS'yi çalıştırmak için hangi donanımı kullanabilirim?
---

# Donanım Seçimi

> RustFS daha düşük bellek gereksinimlerine sahiptir ve bellek dalgalanmaları daha stabildir.

## Test Ortamı Donanım Seçimi

> Test ortamı hızlı bir şekilde kullanılabilir, yüksek yük ve üretim garantisi sağlamak zorunda değildir, yalnızca deneysel gereksinimleri karşılaması yeterlidir.

| No. | Donanım Türü | Parametreler |
| - | - | - |
| 1 | İşlemci | 1 Çekirdek+ |
| 2 | İşlemci Mimarisi | X86, ARM desteklenir |
| 3 | Bellek | 1 GB+ |
| 4 | Sabit Disk | HDD, SSD desteklenir |
| 5 | Docker Desteği | Desteklenir |
| 6 | Ağ Gereksinimleri | Yerel iletişim ve ağ bağlantısı olmadan çalışabilir |
| 7 | İşletim Sistemi | Windows, Linux, MacOS desteklenir |
| 8 | Yük Dengeleyici | Gerekli değil |
| 9 | Minimum Düğüm Sayısı | 1 |

## Üretim Ortamı Donanım Seçimi

| No. | Donanım Türü | Parametreler |
| - | - | - |
| 1 | İşlemci | 2 x 12 Çekirdek+ |
| 2 | İşlemci Türü | X86, ARM dahil çoklu işlemci mimarileri |
| 3 | Bellek | 64 GB+ |
| 4 | Sabit Disk | HDD, SSD desteklenir, SSD önerilir |
| 5 | Ağ Gereksinimleri | 10 Gbps+ |
| 6 | İşletim Sistemi | Linux tercih edilir |
| 8 | Yük Dengeleyici | Yük dengeleyici önerilir |
| 9 | Minimum Düğüm Sayısı | En az 4 düğüm |

## Uzman Hizmetleri

Donanım ortamınızın gerçek üretim gereksinimlerini karşılayıp karşılamayacağı konusunda endişeleriniz varsa veya depolama maliyetlerini düşürme ihtiyaçlarınız varsa, RustFS ekibine sorular sorabilir ve uzman danışmanlık talep edebilirsiniz. İletişim: 400-033-5363.