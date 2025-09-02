---
title: "Kullanılabilirlik ve Ölçeklenebilirlik Açıklaması"
description: "Bu makale RustFS ölçeklendirme ile ilgili teknolojileri ve açıklamaları detaylı olarak sunacaktır."
---

# Kullanılabilirlik ve Ölçeklenebilirlik Açıklaması

## Ölçeklendirme Çözümü Genel Bakışı

RustFS yeni depolama havuzları (Server Pool) ekleme yoluyla yatay ölçeklendirmeyi destekler. Her yeni eklenen depolama havuzu şunları karşılamalıdır:

1. Depolama havuzu içindeki düğümler **sürekli host adları** kullanmalıdır (node5-node8 gibi)
2. Tek depolama havuzu içinde **aynı özelliklerde** diskler kullanılmalıdır (tür/kapasite/sayı)
3. Yeni depolama havuzu mevcut küme ile **zaman senkronizasyonu** ve **ağ bağlantısı** sağlamalıdır

![RustFS Mimari Diyagramı](./images/s2-1.png)

---

## Bir. Ölçeklendirme Öncesi Hazırlık

### 1.1 Donanım Planlama Gereksinimleri

| Madde | Minimum Gereksinim | Önerilen Üretim Yapılandırması |
|---------------|---------------------------|---------------------------|
| Düğüm Sayısı | 4 düğüm/depolama havuzu | 4 - 8 düğüm/depolama havuzu |
| Tek Düğüm Belleği | 128 GB | 128 GB |
| Disk Türü | SSD | NVMe SSD |
| Tek Disk Kapasitesi | ≥1 TB | ≥4 TB |
| Ağ Bant Genişliği | 10 Gbps | 25 Gbps |

### 1.2 Sistem Ortam Kontrolü

```bash
# Host adı sürekliliği kontrolü (yeni düğüm örneği)
cat /etc/hosts
192.168.10.5 node5
192.168.10.6 node6
192.168.10.7 node7
192.168.10.8 node8

# Zaman senkronizasyon durumu doğrulaması
timedatectl status | grep synchronized

# Firewall kuralları kontrolü (tüm düğümler 7000/7001 portlarını açmalı)
firewall-cmd --list-ports | grep 7000
```

---

## İki. Ölçeklendirme Uygulama Adımları

### 2.1 Yeni Düğüm Temel Yapılandırması

```bash
# Özel kullanıcı oluştur (tüm yeni düğümlerde çalıştır)
groupadd rustfs-user
useradd -M -r -g rustfs-user rustfs-user

# Depolama dizini oluştur (8 disk örneği)
mkdir -p /data/rustfs{0..7}
chown -R rustfs-user:rustfs-user /data/rustfs*
```

### 2.2 RustFS Hizmeti Kurulumu

```bash
# En son binary paketini indir (sürüm numarası mevcut küme ile tutarlı olmalı)
wget https://dl.rustfs.com/rustfs/v2.3.0/rustfs -O /usr/local/bin/rustfs
chmod +x /usr/local/bin/rustfs

# Yapılandırma dosyası oluştur (/etc/default/rustfs)
cat <<EOF > /etc/default/rustfs
RUSTFS_ROOT_USER=admin
RUSTFS_ROOT_PASSWORD=YourSecurePassword
RUSTFS_VOLUMES="/data/rustfs{0...7}"
RUSTFS_ADDRESS=":7000"
RUSTFS_CONSOLE_ADDRESS=":7001"
EOF
```

### 2.3 Küme Ölçeklendirme İşlemi

```bash
# Tüm mevcut düğümlerde yapılandırmayı güncelle (yeni depolama havuzu ekle)
sed -i '/RUSTFS_VOLUMES/s|"$| http://node{5...8}:7000/data/rustfs{0...7}"|' /etc/default/rustfs

# Global hizmet yeniden başlatma (tüm düğümler aynı anda çalıştır)
systemctl restart rustfs.service
```

---

## Üç. Ölçeklendirme Sonrası Doğrulama

### 3.1 Küme Durumu Kontrolü

```bash
# Düğüm katılma durumu kontrolü
curl -s http://node1:7001/cluster/nodes | jq .poolMembers

# Depolama havuzu dağılımını doğrula
rc admin info cluster
```

### 3.2 Veri Dengeleme Doğrulaması

```bash
# Veri dağılım oranını görüntüle (her depolama havuzu kapasite oranına yakın olmalı)
watch -n 5 "rustfs-admin metrics | grep 'PoolUsagePercent'"
```

---

## Dört. Dikkat Edilecek Hususlar

1. **Rolling Restart Yasak**: Tüm düğümleri aynı anda yeniden başlatmalı, veri tutarsızlığından kaçınmalı
2. **Kapasite Planlama Önerisi**: Depolama kullanım oranı %70'e ulaşmadan önce bir sonraki ölçeklendirme planlanmalı
3. **Performans Ayarlama Önerileri**:

 ```bash
 # Kernel parametrelerini ayarla (tüm düğümler)
 echo "vm.swappiness=10" >> /etc/sysctl.conf
 echo "net.core.somaxconn=32768" >> /etc/sysctl.conf
 sysctl -p
 ```

---

## Beş. Arıza Giderme Rehberi

| Belirti | Kontrol Noktası | Onarım Komutu |
|---------------------------|---------------------------------|-------------------------------|
| Yeni düğüm kümeye katılamıyor | 7000 port bağlantısını kontrol et | `telnet node5 7000` |
| Veri dağılımı dengesiz | Depolama havuzu kapasite yapılandırmasını kontrol et | `rustfs-admin rebalance start`|
| Konsol düğüm durumu anormal gösteriyor | Zaman senkronizasyon durumunu doğrula | `chronyc sources` |

> İpucu: Bu belge RustFS'in en son sürümüne dayalı yazılmıştır, ölçeklendirme işlemi öncesi mutlaka tam veri yedeklemesi yapın. Üretim ortamında RustFS teknik destek mühendisi ile çözüm değerlendirmesi yapmanız önerilir.