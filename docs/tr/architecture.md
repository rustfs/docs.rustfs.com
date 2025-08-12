---
title: "RustFS Mimarisi"
description: "RustFS Mimarisine Giriş"
---

# RustFS Mimarisi

RustFS, bilinen AWS S3'e benzer bir nesne depolama sistemidir. MinIO'nun yerine geçen bir çözüm olarak RustFS, MinIO'nun basit, hafif, ölçeklenebilir ve zarif mimarisini referans almaktadır.

Nesneler; dokümanlar, videolar, PDF dosyaları vb. olabilir. Nesneleri depolamak için MinIO, verileri saklamak, erişmek ve yönetmek için ölçeklenebilir, esnek ve verimli bir çözüm sunar. AWS S3 API'si ile uyumluluğu, AWS S3 tabanlı uygulamalarla sorunsuz entegrasyon sağlar.

Mimari diyagramı aşağıdaki gibidir:

![RustFS Mimari Diyagramı](./images/s2-1.png)

Bu, RustFS'nin temel mimarisidir. Dağıtık bir grid, tek bir görevi gerçekleştirmek için birden fazla düğüm kullanan bir bilgisayar mimarisidir. Düğümler birbirleriyle ağ üzerinden bağlantılıdır ve bu sayede birbirleriyle iletişim kurabilirler.

## Tutarlılık Tasarımı

Hem dağıtık hem de tek makine modlarında, tüm okuma ve yazma işlemleri kesinlikle "yazma sonrası okuma" tutarlılık modelini takip eder.

## RustFS'deki Önemli Kavramlar

**Nesne**: RustFS'da depolanan temel birimler; dosyalar, byte akışları, herhangi bir şey...

**Bucket**: Nesneleri depolamak için kullanılan mantıksal alan. Her Bucket arasındaki veriler birbirinden izoledir. İstemciler için dosya saklamak üzere kullanılan üst seviye bir klasör gibidir.

**Drive**: Verilerin depolandığı diskler, RustFS başlatılırken parametre olarak iletilir. RustFS'daki tüm nesne verileri Drive'larda saklanır.

**Set**: Drive'ların bir koleksiyonudur. Dağıtık dağıtım, küme ölçeğine göre otomatik olarak bir veya daha fazla Set'e bölünür ve her Set'teki Drive'lar farklı konumlarda dağıtılır. Bir nesne bir Set üzerinde depolanır. (Bazı kaynaklarda Set'lerin kombinasyonuna **Şeritler** de denir).

Bu nedenle, mimari tasarım ve ekipman dağıtımında şunlara dikkat edilmelidir:

1. Bir nesne bir Set üzerinde depolanır;

2. Bir küme birden fazla Set'e bölünür;

3. Bir Set içindeki Drive sayısı sabittir, varsayılan olarak sistem tarafından küme ölçeğine göre otomatik hesaplanır;

4. Bir Set içindeki Drive'lar mümkün olduğunca farklı düğümlere dağıtılır;

## Özel Teşekkürler

Geleneksel dağıtık depolama mimarilerinde şunlar zorunludur: Master düğümler, MetaVeri düğümleri ve Veri Düğümleri. Bu tasarım, kullanıcı dağıtımını oldukça karmaşık hale getirir. Aynı zamanda, zengin dağıtık depolama yönetim deneyimi olmadan, metadata kaybolduğunda veri kaybı riski oluşur.

Tüm düğümler aynı hiyerarşik seviyededir, bu da mimari tasarımı büyük ölçüde basitleştirir ve metadata kaybı endişelerini ortadan kaldırır, tek bir komutla başlatmaya olanak tanır.

Zarafetini, basitliğini ve güvenilirliğini kaybetmeden, RustFS MinIO ile aynı mimari tasarımı benimsemiştir.

Bu mimari konsepti önerdiği için MinIO'ya teşekkürler, bu dünya çapındaki kullanıcıları büyük ölçüde kolaylaştırmış ve S3 protokolünün yaygınlaşmasına katkıda bulunmuştur.