---
title: "認証情報の管理"
description: "RustFS のルート認証情報の設定とローテーション、ノード間 RPC シークレットの設定、MinIO 互換の環境変数エイリアスの使い方を説明します。"
---

## ルート認証情報

RustFS は、ルート（管理者）の認証情報の組を次から読み込みます。

```bash
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

どちらも指定されていない場合、サーバーは組み込みの既定値 `rustfsadmin` / `rustfsadmin` にフォールバックします。

:::warning[安全なルート認証情報を選ぶ]

[AWS 署名バージョン 4（SigV4）](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-signing-elements.html) は、スラッシュ区切りの認証情報スコープにアクセスキーを埋め込みます。

`<access-key>/<date>/<region>/<service>/aws4_request`

`RUSTFS_ACCESS_KEY` に `/` を含めてはなりません。含めると、アクセスキーと認証情報スコープが誤って解釈されます。RustFS が生成する形式に合わせ、大文字の ASCII 英字と数字（`A-Z`、`0-9`）だけを使うことを推奨します。Base64 の出力をそのままアクセスキーに使ってはなりません。`RUSTFS_SECRET_KEY` には、それとは別の強い乱数値を使います。

既定の `rustfsadmin` 認証情報は公開されており、広く知られています。コンテナのエントリポイントは警告を出力しますが、起動は継続します。ポート 9000/9001 を localhost の外へ公開する前に、必ず既定以外の認証情報を設定します。さらに、すべて既定の組で動作するマルチノードのクラスターでは、`RUSTFS_RPC_SECRET` を設定する必要があります（後述）。サーバーは、既定のシークレットキーからノード間 RPC 認証を導出することを拒否します。

:::

## ファイルからの読み込み（Docker/Kubernetes のシークレット）

シークレットを環境変数へ直接置かず、内容を収めたファイルを RustFS に指定します。

```bash
RUSTFS_ACCESS_KEY_FILE=/run/secrets/rustfs_access_key
RUSTFS_SECRET_KEY_FILE=/run/secrets/rustfs_secret_key
```

同等の CLI フラグ（`--access-key-file`、`--secret-key-file`）もあります。コンテナのエントリポイントが適用する規則は次のとおりです。

- 読み取るのはファイルの**先頭行だけ**です。前後の空白と CR 文字（CRLF で編集されたファイル）は取り除かれます。末尾に改行がないファイルも有効です。
- 同じ認証情報について、直接の変数と `_FILE` 版の両方を設定すると、エラーになります。`Set either RUSTFS_ACCESS_KEY or RUSTFS_ACCESS_KEY_FILE, not both.`
- 空の値、空のファイル、読み取れないファイルは、エラーです（終了コード 1）。
- 既定値 `rustfsadmin` を含むファイルは、直接の変数と同じ警告を出します。

```yaml title="docker-compose example with secrets"
services:
  rustfs:
    image: rustfs/rustfs:latest
    environment:
      - RUSTFS_ACCESS_KEY_FILE=/run/secrets/rustfs_access_key
      - RUSTFS_SECRET_KEY_FILE=/run/secrets/rustfs_secret_key
    secrets:
      - rustfs_access_key
      - rustfs_secret_key
secrets:
  rustfs_access_key:
    file: ./secrets/access_key.txt
  rustfs_secret_key:
    file: ./secrets/secret_key.txt
