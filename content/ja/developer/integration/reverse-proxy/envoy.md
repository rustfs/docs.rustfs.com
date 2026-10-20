---
title: "Envoy"
description: "S3 API と Console 向けに TLS を終端するルートを備え、Envoy の背後に RustFS をデプロイします。"
---

**Envoy** で TLS を終端し、別々のホスト名を RustFS の S3 API と Console へ振り分けます。このデプロイでは、同一の Docker ネットワーク上で Envoy とシングルノードの RustFS を動かします。Docker Engine、DNS レコード 2 件、および両方のホスト名をカバーする TLS 証明書が必要です（このガイドでは検証用に自己署名証明書を使います）。

このガイドでは、次のホスト名を例に使います。

- S3 API 用の `s3.example.com`
- Console 用の `console.example.com`

Docker ホストへ解決するホスト名に置き換えます。

:::warning[S3 はルートパスから公開する]

`/s3/` のようなパスの下に S3 API を公開しないでください。AWS Signature Version 4 はリクエストパスとホストを署名対象に含めるため、どちらかを書き換えると署名済みリクエストが無効になることがあります。Envoy は受信した `Host` ヘッダーを変更せずに転送するため、署名は有効なままです。

:::

## 1. デプロイ用ディレクトリを作成する

Envoy の設定と TLS 証明書用のディレクトリを作成します。

```bash
mkdir -p rustfs-envoy/certs
cd rustfs-envoy
```

ローカル検証では、両方のホスト名をカバーする自己署名証明書を生成します。

```bash
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/privkey.pem -out certs/fullchain.pem -days 30 \
  -subj "/CN=*.example.com" \
  -addext "subjectAltName=DNS:s3.example.com,DNS:console.example.com"
chmod 644 certs/privkey.pem
```

Envoy イメージが実行される root 以外のユーザーから、証明書を読めるようにします。`600` の秘密鍵は、誤解を招く `Failed to load incomplete private key` エラーになります。

## 2. Envoy を設定する

HTTPS リスナーと 2 つの仮想ホストを含む設定を作成します。長時間のストリーミング S3 アップロードが途中で切れないよう、ルートのタイムアウトは無効（`timeout: 0s`）にしています。

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

`host:*` のドメイン指定は重要です。標準外のポートではクライアントが `Host: s3.example.com:8443` を送り、Envoy はポートを含めた authority で照合します。

## 3. Envoy を起動する

RustFS と同じ Docker ネットワークで Envoy を実行し、公開するのはプロキシのポートだけにします。

```bash
docker run -d --name envoy --network oo-rustfs_default -p 8443:8443 \
  -v "$PWD/envoy.yaml":/envoy.yaml:ro \
  -v "$PWD/certs":/certs:ro \
  envoyproxy/envoy:v1.34-latest -c /envoy.yaml
```

## 4. 両方のエンドポイントを確認する

`curl --resolve` で例示ホスト名をプロキシへ向けます（本番では DNS がこれを行います）。

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

証明書が自己署名のため、`-k` は証明書の検証を省略します。信頼された証明書を使う場合は、このフラグを外します。

## 5. 署名済みの S3 リクエストを Envoy 経由で送る

任意の S3 クライアントを、RustFS そのものと同様にプロキシへ向けます。エンドポイントを `https://s3.example.com:8443` にし、パススタイルアクセスを設定します。プロキシの証明書が信頼されていれば、署名済みの AWS Signature Version 4 リクエストはそのまま通過します。平文 HTTP で手早く試す場合は、HTTPS リスナーと同じ仮想ホストのルーティングを持つ HTTP リスナーをポート 8080 に追加し、エンドポイント `http://s3.example.com:8080` を使います。

```bash
rc alias set rustfs-envoy http://s3.example.com:8080 <your-access-key> <your-secret-key>
rc ls rustfs-envoy/rclone-demo/
```

```text
[                   ]         0B seed/
[2026-09-29 11:12:41]        5 B write-test.txt
```

Envoy が元の `Host` ヘッダーを RustFS へ転送するため、署名は検証に通ります。

## マルチノードのバックエンド

分散構成の RustFS デプロイでは、S3 用クラスターにすべてのノードを追加します。

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

Console 用クラスターも、ポート `9001` で同じ形にします。

## トラブルシューティング

### `Failed to load incomplete private key from path`

Envoy コンテナは root 以外のユーザーで動作し、root 所有かつ `600` の鍵を読めません。鍵ファイルに `chmod 644` を行うか、コンテナユーザー（公式イメージでは UID `1001`）へ chown します。

### 正しいホスト名でもルートが `404` を返す

Envoy はポートを含めた authority で照合します。上の設定のとおり、各仮想ホストの `domains` リストに `host:*` のバリエーションを追加します。

### プロキシしたリクエストで RustFS が `Access Denied` を返す

プロキシがパスまたは `Host` ヘッダーを書き換えていないことを確認します。署名済みリクエストは、クライアントが署名したホストのまま RustFS に届く必要があります。

## 次のステップ

- [S3 クライアントを設定する](/ja/developer/examples/aws-cli)
- [仮想ホスト形式のバケット URL を有効にする](/ja/integration/virtual)
- [ヘルスと準備完了のエンドポイントを確認する](/ja/operations/status-check)
