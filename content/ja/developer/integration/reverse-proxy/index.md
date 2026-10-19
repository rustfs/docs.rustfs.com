---
title: "リバースプロキシ"
description: "RustFS の S3 API と Console 向けに、リバースプロキシを選択して設定します。"
---

リバースプロキシを使い、管理しているホスト名と TLS エンドポイント経由で **RustFS** の S3 API と Console を公開します。

S3 API（ポート `9000`）と Console（ポート `9001`）には、別々のホスト名を使うことを推奨します。S3 クライアントはリクエストパスに署名するため、S3 API はそのホスト名のルートから提供します。

## 対応ガイド

- [Nginx](./nginx.md)
- [Traefik](./traefik.md)
- [Caddy](./caddy.md)
- [HAProxy](./haproxy.md)
- [Envoy](./envoy.md)
- [Apache HTTP Server](./httpd.md)

## 関連する設定

クライアントが仮想ホスト形式の URL でバケットにアクセスする場合は、[仮想ホスト形式のアクセス](/ja/integration/virtual)を参照します。
