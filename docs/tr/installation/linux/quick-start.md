---
title: "Linux'ta RustFS Hızlı Kurulumu"
description: "RustFS tek tık kurulum paketi kullanarak Linux ortamında hızlı dağıtım kurulumu"
---

# Linux Hızlı RustFS

<a id="mode"></a>

## Bir, Kurulumdan Önce Okunması Gerekenler

Bu sayfa RustFS'nin üç kurulum modunun tüm dokümantasyonunu ve açıklamalarını içerir. Bunlardan, çok makineli çok diskli mod kurumsal düzeyde kullanılabilir performans, güvenlik ve ölçeklenebilirlik içerir. Ve üretim iş yükleri için gereken mimari diyagramını sağlar. Lütfen kurmadan önce okuyun, başlatma modumuz ve kontrol listemiz aşağıdaki gibidir:

1. Lütfen üç kurulum başlatma modunuzu belirleyin:

    - [Tek makine tek disk modu (SNSD)](./single-node-single-disk.md)
    - [Tek makine çok disk modu (SNMD)](./single-node-multiple-disk.md)
    - [Çok makine çok disk modu (MNMD)](./multiple-node-multiple-disk.md)

2. [Kurulum öncesi kontrol](../checklists/index.md), tüm göstergelerin üretim rehber özelliklerine uygun olduğundan emin olun, üretim standardına ihtiyaç yoksa bu rehberi okumayabilirsiniz;


## İki, Hızlı Kurulum

Hızlı kurulum scriptini kullanarak, **SNSD(tek makine tek disk)** modu hızlı kurulumu gerçekleştirilir, script aşağıdaki gibidir:

~~~
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
~~~


Notlar:
1. Kurulum varsayılan portu `9000` portudur;
2. Kurulum varsayılan yolu `/data/rustfs0`, eğer bağımsız disk varsa lütfen önceden mount edin;
3. Lütfen önceden `unzip` kurun, RustFS zip kurulum paketinin normal şekilde açılabilmesini sağlamak için.


Hızlı kurulumun GitHub adresi: https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh



## Üç, Diğer Dikkat Edilmesi Gerekenler

1. Lütfen güvenlik duvarının açık olup olmadığını kontrol edin;
2. Lütfen NTP zaman sunucusunun tutarlılığını belirleyin;
3. Lütfen mevcut diskin kapasitesi ve disk planlamasını belirleyin;
4. Lütfen işletim sisteminin çekirdek sürümünü IO-Uring destekleyecek şekilde onaylayın;
5. Lütfen SELinux'u kontrol edin.

