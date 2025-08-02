---
title: "Linux'ta RustFS Kurulumu"
description: "Linux işletim sistemlerinde RustFS kurulumu için hızlı rehber"
---
# Linux'ta RustFS Kurulumu

## 1. Kurulum Öncesi Okuma

Bu sayfa, RustFS'nin tüm üç kurulum modu için eksiksiz dokümantasyon ve talimatlar içerir. Bunlar arasında, çok makineli çok disk modu, kurumsal düzeyde performans, güvenlik ve ölçeklenebilirlik içerir. Ayrıca üretim iş yükleri için gerekli mimari diyagramları da sağlar.

Kurulumdan önce lütfen başlangıç modlarımızı ve kontrol listelerimizi okuyun:

1. Başlangıç modları: Linux başlangıç modunuzu önceden netleştirin;
2. Kontrol listeleri: Çeşitli göstergelerin üretim rehberlik özelliklerini karşılayıp karşılamadığını kontrol edin. Üretim standartları gerektirilmiyorsa, bu rehberliği atlayabilirsiniz;

## 2. Önkoşullar

1. İşletim sistemi sürümü;
2. Güvenlik duvarı;
3. Ana bilgisayar adı;
4. Bellek gereksinimleri;
5. Zaman senkronizasyonu;
6. Kapasite planlaması;
7. Disk planlaması;
8. Veri katmanlama planlaması.

### 2.1. İşletim Sistemi Sürümü

Linux çekirdek sürümü 4.x ve üstünü öneriyoruz, ancak 5.x ve üstü sürümler daha iyi IO verimi ve ağ performansı elde edebilir.

Ubuntu 20.04 ve RHEL 8.x kullanarak RustFS'yi kurabilirsiniz.

### 2.2 Güvenlik Duvarı

Linux sistemlerinde varsayılan olarak güvenlik duvarları etkindir. Güvenlik duvarı durumunu aşağıdaki komutla kontrol edebilirsiniz:

```bash
systemctl status firewalld
```

Güvenlik duvarı durumunuz "aktif" ise, güvenlik duvarını aşağıdaki komutlarla devre dışı bırakabilirsiniz:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

Veya RustFS portu 9000'i izin verin:

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```

Dağıtımınızdaki tüm RustFS sunucuları aynı dinleme portunu kullanmalıdır. Eğer 9000 portunu kullanıyorsanız, diğer tüm sunucular da 9000 portunu kullanmalıdır.

### 2.3 Ana Bilgisayar Adı

Bir RustFS kümesi oluşturmak için **tutarlı, sürekli** ana bilgisayar adları kullanmanız gerekir. Sürekli ana bilgisayar adları elde etmek için iki yol vardır:

1. DNS yapılandırması;
2. HOSTS yapılandırması.

```bash
vim /etc/hosts
127.0.0.1 localhost localhost.localdomain localhost4 localhost4.localdomain4
::1 localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```

### 2.4 Bellek Gereksinimleri

RustFS, test ortamlarında çalıştırılmak için en az 2 GB belleğe ihtiyaç duyar, üretim ortamları için ise en az 64 GB bellek gereklidir.

### 2.5 Zaman Senkronizasyonu

Çok düğümlü tutarlılık, zaman sunucularını kullanarak zaman tutarlılığını korumayı gerektirir, aksi takdirde hizmet başlatma hataları meydana gelebilir. İlgili zaman sunucuları arasında `ntp`, `timedatectl` veya `timesyncd` bulunur.

RustFS zaman senkronizasyonu gerektirir. Zaman senkronizasyonu durumunu aşağıdaki komutla kontrol edebilirsiniz:

```bash
timedatectl status
```

Durum "senkronize" ise, zaman senkronizasyonu normaldir.

## 3. Kullanıcı Adı Yapılandırma

RustFS başlatması için, RustFS servisini başlatmak üzere giriş ayrıcalıkları olmayan özel bir kullanıcı yapılandırmanızı öneririz. rustfs.service başlangıç kontrol betiğinde, varsayılan kullanıcı ve kullanıcı grubu `rustfs-user` ve `rustfs-user`dır.

Kullanıcı ve gruplar oluşturmak için groupadd ve useradd komutlarını kullanabilirsiniz. Aşağıdaki örnek, kullanıcıları, grupları oluşturur ve RustFS tarafından belirtilen veri dizinlerine erişim izinlerini ayarlar.

## 4. Kurulum Paketini İndirme

Lütfen önce wget veya curl kullanarak rustfs kurulum paketini indirin.

```bash
# İndirme adresi
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-latest.zip
unzip rustfs-linux-x86_64-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

