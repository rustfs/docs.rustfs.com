---
title: RustFS Çok Makineli Çok Diskli Kurulum
description: Birden fazla sunucunun birden fazla diskinde RustFS kurulumu, veriler birden fazla sunucunun birden fazla diskinde depolanacak.
---

# Çok Makineli Çok Diskli (MNMD， Multiple Node Multiple Disk)

## Bir、Kurulum Öncesi Okunması Gerekenler

Bu doküman RustFS çok makineli çok diskli mod dağıtımını içerir, çok makineli çok diskli kurumsal düzeyde kullanılabilir performans, güvenlik ve ölçeklenebilirlik için uygundur. Ayrıca, üretim iş yükleri için gerekli mimari diyagramları sağlar. Lütfen kurulum öncesi okuyun, başlatma modlarımız ve kontrol listemiz aşağıdaki gibidir:

1. Lütfen üç kurulum etkinleştirme modunuzu netleştirin:

     - [Tek Makineli Tek Diskli Mod (SNSD)](./single-node-single-disk.md)
     - [Tek Makineli Çok Diskli Mod (SNMD)](./single-node-multiple-disk.md)
     - [Çok Makineli Çok Diskli Mod (MNMD)](./multiple-node-multiple-disk.md)  (mevcut doküman)

2. [Kurulum öncesi kontrol](../checklists/index.md), tüm göstergelerin üretim rehber özelliklerini karşıladığından emin olun, üretim standardına ihtiyacınız yoksa bu rehberi okumayabilirsiniz;

Dağıtık nesne depolama kümesini güvenli bir şekilde başlatmak için en az **4 sunucu** gerekir, her sunucuda en az 1 disk olmalıdır.

Aşağıdaki mimari diyagramda, veriler yük dengeleme aracılığıyla herhangi bir sunucuya rastgele yazılır. Varsayılan 12 + 4 modunda. Bir veri bloğu varsayılan olarak 12 veri bloğu + 4 sağlama bloğuna bölünür ve farklı sunucuların farklı disklerinde saklanır.

Herhangi 1 sunucunun hasar görmesi veya bakımı veri güvenliğini etkilemez.

4 disk içindeki herhangi bir veri hasarı veri güvenliğini etkilemez.

<img src="./images/multiple-node-multiple-disk.jpg" alt="RustFS Multiple Node Multiple Disk Mode" />

## İki、Ön Koşullar

1. İşletim sistemi sürümü;

2. Güvenlik duvarı;

3. Ana bilgisayar takma adı veya domain çözümlemesi;

4. Bellek koşulları;

5. Zaman senkronizasyonu;

6. Kapasite planlaması;

7. Disk planlaması;

8. Dosya sistemi planlaması;

### 2.1. İşletim Sistemi Sürümü

Linux çekirdeği 4.x ve üzeri sürümleri öneriyoruz. Çünkü 5.x / 6.x sürümleri daha iyi IO verimi ve ağ performansı sağlayabilir.

Ubuntu 22.04 ve RHEL8.x kullanarak RustFS kurabilirsiniz.

### 2.2 Güvenlik Duvarı

Linux sistemleri varsayılan olarak güvenlik duvarını açar, güvenlik duvarı durumunu aşağıdaki komutla görüntüleyebilirsiniz:

```bash
systemctl status firewalld
```

Eğer güvenlik duvarı durumunuz "active" ise, aşağıdaki komutla güvenlik duvarını devre dışı bırakabilirsiniz:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

Veya RustFS'in 9000 portunu açın:

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```

Dağıtımdaki tüm RustFS sunucuları **mutlaka** aynı dinleme portunu kullanmalıdır. Eğer 9000 portu kullanıyorsanız, diğer tüm sunucuların portları da 9000 olmalıdır.

### 2.3 Ana Bilgisayar Adı (Tek Makineli Tek Diskli ve Tek Makineli Çok Diskli bu adımı atlayabilir)

> Tek makineli tek diskli, tek makineli çok diskli ana bilgisayar takma adı ayarlamayın, lütfen bu adımı atlayın.

RustFS kümesi oluşturmak için **aynı, süreklilik sağlayan** ana bilgisayar adları kullanılmalıdır. Süreklilik sağlayan ana bilgisayar adlarını gerçekleştirmenin iki yolu vardır:

**1. DNS Yapılandırması:**

Lütfen DNS çözümleme sunucunuzu yapılandırın, isimlerin sürekliliğini sağlayın.

**2. HOSTS Yapılandırması:**

/etc/hosts'daki yerel takma ad ayarlarını değiştirin, spesifik operasyonlar aşağıdaki gibidir:
