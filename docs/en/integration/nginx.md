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
```

## 3. Multi-Machine Load Balancing

If you need to add multiple RustFS servers in a distributed environment, please adjust DNS resolution or local Hosts addresses in advance, and modify and add servers.

```nginx
upstream rustfs {
   least_conn;
   server 10.0.0.1:9000;
   server 10.0.0.2:9000;
   server 10.0.0.3:9000;
   server 10.0.0.4:9000;
}
```
