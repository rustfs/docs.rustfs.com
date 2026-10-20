---
title: "Apache HTTP Server"
description: "S3 API と Console を別々のホスト名で公開し、TLS を終端する Apache HTTP Server の背後に RustFS をデプロイします。"
---

**Apache HTTP Server**（httpd）で TLS を終端し、別々のホスト名を RustFS の S3 API と Console へ振り分けます。このデプロイでは、Docker Compose で httpd とシングルノードの RustFS を動かします。Docker Engine、Docker Compose、DNS レコード 2 件、および両方のホスト名をカバーする TLS 証明書が必要です。

このガイドでは、次のホスト名を例に使います。

- S3 API 用の `s3.example.com`
- Console 用の `console.example.com`

Docker ホストへ解決するホスト名に置き換えます。

:::warning[S3 はルートパスから公開する]

`/s3/` のようなパスの下に S3 API を公開しないでください。AWS Signature Version 4 はリクエストパスとホストを署名対象に含めるため、どちらかを書き換えると署名済みリクエストが無効になることがあります。Apache は正規化を無効にしない限り、プロキシする URL を書き換えます。この構成では `nocanon` で正規化を無効にしています。

:::

## 1. デプロイ用ディレクトリを作成する

httpd の設定と TLS 証明書用のディレクトリを作成します。

```bash
mkdir -p rustfs-httpd/config rustfs-httpd/certs
cd rustfs-httpd
```

証明書チェーンと秘密鍵を `certs/` へコピーします。

```text
rustfs-httpd/
├── certs/
│   ├── fullchain.pem
│   └── privkey.pem
└── config/
```

秘密鍵へのアクセスを制限します。

```bash
chmod 600 certs/privkey.pem
```

証明書は、公開する両方のホスト名をカバーする必要があります。

## 2. RustFS の認証情報を設定する

環境ファイルを作成し、認証情報のプレースホルダーを両方とも置き換えます。

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

このファイルはソース管理にコミットしないでください。

## 3. httpd イメージをビルドする

標準の `httpd` イメージでは、プロキシと TLS のモジュールがコメントアウトされた状態で配布されています。これらを有効にし、RustFS の仮想ホストを読み込む小さなイメージをビルドします。

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

