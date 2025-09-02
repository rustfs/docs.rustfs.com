---
title: "RustFS Nginx Ters Proxy Yapılandırması"
description: "RustFS için Nginx ters proxy yapılandırması"
---


# RustFS ile Nginx Entegrasyonu

RustFS ile Nginx entegrasyonu sayesinde aşağıdaki işlevler gerçekleştirilebilir:

1. Günlüklerin kapsamlı toplanması;
2. Yük dengeleme yapılandırması;
3. Özel URL yönlendirme ve çözümleme;
4. Özel URL yasaklama。

## Bir、RustFS Nginx Ön Koşulları

Entegrasyonun sorunsuz ilerlemesi için önceden hazırlamanız gerekenler:

1. RustFS Server normal kurulmuş ve doğru şekilde başlatılmış olmalı;
2. RustFS'in portu belirlenmiş olmalı;
3. Nginx doğru tanımlanmış olmalı;
4. RustFS tek makine veya küme IP adresleri onaylanmış olmalı。

## İki、Yapılandırma Dosyası

~~~


upstream rustfs {
   least_conn;
   server 127.0.0.1:9000;
}
server {
   listen       8000;
   listen  [::]:8000;
   server_name  _;

   # Başlıklarda özel karakterlere izin ver
   ignore_invalid_headers off;
   # Herhangi bir boyutta dosyanın yüklenmesine izin ver.
   # Dosya boyutunu belirli bir değerle sınırlamak için 1000m gibi bir değere ayarlayın
   client_max_body_size 0;
   # Tamponlamayı devre dışı bırak
   proxy_buffering off;
   proxy_request_buffering off;

   location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      proxy_connect_timeout 300;
      # Varsayılan HTTP/1'dir, keepalive sadece HTTP/1.1'de etkindir
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      chunked_transfer_encoding off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";




      proxy_pass http://rustfs; # Bu, yük dengeleme için upstream direktif tanımını kullanır
   }
}

~~~

## Üç、Çok Makineli Yük Dengeleme

Dağıtık ortamda birden fazla RustFS sunucusu eklemek istiyorsanız, lütfen önceden DNS çözümlemesini veya yerel Hosts adreslerini ayarlayın, server'ı değiştirin ve artırın.

~~~
upstream rustfs {
   least_conn;
   server 10.0.0.1:9000;
   server 10.0.0.2:9000;
   server 10.0.0.3:9000;
   server 10.0.0.4:9000;
}
~~~
