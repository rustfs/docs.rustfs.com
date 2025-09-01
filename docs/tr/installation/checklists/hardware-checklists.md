---
title: "Üretim Ortamı Donanım Yapılandırma Kılavuzu"
description: "RustFS Rust dili ile geliştirilen yüksek performanslı dağıtık nesne depolama sistemidir, büyük hacimli yapılandırılmamış veri depolama senaryolarına uygundur. Bu belge üretim ortamı dağıtımı için kapsamlı donanım seçimi ve yapılandırma rehberliği sağlar."
---

# Üretim Ortamı Donanım Yapılandırma Kılavuzu

## Bir. Dağıtım Planlama Faktör Analizi

RustFS'i resmi olarak dağıtmadan önce, 2-3 haftalık iş araştırması yapmanızı, aşağıdaki boyutları özellikle değerlendirmenizi öneririz:

1. **Veri Ölçek Analizi**
 - **Başlangıç Veri Miktarı**: Üretim başlangıcı dönemi efektif veri miktarını hassas olarak hesaplayın (TiB birimi önerilir), soğuk-sıcak veri oranını dikkate alın
 - **Büyüme Trendi Tahmini**: İş geliştirme planına göre, gelecek 24 ayın veri artışını tahmin edin (çeyreklik büyüme oranı modeli önerilir)
 - **Nesne Ölçeği**: Ortalama nesne boyutuna dayalı (128 KB-1 MB aralığı önerilir) toplam nesne sayısını hesaplayın, 1 milyar nesneden fazla olduğunda özel optimizasyon gerektiğini dikkate alın

2. **İş Özellik Değerlendirmesi**
 - **Erişim Modeli**: Okuma yoğun (içerik dağıtım gibi) ile yazma yoğun (log toplama gibi) senaryoları ayırt edin
 - **Uyumluluk Gereksinimleri**: Veri saklama döngüsü endüstri düzenleme gereksinimlerine uygun olmalı (finans endüstrisi en az 5 yıl saklamalı)
 - **Çok Siteli Dağıtım**: Bölgeler arası dağıtımda ağ gecikmesi (50ms içinde kontrol önerilir) ve bant genişliği maliyetini değerlendirin

3. **Depolama Mimarisi Tasarımı**
 - **Depolama Bucket Planlaması**: İş birimlerine göre depolama bucket'larını ayırın, tek küme 500 aktif bucket'ı geçmemesini öneririz
 - **Felaket Kurtarma Stratejisi**: Veri önemine göre çift aktif mimari (önerilen) veya asenkron replikasyon çözümü seçin

## İki. Donanım Yapılandırma Matrisi

Stres testi sonuçlarına dayalı baseline yapılandırma çözümleri:

| Bileşen | Temel Ortam | Üretim Standart Yapılandırması | Yüksek Performans Yapılandırması |
|--------------|---------------------------|--------------------------|--------------------------|
| Düğüm Sayısı | 4 düğüm | 8 düğüm | 16+ düğüm |
| Depolama Ortamı | 4× NVMe SSD | 8×NVMe SSD | 12×NVMe SSD |
| Ağ Mimarisi | Çift 25GbE (link toplama) | Çift 100GbE | 200GbE |
| CPU | 2×Intel Gümüş 4310 (16 çekirdek) | 2×AMD EPYC 7313 (32 çekirdek) | 2×Intel Platin 8461Y (48 çekirdek) |
| Bellek | 64 GB DDR4-3200 ECC | 256 GB DDR5-4800 ECC | 512 GB DDR5-5600 ECC |
| Depolama Kontrolörü | HBA 9500-8i | HBA 9600-16i | Çift kontrolör yedekli mimari |

**Önemli Dağıtım İlkeleri:**
1. "Sunucu çiftliği" modunu benimse, tüm düğümlerin tamamen aynı donanım partisi ve firmware sürümü kullandığından emin ol
2. Ağ mimarisi şunları karşılamalı: Leaf-spine topoloji + fiziksel izolasyon depolama ağı + çift uplink bağlantısı
3. 2U sunucu modelini kullanmanızı öneririz, tek düğüm 12 disk yuvası ve üzeri yapılandırma (gerçek sabit disk sayısına göre)

## Üç. Performans Kritik Yol Optimizasyonu

### 1. Ağ Topoloji Optimizasyonu (En Yüksek Öncelik)
- **Bant Genişliği Hesaplaması**: Her TB efektif veri için 0.5 Gbps bant genişliği rezerve edin (örneğin 100 TB veri için 50 Gbps özel bant genişliği gerekli)
- **Gecikme Gereksinimleri**:
 - Düğümler arası P99 gecikme ≤ 2ms
 - Çapraz raf gecikmesi ≤ 5ms

