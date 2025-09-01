---
title: RustFS Tek Makine Çok Disk Kurulumu
description: Tek sunucunun birden fazla diskine RustFS kurulumu, veriler birden fazla diskte depolanacak.
---

# Tek Makine Çok Disk Modu (SNMD, Single Node Multiple Disk)


## Bir, Kurulumdan Önce Okunması Gerekenler

Bu belgede tek makine çok disk dağıtım modu yer almaktadır.

1. Lütfen üç kurulum başlatma modunuzu belirleyin:

    - [Tek makine tek disk modu (SNSD)](./single-node-single-disk.md)
    - [Tek makine çok disk modu (SNMD)](./single-node-multiple-disk.md)     (mevcut belge)
    - [Çok makine çok disk modu (MNMD)](./multiple-node-multiple-disk.md)


2. [Kurulum öncesi kontrol](../checklists/index.md), tüm göstergelerin üretim rehber özelliklerine uygun olduğundan emin olun, üretim standardına ihtiyaç yoksa bu rehberi okumayabilirsiniz;


> Mevcut belge tek makine çok disk modu için uygundur, tek makine çok disk modu orta seviye kritik olmayan işler için uygundur, üretim ortamında genellikle belirtilen M adet sabit disk bozulması veri riski oluşturmaz, tüm sunucu bozulursa veya M diskten fazla bozulursa veri kaybolur. Lütfen önemli verilerin yedeklenmesine dikkat edin.

1 sunucuda sadece çok veri diski vardır, veriler parça halinde birden fazla veri diskinde depolanır.

Bir veri bloğu, belirtilen K veri bloğu ve M doğrulama bloğuna bölünür, en fazla K veri bloğu kaybolabilir, en fazla M doğrulama bloğu kaybolabilir.

Aşağıdaki şekilde örnek:

<img src="./images/single-node-multiple-disk.jpg" alt="RustFS Single Node Multiple Disk Mode" />




## İki, Ön Koşullar

1. İşletim sistemi sürümü;

2. Güvenlik duvarı;

3. Bellek koşulları;

4. Zaman senkronizasyonu;

5. Kapasite planlama;

6. Disk planlama;

7. Dosya sistemi seçimi;


### 2.1. İşletim Sistemi Sürümü

Linux kernel 4.x ve üzeri sürümleri öneriyoruz. Çünkü 5.x / 6.x sürümleri daha iyi IO throughput ve ağ performansı sağlayabilir.

RustFS kurmak için Ubuntu 22.04 ve RHEL8.x kullanabilirsiniz.

### 2.2 Güvenlik Duvarı

Linux sistem varsayılan olarak güvenlik duvarını açar, aşağıdaki komutla güvenlik duvarı durumunu görüntüleyebilirsiniz:

```bash
systemctl status firewalld
```

Güvenlik duvarı durumunuz "active" ise, aşağıdaki komutla güvenlik duvarını devre dışı bırakabilirsiniz:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

