---
title: "Traefik"
description: "S3 API と Console を別々のホスト名で公開し、TLS を自動取得する Traefik の背後に RustFS をデプロイします。"
---

**Traefik** とその Docker プロバイダーで RustFS を検出し、Let's Encrypt から TLS 証明書を取得し、別々のホスト名を S3 API と Console へ振り分けます。Docker Engine、Docker Compose、公開サーバー、およびそのサーバーへ解決する DNS レコードが 2 件必要です。

このガイドでは、次のホスト名を例に使います。

- S3 API 用の `s3.example.com`
- Console 用の `console.example.com`

公開するホスト名に置き換えます。ACME の HTTP-01 チャレンジには、ポート `80` と `443` への着信アクセスが必要です。

:::warning[S3 はルートパスから公開する]

`/s3/` のようなパスの下に S3 API を公開しないでください。AWS Signature Version 4 はリクエストパスとホストを署名対象に含めるため、どちらかを書き換えると署名済みリクエストが無効になることがあります。

:::

## 1. デプロイ用ディレクトリを作成する

ディレクトリと空の ACME 保存ファイルを作成します。Traefik はこのファイルに、制限の強いパーミッションを要求します。

```bash
mkdir rustfs-traefik
cd rustfs-traefik
touch acme.json
chmod 600 acme.json
```

## 2. デプロイ変数を設定する

環境ファイルを作成し、各値を置き換えます。

```ini title=".env"
S3_HOSTNAME=s3.example.com
CONSOLE_HOSTNAME=console.example.com
ACME_EMAIL=admin@example.com
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

証明書の有効期限通知を受け取るメールアドレスを使います。`.env` と `acme.json` はソース管理にコミットしないでください。

## 3. Compose ファイルを作成する

Traefik と RustFS のサービスを作成します。

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

2 つのルーターは、異なるホスト規則とバックエンドのポートを使います。RustFS は Docker ホスト上でポート `9000` と `9001` を公開せず、Traefik Dashboard も公開しません。

:::note[Docker ソケットへのアクセス]

Traefik は、読み取り専用でマウントした Docker ソケット経由でコンテナラベルを読み取ります。Docker のワークロードを変更できる人は、Docker プロバイダーが検出するルートに影響を与えられます。プロキシホストでは、Docker へのアクセスを制限します。

:::

## 4. デプロイを検証して起動する

Compose の設定を展開し、すべての変数が解決することを確認します。

```bash
docker compose config
```

両方のサービスを起動します。

```bash
docker compose up -d
docker compose ps
```

ACME チャレンジが完了し、両方の証明書が作成されるまで、Traefik のログを追います。

```bash
docker compose logs --follow traefik
```

証明書の発行に失敗した場合は、両方の DNS レコードがこのホストへ解決すること、およびポート `80` と `443` がインターネットから到達できることを確認します。Let's Encrypt にはレート制限があるため、DNS とファイアウォールの問題を直してから、デプロイの再作成を繰り返します。

## 5. 両方のエンドポイントを確認する

Traefik 経由で、S3 API の準備完了エンドポイントと Console のヘルスエンドポイントを確認します。

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

S3 クライアントのエンドポイントを `https://s3.example.com` に設定し、パススタイルアクセスを有効にします。`https://console.example.com/rustfs/console/` を開いて Console にサインインします。

## マルチノードのサービス

外部のマルチノード RustFS クラスターでは、`traefik` サービスで Traefik のファイルプロバイダーを有効にします。

```yaml title="compose.yaml"
services:
  traefik:
    command:
      - --providers.file.filename=/etc/traefik/dynamic.yaml
      - --providers.file.watch=true
    volumes:
      - ./dynamic.yaml:/etc/traefik/dynamic.yaml:ro
```

すべての RustFS ノードを含む動的設定を作成します。

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

OpenID Connect を使う場合は、Console サービスにスティッキーセッションを設定します。進行中のログインは `state` を 1 台の RustFS ノードに保存するため、コールバックはそのノードへ戻る必要があります。ノード間の内部 RPC は同じリスナーを使うため、RustFS ノード間ではポート `9000` を直接開けたままにします。

## 次のステップ

- [S3 クライアントを設定する](/ja/developer/examples/aws-cli)
- [仮想ホスト形式のバケット URL を有効にする](/ja/integration/virtual)
- [ヘルスと準備完了のエンドポイントを確認する](/ja/operations/status-check)
