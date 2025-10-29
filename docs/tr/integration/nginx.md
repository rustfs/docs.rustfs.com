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

upstream rustfs-console {
   least_conn;
   server 127.0.0.1:9001;
}


server {
   listen       80;
   listen  [::]:80;
   server_name  YOUR_DOMAIN;

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

      # Disable Nginx from converting HEAD to GET
      # proxy_cache_convert_head off;

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


server {
   listen       8080;
   listen  [::]:8080;
   server_name  YOUR_DOMAIN;

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

      # Disable Nginx from converting HEAD to GET
      # proxy_cache_convert_head off;

      proxy_connect_timeout 300;
      # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      chunked_transfer_encoding off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";




      proxy_pass http://rustfs-console; # This uses the upstream directive definition to load balance
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
