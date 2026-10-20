---
title: "Docker"
description: "Docker で RustFS を実行するときの、シングルノード構成、ホストディレクトリの権限、Docker Compose、TLS、マルチノードデプロイを説明します。"
---

このページでは、公式の RustFS イメージを Docker で実行する方法を説明します。永続ストレージを使ったシングルノードのインスタンス、root 以外のコンテナユーザー向けホストディレクトリの権限、任意のオブザーバビリティサービスを含む Docker Compose、TLS、マルチノードデプロイを扱います。動作する Docker Engine と、コンテナを実行する権限が必要です。

## 1. 前提条件

* Docker Engine（20.10 以上）がインストールされ、イメージの取得とコンテナの実行ができること
* ホストのポート 9000（S3 API）と 9001（Console）が空いていること。使う予定のカスタムポートでも構いません
* ホストディレクトリをバインドマウントする場合、ディレクトリの所有者はコンテナユーザーと一致している必要があります。[ホストディレクトリをバインドマウントする](#bind-mount-a-host-directory)を参照してください

## 2. イメージを取得する

```bash
docker pull rustfs/rustfs:latest
```

## 3. 永続ストレージを作成する

コンテナを置き換えてもオブジェクトデータが残るよう、名前付きボリュームを作成します。

```bash
docker volume create rustfs-data
```

## 4. RustFS を起動する

コンテナを実行する前に、認証情報のプレースホルダーを置き換えます。

```bash
docker run -d \
  --name rustfs \
  --restart unless-stopped \
  -p 9000:9000 \
  -p 9001:9001 \
  -v rustfs-data:/data \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  -e RUSTFS_ADDRESS=":9000" \
  -e RUSTFS_CONSOLE_ADDRESS=":9001" \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_OBS_LOGGER_LEVEL=error \
  -e RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/" \
  rustfs/rustfs:latest \
  /data
```

:::warning[コンテナ作成時に認証情報を設定する]

ネットワークへ公開する前に、一意の `RUSTFS_ACCESS_KEY` と `RUSTFS_SECRET_KEY` を環境変数で設定します。どちらの認証情報にも、広く知られている `rustfsadmin` は使わないでください。カスタムの認証情報なしでコンテナを起動した場合は、停止し、上記の両方の `-e` オプションを付けて再作成します。`rustfs-data` ボリュームはそのまま残ります。

:::

### 環境変数またはコマンドラインフラグ

上の例では、環境変数で RustFS を設定しています。同じ設定は、コマンドラインフラグでも渡せます。両方が指定されている場合は、コマンドラインフラグが優先されます。

```bash
docker run -d \
  --name rustfs \
  -p 9000:9000 \
  -p 9001:9001 \
  -v rustfs-data:/data \
  rustfs/rustfs:latest \
  --access-key "<your-access-key>" \
  --secret-key "<your-secret-key>" \
  --address :9000 \
  --console-enable \
  /data
```

## 5. ホストディレクトリをバインドマウントする [#bind-mount-a-host-directory]

上の名前付きボリュームには、追加の準備は不要です。ホストディレクトリをマウントする場合（`-v /path/on/host:/data`）、コンテナは id が `10001` の root 以外のユーザー `rustfs` として動作します。ホストディレクトリの所有者を `10001` にします。そうしないと、permission denied（権限拒否）エラーが発生します。

```bash
chown -R 10001:10001 /path/to/host_directory
```

## 6. デプロイを確認する

コンテナと、S3 API のヘルスチェックエンドポイントを確認します。

```bash
docker ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

S3 API は `http://localhost:9000` で、Console は `http://localhost:9001` で利用できます。

## Docker Compose

RustFS のリポジトリには、主にオブザーバビリティ向けの `grafana`、`prometheus`、`otel-collector`、`jaeger` サービスを含む [`docker-compose.yml`](https://github.com/rustfs/rustfs/blob/main/docker-compose.yml) があります。これらのサービスと一緒に RustFS をデプロイするには、[RustFS のコードリポジトリ](https://github.com/rustfs/rustfs) をローカルにクローンします。

```bash
git clone https://github.com/rustfs/rustfs.git
```

リポジトリのルートで、次のコマンドを実行します。

```bash
docker compose --profile observability up -d
```

compose ファイルは、初期化コンテナで `rustfs` に正しいアクセス権を付与します。次の `rustfs_perms` サービスは、`rustfs` の起動前に、マウントしたボリュームの所有者を `10001` へ変更します。`depends_on` により、この処理の完了を待ってから起動します。ログを永続化し、あとから参照できるように、ホストのログディレクトリをコンテナ内の `/var/log/rustfs/` にマッピングします。

```yaml title="docker-compose.yml"
  services:
    # grant the necessary permissions to RUSTFS volumes path
    rustfs_perms:
      image: alpine
      user: root
      volumes:
        - /path/to/host_directory/volumes:/fix_path
      command: chown -R 10001:10001 /fix_path

    rustfs:
      image: rustfs/rustfs:latest
      depends_on:
        rustfs_perms:
          condition: service_completed_successfully
      volumes:
        - /path/to_host_directory/volumes/data:/data
        - /path/to_host_directory/volumes/logs:/var/log/rustfs/
      environment:
        - RUSTFS_ADDRESS=":9000"
        - RUSTFS_CONSOLE_ADDRESS=":9001"
        - RUSTFS_CONSOLE_ENABLE=true
        - RUSTFS_OBS_LOGGER_LEVEL=error
        - RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"

      # ... other configurations
```

Grafana、Prometheus、その他のオブザーバビリティサービスなしで RustFS だけを起動する場合は、`rustfs` サービスだけを起動します。compose ファイルでは、コレクターへの依存関係は任意です。

```bash
docker compose -f docker-compose.yml up -d rustfs
```

これにより、`rustfs-server` コンテナだけが起動します。`rustfs-server` だけを起動する場合も、フルスタックを起動する場合も、S3 API は `http://localhost:9000` で、RustFS Console は `http://localhost:9001` で提供されます。ブラウザで Console を開き、上で設定したアクセスキーとシークレットキーでログインします。強力なシークレットは、たとえば `openssl rand -base64 24` で生成します。プレースホルダーの値を本番環境へデプロイしないでください。

Docker Compose では、`rustfs` サービスの環境設定、または変数置換に使う環境ファイルに、一意の `RUSTFS_ACCESS_KEY` と `RUSTFS_SECRET_KEY` を定義します。その後、`docker compose up -d rustfs` でサービスを再作成します。

## マルチノードデプロイ

Docker のデフォルトの bridge ネットワークは、マルチノードデプロイに対応していません。各コンテナがほかのノードと直接通信できるよう、`--network host` を使います。

**各ノード**で次を実行します。

```bash
docker run -d \
  --name rustfs \
  --network host \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  -e RUSTFS_ADDRESS=":9000" \
  -e RUSTFS_CONSOLE_ADDRESS=":9001" \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_OBS_LOGGER_LEVEL=error \
  -e RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/" \
  -e RUSTFS_VOLUMES="http://node{1...4}:9000/data/rustfs{0...3}" \
  rustfs/rustfs:latest
```

**すべての**ノードの `/etc/hosts` に、次のエントリを追加します。

```ini title="/etc/hosts"
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```

## TLS の設定

[TLS を使う](../../integration/tls-configured.md)場合は、証明書ディレクトリをマウントし、そのパスを RustFS に指定します。

```bash
-v /path/to/certs:/certs \
-e RUSTFS_TLS_PATH=/certs \
```

## 本番環境の前に

本番へデプロイする前に、[インストール前チェックリスト](../requirement/checklists/index.md)（ハードウェア、ネットワーク、ソフトウェア、セキュリティ）を確認します。マルチノードデプロイを使い、[TLS を有効にし](../../integration/tls-configured.md)、ログローテーションを設定し、定期的なバックアップを計画します。

## 次のステップ

- [RustFS Console](/ja/administration/console)
- [S3 クライアントを設定する](../../developer/examples/aws-cli.md)
- [TLS の設定](../../integration/tls-configured.md)
