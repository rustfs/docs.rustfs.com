---
title: "バケットレプリケーション"
description: "バージョニングを有効にした RustFS バケット間で、非同期レプリケーションを設定、検証、監視します。"
---

RustFS のバケットレプリケーションは、選択したオブジェクトバージョンを、ソースバケットからターゲットバケットへコピーします。バケットデータのリモートコピーの維持、デプロイ間でのオブジェクトの配布、復旧手順で使う二次コピーの準備に使います。

## 概要

バケットレプリケーションには、2 層の設定があります。

1. **リモートターゲット**は、ターゲットのエンドポイント、バケット、認証情報、生成されたターゲット ARN を保持します。
2. S3 の **レプリケーション設定**は、ルールをソースバケットに付与し、そのターゲット ARN を参照します。

ソースバケットとターゲットバケットの両方で、バージョニングを有効にする必要があります。リモートターゲットを登録するとき、RustFS はターゲットへの接続と、ターゲットバケットのバージョニングを確認します。RustFS は、有効なルールが未知の、または古くなったターゲット ARN を参照するレプリケーション設定を拒否します。

レプリケーションは、既定で非同期です。ソースへのアップロードが成功したことは、RustFS がソースオブジェクトを受け付けたことを意味します。ターゲット側のコピーがすでに完了していることにはなりません。

ルールでは、プレフィックスまたはオブジェクトタグでオブジェクトを選べます。制御できる動作は次のとおりです。

| ルールの設定 | 動作 |
| --- | --- |
| `Status` | ルールを有効または無効にします。 |
| `Filter` | キーのプレフィックス、オブジェクトタグ、またはその両方によって、レプリケーション対象を制限します。 |
| `ExistingObjectReplication` | `Enabled` のとき、ルールの作成より前からあったオブジェクトを含めます。 |
| `DeleteMarkerReplication` | `Enabled` のとき、削除マーカーをレプリケートします。 |
| `DeleteReplication` | `Enabled` のとき、特定のオブジェクトバージョンの削除をレプリケートします。 |
| `Destination` | 登録済みのリモートターゲットを、ARN で指定します。 |

バケットレプリケーションには方向があります。両方のバケットが書き込みを受け付け、互いの変更をレプリケートする必要がある場合は、逆方向にも別のターゲットとルールを設定します。より広いサイト設定とアイデンティティデータを同期する [サイトレプリケーション](/ja/operations/high-availability/site-replication) と、バケットレプリケーションを混同してはなりません。

## 設定

### 要件

- ソースの RustFS デプロイと、到達できるターゲットの S3 互換デプロイ。
- バージョニングを有効にした、ソースバケットとターゲットバケット。
- ターゲットバケットのバージョニングを検査でき、レプリケートされたオブジェクトバージョンと削除マーカーを書き込める、専用のターゲット認証情報。
- リモートターゲットとレプリケーション設定を管理できる、ソース側の管理者。
- レプリケーション処理を実行できるすべてのソースノードから、ターゲットエンドポイントへのネットワーク到達性。
- 管理用ホストにインストールした、RustFS の [`rc`](/ja/operations/rc) クライアント。

デプロイごとに、`rc` のエイリアスを 1 つ設定します。専用の認証情報を使い、コマンドを実行する前に、例のエンドポイントを置き換えます。

```bash
rc alias set source https://source.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias set target https://target.example.com:9000 \
	<target-access-key> <target-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias list
```

ソースデプロイは、リモートターゲットを登録するとき、ターゲットエイリアスの認証情報を使います。`rc alias list` はエンドポイントを表示しますが、シークレットキーは表示しません。

:::warning[ターゲットの認証情報を保護する]

RustFS は、ターゲットの認証情報を、ソースバケットのリモートターゲット設定の一部として保存します。ターゲットバケットへのアクセスに限定した専用の認証情報を使い、ルート認証情報は再利用してはなりません。

:::

### 権限

ソース側の管理では、次のポリシーアクションを使います。

| 操作 | 必要なアクション |
| --- | --- |
| リモートターゲットの登録、更新、削除 | `admin:SetBucketTarget` |
| リモートターゲットの一覧 | `admin:GetBucketTarget` |
| レプリケーションメトリクスの読み取り | `admin:GetReplicationMetrics` |
| レプリケーション設定の適用または削除 | `s3:PutReplicationConfiguration` |
| レプリケーション設定の読み取り | `s3:GetReplicationConfiguration` |

ターゲットの認証情報は、RustFS のターゲット検証に合格する必要があります。検証では、バケットへのアクセス、バージョニング、レプリケートされたオブジェクトの書き込み、レプリケートされた削除マーカー、オブジェクトバージョンの削除を確認します。ソースバケットでオブジェクトロックが有効な場合、ターゲットは互換性のあるオブジェクトロックに対応している必要があります。

### バケットの作成とバージョニング

ソースバケットを作成します。

```bash
rc bucket create source/my-bucket
```

ターゲットバケットを作成します。

```bash
rc bucket create target/my-bucket-replica
```

