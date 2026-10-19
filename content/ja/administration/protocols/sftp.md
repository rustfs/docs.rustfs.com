---
title: "SFTP"
description: "RustFS の SFTP ゲートウェイをビルドして設定し、SFTP クライアントでバケットとオブジェクトへアクセスする方法を説明します。"
---

RustFS には、暗号化された SSH 接続でバケットとオブジェクトを SFTP クライアントへ公開する SSH File Transfer Protocol（SFTP）ゲートウェイが含まれます。バケットの一覧と作成、オブジェクトのアップロード、ダウンロード、名前変更、削除ができます。RustFS は、認証されたアイデンティティとアクセス管理（IAM）ユーザーの権限を各操作に適用します。

SFTP は任意のコンパイル時機能であり、既定の RustFS ビルドには含まれません。リスナーを有効にする前に、`sftp` または `full` 機能を付けて RustFS をビルドします。リスナーは実行時に既定で無効です。

## 概要

ゲートウェイは、SFTP のパスを RustFS のリソースへ対応付けます。

| SFTP パス | RustFS のリソース |
| --- | --- |
| `/` | 認証されたユーザーから見えるすべてのバケット |
| `/my-bucket/` | `my-bucket` バケット |
| `/my-bucket/hello.txt` | `my-bucket` 内の `hello.txt` オブジェクト |
| `/my-bucket/docs/hello.txt` | `my-bucket` 内の `docs/hello.txt` オブジェクト |

`/` の直下でディレクトリを作成または削除すると、バケットが作成または削除されます。バケットより下のディレクトリはオブジェクトキーのプレフィックスに対応し、独立したファイルシステムディレクトリとしては存在しません。

RustFS は、SFTP ゲートウェイ経由で次の操作に対応しています。

| SFTP 操作 | RustFS の操作 |
| --- | --- |
| `/` の一覧 | 見えるバケットを一覧します |
| バケットまたはプレフィックスの一覧 | オブジェクトとプレフィックスを一覧します |
| `/` での `mkdir` | バケットを作成します |
| `put` | オブジェクトをアップロードします |
| `get` | オブジェクトをダウンロードします |
| `rename` | オブジェクトをコピーしたあと、ソースを削除します |
| `rm` | オブジェクトを削除します |
| `/` での `rmdir` | 空のバケットを削除します |

SFTP のユーザー名には RustFS のアクセスキーを、パスワードにはそのシークレットキーを入力します。RustFS は、すべての操作について IAM ユーザーの S3 ポリシーを確認します。

:::warning[パスワード認証のみ]

SFTP ゲートウェイは、クライアントの公開鍵認証と匿名アクセスには対応していません。SSH ホストキーはサーバーを識別するものであり、クライアントを認証しません。RustFS の SFTP 向けに `authorized_keys` ファイルを設定しないでください。

:::

## 設定

### SFTP 対応でビルドする

SFTP 機能を付けて RustFS をビルドします。

```bash
cargo build --release --features sftp
```

SFTP を含むすべての任意機能を有効にするには、代わりに `--features full` を使います。`sftp` 機能なしでビルドしたバイナリでは、`RUSTFS_SFTP_ENABLE=true` を設定しても効果はありません。

### SFTP の変数

| 変数 | 説明 | 既定値 |
| --- | --- | --- |
| `RUSTFS_SFTP_ENABLE` | SFTP リスナーを有効にします。 | `false` |
| `RUSTFS_SFTP_ADDRESS` | SFTP 接続のバインドアドレスです。 | `0.0.0.0:2222` |
| `RUSTFS_SFTP_HOST_KEY_DIR` | 暗号化されていない SSH の秘密ホストキーを 1 つ以上含むディレクトリです。SFTP を有効にする場合は必須です。 | 未設定 |
| `RUSTFS_SFTP_READ_ONLY` | バケットまたはオブジェクトを変更する操作を拒否します。 | `false` |
| `RUSTFS_SFTP_IDLE_TIMEOUT` | SSH の無操作タイムアウト（秒）です。ゼロより大きい必要があります。 | `600` |
| `RUSTFS_SFTP_PART_SIZE` | マルチパートアップロードのパートサイズ（バイト）です。 | `16777216`（16 MiB） |

既定のポート `2222` は、特権が必要な SSH ポート `22` を避けます。アドレスには IPv4 または IPv6 の構文を使えます。たとえば `127.0.0.1:2222` や `[::]:2222` です。

### ホストキーを用意する

永続的なホストキーのディレクトリを作成し、Ed25519 のホストキーを生成します。

