---
title: "RustFS Docker Kurulumu"
description: "RustFS Docker dağıtımı."
---

# Docker ile RustFS Kurulumu

RustFS, yüksek performanslı, %100 S3 uyumlu açık kaynak dağıtık nesne depolama sistemidir. Tek düğüm tek disk (SNSD) dağıtım modunda, arka uç sıfır hata düzeltme doğrulaması kullanır ve ek veri yedekliliği sağlamaz, bu da yerel test ve küçük ölçekli senaryolar için uygundur.
Bu makale, RustFS resmi Linux ikili paketini temel alarak, özel Dockerfile ile RustFS'i ve çalışma zamanı ortamını konteynere paketler, veri hacimlerini ve ortam değişkenlerini yapılandırır ve hizmeti tek tıkla başlatabilir.

---

## I. Ön Gereksinimler

1. **Ana Bilgisayar Gereksinimleri**

* Docker (≥ 20.10) kurulu olmalı ve görüntüleri çekebilmeli ve konteynerleri çalıştırabilmeli
* Nesne verilerini bağlamak için yerel yol `/mnt/rustfs/data` (veya özel yol)

2. **Ağ ve Güvenlik Duvarı**

* Ana bilgisayarın 9000 portunun dış dünyaya açık olduğundan emin olun (veya özel port tutarlılığı)

3. **Yapılandırma Dosyası Hazırlığı**

* Ana bilgisayarda `/etc/rustfs/config.toml` dosyasında, dinleme portu, yönetici hesabı, veri yolu vb. tanımlayın (Bkz. Bölüm IV)

---

## II. RustFS Resmi Görüntüsünü Hızlı Çekme

Resmi Ubuntu temel görüntüsünü kullanarak RustFS resmi görüntüsünü hızlıca çekin:

```bash
docker pull rustfs/rustfs
```

---

## III. RustFS Konteynerini Çalıştırma

RustFS SNSD Docker çalışma yöntemi, yukarıdaki görüntü ve yapılandırmayı birleştirerek:

```bash
 docker run -d \
  --name rustfs_local \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest \
  /data
```

Parametre açıklamaları:

* `-p 9000:9000`: Ana bilgisayar 9000 portunu konteynere eşle
* `-v /mnt/rustfs/data:/data`: Veri hacmini bağla
* `--name rustfs_local`: Konteyner özel adı
* `-d`: Arka planda çalıştır

---

### Tam Parametre Yapılandırma Örneği

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

### Parametre Açıklaması ve Karşılık Gelen Yöntem

1. **Ortam Değişkeni Yöntemi** (önerilen):

   ```bash
   -e RUSTFS_ADDRESS=:9000 \
   -e RUSTFS_SERVER_DOMAINS=example.com \
   -e RUSTFS_ACCESS_KEY=rustfsadmin \
   -e RUSTFS_SECRET_KEY=rustfsadmin \
   -e RUSTFS_CONSOLE_ENABLE=true \
   ```

2. **Komut Satırı Parametresi Yöntemi**:

   ```
   --address :9000 \
   --server-domains example.com \
   --access-key rustfsadmin \
   --secret-key rustfsadmin \
   --console-enable \
   ```

3. **Gerekli Parametreler**:
    * `<VOLUMES>`: Komutun sonunda belirtin, örn. `/data`

### Yaygın Yapılandırma Kombinasyonları

1. **Temel Yapılandırma**:

   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     rustfs/rustfs:latest \
     /data
   ```

2. **Konsolu Etkinleştir**:

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

3. **Özel Kimlik Doğrulama Anahtarları**:

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

### Dikkat Edilecek Noktalar

1. Port eşleme tutarlı olmalı:
    * Hizmet portu varsayılan olarak 9000 (`-p 9000:9000`)

2. Veri hacmi kalıcı olmalı:
    * `-v /host/path:/container/path`

3. Ortam değişkenleri ve komut satırı parametreleri karışık kullanılabilir, ancak komut satırı parametreleri daha yüksek önceliğe sahiptir

4. Eğer [TLS kullanıyorsanız](../../integration/tls-configured.md), ek sertifika yolu bağlamanız gerekir:

   ```bash
   -v /path/to/certs:/certs \
   -e RUSTFS_TLS_PATH=/certs \
   ```

## IV. Doğrulama ve Erişim

1. **Konteyner durumunu ve günlüklerini görüntüleme:**

 ```bash
 docker logs rustfs_local
 ```

 Günlükler hizmetin başarıyla başlatıldığını ve 9000 portunu dinlediğini göstermelidir.

2. **S3 API'sini test etme:**

 `mc` veya diğer S3 istemcilerini kullanarak:

 ```bash
 mc alias set rustfs http://localhost:9000 rustfsadmin ChangeMe123!
 mc mb rustfs/mybucket
 mc ls rustfs
 ```

 Bucket başarıyla oluşturulup listelenebiliyorsa, dağıtım etkili olmuştur.

## V. Diğer Öneriler

1. Üretim ortamı önerileri:

* Çok düğümlü dağıtım mimarisi kullanın

* [TLS şifreli iletişimi etkinleştirin](../../integration/tls-configured.md)
* Günlük rotasyon stratejisi yapılandırın
* Düzenli yedekleme stratejisi ayarlayın

2. Depolama önerileri:

* Yerel SSD/NVMe depolama kullanın

* Ağ dosya sistemi (NFS) kullanmaktan kaçının
* Depolama dizininin özel erişimini garanti edin

---

## Özet

Bu makale, RustFS tek düğüm tek disk konteynerleştirme en iyi uygulamalarını birleştirerek, Docker ile RustFS görüntüsünü nasıl oluşturacağınızı ve SNSD ortamını nasıl dağıtacağınızı detaylı olarak gösterir.
Bu çözüm hızlı başlatma ve deneme için kolaydır, daha sonra Kubernetes, Swarm vb. platformlarda aynı yaklaşımı kullanarak çok düğümlü çok diskli üretim seviyesi kümeye genişletilebilir.