両方のバケットでバージョニングを有効にします。

```bash
rc bucket version enable source/my-bucket
rc bucket version enable target/my-bucket-replica

rc bucket version info source/my-bucket
rc bucket version info target/my-bucket-replica
```

レプリケーションを設定しているあいだは、ソースバケットのバージョニングを停止してはなりません。

## 使い方

### Console でレプリケーションを設定する

RustFS Console では、リモートターゲットの登録とレプリケーションルールの設定を、1 つのフォームで行います。

1. ソースデプロイの Console にサインインします。
2. **Buckets**（バケット）を開き、ソースバケットを見つけて **Settings**（設定）を選びます。
3. **Data Protection**（データ保護）で、無効なら **Versioning**（バージョニング）を有効にします。
4. **Automation**（自動化）で **Open Bucket Replication**（バケットレプリケーションを開く）を選びます。
5. **Add Replication Rule**（レプリケーションルールを追加）を選びます。
6. 宛先とルールを設定します。

| Console のフィールド | 値 |
| --- | --- |
| **Priority**（優先度） | ルール評価の優先度です。初期値は `1` です。 |
| **Mode**（モード） | **Asynchronous**（非同期）または **Synchronous**（同期）を選びます。既定では非同期が選ばれています。 |
| **Endpoint**（エンドポイント） | ターゲットの S3 API アドレスを、URL スキームなしの `host:port` で指定します。 |
| **Bucket**（バケット） | バージョニング済みの宛先バケット名です。 |
| **Access Key**（アクセスキー）と **Secret Key**（シークレットキー） | 宛先バケットへのレプリケーションを認可された、専用の認証情報です。 |
| **Region**（リージョン） | ターゲットのリージョンです。初期値は `us-east-1` です。 |
| **Storage Class**（ストレージクラス） | 宛先で適用するストレージクラスです。初期値は `STANDARD` です。 |
| **Prefix**（プレフィックス） | 一致するオブジェクトを限定する、任意のキープレフィックスです。 |
| **Tags**（タグ） | 任意のオブジェクトタグについて、名前と値のフィルターです。フィルターを追加するには **Add Tag**（タグを追加）を選びます。 |
| **Use TLS**（TLS を使う） | 宛先への接続で HTTPS を有効にします。 |
| **Replicate Existing Objects**（既存オブジェクトをレプリケート） | ルールより前に作成されたオブジェクトを含めます。既定で有効です。 |
| **Replicate Delete Markers**（削除マーカーをレプリケート） | 削除マーカーを宛先へコピーします。既定で有効です。 |
| **Replicate Delete**（削除をレプリケート） | 特定のオブジェクトバージョンの削除をコピーします。既定で有効です。 |
| **Health Check Interval**（ヘルスチェック間隔） | ターゲットのヘルスチェック間隔（秒）です。初期値は `60` です。 |
| **Bandwidth Limit**（帯域幅の上限） | ターゲットごとの転送上限です。単位は KiB/s、MiB/s、GiB/s から選べます。 |

7. **Save**（保存）を選びます。RustFS は、ルールを受け付ける前に、ソースバケット、ターゲットへの接続、ターゲットの認証情報、ターゲットバケットのバージョニングを検証します。
8. **Bucket Replication**（バケットレプリケーション）に戻り、ルールを確認します。表示されている状態を更新するには、**Refresh**（再読み込み）を選びます。

:::warning[両方のデプロイでバージョニングを有効にする]

ルールを保存する前に、ソースと宛先の両方のバケットでバージョニングを有効にする必要があります。必要な場合は、ターゲットデプロイの Console にサインインし、**Buckets** → **Settings** → **Data Protection** でバージョニングを有効にします。

:::

繰り返し実行する自動化や、構成管理には、以下の `rc` の手順を使います。

### rc でレプリケーションルールを追加する

新規オブジェクトと既存オブジェクトをコピーし、削除マーカーと明示的なバージョン削除を伝播する、非同期ルールを作成します。

```bash
rc bucket replication add source/my-bucket \
	--remote-bucket target/my-bucket-replica \
	--id replicate-all \
	--priority 1 \
	--replicate delete,delete-marker,existing-objects
```

`rc` は、ターゲットの登録、生成された ARN の取得、レプリケーションルールの適用を、1 回の操作で行います。不要な動作については、`--replicate` のフラグを省きます。書き込みが同期レプリケーションの完了を待つ必要がある場合にだけ、`--sync` を付けます。

レプリケーションをプレフィックスに限定するには、`--prefix` を追加します。

```bash
rc bucket replication add source/my-bucket \
	--remote-bucket target/my-bucket-replica \
	--id replicate-documents \
	--priority 2 \
	--prefix documents/ \
	--replicate delete-marker,existing-objects
```

有効なルールに一致しないオブジェクトは、ソースバケットにだけ残ります。1 秒あたりのバイト数の上限は `--bandwidth`、ターゲットのヘルスチェック間隔の変更は `--healthcheck-seconds`、宛先ストレージクラスの上書きは `--storage-class` で指定します。

