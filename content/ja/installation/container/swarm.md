---
title: "Docker Swarm"
description: "swarmcli の rustfs Chart を使い、認証情報を Docker シークレットとして保持した単一ノードの RustFS サービスを Docker Swarm 上で実行します。"
---

このページでは、RustFS を Docker Swarm サービスとしてデプロイします。ルート認証情報は環境変数ではなく Docker シークレットとして渡します。RustFS は `RUSTFS_ACCESS_KEY_FILE` と `RUSTFS_SECRET_KEY_FILE` を通じて認証情報をファイルから読み込むため、どちらの値もサービス定義や `docker inspect` の出力には現れません。デプロイには、コミュニティリポジトリ swarmcli-charts の [`rustfs` Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) を使用し、[swarmcli](https://github.com/Eldara-Tech/swarmcli) でインストールします。どちらも RustFS プロジェクトではなく Eldara Tech がメンテナンスしています。

この Chart は、1 つのノード上で 1 台のドライブを使う RustFS サービスを 1 つ実行します（シングルノード・シングルディスク、SNSD）。単一ドライブにはイレイジャーコーディングによる冗長性がないため、小規模な Swarm でのビルドキャッシュ、バックアップ先、アプリケーションの Blob ストアに適しています。複数ノードにまたがる RustFS デプロイは実行しません。

## 1. 前提条件

* Docker Swarm（`docker swarm init`）と、マネージャーノード上のシェル
* swarmcli 1.11.0 以降（[swarmcli のインストールガイド](https://github.com/Eldara-Tech/swarmcli/blob/main/docs/installation.md)を参照）
* Swarm ノード上でポート 9000（S3 API）が空いていること。手順 5 でこのポートを Swarm のルーティングメッシュに公開します

## 2. 認証情報を Docker シークレットとして作成する

認証情報のプレースホルダーを置き換え、キーごとにシークレットを 1 つ作成します。

```bash
printf '%s' '<your-access-key>' | docker secret create rustfs-access-key -
printf '%s' '<your-secret-key>' | docker secret create rustfs-secret-key -
```

各値は 1 行に収め、内部に空白文字を含めないでください。強力なシークレットアクセスキーは、たとえば `openssl rand -base64 30` で生成できます。

:::warning[弱い認証情報ではサービスが起動しません]

いずれかのシークレットが存在しない、空である、空白文字を含む、またはよく知られた値 `rustfsadmin` である場合、Chart のコンテナは起動時に終了します。Docker シークレットは編集できません。認証情報をローテーションするには、新しい名前でシークレットを作成し、Chart の `s3.accessKeySecret` と `s3.secretKeySecret` の値をそれらに向けてから、リリースをアップグレードします。

:::

## 3. データノードにラベルを付ける

名前付きボリュームは 1 つのノード上にしか存在しないため、サービスは `rustfs-data=true` ラベルを持つノードに固定されます。ラベルは必ず 1 つのノードにだけ付けます。

```bash
docker node update --label-add rustfs-data=true <node-hostname>
```

単一ノードの Swarm では、ラベル付けを省略し、代わりに手順 5 のインストールコマンドに `--set persistence.nodeLabel=""` を追加できます。

## 4. Chart リポジトリを追加する

`swarmcli charts repo list` にすでに `swarmcli-charts` が表示される場合、この手順は不要です。

```bash
swarmcli charts repo add swarmcli-charts https://eldara-tech.github.io/swarmcli-charts
```

## 5. RustFS をインストールする

Chart を `rustfs` という名前のリリースとしてインストールし、S3 API をポート 9000 で公開して、起動時にバケットを 1 つ作成します。

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket}'
```

サービスはデータを名前付きボリューム `rustfs-data` の `/data` 配下に保存します。Docker はこのボリュームにリリース名を付けて `rustfs_rustfs-data` と命名します。`buckets` に指定した各バケットはサーバーが応答した時点で作成され、既存のバケットはそのまま残るため、再起動やアップグレードを行っても問題ありません。

## 6. デプロイを確認する

リリース、サービスのタスク、S3 API のヘルスチェックエンドポイントを確認します。

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs
curl --fail http://localhost:9000/health
```

S3 API は、すべての Swarm ノードで `http://localhost:9000` から利用できます。クライアントはパス形式のアドレス指定とリージョン `us-east-1` を使用します。

## 公開モード

Chart は S3 API と Console を個別に公開します。Console はデフォルトで無効になっており、`console.enabled=true` で有効にできます。S3 API のモードは `exposure.mode`、Console のモードは `console.exposure.mode` で指定します。

| モード | アクセス元 |
| - | - |
| `none`（デフォルト） | `rustfs-net` オーバーレイネットワークに接続されたサービスのみ。アドレスは `http://<release>-rustfs:9000` |
| `published` | Swarm のルーティングメッシュに公開されたポート。S3 API は `publish.port`、Console は `console.publish.port`（9001） |
| `traefik` | Traefik がルーティングするホスト名。S3 API は `ingress.host`、Console は `console.ingress.host` |

たとえば、Console もポート 9001 で公開するには次のようにします。

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set console.enabled=true \
  --set console.exposure.mode=published \
  --set 'buckets={my-bucket}'
```

:::note[Console のポートでも S3 API が提供されます]

Console のリスナーは、署名付きの S3 API と管理 API もすべて提供します。そのため、Console だけを公開した場合でも、これらの API はパブリックなアドレスから到達可能になります。Console を使用しない場合は無効のままにしてください。

:::

## 主な設定値

| 値 | 用途 | Chart のデフォルト |
| - | - | - |
| `image.tag` | RustFS イメージのタグ | `""`（Chart が固定している RustFS のバージョン） |
| `s3.accessKeySecret` / `s3.secretKeySecret` | ルート認証情報を保持する Docker シークレット | `rustfs-access-key` / `rustfs-secret-key` |
| `buckets` | 起動時に存在しなければ作成するバケット | `[]` |
| `exposure.mode` | S3 API の公開方法：`none`、`published`、`traefik` | `none` |
| `publish.port` | S3 API の公開ポート | `9000` |
| `console.enabled` | Console のリスナーを実行する | `false` |
| `console.exposure.mode` | Console の公開方法：`none`、`published`、`traefik` | `none` |
| `persistence.nodeLabel` | サービスを固定するノードラベル。`""` で固定しない | `rustfs-data` |
| `persistence.volumePath` | 名前付きボリュームの代わりに `/data` へバインドマウントするホストディレクトリ。所有者は `10001` である必要があります | `""` |
| `extraEnv` | 追加の `RUSTFS_*` 環境変数（`RUSTFS_SERVER_DOMAINS` など） | `{}` |

すべての設定値は [Chart の README](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) に記載されています。Traefik によるルーティング、OpenID Connect を使った Console のシングルサインオン、ホストディレクトリのバインドマウントについてもこちらを参照してください。

## アンインストール

```bash
swarmcli charts uninstall rustfs
```

アンインストールすると、サービスとリリース履歴が削除されます。データボリューム、2 つの Docker シークレット、`rustfs-net` ネットワークは残ります。swarmcli はこのネットワークを、削除するためのコマンドとともに表示します。

:::note[データボリュームはアンインストール後も残ります]

同じリリース名で再度インストールすると、ボリュームとそのデータが再びマウントされます。データを破棄するには、ラベルを付けたノード上でボリュームを削除します。シークレットが不要であれば、あわせて削除します。

```bash
docker volume rm rustfs_rustfs-data
docker secret rm rustfs-access-key rustfs-secret-key
```

:::

## 次のステップ

- [RustFS Console](/administration/console)
- [S3 クライアントを設定する](../../developer/examples/aws-cli.md)
- [インストール前チェックリスト](../requirement/checklists/index.md)
