---
title: "Nginx"
description: "S3 API と Console を別々の HTTPS エンドポイントで公開する Nginx の背後に RustFS をデプロイします。"
---

**Nginx** で TLS を終端し、別々のホスト名を RustFS の S3 API と Console へ振り分けます。このデプロイでは、Docker Compose で Nginx とシングルノードの RustFS を動かします。Docker Engine、Docker Compose、DNS レコード 2 件、および両方のホスト名をカバーする TLS 証明書が必要です。

このガイドでは、次のホスト名を例に使います。

- S3 API 用の `s3.example.com`
- Console 用の `console.example.com`

Docker ホストへ解決するホスト名に置き換えます。

:::warning[S3 はルートパスから公開する]

`/s3/` のようなパスの下に S3 API を公開しないでください。AWS Signature Version 4 はリクエストパスとホストを署名対象に含めるため、どちらかを書き換えると署名済みリクエストが無効になることがあります。

:::

## 1. デプロイ用ディレクトリを作成する

Nginx の設定と TLS 証明書用のディレクトリを作成します。

```bash
mkdir -p rustfs-nginx/sites rustfs-nginx/certs
cd rustfs-nginx
```

証明書チェーンと秘密鍵を `certs/` へコピーします。

```text
rustfs-nginx/
├── certs/
│   ├── fullchain.pem
│   └── privkey.pem
└── sites/
```

秘密鍵へのアクセスを制限します。

```bash
chmod 600 certs/privkey.pem
```

## 2. RustFS の認証情報を設定する

環境ファイルを作成し、認証情報のプレースホルダーを両方とも置き換えます。

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

このファイルはソース管理にコミットしないでください。

## 3. Nginx を設定する

Nginx の設定を作成します。

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

S3 用の server ブロックは、元のホストとリクエストパスを保持し、ストリーミングアップロード向けにリクエストのバッファリングを無効にし、署名済みの `HEAD` リクエストを変換しません。Console 用の server ブロックは、WebSocket のアップグレードヘッダーも転送します。

## 4. Compose ファイルを作成する

デプロイ定義を作成します。

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

ホストのポートを公開するのは Nginx だけです。RustFS のポート `9000` と `9001` には、Compose ネットワークの内部からのみ到達できます。

## 5. デプロイを検証して起動する

サービスを起動する前に、両方の設定ファイルを検証します。

```bash
docker compose config
docker compose up -d rustfs
docker compose run --rm --no-deps nginx nginx -t
```

Nginx を起動し、両方のサービスを確認します。

```bash
docker compose up -d nginx
docker compose ps
```

サービスが正常にならない場合は、ログを確認します。

```bash
docker compose logs nginx
docker compose logs rustfs
```

## 6. 両方のエンドポイントを確認する

公開 HTTPS ホスト名経由で API と Console を確認します。

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

S3 クライアントのエンドポイントを `https://s3.example.com` に設定し、パススタイルアクセスを有効にします。`https://console.example.com/rustfs/console/` を開いて Console にサインインします。

`certs/` の証明書または鍵を更新したものに差し替えたら、既存の接続を中断せずに Nginx を検証して再読み込みします。

```bash
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

## マルチノードのアップストリーム

分散構成の RustFS デプロイでは、各アップストリームの単一サーバーを、すべての RustFS ノードに置き換えます。

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

Console のアップストリームがクライアントアフィニティを使うのは、進行中の OpenID Connect ログインが `state` を 1 台の RustFS ノードに保存するためです。ノード間の内部 RPC は同じリスナーを使うため、RustFS ノード間ではポート `9000` を開けたままにします。

## 次のステップ

- [S3 クライアントを設定する](/ja/developer/examples/aws-cli)
- [仮想ホスト形式のバケット URL を有効にする](/ja/integration/virtual)
- [ヘルスと準備完了のエンドポイントを確認する](/ja/operations/status-check)