Veya RustFS'nin 9000 portunu açabilirsiniz:

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```

Dağıtımdaki tüm RustFS sunucuları **mutlaka** aynı dinleme portunu kullanmalıdır. 9000 portunu kullanıyorsanız, diğer sunucuların tüm portları 9000 portu olmalıdır.


### 2.3 Bellek Koşulları

RustFS test ortamını çalıştırmak için en az 2 GB bellek gerekir, üretim ortamı minimum 128 GB bellek gerekir.

### 2.4 Zaman Senkronizasyonu

Çok düğümlü tutarlılık mutlaka zaman sunucusu kullanarak zaman tutarlılığını korumalıdır, aksi takdirde hizmet başlatılamama durumu oluşabilir. İlgili zaman sunucusu örneğin `ntp`, `timedatectl` veya `timesyncd` kullanımı.

RustFS zaman senkronizasyonu gerekir, aşağıdaki komutla zaman senkronizasyon durumunu kontrol edebilirsiniz:

```bash
timedatectl status
```

Durum "synchronized" ise, zaman senkronizasyonu normaldir.


### 2.5 Kapasite ve EC Planlaması

Nesne depolama kapasitesini planlarken aşağıdakilere göre planlamanızı öneriyoruz:

- İlk veri miktarı: Bir kerede ne kadar veriyi taşımayı veya depolamayı planlıyorsunuz? (örnek: 500 TB)
- Veri artış miktarı: Günlük/haftalık/aylık veri artış kapasitesi;
- Planlama döngüsü: Bu donanım planlamasının ne kadar süre desteklemesini istiyorsunuz? (öneri: 3 yıl)
- Şirketinizin donanım yenileme ve güncelleme döngüsünü düşünün.

EC (Erasure Coding) planlaması şu şekildedir:

| Senaryo	| Önerilen Doğrulama Seviyesi |	Açıklama |
|  -  |  - |  - | 
| Standart üretim ortamı	| EC:4	| En fazla 4 disk (veya düğüm) arızasını tolere edebilir, güvenilirlik ve depolama verimliliği arasında iyi denge sağlar.| 
| Yüksek kullanılabilirlik gereksinimleri	| EC:4 - 8 | veya daha yüksek	Veri kullanılabilirliği gereksinimleri son derece yüksek senaryolar için uygun, ancak daha fazla depolama alanı fedakarlığı yapar.| 
| Geliştirme test ortamı	| EC:2|  Temel redundancy koruması sağlar, kritik olmayan işler için uygundur.| 


### 2.6 Disk Planlaması

NFS yüksek IO durumunda hayalet yazma ve kilit problemleri ürettiği için, RustFS kullanırken **NFS kullanımı yasaktır** RustFS'nin alt yapı depolama ortamı olarak. Resmi olarak **JBOD (Just a Bunch of Disks)** modunu, yani basit disk bağlama kullanmanızı şiddetle önerir. Bu, fiziksel disklerin doğrudan, bağımsız olarak işletim sistemine sunulması, veri redundancy ve korumasından RustFS yazılım katmanının sorumlu olması anlamına gelir.


Sebepleri şu şekildedir:

- **Daha iyi performans:** RustFS'nin Erasure Coding motoru yüksek oranda optimize edilmiştir, birden fazla diski doğrudan eşzamanlı okuma-yazma yapabilir, donanım RAID kontrolcüsünden daha yüksek throughput sağlar. Donanım RAID performans darboğazı olur.
- **Daha düşük maliyet:** Pahalı RAID kart gereksinimi yoktur, donanım satın alma maliyetini düşürür.
- **Daha basit yönetim:** RustFS tarafından birleşik disk yönetimi, depolama katmanı işletimini basitleştirir.
- **Daha hızlı arıza kurtarma:** RustFS healing süreci geleneksel RAID rebuild'den daha hızlıdır ve küme performansına etkisi daha azdır.

Resmi olarak disk üzerinde NVMe SSD'yi depolama ortamınız olarak kullanmanızı, daha yüksek performans ve throughput kapasitesi sağlamak için önerir.

### 2.7 Dosya Sistemi Seçimi

RustFS resmi disk dosya sistem formatında, RustFS resmi tüm depolama için kullanılan disklerde XFS dosya sistemi kullanımını şiddetle önerir. RustFS'nin geliştirilmesi ve testi XFS temelinde yapılır, en iyi performans ve kararlılığı sağlar. ext4, BTRFS veya ZFS gibi diğer dosya sistemlerini önermiyor, çünkü performans düşüşüne veya öngörülemeyen problemlere yol açabilirler.

RustFS yüksek eşzamanlılık, yüksek performans için tasarlanmış nesne depolama sistemidir. İstemciler büyük nesneleri yüklediğinde veya indirdiğinde, RustFS bunları parçalar ve paralel şekilde eşzamanlı olarak erasure set'teki birden fazla diske okuma-yazma yapar.

XFS'nin avantajları: XFS (eXtents File System) tasarımından itibaren yüksek performans ve ölçeklenebilirlik için yaratılmıştır. Büyük dosya işleme ve yüksek eşzamanlı I/O senaryolarında son derece üstün performans gösterir. İç log ve veri yapıları (B+ ağaç gibi) büyük miktarda paralel okuma-yazma isteklerini verimli şekilde işleyebilir, bu RustFS'nin çalışma moduyla mükemmel uyum sağlar. Buna karşın ext4 gibi dosya sistemleri son yıllarda performansta büyük gelişme gösterse de, aşırı eşzamanlı yük karşısında XFS genellikle daha kararlı, daha üstün throughput sağlayabilir.

Nesne depolama genellikle devasa dosya miktarı ve büyük tek dosyaları (TB seviyesi) işlemesi gerekir, XFS 64 bit dosya sistemidir, son derece büyük dosya boyutu (8 EB'ye kadar) ve dosya sistemi ölçeğini destekleyebilir. Meta veri yönetimi çok verimlidir, tek dizin altında milyonlarca dosya olsa bile performans düşüşü diğer dosya sistemlerinden çok daha azdır. Bu RustFS'nin her nesneyi (veya nesnenin belirli versiyonunu) arka uç dosya sisteminde bağımsız dosya olarak depolaması için kritik önem taşır.

RustFS yeni nesne veya nesne versiyonları yazarken, yazma performansını garanti etmek ve dosya parçalanmasını azaltmak için alan rezervasyonu yapar, XFS fallocate adında verimli API sağlar, uygulamaların sürekli disk alanı rezerve etmesine izin verir. RustFS bu özelliği kullanarak, dosya yazmadan önce gerekli alanı ayırır, yazma süreci sırasında dinamik genişleme ve meta veri güncellemesinden kaynaklanan performans kaybını önler, aynı zamanda dosya parçalanmasını en aza indirir, sonraki okuma performansını garanti eder.

Diski daha iyi keşfetmek için, xfs dosya sistem formatlamasında **Label** etiketlerini kullanarak diskleri etiketlemenizi öneriyoruz.

İlk olarak, disk sisteminin durumuna bakılması gerekir:

```
sudo lsblk

NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    0 465.7G  0 disk
├─sda1        8:1    0   512M  0 part /boot/efi
└─sda2        8:2    0 465.2G  0 part /
nvme0n1           8:16   0   3.7T  0 disk  <-- if this is our format new disk
nvme1n1           8:32   0   3.7T  0 disk  <-- if this is our format new disk
nvme2n1          8:48   0   3.7T   0  disk
```

Spesifik formatlama komutu şu şekildedir:

```
sudo mkfs.xfs  -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

Formatlama sırasında performansı optimize etmek için bazı önerilen seçenekler ekleyebiliriz:
- -L \<label\>: Dosya sistemi için etiket (label) ayarlar, sonraki tanıma ve mount işlemleri için kolaylık sağlar.
- -i size=512: RustFS resmi inode boyutunu 512 bayt olarak ayarlamayı önerir, bu büyük miktarda küçük nesne (meta veri) depolama senaryolarında performans avantajı sağlar.
- -n ftype=1: ftype özelliğini açar. Bu dosya sisteminin dizin yapısında dosya tipini kaydetmesine izin verir, readdir ve unlink gibi işlemlerin performansını artırabilir, RustFS için çok faydalıdır.

Mount:

```
# write new line
vim /etc/fstab
LABEL=RUSTFS0 /data/rustfs0   xfs   defaults,noatime,nodiratime   0   0

#save & exit

# mount disk
sudo mount -a 
```

## Üç, Kullanıcı Adı Yapılandırması

RustFS başlatma için, RustFS hizmetini başlatmak üzere özel giriş yetkisi olmayan kullanıcı yapılandırmanızı öneriyoruz. rustfs.service başlatma kontrol scriptinde.

