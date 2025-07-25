---
title: "Ağ Kontrol Listesi"
description: "RustFS Kurumsal Dağıtım Ağ Kontrol Listesi"
---
# Ağ Kontrol Listesi

## 1. Ağ Mimarisi Tasarımı

### Temel Ağ Planlaması

- **Topoloji Yapısı Doğrulama**
 Dağıtım mimarisinin (yıldız/halkalı/örgü) dağıtık depolama için yüksek kullanılabilirlik gereksinimlerini karşılayıp karşılamadığını doğrulayın

- **Yedekli Yol Kontrolü**
 Düğümler arasında en az iki bağımsız fiziksel bağlantının var olduğunu sağlayın

- **Bant Genişliği Planlaması**
 Tahmini trafiği hesaplayın: Nesne depolama okuma/yazma bant genişliği × Düğüm sayısı × Replika sayısı + %20 yedeklilik

### IP Planlaması

- [ ] Yönetim ağını veri ağından ayırın
- [ ] Depolama düğümleri için ardışık IP segmentleri atayın (önerilen /24 alt ağ)
- [ ] Genişleme için en az %15 IP adresi rezerv edin

---

## 2. Donanım Ekipmanı Gereksinimleri

### Anahtar Yapılandırması

| Kontrol Maddesi | Standart Gereksinimler |
|--------|---------|
| Arka Panel Bant Genişliği | ≥ Tam port hattı hızında iletim kapasitesi × 1.2 |
| Port Tipi | 10G/25G/100G SFP+/QSFP+ fiber portlar |
| Akış Tablosu Kapasitesi | ≥ Düğüm sayısı × 5 |
| Spanning Tree Protokolü | RSTP/MSTP hızlı yakınsama etkinleştir |

### Fiziksel Bağlantılar

- [ ] Fiber zayıflama testi (tek mod ≤0.35dB/km)
- [ ] Port uyuşmazlık bağlantı kontrolü (Düğüm A eth0 ↔ Düğüm B eth0)
- [ ] Kablo etiketleme sistemi (kaynak/hedef IP + port numarası dahil)

---

## 3. İşletim Sistemi Ağ Yapılandırması

### Çekirdek Parametre Ayarlama

```bash
# Aşağıdaki parametre ayarlarını kontrol edin
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_slow_start_after_idle = 0
```

### Ağ Kartı Yapılandırması

- [ ] Jumbo çerçeveleri etkinleştir (MTU=9000, tam yol desteği gerektirir)
- [ ] Ağ kartı bağlama modunu doğrula (LACP mode4 önerilir)
- [ ] IPv6'yı devre dışı bırak (gerekmiyorsa)

---

## 4. Güvenlik Politikaları

### Güvenlik Duvarı Kuralları

```bash
# Gerekli açık portlar
- TCP 443 (HTTPS API)
- TCP 9000 (S3 uyumlu arayüz)
- TCP 7946 (Serf düğüm iletişimi)
- UDP 4789 (VxLAN tüneli)
```

### Erişim Kontrolü

- Anahtar port güvenliği MAC sınırlaması
- Depolama düğümleri arasında IPSec tünel şifreleme
- Yönetim arayüzü için TLS 1.3 etkinleştir

---

## 5. Performans Doğrulama Testi

### Benchmark Test Maddeleri

1. Düğümler arası gecikme testi: `iperf3 -s 8972 <hedef IP>`
2. Çapraz raf bant genişliği testi: `iperf3 -c <hedef IP> -P 8 -t 30`
3. Devralma testi: Çekirdek bağlantılarını rastgele kesin ve kurtarma süresini gözlemleyin

### Kabul Standartları

| Metrik | Gereksinimler |
|------|------|
| Düğüm Gecikmesi | ≤1ms (aynı veri merkezi)/≤5ms (farklı AZ) |
| Bant Genişliği Kullanımı | Tepe ≤%70 tasarım kapasitesi |
| Devralma | <500ms BPDU yakınsama |

---

## 6. Dokümantasyon Gereksinimleri

1. Ağ topoloji diyagramı (fiziksel bağlantılar ve mantıksal IP'ler dahil)
2. Anahtar yapılandırma yedek dosyaları (zaman damgalı)
3. Baz çizgisi test raporları (ham veri ile)
4. Değişiklik kayıt tablosu (bakım pencere bilgileri ile)

> **İpucu**: Resmi dağıtımdan önce 72 saatlik stres testi yapılması önerilir, tepe trafik yük senaryolarının %110'unu simüle edin

Bu kontrol listesi, özellikle dağıtık nesne depolama özellikleri için optimize edilmiş, kurumsal düzeyde depolama sistemi ağ dağıtımı için temel kontrol noktalarını kapsar. Resmi teknik destek için RustFS ile iletişime geçebilirsiniz.