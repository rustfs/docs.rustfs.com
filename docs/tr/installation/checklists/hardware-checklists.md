---
title: "Üretim Ortamı Donanım Yapılandırma Rehberi"
description: "RustFS, Rust dili ile geliştirilmiş yüksek performanslı dağıtık nesne depolama sistemidir, büyük miktarda yapılandırılmamış veri depolama senaryoları için uygundur. Bu doküman, üretim ortamı dağıtımı için kapsamlı donanım seçimi ve yapılandırma rehberi sağlar."
---

# Üretim Ortamı Donanım Yapılandırma Rehberi

## Bir、Dağıtım Planlama Faktörleri Analizi

RustFS'i resmi olarak dağıtmadan önce, 2-3 haftalık iş araştırması yapmanız önerilir, aşağıdaki boyutları değerlendirin:

1. **Veri Ölçeği Analizi**

- **Başlangıç veri miktarı**: Üretim başlangıcındaki etkili veri miktarını kesin olarak hesaplayın (TiB cinsinden önerilir), sıcak/soğuk veri oranını dikkate alın
- **Büyüme trendi tahmini**: İş gelişim planına göre, gelecek 24 ay için veri artışını tahmin edin (çeyreklik büyüme oranı modeli önerilir)
- **Nesne ölçeği**: Ortalama nesne boyutuna dayalı olarak (128 KB-1 MB aralığı önerilir) toplam nesne sayısını hesaplayın, 100 milyon nesneyi aştığında özel optimizasyon gerekir

2. **İş Özellikleri Değerlendirmesi**

- **Erişim modu**: Okuma yoğun (içerik dağıtımı gibi) ile yazma yoğun (günlük toplama gibi) senaryoları ayırt edin
- **Uyumluluk gereksinimleri**: Veri saklama süresi sektör düzenleyici gereksinimlerini karşılamalıdır (finans sektörü en az 5 yıl saklamalı)
- **Çok siteli dağıtım**: Coğrafi olarak dağıtık dağıtımda ağ gecikmesini değerlendirin (50ms içinde kontrol edilmesi önerilir) ve bant genişliği maliyeti

3. **Depolama Mimarisi Tasarımı**

- **Depolama kovası planlaması**: İş birimlerine göre depolama kovalarını bölün, tek küme için 500'den fazla aktif depolama kovası önerilmez
- **Felaket kurtarma stratejisi**: Veri önemine göre çift aktif mimari (önerilen) veya asenkron çoğaltma çözümü seçin

## İki、Donanım Yapılandırma Matrisi

Stres testi sonuçlarına dayalı temel yapılandırma çözümü:

| Bileşen | Temel Ortam | Üretim Standart Yapılandırması | Yüksek Performans Yapılandırması |
|--------------|---------------------------|--------------------------|--------------------------|
| Düğüm sayısı | 4 düğüm | 8 düğüm | 16+ düğüm |
| Depolama ortamı | 4× NVMe SSD | 8×NVMe SSD | 12×NVMe SSD |
| Ağ mimarisi | Çift 25GbE (bağlantı toplama) | Çift 100GbE | 200GbE |
| CPU | 2×Intel Gümüş 4310 (16 çekirdek) | 2×AMD EPYC 7313 (32 çekirdek) | 2×Intel Platin 8461Y (48 çekirdek) |
| Bellek | 64 GB DDR4-3200 ECC | 256 GB DDR5-4800 ECC | 512 GB DDR5-5600 ECC |
| Depolama kontrolcüsü | HBA 9500-8i | HBA 9600-16i | Çift kontrolcü yedekli mimari |

**Önemli dağıtım prensipleri:**

1. "Sunucu çiftliği" modunu benimseyin, tüm düğümlerin tamamen aynı donanım parti ve firmware sürümünü kullandığından emin olun
2. Ağ mimarisi şunları karşılamalıdır: Yaprak-omurga topoloji + fiziksel izole depolama ağı + çift yukarı bağlantı
3. 2U sunucu modelini kullanmanız önerilir, tek düğüm için 12 disk yuvasından fazla yapılandırmanız önerilir (gerçek sabit disk sayısına göre)

## Üç、Performans Kritik Yol Optimizasyonu

### 1. Ağ Topoloji Optimizasyonu (En Yüksek Öncelik)

- **Bant genişliği hesaplaması**: Her TB etkili veri için 0.5 Gbps bant genişliği ayrılmalıdır (örneğin 100 TB veri için 50 Gbps özel bant genişliği gerekir)
- **Gecikme gereksinimleri**:
- Düğümler arası P99 gecikme ≤ 2ms
- Raf genelinde gecikme ≤ 5ms

### 2. Depolama Alt Sistemi Ayarlama

