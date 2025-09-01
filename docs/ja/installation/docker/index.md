---
title: "RustFS Docker インストール"
description: "RustFS Docker デプロイ。"
---

# RustFS Docker インストール

RustFSは高性能で100% S3互換のオープンソース分散オブジェクトストレージシステムです。シングルノードシングルディスク（SNSD）デプロイモードでは、バックエンドはゼロ消去コーディングを採用し、追加のデータ冗長性を提供せず、ローカルテストと小規模シナリオに適しています。
この記事はRustFS公式Linuxバイナリパッケージをベースに、カスタムDockerfileを通じてRustFSとその実行環境をコンテナにパッケージ化し、データボリュームと環境変数を設定することで、ワンクリックでサービスを起動できます。

---

## I. 事前準備

1. **ホスト要件**

 * Docker（≥ 20.10）がインストールされ、正常にイメージをプルし、コンテナを実行できること
 * オブジェクトデータをマウントするためのローカルパス `/mnt/rustfs/data`（またはカスタムパス）
2. **ネットワークとファイアウォール**

 * ホストマシンの9000ポートが外部に開放されていることを確認（またはカスタムポートと一致）
3. **設定ファイルの準備**

 * ホストマシンの `/etc/rustfs/config.toml` でリスニングポート、管理者アカウント、データパスなどを定義（セクション4参照）

---

## II. RustFS公式イメージの高速プル

公式Ubuntuベースイメージを使用して、RustFS公式イメージを高速にプル：


```bash
docker pull rustfs/rustfs

```

---

## III. 環境設定の作成

ホストマシンに設定ファイル `/etc/rustfs/config.toml` を作成します。サンプル内容：

```bash
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:7000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_ENDPOINT=""
RUSTFS_TLS_PATH="/opt/tls"
```

> **説明：** 設定項目の形式とデフォルト値については、公式Linuxインストールドキュメントを参照してください。

---

## IV. RustFSコンテナの実行

RustFS SNSD Docker実行方式、上記のイメージと設定を組み合わせて実行：

```bash
 docker run -d \
  --name rustfs_local \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest \
  /data
```

パラメータ説明：

* `-p 9000:9000`：ホスト9000ポートをコンテナにマップ
* `-v /mnt/rustfs/data:/data`：データボリュームをマウント
* `--name rustfs_local`：コンテナのカスタム名
* `-d`：バックグラウンド実行

---

### 完全なパラメータ設定例

```bash
docker run -d \
  --name rustfs_container \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY=rustfsadmin \
  -e RUSTFS_SECRET_KEY=rustfsadmin \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_SERVER_DOMAINS=example.com \
  rustfs/rustfs:latest \
  --address :9000 \
  --console-enable \
  --server-domains example.com \
  --access-key rustfsadmin \
  --secret-key rustfsadmin \
  /data
```

### パラメータ説明と対応方法

1. **環境変数方式**（推奨）：
   ```bash
   -e RUSTFS_ADDRESS=:9000 \
   -e RUSTFS_SERVER_DOMAINS=example.com \
   -e RUSTFS_ACCESS_KEY=rustfsadmin \
   -e RUSTFS_SECRET_KEY=rustfsadmin \
   -e RUSTFS_CONSOLE_ENABLE=true \
   ```

2. **コマンドラインパラメータ方式**：
   ```
   --address :9000 \
   --server-domains example.com \
   --access-key rustfsadmin \
   --secret-key rustfsadmin \
   --console-enable \
   ```

3. **必須パラメータ**：
    - `<VOLUMES>`：コマンド最後に指定、例：`/data`

### 一般的な設定の組み合わせ

1. **基本設定**：
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     rustfs/rustfs:latest \
     /data
   ```

2. **コンソール有効化**：
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_CONSOLE_ENABLE=true \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --console-enable \
     /data
   ```

3. **カスタム認証キー**：
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_ACCESS_KEY=rustfsadmin \
     -e RUSTFS_SECRET_KEY=rustfsadmin \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --access-key rustfsadmin \
     --secret-key rustfsadmin \
     /data
   ```

### 注意事項

1. ポートマッピングは対応する必要があります：
    - サービスポートデフォルト9000（`-p 9000:9000`）

2. データボリュームは永続化する必要があります：
    - `-v /host/path:/container/path`

3. 環境変数とコマンドラインパラメータは混合使用可能ですが、コマンドラインパラメータがより高い優先度を持ちます

4. [TLS使用](../../integration/tls-configured.md)時は、証明書パスを追加でマウントする必要があります：

   ```bash
   -v /path/to/certs:/certs \
   -e RUSTFS_TLS_PATH=/certs \
   ```

## V. 検証とアクセス

1. **コンテナ状態とログの確認：**

 ```bash
 docker logs rustfs_local
 ```

 ログはサービス起動成功と9000ポートの監視を表示する必要があります。

2. **S3 APIテスト：**

 `mc`または他のS3クライアントを使用：

 ```bash
 mc alias set rustfs http://localhost:9000 rustfsadmin ChangeMe123!
 mc mb rustfs/mybucket
 mc ls rustfs
 ```

 バケットが正常に作成・一覧表示できれば、デプロイが効果的です。


## VI. その他の提案

1. 本番環境の推奨事項：
- マルチノードデプロイアーキテクチャを使用
- [TLS暗号化通信を有効化](../../integration/tls-configured.md)
- ログローテーション戦略を設定
- 定期バックアップ戦略を設定

2. ストレージ推奨事項：
- ローカルSSD/NVMeストレージを使用
- ネットワークファイルシステム（NFS）の使用を避ける
- ストレージディレクトリへの排他アクセスを保証

---

## まとめ

この記事はRustFSシングルノードシングルディスクコンテナ化のベストプラクティスを組み合わせ、Dockerを通じて自己構築でRustFSイメージを構築し、SNSD環境をデプロイする方法を詳細に実演しました。
このソリューションは迅速な起動と実験に適しており、後にKubernetes、Swarmなどのプラットフォームで同じアプローチを使用してマルチノードマルチディスク本番レベルクラスターに拡張できます。

