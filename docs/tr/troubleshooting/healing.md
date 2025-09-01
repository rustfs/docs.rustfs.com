---
title: "Nesne Kontrol ve Otomatik Kurtarma"
description: "Bu makale RustFS'in tek sunucu çoklu disk mimarisinde nesne kendini onarma (self-healing) işlev tasarımı ve uygulamasını, kendini onarmanın anlamı, prensibi, süreci, yapılandırması ve yaygın arıza gidermesini tanıtır."
---

# Nesne Kontrol ve Otomatik Kurtarma

## RustFS Mimarisi ve Kendini Onarma Tasarımı

### Tek Sunucu Çoklu Disk Mimarisi

RustFS tek sunucu çoklu disk tasarımını benimser, birden çok diski bir mantıksal depolama havuzunda organize eder ve nesne depolama hizmeti sağlar. Her nesne yazılırken birden çok veri parçasına (shard) ve yedek parçalara bölünür ve güvenilirlik ve performansı artırmak için farklı disklere dağınık olarak yerleştirilir.

### Kendini Onarma Tasarım Prensipleri

1. **Veri Bütünlük Doğrulaması**: Checksum mekanizmasını birleştirerek nesne parça verilerinin okuma sırasında tutarlılığını sağlar, örneğin ZFS okuma sırasında her veri bloğunun checksum'ını doğrular ve doğrulama başarısız olduğunda onarım yapar.
2. **Parça Yedekliliği ve Silme Kodlaması**: Erasure coding yoluyla yedek parçalar oluşturur, bazı veri parçaları kaybolduğunda veya bozulduğunda yedek parçaları kullanarak orijinal nesneyi yeniden inşa edebilir.
3. **Çok Seviyeli Kendini Onarma Tetiklemesi**: Okuma sırasında çevrimiçi kendini onarma, arka plan tarama kendini onarma ve manuel tetikleme kendini onarma dahil olmak üzere performans ve veri güvenilirliğini dengeler.

## Nesne Kendini Onarma Prensibi

### Doğrulama ve Silme Kodlaması

RustFS nesne yazma aşamasında nesneyi *k* veri parçası ve *m* yedek parçaya böler, belirtilen silme kodlama parametrelerine göre *n=k+m* cihaza dağıtık olarak depolar. Okuma sırasında, parçaların bozuk veya kayıp olduğu tespit edilirse, diğer sağlam parçalardan yeniden inşa edilebilir.

### Veri Doğrulama ve Onarım (Scrub & Repair)

RustFS düzenli olarak depolama havuzunda hafif doğrulama (light scrub) ve derin doğrulama (deep scrub) yapar:
- **Hafif doğrulama** nesne metadata'sı ve parça boyutları karşılaştırılır, bozulma tespit edildiğinde zamanında işaretlenir.
- **Derin doğrulama** parça verilerini bit düzeyinde okur ve checksum'ını doğrular, gizli kötü blokları veya bit rot sorunlarını tespit edip onarabilir.

Veri taraması tutarsızlık tespit ettiğinde, RustFS otomatik olarak Repair sürecini çağırır, bozuk parçayı yedek parçalarla yeniden inşa eder ve onarılmış parçayı orijinal diske veya yedek diske geri yazar, bir sonraki erişimde verinin sağlam olmasını garanti eder.

## Kendini Onarma Süreci

### Okuma Sırasında Çevrimiçi Kendini Onarma

İstemci her `GET` veya `HEAD` isteği yaptığında, RustFS önce ilgili nesnenin tüm veri parçalarını kontrol eder:
1. Tüm veri parçaları sağlamsa, doğrudan veriyi döndürür.
2. Parça kayıp veya bozuksa, sistem yedek parçalara göre eksik parçayı hesaplar ve onarır, ardından istemciye tam nesneyi döndürür.
Bu mekanizma MinIO'nun okuma sırasında kendini onarma süreciyle aynıdır ve istemci isteklerini etkilemeden şeffaf bir şekilde veri onarabilir.

### Arka Plan Tarama Kendini Onarma

RustFS yerleşik nesne tarayıcısına sahiptir, hash yöntemiyle depolama havuzundaki nesnelerin 1/1024'ünü bütünlük kontrolü için dolaşır:
- Nesne tarayıcısı düzenli olarak (yapılandırılabilir sıklıkta) hafif doğrulama çalıştırır;
- Bozulma tespit edilirse, hemen kendini onarma yeniden inşa sürecini tetikler.
Varsayılan olarak kaynak yükünü azaltmak için derin bit rot kontrolü yapılmaz, ihtiyaç durumunda derin doğrulama işlevi açılabilir.

### Manuel Kendini Onarma Tetiklemesi

Yönetici komut satırı araçları ile tam kendini onarma yapabilir:

```bash
rc admin heal start --all
```
Bu işlem tüm depolama havuzunu tarar ve tüm nesnelerde tam doğrulama ve onarım yapar, kaynak tüketimi büyüktür, düşük yoğunluk dönemlerinde dikkatli kullanılmalıdır.

## Kullanım Örnekleri

```bash
# Mevcut kendini onarma durumunu görüntüle
rc admin heal status
# Belirtilen bucket'ın kendini onarmasını başlat
rc admin heal start --bucket photos
# Devam eden kendini onarma görevini durdur
rc admin heal stop
```

## Özet

RustFS'in nesne kendini onarma özelliği MinIO, Ceph ve ZFS gibi sistemlerin olgun tasarımlarını birleştirir, çok seviyeli tetikleme doğrulama ve onarım süreci yoluyla tek makine çoklu disk ve çok makine çoklu disk ortamlarında parça bozulması, disk arızası ve bit rot gibi sorunlara etkili bir şekilde karşı koyabilir, nesne depolamanın yüksek güvenilirlik ve yüksek kullanılabilirliğini garanti eder.