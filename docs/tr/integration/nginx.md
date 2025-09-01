---
title: "RustFS Nginx Ters Proxy Yapılandırması"
description: "RustFS için Nginx ters proxy yapılandırmasının uygulanması"
---

# RustFS ile Nginx Entegrasyonu

RustFS ile Nginx entegrasyonu sayesinde aşağıdaki işlevler gerçekleştirilebilir:

1. Kapsamlı log toplama;
2. Yük dengeleme yapılandırması;
3. Özel URL yönlendirme ve çözümleme;
4. Özel URL engelleme.

## Bir. RustFS Nginx Ön Koşulları

Entegrasyonun sorunsuz ilerlemesi için önceden hazırlamanız gerekenler:

1. RustFS Server normal şekilde kurulmuş ve doğru başlatılmış olmalı;
2. RustFS portunu belirleyin;
3. Nginx tanımlaması doğru olmalı;
4. RustFS tek makine veya cluster IP adreslerini onaylayın.

## İki. Yapılandırma Dosyası

~~~
upstream rustfs {
   least_conn;
   server 127.0.0.1:9000;
}
server {
   listen       8000;
   listen  [::]:8000;
   server_name  _;

   # Allow special characters in headers
   ignore_invalid_headers off;
   # Allow any size file to be uploaded.
   # Set to a value such as 1000m; to restrict file size to a specific value
   client_max_body_size 0;
   # Disable buffering
   proxy_buffering off;
   proxy_request_buffering off;

   location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      proxy_connect_timeout 300;
      # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      chunked_transfer_encoding off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      proxy_pass http://rustfs; # This uses the upstream directive definition to load balance
   }
}
~~~

## Üç. Çok Makineli Yük Dengeleme

Dağıtılmış ortamda birden fazla RustFS sunucusu eklemeniz gerekiyorsa, DNS çözümlemesi veya yerel Hosts adreslerini önceden ayarlayın, server'ları değiştirin ve ekleyin.

~~~
upstream rustfs {
   least_conn;
   server 10.0.0.1:9000;
   server 10.0.0.2:9000;
   server 10.0.0.3:9000;
   server 10.0.0.4:9000;
}
~~~