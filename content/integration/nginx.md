---
title: "Nginx Reverse Proxy"
description: "Configuration for implementing Nginx reverse proxy with RustFS."
---

# Nginx Integration

Nginx integration enables:

- Log collection.
- Load balancing.
- URL forwarding.
- URL blocking.

## Prerequisites

- RustFS Server is installed and running.
- RustFS port is known.
- Nginx is installed.
- RustFS IP addresses are known.

## Configuration

```nginx title="/etc/nginx/conf.d/rustfs.conf"
upstream rustfs {
   least_conn;
   server 127.0.0.1:9000;
}

upstream rustfs-console {
   least_conn;
   server 127.0.0.1:9001;
}


map $http_upgrade $proxy_set_header_connection {
   # If the Upgrade request header is present, also send `Connection: upgrade` upstream;
   # otherwise send a blank Connection header instead of the default `Connection: close`,
   # preserving upstream keepalives.
   default "upgrade";
   "" "";
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
      proxy_cache_convert_head off;

      proxy_connect_timeout 300;
      # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
      proxy_http_version 1.1;
      chunked_transfer_encoding off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $proxy_set_header_connection;




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
      proxy_cache_convert_head off;

      proxy_connect_timeout 300;
      # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
      proxy_http_version 1.1;
      chunked_transfer_encoding off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $proxy_set_header_connection;




      proxy_pass http://rustfs-console; # This uses the upstream directive definition to load balance
   }
}


```

#### Important Notice

:::warning[Key configuration items]

The `proxy_cache_convert_head off` directive **must be added** to the Nginx configuration for the following reasons:

- By default, Nginx converts HEAD requests to GET requests for caching.
- This conversion will cause S3 V4 signature verification to fail.
- The symptom is `Bucket not found` or `403 Access Denied` error when accessing the storage bucket.

Refer to [Nginx Official Documentation](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_convert_head).

:::

## Multi-Machine Load Balancing

If you need to add multiple RustFS servers in a distributed environment, please adjust DNS resolution or local Hosts addresses in advance, and modify and add servers.

```nginx title="/etc/nginx/conf.d/rustfs.conf (multi-node upstream)"
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


## Dedicated DNS Mode
Create or configure dedicated DNS names for the RustFS service — one hostname for the S3 API and one for the Console.

:::warning[Do not proxy the S3 API under a path prefix]

S3 clients sign the request path (AWS Signature V4). If you expose the API under a prefix such as `/api/`, RustFS receives paths like `/api/<bucket>/...`, interprets `api` as a bucket name, and signature validation fails. Always serve the S3 API from the root of its own hostname.

:::

For example:
S3 endpoint: `s3.rustfs.dev`
Console: `console.rustfs.dev`

~~~nginx title="/etc/nginx/conf.d/rustfs.conf (dedicated DNS)"
map $http_upgrade $proxy_set_header_connection {
   # If the Upgrade request header is present, also send `Connection: upgrade` upstream;
   # otherwise send a blank Connection header instead of the default `Connection: close`,
   # preserving upstream keepalives.
   default "upgrade";
   "" "";
}

# S3 API
server {
   listen       443 ssl;
   listen  [::]:443 ssl;
   http2 on;
   server_name  s3.rustfs.dev;

   ssl_certificate     /etc/nginx/certs/rustfs.dev.pem;
   ssl_certificate_key /etc/nginx/certs/rustfs.dev.key;

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
      chunked_transfer_encoding off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $proxy_set_header_connection;

      proxy_pass http://127.0.0.1:9000;
   }
}

# Console
server {
   listen       443 ssl;
   listen  [::]:443 ssl;
   http2 on;
   server_name  console.rustfs.dev;

   ssl_certificate     /etc/nginx/certs/rustfs.dev.pem;
   ssl_certificate_key /etc/nginx/certs/rustfs.dev.key;

   ignore_invalid_headers off;
   client_max_body_size 0;
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
      chunked_transfer_encoding off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $proxy_set_header_connection;
      proxy_pass http://127.0.0.1:9001;
   }
}
~~~