### ルールの一覧と更新

有効なルールを一覧します。

```bash
rc bucket replication list source/my-bucket
rc bucket replication list source/my-bucket --json
```

ルールは ID を指定して更新します。変更されるのは、指定した設定だけです。

```bash
rc bucket replication update source/my-bucket \
	--id replicate-all \
	--priority 2 \
	--bandwidth 104857600 \
	--healthcheck-seconds 60
```

ルールの有効化と無効化は `--status Enabled|Disabled`、レプリケーションモードの変更は `--sync true|false` で指定します。

### 設定のエクスポートとインポート

確認またはバックアップのため、レプリケーション設定の全体をエクスポートします。

```bash
rc bucket replication export source/my-bucket --json > replication.json
```

エクスポートには、リモートターゲットのメタデータと、ターゲットのアクセスキーが含まれます。シークレットキーは含まれません。このファイルは、機密の設定として保護します。

以前にエクスポートした設定をインポートします。

```bash
rc bucket replication import source/my-bucket replication.json
```

### レプリケーション設定を削除する

```bash
rc bucket replication remove source/my-bucket --id replicate-all

# Remove every replication rule from the bucket.
rc bucket replication remove source/my-bucket --all
```

RustFS は、削除した設定が参照していたレプリケーションのリモートターゲットも削除します。ターゲットバケットへすでにコピーされたオブジェクトやバージョンは、削除しません。それらのオブジェクトは、ターゲットバケットのライフサイクルと保持の要件に従って、削除するか保持します。

:::note[rc 0.1.29 の削除応答]

RustFS がレプリケーション設定とそのターゲットを削除したあと、`rc 0.1.29` は 2 回目のターゲット削除を試みるときに、`Remote target not found` と報告することがあります。`rc bucket replication list source/my-bucket --json` を実行します。`rules` 配列が空であれば、設定が削除されたことを確認できます。

:::

## 検証

### ターゲットの準備状況を確認する

`rc bucket replication add` は、ルールを作成する前に、ソースへのアクセス、ターゲットへの接続、ターゲットの認証情報、バケットのバージョニングを確認します。作成された宛先とルールの設定を確認します。

```bash
rc bucket replication list source/my-bucket --json
```

### オブジェクトをレプリケートする

ソースへテスト用オブジェクトをアップロードします。

```bash
printf 'hello from RustFS replication\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt source/my-bucket/hello.txt
```

ソースオブジェクトを確認します。

```bash
rc object stat source/my-bucket/hello.txt --json
```

レプリケーションは既定で非同期であるため、ターゲットオブジェクトは直ちには表示されないことがあります。成功するまで、次のコマンドを繰り返します。

```bash
rc object stat target/my-bucket-replica/hello.txt --json
rc object show target/my-bucket-replica/hello.txt
```

ソースとターゲットの `etag` および `size_bytes` を比較し、`object show` が想定した内容を返すことを確認します。

削除マーカーのレプリケーションを確認するには、ソースオブジェクトを削除し、両方のバケットでバージョンを一覧します。

```bash
rc object remove source/my-bucket/hello.txt --force

rc bucket version list source/my-bucket/hello.txt --json
rc bucket version list target/my-bucket-replica/hello.txt --json
```

削除マーカーのレプリケーションが成功すると、両方のバケットの最新エントリは `is_delete_marker: true` になります。

### レプリケーションメトリクスを確認する

```bash
rc bucket replication status source/my-bucket
rc bucket replication status source/my-bucket --json
```

このコマンドは、ソースノードが現在メモリ上に持つレプリケーション統計を返します。オブジェクトが宛先に到達したあとでも、メトリクスはゼロのままであることがあります。メトリクスだけを検証の根拠にせず、ターゲットオブジェクトとバージョンの確認とあわせて使います。

### 障害を調査する

| 症状 | 確認項目 |
| --- | --- |
| `bucket versioning must be enabled` | ソースバケットのバージョニングを有効にします。 |
| ターゲットの登録が `not versioned` と報告する | ターゲットバケットのバージョニングを有効にします。 |
| `replication target configuration not found` | ターゲットのエイリアス、認証情報、宛先バケットを再確認し、`replication add` を再実行します。 |
| ルールが古くなったターゲットを報告する | ルールの一覧を更新し、`replication add` を再試行します。解消しない場合は、失敗した設定を削除してターゲットを作り直します。 |
| ターゲットオブジェクトが表示されない | ターゲットへの到達性、認証情報、ターゲットのクォータ、`rc bucket replication status` を確認します。 |
| レプリケーションが失敗する | ターゲット ARN とオブジェクトキーについて、ソースノードのログを確認します。 |
| ターゲットの削除が拒否される | 参照されているターゲットを削除する前に、レプリケーション設定を削除または置き換えます。 |

## 次のステップ

- [バケットのライフサイクルを管理する](../lifecycle-management.md)
- [バケットクォータを設定する](./quota.md)
- [オブザーバビリティを設定する](/ja/operations/observability)