1. **Varsayılan başlatma hesabını değiştirme** : Varsayılan kullanıcı ve kullanıcı grubu `root` ve `root`, eğer varsayılan `root` ve `root` kullanmak istiyorsanız, herhangi bir değişiklik yapmanıza gerek yoktur.
2. **Varsayılan başlatma hesabını değiştirme** : groupadd ve useradd komutlarını kullanarak kullanıcı ve grup oluşturabilir, ekledikten sonra systemctl başlatma yapılandırma dosyasının kullanıcı adı ve şifresini değiştirebilirsiniz.


Aşağıdaki örnek kullanıcı, grup oluşturma ve RustFS belirtilen veri dizinine erişim yetkisi ayarlama (isteğe bağlı):

```
groupadd -r rustfs-user
useradd -M -r -g rustfs-user rustfs-user
chown rustfs-user:rustfs-user  /data/rustfs*
```

Not:
- Eğer rustfs-user kullanıcı ve grubu oluşturulursa `/etc/systemd/system/rustfs.service`'teki User ve Group'u `rustfs-user` olarak değiştirmek gerekir;
- ` /data/rustfs*`'ı belirtilen mount dizini olarak ayarlayın.

## Dört, Kurulum Paketi İndirme

Lütfen önce wge veya curl kurarak rustfs kurulum paketini indirin.

```bash
# İndirme adresi
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip
unzip rustfs-linux-x86_64-musl-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

### Beş, Çevre Değişkenleri Yapılandırması

1. Yapılandırma dosyası oluşturma


```bash
# Tek makine çok disk modu
sudo tee /etc/default/rustfs <<EOF
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ENABLE=true
RUST_LOG=error
RUSTFS_OBS_LOG_DIRECTORY="/var/logs/rustfs/"
EOF
```



2. Depolama dizini oluşturma
```bash
sudo mkdir -p /data/rustfs{0..3} /var/logs/rustfs /opt/tls
sudo chmod -R 750 /data/rustfs* /var/logs/rustfs
```



### Yedi, Sistem Hizmeti Yapılandırması
1. systemd hizmet dosyası oluşturma

```bash
sudo tee /etc/systemd/system/rustfs.service <<EOF
[Unit]
Description=RustFS Object Storage Server
Documentation=https://rustfs.com/docs/
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
NotifyAccess=main
User=root
Group=root

WorkingDirectory=/usr/local
EnvironmentFile=-/etc/default/rustfs
ExecStart=/usr/local/bin/rustfs \$RUSTFS_VOLUMES

LimitNOFILE=1048576
LimitNPROC=32768
TasksMax=infinity

Restart=always
RestartSec=10s

OOMScoreAdjust=-1000
SendSIGKILL=no

TimeoutStartSec=30s
TimeoutStopSec=30s

NoNewPrivileges=true
ProtectSystem=full
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectClock=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictRealtime=true

# service log configuration
StandardOutput=append:/var/logs/rustfs/rustfs.log
StandardError=append:/var/logs/rustfs/rustfs-err.log

[Install]
WantedBy=multi-user.target
EOF
```

2. Hizmet yapılandırmasını yeniden yükleme
```bash
sudo systemctl daemon-reload
```

### Sekiz, Hizmet Başlatma ve Doğrulama
1. Hizmeti başlatma ve otomatik başlatmayı ayarlama
```bash
sudo systemctl enable --now rustfs
```

2. Hizmet durumunu doğrulama
```bash
systemctl status rustfs
```

3. Hizmet portunu kontrol etme
```bash
netstat -ntpl
```


4. Log dosyalarını görüntüleme
```bash
tail -f /var/logs/rustfs/rustfs*.log
```


5. Yönetim konsoluna erişim

Sunucunun IP adresi ve portunu girerek yönetim konsoluna erişmeyi deneyin, görülen arayüz şu şekildedir:

![Console](./images/console.jpg)

