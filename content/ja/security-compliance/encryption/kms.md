---
title: "SSE-KMS"
description: "RustFS で、ローカルまたは HashiCorp Vault の KMS バックエンドを使って SSE-KMS を設定します。"
---

RustFS の鍵管理サービス（KMS）は、[SSE-S3](./sse-s.md) と SSE-KMS のために、オブジェクトごとのデータ暗号化鍵を生成してラップします。このガイドでは、ローカル鍵ストア、Vault KV v2、または Vault Transit を使い、サーバー起動時に SSE-KMS を設定します。

## 要件

- 暗号化の確認手順のために、[`rc`](/ja/operations/rc) をインストールして設定します。
- 暗号化設定を変更する前に、既存のデータと KMS の鍵材料をすべてバックアップします。
- すべての RustFS ノードに、同じ KMS バックエンドとデフォルト鍵 ID を適用します。
- シークレットをソース管理にコミットせずに注入する、プロセスマネージャーまたはシークレットマネージャーを使います。
- Vault では、必要なシークレットエンジンを有効にし、最小権限のトークンを作成し、すべての RustFS ノードから Vault に到達できるようにします。
- その ID を RustFS のデフォルト鍵として設定する前に、KMS マスターキーを用意します。

:::warning[鍵を失うと暗号化されたオブジェクトは読めなくなります]

RustFS は、設定したバックエンド以外に、回復できる KMS マスターキーのコピーを保存しません。暗号化されたオブジェクトを書き込む前に、ローカルの鍵ファイルとそのマスターキーをバックアップするか、Vault のデータと回復用認証情報を保護します。

:::

## バックエンドを選ぶ

| バックエンド | `RUSTFS_KMS_BACKEND` | 鍵の保管とラッピング | 想定する用途 |
| --- | --- | --- | --- |
| ローカル | `local` | RustFS ホスト上の鍵ファイル | 開発、テスト、または慎重にバックアップした単一ホストのデプロイ |
| Vault KV2 | `vault` または `vault-kv2` | Vault KV v2 内のマスターキー材料。データ鍵のラッピングは RustFS 内 | 集中管理された鍵の保管 |
| Vault Transit | `vault-transit` | Vault Transit を通じた暗号操作 | KV2 バックエンドモードを使わない、集中管理された本番の鍵管理 |

SSE-S3 と SSE-KMS は、どちらも KMS サービスが稼働している必要があります。バケットのデフォルトだけを設定しても、KMS が利用できないときに暗号化された書き込みが成功するわけではありません。

## ローカルバックエンドを設定する

RustFS プロセスの実行ユーザーが所有する、絶対パスの鍵ディレクトリを作成します。

```bash
sudo install -d -m 0700 -o rustfs -g rustfs /var/lib/rustfs/kms
```

すべてのノードの RustFS 環境ファイルに、KMS 設定を追加します。

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=local
RUSTFS_KMS_KEY_DIR=/var/lib/rustfs/kms
RUSTFS_KMS_LOCAL_MASTER_KEY=<your-kms-master-key>
```

`RUSTFS_KMS_KEY_DIR` は、RustFS サーバーの起動経路で必須です。ローカルバックエンドは、所有者だけがアクセスできる権限で鍵ファイルを書き込みます。一時的な鍵ディレクトリやローカルマスターキーの欠落といった開発用の既定値は、`RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS=true` を明示的に設定しない限り、RustFS が拒否します。本番では、この上書きを有効にしないでください。

環境を更新したあと、RustFS を再起動します。これで KMS バックエンドは起動しますが、マスターキーは作成されません。

```bash
sudo systemctl restart rustfs
sudo systemctl status rustfs --no-pager
```

## Vault KV2 を設定する

マスターキー材料とメタデータ用に、KV v2 エンジンを有効にします。RustFS はマスターキー材料を読み取り、データ鍵をローカルでラップします。このバックエンドは Vault Transit を呼び出しません。すべての RustFS ノードを設定します。

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=vault-kv2
RUSTFS_KMS_VAULT_ADDRESS=https://vault.example.com:8200
RUSTFS_KMS_VAULT_TOKEN=<your-vault-token>
RUSTFS_KMS_VAULT_KV_MOUNT=secret
RUSTFS_KMS_VAULT_KEY_PREFIX=rustfs/kms/keys
```

KV マウントの既定値は `secret`、鍵プレフィックスの既定値は `rustfs/kms/keys` です。上の変数で別のパスを選べます。設定した KV のデータパスとメタデータパスに対して認可された Vault トークンを使います。`RUSTFS_KMS_VAULT_MOUNT_PATH` は非推奨であり、KV2 バックエンドでは使われません。

