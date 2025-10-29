---
title: "RustFS Nginx Reverse Proxy Configuration"
description: "Configuration for implementing Nginx reverse proxy with RustFS"
---

# RustFS Integration with Nginx

Through the integration of RustFS with Nginx, the following functions can be achieved:

1. Comprehensive log collection;
2. Load balancing configuration;
3. Custom URL forwarding and parsing;
4. Custom URL blocking.

## 1. RustFS Nginx Prerequisites

To ensure smooth integration, you need to prepare in advance:

1. RustFS Server is properly installed and correctly started;
2. Determine RustFS port;
3. Nginx is properly identified;
4. Confirm RustFS single machine or cluster IP addresses.

## 2. Configuration File

```nginx
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


```

## 3. Multi-Machine Load Balancing

If you need to add multiple RustFS servers in a distributed environment, please adjust DNS resolution or local Hosts addresses in advance, and modify and add servers.

```
upstream rustfs {
   least_conn;
   server 10.0.0.1:9000;
   server 10.0.0.2:9000;
   server 10.0.0.3:9000;
   server 10.0.0.4:9000;
}


upstream rustfs-console {
   least_conn;
   server 10.0.0.1:9001;
   server 10.0.0.2:9001;
   server 10.0.0.3:9001;
   server 10.0.0.4:9001;
}
```


## 4. Dedicated DNS Mode
Create or configure a dedicated DNS name for the RustFS service.

Proxy requests for the RustFS server's S3 API to the /api/ path of this domain. Proxy requests for the RustFS Console Web GUI to the root path (/).
For example, given the hostname www.rustfs.dev:
Endpoint: `www.rustfs.dev/api/`
Console: `www.rustfs.dev`


~~~
server {
   listen       443;
   listen  [::]:443;
   http2 on;
   server_name  www.rustfs.dev;

   # Allow special characters in headers
   ignore_invalid_headers off;
   # Allow any size file to be uploaded.
   # Set to a value such as 1000m; to restrict file size to a specific value
   client_max_body_size 0;
   # Disable buffering
   proxy_buffering off;
   proxy_request_buffering off;

# S3 API

   location /api {
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

      proxy_pass http://127.0.0.1:9000;
   }

# Console

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
      proxy_pass http://127.0.0.1:9001; 
   }
}
~~~