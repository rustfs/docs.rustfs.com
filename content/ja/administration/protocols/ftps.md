---
title: "FTP(S)"
description: "RustFS の FTP または FTPS ゲートウェイを設定し、FTP クライアントでバケットとオブジェクトを管理する方法を説明します。"
---

RustFS には、バケットとオブジェクトを標準の FTP クライアントへ公開する FTP ゲートウェイが含まれます。隔離したローカルテストでは暗号化しない FTP として、暗号化接続では明示的な FTP over TLS（FTPS）として実行できます。RustFS は各セッションをアイデンティティとアクセス管理（IAM）に対して認証し、そのユーザーの S3 ポリシーをストレージ操作へ適用します。

FTP と FTPS のサポートは標準の RustFS バイナリにコンパイルされていますが、両方のリスナーは実行時に既定で無効です。使う予定のリスナーだけを有効にします。

## 概要

ゲートウェイは、FTP のパスを RustFS のリソースへ対応付けます。

| FTP パス | RustFS のリソース |
| --- | --- |
| `/` | 認証されたユーザーから見えるすべてのバケット |
| `/my-bucket/` | `my-bucket` バケット |
| `/my-bucket/hello.txt` | `my-bucket` 内の `hello.txt` オブジェクト |

次の FTP 操作に対応しています。

| FTP コマンド | 操作 |
| --- | --- |
| `LIST` | ルートのバケット、またはバケット内のオブジェクトとプレフィックスを一覧します |
| `MKD` | バケットを作成します |
| `CWD` | バケットに入ります |
| `STOR` | オブジェクトをアップロードします |
| `RETR` | オブジェクトをダウンロードします |
| `DELE` | オブジェクトを削除します |
| `RMD` | バケットとそのオブジェクトを再帰的に削除します |

RustFS は現時点では、FTP の名前変更と、既存オブジェクトへ追記するアップロードには対応していません。S3 ストレージにはネイティブな作業ディレクトリや POSIX のディレクトリモデルがないため、クライアント固有のファイルシステム操作は、従来の FTP サーバーと同じようには動作しない場合があります。

FTP のユーザー名には RustFS のアクセスキーを、パスワードにはそのシークレットキーを入力します。無効なユーザー名とパスワードは、いずれも `530 Not logged in` を返します。ログイン後、RustFS は操作ごとに IAM ユーザーの S3 権限を確認します。

:::danger[平文の FTP は認証情報を露出します]

FTP は、認証情報とデータを暗号化せずに送信します。平文の FTP は、ループバックまたは隔離したテストネットワークにだけバインドします。リモート接続と本番接続では、すべて FTPS を使います。

:::

:::warning[バケットの削除は再帰的です]

現在の `RMD` の実装は、バケットを削除する前に、対象バケット内のオブジェクトを削除します。FTP クライアントで `rmdir` を実行する前に、パスを確認します。

:::

## 設定

FTP と FTPS は、別々のリスナーと環境変数を使います。

### FTP の変数

| 変数 | 説明 | 既定値 |
| --- | --- | --- |
| `RUSTFS_FTP_ENABLE` | 暗号化しない FTP リスナーを有効にします。 | `false` |
| `RUSTFS_FTP_ADDRESS` | FTP 制御接続のバインドアドレスです。 | `0.0.0.0:8021` |
| `RUSTFS_FTP_PASSIVE_PORTS` | `start-end` 形式の、両端を含むパッシブデータポートの範囲です。 | `40000-50000` |
| `RUSTFS_FTP_EXTERNAL_IP` | RustFS が NAT の背後にあるとき、パッシブクライアントへ通知する公開 IP またはホスト名です。 | 未設定 |

### FTPS の変数