マスターキー材料は KV2 内で Base64 エンコードされます。鍵パスへの KV 読み取りアクセスを持つアイデンティティは、平文のマスターキーを復元できます。そのアクセスは、信頼できる RustFS のアイデンティティに制限します。

RustFS は Vault の URL を検証し、`RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS=true` が設定されていない限り、安全でない開発用の既定値を拒否します。本番では、HTTPS と、RustFS ホストが信頼する証明書を使います。

## Vault Transit を設定する

Transit エンジンを有効にし、すべての RustFS ノードを設定します。

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=vault-transit
RUSTFS_KMS_VAULT_ADDRESS=https://vault.example.com:8200
RUSTFS_KMS_VAULT_TOKEN=<your-vault-token>
RUSTFS_KMS_VAULT_MOUNT_PATH=transit
```

Vault Transit は過去の鍵バージョンを保持するため、Transit 鍵をローテーションしても、それだけでは古いバージョンでラップされたオブジェクトが読めなくなることはありません。オブジェクトが依存している間は、古いバージョンを有効なままにします。

## デフォルト鍵を作成して選択する

`RUSTFS_KMS_DEFAULT_KEY_ID` は既存の鍵を選択します。鍵は作成しません。この変数なしで KMS バックエンドを起動し、鍵を作成してから、変数を追加して RustFS を再起動します。

インストール済みの `rc` が KMS のライフサイクルコマンドを提供している場合は、次のコマンドで鍵を作成して確認します。

```bash
rc admin kms status rustfs
rc admin kms key create rustfs --name rustfs-default-key
rc admin kms key status rustfs rustfs-default-key
```

その後、すべての RustFS ノードに同じデフォルト鍵 ID を追加します。

```ini title="/etc/default/rustfs"
RUSTFS_KMS_DEFAULT_KEY_ID=rustfs-default-key
```

デフォルトを変更したあとは、すべてのノードを一貫して再起動します。

Vault Transit では、デフォルトとして設定する前に、名前付きの Transit 鍵を Vault 上で直接作成することもできます。

```bash
vault write -f transit/keys/rustfs-default-key
```

:::note[rc のバージョン要件]

`rc 0.1.29` には `rc admin kms` が含まれていません。対応しているのは、以下で使うバケットとオブジェクトの暗号化コマンドだけです。鍵のライフサイクルコマンドに従う前に、`rc admin --help` を実行します。KMS のコマンドファミリーがない場合は、それを含む新しい `rc` リリースを使うか、ネイティブの RustFS KMS Admin API で鍵を用意します。

:::

<a id="verify-kms-backed-encryption"></a>

## KMS を使った暗号化を確認する

テスト用バケットを作成し、デフォルト鍵で SSE-KMS を設定し、オブジェクトをアップロードして読み戻します。

```bash
rc bucket create rustfs/my-bucket
rc bucket encryption set rustfs/my-bucket --mode sse-kms
rc bucket encryption info rustfs/my-bucket
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object show rustfs/my-bucket/hello.txt
```

特定の KMS 鍵を選ぶには、バケットのデフォルトか、個々の書き込みに設定します。

```bash
rc bucket encryption set rustfs/my-bucket \
	--mode sse-kms \
	--key-id rustfs-default-key

rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	--enc-kms rustfs/my-bucket/hello.txt=rustfs-default-key
```

`=` の前のセレクターは、`rc object copy` に渡す宛先と完全に一致する必要があります。

## 鍵をローテーションして回復する

- **Vault トークン:** 代替トークンを発行し、すべての RustFS ノードを更新し、一貫して再起動し、暗号化された読み取りと書き込みを確認してから、古いトークンを失効させます。
- **Vault Transit 鍵:** Vault で Transit 鍵をローテーションします。新しいラッピング操作は新しいバージョンを使い、Vault は復号のために古いバージョンを保持します。
- **ローカルまたは Vault KV2 の鍵材料:** ローテーションの前に現在の材料をバックアップし、ローテーションの前後に書き込まれたオブジェクトが読めることを確認します。
- **既存のオブジェクト:** マスターキーをローテーションしても、オブジェクトデータは書き換えられません。各オブジェクトは、暗号化メタデータとともに保存された、ラップ済みのデータ鍵を保持します。

保持しているオブジェクトが古いマスターキーのバージョンに依存していないことを確認するまで、そのバージョンを削除または無効にしないでください。

## 次のステップ

[SSE-S3](./sse-s.md) を設定します。クライアントが暗号化鍵の制御を保持する必要がある場合は、[SSE-C](./sse-c.md) を使います。
