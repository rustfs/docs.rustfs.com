---
title: "Caddy"
description: "Deploy RustFS behind Caddy with automatic HTTPS for separate S3 API and Console hostnames."
---

Use **Caddy** to obtain and renew TLS certificates automatically and route separate hostnames to the RustFS S3 API and Console. This deployment runs Caddy and a single-node RustFS instance with Docker Compose. You need Docker Engine, Docker Compose, a public server, and two DNS records that resolve to that server.

This guide uses these example hostnames:

- `s3.example.com` for the S3 API
- `console.example.com` for the Console

Replace them with your public hostnames. Caddy's default ACME challenges require inbound access to ports `80` and `443`.

:::warning[Serve S3 from the root path]

Do not publish the S3 API under a path such as `/s3/`. AWS Signature Version 4 includes the request path and host, so rewriting either value can invalidate signed requests.

:::

## 1. Create the deployment directory

Create a directory for the deployment:

```bash
mkdir rustfs-caddy
cd rustfs-caddy
```

## 2. Set deployment variables

Create an environment file and replace each value:

```ini title=".env"
S3_HOSTNAME=s3.example.com
CONSOLE_HOSTNAME=console.example.com
ACME_EMAIL=admin@example.com
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Use an email address that receives certificate notices. Do not commit `.env` to source control.

## 3. Configure Caddy

Create a Caddyfile with one site block for each RustFS endpoint:

```text title="Caddyfile"
{
		email {$ACME_EMAIL}
}

{$S3_HOSTNAME} {
		reverse_proxy rustfs:9000 {
				health_uri /health/ready
				health_interval 10s
				health_timeout 5s
				health_fails 3
				health_passes 2
				lb_try_duration 5s
		}
}

{$CONSOLE_HOSTNAME} {
		reverse_proxy rustfs:9001 {
				health_uri /rustfs/console/health
				health_interval 10s
				health_timeout 5s
				health_fails 3
				health_passes 2
				lb_try_duration 5s
		}
}
```

Caddy preserves the incoming `Host` header, HTTP method, and request URI by default. It also forwards client information through `X-Forwarded-*` headers and handles Console WebSocket upgrades without additional header rules.

## 4. Create the Compose file

Create the Caddy and RustFS services:

```yaml title="compose.yaml"
services:
  caddy:
    image: caddy:2.10-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    environment:
      S3_HOSTNAME: ${S3_HOSTNAME}
      CONSOLE_HOSTNAME: ${CONSOLE_HOSTNAME}
      ACME_EMAIL: ${ACME_EMAIL}
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config
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
  caddy-data:
  caddy-config:
  rustfs-data:

networks:
  rustfs:
```

The persistent `caddy-data` volume stores certificates, private keys, and ACME account state. Back up this volume and do not share its contents. Only Caddy publishes host ports; RustFS remains reachable inside the Compose network.

## 5. Validate and start the deployment

Render the Compose configuration and start RustFS:

```bash
docker compose config
docker compose up -d rustfs
```

Validate the Caddyfile with the same image used by the deployment:

```bash
docker compose run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile
```

Start Caddy and check both services:

```bash
docker compose up -d caddy
docker compose ps
docker compose logs --follow caddy
```

Caddy obtains certificates in the background and redirects HTTP requests to HTTPS. If issuance fails, confirm that both DNS records resolve to this host, ports `80` and `443` are reachable, and the `caddy-data` volume is writable.

## 6. Verify both endpoints

Verify the API and Console through their public HTTPS hostnames:

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Configure S3 clients with `https://s3.example.com` as the endpoint and enable path-style addressing. Open `https://console.example.com` to sign in to the Console.

## Multi-node upstreams

For a distributed RustFS deployment, list every node in the corresponding site block:

```text title="Caddyfile"
{$S3_HOSTNAME} {
		reverse_proxy node1.example.net:9000 node2.example.net:9000 node3.example.net:9000 node4.example.net:9000 {
				lb_policy least_conn
				health_uri /health/ready
				health_interval 10s
				health_timeout 5s
				lb_try_duration 5s
		}
}

{$CONSOLE_HOSTNAME} {
		reverse_proxy node1.example.net:9001 node2.example.net:9001 node3.example.net:9001 node4.example.net:9001 {
				lb_policy cookie rustfs_console <your-cookie-secret>
				health_uri /rustfs/console/health
				health_interval 10s
				health_timeout 5s
				lb_try_duration 5s
		}
}
```

Replace `<your-cookie-secret>` with a random secret shared by all Caddy instances. Console affinity keeps an in-progress OpenID Connect login on the RustFS node that created its `state`. Keep port `9000` open directly between RustFS nodes because internal node RPC uses the same listener.

## Next steps

- [Configure an S3 client](/developer/examples/aws-cli)
- [Enable virtual-hosted-style bucket URLs](/integration/virtual)
- [Review health and readiness endpoints](/operations/status-check)