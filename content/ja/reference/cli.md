---
title: "CLI リファレンス"
description: "rustfs のサブコマンド、サーバーフラグ、対応する環境変数、ボリュームパスの構文をまとめたリファレンスです。"
---

`rustfs` バイナリは 6 つのサブコマンドを備えています。サブコマンドを付けずに `rustfs` を実行すると、サーバーが起動します。

## サブコマンド

| コマンド | 説明 |
| --- | --- |
| `rustfs server [OPTIONS] <VOLUMES>...` | オブジェクトストレージサーバーを起動します（サブコマンドを省略したときの既定動作です）。 |
| `rustfs info [--all] [--json] [system\|runtime\|build\|config\|deps]` | システム、ランタイム、ビルド、設定、または依存関係の情報を表示します。 |
| `rustfs tls inspect --path <DIR>` | TLS 証明書ディレクトリの配置と解析状態を検査します。 |
| `rustfs diagnose [OPTIONS] <PATHS>...` | ログファイルを分析し、可能性の高い障害原因を報告します。 |
| `rustfs inspect <COMMAND>` | サーバーを起動せずに、永続化されたバケットメタデータを検査します。 |
| `rustfs connect <COMMAND>` | 外向きの RustFS Connect 連携を設定します。 |

```bash title="Examples"
rustfs server /data/rustfs
rustfs info --all --json
rustfs tls inspect --path /etc/rustfs/tls
```

### 従来の起動方法との互換性

後方互換のため引数は前処理されるので、従来の起動方法もそのまま動作します。

| 従来の形式 | 解釈 |
| --- | --- |
| `rustfs /data` | `rustfs server /data` |
| `rustfs --address :9000 /data` | `rustfs server --address :9000 /data` |
| `rustfs`（引数なし） | `RUSTFS_VOLUMES` からボリュームを読み込む `rustfs server` |
| `rustfs --info` | `rustfs info` |
| `rustfs help` | `rustfs --help` |

## サーバーフラグ

すべてのサーバーフラグには、対応する環境変数があります。両方を設定した場合は、フラグが優先されます。

