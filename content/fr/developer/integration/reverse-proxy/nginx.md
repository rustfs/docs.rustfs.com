---
title: "Nginx"
description: "Deploy RustFS behind Nginx with separate HTTPS endpoints for the S3 API and Console."
---

Use **Nginx** to terminate TLS and route separate hostnames to the RustFS S3 API and Console. This deployment runs Nginx and a single-node RustFS instance with Docker Compose. You need Docker Engine, Docker Compose, two DNS records, and a TLS certificate that covers both hostnames.

This guide uses these example hostnames:

- `s3.example.com` for the S3 API
- `console.example.com` for the Console

Replace them with hostnames that resolve to the Docker host.

:::warning[Serve S3 from the root path]

Do not publish the S3 API under a path such as `/s3/`. AWS Signature Version 4 includes the request path and host, so rewriting either value can invalidate signed requests.

:::

## 1. Create the deployment directories

Create directories for the Nginx configuration and TLS certificate:

```bash
mkdir -p rustfs-nginx/sites rustfs-nginx/certs
cd rustfs-nginx
```

Copy your certificate chain and private key into `certs/`:

```text
rustfs-nginx/
├── certs/
│   ├── fullchain.pem
│   └── privkey.pem
└── sites/
```

Restrict access to the private key:

```bash
chmod 600 certs/privkey.pem
```

## 2. Set RustFS credentials

Create an environment file and replace both credential placeholders:

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Do not commit this file to source control.

## 3. Configure Nginx

Create the Nginx configuration:

```nginx title="sites/rustfs.conf"
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      '';
}

upstream rustfs_s3 {
    server rustfs:9000;
    keepalive 32;
}

upstream rustfs_console {
    server rustfs:9001;
    keepalive 16;
}

server {
    listen 80;
    listen [::]:80;
    server_name s3.example.com console.example.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name s3.example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    ignore_invalid_headers off;
    client_max_body_size 0;
    proxy_buffering off;
    proxy_request_buffering off;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection '';
        proxy_cache_convert_head off;
        proxy_connect_timeout 300s;
        chunked_transfer_encoding off;
        proxy_pass http://rustfs_s3;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name console.example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    client_max_body_size 0;
    proxy_buffering off;
    proxy_request_buffering off;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_connect_timeout 300s;
        proxy_pass http://rustfs_console;
    }
}
```

The S3 server preserves the original host and request path, disables request buffering for streaming uploads, and does not convert signed `HEAD` requests. The Console server also forwards WebSocket upgrade headers.

## 4. Create the Compose file

Create the deployment definition:

```yaml title="compose.yaml"
services:
  nginx:
    image: nginx:1.25-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./sites/rustfs.conf:/etc/nginx/conf.d/rustfs.conf:ro
      - ./certs:/etc/nginx/certs:ro
    networks:
      - rustfs

  rustfs:
    image: rustfs/rustfs:latest
    restart: unless-stopped
    environment:
      RUSTFS_ACCESS_KEY: ${RUSTFS_ACCESS_KEY}
      RUSTFS_SECRET_KEY: ${RUSTFS_SECRET_KEY}
      RUSTFS_CONSOLE_ENABLE: "true"
      RUSTFS_ADDRESS: "0.0.0.0:9000"
      RUSTFS_CONSOLE_ADDRESS: "0.0.0.0:9001"
    expose:
      - "9000"
      - "9001"
    volumes:
      - rustfs-data:/data
    healthcheck:
      test: ["CMD-SHELL", "curl --fail http://127.0.0.1:9000/health/ready && curl --fail http://127.0.0.1:9001/rustfs/console/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - rustfs

volumes:
  rustfs-data:

networks:
  rustfs:
```

Only Nginx publishes host ports. RustFS ports `9000` and `9001` remain reachable inside the Compose network.

## 5. Validate and start the deployment

Validate both configuration files before starting the services:

```bash
docker compose config
docker compose up -d rustfs
docker compose run --rm --no-deps nginx nginx -t
```

Start Nginx and check both services:

```bash
docker compose up -d nginx
docker compose ps
```

If a service does not become healthy, inspect its logs:

```bash
docker compose logs nginx
docker compose logs rustfs
```

## 6. Verify both endpoints

Verify the API and Console through their public HTTPS hostnames:

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Configure S3 clients with `https://s3.example.com` as the endpoint and enable path-style addressing. Open `https://console.example.com` to sign in to the Console.

When you replace a renewed certificate or key in `certs/`, validate and reload Nginx without interrupting active connections:

```bash
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

## Multi-node upstreams

For a distributed RustFS deployment, replace the single server in each upstream with all RustFS nodes:

```nginx title="sites/rustfs.conf"
upstream rustfs_s3 {
    least_conn;
    server node1.example.net:9000;
    server node2.example.net:9000;
    server node3.example.net:9000;
    server node4.example.net:9000;
  keepalive 32;
}

upstream rustfs_console {
    ip_hash;
    server node1.example.net:9001;
    server node2.example.net:9001;
    server node3.example.net:9001;
    server node4.example.net:9001;
  keepalive 16;
}
```

The Console upstream uses client affinity because an in-progress OpenID Connect login stores its `state` on one RustFS node. Keep port `9000` open between RustFS nodes because internal node RPC uses the same listener.

## Next steps

- [Configure an S3 client](/developer/examples/aws-cli)
- [Enable virtual-hosted-style bucket URLs](/integration/virtual)
- [Review health and readiness endpoints](/operations/status-check)