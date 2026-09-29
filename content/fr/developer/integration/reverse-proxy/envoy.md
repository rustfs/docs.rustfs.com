---
title: "Envoy"
description: "Deploy RustFS behind Envoy with TLS-terminated routes for the S3 API and Console."
---

Use **Envoy** to terminate TLS and route separate hostnames to the RustFS S3 API and Console. This deployment runs Envoy and a single-node RustFS instance on one Docker network. You need Docker Engine, two DNS records, and a TLS certificate that covers both hostnames (the guide uses a self-signed certificate for testing).

This guide uses these example hostnames:

- `s3.example.com` for the S3 API
- `console.example.com` for the Console

Replace them with hostnames that resolve to the Docker host.

:::warning[Serve S3 from the root path]

Do not publish the S3 API under a path such as `/s3/`. AWS Signature Version 4 includes the request path and host, so rewriting either value can invalidate signed requests. Envoy forwards the incoming `Host` header unchanged, which keeps signatures valid.

:::

## 1. Create the deployment directories

Create directories for the Envoy configuration and TLS certificate:

```bash
mkdir -p rustfs-envoy/certs
cd rustfs-envoy
```

For local testing, generate a self-signed certificate covering both hostnames:

```bash
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/privkey.pem -out certs/fullchain.pem -days 30 \
  -subj "/CN=*.example.com" \
  -addext "subjectAltName=DNS:s3.example.com,DNS:console.example.com"
chmod 644 certs/privkey.pem
```

Make the certificate readable by the non-root user the Envoy image runs as — a `600` private key produces a misleading `Failed to load incomplete private key` error.

## 2. Configure Envoy

Create the configuration with an HTTPS listener and two virtual hosts. Route timeouts are disabled (`timeout: 0s`) so long streaming S3 uploads are not cut off:

```yaml title="envoy.yaml"
static_resources:
  listeners:
  - name: https
    address: {socket_address: {address: 0.0.0.0, port_value: 8443}}
    filter_chains:
    - transport_socket:
        name: envoy.transport_sockets.tls
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext
          common_tls_context:
            tls_certificates:
            - certificate_chain: {filename: /certs/fullchain.pem}
              private_key: {filename: /certs/privkey.pem}
      filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: rustfs_https
          route_config:
            virtual_hosts:
            - name: s3
              domains: ["s3.example.com", "s3.example.com:*"]
              routes:
              - match: {prefix: "/"}
                route: {cluster: rustfs_s3, timeout: 0s}
            - name: console
              domains: ["console.example.com", "console.example.com:*"]
              routes:
              - match: {prefix: "/"}
                route: {cluster: rustfs_console, timeout: 0s}
          http_filters:
          - name: envoy.filters.http.router
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
  clusters:
  - name: rustfs_s3
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_s3
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: rustfs, port_value: 9000}}}
  - name: rustfs_console
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_console
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: rustfs, port_value: 9001}}}
```

The `host:*` domain entries matter: clients send `Host: s3.example.com:8443` on non-standard ports, and Envoy matches the authority including the port.

## 3. Start Envoy

Run Envoy on the same Docker network as RustFS, publishing only the proxy port:

```bash
docker run -d --name envoy --network oo-rustfs_default -p 8443:8443 \
  -v "$PWD/envoy.yaml":/envoy.yaml:ro \
  -v "$PWD/certs":/certs:ro \
  envoyproxy/envoy:v1.34-latest -c /envoy.yaml
```

## 4. Verify both endpoints

Point the example hostnames at the proxy with `curl --resolve` (in production, DNS does this):

```bash
curl -sk --resolve s3.example.com:8443:127.0.0.1 \
  https://s3.example.com:8443/health/ready -o /dev/null -w "s3 api: %{http_code}\n"

curl -sk --resolve console.example.com:8443:127.0.0.1 \
  https://console.example.com:8443/rustfs/console/ -o /dev/null -w "console: %{http_code}\n"
```

```text
s3 api: 200
console: 200
```

`-k` skips certificate validation because the certificate is self-signed; with a trusted certificate, drop it.

## 5. Send signed S3 requests through Envoy

Point any S3 client at the proxy as if it were RustFS. Configure the client with `https://s3.example.com:8443` as the endpoint and path-style addressing; when the proxy certificate is trusted, signed AWS Signature Version 4 requests pass through unchanged. For a quick test over plain HTTP, add an HTTP listener on port 8080 with the same virtual-host routing as the HTTPS listener, then use the endpoint `http://s3.example.com:8080`:

```bash
rc alias set rustfs-envoy http://s3.example.com:8080 <your-access-key> <your-secret-key>
rc ls rustfs-envoy/rclone-demo/
```

```text
[                   ]         0B seed/
[2026-09-29 11:12:41]        5 B write-test.txt
```

The signatures validate because Envoy forwards the original `Host` header to RustFS.

## Multi-node backends

For a distributed RustFS deployment, add every node to the S3 cluster:

```yaml title="envoy.yaml"
  - name: rustfs_s3
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_s3
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node1, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node2, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node3, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node4, port_value: 9000}}}
```

The Console cluster follows the same pattern on port `9001`.

## Troubleshooting

### `Failed to load incomplete private key from path`

The Envoy container runs as a non-root user and cannot read a `600` root-owned key. `chmod 644` the key files (or chown them to the container user, UID `1001` in the official image).

### Routes return `404` with the correct hostnames

Envoy matches the authority including the port. Add the `host:*` variants to each virtual host's `domains` list, as in the configuration above.

### `Access Denied` from RustFS on proxied requests

Confirm the proxy is not rewriting the path or the `Host` header. Signed requests must reach RustFS with the host the client signed for.

## Next steps

- [Configure an S3 client](/developer/examples/aws-cli)
- [Enable virtual-hosted-style bucket URLs](/integration/virtual)
- [Review health and readiness endpoints](/operations/status-check)