### 2. Depolama Alt Sistem Ayarlaması
- **Kontrolör Yapılandırması**:
 - Önceden okuma önbelleği etkinleştir (256 MB ve üzeri önerilen)
 - Tüm RAID işlevlerini devre dışı bırak, pass-through modu benimse
 - BBU pil sağlık durumunu düzenli kontrol et
- **SSD Parametreleri**:
 - %20 OP alanı rezerve et, dayanıklılığı artır
 - Atomik yazma özelliği etkinleştir (donanım desteği gerekli)

### 3. Bellek Yönetim Stratejisi
- **Tahsis Oranı**:
 - Metadata önbelleği: toplam belleğin %60'ı
 - Okuma-yazma arabelleği: %30
 - Sistem rezervi: %10

## Dört. Ağ Tasarım Referans Modeli

### Bant Genişliği ve Disk Oranı İlişkisi
| Ağ Türü | Teorik Throughput | Uygun Disk Türü | Maksimum Disk Destek Sayısı |
|------------|------------|---------------------|----------------|
| 10GbE | 1.25 GB/s | 7.2K HDD (180 MB/s) | 8 adet |
| 25GbE | 3.125 GB/s | SATA SSD (550 MB/s) | 6 adet |
| 100GbE | 12.5 GB/s | NVMe Gen4 (7 GB/s) | 2 adet tam hız okuma-yazma |

**En İyi Uygulama Örneği**: Bir video platformu 16 düğümlü küme kullanıyor, her düğüm yapılandırması:
- 8×7.68 TB NVMe SSD
- Çift 100GbE CX5 ağ kartı
- Toplam throughput 38 GB/s gerçekleştirildi

## Beş. Bellek Yapılandırma Hesaplayıcısı

Disk kapasitesi ve iş özelliklerine dayalı dinamik algoritma:

```python
# Bellek hesaplama formülü (birim: GB)
def calc_memory(data_tb, access_pattern):
 base = 32 # Temel bellek
 if access_pattern == "read_heavy":
 return base + data_tb * 0.8
 elif access_pattern == "write_heavy":
 return base + data_tb * 1.2
 else: # mixed
 return base + data_tb * 1.0
```

**Referans Yapılandırma Tablosu**:
| Veri Ölçeği | Okuma Yoğun | Yazma Yoğun | Karma Tip |
|-----------|----------|----------|---------|
| 10 TB | 40 GB | 44 GB | 42 GB |
| 100 TB | 112 GB | 152 GB | 132 GB |
| 500 TB | 432 GB | 632 GB | 532 GB |

## Altı. Depolama Dağıtım Standartları

### 1. Ortam Seçim Standartları
| Gösterge | HDD Uygun Senaryo | SSD Uygun Senaryo | NVMe Zorunlu Gereksinim Senaryosu |
|-------------|------------------|---------------------|----------------------|
| Gecikme Gereksinimi | >50ms | 1-10ms | 1ms'den az |
| Throughput Gereksinimi | < 500 MB/s | 500 MB-3 GB/s | > 3 GB/s |
| Tipik Kullanım | Arşiv depolama | Sıcak veri önbelleği | Gerçek zamanlı analiz |

### 2. Dosya Sistemi Yapılandırması
```bash
# XFS formatlama örneği
mkfs.xfs -f -L rustfs_disk1 -d su=256k,sw=10 /dev/sdb

# Önerilen mount parametreleri
UUID=xxxx /mnt/disk1 xfs defaults,noatime,nodiratime,logbsize=256k 0 0
```

## Yedi. Yüksek Kullanılabilirlik Garanti Önlemleri

1. **Güç Kaynağı**:
 - 2 yollu güç mimarisi benimse
 - Her PDU farklı trafo merkezine bağla
 - UPS donanımı (en az 30 dakika süre)

2. **Soğutma Gereksinimleri**:
 - Kabinet güç yoğunluğu ≤ 15kW/kabinet
 - Giriş-çıkış hava sıcaklık farkını 8℃ içinde kontrol et

3. **Firmware Yönetimi**:
 - Donanım uyumluluk matrisi kur
 - Birleşik firmware sürümü kullan

> **Uygulama Önerisi**: Resmi dağıtım öncesi 72 saatlik stres testi yapmanızı, aşağıdaki senaryoları simüle etmenizi öneririz:
> 1. Düğüm arıza geçiş testi
> 2. Ağ bölümleme tatbikatı
> 3. Ani yazma basıncı testi (teorik değerin %120'sine ulaşması önerilir)

---

Bu kılavuz RustFS'in en yeni geliştirme sürümüne dayalı yazılmıştır, gerçek dağıtım sırasında spesifik donanım tedarikçi teknik dökümanları ile birleştirerek parametre ince ayarı yapın. Veya RustFS resmi ile iletişime geçin, çeyreklik donanım sağlık değerlendirmesi yapmanızı, depolama kümesinin sürekli kararlı çalışmasını sağlamanızı öneririz.