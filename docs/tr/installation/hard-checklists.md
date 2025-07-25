---
title: "Üretim Ortamı Donanım Yapılandırma Rehberi"
description: "RustFS, Rust ile geliştirilmiş yüksek performanslı dağıtılmış bir nesne depolama sistemidir ve büyük ölçekli yapılandırılmamış veri depolama senaryoları için uygundur. Bu belge, üretim ortamı dağıtımı için kapsamlı donanım seçim ve yapılandırma rehberi sağlar."
---

# Üretim Ortamı Donanım Yapılandırma Rehberi

## 1. Dağıtım Planlama Faktör Analizi

RustFS'ı resmi olarak dağıtmadan önce, aşağıdaki boyutları değerlendirmek üzere 2-3 haftalık bir iş araştırması yapılması önerilir:

1. **Veri Ölçeği Analizi**

- **Başlangıç Veri Hacmi**: İlk üretimdeki etkin veri hacmini doğru ölçün (TiB birimi önerilir), sıcak ve soğuk veri oranlarını dikkate alın
- **Büyüme Eğilimi Tahmini**: İş geliştirme planlarına dayanarak önümüzdeki 24 ay için veri büyümesini tahmin edin (üç aylık büyüme oranı modeli önerilir)
- **Nesne Ölçeği**: Ortalama nesne boyutuna göre toplam nesde sayısını hesaplayın (128 KB-1 MB aralığı önerilir), 100 milyondan fazla nesne için özel optimizasyon gerektiğini unutmayın

2. **İş Özellikleri Değerlendirmesi**

- **Erişim Modelleri**: Okuma yoğun (ör. içerik dağıtımı) ve yazma yoğun (ör. log toplama) senaryoları ayırt edin
- **Uyumluluk Gereksinimleri**: Veri saklama süreleri sektör düzenlemelerine uymalıdır (ör. finans sektörü minimum 5 yıl)
- **Çoklu Bölge Dağıtımı**: Bölgeler arası dağıtım için ağ gecikmesini (50ms altı önerilir) ve bant genişliği maliyetlerini değerlendirin

3. **Depolama Mimarisi Tasarımı**

- **Bucket Planlaması**: Bucket'ları iş birimlerine göre bölün, küme başına 500'den fazla aktif bucket önerilmez
- **Afet Kurtarma Stratejisi**: Veri önemine göre aktif-aktif mimari (önerilir) veya asenkron çoğaltma seçin

## 2. Donanım Yapılandırma Matrisi

Stres test sonuçlarına dayalı temel yapılandırma çözümleri:

| Bileşen | Temel Ortam | Üretim Standart Yapılandırma | Yüksek Performans Yapılandırması |
|--------------|---------------------------|--------------------------|--------------------------|
| Düğüm Sayısı | 4 düğüm | 8 düğüm | 16+ düğüm |
| Depolama Ortamı | 4× NVMe SSD | 8×NVMe SSD | 12×NVMe SSD |
| Ağ Mimarisi | Çift 25GbE (bağlantı toplama) | Çift 100GbE | 200GbE |
| CPU | 2×Intel Silver 4310 (16 çekirdek) | 2×AMD EPYC 7313 (32 çekirdek) | 2×Intel Platinum 8461Y (48 çekirdek) |
| Bellek | 64 GB DDR4-3200 ECC | 256 GB DDR5-4800 ECC | 512 GB DDR5-5600 ECC |
| Depolama Denetleyici | HBA 9500-8i | HBA 9600-16i | Çift denetleyici yedekli mimari |

**Önemli Dağıtım İlkeleri:**

1. "Sunucu çiftliği" modunu kullanın, tüm düğümlerin aynı donanım partisi ve firmware sürümlerini kullandığından emin olun
2. Ağ mimarisi şunları karşılamalıdır: leaf-spine topoloji + fiziksel olarak izole edilmiş depolama ağı + çift uplink bağlantı
3. 2U sunucu modellerini kullanmanız önerilir, tek düğümde 12+ disk yuvası olmalıdır (gerçek disk sayısına göre)

## 3. Performans Kritik Yol Optimizasyonu

### 1. Ağ Topolojisi Optimizasyonu (En Yüksek Öncelik)

- **Bant Genişliği Hesaplama**: Her TB etkin veri için 0.5 Gbps bant genişliği ayırın (ör. 100 TB veri için 50 Gbps özel bant genişliği gerekir)
- **Gecikme Gereksinimleri**:
- Düğümler arası P99 gecikme ≤ 2ms
- Raf ötesi gecikme ≤ 5ms

### 2. Depolama Alt Sistemi Ayarları

