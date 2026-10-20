---
title: "Podman"
description: "Podman と永続的なコンテナストレージを使い、シングルノードの RustFS インスタンスを実行します。"
---

Podman は、デーモンなしで公式の RustFS Open Container Initiative（OCI）イメージを実行できます。動作する Podman のインストールと、コンテナを作成する権限が必要です。

## 1. イメージを取得する

```bash
podman pull docker.io/rustfs/rustfs:latest
```

## 2. 永続ストレージを作成する

コンテナを置き換えてもオブジェクトデータが残るよう、名前付きボリュームを作成します。

```bash
podman volume create rustfs-data
```

:::note[ホストディレクトリのバインドマウント]

上の名前付きボリュームには、追加の準備は不要です。ホストディレクトリをバインドマウントする場合、コンテナは id が `10001` の root 以外のユーザー `rustfs` として動作します。ホストディレクトリの所有者を `10001` にします。そうしないと、permission denied（権限拒否）エラーが発生します。

```bash
chown -R 10001:10001 /path/to/host_directory
```

:::

## 3. RustFS を起動する

コンテナを実行する前に、認証情報のプレースホルダーを置き換えます。

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
  docker.io/rustfs/rustfs:latest \
  /data
```

:::warning[コンテナ作成時に認証情報を設定する]

ネットワークへ公開する前に、一意の `RUSTFS_ACCESS_KEY` と `RUSTFS_SECRET_KEY` を環境変数で設定します。どちらの認証情報にも、広く知られている `rustfsadmin` は使わないでください。カスタムの認証情報なしでコンテナを起動した場合は、停止し、上記の両方の `-e` オプションを付けて再作成します。`rustfs-data` ボリュームはそのまま残ります。

:::

## 4. デプロイを確認する

コンテナと、S3 API のヘルスチェックエンドポイントを確認します。

```bash
podman ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

S3 API は `http://localhost:9000` で、Console は `http://localhost:9001` で利用できます。

## 次のステップ

- [RustFS Console](/ja/administration/console)
- [S3 クライアントを設定する](../../developer/examples/aws-cli.md)
- [TLS の設定](../../integration/tls-configured.md)