| フラグ | 環境変数 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `<VOLUMES>...`（位置引数） | `RUSTFS_VOLUMES` | required | ストレージボリュームまたはエンドポイントを、空白区切りで指定します。 |
| `--address` | `RUSTFS_ADDRESS` | `:9000` | S3 API のバインドアドレスです（`ADDRESS:PORT`。IP またはホスト名）。 |
| `--server-domains` | `RUSTFS_SERVER_DOMAINS` | unset | 仮想ホスト形式のリクエストに使う、カンマ区切りのドメインです。 |
| `--access-key` | `RUSTFS_ACCESS_KEY` | unset | ルートアクセスキーです（`--access-key-file` と競合します）。 |
| `--access-key-file` | `RUSTFS_ACCESS_KEY_FILE` | unset | ルートアクセスキーを格納したファイルです。 |
| `--secret-key` | `RUSTFS_SECRET_KEY` | unset | ルートシークレットキーです（`--secret-key-file` と競合します）。 |
| `--secret-key-file` | `RUSTFS_SECRET_KEY_FILE` | unset | ルートシークレットキーを格納したファイルです。 |
| `--console-enable` | `RUSTFS_CONSOLE_ENABLE` | `true` | 組み込みの Web Console を有効にします。 |
| `--console-address` | `RUSTFS_CONSOLE_ADDRESS` | `:9001` | Console のバインドアドレスです。 |
| `--obs-endpoint` | `RUSTFS_OBS_ENDPOINT` | empty | トレース、メトリクス、ログ向けの OTLP/HTTP ベース URL です。 |
| `--tls-path` | `RUSTFS_TLS_PATH` | unset | API と Console 用の TLS 証明書ディレクトリです。 |
| `--license` | `RUSTFS_LICENSE` | unset | ライセンス文字列です。 |
| `--region` | `RUSTFS_REGION` | unset | クライアントへ報告するサービスリージョンです。 |
| `--kms-enable` | `RUSTFS_KMS_ENABLE` | `false` | KMS によるサーバー側の暗号化を有効にします。 |
| `--kms-backend` | `RUSTFS_KMS_BACKEND` | `local` | KMS バックエンドです。指定できる値は `local`、`vault` / `vault-kv2`、`vault-transit` です。 |
| `--kms-key-dir` | `RUSTFS_KMS_KEY_DIR` | unset | ローカル KMS バックエンドのキーディレクトリです。 |
| `--kms-local-master-key` | `RUSTFS_KMS_LOCAL_MASTER_KEY` | unset | ローカル KMS のキーファイルを暗号化するマスターキーです。 |
| `--kms-vault-address` | `RUSTFS_KMS_VAULT_ADDRESS` | unset | Vault バックエンドが使う Vault のアドレスです。 |
| `--kms-vault-token` | `RUSTFS_KMS_VAULT_TOKEN` | unset | Vault バックエンドが使う Vault トークンです。 |
| `--kms-vault-mount-path` | `RUSTFS_KMS_VAULT_MOUNT_PATH` | unset | `vault-transit` の Transit マウントです（既定値は `transit`）。`vault` / `vault-kv2` では非推奨であり、使用されません。 |
| `--kms-default-key-id` | `RUSTFS_KMS_DEFAULT_KEY_ID` | unset | 暗号化に使う既定の KMS キー ID です。 |
| `--kms-allow-insecure-dev-defaults` | `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS` | `false` | 開発専用の、安全でない KMS 既定値を許可します。 |
| `--buffer-profile` | `RUSTFS_BUFFER_PROFILE` | `GeneralPurpose` | 適応的なバッファサイズ決定に使うワークロードプロファイルです。 |
| `--buffer-profile-disable` | `RUSTFS_BUFFER_PROFILE_DISABLE` | `false` | 従来の固定サイズバッファを使います。 |

:::note

`--access-key` と `--secret-key`、およびそれらのファイル形式のいずれも指定しない場合、サーバーは組み込みの既定認証情報（`rustfsadmin`/`rustfsadmin`）にフォールバックし、警告をログに記録します。一時的な検証以外のデプロイでは、実際の認証情報を設定します。

:::

## ボリュームの構文

ボリュームは位置引数（または `RUSTFS_VOLUMES`）として渡し、空白で区切ります。

### 省略記号による展開

ボリュームトークンには、数値として展開される `{N...M}` 範囲を 1 つ以上含められます。

```bash title="Ellipses expansion"
# Expands to /data/rustfs0 /data/rustfs1 /data/rustfs2 /data/rustfs3
rustfs server /data/rustfs{0...3}

# Multi-node: expands across hosts and disks
rustfs server http://node{1...4}:9000/data/rustfs{0...3}
```

パーサーで確認済みの規則は次のとおりです。

- 範囲の形式は `{N...M}` です。`N` と `M` は 10 進または 16 進の正の整数であり、`M` は `N` より大きい必要があります。
- 1 つのトークンに複数の範囲を含められます（例: ホスト範囲とディスク範囲）。すべての組み合わせが展開されます。
- 1 つの範囲を展開したときの最大数は 10,000 エントリです。

### 複数のプール

サーバープールを分けるには、エンドポイントのグループを空白区切りで並べます。各引数（空白で区切られた 1 つ）が、それぞれ独自の展開グループになります。

```bash title="Two pools"
rustfs server http://node{1...4}:9000/data/rustfs{0...3} http://node{5...8}:9000/data/rustfs{0...3}
```

環境変数で設定する場合は、同じ文字列を `RUSTFS_VOLUMES` に指定します。

```bash title="Via environment"
export RUSTFS_VOLUMES="http://node{1...4}:9000/data/rustfs{0...3}"
rustfs server
```