- **Denetleyici Yapılandırması**:
- Ön okuma önbelleğini etkinleştirin (256 MB+ önerilir)
- Tüm RAID işlevlerini devre dışı bırakın, passthrough modunu kullanın
- BBU pil durumunu düzenli olarak kontrol edin
- **SSD Parametreleri**:
- Dayanıklılığı artırmak için %20 OP alanı ayırın
- Atomik yazma özelliklerini etkinleştirin (donanım desteği gerektirir)

### 3. Bellek Yönetimi Stratejisi

- **Ayırma Oranı**:
- Meta veri önbelleği: Toplam belleğin %60'ı
- Okuma/yazma tamponları: %30
- Sistem ayrılmış: %10

## 4. Ağ Tasarım Referans Modeli

### Disk Başına Bant Genişliği Oranı İlişkisi

| Ağ Türü | Teorik Verim | Uygun Disk Türü | Maksimum Desteklenen Disk Sayısı |
|------------|------------|---------------------|----------------|
| 10GbE | 1.25 GB/sn | 7.2K HDD (180 MB/sn) | 8 disk |
| 25GbE | 3.125 GB/sn | SATA SSD (550 MB/sn) | 6 disk |
| 100GbE | 12.5 GB/sn | NVMe Gen4 (7 GB/sn) | 2 disk tam hızda okuma/yazma |

**En İyi Uygulama Örneği**: Bir video platformu 16 düğümlü küme kullanıyor, her düğüm şu şekilde yapılandırılmış:

- 8×7.68 TB NVMe SSD
- Çift 100GbE CX5 ağ kartı
- 38 GB/sn toplam verim elde ediliyor

## 5. Bellek Yapılandırma Hesaplayıcısı

Disk kapasitesi ve iş özelliklerine dayalı dinamik algoritma:

```python
# Bellek hesaplama formülü (birim: GB)
def calc_memory(data_tb, access_pattern):
 base = 32 # Temel bellek
 if access_pattern == "read_heavy":
 return base + data_tb * 0.8
 elif access_pattern == "write_heavy":
 return base + data_tb * 1.2
 else: # karma
 return base + data_tb * 1.0
```

**Referans Yapılandırma Tablosu**:

| Veri Ölçeği | Okuma Yoğun | Yazma Yoğun | Karma |
|-----------|----------|----------|---------|
| 10 TB | 40 GB | 44 GB | 42 GB |
| 100 TB | 112 GB | 152 GB | 132 GB |
| 500 TB | 432 GB | 632 GB | 532 GB |

## 6. Depolama Dağıtım Spesifikasyonları

### 1. Ortam Seçim Standartları

| Metrik | HDD Uygun Senaryolar | SSD Uygun Senaryolar | NVMe Zorunlu Senaryolar |
|-------------|------------------|---------------------|----------------------|
| Gecikme Gereksinimleri | >50ms | 1-10ms | <1ms |
| Verim Gereksinimleri | <500 MB/sn | 500 MB-3 GB/sn | >3 GB/sn |
| Tipik Kullanım Örnekleri | Arşiv depolama | Sıcak veri önbelleği | Gerçek zamanlı analitik |

### 2. Dosya Sistemi Yapılandırması

```bash
# XFS biçimlendirme örneği
mkfs.xfs -f -L rustfs_disk1 -d su=256k,sw=10 /dev/sdb

# Önerilen bağlama parametreleri
UUID=xxxx /mnt/disk1 xfs defaults,noatime,nodiratime,logbsize=256k 0 0
```

## 7. Yüksek Kullanılabilirlik Güvence Önlemleri

1. **Güç Kaynağı**:

- Çift güç kaynağı mimarisi kullanın
- Her PDU farklı trafo merkezlerine bağlanmalı
- UPS ile donatın (minimum 30 dakika yedek)

2. **Soğutma Gereksinimleri**:

- Kabinet güç yoğunluğu ≤ 15kW/kabinet
- Giriş/çıkış sıcaklık farkını 8℃ içinde tutun

3. **Firmware Yönetimi**:

- Donanım uyumluluk matrisi oluşturun
- Birleşik firmware sürümleri kullanın

> **Uygulama Önerisi**: Resmi dağıtım öncesinde 72 saatlik stres testi yapmanız önerilir, aşağıdaki senaryoları simüle edin:
>
> 1. Düğüm failover testi
> 2. Ağ bölünmesi tatbikatları
> 3. Ani yazma basınç testi (teorik değerin %120'sine ulaşması önerilir)

---

Bu rehber, RustFS'ın en son geliştirme sürümü temel alınarak yazılmıştır. Gerçek dağıtım için lütfen belirli donanım satıcılarının teknik incelemeleri ile birlikte parametreleri ince ayarlayın. Veya RustFS resmi desteği ile üç aylık donanım sağlık değerlendirmeleri yaparak depolama kümelerinin sürekli kararlı çalışmasını sağlayın.