`proxy_balancer`、`slotmem_shm`、`lbmethod_byrequests` を使うのは、[マルチノード](#multi-node-backends)の設定だけです。シングルノードのデプロイで読み込んでも害はありません。

## 4. Apache HTTP Server を設定する

RustFS のエンドポイントごとに、仮想ホストを 1 つ持つ httpd の設定を作成します。

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

標準の `httpd.conf` が開くのはポート `80` だけであり、仮想ホストだけではポートは開かないため、`Listen 443` が必要です。2 つの `VirtualHost *:80` ブロックは、平文 HTTP のトラフィックを、対象ホスト名を明示して HTTPS へリダイレクトします。

## 5. Compose ファイルを作成する

httpd と RustFS のサービスを作成します。

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

ホストのポートを公開するのは httpd だけです。RustFS のポート `9000` と `9001` には、Compose ネットワークの内部からのみ到達できます。

:::note[RustFS のログディレクトリ]

`RUSTFS_OBS_LOG_DIRECTORY` は、コンテナが作成できるディレクトリを指す必要があります。RustFS イメージは root 以外のユーザーで動作するため、`/logs` は使えますが、`/var/log` 配下のパスでは起動時に `Permission denied` でコンテナが終了します。

:::

## 6. デプロイを検証して起動する

Compose の設定を展開し、RustFS を起動します。

```bash
docker compose config
docker compose up -d rustfs
```

デプロイと同じイメージで httpd の設定を検証します。

```bash
docker compose run --rm --no-deps httpd httpd -t
```

httpd を起動し、両方のサービスを確認します。

```bash
docker compose up -d httpd
docker compose ps
```

サービスが正常にならない場合は、ログを確認します。

```bash
docker compose logs httpd
docker compose logs rustfs
```

## 7. 両方のエンドポイントを確認する

公開 HTTPS ホスト名経由で API と Console を確認します。

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

S3 クライアントのエンドポイントを `https://s3.example.com` に設定し、パススタイルアクセスを有効にします。`https://console.example.com/rustfs/console/` を開いて Console にサインインします。

:::note[Console のルートパス]

RustFS v2.x では、Console はパスプレフィックス `/rustfs/console/` の下で提供されます。Console ホスト名のルートパスをリクエストすると、S3 形式の XML によるアクセス拒否応答が返ります。これは想定どおりの動作です。

:::

`certs/` の証明書または鍵を更新したものに差し替えたら、設定を検証し、進行中の転送を切らずに httpd をグレースフルに再読み込みします。

```bash
docker compose exec httpd httpd -t
docker compose exec httpd httpd -k graceful
```

## この設定が S3 署名を保持する仕組み

AWS Signature Version 4 は、HTTP メソッド、`Host` ヘッダー、生のリクエストパスに署名します。以下の各ディレクティブは、これらの値のいずれかを、クライアントから RustFS まで 1 バイトも変えずに保ちます。

- **`ProxyPreserveHost On`** は、クライアントの `Host` ヘッダーを保持します。既定（`Off`）では Apache が `Host` をバックエンドのホストへ書き換えるため、RustFS は `SignatureDoesNotMatch` を返します。
- `ProxyPass` 行の **`nocanon`** は、URL を正規化せずにリクエストパスを RustFS へ渡します。これがないと、Apache は転送中にパスを書き換えます（たとえば `//` を折りたたみます）。その結果、署名済みのパスが一致しなくなります。
- **`AllowEncodedSlashes NoDecode`** は、`%2F` を含むオブジェクトキーが `404` にならずプロキシハンドラーへ届くようにし、エンコーディングもそのまま保ちます。
- **`RequestHeader set X-Forwarded-Proto "https"`** は、元のスキームを RustFS に伝えます。Apache の `ProxyAddHeaders`（既定は `On`）が追加するのは `X-Forwarded-For`、`X-Forwarded-Host`、`X-Forwarded-Server` であり、`X-Forwarded-Proto` は含まれません。

署名付き URL、マルチパートアップロード、ブラウザーからの POST アップロードは、同じパスとホストの保持に依存するため、追加のディレクティブは不要です。

Console の仮想ホストは、`ProxyPass` 行に `upgrade=websocket` を付け、WebSocket のアップグレードをエンドツーエンドでトンネルします。2.4.47 以降、`mod_proxy_http` 自身がアップグレードを処理し、バックエンドが `101 Switching Protocols` で受け付けた接続だけをトンネルします。古い `mod_proxy_wstunnel` モジュールは非推奨です。

## リクエストボディ、大きなオブジェクト、タイムアウト

Apache は、サイズ制限を設けず、プロキシのディスクへ書き出さずに、リクエストボディを RustFS へ転送します。`Content-Length` 付きで届くボディ（AWS CLI、AWS SDK、`mc` が送る形式）は、到着したままストリーム転送されます。`Transfer-Encoding: chunked` で届くボディもチャンク転送のまま転送されますが、RustFS はこれを拒否します。下記の警告を参照してください。

タイムアウトのディレクティブは、安全性を下げて長時間の転送を通します。

- **`Timeout 600`** は双方向の接続 I/O を対象にするため、遅いダウンロードやアップロードが転送の途中で切れません。
- **`ProxyTimeout 600`** は、RustFS との接続に同じ上限を適用します。
- **`RequestReadTimeout`** は、安定して送っているクライアントを不利にせず、遅いクライアントを制限します。リクエストが破棄されるのは、ヘッダーが停滞したとき、またはボディの速度が `MinRate` を下回ったときだけです。
- **`LimitRequestBody 0`** は既定を明示したもので、任意のサイズのリクエストボディを受け付けます。

:::warning[アップロードには Content-Length が必要]

RustFS は、`Transfer-Encoding: chunked` として転送されたリクエストボディを `400 UnexpectedContent`（`This request does not support content.`）で拒否します。クライアントは `Content-Length` 付きでアップロードする必要があります。主要な S3 クライアントはすべて最初からそうするため、影響があるのはパイプからストリームする自作の HTTP スクリプトだけです。Apache の既定のボディ処理は、小さなチャンクボディをメモリ上で `Content-Length` に変換しますが、大きなボディはチャンクのまま転送します。そのため、そのようなクライアントは小さなファイルでは動いて見え、大きなファイルで失敗することがあります。`SetEnv proxy-sendcl 1` はフォールバックとしてチャンクボディを `Content-Length` に変換します。その代わり、各ボディを先にプロキシのディスクへスプールします。

:::

:::warning[署名付き URL と Content-Type ヘッダー]

署名付き URL は、署名の対象にしたヘッダーを固定します。`Content-Type` なしで URL を生成した場合、アップロード側でそのヘッダーを追加してはいけません。署名に含まれないヘッダーに対して、RustFS は `403 SignatureDoesNotMatch` を返します。`curl -d` と `curl --data-binary` は、独自に `Content-Type: application/x-www-form-urlencoded` を付けます。アップロードが `Content-Type` を送る場合は、同じ値で URL に署名し（AWS SDK では `ContentType` パラメーター）、リクエストをその値と完全に一致させます。

:::

## RustFS に合わない設定

次の Apache の既定値とオプションは、S3 のセマンティクスを壊すか、リソースを無駄にします。この設定では、いずれも使っていません。

| 設定 | RustFS への影響 |
| --- | --- |
| `ProxyPreserveHost Off`（既定） | `Host` を書き換えます。署名済みリクエストは `SignatureDoesNotMatch` で失敗します。 |
| `nocanon` のない `ProxyPass` | リクエストパスを正規化します。署名済みのパスは検証に失敗します。 |
| `AllowEncodedSlashes Off`（既定） | `%2F` を含むオブジェクトキーに対して `404` を返します。 |
| パスプレフィックス（`ProxyPass /s3/`、`Alias`、rewrite ルール） | リクエストパスを書き換えます。S3 API はルートパスのままにします。 |
| `ProxyErrorOverride On` | RustFS の S3 XML エラーを Apache のエラーページに置き換えます。S3 SDK はこれを解析できません。 |
| `SetEnv proxy-sendcl 1`、`SetEnv force-proxy-request-1.0 1` | アップストリームへ `Content-Length` を強制し、転送前にチャンクのリクエストボディをディスクへスプールします。チャンクしか送れないクライアントは救えますが、大きなアップロードにディスク I/O が加わります。 |
| `SetEnv proxy-sendchunked 1` | アップストリームへチャンク転送を強制します。RustFS はこれを `400 UnexpectedContent` で拒否します。 |
| `mod_proxy_wstunnel`（`ProxyPass ... ws://`） | 2.4.47 以降は非推奨です。代わりに `mod_proxy_http` の `upgrade=websocket` を使います。 |

プロキシの設定では取り除けない、RustFS 側の制限が 2 つあります。

- 空のパスセグメント（`//`）またはドット（`.`）を含むオブジェクトキーは、プロキシがなくても `InvalidArgument` で拒否されます。
- RustFS v2.x では Console は `/rustfs/console/` の下にあり、Console のルートパスは S3 形式の XML で応答します。

## マルチノードのバックエンド [#multi-node-backends]

分散構成の RustFS デプロイでは、単一の `ProxyPass` 先を、すべての RustFS ノードを列挙したバランサーに置き換えます。S3 仮想ホストのプロキシブロックは、次に置き換えます。

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

Console 仮想ホストのプロキシブロックは、次に置き換えます。

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

`ROUTEID` Cookie により、進行中の OpenID Connect ログインは、その `state` を作成した RustFS ノードに留まります。`upgrade=websocket` は各 `BalancerMember` 行に残します。`ProxySet` はこのパラメーターを受け付けません。ノード間の内部 RPC は同じリスナーを使うため、RustFS ノード間ではポート `9000` を直接開けたままにします。

## 次のステップ

- [S3 クライアントを設定する](/ja/developer/examples/aws-cli)
- [仮想ホスト形式のバケット URL を有効にする](/ja/integration/virtual)
- [ヘルスと準備完了のエンドポイントを確認する](/ja/operations/status-check)
