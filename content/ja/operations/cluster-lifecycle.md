---
title: "クラスターのライフサイクル運用"
description: "検証済みのクォーラムとストレージクラスの動作に基づき、イレイジャーコーディングを使う RustFS クラスターの計画、起動、拡張、リバランス、デコミッション、データ修復、再起動を行います。"
---

このランブックは、イレイジャーコーディングを使う RustFS デプロイを運用するときの入口です。レイアウトの境界、ストレージクラスとクォーラム、ゼロパリティ、拡張、リバランス、デコミッション、データ修復、ドライブ交換、再起動を扱います。ここに書いた動作は、いずれも RustFS のソースコードに照らして検証済みです。上流のランブックは [rustfs/rustfs#7998](https://github.com/rustfs/rustfs/pull/7998) で導入されました。

関連する手順: [ストレージプールの拡張](./scaling/storage-pool-expansion.md)、[データリバランス](./scaling/data-rebalancing.md)、[ストレージプールのデコミッション](./scaling/storage-pool-decommission.md)、[ノードのデータ修復](./high-availability/node-healing.md)。

## レイアウトの制約

ストレージプールのエンドポイント数、セット数、セットあたりのドライブ数、プール一覧での位置は、永続化されたレイアウトです。起動時に RustFS は、保存済みのフォーマットと、設定されたドライブ数およびセット幅を比較します。移行は行わず、`PoolTopologyMismatch`（シングルドライブのデプロイでは `UnsupportedSnsdExpansion`）で恒久的に失敗します。元のエンドポイントとセット幅を戻します。エラーを回避するために `format.json` を削除しないでください。

:::warning[行ってはいけない操作]

- 既存のプールを、エンドポイント数を増減した構成で上書きしないでください。初期化済みプールの `RUSTFS_ERASURE_SET_DRIVE_COUNT` を変更しないでください。
- ボリューム引数の順序を入れ替えたり、ドライブのディレクトリを別のスロットへ移したりしないでください。
- オブジェクトのシャード、`xl.meta`、`.rustfs.sys` 以下の内容を、手作業で削除、コピー、名前変更しないでください。
- 手作業のファイルコピーをデータ移動と見なさないでください。オブジェクトを移動するのはリバランスとデコミッションだけです。オブジェクトロックのもとで、バージョンの再確認とソース側のクリーンアップを行います。

:::

実行時の役割は次のとおりです。

- **プール** — 永続化されたレイアウトを持つ、1 つのエンドポイント一覧です。マルチドライブのセットは 2〜16 台のドライブで構成されます。シングルドライブのレイアウトは、ローカルパスが 1 つだけの場合に限ります。
- **プールリーダー** — プールの先頭エンドポイントです。デコミッションの開始、キャンセル、クリアは任意のノードへ送れます。リクエストは、認証済みのノード間 RPC でプールリーダーへ転送されます。
- **クラスター全体の状態** — リバランスとルート heal はピアへ伝播し、再起動時には永続化されたメタデータから復旧します。

## 計画と初回起動

1. ノード、ラック、電源、ネットワークの障害ドメインを考慮してエンドポイントを計画します。トポロジが受理されることは、高可用性の保証にはなりません。シングルノードのプールでは、ホストを失うとそのシャードもすべて失われます。起動時には、マルチドライブのプールごとに `host_failure_data_unavailable` の警告が記録されます。
2. 各プールのセット幅を選びます。プールごとに幅が異なってもかまいません。ただし各プールは、幅が 2〜16 台のいずれか 1 つであるセットへ、均等に分割できる必要があります。`RUSTFS_ERASURE_SET_DRIVE_COUNT` で固定できるのは、すでに有効な約数になっている幅だけです。
3. [ストレージクラス](#storage-classes-parity-and-quorum)の規則に従って STANDARD と RRS のパリティを選び、最も狭いプールに対して検証します。明示したパリティは、すべてのプールに収まる必要があります。
4. 起動コマンド一式、エンドポイントの順序、プールの順序、セット幅、ストレージクラスの変数を記録します。これらは、すべてのノードで、再起動のたびに同一である必要があります。
5. すべてのエンドポイントパスは、RustFS だけが使うようにします。

ボリュームは、位置引数または `RUSTFS_VOLUMES` から取ります。引数なしの `rustfs` は、環境変数のボリュームを使った `rustfs server` と同じ動作になります。省略記号の展開は MinIO の方式に従います。

```bash
# one pool, four nodes, four drives each: sixteen endpoints
rustfs server http://node{1...4}:9000/data{1...4}

# two pools; every argument must carry an ellipsis once there is more than one
rustfs server http://node{1...4}:9000/data{1...4} http://node{5...8}:9000/data{1...4}
```

引数が 2 つ以上ある場合、すべての引数に省略記号が必要です。各プールは、互いに異なるドライブエンドポイントを少なくとも 2 つへ展開できる必要があります。シングルドライブのプールは、マルチプールのデプロイに参加できません。`{3...3}` のような単一値の範囲では、この最小数を回避できません。

ストレージクラスのエラーがあると、どのディスクにも書き込まずに起動が止まります。その後、起動処理はローカルディスク、ロッククライアント、フォーマットクォーラムの順に初期化します。

## 起動時の設定

| 変数 | 効果 | 制約 |
|---|---|---|
| `RUSTFS_ERASURE_SET_DRIVE_COUNT` | セット幅を固定する | プールの有効な対称約数であり、最大 16 である必要があります。初期化済みのプールは変更できません |
| `RUSTFS_STORAGE_CLASS_STANDARD` | STANDARD のパリティを `EC:<n>` で指定する | プールごとに検証されます。影響するのは新規の書き込みだけです |
| `RUSTFS_STORAGE_CLASS_RRS` | RRS のパリティを `EC:<n>` で指定する | プールごとに検証されます。明示した値はシングルドライブでは失敗します。永続化されている既定の `EC:1` は、シングルドライブでは `0` に解決されます |
| `RUSTFS_STORAGE_CLASS_OPTIMIZE` | MinIO 互換のため受け付ける | 保存されますが、現時点では使われません。実行時の動作は変わりません |
| `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` | シャードあたりのインライン上限を固定する（`128KiB` のようなバイトサイズ構文） | [インラインオブジェクト](#inline-objects)で比例して決まる既定値を置き換えます。128 KiB を超える値は警告を記録します |

`RUSTFS_STORAGE_CLASS_STANDARD` または `RUSTFS_STORAGE_CLASS_RRS` が空の場合は、自動ポリシーが復元され、永続化されている値は上書きされます。これらのキー、`ERASURE_SET_DRIVE_COUNT`、`VOLUMES` について、`MINIO_` 接頭辞の表記は、対応する `RUSTFS_` 名が未設定のときに `RUSTFS_` 名へ対応付けられます。両方とも設定されている場合は `RUSTFS_` の値が優先され、起動時に競合が報告されます。

データ移動と一覧取得に関するその他の調整項目は、`RUSTFS_REBALANCE_MAX_ATTEMPTS`（既定 3）、`RUSTFS_DECOMMISSION_BUCKET_CONCURRENCY`（既定の上限 4）、`RUSTFS_DECOMMISSION_ENTRY_CONCURRENCY`（既定の上限 8、ハード上限 64）、`RUSTFS_LIST_OBJECTS_QUORUM`（既定は `optimal`。受け付ける値は `disk`、`reduced`、`optimal`、`auto` で、それ以外は `strict`）です。いずれも、オブジェクトのクォーラム、オブジェクトロック、バージョン検査を緩めません。

## ストレージクラス、パリティ、クォーラム [#storage-classes-parity-and-quorum]

### 幾何構成

各オブジェクトは、1 セットの `N` 台のドライブに対してリード・ソロモン符号化され、`K` 個のデータシャードと `M` 個のパリティシャードになります。`N = K + M` です。任意の `K` 個のシャードから再構築できます。この幾何構成はオブジェクトごとに `xl.meta` へ保存されるため、後から既定値を変えても既存オブジェクトは書き換わりません。オブジェクトはハッシュでセットへ割り当てられ、シャードはそのセット内でローテーションします。セットごとの障害許容は独立しており、ほかのセットとは共有しません。

セット幅ごとの STANDARD パリティの既定値は、ドライブ 1 台で 0、2〜3 台で 1、4〜5 台で 2、6〜7 台で 3、8〜16 台で 4 です。RRS パリティの既定値は 1 です（シングルドライブでは 0）。

検証規則では、各パリティはすべてのプールで最大 `N/2` です。STANDARD のパリティが RRS のパリティ以上である必要があるのは、両方が 0 以外の場合だけです。下限はないため、`EC:0` はどの幅でも通ります。PUT、CopyObject、CreateMultipartUpload で受け付けるのは `STANDARD` と `REDUCED_REDUNDANCY` だけです。その他の AWS ストレージクラスは `InvalidStorageClass` を返します。

### クォーラムと容量

```text
usable capacity  ≈ raw × K / N
read quorum      = K            (metadata vote and shard decode)
write quorum     = K, or K + 1 when K == M
delete markers   = N/2 + 1      (majority, both write and vote)
```

ドライブ 16 台で `EC:4` の場合、`K = 12`、使用可能容量は約 75%、4 台の障害まで許容し、読み取りには有効なシャードが 12 個必要です。ドライブ 2 台で `EC:1` の場合、`K = M = 1` なので、1 台が停止しても読み取りはできますが、書き込みはできなくなります。`.rustfs.sys` 以下の内部メタデータは、設定されたクラスに関係なく、常にパリティ `N/2` で書き込まれます。

### インラインオブジェクト [#inline-objects]

すべてのシャードがシャードあたりの上限以下である場合、オブジェクトは `xl.meta` にインラインで保存されます。既定の上限は `256 KiB / K` で、シャードあたり 128 KiB が頭打ちです。そのため、セットが広くなってもインラインオブジェクトの最大サイズは上がりません。バージョニングが有効なバケットでは、上限は 8 で割られます。`RUSTFS_STORAGE_CLASS_INLINE_BLOCK` は、比例して決まる既定値を、シャードあたりの固定上限に置き換えます。各ドライブがインラインで保持するのは自ドライブのシャードだけなので、インラインデータの喪失条件は外部シャードと同じです。圧縮または暗号化されたストリームがインラインになるのは、保存サイズが既知で、かつ上限以内の場合だけです。

### 書き込みと読み取りの経路

書き込みはプールごとにレイアウトを解決し、1 MiB ブロックでリード・ソロモン符号化し、ビットロット保護されたシャードを書き、書き込みクォーラムに達してからコミットします。クォーラム未満の書き込みが成功として報告されることはありません。読み取りは、読み取りクォーラムで正規のメタデータを選び、ビットロットを検証し、少なくとも `K` 個のシャードから復号します。それより少ない場合は失敗として扱います（フェイルクローズ）。欠落シャードがあっても読み取りが成功した場合は、read-repair がキューに入ります。マルチパートのパートは、オブジェクトの幾何構成と書き込みクォーラムを使います。`CompleteMultipartUpload` はメタデータとコミットクォーラムを再確認するため、アップロード済みのパートはコミット済みのオブジェクトではありません。

## ゼロパリティ（EC:0）

`EC:0` は、任意のセット幅で、STANDARD、RRS、またはその両方に指定できます。得られるのは物理容量だけで、冗長性はありません。

:::danger[EC:0 ではドライブ 1 台の喪失でセット全体のデータが失われる]

交換または消去されたドライブは、そのドライブにシャードがあったゼロパリティのオブジェクトをすべて、恒久的に失います。セットの外にコピーがある場合を除きます。データ修復ではゼロパリティのオブジェクトを再構築できません。heal は、そのオブジェクトについて `no-parity object is unrecoverable` を報告します。本番デプロイでは `EC:1` 以上を使うことを推奨します。セットが複数のノードにまたがる場合、セットあたり `EC:2` 以上が通常の下限です。`EC:0` を使うのは、外部の層（RAID、レプリケーション、バックアップ、または再作成できるソース）が耐久性と可用性を担う場合に限り、明示的な承認があるときに限ってください。

:::

動作の詳細は次のとおりです。

- **設定。** 明示的な `EC:0` では、起動時の警告は出ません。ゼロ冗長の警告が出るのは、自動的にゼロパリティになる場合、つまりシングルドライブのプールだけです。`STANDARD=EC:2` かつ `RRS=EC:0` は有効です。いずれか一方がゼロのときは、大小関係の規則は適用されません。このときゼロパリティの意味を持つのは、`x-amz-storage-class: REDUCED_REDUNDANCY` で書き込まれたオブジェクトだけです。
- **書き込み。** 書き込みクォーラムは `N` です。セット内のいずれかのドライブに書き込めない場合、書き込みは `ErasureWriteQuorum` で失敗し、何もコミットされません。ゼロパリティのシャードは後から再構築できないため、書き込み経路はコミット前に、書き込んだすべてのシャードをビットロットハッシュと照合し、すでに不一致のシャードはコミットしません。
- **読み取り。** 読み取りクォーラムは `N` です。セット内のいずれかのドライブがオフラインだと、そのセット内のすべてのゼロパリティオブジェクトに対する HEAD と GET は `ErasureReadQuorum` で失敗します。縮退読み取りはありません。
- **削除。** 削除マーカーとバージョン削除は過半数クォーラム（`N/2 + 1`）を使います。そのため、読み取りと書き込みが失敗しているセットでも削除は成功できます。削除が成功しても、セットが正常である証拠にはなりません。
- **ドライブが 1 台停止していても動作するもの。** バケット操作、`.rustfs.sys` のメタデータ、削除マーカー、一覧取得クォーラムを満たす一覧取得です。セット内のそれ以外は利用できません。対象オブジェクトのリバランスとデコミッションも含まれ、これらは `N` 個すべてのシャードを読む必要があります。
- **後からパリティを上げても、既存のオブジェクトは書き換わりません。** 変更後に各オブジェクトを再アップロードするか、サーバー側でコピーして、保護し直します。

## 起動後の検証

読み取り専用の管理確認は次のとおりです。

```text
GET /rustfs/admin/v3/pools/list
GET /rustfs/admin/v3/pools/status?pool=<pool>[&by-id=true]
GET /rustfs/admin/v3/decommission/status[?pool=<pool>&by-id=true]
GET /rustfs/admin/v4/cluster/snapshot
GET /rustfs/admin/v4/runtime/capabilities
```

`pool` はプールのコマンドライン、または `by-id=true` を付けた 0 始まりのインデックスです。状態の照会は、未知のパラメーターを無視します。変更系のリクエストは、未知または重複したパラメーターと、`true` および `false` 以外の `by-id` 値を拒否します。

確認する項目は、プール数、プールごとのエンドポイント、プールごとのセット数と幅、ローカルとリモートのエンドポイント、トポロジの不一致がないことです。

データプレーンの確認では、STANDARD と RRS のオブジェクトを 1 つずつ書き込みます。GET、HEAD、範囲指定の GET、CopyObject、マルチパートアップロードを実行します。パリティの範囲内でドライブまたはノードを 1 つオフラインにし、読み取りが継続し、書き込みがクォーラム表どおりに動作することを確認します。復帰させたあと、heal キューが空になり、ビットロットのエラーが止まることを確認します。すべてのノードが同じプールメタデータとクラスタースナップショットを報告することを確認します。

## 拡張

既存のプールを、その場で拡張することはできません。プールを追加します。

1. ノード、ドライブ、障害ドメインを計画します。新しいプールには、少なくとも 2 つのドライブエンドポイントと、それ自身の有効なセットレイアウトが必要です。
2. すべてのノードで、空であり、RustFS だけが使うパスを準備します。
3. **すべての**ノードの起動引数へプールを追加します。既存のプール、その順序、エンドポイント、セット幅は変えません。シングルノード・シングルドライブのデプロイは拡張できません。移行は S3 経由で行います。
4. 再起動し、上記の確認項目に従って検証します。
5. 新しい書き込みは、利用可能なプールへ配置されます。既存のオブジェクトはそのままです。移動するにはリバランスを開始します。再起動してもリバランスは実行されません。

プールを追加しても、既存オブジェクトのパリティは増えず、何もコピーされません。プールをまたいでオブジェクトを移動するのは、リバランスとデコミッションだけです。具体例は [ストレージプールの拡張](./scaling/storage-pool-expansion.md) を参照してください。

## リバランス

リバランスは、使用量に基づいてオブジェクトをプール間で再配置します。前提は、プールが複数あること（単一プールは `NotImplemented` を返す）、実行中または競合するデコミッションがないこと、`start` と `stop` にクエリ文字列がないことです。

```text
POST /rustfs/admin/v3/rebalance/start     → {"id": "<uuid>"}
GET  /rustfs/admin/v3/rebalance/status
POST /rustfs/admin/v3/rebalance/stop
```

状態は、プールごとに `id`、`status`、`stopping`、`used`、`lastError`、`cleanupWarnings`、`progress`（オブジェクト数、バージョン数、バイト数、残りのバケット、現在のバケットとオブジェクト、経過時間、ETA）を報告します。加えて `stoppedAt` と、停止伝播のフィールドも報告します。

開始時は、新規受付を止めるフェンスとワーカー状態をピアへ伝播します。伝播に失敗すると終端状態へロールバックし、ロールバックできなかったピアを報告します。停止時は受付を閉じ、ローカルとリモートのワーカーを止め、停止状態を永続化します。リバランスを完了と見なしてよいのは、active または stopping のプールがなく、`lastError` が空か説明済みで、`cleanupWarnings` の内容を把握し、停止伝播が完了し、移行したオブジェクトを新しいプールから読めるときだけです。プールごとの状態は `rebalance.bin` にあります。実行を先へ進めるために削除してはいけません。手順は [データリバランス](./scaling/data-rebalancing.md) を参照してください。

## デコミッション

運用上の要点です。対応しているのは、マルチプールかつ非レガシー（省略記号を使う）デプロイだけです。それ以外は `NotImplemented` を返します。実行中のリバランスは、開始をブロックします。

```text
POST /rustfs/admin/v3/pools/decommission?pool=<a>[,<b>]      # by command line
POST /rustfs/admin/v3/pools/decommission?pool=1&by-id=true   # by index
GET  /rustfs/admin/v3/decommission/status[?pool=1&by-id=true]
POST /rustfs/admin/v3/pools/cancel?pool=1&by-id=true
POST /rustfs/admin/v3/pools/clear?pool=1&by-id=true
```

- ターゲットは、何も永続化する前にまとめて検証されます。未知、重複、active、queued、completed のターゲットは拒否されます。failed または canceled のターゲットは、先にクリアする必要があります。未解決の一覧エントリを持っている場合は、新たに開始することが再試行の経路です。
- エントリの状態は `queued` → `active` → `completed`、`failed`、または `canceled` で、`pool.bin` に永続化されます。起動時は非終端のエントリを再開し、終端になっている先行エントリはスキップします。
- デコミッションのいずれかの状態にあるソースプールは、通常の新規 PUT と新規マルチパートアップロードを拒否します（ステージ済みの PUT は `SlowDown` を受け取ります）。ソースが非終端のあいだは、既存のマルチパートアップロードを排出できます。
- `clear` が消すのは failed または canceled のメタデータだけで、データを元へ戻すことはありません。
- 起動引数からプールを外すのは、エントリが `completed` になり、解放されたバージョンとティアの所有権が収束し、すべてのノードが同じ状態を示すあとだけにしてください。それより前にソースドライブを切り離してはいけません。設定変更の代わりにディレクトリを削除してもいけません。

手順は [ストレージプールのデコミッション](./scaling/storage-pool-decommission.md) を参照してください。

## データ修復とドライブ交換

### 管理 heal

```text
POST /rustfs/admin/v3/heal/                    # root: cluster, or one erasure set with pool+set
POST /rustfs/admin/v3/heal/<bucket>
POST /rustfs/admin/v3/heal/<bucket>/<prefix>
POST /rustfs/admin/v3/background-heal/status
GET  /rustfs/admin/v4/heal/replacement-recovery
```

JSON ボディには `recursive`、`dryRun`、`remove`、`recreate`、`scanMode`、`updateParity`、`nolock`、`readRepair`、`pool`、`set` が入ります。ハンドラーの規則は次のとおりです。

- ルート heal は `recursive=true` を指定するか、`pool` と `set` の両方を指定する必要があります。プレフィックスのないバケット heal は常に再帰的です。プレフィックス heal は `recursive` に従います。
- `readRepair=true` は `InvalidArgument` で拒否されます。
- `nolock` は通信上は受け付けられますが、常に `false` に強制されます。管理 heal は常にオブジェクト名前空間のロックを取得するため、ロックを回避する方法はありません。
- `clientToken` は開始、状態、停止を関連付けます。`forceStart` と `forceStop` はそれに対して検証され、未知または重複したクエリキーは拒否されます。

データ修復は、クォーラムのメタデータから正規のバージョンを選び、欠落シャードがパリティで再構築できる数を超える場合、または保存されている幾何構成がセットと一致しない場合は拒否します。`(bucket, object)` のロックを、PUT、削除、マルチパート完了、データ移動と共有します。

### ドライブ交換

1. 影響を受けるセットが、そのオブジェクトの読み取りクォーラムをまだ満たしていることを確認します（`EC:0` では不可能です）。プールの状態から、プールのインデックス、セットのインデックス、スロット、障害ディスクの UUID を記録します。
2. **同じ**エンドポイントとマウントパスで、RustFS が所有する空のファイルシステムにドライブを交換します。古いドライブのディレクトリをコピーしないでください。コピーした `format.json` は、セットがすでに追跡している識別子だと主張します。
3. ノードを復帰させます。空のドライブはフォーマットクォーラムのメンバーではないため、イレイジャーセットの heal タスクが元のスロットへフォーマットを書き、シャードを再構築するまで、そのスロットはオフラインのままです。再構築は、起動時またはディスクスキャナーがマウント識別情報の変化を観測したときに記録された自動交換インテントによって、または管理用のイレイジャーセット heal（`pool` と `set` を付けた `POST /rustfs/admin/v3/heal/`）によって行われます。
4. `GET /rustfs/admin/v4/heal/replacement-recovery`、バックグラウンド heal の状態、ディスクの健全性、ビットロットのカウンタを監視します。キューが `idle` であることや、オブジェクトが読めることは、完了の証明にはなりません。
5. 交換が完了するのは、そのインスタンスについてリカバリが `completed` を報告し、サンプルしたオブジェクトの `xl.meta` とパートが新しいドライブ上にあるときです。

セットが失ったドライブ数がパリティを超えている場合、データ修復では再構築できません。レプリケーション、リモートティア、またはバックアップから復旧します。より広いデータ修復のモデルは [ノードのデータ修復](./high-availability/node-healing.md) を参照してください。

## 再起動と復旧

- **通常の再起動。** 進行中のトポロジ変更はなく、すべてのノードで引数は同一で、一度に 1 ノードずつ再起動します。起動時にプールメタデータ、`rebalance.bin`、デコミッションキュー、heal の復旧レコードを読み込み、リーダーと所有者の規則に従ってワーカーを再開します。
- **リバランス。** まず `/rebalance/status` を読みます。停止するか再起動するかを決める前に、active または stopping のプール、`lastError`、クリーンアップ警告、停止伝播を扱います。`rebalance.bin` を削除しないでください。
- **デコミッション。** 非終端のエントリは再開します。failed と canceled のエントリは、クリアされるか、許可された経路で再試行されるまで、再起動をまたいで残ります。
- **ルート heal。** 正常なシャットダウンは、未完了のクラスター heal を `.rustfs.sys` 以下の `root-heal-<task-id>.json` として永続化し、同じタスク ID で再実行します。無効、サイズ超過、または未対応のレコードは隔離用プレフィックスへ移され、運用担当者が修復するまでログを出してスキップされます。隔離マーカーを削除したり、タスク ID を再利用したりしないでください。
- **異常なシャットダウン。** 前回の実行がマーカーを残している場合、heal マネージャーはローカルのすべてのセットに対して、イレイジャーセット全体の heal をキューに入れます。正常なシャットダウンではマーカーが消去されます。

## 相互排他と禁止操作

| 操作 | リバランス時 | デコミッション時 | 注意 |
|---|---|---|---|
| PUT、DELETE、マルチパート完了 | オブジェクトロック | ソースプールは新規の公開を拒否する | プールのフェンスを回避しない |
| デコミッション | リバランスの実行中は拒否される | 直列キュー | 変更できるのはリーダーだけ |
| リバランス | マルチプールのみ | デコミッションの実行中、または競合時は拒否される | クエリパラメーターは付けられない |
| 管理 heal | オブジェクトロック | データを修復し、デコミッションの状態は変えない | `nolock` は無視される |
| ドライブ交換 | レイアウトは変更できない | デコミッションの途中にあるソースプールでは避ける | 同じスロットの空ドライブ |

:::warning[禁止事項]

リバランスまたはデコミッションの実行中に、起動エンドポイントを変更しないでください。`.rustfs.sys`、`rebalance.bin`、`pool.bin`、ルート heal のレコードを削除しないでください。手動 heal、ファイルコピー、ドライブ交換を、同一プールで同時に実行しないでください。開始呼び出しが HTTP 200 を返しても、完了と見なしてはいけません。

:::

## チェックリスト

- **起動または拡張のあと**: すべてのノードでエンドポイントとプール順が同一であること。トポロジが保存済みフォーマットと一致すること。ピアが準備完了であること。新しいエンドポイントが一意で、RustFS だけが使うこと。GET、HEAD、範囲指定の GET、マルチパートが検証済みであること。
- **リバランスのあと**: active または stopping のプールがないこと。`lastError` が空か説明済みであること。`cleanupWarnings` を処理済みであること。停止伝播が完了していること。移行したオブジェクトが読めること。
- **デコミッションのあと**: 状態が `completed` であること。他のエントリが方針どおりに処理されていること。ソースプールが新規の書き込みを拒否すること。解放されたバージョン、ティアの所有権、一覧エントリが収束していること。ドライブを切り離す前に、すべてのノードで起動引数を更新していること。
- **データ修復または交換のあと**: 交換リカバリが `completed` であること。スロットと UUID が正しいこと。heal キューが空であること。ビットロット数が増えていないこと。サンプルした現行バージョンと過去バージョンが読めること。一時ディレクトリが残っていないこと。

## rc コマンドの対応

`rc` は RustFS の CLI です（[CLI クライアント（rc）](./rc.mdx) を参照）。`expand` グループは `rebalance` のエイリアスです。サーバー側の expand API はありません。以下は、よく使うフラグです。インストール済みのバージョンは `rc admin <group> --help` で確認します。

```bash
rc alias set local http://localhost:9000 <your-access-key> <your-secret-key>
rc ping local
rc ready local --timeout 2
rc admin info cluster local
rc admin info disk local --offline
rc admin pool list local
rc admin pool status local 0 --by-id
rc admin rebalance start local
rc admin rebalance status local
rc admin rebalance stop local
rc admin decommission start local '/data/pool1/disk{1...4}'
rc admin decommission status local 1 --by-id
rc admin decommission cancel local 1 --by-id
rc admin decommission clear local 1 --by-id
rc admin heal start local --scan-mode deep
rc admin heal start local --bucket logs --prefix 2026/ --scan-mode deep
rc admin heal status local --client-token <TOKEN_FROM_START>
rc admin heal stop local --client-token <TOKEN_FROM_START>
```

| `rc` コマンド | サーバー側のパス |
|---|---|
| `rc ping` / `rc ready` | `GET /health` / `GET /health/ready` |
| `rc admin pool list` / `status` | `GET /rustfs/admin/v3/pools/list` / `GET /rustfs/admin/v3/pools/status` |
| `rc admin rebalance …` (エイリアス `expand`) | `/rustfs/admin/v3/rebalance/*` |
| `rc admin decommission start` / `cancel` / `clear` | `POST /rustfs/admin/v3/pools/decommission` / `cancel` / `clear` |
| `rc admin decommission status` | `GET /rustfs/admin/v3/decommission/status` |
| `rc admin heal start` / `status` / `stop` | `/rustfs/admin/v3/heal/*`, `POST /rustfs/admin/v3/background-heal/status` |

`rc admin heal start` が公開するのは `--bucket`、`--prefix`、`--scan-mode`、`--remove`、`--recreate`、`--dry-run` です。`nolock`、`forceStart`、`forceStop`、`pool`、`set` は公開しません。交換リカバリ用の `rc` コマンドはありません。`GET /rustfs/admin/v4/heal/replacement-recovery` を直接呼び出します。

## 参考資料

- 上流のランブック: [rustfs/rustfs#7998](https://github.com/rustfs/rustfs/pull/7998) の `docs/operations/cluster-lifecycle-operations.md`。本ページはこの文書を基にしており、記載は RustFS のソースコードに対して項目ごとに検証済みです。
- [ストレージプールの拡張](./scaling/storage-pool-expansion.md) · [データリバランス](./scaling/data-rebalancing.md) · [ストレージプールのデコミッション](./scaling/storage-pool-decommission.md) · [ノードのデータ修復](./high-availability/node-healing.md) · [CLI クライアント（rc）](./rc.mdx)
