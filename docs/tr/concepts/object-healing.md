---
title: "Nesne İnceleme ve Otomatik Kurtarma"
description: "Bu belge, RustFS'nin tek sunuculu çok diskli mimarideki kendi kendini iyileştirme işlevselliği tasarımını ve uygulamasını tanıtır. Kendi kendini iyileştirmenin önemi, ilkeleri, süreçleri, yapılandırması ve yaygın sorun giderme yöntemlerini içerir."
---
# Nesne İnceleme ve Otomatik Kurtarma

## Genel Bakış

RustFS, depolama sistemleri boyunca veri bütünlüğünü ve kullanılabilirliğini sağlamak için güçlü nesne kendi kendini iyileştirme yetenekleri sunar.

## RustFS Mimari ve Kendi Kendini İyileştirme Tasarımı

### Tek Sunuculu Çok Diskli Mimari

RustFS, tek sunuculu çok diskli bir tasarım benimser ve birden fazla diski mantıksal bir depolama havuzuna organize ederek nesne depolama hizmetleri sunar. Her nesne yazma sırasında birden fazla veri parçasına ve yedek parçasına bölünür ve farklı diskler arasında dağıtılır, böylece güvenilirlik ve performans artırılır.

### Kendi Kendini İyileştirme Tasarım İlkeleri

1. **Veri Bütünlüğü Doğrulama**: Sağlama toplamı mekanizmalarını birleştirerek okuma sırasında nesne parça veri tutarlılığını sağlar. Örneğin, ZFS, okuma sırasında her veri bloğunun sağlama toplamını doğrular ve doğrulama başarısız olduğunda onarımlar yapar.

2. **Parça Yedekliliği ve Silme**: Silme kodlaması aracılığıyla yedek parçalar oluşturur. Bazı veri parçaları kaybolduğunda veya bozulduğunda, orijinal nesne yedek parçalar kullanılarak yeniden oluşturulabilir.

3. **Çok Seviyeli Kendi Kendini İyileştirme Tetikleyicileri**: Okuma sırasında çevrimiçi iyileştirme, arka plan tarama iyileştirmesi ve elle tetiklenen iyileştirmeyi içerir, böylece performans ve veri güvenilirliği dengelenir.

## Nesne Kendi Kendini İyileştirme İlkeleri

### Doğrulama ve Silme

Nesne yazma sırasında, RustFS nesneyi belirtilen silme parametrelerine göre *k* veri parçasına ve *m* yedek parçasına böler ve *n=k+m* cihaz arasında dağıtır. Okuma sırasında, parçaların hasarlı veya eksik olduğu tespit edilirse, diğer sağlam parçalardan yeniden oluşturulabilir.

### Veri Doğrulama ve Onarım (Scrub & Repair)

RustFS, depolama havuzlarında periyodik olarak hafif ve derin tarama işlemleri gerçekleştirir:

- **Hafif Tarama**: Nesne meta verilerini ve parça boyutlarını karşılaştırır, hasar tespit edildiğinde hemen işaretler.

- **Derin Tarama**: Parça verilerini bit bit okur ve sağlama toplamlarını doğrular, gizli kötü blokları veya bit çürümesini tespit eder ve onarır.

Veri taraması tutarsızlıklar tespit ettiğinde, RustFS otomatik olarak Onarım sürecini çağırır, hasarlı parçaları yedek parçalar kullanarak yeniden oluşturur ve onarılmış parçaları orijinal diske veya yedek diske yazar, böylece sonraki erişimler için veri bütünlüğünü sağlar.

## Kendi Kendini İyileştirme İş Akışı

### Çevrimiçi Okuma Sırasında İyileştirme

Bir istemci her `GET` veya `HEAD` isteği gerçekleştirdiğinde, RustFS önce ilgili nesnenin tüm veri parçalarını kontrol eder:

1. Eğer tüm veri parçaları sağlam ise, veriyi doğrudan döndürür.

2. Eğer parçalar eksik veya hasarlı ise, sistem yedek parçalara dayanarak eksik parçaları hesaplar, onarır ve ardından tamamlanmış nesneyi istemciye döndürür.

Bu mekanizma, MinIO'nun okuma zamanı iyileştirme süreciyle tutarlıdır ve istemci isteklerini etkilemeden veriyi şeffaf bir şekilde onarır.

### Arka Plan Tarama İyileştirmesi

RustFS, bir hash yöntemi kullanarak depolama havuzundaki nesnelerin 1/1024'ünü taramak için yerleşik bir nesne tarayıcıya sahiptir:

- Nesne tarayıcı, düzenli (yapılandırılabilir) aralıklarla hafif doğrulama gerçekleştirir.

- Eğer hasar tespit edilirse, hemen kendi kendini iyileştirme yeniden oluşturma sürecini tetikler.

Varsayılan olarak, derin bit çürümesi kontrolü kaynak yükünü azaltmak için gerçekleştirilmez, ancak gerektiğinde derin doğrulama işlevselliği etkinleştirilebilir.

### Elle Tetiklenen İyileştirme

Yöneticiler, komut satırı araçları aracılığıyla tam iyileştirme gerçekleştirebilir:

```bash
rc admin heal start --all
```

Bu işlem, tüm depolama havuzunu tarar ve tüm nesneler üzerinde tam doğrulama ve onarım gerçekleştirir. Bu işlem önemli kaynak tüketir ve düşük trafik dönemlerinde dikkatli kullanılmalıdır.

## Kullanım Örnekleri

```bash
# Mevcut iyileştirme durumunu görüntüle
rc admin heal status

# Belirli bir kovası için iyileştirmeyi başlat
rc admin heal start --bucket photos

# Devam eden iyileştirme görevlerini durdur
rc admin heal stop
```

## Özet

RustFS'nin nesne kendi kendini iyileştirmesi, MinIO, Ceph ve ZFS gibi sistemlerin olgun tasarımlarını birleştirir. Çok seviyeli tetiklenmiş doğrulama ve onarım süreçleri aracılığıyla, tek makineli çok diskli ve çok makineli çok diskli ortamlarda parça hasarlarını, disk arızalarını ve bit çürümesini etkili bir şekilde ele alır ve nesne depolamanın yüksek güvenilirliğini ve yüksek kullanılabilirliğini sağlar.