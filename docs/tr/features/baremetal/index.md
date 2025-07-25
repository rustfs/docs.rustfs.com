# Bare Metal Dağıtımı

RustFS'ı çıplak metal sunuculara dağıttığınızda, donanım performansını en üst düzeye çıkarabilir ve en iyi depolama verimliliğini elde edebilirsiniz. Bu kılavuz, çıplak metal dağıtımı en iyi uygulamalarını kapsar.

## Donanım Gereksinimleri

### Minimum Yapılandırma

- **İşlemci**: 4 çekirdek, 2.4GHz veya daha yüksek
- **Bellek**: 8GB RAM minimum, 16GB önerilir
- **Depolama**: Silme kodlaması için en az 4 sürücü
- **Ağ**: Gigabit Ethernet

### Önerilen Yapılandırma

- **İşlemci**: 16+ çekirdek, 3.0GHz veya daha yüksek
- **Bellek**: 32GB+ RAM
- **Depolama**: Katmanlandırma için 8+ sürücü, karışık SSD/HDD
- **Ağ**: 10Gb Ethernet veya daha yüksek

## Dağıtım Mimarisi

![Çıplak Metal Mimarisi 1](./images/sec2-1.png)

### Tek Düğüm Modu (SNSD)

Geliştirme ve test ortamları için uygundur:

```bash
# Tek sürücü ile tek düğüm
rustfs server /data
```

![Çıplak Metal Mimarisi 2](./images/sec2-2.png)

### Çok Düğüm Modu (MNMD)

Üretim ortamları için önerilir:

```bash
# Düğüm 1
rustfs server http://server{1...4}/data{1...4}

# Düğüm 2-4 (benzer yapılandırma)
```

![Çıplak Metal Mimarisi 3](./images/sec2-3.png)

## Performans Optimizasyonu

### Depolama Yapılandırması

1. **Sürücü Seçimi**
   - Üretim için kurumsal sınıf sürücüler kullanın
   - Yüksek performanslı iş yükleri için NVMe SSD'leri düşünün
   - İşletim sistemi ve veri sürücülerini ayırın

2. **RAID Yapılandırması**
   - Nesne depolama için donanım RAID'ini devre dışı bırakın
   - JBOD (Just a Bunch of Disks) modunu kullanın
   - Yedekliliği RustFS'ın yönetmesine izin verin

### Ağ Optimizasyonu

1. **Ağ Bağlama**

   ```bash
   # Yedeklilik için ağ bağlama yapılandırma
   sudo modprobe bonding
   echo "balance-rr" > /sys/class/net/bond0/bonding/mode
   ```

2. **Jumbo Çerçeveler**

   ```bash
   # Daha iyi aktarım hızı için jumbo çerçeveleri etkinleştir
   sudo ip link set dev eth0 mtu 9000
   ```

![Çıplak Metal Mimarisi 4](./images/sec2-4.png)

## İzleme ve Bakım

### Sağlık İzleme

- SMART araçları ile sürücü sağlığını izleyin
- Ağ kullanımını ve gecikmeyi takip edin
- Donanım arızaları için uyarılar ayarlayın

### Bakım Prosedürleri

1. **Sürücü Değiştirme**
   - Arızalı sürücüleri sıcak takas yapın
   - İyileştirme sürecini izleyin
   - Veri bütünlüğünü doğrulayın

2. **Düğüm Bakımı**
   - Düğümü düzgün bir şekilde kapatın
   - Yuvarlak güncellemeler yapın
   - Kapasite planlaması yapın

## Güvenlik Hususları

### Fiziksel Güvenlik

- Sunucu odası erişimini güvence altına alın
- Çevresel izleme yapın
- Güç yedekliliği sağlayın

### Ağ Güvenliği

- Güvenlik duvarı yapılandırması
- Ağ segmentasyonu
- İstemci bağlantılar için TLS şifreleme

## Sorun Giderme

### Yaygın Sorunlar

1. **Sürücü Arızaları**
   - SMART durumunu kontrol edin
   - Arızalı sürücüleri derhal değiştirin
   - İyileştirme ilerlemesini izleyin

2. **Ağ Sorunları**
   - Ağ bağlantısını doğrulayın
   - Bant genişliği kullanımını kontrol edin
   - Paket kaybı için izleme yapın

3. **Performans Sorunları**
   - G/Ç kalıplarını analiz edin
   - İşlemci/bellek darboğazları için kontrol edin
   - Sürücü düzenini optimize edin