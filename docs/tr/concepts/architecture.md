---
title: "RustFS Mimarisi"
description: "RustFS mimarisi tanıtımı"
---

# RustFS Mimarisi

RustFS, iyi bilinen AWS S3'e benzer bir nesne depolama sistemidir. MinIO'nun alternatifi olarak RustFS, MinIO'nun sade, hafif, ölçeklenebilir ve zarif mimarisinden referans alır.

Nesneler belge, video, PDF dosyası vb. olabilir. Nesneleri depolamak için MinIO, verileri depolama, erişim ve yönetim için ölçeklenebilir, esnek ve verimli bir çözüm sunar. AWS S3 API ile uyumluluğu, AWS S3 tabanlı uygulamalarla sorunsuz entegrasyon sağlar.

Mimari diyagram aşağıdaki gibidir:


![RustFS Mimari Diyagramı](./images/s2-1.png)

Bu RustFS'nin temel mimarisidir, dağıtık ağ tek bir görevi gerçekleştirmek için birden fazla düğüm kullanan bir bilgisayar mimarisidir. Düğümler ağ üzerinden birbirine bağlanır, bu da birbirleriyle iletişim kurmalarını sağlar.



## Tutarlılık Tasarımı

Dağıtık ve tek makine modlarında, tüm okuma-yazma işlemleri kesinlikle read-after-write tutarlılık modelini takip eder.

## RustFS'de Birkaç Önemli Kavram

**Object (Nesne)**: RustFS'ye depolanan temel nesne, dosya, bayt akışı, herhangi bir şey gibi...

**Bucket (Kova)**: Object'leri depolamak için kullanılan mantıksal alan. Her Bucket arasındaki veriler birbirinden izole edilmiştir. İstemci için, dosyaları depolayan üst düzey klasör gibidir.

**Drive (Sürücü)**: Yani verileri depolayan disk, RustFS başlatıldığında parametre olarak geçilir. RustFS'deki tüm nesne verileri Drive'da depolanır.

**Set (Küme)**: Yani bir grup Drive'ın koleksiyonu, dağıtık dağıtım küme ölçeğine göre otomatik olarak bir veya birden fazla Set'e bölünür, her Set'teki Drive'lar farklı konumlarda dağıtılır. Bir nesne bir Set üzerinde depolanır. (Bazı yerlerde Set'lerin kombinasyonu **Strips**—şerit olarak da adlandırılır).

Bu nedenle, mimariyi tasarlarken ve cihazları dağıtmadan önce dikkat edilmesi gereken:

1. Bir nesne bir Set üzerinde depolanır;

2. Bir küme birden fazla Set'e bölünür;

3. Bir Set'in içerdiği Drive sayısı sabittir, varsayılan olarak sistem tarafından küme ölçeğine göre otomatik olarak hesaplanır;

4. Bir Set'teki Drive'lar mümkün olduğunca farklı düğümlerde dağıtılır;

## Özel Teşekkürler

Geleneksel dağıtık depolama mimarisinde bulunması gereken: Master düğümü, MetaData düğümü ve Data Node düğümü. Bu tür tasarım, kullanıcıların dağıtımını çok karmaşık hale getirir. Aynı zamanda, zengin dağıtık depolama yönetim deneyimi olmadan, meta veriler kaybolduğunda veriler kaybolma riski taşır.

Tüm düğümler eşit seviyeli düğümlerdir, mimari tasarımını büyük ölçüde basitleştirir ve meta veri kaybı konusunda endişelenmemize gerek kalmaz, tek komutla başlatılabilir.

Zarafet, basitlik, güvenilirlik kaybetmeden, RustFS MinIO ile aynı mimari tasarımı benimser.

Mimari konseptini önerdiği için MinIO'ya teşekkürler, dünya çapındaki kullanıcıları büyük ölçüde kolaylaştırdı ve S3 protokolünü yaygınlaştırdı.