```

## ルート認証情報のローテーション

クラスターのすべてのノードは、**同じ**ルート認証情報の組で動作する必要があります。`RUSTFS_RPC_SECRET` を明示的に設定していない場合、ノード間 RPC 認証はこの組から導出されます。

:::note

以下の手順は、検証済みの構成要素（環境変数とファイルによる設定、および検証済みのローリングリスタート時の準備完了シグナル）から組み立てた、標準的な運用手順です。RustFS は現時点で、オンラインのルート認証情報ローテーション API を文書化していません。

:::

1. まだ設定していない場合は、ローテーションの**前に**、明示的な `RUSTFS_RPC_SECRET`（全ノードで同じ値）を設定します。これによりノード間認証が認証情報の組から分離され、ローリングリスタートの間、古いルート認証情報と新しいルート認証情報が一時期混在しても、クラスターは動作を続けられます。
2. **すべての**ノードで、環境ファイルまたはシークレットを新しい `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY`（または `_FILE` 版が指すファイル）に更新します。
3. ノードを**1 台ずつ**再起動します。次のノードを再起動する前に、ポート 9000 の `GET /health/ready` が `200` を返すまで待ちます。
4. 古い組を使っていたすべてのクライアント、SDK の設定、自動化を更新します。
5. 確認します。古い認証情報でリクエストに署名し、拒否されることを確認します。

## RUSTFS_RPC_SECRET（ノード間 RPC 認証）

分散クラスターのノードは、共有シークレットで内部の RPC トラフィックを認証します。

- `RUSTFS_RPC_SECRET` が設定されている場合、その値をそのまま使います。**すべてのノードで同じ値**を設定します。
- 未設定の場合、シークレットは有効なアクセスキーとシークレットキーの組から **HMAC で導出**されます。このため、すべてのノードが同じルート認証情報を共有する必要があります。
- シークレットキーが既定の `rustfsadmin` のとき、導出は**フェイルクローズ**します。公開されているシークレットからは、誰でも計算できる RPC シークレットが得られ、ネットワーク上の任意のピアがノード間署名の偽造に使えます。この構成では、`RUSTFS_RPC_SECRET` を設定するか、既定以外の `RUSTFS_SECRET_KEY` を設定するまで、ノード間 RPC は認証できません。

明示的に設定する場面は次のとおりです。

- 既定のルート認証情報で（一時的かどうかにかかわらず）動作するマルチノードのクラスター。
- ルート認証情報をローテーションする前。ロールアウト中もノード間認証を安定させます。
- ノード間認証を、S3 のルート認証情報のライフサイクルから独立させたい環境。

```bash
# Same value on every node
RUSTFS_RPC_SECRET=<your-rpc-secret>
```

## 互換エイリアス

移行時の互換のため、正規の `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` が設定されていない場合、RustFS はレガシー名および MinIO 互換名の認証情報変数を受け付けます。

| 受け付けるエイリアス | 正規の変数 |
| --- | --- |
| `RUSTFS_ROOT_USER`（レガシー） | `RUSTFS_ACCESS_KEY` |
| `RUSTFS_ROOT_PASSWORD`（レガシー） | `RUSTFS_SECRET_KEY` |
| `MINIO_ROOT_USER` | `RUSTFS_ROOT_USER` → `RUSTFS_ACCESS_KEY` |
| `MINIO_ROOT_PASSWORD` | `RUSTFS_ROOT_PASSWORD` → `RUSTFS_SECRET_KEY` |

`MINIO_` 接頭辞の対応は、より広い許可リストの変数（アドレス、Console のアドレス、監査 Webhook の設定など）を対象とし、起動時に「external-prefix compatibility mappings」（外部接頭辞の互換マッピング）として適用されます。

:::note

エイリアスは非推奨です。使用すると、サーバーは `Environment variable MINIO_ROOT_USER is deprecated, use RUSTFS_ROOT_USER instead` の形式で、一度だけ警告をログに記録します。新しいデプロイでは、`RUSTFS_` 接頭辞の正規名を使います。両方を設定した場合は、常に正規名が優先されます。

:::

## ルート認証情報以外

日常のアクセスには、ルートの組を使わないことを推奨します。ポート 9001 の Console（管理画面）、または IAM の管理 API で、権限範囲を限定したユーザー、グループ、ポリシー、サービスアカウントを作成し、ルート認証情報は管理操作のために残します。管理セクションの IAM ドキュメントを参照します。
