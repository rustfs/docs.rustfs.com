---
title: "Apache HTTP Server"
description: "Deploy RustFS behind Apache HTTP Server with TLS termination for separate S3 API and Console hostnames."
---

Use **Apache HTTP Server** (httpd) to terminate TLS and route separate hostnames to the RustFS S3 API and Console. This deployment runs httpd and a single-node RustFS instance with Docker Compose. You need Docker Engine, Docker Compose, two DNS records, and a TLS certificate that covers both hostnames.

This guide uses these example hostnames:

- `s3.example.com` for the S3 API
- `console.example.com` for the Console

Replace them with hostnames that resolve to the Docker host.

:::warning[Serve S3 from the root path]

Do not publish the S3 API under a path such as `/s3/`. AWS Signature Version 4 includes the request path and host, so rewriting either value can invalidate signed requests. Apache rewrites proxied URLs unless you disable canonicalization, which this configuration does with `nocanon`.

:::

## 1. Create the deployment directories

Create directories for the httpd configuration and TLS certificate:

```bash
mkdir -p rustfs-httpd/config rustfs-httpd/certs
cd rustfs-httpd
```

Copy your certificate chain and private key into `certs/`:

```text
rustfs-httpd/
├── certs/
│   ├── fullchain.pem
│   └── privkey.pem
└── config/
```

Restrict access to the private key:

```bash
chmod 600 certs/privkey.pem
```

The certificate must cover both public hostnames.

## 2. Set RustFS credentials

Create an environment file and replace both credential placeholders:

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Do not commit this file to source control.

## 3. Build the httpd image

The stock `httpd` image ships with its proxy and TLS modules commented out. Build a small image that enables them and loads the RustFS virtual hosts:

```dockerfile title="Dockerfile"
FROM httpd:2.4-alpine

# The stock httpd image disables the proxy and TLS modules. Enable the modules
# required to terminate TLS and reverse-proxy RustFS, then load the RustFS
# virtual hosts.
RUN sed -i \
      -e 's|^#\(LoadModule socache_shmcb_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_http_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_balancer_module\)|\1|' \
      -e 's|^#\(LoadModule slotmem_shm_module\)|\1|' \
      -e 's|^#\(LoadModule ssl_module\)|\1|' \
      -e 's|^#\(LoadModule http2_module\)|\1|' \
      -e 's|^#\(LoadModule lbmethod_byrequests_module\)|\1|' \
      /usr/local/apache2/conf/httpd.conf \
      && printf '\nInclude conf/rustfs.conf\n' >> /usr/local/apache2/conf/httpd.conf
```