## 5. Ortam Değişkenlerini Yapılandırma

1. Yapılandırma dosyası oluşturun

```bash
sudo tee /etc/default/rustfs <<EOF
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":7000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:7000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_CONSOLE_ADDRESS=":7001"
RUSTFS_OBS_ENDPOINT=""
RUSTFS_TLS_PATH="/opt/tls"
EOF
```

2. Depolama dizinleri oluşturun

```bash
sudo mkdir -p /data/rustfs{0..3} /var/logs/rustfs /opt/tls
sudo chmod -R 750 /data/rustfs* /var/logs/rustfs
```

## 6. İzlenebilirlik Sistemi Yapılandırma

1. İzlenebilirlik yapılandırma dosyası oluşturun

```bash
export RUSTFS_OBS_ENDPOINT=http://localhost:4317 # OpenTelemetry Collector adresi
export RUSTFS_OBS_USE_STDOUT=false # Standart çıktı kullanılıp kullanılmayacağı
export RUSTFS_OBS_SAMPLE_RATIO=2.0 # Örnekleme oranı, 0.0-1.0 arasında, 0.0 örnekleme yok demektir, 1.0 tüm örnekler demektir
export RUSTFS_OBS_METER_INTERVAL=1 # Örnekleme aralığı, saniye cinsinden
export RUSTFS_OBS_SERVICE_NAME=rustfs # Servis adı
export RUSTFS_OBS_SERVICE_VERSION=0.1.0 # Servis Sürümü
export RUSTFS_OBS_ENVIRONMENT=develop # Ortam adı
export RUSTFS_OBS_LOGGER_LEVEL=debug # Günlük düzeyi, trace, debug, info, warning, error destekler
export RUSTFS_OBS_LOCAL_LOGGING_ENABLED=true # Yerel günlük kaydının etkinleştirilip etkinleştirilmeyeceği
# Günlük Dizinleri `RUSTFS_OBS_ENDPOINT` değeri boş olduğunda, aşağıdaki günlük işleme kuralları varsayılan olarak yürütülür.
export RUSTFS_OBS_LOG_DIRECTORY="$current_dir/deploy/logs" # Günlük dizini
export RUSTFS_OBS_LOG_ROTATION_TIME="minute" # Günlük döndürme zaman birimi, "second", "minute", "hour", "day" olabilir
export RUSTFS_OBS_LOG_ROTATION_SIZE_MB=1 # Günlük döndürme boyutu MB cinsinden
# Günlük kaydı yapılandırma
export RUSTFS_SINKS_FILE_PATH="$current_dir/deploy/logs/rustfs.log"
export RUSTFS_SINKS_FILE_BUFFER_SIZE=12
export RUSTFS_SINKS_FILE_FLUSH_INTERVAL_MS=1000
export RUSTFS_SINKS_FILE_FLUSH_THRESHOLD=100
```

2. Günlük döndürme ayarlayın

```bash
sudo tee /etc/logrotate.d/rustfs <<EOF
/var/logs/rustfs/*.log {
  daily
  rotate 30
  compress
  delaycompress
  missingok
  notifempty
  create 644 rustfs-user rustfs-user
}
EOF
```

## 7. RustFS'i Başlatma

```bash
# RustFS servisini başlat
sudo systemctl start rustfs
sudo systemctl enable rustfs
# Servis durumunu kontrol et
sudo systemctl status rustfs
```

## 8. Kurulumu Doğrulama

MinIO istemcisi kullanarak kurulumu test edin:

```bash
# mc istemcisini kur
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
# Takma ad yapılandır
mc alias set rustfs http://localhost:7000 rustfsadmin rustfsadmin
# İşlemleri test et
mc mb rustfs/test-bucket
mc ls rustfs
```

Eğer kovaları başarıyla oluşturup listeleyebiliyorsanız, kurulum tamamlanmıştır.