---
title: "Kullanılabilirlik ve Ölçeklenebilirlik Kılavuzu"
description: "Bu belge, RustFS ölçeklenebilirlik yetenekleri ve prosedürleri hakkında detaylı teknik bilgi sağlar."
---
# Kullanılabilirlik ve Ölçeklenebilirlik Kılavuzu

## Ölçeklenebilirlik Genel Bakış

RustFS, yeni depolama havuzları (Sunucu Havuzları) ekleyerek yatay ölçeklenebilirliği destekler. Her yeni depolama havuzu aşağıdaki gereksinimleri karşılamalıdır:

1. Depolama havuzundaki düğümler **art arda ana bilgisayar adları** kullanmalıdır (örneğin, node5-node8)
2. Tek bir depolama havuzundaki tüm düğümler **aynı disk özelliklerini** kullanmalıdır (tip/kapasite/miktar)
3. Yeni depolama havuzları, mevcut küme ile **zaman senkronizasyonunu** ve **ağ bağlantısını** korumalıdır

![RustFS Mimari](./images/s2-1.png)

---

## 1. Ölçeklendirme Öncesi Hazırlık

### 1.1 Donanım Planlama Gereksinimleri

| Öğe | Minimum Gereksinimler | Önerilen Üretim Yapılandırması |
|---------------|---------------------------|---------------------------|
| Düğüm Sayısı | 4 düğüm/havuz | 4 - 8 düğüm/havuz |
| Düğüm Belleği | 128 GB | 128 GB |
| Disk Türü | SSD | NVMe SSD |
| Disk Kapasitesi | ≥1 TB | ≥4 TB |
| Ağ Bant Genişliği | 10 Gbps | 25 Gbps |

### 1.2 Sistem Ortamı Kontrolü

```bash
# Ana bilgisayar adı sürekliliğini kontrol edin (yeni düğüm örnekleri)
cat /etc/hosts
192.168.10.5 node5
192.168.10.6 node6
192.168.10.7 node7
192.168.10.8 node8

# Zaman senkronizasyonu durumunu doğrulayın
timedatectl status | grep synchronized

# Güvenlik duvarı kurallarını kontrol edin (tüm düğümlerin 7000/7001 portları açık olmalı)
firewall-cmd --list-ports | grep 7000
```

---

## 2. Ölçeklendirme Uygulama Adımları

### 2.1 Yeni Düğüm Temel Yapılandırması

```bash
# Özel kullanıcı oluşturun (tüm yeni düğümlerde çalıştırın)
groupadd rustfs-user
useradd -M -r -g rustfs-user rustfs-user

# Depolama dizinleri oluşturun (8 disk örneği)
mkdir -p /data/rustfs{0..7}
chown -R rustfs-user:rustfs-user /data/rustfs*
```

### 2.2 RustFS Servisini Yükleyin

```bash
# En son ikili paketi indirin (sürüm mevcut kümeyle eşleşmeli)
wget https://dl.rustfs.com/rustfs/v2.3.0/rustfs -O /usr/local/bin/rustfs
chmod +x /usr/local/bin/rustfs

# Yapılandırma dosyası oluşturun (/etc/default/rustfs)
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
# Tüm mevcut düğümlerde yapılandırmayı güncelleyin (yeni depolama havuzu ekleyin)
sed -i '/RUSTFS_VOLUMES/s|"$| http://node{5...8}:7000/data/rustfs{0...7}"|' /etc/default/rustfs

# Küresel servis yeniden başlatma (tüm düğümlerde eşzamanlı olarak çalıştırın)
systemctl restart rustfs.service
```

---

## 3. Ölçeklendirme Sonrası Doğrulama

### 3.1 Küme Durumu Kontrolü

```bash
# Düğüm katılım durumunu kontrol edin
curl -s http://node1:7001/cluster/nodes | jq .poolMembers

# Depolama havuzu dağılımını doğrulayın
rc admin info cluster
```

### 3.2 Veri Dengesini Doğrulayın

```bash
# Veri dağılım oranını kontrol edin (depolama havuzu kapasite oranına yaklaşmalı)
watch -n 5 "rustfs-admin metrics | grep 'PoolUsagePercent'"
```

---

## 4. Önemli Notlar

1. **Kademeli Yeniden Başlatma Yasak**: Veri tutarsızlığını önlemek için tüm düğümler eşzamanlı olarak yeniden başlatılmalıdır
2. **Kapasite Planlama Önerisi**: Depolama kullanımı %70'e ulaştığında bir sonraki ölçeklendirmeyi planlayın
3. **Performans Ayarlama Önerileri**:

```bash
# Çekirdek parametrelerini ayarlayın (tüm düğümler)
echo "vm.swappiness=10" >> /etc/sysctl.conf
echo "net.core.somaxconn=32768" >> /etc/sysctl.conf
sysctl -p
```

---

## 5. Sorun Giderme Kılavuzu

| Belirti | Kontrol Noktası | Düzeltme Komutu |
|---------------------------|---------------------------------|-------------------------------|
| Yeni düğüm kümeye katılamıyor | 7000 portu bağlantısını kontrol edin | `telnet node5 7000` |
| Veri dağılımı dengesiz | Depolama havuzu kapasite yapılandırmasını kontrol edin | `rustfs-admin rebalance start` |
| Konsol anormal düğüm durumunu gösteriyor | Zaman senkronizasyonu durumunu doğrulayın | `chronyc sources` |

> Not: Bu belge, RustFS'nin en son sürümüne dayanmaktadır. Ölçeklendirme işlemlerinden önce tam veri yedeği alınmasını sağlayın. Üretim ortamları için, çözüm incelemesi için RustFS teknik destek mühendisleriyle görüşmenizi öneririz.