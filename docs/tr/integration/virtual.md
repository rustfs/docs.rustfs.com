---
title: "Virtual Modu Yapılandırması"
description: "RustFS S3'ün Virtual modu yapılandırması ve path style modu yapılandırması"
---

# RustFS S3 Modu Tanıtımı

RustFS %100 S3 depolama protokolü gereksinimlerine uygundur. S3 depolama sırasında, istek yolları iki moda ayrılır:

1. Sanal Ana Bilgisayar Modu (Virtual Host Style)

2. Yol Modu (Path Style)

Bu iki modun temel farkı, depolama bucket'ının (Bucket) adının istek URL'sine nasıl yerleştirileceğidir.

## 1. Path style modu

Başlatma sırasında, varsayılan olarak Path style modu kullanılır. Path style modunun özelliği, bucket adının Endpoint erişim noktasından sonra gelmesidir. Ana bilgisayar adının rustfs.com, bucket adının test olduğunu varsayarsak, Path style birleştirme yolu şöyle olur:

~~~
http://rustfs.com/test
~~~

Not:
- Varsayılan olarak Path style'dır
- Kullanıcının herhangi bir ayar yapmasına gerek yoktur, Path style modudur

## 2. Virtual Host Style

Başlatma sırasında, mod Virtual Host Style olarak değiştirilebilir. Virtual Host Style modunun özelliği, bucket adının domain adının bir parçası olmasıdır. Ana bilgisayar adının rustfs.com, bucket adının test olduğunu varsayarsak, Virtual Host Style birleştirme yolu şöyle olur:

~~~
http://test.rustfs.com/
~~~

Virtual Host Style ayarlama adımları şunlardır:

1. Domain adınızı belirtilen sunucuya wildcard olarak çözümleyin. Domain adının rustfs.com olduğunu varsayarsak, *.rustfs.com'u belirtilen sunucuya çözümleyebilirsiniz;
2. Linux ise `/etc/default/rustfs` dosyasını değiştirin, Docker veya Kubernetes ise yaml veya başlatma yapılandırma parametrelerini değiştirin;
3. Yapılandırma dosyasına `RUSTFS_SERVER_DOMAINS` ekleyin, bu parametreyi `RUSTFS_SERVER_DOMAINS = "rustfs.com"` olarak ayarlayın;
4. Yapılandırma dosyasını kaydedin, ardından servisi yeniden başlatmak için `systemctl restart rustfs` kullanın.
