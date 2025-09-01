---
title: "Ağ Kontrol Listesi"
description: "RustFS kurumsal düzey dağıtım ağ kontrol listesi"
---

# Ağ Kontrol Listesi

## 1. Ağ Mimarisi Tasarımı

### Temel Ağ Planlama
- **Topoloji Yapısı Doğrulaması** 
 Dağıtım mimarisinin (yıldız/halka/mesh) dağıtık depolamanın yüksek kullanılabilirlik gereksinimlerini karşılayıp karşılamadığını onaylayın
- **Yedek Yol Kontrolü** 
 Düğümler arasında en az iki bağımsız fiziksel bağlantının bulunduğundan emin olun
- **Bant Genişliği Planlaması** 
 Tahmini trafiği hesaplayın: Nesne depolama okuma-yazma bant genişliği × düğüm sayısı × kopya sayısı + %20 yedek

### IP Planlaması
- [ ] Yönetim ağı ile veri ağının ayrılması
- [ ] Depolama düğümleri için sürekli IP aralığı tahsisi (/24 alt ağ önerilir)
- [ ] Genişleme için en az %15 IP adresi rezerve edin

---

## 2. Donanım Cihaz Gereksinimleri
### Switch Yapılandırması
| Kontrol Maddesi | Standart Gereksinim | 
|--------|---------|
| Backplane Bant Genişliği | ≥ Tüm port hat hızı iletim kapasitesi × 1.2 | 
| Port Türü | 10G/25G/100G SFP+/QSFP+ fiber portları | 
| Flow Table Kapasitesi | ≥ Düğüm sayısı × 5 | 
| Spanning Tree Protokolü | RSTP/MSTP hızlı yakınsama etkinleştirin |

### Fiziksel Bağlantı
- [ ] Fiber zayıflama testi (tek mod ≤0.35dB/km)
- [ ] Port çapraz bağlantı kontrolü (A düğümü eth0 ↔ B düğümü eth0)
- [ ] Kablo etiket sistemi (kaynak/hedef IP+port numarası içeren)

---

## 3. İşletim Sistemi Ağ Yapılandırması
### Kernel Parametre Optimizasyonu
```bash
# Aşağıdaki parametrelerin ayarlarını kontrol edin
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_slow_start_after_idle = 0
```

### Ağ Kartı Yapılandırması
- [ ] Jumbo frame etkinleştir (MTU=9000, tüm yol desteği gerekli)
- [ ] Ağ kartı bağlama modunu doğrula (LACP mode4 önerilir)
- [ ] IPv6'yı kapat (kullanım gerekmiyorsa)

---

## 4. Güvenlik Politikası
### Firewall Kuralları
```bash
# Gerekli açık portlar
- TCP 443 (HTTPS API)
- TCP 9000 (S3 uyumlu arayüz) 
- TCP 7946 (Serf düğüm iletişimi)
- UDP 4789 (VxLAN tüneli)
```

### Erişim Kontrolü
- Switch port güvenlik MAC sınırlaması
- Depolama düğümleri arası IPSec tünel şifreleme
- Yönetim arayüzü TLS 1.3 etkinleştir

---

## 5. Performans Doğrulama Testi
### Benchmark Test Maddeleri
1. Düğümler arası gecikme testi: `iperf3 -s 8972 <hedef IP>`
2. Çapraz raf bant genişliği testi: `iperf3 -c <hedef IP> -P 8 -t 30`
3. Arıza geçiş testi: Rastgele çekirdek bağlantıyı kesip kurtarma süresini gözlemleyin

### Kabul Standartları
| Metrik | Gereksinim |
|------|------|
| Düğüm Gecikmesi | ≤1ms (aynı veri merkezi)/≤5ms (çapraz AZ) |
| Bant Genişliği Kullanım Oranı | Zirve ≤%70 tasarım kapasitesi |
| Arıza Geçişi | 500ms'den az BPDU yakınsaması |

---

## 6. Dokümantasyon Kayıt Gereksinimleri
1. Ağ topoloji diyagramı (fiziksel bağlantı ve mantıksal IP içeren)
2. Switch yapılandırma yedek dosyaları (zaman damgası içeren)
3. Baseline test raporu (ham veri içeren)
4. Değişiklik kayıt tablosu (bakım penceresi bilgisi içeren)

> **İpucu**: Resmi dağıtım öncesi 72 saatlik stres testi yapmanızı, zirve trafiğin %110'unu simüle eden yük senaryosu uygulamanızı öneririz

Bu kontrol listesi kurumsal düzey depolama sistemi ağ dağıtımının kritik kontrol noktalarını kapsar, özellikle dağıtık nesne depolamanın özelliklerine göre parametre gereksinimlerini optimize eder. Resmi teknik destek için RustFS ile iletişime geçebilirsiniz.