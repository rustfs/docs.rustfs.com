---
title: "WebDAV"
description: "RustFS の WebDAV ゲートウェイを設定し、WebDAV クライアントでバケットとオブジェクトへアクセスする方法を説明します。"
---

RustFS には、HTTP または HTTPS でバケットとオブジェクトを WebDAV クライアントへ公開する Web Distributed Authoring and Versioning（WebDAV）ゲートウェイが含まれます。バケットの参照、コレクションの作成、オブジェクトのアップロード、ダウンロード、名前変更、削除ができます。RustFS は、認証されたアイデンティティとアクセス管理（IAM）ユーザーの権限を各操作に適用します。

WebDAV のサポートは標準の RustFS バイナリにコンパイルされていますが、ゲートウェイは実行時に既定で無効です。クライアントを接続する前に、有効にして設定する必要があります。

## 概要

ゲートウェイは、WebDAV のパスを RustFS のリソースへ対応付けます。

| WebDAV パス | RustFS のリソース |
| --- | --- |
| `/` | 認証されたユーザーから見えるすべてのバケット |
| `/my-bucket/` | `my-bucket` バケット |
| `/my-bucket/hello.txt` | `my-bucket` 内の `hello.txt` オブジェクト |
| `/my-bucket/docs/hello.txt` | `my-bucket` 内の `docs/hello.txt` オブジェクト |

RustFS は、ゲートウェイ経由で次の操作に対応しています。

| メソッド | 操作 |
| --- | --- |
| `PROPFIND` | バケットまたはオブジェクトを一覧し、メタデータを読み取ります |
| `MKCOL` | バケット、またはディレクトリのプレフィックスを作成します |
| `PUT` | オブジェクトをアップロードします |
| `GET` | オブジェクトをダウンロードします |
| `HEAD` | オブジェクトのメタデータを読み取ります |
| `MOVE` | オブジェクトまたはディレクトリの名前を変更するか、移動します |
| `DELETE` | オブジェクト、ディレクトリ、またはバケットを削除します |

コレクションの一覧には、`GET` ではなく `PROPFIND` を使います。現在のゲートウェイは、ディレクトリへの `GET` リクエストに対して `405 Method Not Allowed` を返します。

WebDAV は HTTP Basic 認証を使います。ユーザー名には RustFS のアクセスキーを、パスワードにはそのシークレットキーを入力します。ゲートウェイは認証情報を RustFS の IAM に対して認証し、各操作にそのユーザーの S3 ポリシーを適用します。

:::warning[認証情報を保護する]

Basic 認証は、認証情報を暗号化しません。TLS を無効にするのは、隔離したローカルテストだけにします。リモート接続と本番接続では、すべて HTTPS を使います。

:::

## 設定

RustFS を起動する前に、環境変数でゲートウェイを設定します。

| 変数 | 説明 | 既定値 |
| --- | --- | --- |
| `RUSTFS_WEBDAV_ENABLE` | WebDAV ゲートウェイを有効にします。 | `false` |
| `RUSTFS_WEBDAV_ADDRESS` | WebDAV 接続のバインドアドレスです。 | `0.0.0.0:8080` |
| `RUSTFS_WEBDAV_TLS_ENABLED` | WebDAV リスナーの TLS を有効にします。 | `true` |
| `RUSTFS_WEBDAV_CERTS_DIR` | RustFS の TLS ランタイムが使う証明書ディレクトリです。TLS を有効にする場合は必須です。 | 未設定 |
| `RUSTFS_WEBDAV_MAX_BODY_SIZE` | リクエスト本文の最大サイズ（バイト）です。ゼロより大きい必要があります。 | `5368709120`（5 GiB） |

標準の RustFS ビルドでは、WebDAV のコンパイル時機能が有効です。`--no-default-features` で RustFS をビルドする場合は、この機能を明示的に含めます。

```bash
cargo build --release --features webdav
```

### TLS なしのローカルテスト

次の例は、ポート `8080` で HTTP の WebDAV リスナーを付けて RustFS を起動します。

