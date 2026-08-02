---
title: "HAProxy"
description: "Deploy RustFS behind HAProxy with separate HTTPS routes for the S3 API and Console."
---

Use **HAProxy** to terminate TLS and route separate hostnames to the RustFS S3 API and Console. This deployment runs HAProxy and a single-node RustFS instance with Docker Compose. You need Docker Engine, Docker Compose, two DNS records, and a TLS certificate that covers both hostnames.

This guide uses these example hostnames:

- `s3.example.com` for the S3 API
- `console.example.com` for the Console

Replace them with hostnames that resolve to the Docker host.

:::warning[Serve S3 from the root path]

Do not publish the S3 API under a path such as `/s3/`. AWS Signature Version 4 includes the request path and host, so rewriting either value can invalidate signed requests.

:::

## 1. Create the deployment directories

Create directories for the HAProxy configuration and TLS certificate:

```bash
mkdir -p rustfs-haproxy/config rustfs-haproxy/certs
cd rustfs-haproxy
```

HAProxy expects the certificate chain and private key in one PEM file. Combine them in this order:

```bash
cat fullchain.pem privkey.pem > certs/rustfs.pem
chmod 600 certs/rustfs.pem
```

The certificate must cover both public hostnames.

## 2. Set RustFS credentials

Create an environment file and replace both credential placeholders:

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Do not commit this file or the certificate private key to source control.

## 3. Configure HAProxy

Create the HAProxy configuration:

```text title="config/haproxy.cfg"
global
    log stdout format raw local0

defaults
    log global
    mode http
    option httplog
    timeout connect 10s
    timeout client 1h
    timeout server 1h
    timeout http-request 30s
    timeout tunnel 1h

frontend http
    bind :80
    http-request redirect scheme https code 301

frontend https
    bind :443 ssl crt /usr/local/etc/haproxy/certs/rustfs.pem alpn h2,http/1.1

    acl host_s3 hdr(host) -i s3.example.com
    acl host_console hdr(host) -i console.example.com

    use_backend rustfs_s3 if host_s3
    use_backend rustfs_console if host_console
    default_backend reject_unknown_host

backend reject_unknown_host
    http-request deny deny_status 404

backend rustfs_s3
    balance leastconn
    option httpchk GET /health/ready
    http-check expect status 200
    server rustfs rustfs:9000 check inter 10s fall 3 rise 2

backend rustfs_console
    balance leastconn
    cookie RUSTFS_CONSOLE insert indirect nocache secure httponly
    option httpchk GET /rustfs/console/health
    http-check expect status 200
    server rustfs rustfs:9001 check inter 10s fall 3 rise 2 cookie rustfs
```

HAProxy preserves the incoming host and request path unless you explicitly rewrite them. The long client, server, and tunnel timeouts accommodate streaming S3 operations and Console WebSocket connections.

The Console backend sets an affinity cookie. With one RustFS server it has no routing effect, but keeping it in the base configuration makes the behavior consistent when you add nodes.

## 4. Create the Compose file

Create the HAProxy and RustFS services:

```yaml title="compose.yaml"
services:
  haproxy:
    image: haproxy:3.2-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro
      - ./certs:/usr/local/etc/haproxy/certs:ro
    networks:
      - rustfs

  rustfs:
    image: rustfs/rustfs:latest
    restart: unless-stopped
    environment:
      RUSTFS_ACCESS_KEY: ${RUSTFS_ACCESS_KEY}
      RUSTFS_SECRET_KEY: ${RUSTFS_SECRET_KEY}
      RUSTFS_CONSOLE_ENABLE: "true"
      RUSTFS_ADDRESS: ":9000"
      RUSTFS_CONSOLE_ADDRESS: ":9001"
      RUSTFS_OBS_LOGGER_LEVEL: error
      RUSTFS_OBS_LOG_DIRECTORY: /var/log/rustfs/
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

Only HAProxy publishes host ports. RustFS ports `9000` and `9001` remain reachable inside the Compose network.

## 5. Validate and start the deployment

Render the Compose configuration and start RustFS:

```bash
docker compose config
docker compose up -d rustfs
```

Validate the HAProxy configuration with the same image used by the deployment:

```bash
docker compose run --rm --no-deps haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
```

Start HAProxy and check both services:

```bash
docker compose up -d haproxy
docker compose ps
```

If a service does not become healthy, inspect its logs:

```bash
docker compose logs haproxy
docker compose logs rustfs
```

## 6. Verify both endpoints

Verify the API and Console through their public HTTPS hostnames:

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Configure S3 clients with `https://s3.example.com` as the endpoint and enable path-style addressing. Open `https://console.example.com` to sign in to the Console.

When you replace a renewed `certs/rustfs.pem`, validate the configuration and recreate the HAProxy container to load it:

```bash
docker compose run --rm --no-deps haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
docker compose up -d --force-recreate haproxy
```

## Multi-node backends

For a distributed RustFS deployment, add every RustFS node to both backends:

```text title="config/haproxy.cfg"
backend rustfs_s3
		balance leastconn
		option httpchk GET /health/ready
		http-check expect status 200
		server node1 node1.example.net:9000 check inter 10s fall 3 rise 2
		server node2 node2.example.net:9000 check inter 10s fall 3 rise 2
		server node3 node3.example.net:9000 check inter 10s fall 3 rise 2
		server node4 node4.example.net:9000 check inter 10s fall 3 rise 2

backend rustfs_console
		balance leastconn
		cookie RUSTFS_CONSOLE insert indirect nocache secure httponly
		option httpchk GET /rustfs/console/health
		http-check expect status 200
		server node1 node1.example.net:9001 check inter 10s fall 3 rise 2 cookie node1
		server node2 node2.example.net:9001 check inter 10s fall 3 rise 2 cookie node2
		server node3 node3.example.net:9001 check inter 10s fall 3 rise 2 cookie node3
		server node4 node4.example.net:9001 check inter 10s fall 3 rise 2 cookie node4
```

The Console cookie keeps an in-progress OpenID Connect login on the RustFS node that created its `state`. Keep port `9000` open directly between RustFS nodes because internal node RPC uses the same listener.

## Next steps

- [Configure an S3 client](/developer/examples/aws-cli)
- [Enable virtual-hosted-style bucket URLs](/integration/virtual)
- [Review health and readiness endpoints](/operations/status-check)