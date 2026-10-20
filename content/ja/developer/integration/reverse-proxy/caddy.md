---
title: "Caddy"
description: "S3 API と Console を別々のホスト名で公開し、HTTPS を自動取得する Caddy の背後に RustFS をデプロイします。"
---

**Caddy** で TLS 証明書の取得と更新を自動化し、別々のホスト名を RustFS の S3 API と Console へ振り分けます。このデプロイでは、Docker Compose で Caddy とシングルノードの RustFS を動かします。Docker Engine、Docker Compose、公開サーバー、およびそのサーバーへ解決する DNS レコードが 2 件必要です。

このガイドでは、次のホスト名を例に使います。

- S3 API 用の `s3.example.com`
- Console 用の `console.example.com`

公開するホスト名に置き換えます。Caddy の既定の ACME チャレンジでは、ポート `80` と `443` への着信アクセスが必要です。

:::warning[S3 はルートパスから公開する]

`/s3/` のようなパスの下に S3 API を公開しないでください。AWS Signature Version 4 はリクエストパスとホストを署名対象に含めるため、どちらかを書き換えると署名済みリクエストが無効になることがあります。

:::

## 1. デプロイ用ディレクトリを作成する

デプロイ用のディレクトリを作成します。

```bash
mkdir rustfs-caddy
cd rustfs-caddy
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

証明書の通知を受け取るメールアドレスを使います。`.env` はソース管理にコミットしないでください。

## 3. Caddy を設定する

RustFS のエンドポイントごとに、サイトブロックを 1 つ持つ Caddyfile を作成します。

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

Caddy は既定で、受信した `Host` ヘッダー、HTTP メソッド、リクエスト URI をそのまま保持します。クライアント情報は `X-Forwarded-*` ヘッダーで転送し、追加のヘッダー規則なしで Console の WebSocket アップグレードも処理します。

## 4. Compose ファイルを作成する

Caddy と RustFS のサービスを作成します。

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
  caddy-data:
  caddy-config:
  rustfs-data:

networks:
  rustfs:
```

永続ボリューム `caddy-data` には、証明書、秘密鍵、ACME アカウントの状態が保存されます。このボリュームはバックアップし、内容は共有しないでください。ホストのポートを公開するのは Caddy だけで、RustFS には Compose ネットワークの内部からのみ到達できます。

## 5. デプロイを検証して起動する

Compose の設定を展開し、RustFS を起動します。

```bash
docker compose config
docker compose up -d rustfs
```

デプロイと同じイメージで Caddyfile を検証します。

```bash
docker compose run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile
```

Caddy を起動し、両方のサービスを確認します。

```bash
docker compose up -d caddy
docker compose ps
docker compose logs --follow caddy
```

Caddy はバックグラウンドで証明書を取得し、HTTP リクエストを HTTPS へリダイレクトします。発行に失敗した場合は、両方の DNS レコードがこのホストへ解決すること、ポート `80` と `443` へ到達できること、`caddy-data` ボリュームへ書き込めることを確認します。

## 6. 両方のエンドポイントを確認する

公開 HTTPS ホスト名経由で API と Console を確認します。

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

S3 クライアントのエンドポイントを `https://s3.example.com` に設定し、パススタイルアクセスを有効にします。`https://console.example.com/rustfs/console/` を開いて Console にサインインします。

## マルチノードのアップストリーム

分散構成の RustFS デプロイでは、対応するサイトブロックにすべてのノードを列挙します。

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

`<your-cookie-secret>` は、すべての Caddy インスタンスで共有するランダムなシークレットに置き換えます。Console のアフィニティにより、進行中の OpenID Connect ログインは、その `state` を作成した RustFS ノードに留まります。ノード間の内部 RPC は同じリスナーを使うため、RustFS ノード間ではポート `9000` を直接開けたままにします。

## 次のステップ

- [S3 クライアントを設定する](/ja/developer/examples/aws-cli)
- [仮想ホスト形式のバケット URL を有効にする](/ja/integration/virtual)
- [ヘルスと準備完了のエンドポイントを確認する](/ja/operations/status-check)
