---
title: "RustFS Nginx 역방향 프록시 구성"
description: "RustFS를 위한 Nginx 역방향 프록시 구성"
---


# RustFS와 Nginx 통합

RustFS와 Nginx를 통합하면 다음과 같은 기능을 구현할 수 있습니다:

1. 포괄적인 로그 수집
2. 로드 밸런싱 구성
3. 사용자 정의 URL 전달 및 분석
4. 사용자 정의 URL 차단


## 1. RustFS Nginx 전제 조건

통합이 원활하게 진행되려면 다음을 미리 준비해야 합니다:

1. RustFS Server가 정상적으로 설치되고 올바르게 시작됨
2. RustFS 포트 확인
3. Nginx 식별이 올바름
4. RustFS 단일 서버 또는 클러스터의 IP 주소 확인



## 2. 구성 파일


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


## 3. 다중 서버 로드 밸런싱


분산 환경에서 여러 RustFS 서버를 추가해야 하는 경우, DNS 해석 또는 로컬 호스트 주소를 미리 조정하고 server를 수정 및 추가하면 됩니다.

~~~
upstream rustfs {
   least_conn;
   server 10.0.0.1:9000;
   server 10.0.0.2:9000;
   server 10.0.0.3:9000;
   server 10.0.0.4:9000;
}
~~~
