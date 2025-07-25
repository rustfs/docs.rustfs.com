# Dağıtık Dağıtım

RustFS, yüksek kullanılabilirlik ve ölçeklenebilirlik için çok düğümlü kümeleri destekleyerek, kurumsal sınıf dağıtık nesne depolama yetenekleri sunar.

## Mimari Genel Bakış

![Dağıtık Mimari](./images/s2-1.png)

RustFS, tek arıza noktaları olmayan bir dağıtık mimari kullanır. Kümedeki her düğüm, hem okuma hem de yazma isteklerini karşılayabilir ve şunları sağlar:

- **Yüksek Kullanılabilirlik**: Otomatik devralma ve kurtarma
- **Doğrusal Ölçeklenebilirlik**: Kapasite ve performansı artırmak için düğüm ekleme
- **Veri Dayanıklılığı**: Veri koruması için yapılandırılabilir silme kodlaması
- **Yük Dağıtımı**: Düğümler arasında otomatik yük dengeleme

## Dağıtım Modları

### Çok Düğümlü Çok Sürücü (MNMD)

Önerilen üretim dağıtım modu:

```bash
# 4 düğüm, her biri 4 sürücü (toplam 16 sürücü)
rustfs server http://node{1...4}.example.com:9000/data{1...4} \
```

**Faydaları:**

- Maksimum hata toleransı
- En iyi performans ölçeklenebilirliği
- Büyük ölçekli dağıtımlar için optimal

### Çok Düğümlü Tek Sürücü (MNSD)

Harici depolamaya sahip ortamlar için uygun:

```bash
# 4 düğüm, her biri 1 sürücü
rustfs server http://node{1...4}.example.com:9000/data \
```

**Kullanım Durumları:**

- Bağlı depolama ile bulut dağıtımları
- Konteynerleştirilmiş ortamlar
- Test ve geliştirme

## Küme Yapılandırması

### Düğüm Gereksinimleri

**Minimum Yapılandırma:**

- Temel yedeklilik için 4 düğüm
- Düğüm başına 8GB RAM
- Gigabit ağ bağlantısı

**Önerilen Yapılandırma:**

- Üretim için 8+ düğüm
- Düğüm başına 16GB+ RAM
- 10Gb ağ bağlantısı

### Silme Kodlaması

RustFS, küme boyutuna göre optimal silme kodlamasını otomatik olarak seçer:

| Düğümler | EC Yapılandırması | Hata Toleransı |
|---------|-------------------|----------------|
| 4 | EC:2+2 | 2 düğüm arızası |
| 8 | EC:4+4 | 4 düğüm arızası |
| 12 | EC:6+6 | 6 düğüm arızası |
| 16+ | EC:8+8 | 8 düğüm arızası |

## Yüksek Kullanılabilirlik Özellikleri

### Otomatik Devralma

- Düğüm arızalarının anında tespiti
- Sağlıklı düğümlere otomatik istek yönlendirme
- Manuel müdahale gerektirmez

### Veri Onarımı

- Sürekli arka plan onarım süreci
- Kaybolan verilerin otomatik yeniden oluşturulması
- Bozulan nesnelerin proaktif değiştirilmesi

### Yuvarlak Güncellemeler

- Sıfır kesinti süresi ile yazılım güncellemeleri
- Sağlık kontrolleri ile kademeli düğüm güncellemeleri
- Arızada otomatik geri alma

## Performans Optimizasyonu

### Ağ Optimizasyonu

1. **Özel Ağ**

```bash
# Küme trafiği için özel ağ arayüzlerini kullanın
rustfs server http://node{1...4}.internal:9000/data{1...4}
```

2. **Yük Dengeleme**
- Kümenin önüne yük dengeleyici dağıtın
- Otomatik devralma için sağlık kontrolleri kullanın
- İstemci bağlantılarını eşit olarak dağıtın

### Depolama Optimizasyonu

1. **Sürücü Seçimi**
- Düğümler arasında tutarlı sürücü türleri kullanın
- Yüksek performanslı iş yükleri için NVMe'yi düşünün
- Sürücü değiştirme döngülerini planlayın

2. **Kapasite Planlama**
- Depolama kullanım trendlerini izleyin
- %80 kapasiteye ulaşmadan önce genişlemeyi planlayın
- Mevsimsel kullanım kalıplarını düşünün

## İzleme ve Uyarılar

### Ana Metrikler

- **Düğüm Sağlığı**: CPU, bellek, disk kullanımı
- **Ağ**: Bant genişliği, gecikme, paket kaybı
- **Depolama**: Kapasite, IOPS, onarım durumu
- **Küme**: Nesne sayısı, veri dağıtımı

### Uyarı Yapılandırması

```bash
# Örnek Prometheus uyarıları
- alert: NodeDown
  expr: up{job="rustfs"} == 0
  for: 1m

- alert: HighDiskUsage
  expr: disk_usage_percent > 80
  for: 5m
```

## Felaket Kurtarma

### Çoklu Site Dağıtımı

- Kümeleri birden fazla veri merkezinde dağıtın
- Çapraz site çoğaltma yapılandırın
- Felaket kurtarma prosedürlerini uygulayın

### Yedekleme Stratejileri

- Dış depolamaya düzenli veri ihracatı
- Zamana göre kurtarma yetenekleri
- Otomatik yedekleme doğrulama

## Güvenlik

### Küme Güvenliği

- Düğümler arası iletişim için TLS şifreleme
- Sertifika tabanlı düğüm kimlik doğrulama
- Küme trafiği için ağ segmentasyonu

### Erişim Kontrolü

- Rol tabanlı erişim kontrolü (RBAC)
- Harici kimlik sağlayıcıları ile entegrasyon
- Tüm işlemler için denetim günlükleri

## Sorun Giderme

### Yaygın Sorunlar

1. **Split-Brain Önleme**
- Mümkün olduğunda tek sayıda düğüm kullanın
- Uygun kuorum ayarlarını yapılandırın
- Ağ bağlantısını izleyin

2. **Performans Bozulması**
- Arızalı sürücüleri kontrol edin
- Ağ kullanımını izleyin
- Erişim kalıplarını analiz edin

3. **Kapasite Sorunları**
- Depolama büyüme trendlerini izleyin
- Proaktif olarak genişlemeyi planlayın
- Yaşam döngüsü politikaları uygulayın