`proxy_balancer`, `slotmem_shm`, and `lbmethod_byrequests` are only used by the [multi-node](#multi-node-backends) configuration. Loading them on single-node deployments is harmless.

## 4. Configure Apache HTTP Server

Create the httpd configuration with one virtual host per RustFS endpoint:

```apache title="config/rustfs.conf"
# Global settings shared by the RustFS virtual hosts.
ServerName localhost

# The stock image listens on port 80 only. Open port 443 for TLS.
Listen 443

# S3 transfers can run for hours; do not cut idle-looking connections.
Timeout 600
ProxyTimeout 600

# Share TLS sessions across connections to speed up repeated handshakes.
SSLSessionCache "shmcb:logs/ssl_scache(512000)"

# Drop only genuinely stalled clients: MinRate keeps slow-but-steady uploads
# alive while data keeps flowing.
RequestReadTimeout header=30-60,MinRate=500 body=60,MinRate=512

# Accept request bodies of any size (the default, stated explicitly).
LimitRequestBody 0

# Redirect every plain-HTTP request to HTTPS.
<VirtualHost *:80>
    ServerName s3.example.com
    Redirect permanent / https://s3.example.com/
</VirtualHost>

<VirtualHost *:80>
    ServerName console.example.com
    Redirect permanent / https://console.example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName s3.example.com

    Protocols h2 http/1.1
    SSLEngine on
    SSLCertificateFile /usr/local/apache2/certs/fullchain.pem
    SSLCertificateKeyFile /usr/local/apache2/certs/privkey.pem

    # AWS Signature Version 4 signs the Host header and the request path.
    # Keep the client's Host, leave the path uncanonicalized, and allow
    # encoded slashes so that signed requests stay valid.
    ProxyPreserveHost On
    ProxyRequests Off
    AllowEncodedSlashes NoDecode

    # Apache does not set X-Forwarded-Proto; declare it explicitly.
    # ProxyAddHeaders (default On) adds X-Forwarded-For/Host/Server.
    RequestHeader set X-Forwarded-Proto "https"

    # nocanon passes the request path to RustFS unchanged.
    ProxyPass / http://rustfs:9000/ nocanon
    ProxyPassReverse / http://rustfs:9000/
</VirtualHost>

<VirtualHost *:443>
    ServerName console.example.com

    Protocols h2 http/1.1
    SSLEngine on
    SSLCertificateFile /usr/local/apache2/certs/fullchain.pem
    SSLCertificateKeyFile /usr/local/apache2/certs/privkey.pem

    ProxyPreserveHost On
    ProxyRequests Off

    RequestHeader set X-Forwarded-Proto "https"

    # upgrade=websocket tunnels Console WebSocket upgrades end to end;
    # regular requests continue to use plain HTTP forwarding.
    ProxyPass / http://rustfs:9001/ upgrade=websocket
    ProxyPassReverse / http://rustfs:9001/
</VirtualHost>
```

`Listen 443` is required because the stock `httpd.conf` only opens port `80`; virtual hosts alone do not open ports. The two `VirtualHost *:80` blocks redirect all plain-HTTP traffic to HTTPS with explicit target hostnames.

## 5. Create the Compose file

Create the httpd and RustFS services:

```yaml title="compose.yaml"
services:
  httpd:
    build: .
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/rustfs.conf:/usr/local/apache2/conf/rustfs.conf:ro
      - ./certs:/usr/local/apache2/certs:ro
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
      RUSTFS_OBS_LOG_DIRECTORY: /logs
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

Only httpd publishes host ports. RustFS ports `9000` and `9001` remain reachable inside the Compose network.

:::note[RustFS log directory]

`RUSTFS_OBS_LOG_DIRECTORY` must point to a directory the container can create. The RustFS image runs as a non-root user, so `/logs` works while paths under `/var/log` make the container exit at startup with `Permission denied`.

:::

## 6. Validate and start the deployment

Render the Compose configuration and start RustFS:

```bash
docker compose config
docker compose up -d rustfs
```

Validate the httpd configuration with the same image used by the deployment:

```bash
docker compose run --rm --no-deps httpd httpd -t
```

Start httpd and check both services:

```bash
docker compose up -d httpd
docker compose ps
```

If a service does not become healthy, inspect its logs:

```bash
docker compose logs httpd
docker compose logs rustfs
```

## 7. Verify both endpoints

Verify the API and Console through their public HTTPS hostnames:

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Configure S3 clients with `https://s3.example.com` as the endpoint and enable path-style addressing. Open `https://console.example.com/rustfs/console/` to sign in to the Console.

:::note[Console root path]

In RustFS v2.x the Console is served under the `/rustfs/console/` path prefix. Requesting the root path of the Console hostname returns an S3-style XML access-denied response, which is expected.

:::

When you replace a renewed certificate or key in `certs/`, validate the configuration and reload httpd gracefully without dropping active transfers:

```bash
docker compose exec httpd httpd -t
docker compose exec httpd httpd -k graceful
```

## How this configuration preserves S3 signatures

AWS Signature Version 4 signs the HTTP method, the `Host` header, and the raw request path. Every directive below keeps one of those values byte-identical between the client and RustFS:

- **`ProxyPreserveHost On`** keeps the client's `Host` header. With the default (`Off`), Apache rewrites `Host` to the backend host and RustFS answers `SignatureDoesNotMatch`.
- **`nocanon`** on the `ProxyPass` line passes the request path to RustFS without URL canonicalization. Without it, Apache rewrites paths during forwarding (for example collapsing `//`), and any signed path no longer matches.
- **`AllowEncodedSlashes NoDecode`** lets object keys containing `%2F` reach the proxy handlers instead of returning `404`, and keeps the encoding intact.
- **`RequestHeader set X-Forwarded-Proto "https"`** tells RustFS the original scheme. Apache's `ProxyAddHeaders` (default `On`) adds `X-Forwarded-For`, `X-Forwarded-Host`, and `X-Forwarded-Server`, but not `X-Forwarded-Proto`.

Presigned URLs, multipart uploads, and browser POST uploads rely on the same path and host preservation and need no extra directives.

The Console virtual host adds `upgrade=websocket` to its `ProxyPass` line so that WebSocket upgrades are tunneled end to end. Since 2.4.47, `mod_proxy_http` handles the upgrade itself and only tunnels connections the backend accepts with `101 Switching Protocols`; the older `mod_proxy_wstunnel` module is deprecated.

## Request bodies, large objects, and timeouts

Apache forwards request bodies to RustFS without a size limit and without writing them to the proxy's disk. Bodies that arrive with a `Content-Length` (what AWS CLI, AWS SDKs, and `mc` send) stream through as they arrive. Bodies that arrive with `Transfer-Encoding: chunked` are also forwarded as chunked encoding, which RustFS rejects — see the warnings below.

The timeout directives trade safety for long transfers:

- **`Timeout 600`** covers connection I/O in both directions, so slow downloads and uploads are not cut mid-transfer.
- **`ProxyTimeout 600`** applies the same budget to the connection with RustFS.
- **`RequestReadTimeout`** bounds slow clients without punishing steady ones: a request is dropped only when headers stall or the body rate falls below `MinRate`.
- **`LimitRequestBody 0`** states the default explicitly: request bodies of any size are accepted.

:::warning[Uploads must carry a Content-Length]

RustFS rejects request bodies forwarded as `Transfer-Encoding: chunked` with `400 UnexpectedContent` (`This request does not support content.`). Clients must upload with a `Content-Length`. All major S3 clients do this out of the box, so this only affects hand-rolled HTTP scripts that stream from a pipe. Apache's default body handling converts small chunked bodies to `Content-Length` in memory but forwards large ones as chunked, so such a client can appear to work for small files and fail for large ones. `SetEnv proxy-sendcl 1` converts chunked bodies to `Content-Length` as a fallback — at the cost of spooling each body to the proxy's disk first.

:::

:::warning[Presigned URLs and the Content-Type header]

A presigned URL fixes the headers covered by its signature. If the URL was generated without a `Content-Type`, the upload must not add one — RustFS answers `403 SignatureDoesNotMatch` for the unsigned header. Note that `curl -d` and `curl --data-binary` add `Content-Type: application/x-www-form-urlencoded` on their own. When the upload sends a `Content-Type`, presign the URL with the same value (the `ContentType` parameter in AWS SDKs) and make the request match it exactly.

:::

## Settings that do not suit RustFS

The following Apache defaults and options break S3 semantics or waste resources. This configuration avoids all of them.

| Setting | Effect on RustFS |
| --- | --- |
| `ProxyPreserveHost Off` (default) | Rewrites `Host`; signed requests fail with `SignatureDoesNotMatch`. |
| `ProxyPass` without `nocanon` | Canonicalizes the request path; signed paths fail to verify. |
| `AllowEncodedSlashes Off` (default) | Returns `404` for object keys containing `%2F`. |
| Path prefixes (`ProxyPass /s3/`, `Alias`, rewrite rules) | Rewrites the request path; keep the S3 API on the root path. |
| `ProxyErrorOverride On` | Replaces RustFS S3 XML errors with Apache error pages; S3 SDKs cannot parse them. |
| `SetEnv proxy-sendcl 1`, `SetEnv force-proxy-request-1.0 1` | Forces a `Content-Length` upstream and spools chunked request bodies to disk before forwarding. It rescues chunked-only clients but adds disk I/O to large uploads. |
| `SetEnv proxy-sendchunked 1` | Forces chunked encoding upstream, which RustFS rejects with `400 UnexpectedContent`. |
| `mod_proxy_wstunnel` (`ProxyPass ... ws://`) | Deprecated since 2.4.47; use `upgrade=websocket` on `mod_proxy_http` instead. |

Two RustFS-side limits are worth marking because no proxy setting can remove them:

- Object keys containing empty (`//`) or dot (`.`) path segments are rejected with `InvalidArgument` even without a proxy.
- In RustFS v2.x the Console lives under `/rustfs/console/`; the Console root path answers with S3-style XML.

## Multi-node backends

For a distributed RustFS deployment, replace each single `ProxyPass` target with a balancer that lists every RustFS node. Replace the S3 virtual host's proxy block with:

```apache title="config/rustfs.conf"
    <Proxy "balancer://s3">
        BalancerMember http://node1.example.net:9000 route=node1
        BalancerMember http://node2.example.net:9000 route=node2
        BalancerMember http://node3.example.net:9000 route=node3
        BalancerMember http://node4.example.net:9000 route=node4
        ProxySet lbmethod=byrequests
    </Proxy>
    ProxyPass / balancer://s3/ nocanon
    ProxyPassReverse / balancer://s3/
```

Replace the Console virtual host's proxy block with:

```apache title="config/rustfs.conf"
    # Keep an in-progress login on the node that created its state.
    Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED

    <Proxy "balancer://console">
        BalancerMember http://node1.example.net:9001 route=node1 upgrade=websocket
        BalancerMember http://node2.example.net:9001 route=node2 upgrade=websocket
        BalancerMember http://node3.example.net:9001 route=node3 upgrade=websocket
        BalancerMember http://node4.example.net:9001 route=node4 upgrade=websocket
        ProxySet stickysession=ROUTEID
    </Proxy>
    ProxyPass / balancer://console/
    ProxyPassReverse / balancer://console/
```

The `ROUTEID` cookie keeps an in-progress OpenID Connect login on the RustFS node that created its `state`. Keep `upgrade=websocket` on each `BalancerMember` line; `ProxySet` does not accept that parameter. Keep port `9000` open directly between RustFS nodes because internal node RPC uses the same listener.

## Next steps

- [Configure an S3 client](/developer/examples/aws-cli)
- [Enable virtual-hosted-style bucket URLs](/integration/virtual)
- [Review health and readiness endpoints](/operations/status-check)
