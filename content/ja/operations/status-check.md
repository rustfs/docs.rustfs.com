---
title: "ステータス確認"
description: "RustFS のネットワーク到達性、ヘルスチェックのエンドポイント、クラスターの状態、ストレージ容量を確認する方法を説明します。"
---

ネットワークのプローブ、RustFS Console（管理画面）の **Status**（ステータス）ページ、または `rc` のコマンドラインで、RustFS の可用性とストレージ使用量を確認します。コマンドラインの手順を使う前に、[`rc` をインストール](/ja/operations/rc)し、対象クラスターのエイリアスを設定します。

## ネットワークポート

RustFS は既定で 2 つのリスナーを使います。両方のバインドアドレスは、環境変数またはコマンドラインフラグで変更できます。

| ポート | リスナー | 設定方法 | トラフィック |
| --- | --- | --- | --- |
| `9000` | S3 API | `RUSTFS_ADDRESS` / `--address` | S3 オブジェクト API、管理 API、および `/rustfs/rpc/` と `/rustfs/peer/` 配下のノード間内部 RPC |
| `9001` | Console | `RUSTFS_CONSOLE_ADDRESS` / `--console-address` | `/rustfs/console/` 配下の組み込み Web Console。`RUSTFS_CONSOLE_ENABLE=false` で無効にします |

:::note[ノード間の接続]

ノード間 RPC はポート 9000 を共有します。マルチノードのクラスターでは、すべてのノードが S3 ポートでほかのすべてのノードへ到達できる必要があります。専用のクラスターポートはありません。

:::

クライアントが両方のリスナーへ到達する必要がある場合は、`firewalld` で既定のポートを開きます。

```bash title="firewall-cmd"
firewall-cmd --permanent --add-port=9000/tcp
firewall-cmd --permanent --add-port=9001/tcp
firewall-cmd --reload
```

:::warning[Console へのアクセスを制限する]

ポート 9001 は、信頼できるネットワークにだけ公開します。Console が不要な場合は、`RUSTFS_CONSOLE_ENABLE=false` を設定し、ポートは閉じたままにします。

:::

## ヘルスチェックのエンドポイント

ポート **9000** の S3 リスナーは、認証のないプローブ用エンドポイントを提供します。`RUSTFS_HEALTH_ENDPOINT_ENABLE=false` で無効にします。ポート **9001** の Console には、専用のヘルスパスがあります。

| エンドポイント | ポート | 意味 |
| --- | --- | --- |
| `GET /health`、`HEAD /health`、`GET /health/live`、`GET /minio/health/live` | 9000 | 生存確認（Liveness）。プロセスが動作している間は `200` を返します |
| `GET /health/ready` | 9000 | 準備完了。ストレージ、IAM、ピアがすべて準備できた場合だけ `200` を返し、それ以外は `503` を返します |
| `GET /minio/health/ready` | 9000 | 準備完了プローブの MinIO 互換エイリアス |
| `GET /minio/health/cluster`、`GET /minio/health/cluster/read` | 9000 | クラスターの書き込みと読み取りの健全性（ロックのクォーラムも必要です） |
| `GET /rustfs/console/health` | 9001 | Console プロセスの健全性 |

準備完了のノードは、`"ready": true` とともに `200` を返します。劣化したノードは、依存関係ごとの詳細とともに `503` を返します。

```bash title="Probe examples"
curl -fsS http://localhost:9000/health
curl -s http://<node>:9000/health/ready | jq
curl -fsS http://localhost:9001/rustfs/console/health
```

`details` オブジェクトは `storage` / `iam` / `lock`（設定されている場合は `kms`）を報告し、`degradedReasons` は `storage_quorum_unavailable`、`iam_not_ready`、`lock_quorum_unavailable` のような機械可読の原因を列挙します。

## クラスターの状態

### Console でクラスターの状態を確認する

1. RustFS Console にサインインします。
2. **Status** を開きます。
3. クラスターがオンラインであることを確認し、サーバー、ネットワーク、ドライブの状態を確認します。
4. メンテナンスや容量変更の前に、オフラインのサーバー、利用できないドライブ、失敗したネットワーク接続を調べます。

### rc でクラスターの状態を確認する

設定済みのエイリアスで、クラスター情報コマンドを実行します。

```bash
rc admin info cluster rustfs
```

概要には、クラスターの状態、RustFS のバージョン、サーバー数とディスク数、バックエンドの種類、イレイジャーコーディングのパリティが表示されます。ノード一覧には、稼働時間、ネットワーク接続、ドライブの可用性、所属するプールが表示されます。ディスク一覧には、各ドライブの状態と、プール、セット、ディスクの位置が表示されます。

機械可読の出力にするには、JSON を指定します。

```bash
rc admin info cluster rustfs --json
```

## ストレージ容量

### Console でストレージ容量を確認する

1. RustFS Console にサインインし、**Status** を開きます。
2. クラスターの使用済み容量と総容量を確認します。
3. 各ディスクの容量と空き容量を確認します。
4. 使用量の推移を比較し、通常の書き込みとメンテナンスに必要な空き容量が不足する前に、拡張を計画します。

### rc でストレージ容量を確認する

同じクラスター情報コマンドを使います。

```bash
rc admin info cluster rustfs
```

**Storage**（ストレージ）の概要には、クラスターの使用済み容量、総容量、使用率が表示されます。**Disks**（ディスク）の各項目には、そのドライブの使用済み容量、総容量、空き容量が表示されます。

スクリプトや監視連携で値を集めるときは、JSON 出力を使います。

```bash
rc admin info cluster rustfs --json
```

管理情報のコマンドには、対応する RustFS Admin API の権限を持つ認証情報が必要です。

## 次のステップ

継続的なテレメトリとアラートについては、[オブザーバビリティ](./observability.md)に進みます。ストレージを追加する場合は、[ストレージプールの拡張](./scaling/storage-pool-expansion.md)を確認します。
