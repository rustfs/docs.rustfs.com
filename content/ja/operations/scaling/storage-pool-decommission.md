---
title: "プールのデコミッション"
description: "Console または rc で RustFS のストレージプールをデコミッションし、データが移動したことを確認します。"
---

## 概要

### 要件

- このガイドで `rc` の手順を使う前に、管理用ホストに [`rc`](/ja/operations/rc) をインストールします。
- デコミッションを管理する権限を持つ認証情報を設定します。

**プールのデコミッション**は、選択したプールのオブジェクトを残りの稼働中プールへ移動し、対象プールをデプロイから外せるようにします。データを排出してプールを停止する操作であり、ハードウェアを退役するとき、プールを置き換えるとき、または容量を集約するときに使います。

デコミッションは [リバランス](./data-rebalancing.md) とは別の操作です。リバランスはすべてのプールを稼働したままにします。デコミッションは、選択したプールのデータを排出して停止します。この 2 つの操作は同時には実行できません。

開始前の条件と作業は、次のとおりです。

- 操作後も、稼働中のプールを 1 つ以上残す必要があります。
- 残りのプールに十分な空き容量があることを確認します。RustFS では、排出する使用バイト数に 30% のオーバーヘッドを加えた容量を、残りのプールの空き領域でまかなう必要があります。
- すべてのノードとディスクが正常であり、リバランスが実行中でないことを確認します。
- 重要なデータをバックアップし、トラフィックの少ない時間帯に操作を予定します。
- 対象を選ぶ前に、正確なプール ID とボリューム式を記録します。

デコミッションを取り消しても、完了した移動は元に戻りません。すでに移動したオブジェクトは、移動先のプールに残ります。

## 操作

### Console でデコミッションを開始する

1. デコミッションを管理する権限を持つアカウントで、RustFS Console にサインインします。
2. **Pool Decommission**（プールのデコミッション）を開きます。
3. 停止するプールを特定し、ID、ボリューム式、使用容量、ステータスを確認します。

   ![デコミッション前に選択されたストレージプールを示す RustFS Console](./images/pool-decommission-selection-console.png)

4. そのプールの **Start Decommission**（デコミッションを開始）を選択します。
5. 確認ダイアログをよく読み、**Start Decommission** を選択します。

   ![プールのデコミッション確認ダイアログを示す RustFS Console](./images/pool-decommission-confirmation-console.png)

6. 操作が完了するまで、**Sync**（同期）でプールの状態と移動カウンターを更新します。

   ![プールのデコミッションの進捗と移動カウンターを示す RustFS Console](./images/pool-decommission-running-console.png)

完了後、残っているすべてのノードの `RUSTFS_VOLUMES` から、排出済みプールの式を削除し、同じ順序のトポロジーで RustFS を再起動します。Helm では、`pools.list` からエントリを外す前に、そのプールをデコミッションします。稼働中のプールエントリを削除したり、順序を変えたりしてはいけません。

![デコミッション完了のステータスが付いた、選択中のプールを示す RustFS Console](./images/pool-decommission-completed-console.png)

### rc でデコミッションを開始する

必要に応じてクラスターのエイリアスを設定し、プールを一覧表示します。

```bash
rc alias set rustfs http://<server-ip>:9000 <your-access-key> <your-secret-key>
rc admin pool list rustfs
```

0 始まりの ID を指定して、プール `0` のデコミッションを開始します。

```bash
rc admin decommission start rustfs 0 --by-id
```

`--by-id` を付けず、プールのボリューム式そのものを渡すこともできます。

```bash
rc admin decommission start rustfs 'http://rustfs-node1:9000/data/rustfs{1...4}/mnmd'
```

すべてのプール、または対象プールだけを監視します。

```bash
rc admin decommission status rustfs
rc admin decommission status rustfs 0 --by-id
```

実行中の操作を取り消すには、次を実行します。

```bash
rc admin decommission cancel rustfs 0 --by-id
```

デコミッションが失敗した、または取り消された場合は、再試行の前にメタデータを消去します。

```bash
rc admin decommission clear rustfs 0 --by-id
```

対象が `complete` を報告したら、残っているすべてのノードの `RUSTFS_VOLUMES` からその式を削除し、縮小したトポロジーで RustFS を再起動します。

## 検証

### Console でデコミッションを検証する

対象プールが `Completed` を報告し、失敗したオブジェクト数と失敗したバイト数が 0 であることを確認します。起動時のトポロジーからプールを外して RustFS を再起動したあと、次を確認します。

![停止したプールを削除したあとに残ったプールだけを示す RustFS Console](./images/pool-decommission-final-topology-console.png)

- 停止したプールが、稼働中のプールとして表示されていないこと。
- 残っているすべてのノードとディスクがオンラインであること。
- 残りのプールに移動したデータが表示され、空き容量が十分であること。
- 既存のオブジェクトを、引き続き一覧表示、読み取り、ダウンロードできること。

### rc でデコミッションを検証する

トポロジーからプールを外す前に、次を実行します。

```bash
rc admin decommission status rustfs 0 --by-id
```

ステータスが `complete` であり、失敗したオブジェクトとバイトのカウンターが 0 であることを確認します。`RUSTFS_VOLUMES` を更新して RustFS を再起動したあと、次を実行します。

```bash
rc admin pool list rustfs
```

意図した稼働中のプールだけが残っていることを確認します。以前は停止したプールに置かれていたオブジェクトを読み取り、S3 エンドポイント経由で新しいテストオブジェクトを書き込みます。
