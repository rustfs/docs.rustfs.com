---
title: "ライフサイクル管理"
description: "rc コマンドラインクライアントを使い、RustFS のオブジェクトライフサイクルルールを設定、確認、維持します。"
---

RustFS のライフサイクル管理は、バケット内のオブジェクトに有効期限と移行のルールを適用します。このページでは、`rc` でそれらのルールを管理し、移行を確認し、移行済みデータの一時的なローカルコピーを復元する方法を示します。

始める前に、[`rc` をインストール](/ja/operations/rc)し、`local` という名前のエイリアスを設定し、`my-bucket` を作成します。オブジェクトを移行するには、先に [階層化ストレージ](/ja/administration/data/tiered-storage) でターゲットを登録し、大文字の階層名を控えます。

:::note[非同期の評価]

ライフサイクルルールは、対象となるすべてのオブジェクトを直ちに処理するわけではありません。[オブジェクトスキャナー](/ja/administration/data/object/scanner) が、バックグラウンドでライフサイクル処理を評価します。

:::

## 有効期限のルールを追加する

作成から 30 日後に、`logs/` プレフィックス配下のオブジェクトを期限切れにします。

```bash
rc bucket lifecycle rule add local/my-bucket \
	--prefix logs/ \
	--expiry-days 30
```

このコマンドは、有効なルールを作成し、生成されたルール ID を返します。このルールを編集または削除する必要がある場合は、その ID を記録します。

## 移行ルールを追加する

90 日後に、オブジェクトデータを登録済みの `COLDTIER` 階層へ移します。

```bash
rc bucket lifecycle rule add local/my-bucket \
	--transition-days 90 \
	--storage-class COLDTIER
```

`--storage-class` は、登録済みの階層名と一致する必要があります。ルールを追加しても階層は作成されず、AWS のストレージクラス名が RustFS の階層として有効かどうかも検証されません。

有効期限と移行のオプションは、1 つのルールに組み合わせられます。非現行バージョンのオプションは、バージョニングを有効にしたバケットにだけ使います。

```bash
rc bucket lifecycle rule add local/my-bucket \
	--noncurrent-transition-days 30 \
	--noncurrent-transition-storage-class COLDTIER \
	--noncurrent-expiry-days 365
```

## ルールの確認と更新

現在のルールを一覧し、変更するルールの ID を控えます。

```bash
rc bucket lifecycle rule list local/my-bucket
```

ルールを削除せずに、有効期限を変更するか、ルールを無効にします。

```bash
rc bucket lifecycle rule edit local/my-bucket \
	--id <rule-id> \
	--expiry-days 60
rc bucket lifecycle rule edit local/my-bucket \
	--id <rule-id> \
	--disable true
```

ID を指定して、1 つのルールを削除します。バケットのライフサイクル設定全体を削除する意図がある場合にだけ、`--all` を使います。

```bash
rc bucket lifecycle rule remove local/my-bucket --id <rule-id>
rc bucket lifecycle rule remove local/my-bucket --all
```

## ルールのエクスポートとインポート

一括変更の前に、バケットのライフサイクル設定をエクスポートします。

```bash
rc bucket lifecycle rule export local/my-bucket > lifecycle.json
```

ファイルをインポートすると、バケットへ送信するライフサイクル設定が置き換わります。適用する前に JSON を確認します。

```bash
rc bucket lifecycle rule import local/my-bucket lifecycle.json
```

## ライフサイクル移行を確認する

オブジェクトがライフサイクルルールの対象になったあと、ソースクラスター上でそのオブジェクトを調べます。

```bash
aws s3api head-object \
	--bucket my-bucket \
	--key hello.txt \
	--endpoint-url http://localhost:9000
```

移行が完了すると、応答は登録済みの階層名をストレージクラスとして報告します。

```json
{
	"StorageClass": "COLDTIER"
}
```

応答には、追加のオブジェクトメタデータが含まれることがあります。移行が完了する前は、`StorageClass` が存在しないことや、まだ `COLDTIER` を報告しないことがあります。

通常どおり、ソースの RustFS エンドポイントを通してオブジェクトを読み取ります。

```bash
aws s3 cp \
	s3://my-bucket/hello.txt \
	/path/to/hello.txt \
	--endpoint-url http://localhost:9000
```

RustFS は、ソースのバケットとオブジェクトキーを通して、移行済みのデータを読み取ります。アプリケーションが、ターゲットバケットを直接指定する必要はありません。

## ローカルコピーを復元する

移行済みオブジェクトの一時的なローカルコピーを要求し、7 日間保持します。

```bash
rc bucket lifecycle restore local/my-bucket/hello.txt --days 7
```

ローカルへの書き戻しの実行中、`HEAD` は `x-amz-restore: ongoing-request="true"` を報告します。完了後は、`ongoing-request="false"` と有効期限を報告します。実行中にもう一度復元を要求すると、`RestoreAlreadyInProgress` が返されます。

復元期間が終了すると、RustFS は復元されたローカルコピーと、その復元メタデータを削除します。移行済みオブジェクトは、リモート階層から引き続き利用できます。

## コマンドの互換性

最新の `rc` は、互換性のためのエイリアスとして `rc ilm` も受け付けます。新しいコマンドとスクリプトでは、名詞を先頭にした `rc bucket lifecycle` 形式を推奨します。

```bash
rc bucket lifecycle --help
rc bucket lifecycle rule --help
rc bucket lifecycle tier --help
```

## 次のステップ

リモート階層の監視と保守は [階層化ストレージ](/ja/administration/data/tiered-storage) を参照します。ライフサイクルルールのテスト用オブジェクトを作るには、[オブジェクトの作成](/ja/administration/data/object/creation) を使います。