```bash
export RUSTFS_WEBDAV_ENABLE=true
export RUSTFS_WEBDAV_ADDRESS=127.0.0.1:8080
export RUSTFS_WEBDAV_TLS_ENABLED=false
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

`127.0.0.1` にバインドすると、ほかのホストは暗号化されていないテストエンドポイントへ接続できません。

### HTTPS

リモート接続または本番接続では、TLS を有効にし、証明書ディレクトリを指定します。

```bash
export RUSTFS_WEBDAV_ENABLE=true
export RUSTFS_WEBDAV_ADDRESS=0.0.0.0:8080
export RUSTFS_WEBDAV_TLS_ENABLED=true
export RUSTFS_WEBDAV_CERTS_DIR=/path/to/certs

rustfs /path/to/data
```

TLS を有効にしているのに `RUSTFS_WEBDAV_CERTS_DIR` がない場合、またはディレクトリが存在しない場合、WebDAV の初期化は失敗します。証明書の準備は、[TLS を設定する](/ja/integration/tls-configured)を参照します。

設定した WebDAV ポートへの受信 TCP トラフィックを許可します。このリスナーは、S3 API と Console のリスナーとは別です。

## 使い方

次のコマンドは、ローカルテスト用の HTTP エンドポイントを使います。エンドポイントと認証情報は、自分の HTTPS WebDAV エンドポイントと、必要なバケットおよびオブジェクトの権限を持つ IAM ユーザーに置き換えます。

シークレットを各コマンドへ直接書かずに、再利用できるシェル変数を設定します。

```bash
export WEBDAV_URL=http://127.0.0.1:8080
export WEBDAV_USER=<your-access-key>
read -s WEBDAV_PASSWORD
export WEBDAV_PASSWORD
```

### バケットを一覧する

ユーザーから見えるバケットを一覧するには、`Depth: 1` を付けた `PROPFIND` を送ります。

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request PROPFIND \
	--header "Depth: 1" \
	"$WEBDAV_URL/"
```

### バケットを作成する

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MKCOL \
	"$WEBDAV_URL/my-bucket/"
```

バケット名は、S3 API で作成するバケットと同じ命名規則に従う必要があります。

### オブジェクトをアップロードおよびダウンロードする

`/path/to/hello.txt` をアップロードします。

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--upload-file /path/to/hello.txt \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

オブジェクトをダウンロードします。

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--output hello.txt \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

### ディレクトリを作成して一覧する

バケットより下の WebDAV ディレクトリは、オブジェクトキーのプレフィックスに対応します。

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MKCOL \
	"$WEBDAV_URL/my-bucket/docs/"

curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request PROPFIND \
	--header "Depth: 1" \
	"$WEBDAV_URL/my-bucket/docs/"
```

### オブジェクトの名前を変更する

同じ WebDAV エンドポイント上の宛先パスを指定して、`MOVE` を使います。

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MOVE \
	--header "Destination: $WEBDAV_URL/my-bucket/greeting.txt" \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

IAM ユーザーには、ソースの読み取りと削除、および宛先への書き込みの権限が必要です。認可に失敗した場合、RustFS はソースを変更せずに残します。

### オブジェクトまたはバケットを削除する

オブジェクトを削除します。

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request DELETE \
	"$WEBDAV_URL/my-bucket/greeting.txt"
```

内容を削除したあと、バケットを削除します。

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request DELETE \
	"$WEBDAV_URL/my-bucket/"
```

### デスクトップクライアントから接続する

Basic 認証に対応したクライアントで、WebDAV エンドポイントを使います。

| クライアント | 接続アドレス |
| --- | --- |
| GNOME Files | HTTP は `dav://<host>:8080/`、HTTPS は `davs://<host>:8080/` |
| macOS Finder | `http://<host>:8080/` または `https://<host>:8080/` |
| Windows File Explorer | `https://<host>:8080/` |

クライアントが認証情報を求めたら、RustFS のアクセスキーとシークレットキーを入力します。クライアントの動作と、対応する WebDAV メソッドは製品によって異なります。トラブルシューティングでサーバー側のエラーを切り分けるときは、`curl` を使います。

## 次のステップ

- [認証情報を管理する](/ja/operations/credentials)
- [TLS を設定する](/ja/integration/tls-configured)
- [サービスの状態を確認する](/ja/operations/status-check)
