---
title: "HAProxy"
description: "S3 API と Console を別々の HTTPS ルートで公開する HAProxy の背後に RustFS をデプロイします。"
---

**HAProxy** で TLS を終端し、別々のホスト名を RustFS の S3 API と Console へ振り分けます。このデプロイでは、Docker Compose で HAProxy とシングルノードの RustFS を動かします。Docker Engine、Docker Compose、DNS レコード 2 件、および両方のホスト名をカバーする TLS 証明書が必要です。

このガイドでは、次のホスト名を例に使います。

- S3 API 用の `s3.example.com`
- Console 用の `console.example.com`

Docker ホストへ解決するホスト名に置き換えます。

:::warning[S3 はルートパスから公開する]

`/s3/` のようなパスの下に S3 API を公開しないでください。AWS Signature Version 4 はリクエストパスとホストを署名対象に含めるため、どちらかを書き換えると署名済みリクエストが無効になることがあります。

:::

## 1. デプロイ用ディレクトリを作成する

HAProxy の設定と TLS 証明書用のディレクトリを作成します。

```bash
mkdir -p rustfs-haproxy/config rustfs-haproxy/certs
cd rustfs-haproxy
```

HAProxy は、証明書チェーンと秘密鍵が 1 つの PEM ファイルにまとまっていることを前提にします。次の順で結合します。

```bash
cat fullchain.pem privkey.pem > certs/rustfs.pem
chmod 600 certs/rustfs.pem
```

証明書は、公開する両方のホスト名をカバーする必要があります。

## 2. RustFS の認証情報を設定する

環境ファイルを作成し、認証情報のプレースホルダーを両方とも置き換えます。

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

このファイルと証明書の秘密鍵は、ソース管理にコミットしないでください。

## 3. HAProxy を設定する

HAProxy の設定を作成します。

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

明示的に書き換えない限り、HAProxy は受信したホストとリクエストパスを保持します。クライアント、サーバー、トンネルのタイムアウトを長くしてあるのは、ストリーミングの S3 操作と Console の WebSocket 接続に合わせるためです。

Console のバックエンドにはアフィニティ用の Cookie を設定します。RustFS サーバーが 1 台のときはルーティングへの影響はありませんが、基本設定に含めておくと、ノードを追加したときの動作が揃います。

## 4. Compose ファイルを作成する

HAProxy と RustFS のサービスを作成します。

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

ホストのポートを公開するのは HAProxy だけです。RustFS のポート `9000` と `9001` には、Compose ネットワークの内部からのみ到達できます。

## 5. デプロイを検証して起動する

Compose の設定を展開し、RustFS を起動します。

```bash
docker compose config
docker compose up -d rustfs
```

デプロイと同じイメージで HAProxy の設定を検証します。

```bash
docker compose run --rm --no-deps haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
```

HAProxy を起動し、両方のサービスを確認します。

```bash
docker compose up -d haproxy
docker compose ps
```

サービスが正常にならない場合は、ログを確認します。

```bash
docker compose logs haproxy
docker compose logs rustfs
```

## 6. 両方のエンドポイントを確認する

公開 HTTPS ホスト名経由で API と Console を確認します。

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

S3 クライアントのエンドポイントを `https://s3.example.com` に設定し、パススタイルアクセスを有効にします。`https://console.example.com/rustfs/console/` を開いて Console にサインインします。

更新した `certs/rustfs.pem` に差し替えたら、設定を検証し、HAProxy コンテナを再作成して読み込みます。

```bash
docker compose run --rm --no-deps haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
docker compose up -d --force-recreate haproxy
```

## マルチノードのバックエンド

分散構成の RustFS デプロイでは、両方のバックエンドにすべての RustFS ノードを追加します。

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

Console の Cookie により、進行中の OpenID Connect ログインは、その `state` を作成した RustFS ノードに留まります。ノード間の内部 RPC は同じリスナーを使うため、RustFS ノード間ではポート `9000` を直接開けたままにします。

## 次のステップ

- [S3 クライアントを設定する](/ja/developer/examples/aws-cli)
- [仮想ホスト形式のバケット URL を有効にする](/ja/integration/virtual)
- [ヘルスと準備完了のエンドポイントを確認する](/ja/operations/status-check)
