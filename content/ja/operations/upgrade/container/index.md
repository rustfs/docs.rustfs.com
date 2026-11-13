---
title: "RustFS コンテナをアップグレードする"
description: "永続データを維持したまま、Docker、Podman、または Docker Compose で起動した RustFS コンテナをアップグレードします。"
---

より新しいイメージから RustFS コンテナを再作成し、コンテナのデプロイをアップグレードします。元のインストール方法に合う手順を選びます。対象は、Docker または Podman で直接起動したコンテナと、Docker Compose で管理するサービスです。

## アップグレードの前に

対象リリースのリリースノートを読み、アップグレードには明示的なイメージタグを使います。現在のイメージを記録し、元の `docker run`、`podman run`、または Compose の設定を残します。コンテナを再作成しても、実行時のオプションは自動ではコピーされません。

置き換える前に、RustFS が正常であることを確認します。

```bash
curl -fsS http://localhost:9000/health/ready
```

:::warning[永続ストレージを維持する]

`/data` にマウントした名前付きボリューム、またはホストディレクトリは削除しません。`docker compose down -v`、`docker volume rm`、`podman volume rm` などのコマンドは永続ストレージを削除します。これらはアップグレード手順には含まれません。

:::

## Docker コンテナをアップグレードする

以下の手順は、[Docker のインストールガイド](/ja/installation/container/docker) で使うコンテナ名と名前付きボリュームに合わせています。ポート、環境変数、マウント、起動引数が異なるデプロイでは、置き換え用のコマンドでもそれらの設定をそのまま維持します。

現在のイメージを記録し、対象バージョンを取得します。

```bash
docker inspect --format '{{.Config.Image}}' rustfs
docker pull rustfs/rustfs:<target-version>
```

停止して削除するのはコンテナだけです。`rustfs-data` ボリュームはそのまま残ります。

```bash
docker stop rustfs
docker rm rustfs
```

元の設定と対象イメージで、コンテナを再作成します。

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
	rustfs/rustfs:<target-version> \
	/data
```

置き換えたコンテナが正常になるまで待ちます。

```bash
docker ps --filter name=rustfs
docker logs rustfs
curl -fsS http://localhost:9000/health/ready
```

## Podman コンテナをアップグレードする

Podman の手順も同じ置き換え操作です。イメージ名は、[Podman のインストールガイド](/ja/installation/container/podman) のものを使います。

```bash
podman inspect --format '{{.Config.Image}}' rustfs
podman pull docker.io/rustfs/rustfs:<target-version>
podman stop rustfs
podman rm rustfs
```

元の設定と永続ボリュームで、コンテナを再作成します。

```bash
podman run -d \
	--name rustfs \
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
	docker.io/rustfs/rustfs:<target-version> \
	/data
```

続行する前に、置き換えたコンテナを確認します。

```bash
podman ps --filter name=rustfs
podman logs rustfs
curl -fsS http://localhost:9000/health/ready
```

## Docker Compose でアップグレードする

デプロイの `docker-compose.yml` があるディレクトリで、Compose のコマンドを実行します。アップグレードの前に、変数を展開した完全な設定を保存し、現在のイメージを確認します。

```bash
docker compose config > docker-compose.resolved.yaml
docker compose images rustfs
```

ボリューム、環境変数、ポート、コマンドは変えず、`rustfs` サービスを明示的な対象イメージタグへ変更します。

```yaml title="docker-compose.yml"
services:
	rustfs:
		image: rustfs/rustfs:<target-version>
```

ファイルを検証し、対象イメージを取得して、RustFS サービスだけを再作成します。`--no-deps` を付けると、オプションのオブザーバビリティサービスは稼働したままです。

```bash
docker compose config --quiet
docker compose pull rustfs
docker compose up -d --no-deps rustfs
```

サービスと RustFS の準備完了エンドポイントを確認します。

```bash
docker compose ps rustfs
docker compose logs --tail=100 rustfs
curl -fsS http://localhost:9000/health/ready
```

`observability` プロファイルと一緒に RustFS を起動している場合でも、RustFS サービスは同じコマンドでアップグレードします。オブザーバビリティのイメージは、コンポーネントごとのリリースノートに従って、個別にアップグレードします。

## マルチノードのデプロイをアップグレードする

RustFS ノードは、一度に 1 つずつ置き換えます。アップグレードしたノードの準備完了エンドポイントが成功することを待ち、クラスターの状態を確認してから、次のノードへ進みます。全ノードを同時に再作成してはいけません。

各ノードで同じ Docker、Podman、または Compose の手順を使い、そのノードの既存のマウントと設定は維持します。

## ロールバック

Docker または Podman では、失敗した置き換えコンテナを停止して削除し、以前に記録したイメージタグで、対応する `run` コマンドを再実行します。永続ボリュームと実行時の設定は、同じものを維持します。

Docker Compose では、`docker-compose.yml` の `image` を以前の値に戻し、RustFS サービスを再作成します。

```bash
docker compose pull rustfs
docker compose up -d --no-deps rustfs
curl -fsS http://localhost:9000/health/ready
```

マルチノードのデプロイでは、一度に 1 ノードずつロールバックし、準備完了を待ってから続行します。

## 次のステップ

アップグレード後の追加の検証は、[状態の確認](/ja/operations/status-check) を参照します。
