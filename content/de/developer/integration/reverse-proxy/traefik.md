---
title: "Traefik"
description: "Deploy RustFS behind Traefik with automatic TLS for separate S3 API and Console hostnames."
---

Use **Traefik** and its Docker provider to discover RustFS, obtain TLS certificates from Let's Encrypt, and route separate hostnames to the S3 API and Console. You need Docker Engine, Docker Compose, a public server, and two DNS records that resolve to that server.

This guide uses these example hostnames:

- `s3.example.com` for the S3 API
- `console.example.com` for the Console

Replace them with your public hostnames. The ACME HTTP-01 challenge requires inbound access to ports `80` and `443`.

:::warning[Serve S3 from the root path]

Do not publish the S3 API under a path such as `/s3/`. AWS Signature Version 4 includes the request path and host, so rewriting either value can invalidate signed requests.

:::

## 1. Create the deployment directory

Create a directory and an empty ACME storage file. Traefik requires restrictive permissions on this file:

```bash
mkdir rustfs-traefik
cd rustfs-traefik
touch acme.json
chmod 600 acme.json
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

Use an email address that receives certificate expiration notices. Do not commit `.env` or `acme.json` to source control.

## 3. Create the Compose file

Create the Traefik and RustFS services:

```yaml title="compose.yaml"
services:
  traefik:
    image: traefik:v3.6.5
    restart: unless-stopped
    command:
      - --log.level=INFO
      - --accesslog=true
      - --providers.docker=true
      - --providers.docker.endpoint=unix:///var/run/docker.sock
      - --providers.docker.exposedbydefault=false
      - --providers.docker.network=rustfs
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      - --certificatesresolvers.le.acme.email=${ACME_EMAIL}
      - --certificatesresolvers.le.acme.storage=/etc/traefik/acme.json
      - --certificatesresolvers.le.acme.httpchallenge=true
      - --certificatesresolvers.le.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/etc/traefik/acme.json
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
    labels:
      - traefik.enable=true
      - traefik.docker.network=rustfs
      - traefik.http.routers.rustfs-s3.rule=Host(`${S3_HOSTNAME}`)
      - traefik.http.routers.rustfs-s3.entrypoints=websecure
      - traefik.http.routers.rustfs-s3.tls=true
      - traefik.http.routers.rustfs-s3.tls.certresolver=le
      - traefik.http.routers.rustfs-s3.service=rustfs-s3
      - traefik.http.services.rustfs-s3.loadbalancer.server.port=9000
      - traefik.http.services.rustfs-s3.loadbalancer.passhostheader=true
      - traefik.http.routers.rustfs-console.rule=Host(`${CONSOLE_HOSTNAME}`)
      - traefik.http.routers.rustfs-console.entrypoints=websecure
      - traefik.http.routers.rustfs-console.tls=true
      - traefik.http.routers.rustfs-console.tls.certresolver=le
      - traefik.http.routers.rustfs-console.service=rustfs-console
      - traefik.http.services.rustfs-console.loadbalancer.server.port=9001
      - traefik.http.services.rustfs-console.loadbalancer.passhostheader=true
    networks:
      - rustfs

volumes:
  rustfs-data:

networks:
  rustfs:
    name: rustfs
```

The two routers use different host rules and backend ports. RustFS does not publish ports `9000` or `9001` on the Docker host, and the Traefik Dashboard is not exposed.

:::note[Docker socket access]

Traefik reads container labels through the read-only Docker socket mount. Anyone who can modify Docker workloads can influence routes discovered by the Docker provider. Restrict Docker access on the proxy host.

:::

## 4. Validate and start the deployment

Render the Compose configuration and check that all variables resolve:

```bash
docker compose config
```

Start both services:

```bash
docker compose up -d
docker compose ps
```

Follow the Traefik logs while it completes the ACME challenge and creates both certificates:

```bash
docker compose logs --follow traefik
```

If certificate issuance fails, confirm that both DNS records resolve to this host and that ports `80` and `443` are reachable from the internet. Let's Encrypt rate limits apply, so correct DNS and firewall problems before repeatedly recreating the deployment.

## 5. Verify both endpoints

Verify the S3 API readiness endpoint and Console health endpoint through Traefik:

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Configure S3 clients with `https://s3.example.com` as the endpoint and enable path-style addressing. Open `https://console.example.com` to sign in to the Console.

## Multi-node services

For an external multi-node RustFS cluster, enable Traefik's file provider in the `traefik` service:

```yaml title="compose.yaml"
services:
  traefik:
    command:
      - --providers.file.filename=/etc/traefik/dynamic.yaml
      - --providers.file.watch=true
    volumes:
      - ./dynamic.yaml:/etc/traefik/dynamic.yaml:ro
```

Create the dynamic configuration with every RustFS node:

```yaml title="dynamic.yaml"
http:
  routers:
    rustfs-s3:
      rule: Host(`s3.example.com`)
      entryPoints:
        - websecure
      service: rustfs-s3
      tls:
        certResolver: le
    rustfs-console:
      rule: Host(`console.example.com`)
      entryPoints:
        - websecure
      service: rustfs-console
      tls:
        certResolver: le

  services:
    rustfs-s3:
      loadBalancer:
        passHostHeader: true
        healthCheck:
          path: /health/ready
          interval: 10s
          timeout: 5s
        servers:
          - url: http://node1.example.net:9000
          - url: http://node2.example.net:9000
          - url: http://node3.example.net:9000
          - url: http://node4.example.net:9000
    rustfs-console:
      loadBalancer:
        passHostHeader: true
        sticky:
          cookie:
            name: rustfs_console
            secure: true
            httpOnly: true
        healthCheck:
          path: /rustfs/console/health
          interval: 10s
          timeout: 5s
        servers:
          - url: http://node1.example.net:9001
          - url: http://node2.example.net:9001
          - url: http://node3.example.net:9001
          - url: http://node4.example.net:9001
```

Configure sticky sessions for the Console service when you use OpenID Connect. An in-progress login stores its `state` on one RustFS node and the callback must return to that node. Keep port `9000` open directly between RustFS nodes because internal node RPC uses the same listener.

## Next steps

- [Configure an S3 client](/developer/examples/aws-cli)
- [Enable virtual-hosted-style bucket URLs](/integration/virtual)
- [Review health and readiness endpoints](/operations/status-check)