| 変数 | 説明 | 既定値 |
| --- | --- | --- |
| `RUSTFS_FTPS_ENABLE` | 明示的な FTPS リスナーを有効にします。 | `false` |
| `RUSTFS_FTPS_ADDRESS` | FTPS 制御接続のバインドアドレスです。 | `0.0.0.0:8022` |
| `RUSTFS_FTPS_TLS_ENABLED` | FTPS リスナーで TLS を有効にします。FTPS では有効のままにします。 | `true` |
| `RUSTFS_FTPS_CERTS_DIR` | FTPS の証明書と秘密鍵を含むディレクトリです。FTPS では必須です。 | 未設定 |
| `RUSTFS_FTPS_PASSIVE_PORTS` | `start-end` 形式の、両端を含むパッシブデータポートの範囲です。 | `40000-50000` |
| `RUSTFS_FTPS_EXTERNAL_IP` | RustFS が NAT の背後にあるとき、パッシブクライアントへ通知する公開 IP またはホスト名です。 | 未設定 |

標準の RustFS ビルドでは、FTP と FTPS の両方を提供するコンパイル時機能 `ftps` が有効です。`--no-default-features` で RustFS をビルドする場合は、この機能を明示的に含めます。

```bash
cargo build --release --features ftps
```

### FTP でのローカルテスト

ループバックインターフェースで、暗号化しない FTP リスナーを起動します。

```bash
export RUSTFS_FTP_ENABLE=true
export RUSTFS_FTP_ADDRESS=127.0.0.1:8021
export RUSTFS_FTP_PASSIVE_PORTS=40000-40010
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

`127.0.0.1` にバインドすると、リモートホストは暗号化されていないリスナーへ接続できません。

### テスト用証明書を用意する

FTPS は、証明書ディレクトリに `rustfs_cert.pem` と `rustfs_key.pem` があることを前提とします。ローカルテストでは、有効期間の短い自己署名証明書を作成します。

```bash
mkdir -p /path/to/ftps-certs

openssl req -x509 -newkey rsa:2048 -nodes \
	-keyout /path/to/ftps-certs/rustfs_key.pem \
	-out /path/to/ftps-certs/rustfs_cert.pem \
	-days 7 \
	-subj "/CN=localhost" \
	-addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

本番では、信頼できる認証局が発行した証明書を使います。`rustfs_key.pem` を不正なアクセスから保護し、証明書のサブジェクト代替名が、クライアントの使うホストと一致するようにします。

### FTPS を起動する

明示的な FTPS リスナーを設定します。

```bash
export RUSTFS_FTPS_ENABLE=true
export RUSTFS_FTPS_ADDRESS=0.0.0.0:8022
export RUSTFS_FTPS_TLS_ENABLED=true
export RUSTFS_FTPS_CERTS_DIR=/path/to/ftps-certs
export RUSTFS_FTPS_PASSIVE_PORTS=40000-50000

rustfs /path/to/data
```

RustFS は、FTPS の制御チャネルとデータチャネルの両方で TLS を必須とします。クライアントは **explicit FTP over TLS**（明示的な FTP over TLS）に設定します。**FTPES**、または **Require explicit FTP over TLS**（明示的な FTP over TLS を必須にする）と表示される場合もあります。暗黙的 FTPS は、このリスナーが実装する方式ではありません。

証明書ディレクトリが未指定である、存在しない、または使える証明書と鍵を含まない場合、FTPS の初期化は失敗します。証明書全般の手順は、[TLS を設定する](/ja/integration/tls-configured)を参照します。

### パッシブ接続を設定する

FTP はコマンドに制御ポートを使い、一覧とファイル転送には別のデータ接続を使います。パッシブモードでは、次のようにします。

1. 設定した制御ポートへの受信 TCP トラフィックを許可します。
2. 設定したパッシブ範囲のすべてのポートへの受信 TCP トラフィックを許可します。
3. クライアントが NAT またはロードバランサー経由で接続する場合は、`RUSTFS_FTP_EXTERNAL_IP` または `RUSTFS_FTPS_EXTERNAL_IP` を設定します。