```bash
mkdir -p /path/to/sftp-keys
ssh-keygen -t ed25519 \
	-f /path/to/sftp-keys/ssh_host_ed25519_key \
	-N ""
chmod 600 /path/to/sftp-keys/ssh_host_ed25519_key*
```

ホストキーにパスフレーズを設定してはいけません。RustFS は、復号できる ECDSA と RSA の秘密ホストキーも受け付けます。

Unix では、ホストキーディレクトリ内のすべての通常ファイルを、所有者だけがアクセスできるようにする必要があります。`ssh-keygen` コマンドは `.pub` ファイルも作成します。表示のとおり所有者だけの権限で残すか、削除します。RustFS はこのファイルを読みません。ディレクトリがない、使える秘密鍵がない、またはグループやその他の権限ビットが立った通常ファイルがある場合、RustFS は起動を拒否します。

:::warning[ホストキーを保護する]

再起動をまたいで同じホストキーを維持し、クライアントがサーバーの識別情報を検証できるようにします。アクセスは RustFS を実行するアカウントに限定し、鍵を安全にバックアップします。ホストキーが変わると、クライアントは中間者攻撃の可能性があるという警告を表示します。

:::

### SFTP リスナーを起動する

次の例は、ローカルテスト用にループバックインターフェースで SFTP を起動します。

```bash
export RUSTFS_SFTP_ENABLE=true
export RUSTFS_SFTP_ADDRESS=127.0.0.1:2222
export RUSTFS_SFTP_HOST_KEY_DIR=/path/to/sftp-keys
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

リモート接続では、適切なネットワークインターフェースにバインドし、設定した SFTP ポートへの受信 TCP トラフィックを許可します。このリスナーは、S3 API と Console のリスナーとは別です。

## 使い方

次の例では、OpenSSH の `sftp` クライアント、標準の名前である `my-bucket` と `hello.txt`、ポート `2222` のローカルリスナーを使います。

### 接続する

```bash
sftp -P 2222 <your-access-key>@127.0.0.1
```

パスワードを求められたら、RustFS のシークレットキーを入力します。初回接続では、表示されたホストキーのフィンガープリントを確認してから受け入れます。

### バケットを一覧して作成する

`sftp` のプロンプトで、IAM ユーザーから見えるバケットを一覧し、`my-bucket` を作成します。

```text
sftp> ls /
sftp> mkdir /my-bucket
sftp> cd /my-bucket
```

バケット名は、S3 API で作成するバケットと同じ命名規則に従う必要があります。`/` の直下にファイルを作成することはできません。

### オブジェクトをアップロードおよびダウンロードする

`/path/to/hello.txt` をアップロードし、バケットを一覧して、オブジェクトをダウンロードします。

```text
sftp> put /path/to/hello.txt /my-bucket/hello.txt
sftp> ls /my-bucket
sftp> get /my-bucket/hello.txt hello.txt
```

アップロードは、ファイルの先頭から順に行う必要があります。再開、追記、その場での編集、1 つのオブジェクトを分割した複数接続アップロードには対応していません。

### オブジェクトの名前を変更する

```text
sftp> rename /my-bucket/hello.txt /my-bucket/greeting.txt
```

RustFS は名前変更を、サーバー側のコピーと、そのあとのソース削除として実装します。この操作はアトミックではなく、バケットの名前変更には対応していません。IAM ユーザーには、ソースの読み取りと削除、および宛先への書き込みの権限が必要です。

### オブジェクトとバケットを削除する

オブジェクトを削除し、そのあと空のバケットを削除します。

```text
sftp> rm /my-bucket/greeting.txt
sftp> rmdir /my-bucket
```

RustFS は、SFTP 経由で空でないバケットを再帰的に削除しません。

### デスクトップクライアントから接続する

FileZilla、Cyberduck、WinSCP などのグラフィカルクライアントでは、次の設定を使います。

| 設定 | 値 |
| --- | --- |
| プロトコル | SFTP（SSH File Transfer Protocol） |
| ホスト | 使用する RustFS の SFTP ホスト名 |
| ポート | `2222`、または `RUSTFS_SFTP_ADDRESS` のポート |
| ユーザー名 | RustFS のアクセスキー |
| パスワード | RustFS のシークレットキー |
| 認証 | パスワード |

クライアントは、ファイル全体を単一接続でアップロードする設定にします。ゲートウェイは SFTP 操作をオブジェクトストレージへ対応付けるため、シンボリックリンクや、POSIX の所有者、権限、タイムスタンプの変更には対応していません。

## 次のステップ

- [認証情報を管理する](/ja/operations/credentials)
- [サービスの状態を確認する](/ja/operations/status-check)
- [ライフサイクル管理を設定する](/ja/administration/data/lifecycle-management)
