---
title: "仮想ホスト形式"
description: "RustFS でパススタイルアクセスと仮想ホスト形式の S3 URL を設定します。"
---

RustFS は、次の 2 つの S3 URL 形式に対応しています。

1. 仮想ホスト形式
2. パススタイルアクセス

2 つの形式は、URL のどこにバケット名が現れるかが異なります。

## パススタイルアクセス

パススタイルアクセスが既定です。パススタイルの URL では、バケット名がエンドポイントの後ろに続きます。

例（バケット: `test`、ホスト: `rustfs.yourdomain.com`）:

```text
http://rustfs.example.com/my-bucket
```

**注意**: パススタイルアクセスに設定は不要です。

## 仮想ホスト形式

仮想ホスト形式では、バケット名がドメインの一部になります。

例（バケット: `test`、ホスト: `rustfs.yourdomain.com`）:

```text
http://my-bucket.rustfs.example.com/
```

### 設定

1. **DNS**: ワイルドカード DNS レコードを作成します（例: `*.rustfs.yourdomain.com` → サーバーの IP アドレス）。
2. **設定**: 設定ファイルを変更します（Linux: `/etc/default/rustfs`、Docker / Kubernetes: 環境変数）。
3. **ドメインの設定**: `RUSTFS_SERVER_DOMAINS = "rustfs.yourdomain.com"` を設定します。
4. **再起動**: サービスを再起動します（`systemctl restart rustfs`）。

### ドメイン内のポート（任意）

仮想ホストのルーティングは S3 API リスナー（既定のポートは 9000）に適用されます。RustFS は、S3 リスナー自身のポートを含む `Host` ヘッダーを自動的に照合します。クライアントが **別の** ポート経由で RustFS に到達する場合（プロキシ経由など）に限り、そのポートを `RUSTFS_SERVER_DOMAINS` に含める必要があります。

例（`rustfs.yourdomain.com:8000`）:

```ini title="/etc/default/rustfs"
RUSTFS_SERVER_DOMAINS=rustfs.example.com:8000
```

これにより、次のようなリクエストが、

```text
http://my-bucket.rustfs.example.com:8000/
```

仮想ホスト形式で正しくルーティングされます。

:::warning[Host ヘッダーとの一致]

`RUSTFS_SERVER_DOMAINS` の値は、クライアントが送信する `Host` ヘッダー（ポートが含まれる場合はそのポートも含む）と完全に一致する必要があります。

:::