- **Kontrolcü yapılandırması**:
- Ön okuma önbelleğini etkinleştirin (256 MB üzeri önerilir)
- Tüm RAID işlevlerini devre dışı bırakın, doğrudan geçiş modunu kullanın
- BBU pil sağlık durumunu düzenli olarak kontrol edin
- **SSD parametreleri**:
- Dayanıklılığı artırmak için %20 OP alanı ayırın
- Atomik yazma özelliğini etkinleştirin (donanım desteği gerekir)

### 3. Bellek Yönetimi Stratejisi

- **Ayırma oranı**:
- Meta veri önbelleği: Toplam belleğin %60'ı
- Okuma/yazma tamponu: %30
- Sistem rezervi: %10

## Dört、Ağ Tasarım Referans Modeli

### Bant Genişliği ile Disk Oranı İlişkisi

| Ağ Türü | Teorik Verim | Uygun Disk Türü | Maksimum Disk Desteği |
|------------|------------|---------------------|----------------|
| 10GbE | 1.25 GB/s | 7.2K HDD (180 MB/s) | 8 adet |
| 25GbE | 3.125 GB/s | SATA SSD (550 MB/s) | 6 adet |
| 100GbE | 12.5 GB/s | NVMe Gen4 (7 GB/s) | 2 adet tam hız okuma/yazma |

**En iyi uygulama örneği**: Belirli bir video platformu 16 düğümlü küme kullanır, her düğüm yapılandırması:

- 8×7.68 TB NVMe SSD
- Çift 100GbE CX5 ağ kartı
- 38 GB/s toplam verim elde edilir

## Beş、Bellek Yapılandırma Hesaplayıcısı

Disk kapasitesi ve iş özelliklerine dayalı dinamik algoritma:

```python
# Bellek hesaplama formülü (birim: GB)
def calc_memory(data_tb, access_pattern):
 base = 32 # Temel bellek
 if access_pattern == "read_heavy":
 return base + data_tb * 0.8
 elif access_pattern == "write_heavy":
 return base + data_tb * 1.2
 else: # karışık
 return base + data_tb * 1.0
```

**Referans yapılandırma tablosu**:

| Veri Ölçeği | Okuma Yoğun | Yazma Yoğun | Karışık |
|-----------|----------|----------|---------|
| 10 TB | 40 GB | 44 GB | 42 GB |
| 100 TB | 112 GB | 152 GB | 132 GB |
| 500 TB | 432 GB | 632 GB | 532 GB |

## Altı、Depolama Dağıtım Standartları

### 1. Ortam Seçim Kriterleri

| Gösterge | HDD Uygun Senaryo | SSD Uygun Senaryo | NVMe Zorunlu Gereksinim Senaryosu |
|-------------|------------------|---------------------|----------------------|
| Gecikme gereksinimi | >50ms | 1-10ms | 1ms'den az |
| Verim gereksinimi | < 500 MB/s | 500 MB-3 GB/s | > 3 GB/s |
| Tipik kullanım | Arşiv depolama | Sıcak veri önbelleği | Gerçek zamanlı analiz |

### 2. Dosya Sistemi Yapılandırması

```bash
# XFS formatlama örneği
mkfs.xfs -f -L rustfs_disk1 -d su=256k,sw=10 /dev/sdb

# Önerilen bağlama parametreleri
UUID=xxxx /mnt/disk1 xfs defaults,noatime,nodiratime,logbsize=256k 0 0
```

## Yedi、Yüksek Kullanılabilirlik Garanti Önlemleri

1. **Güç tedariki**:

- Çift güç tedarik mimarisi benimseyin
- Her PDU farklı trafo merkezine bağlanmalı
- UPS donatın (en az 30 dakika dayanıklılık)

2. **Soğutma gereksinimleri**:

- Raf güç yoğunluğu ≤ 15kW/raf
- Giriş/çıkış hava sıcaklık farkını 8℃ içinde kontrol edin

3. **Firmware yönetimi**:

- Donanım uyumluluk matrisi oluşturun
- Birleşik firmware sürümü kullanın

> **Uygulama önerisi**: Resmi dağıtımdan önce 72 saatlik stres testi yapmanız önerilir, aşağıdaki senaryoları simüle edin:
>
> 1. Düğüm hata toleransı testi
> 2. Ağ bölümleme tatbikatı
> 3. Ani yazma stres testi (teorik değerin %120'sine ulaşması önerilir)

---

Bu rehber RustFS'in en son geliştirme sürümüne dayalı olarak yazılmıştır, gerçek dağıtımda lütfen belirli donanım tedarikçisi beyaz kitabı ile birleştirerek parametreleri ince ayarlayın. Veya RustFS resmi ile iletişime geçin, donanım sağlık değerlendirmesinin çeyreklik olarak yapılması önerilir, depolama kümesinin sürekli kararlı çalışmasını sağlamak için.
