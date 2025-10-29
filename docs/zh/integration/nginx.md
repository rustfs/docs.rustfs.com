---
title: "RustFS Nginx反向代理配置"
description: "为 RustFS实现Nginx反向代理的配置"
---


# RustFS 与Nginx 集成

通过RustFS与Nginx集成，可以实现如下功能：

1. 日志的全面收集；
2. 负载均衡配置；
3. 自定义的URL转发和解析；
4. 自定义的URL禁止。


## 一、RustFS Nginx 前置条件

为了让集成顺利进行，你需要提前准备了：

1. RustFS Server 安装正常，并且正确启动；
2. 确定RustFS的端口；
3. Nginx标识正确；
4. 确认RustFS 单机或者集群的IP地址。



## 二、 配置文件


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


## 三、多机负载均衡


若需要在分布式环境中增加多个RustFS服务器，请提前调整好DNS解析或者本地的Hosts地址，修改和增加 server即可。

~~~
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
~~~


## 四、 专用DNS模式

为 RustFS 服务创建或配置一个专用的 DNS 名称。

对于 RustFS 服务器 S3 API，将请求代理到该域名的/api/ 目录。 对于 RustFS 控制台的 Web GUI，将请求代理到 / 根路径。

例如， 给定主机名 www.rustfs.dev :

- Endpoint的地址为 `www.rustfs.dev/api/`
- Console的地址为  `www.rustfs.dev`


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