たとえば、NAT の背後にある FTPS サーバーは、公開ホスト名を通知できます。

```bash
export RUSTFS_FTPS_EXTERNAL_IP=storage.example.com
export RUSTFS_FTPS_PASSIVE_PORTS=40000-40100
```

平文の FTP リスナーには、対応する FTP 接頭辞の変数を使います。RustFS はアクティブとパッシブの両方の転送モードに対応しますが、クライアントのファイアウォール越しでは、一般にパッシブモードの方が運用しやすいです。

## 使い方

例では [`lftp`](https://lftp.yar.ru/) と、標準の名前である `my-bucket` および `hello.txt` を使います。IAM ユーザーには、各操作に必要な S3 権限が必要です。

### FTP で接続する

平文の FTP は、ループバックのテストリスナーだけで使います。

```bash
lftp -u <your-access-key> ftp://127.0.0.1:8021
```

`lftp` がパスワードを求めたら、シークレットキーを入力します。

### FTPS で接続する

明示的な FTPS リスナーへ接続し、制御接続とデータ接続の暗号化を必須にします。

```bash
lftp -u <your-access-key> -e '
	set ftp:ssl-force true;
	set ftp:ssl-protect-data true;
	open ftp://storage.example.com:8022
'
```

求められたらシークレットキーを入力します。本番では、証明書の検証を有効なままにします。

自己署名のローカルテスト証明書に限って、`localhost` へ接続し、そのセッションでは証明書の検証を無効にします。

```bash
lftp -u <your-access-key> -e '
	set ftp:ssl-force true;
	set ftp:ssl-protect-data true;
	set ssl:verify-certificate no;
	open ftp://localhost:8022
'
```

:::warning

本番では、証明書の検証を無効にしないでください。代わりに、発行元の CA をクライアントの信頼ストアへインストールします。

:::

### バケットを一覧し、バケットを作成する

`lftp` のプロンプトで、見えるバケットを一覧し、`my-bucket` を作成します。

```text
lftp> cls -1 /
lftp> mkdir my-bucket
lftp> cd my-bucket
```

バケット名は、S3 API で作成するバケットと同じ命名規則に従う必要があります。

### オブジェクトをアップロードおよびダウンロードする

`/path/to/hello.txt` をアップロードし、バケットを一覧して、オブジェクトをダウンロードします。

```text
lftp> put /path/to/hello.txt -o hello.txt
lftp> ls
lftp> get hello.txt -o hello.txt
```

アップロードは、同じキーのオブジェクトを置き換えます。既存オブジェクトへの追記には対応していません。

### オブジェクトとバケットを削除する

オブジェクトを削除し、ルートに戻って、バケットを削除します。

```text
lftp> rm hello.txt
lftp> cd /
lftp> rmdir my-bucket
```

`rmdir` は、バケットを削除する前に、残っているオブジェクトを再帰的に削除します。

### ほかのクライアントから接続する

FileZilla や Cyberduck などのグラフィカルな FTP クライアントでは、次の設定を使います。

| 設定 | FTP テストリスナー | FTPS リスナー |
| --- | --- | --- |
| プロトコル | FTP | FTP over TLS（explicit） |
| ホスト | `127.0.0.1` | 使用する FTPS のホスト名 |
| ポート | `8021` | `8022` |
| ユーザー名 | RustFS のアクセスキー | RustFS のアクセスキー |
| パスワード | RustFS のシークレットキー | RustFS のシークレットキー |
| 転送モード | パッシブ | パッシブ |

ログインには成功しても、ディレクトリ一覧や転送がタイムアウトする場合は、まずパッシブポートのファイアウォール規則と外部 IP の設定を確認します。

## 次のステップ

- [認証情報を管理する](/ja/operations/credentials)
- [TLS を設定する](/ja/integration/tls-configured)
- [サービスの状態を確認する](/ja/operations/status-check)
