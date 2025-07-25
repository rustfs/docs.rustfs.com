---
title: "Docker ile RustFS Kurulumu"
description: "RustFS Docker dağıtım rehberi."
---

# Docker ile RustFS Kurulumu

RustFS, yüksek performanslı, %100 S3 uyumlu, açık kaynaklı dağıtık bir nesne depolama sistemidir. Tek Düğüm Tek Disk (SNSD) dağıtım modunda, arka uç herhangi bir hata düzeltme kodlaması (erasure coding) olmadan çalışır ve veri yedekliliği sunmaz. Bu mod, yerel testler ve küçük ölçekli senaryolar için uygundur.  
Bu belge, resmi RustFS Linux ikili paketine dayanarak RustFS'i ve çalışma ortamını bir konteyner içine paketleyen özel bir Dockerfile oluşturur; veri dizinlerini ve ortam değişkenlerini yapılandırarak tek komutla servis başlatmayı sağlar.

---

## 1. Ön Koşullar

1. **Ana Makine Gereksinimleri**

   * Docker kurulu olmalı (≥ 20.10) ve imaj çekip konteyner çalıştırabilmeli
   * Nesne verileri için `/mnt/rustfs/data` (veya özel bir yol) adlı yerel bir yol mevcut olmalı

2. **Ağ & Güvenlik Duvarı**

   * Ana makine portu 7000 dış erişime açık olmalı (veya özel portla tutarlı olmalı)

3. **Yapılandırma Dosyasının Hazırlanması**

   * `/etc/rustfs/config.toml` dosyasında dinleme portu, yönetici hesabı, veri yolu vb. tanımlanmalı (Bkz. Bölüm 4)

---

## 2. Resmi RustFS İmajını Hızlı Çekme

Resmi Ubuntu tabanlı imajı kullanarak RustFS imajını hızlıca çekin:

```bash
docker pull quay.io/rustfs/rustfs
````

Veya alternatif olarak:

```bash
docker pull rustfs/rustfs
```

---

## 3. Ortam Yapılandırması Yazma

Ana makinede `/etc/rustfs/config.toml` dosyasını oluşturun, örnek içerik:

```bash
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":7000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:7000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_CONSOLE_ADDRESS=":7001"
RUSTFS_OBS_CONFIG="/etc/default/obs.toml"
RUSTFS_TLS_PATH="/opt/tls"
```

> **Not:** Yapılandırma öğelerinin biçimleri ve varsayılan değerleri için resmi Linux kurulum belgelerine bakınız.

---

## 4. RustFS Konteynerini Çalıştırmak

Yukarıdaki imaj ve yapılandırma ile RustFS SNSD Docker çalıştırma yöntemi:

```bash
docker run -d \
  --name rustfs_local \
  -p 7000:7000 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest
```

Parametre açıklamaları:

* `-p 7000:7000`: Ana makine portu 7000’i konteyner ile eşleştirir
* `-v /mnt/rustfs/data:/data`: Veri dizinini bağlar
* `-v /etc/rustfs/rustfs:/config/rustfs:ro`: Yapılandırma dosyasını bağlar
* `--name rustfs_local`: Özel konteyner adı
* `-d`: Arka planda çalıştır

---

### Tüm Parametrelerle Yapılandırma Örneği

```bash
docker run -d \
  --name rustfs_container \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY=rustfsadmin \
  -e RUSTFS_SECRET_KEY=rustfsadmin \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_SERVER_DOMAINS=example.com \
  rustfs/rustfs:latest \
  --address :9000 \
  --console-enable \
  --server-domains example.com \
  --access-key rustfsadmin \
  --secret-key rustfsadmin \
  /data
```

### Parametre açıklamaları ve yöntemleri

1. **Ortam değişkeni yöntemi (önerilir):**

   ```bash
   -e RUSTFS_ADDRESS=:9000 \
   -e RUSTFS_SERVER_DOMAINS=example.com \
   -e RUSTFS_ACCESS_KEY=rustfsadmin \
   -e RUSTFS_SECRET_KEY=rustfsadmin \
   -e RUSTFS_CONSOLE_ENABLE=true \
   ```

2. **Komut satırı parametre yöntemi:**

   ```bash
   --address :9000 \
   --server-domains example.com \
   --access-key rustfsadmin \
   --secret-key rustfsadmin \
   --console-enable \
   ```

3. **Gerekli parametreler:**

   * `<VOLUMES>`: Komut sonunda belirtilmeli, örneğin `/data`

### Yaygın Yapılandırma Kombinasyonları

1. **Temel Yapılandırma:**

   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     rustfs/rustfs:latest \
     /data
   ```

2. **Yönetim Konsolu Etkinleştirme:**

   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_CONSOLE_ENABLE=true \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --console-enable \
     /data
   ```

3. **Özel Kimlik Doğrulama Anahtarı:**

   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_ACCESS_KEY=rustfsadmin \
     -e RUSTFS_SECRET_KEY=rustfsadmin \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --access-key rustfsadmin \
     --secret-key rustfsadmin \
     /data
   ```

### Dikkat Edilmesi Gerekenler

1. Port eşlemeleri uyumlu olmalı:

   * Servis portu varsayılan 9000 (`-p 9000:9000`)

2. Veri dizinleri kalıcı hale getirilmeli:

   * `-v /ana_makine/yol:/konteyner/yol`

3. Ortam değişkenleri ve komut satırı parametreleri birlikte kullanılabilir, ancak **komut satırı parametreleri önceliklidir**

4. TLS kullanılıyorsa ek sertifika yolları gerekir:

   ```bash
   -v /sertifika/yolu:/certs \
   -e RUSTFS_TLS_PATH=/certs \
   ```

---

## 5. Doğrulama ve Erişim

1. **Konteyner durumu ve logları kontrol etme:**

   ```bash
   docker logs rustfs_local
   ```

   Loglar servis başarıyla başlatıldıysa ve 7000 portunda dinliyorsa bunu gösterecektir.

2. **S3 API Testi:**

   `mc` veya başka S3 istemcisi ile:

   ```bash
   mc alias set rustfs http://localhost:7000 rustfsadmin ChangeMe123!
   mc mb rustfs/mybucket
   mc ls rustfs
   ```

   Eğer başarıyla bucket oluşturulup listelenebiliyorsa kurulum başarılıdır.

---

## 6. Ek Öneriler

1. Üretim ortamı için öneriler:

* Çok düğümlü dağıtım mimarisi kullanılmalı
* TLS ile şifreli iletişim etkinleştirilmeli
* Log döndürme (rotation) politikaları tanımlanmalı
* Düzenli yedekleme stratejileri kurulmalı

2. Depolama için öneriler:

* Yerel SSD/NVMe diskler tercih edilmeli
* Ağ dosya sistemlerinden (NFS) kaçınılmalı
* Depolama dizinlerine özel erişim sağlanmalı

---

## Özet

Bu belge, RustFS’in tek düğüm tek diskli konteynerleştirme en iyi uygulamalarını bir araya getirerek, Docker aracılığıyla RustFS imajı oluşturma ve SNSD ortamlarını dağıtma sürecini detaylı biçimde açıklamaktadır.
Bu çözüm, hızlıca başlatılıp denenebilir ve aynı yaklaşım Kubernetes, Swarm gibi platformlarda çok düğümlü, çok diskli üretim ortamlarına ölçeklendirilebilir.
