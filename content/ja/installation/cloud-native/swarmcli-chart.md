---
title: "SwarmCLI チャート"
description: "SwarmCLI の rustfs チャートを使い、RustFS を単一ノードのサービスまたはイレイジャーコーディングを用いた分散クラスターとして Docker Swarm 上にデプロイします。認証情報は Docker シークレットに保持し、バージョン管理されたアップグレードとロールバック、必要に応じて Traefik 経由の HTTPS を利用できます。"
---

[SwarmCLI](https://github.com/Eldara-Tech/swarmcli) は、Helm に着想を得た Docker Swarm 向けのパッケージマネージャー兼ターミナル UI です。SwarmCLI のオープンソースの [`rustfs` チャート](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs)は、RustFS を Docker Swarm 上にデプロイします。どちらも RustFS プロジェクトではなく Eldara Tech がメンテナンスしています。

手書きのスタックファイルと比べて、このチャートには次の機能が加わります。

- **Docker シークレットによる認証情報**：RustFS は `RUSTFS_ACCESS_KEY_FILE` と `RUSTFS_SECRET_KEY_FILE` を通じてルートキーをファイルから読み込むため、どちらの値もサービス定義や `docker inspect` の出力には現れません。デフォルトの `rustfsadmin` キーは拒否されます。
- **バージョン管理されたリリース**：アップグレードのプレビューと適用、以前のリビジョンへのロールバックができます。SwarmCLI はリビジョン履歴を Swarm 自体に保存するため、追加のデータベースは不要です。
- **Traefik 経由の HTTPS**：連携用の [`traefik` チャート](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik)を併用すると、S3 API と Console にそれぞれ専用のホスト名と Let's Encrypt の証明書が割り当てられ、Console では OpenID Connect によるシングルサインオンも利用できます。
- **ヘルスチェック付きのロールアウト**：設定値に列挙したバケットは起動時に作成されます。また、スタンドアロンモードのリリースでは、すべてのロールアウトが RustFS の `/health/ready` エンドポイントで監視されるため、`--wait` は問題のあるアップグレードを成功ではなく失敗として報告します。
- **クラスターのローリングアップグレード**：分散モードでは、アップグレードはピアを 1 つずつ順に更新します。デフォルトの 4 つのピアがすべて実行中であれば、クラスターはアップグレードの間ずっと、ピアが 1 つ欠けた状態で読み取りと書き込みを処理し続けます。

このチャートは 2 つのモードのいずれかで動作し、モードはインストール時に選択します。デフォルトのスタンドアロンモードでは、1 つのノード上で 1 台のドライブを使う RustFS サービスを 1 つ実行します（シングルノード・シングルディスク、SNSD）。単一ドライブにはイレイジャーコーディングによる冗長性がないため、小規模な Swarm でのビルドキャッシュ、バックアップ先、アプリケーションの Blob ストアに適しています。分散モードは、ノードを 1 つ失っても失われてはならないデータ向けのモードで、ノードごとに 1 つずつ配置した 4 つ以上のピアにわたってオブジェクトをイレイジャーコーディングします。手順 4 ではスタンドアロンモードを、手順 5 では分散モードをインストールします。その他の手順は両方のモードに共通です。

## 1. 前提条件

* Docker Swarm（`docker swarm init`）と、マネージャーノード上のシェル
* SwarmCLI 2.2.0 以降（[SwarmCLI のインストールガイド](https://github.com/Eldara-Tech/swarmcli/blob/main/docs/installation.md)を参照）
* スタンドアロンモードでは、Swarm ノード上でポート 9000（S3 API）が空いていること。手順 4 でこのポートを Swarm のルーティングメッシュに公開します
* 分散モードでは、ピアごとに 1 つ、最低 4 つのノード（開発用途であれば単一ノードで十分です。手順 5 を参照）

## 2. 認証情報を Docker シークレットとして作成する

認証情報のプレースホルダーを置き換え、キーごとにシークレットを 1 つ作成します。

```bash
printf '%s' '<your-access-key>' | docker secret create rustfs-access-key -
printf '%s' '<your-secret-key>' | docker secret create rustfs-secret-key -
```

各値は 1 行に収め、内部に空白文字を含めないでください。強力なシークレットアクセスキーは、たとえば `openssl rand -base64 30` で生成できます。分散モードでは、すべてのピアが同じ 2 つのシークレットを読み込みます。

:::warning[弱い認証情報ではサービスが起動しません]

いずれかのシークレットが存在しない場合、SwarmCLI はチャートのインストールを拒否します。また、キーが空である、空白文字を含む、またはよく知られた値 `rustfsadmin` である場合、コンテナは起動時に終了します。Docker シークレットは編集できません。認証情報をローテーションするには、新しい名前でシークレットを作成し、`s3.accessKeySecret` と `s3.secretKeySecret` をそれらに向けてリリースをアップグレードします。分散モードでのローテーションには、「アップグレードとロールバック」で説明するとおり、完全停止が必要です。

:::

## 3. チャートリポジトリを追加する

`swarmcli charts repo list` にすでに `swarmcli-charts` が表示される場合、この手順は不要です。

```bash
swarmcli charts repo add swarmcli-charts https://eldara-tech.github.io/swarmcli-charts
```

## 4. スタンドアロンモードをインストールする

この手順と手順 5 のどちらか一方だけを実施します。名前付きボリュームは 1 つのノード上にしか存在しないため、サービスは `rustfs-data=true` ラベルを持つノードに固定されます。ラベルは必ず 1 つのノードにだけ付けます。

```bash
docker node update --label-add rustfs-data=true <node-hostname>
```

単一ノードの Swarm では、ラベル付けを省略し、代わりに次のインストールコマンドに `--set persistence.nodeLabel=""` を追加できます。

チャートを `rustfs` という名前のリリースとしてインストールし、S3 API をポート 9000 で公開して、起動時にバケットを 1 つ作成します。

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket}'
```

サービスはデータを名前付きボリューム `rustfs-data` の `/data` 配下に保存します。Docker はこのボリュームにリリース名を付けて `rustfs_rustfs-data` と命名します。`buckets` に指定した各バケットはサーバーが応答した時点で作成され、既存のバケットはそのまま残るため、再起動やアップグレードを行っても問題ありません。

## 5. 分散モードをインストールする

手順 4 の代わりにこの手順を実施します。分散モードでは、各ピアがそれぞれ独立した Swarm サービス（`rustfs` という名前のリリースでは `rustfs_rustfs-1` から `rustfs_rustfs-4` まで）となり、1 つのレプリカ、専用のボリューム、専用のノードラベルを持ちます。ピアごとに 1 つのノードにラベルを付けます。

```bash
docker node update --label-add rustfs-1=true <node-a>
docker node update --label-add rustfs-2=true <node-b>
docker node update --label-add rustfs-3=true <node-c>
docker node update --label-add rustfs-4=true <node-d>
```

各ピアは別々のノードに配置します。同じノード上のピアは、そのノードの障害の影響をまとめて受けます。デフォルトの 4 つのピアでは、2 つのピアを配置したノードを 1 つ失うと書き込みが停止します。単一ノードの Swarm では、その 1 つのノードに 4 つのラベルをすべて付けます。この構成では可用性がまったく得られないため、開発用途にのみ適しています。

モードとクラスター構成を明示的に指定します。ドライブの総数は `cluster.peers * cluster.drivesPerPeer` です。

:::warning[トポロジーはインストール前に決定してください]

`cluster.peers` と `cluster.drivesPerPeer` はインストール時に固定されます。RustFS はドライブ数とイレイジャーセットの幅をすべてのドライブに記録し、それ以外の値では起動を拒否します。`mode` もインストール時に選択します。既存のリリースでモードを変更してもデータは変換されません。新しいモードのサービスは空のドライブで起動し、古いモードのサービスもそれと並行して実行され続け、クライアントのリクエストは両方に届きます。スタンドアロンモードのストアをクラスターに移行するには、クラスターを 2 つ目のリリースとしてインストールし、S3 経由でバケットをコピーします。

:::

```yaml title="distributed-values.yaml"
mode: distributed

cluster:
  peers: 4
  drivesPerPeer: 1

buckets:
  - my-bucket
```

この例では、それぞれ 1 台のドライブを持つ 4 つのピアを作成します。各オブジェクトは 2 つのデータシャードと 2 つのパリティシャードに分割されます。そのため、読み取りはピアが 2 つ停止しても、書き込みは 1 つ停止しても継続でき、利用可能な容量はドライブの合計容量の半分になります。ピアごとに 2 台以上のドライブを使うには `persistence.volumePaths` が必要で、ドライブごとに、それぞれ専用のディスク上にホストディレクトリを 1 つ用意します。詳しくはチャートの README に記載されています。設定値ファイルを指定してチャートをインストールします。

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

すべてのピアは同時に起動します。`--wait` は、各ピアのタスクが実行中になり、2 分間の監視期間を過ぎても動作し続けた時点で完了します。ピア 1 は、クラスターが書き込みを受け付けるようになった時点でバケットを作成します。起動から 5 分以内に作成できなかった場合は、作成できなかったバケットをログに記録し（`docker service logs rustfs_rustfs-1` で確認できます）、そのままリクエストの処理を続けます。ピアのヘルスチェックが示すのはそのピアが生存していることだけなので、`--wait` ではクラスターがリクエストを処理できるかどうかはわかりません。これは手順 6 で確認します。

## 6. デプロイを確認する

スタンドアロンモードでは、リリース、サービスのタスク、S3 API の Readiness エンドポイントを確認します。

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs
curl --fail http://localhost:9000/health/ready
```

S3 API は、すべての Swarm ノードで `http://localhost:9000` から利用できます。クライアントはパススタイルアクセスとリージョン `us-east-1` を使用します。タスクが `no suitable node` で保留中のままの場合は、手順 4 の `rustfs-data=true` ラベルが付いたノードがありません。

分散モードでは、リリースと各ピアのタスクを確認したうえで、`rustfs-net` オーバーレイネットワーク上のコンテナから、クラスターがリクエストを処理できるかどうかを問い合わせます。

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs-1 rustfs_rustfs-2 rustfs_rustfs-3 rustfs_rustfs-4
docker run --rm --network rustfs-net curlimages/curl -s -o /dev/null -w '%{http_code}\n' \
  http://rustfs-rustfs:9000/minio/health/cluster
```

`200` は、すべてのイレイジャーセットが書き込みクォーラムを満たしていることを意味します。ピアのタスクが `no suitable node` で保留中のままの場合は、そのピアに対応する手順 5 の `rustfs-<n>=true` ラベルが付いたノードがありません。ラベルを付けるとピアが起動します。その後、作成できなかったバケットがピア 1 のログに記録された場合は、ピア 1 を再起動してバケットを再度作成します（`docker service update --force rustfs_rustfs-1`）。

`rustfs-net` に参加したサービスは、パススタイルアクセスとリージョン `us-east-1` を使い、`http://rustfs-rustfs:9000` でクラスターにアクセスします。どのピアもすべてのオブジェクトを提供でき、この名前はヘルスチェックに合格したすべてのピアに解決されます。このヘルスチェックが示すのはピアが生存していることだけなので、初回インストール時や、すべてのピアが停止した後は、クラスターがリクエストを処理できるようになるまで、ピアが 503 を返すことがあります。停止するピアで処理中のリクエストも失敗します。クライアントは再試行する必要があります（S3 クライアントはデフォルトで再試行します）。Swarm の外部からクラスターにアクセスするには、「公開モード」で説明するとおりにクラスターを公開します。

## アップグレードとロールバック

インストール、アップグレード、ロールバックを行うたびに、リリースの番号付きリビジョンが作成されます。アップグレードはチャートのデフォルト値から開始されるため、すべての値を再度指定するか（手順 4 で `--set persistence.nodeLabel=""` を使用した場合はそれも含めます）、値をファイルにまとめて `-f` で渡します。手順 4 のスタンドアロンモードのリリースでは、次のように変更をプレビューして適用し、リビジョンを一覧表示します。

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts upgrade rustfs swarmcli-charts/rustfs --wait \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts history rustfs
```

以前のリビジョンに戻すには、次のようにします。

```bash
swarmcli charts rollback rustfs 1
```

ロールバックではそのリビジョンのサービス定義が再デプロイされますが、データは復元されません。

分散モードでは、すべてのアップグレードで `--reuse-values` ではなくインストール時に使用した設定値ファイルを渡し、公開設定などの以降の変更もそのファイルに記述します。設定値に `mode: distributed` が含まれていないアップグレードでは、ピアはそのまま残り、それと並行してスタンドアロンモードのサービスが起動します。

SwarmCLI はピアを 1 つずつ更新します。ピアを停止して新しいタスクを起動し、そのタスクが実行中になって監視期間を過ぎても動作し続けた時点で、初めて次のピアに進みます。デフォルトの 4 つのピアがすべて実行中であれば、クラスターはアップグレードの間ずっと、ピアが 1 つ欠けた状態で読み取りと書き込みを処理し続けます。一方、すでに 1 つのピアが停止している場合は、アップグレードが別のピアを停止するたびに、クラスターは書き込みを受け付けなくなります。そのため、まず手順 6 のコマンドで、すべてのピアのタスクが実行中であることと、クラスターが `200` を返すことを確認します。`200` だけでは、すべてのピアが実行中であることはわかりません。そのうえでアップグレードをプレビューして適用し、適用後にもう一度クラスターを確認します。

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml
swarmcli charts upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

ロールバックも同じ方法でピアを 1 つずつ更新します。ピアの起動に失敗したアップグレードはその時点で停止し、残りのピアは更新されません。

:::warning[クラスターの認証情報のローテーションには完全停止が必要です]

各ピアはノード間シークレットをキーペアから導出します。そのため、古いキーペアを使うピアと新しいキーペアを使うピアは互いに通信できず、ピアを 1 つずつ更新するアップグレードではクラスターが分断されてしまいます。新しいシークレットを作成します。

```bash
printf '%s' '<your-new-access-key>' | docker secret create rustfs-access-key-2 -
printf '%s' '<your-new-secret-key>' | docker secret create rustfs-secret-key-2 -
```

以降のアップグレードでも使われ続けるように、2 つのシークレット名を `distributed-values.yaml` に追加します。手順 5 の設定値を使っている場合、ファイルは次のようになります。

```yaml title="distributed-values.yaml"
mode: distributed

cluster:
  peers: 4
  drivesPerPeer: 1

s3:
  accessKeySecret: rustfs-access-key-2
  secretKeySecret: rustfs-secret-key-2

buckets:
  - my-bucket
```

次に、すべてのピアが新しいキーペアで同時に起動するように、すべてのピアを停止してからアップグレードします。

```bash
for n in 1 2 3 4; do docker service scale "rustfs_rustfs-$n=0"; done
swarmcli charts upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

データとバケットはそのまま保持されますが、クライアントには新しいキーペアが必要です。ローテーション前のリビジョンにはロールバックしないでください。ロールバックするとピアが 1 つずつ古いキーペアに戻され、同じようにクラスターが分断されます。

:::

## 公開モード

チャートは S3 API と Console を個別に公開します。Console はデフォルトで無効になっており、`console.enabled=true` で有効にできます。S3 API のモードは `exposure.mode`、Console のモードは `console.exposure.mode` で指定します。

| モード | アクセス元 |
| - | - |
| `none`（デフォルト） | `rustfs-net` オーバーレイネットワークに接続されたサービス。アドレスは `http://<release>-rustfs:9000`（Console は有効化した場合ポート 9001）。もう一方のリスナーが `traefik` を使用している間は、`traefik-public` 上のサービスからも到達可能 |
| `published` | 公開されたポート。S3 API は `publish.port`、Console は `console.publish.port`（9001）。公開先は Swarm のルーティングメッシュ（分散モードでは各ピア自身のノード） |
| `traefik` | Traefik が HTTPS でルーティングするホスト名。S3 API は `ingress.host`、Console は `console.ingress.host` |

`traefik` モードを使うには、先に [`traefik` チャート](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik)をインストールしておく必要があります。このチャートは、RustFS が参加する `traefik-public` ネットワークを作成し、Let's Encrypt の証明書を取得します。そのうえで、スタンドアロンモードのリリースの S3 API を専用のホスト名で公開します。

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=traefik \
  --set ingress.host=s3.example.com \
  --set 'buckets={my-bucket}'
```

Traefik を使わずに、スタンドアロンモードのリリースで S3 API とあわせて Console もポート 9001 で公開するには、次のようにします。

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

分散モードでは、すべてのピアに同じ公開設定が適用されます。設定は `distributed-values.yaml` に記述し、「アップグレードとロールバック」で説明するとおりにアップグレードします。`traefik` モードでは、Traefik がリクエストを正常なすべてのピアに分散します。`published` モードには `publish.mode=host`（Console には `console.publish.mode=host` も）が必要です。この設定ではポートがルーティングメッシュではなく各ピア自身のノードで公開されるため、あるノードのポートからは、そのノード上のピアにしか到達できません。ノードの前段にロードバランサーを置くか、Traefik を使用します。ホストモードでの公開には各ピアが専用のノードに配置されている必要があるため、単一ノードの Swarm では使用できません。

## 主な設定値

| 値 | 用途 | チャートのデフォルト |
| - | - | - |
| `image.tag` | RustFS イメージのタグ | `""`（チャートが固定している RustFS のバージョン） |
| `mode` | `standalone` または `distributed`。インストール時に選択 | `standalone` |
| `cluster.peers` | 分散モードのピア数。ピアごとにサービスとノードラベルを 1 つずつ使用。4 以上 | `4` |
| `cluster.drivesPerPeer` | 分散モードのピアあたりのドライブ数。2 台以上には `persistence.volumePaths` が必要 | `1` |
| `s3.accessKeySecret` / `s3.secretKeySecret` | ルート認証情報を保持する Docker シークレット | `rustfs-access-key` / `rustfs-secret-key` |
| `buckets` | 起動時に存在しなければ作成するバケット | `[]` |
| `exposure.mode` | S3 API の公開方法：`none`、`published`、`traefik` | `none` |
| `publish.port` | S3 API の公開ポート | `9000` |
| `ingress.host` | Traefik が S3 API にルーティングするホスト名 | `s3.example.com` |
| `console.enabled` | Console のリスナーを実行する | `false` |
| `console.exposure.mode` | Console の公開方法：`none`、`published`、`traefik` | `none` |
| `persistence.nodeLabel` | スタンドアロンモードのサービスを固定するノードラベル。`""` で固定しない | `rustfs-data` |
| `persistence.nodeLabelPrefix` | 分散モードのピア `<n>` を `<prefix>-<n>` に固定するノードラベルの接頭辞。`""` で固定しない（単一ノードの Swarm のみ） | `rustfs` |
| `persistence.volumePath` | スタンドアロンモードで、名前付きボリュームの代わりに `/data` へバインドマウントするホストディレクトリ。所有者は `10001` である必要があります | `""` |
| `extraEnv` | 追加の `RUSTFS_*` 環境変数（`RUSTFS_SERVER_DOMAINS` など） | `{}` |

すべての設定値は[チャートの README](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) に記載されています。Traefik によるルーティング、OpenID Connect を使った Console のシングルサインオン、両方のモードにおけるホストディレクトリのバインドマウントについてもこちらを参照してください。

## アンインストール

```bash
swarmcli charts uninstall rustfs
```

アンインストールすると、サービス（分散モードではすべてのピアのサービス）とリリース履歴が削除されます。データボリューム（分散モードではピアごとに 1 つ）、2 つの Docker シークレット、`rustfs-net` ネットワークは残ります。SwarmCLI はこのネットワークを、削除するためのコマンドとともに表示します。

:::note[データボリュームはアンインストール後も残ります]

スタンドアロンモードでは、同じリリース名で再度インストールすると、ボリュームとそのデータが再びマウントされます。データを破棄するには、タスクが停止するのを待ってから（最大 30 秒）、ラベルを付けたノード上でボリュームを削除します。

```bash
docker volume rm rustfs_rustfs-data
```

分散モードでは、各ピアが専用のボリューム `rustfs_rustfs-data-<n>` を、`rustfs-<n>=true` ラベルを付けたノード上に保持します。そのピアのタスクが停止したら、そのノード上でボリュームを削除します。同じリリース名で再度インストールするとこれらのボリュームが再利用されるため、`cluster.peers` と `cluster.drivesPerPeer` は同じ値のままにする必要があります。

どちらのモードでも、シークレットが不要であれば削除します。対象は、リリースが使用しているシークレットのペアと、ローテーションで置き換えられたすべてのペアです。手順 2 の名前を使った場合は次のとおりです。

```bash
docker secret rm rustfs-access-key rustfs-secret-key
```

:::

## 次のステップ

- [RustFS Console](/administration/console)
- [S3 クライアントを設定する](../../developer/examples/aws-cli.md)
- [インストール前チェックリスト](../requirement/checklists/index.md)
