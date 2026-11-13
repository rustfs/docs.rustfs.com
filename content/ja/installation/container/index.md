---
title: "コンテナで RustFS を実行する"
description: "公式の RustFS コンテナイメージを、Docker または Podman で実行します。"
---

RustFS は、オープンソースの S3 互換分散オブジェクトストレージシステムです。シングルノード・シングルディスク（SNSD）モードでは、RustFS はイレイジャーコーディングを使わず、冗長データも保存しません。そのため、このモードはローカルでのテストと小さなワークロードにだけ適しています。公式の RustFS イメージは、RustFS のバイナリと実行環境をコンテナにまとめているため、1 つのコマンドで永続ストレージ付きの RustFS を起動できます。

コンテナは、id が `10001` の root 以外のユーザー `rustfs` として動作します。バインドマウントするホストディレクトリの所有者は `10001` である必要があります。そうしないと、permission denied（権限拒否）エラーが発生します。

## コンテナランタイム

- [Docker](./docker.md): 永続ストレージを使ってシングルノードのインスタンスを実行し、Docker Compose、TLS、マルチノードのネットワークへ拡張します。
- [Podman](./podman.md): デーモンなしのワークフローで、同じイメージを実行します。

:::note[ディレクトリの権限]

`-v` でホストディレクトリをコンテナにマウントする場合は、ホストディレクトリの所有者が `10001` であることを確認します。

```bash
chown -R 10001:10001 /path/to/host_directory
```

:::

Kubernetes へのデプロイは、[Helm チャート](/ja/installation/cloud-native/helm-chart)または [Operator](/ja/installation/cloud-native/operator) を参照してください。
