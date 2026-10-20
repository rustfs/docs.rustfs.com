---
title: "バケットクォータ"
description: "個々の RustFS バケットに、ハードなストレージクォータを設定、確認、検証します。"
---

RustFS のバケットクォータは、個々のバケットに保存するオブジェクトデータの合計を制限します。クォータを使うと、1 つのワークロードが割り当てられた容量を超えて消費することを防ぎ、ほかのバケットは残りのストレージを使えます。

## 概要

RustFS が現在サポートするのは、バイト単位のハードクォータです。書き込みを受け付ける前に、RustFS は、バケットの現在の使用量に要求されたオブジェクトサイズを加えた値と、設定された上限を比較します。上限を超える書き込みは、`InvalidRequest` とメッセージ `Bucket quota exceeded` で拒否されます。

クォータの確認は、次の操作を対象とします。

| 操作 | クォータの動作 |
| --- | --- |
| オブジェクトのアップロード | 現在の使用量にオブジェクトサイズを加えた値が上限を超える場合、アップロードを拒否します。 |
| マルチパートアップロードの完了 | アップロードを確定する前に、完了したオブジェクトのサイズを確認します。 |
| バケットへのオブジェクトのコピー | コピー元オブジェクトのサイズを、コピー先バケットのクォータと照合します。 |
| オブジェクトの削除 | 容量を回復できるよう、常に許可されます。 |

クォータの対象はオブジェクトデータです。オブジェクト数やリクエストレートは対象ではありません。上限を設定していないバケットは、無制限です。

:::note[置き換えアップロード]

クォータの確認では、受信するオブジェクトのサイズ全体を、バケットの現在の使用量に対して確保します。そのため、既存のキーを置き換えるには、置き換え後のオブジェクト全体が入る空きが必要になることがあります。

:::

## Console で設定する

1. RustFS Console にサインインし、**Browser**（ブラウザー）を開きます。
2. バケットを見つけ、**Settings**（設定）を選びます。
3. **Capacity & Metadata**（容量とメタデータ）で **Bucket Quota**（バケットクォータ）を見つけ、**Edit**（編集）を選びます。
4. **Bucket Quota** を有効にします。
5. クォータサイズを入力し、**MiB**、**GiB**、**TiB**、**PiB** のいずれかを選びます。
6. **Save Quota**（クォータを保存）を選びます。

![クォータサイズと単位のコントロールがある Set Bucket Quota ダイアログ](./images/bucket-quota-console.png)

上限を外すには、ダイアログを再び開き、**Bucket Quota** を無効にして、変更を保存します。

## rc を使う

RustFS デプロイ向けのエイリアスを設定します。

```bash
rc alias set rustfs http://localhost:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

`rc` を別のホストで実行する場合は、`localhost` を RustFS サーバーのアドレスに置き換えます。

### 権限

クォータの操作には、次のポリシーアクションが必要です。

| 操作 | 必要なアクション |
| --- | --- |
| クォータの設定または解除 | `admin:SetBucketQuota` |
| クォータ設定または統計の読み取り | `s3:GetBucketQuota` |
| 提案された操作が収まるかどうかの確認 | `s3:GetBucketQuota` |

ルート認証情報には、これらの権限があります。管理を委任する場合は、そのワークフローに必要なアクションだけを付与します。

### クォータを設定する

1 GiB のハードクォータを設定します。`rc` は、バイト値、または `1G`、`500M`、`10KB` のような単位を受け付けます。

```bash
rc bucket quota set rustfs/my-bucket 1G
```

応答には、設定した上限と現在の使用量が含まれます。

```text
Bucket: my-bucket
Quota: 1 GiB
Usage: 0 B
Type:  HARD
```

### クォータを読み取る

```bash
rc bucket quota info rustfs/my-bucket
```

別のツールが結果を処理する必要がある場合は、`--json` を使います。

```bash
rc bucket quota info rustfs/my-bucket --json
```

上限が設定されていない場合、人が読める形式の出力は `Quota: unlimited` と報告します。

:::note[設定の反映]

クォータを設定または解除した直後の照会は、短時間、以前の状態を返すことがあります。検証の手順を始める前に、クォータを再度照会し、想定した値であることを確認します。

:::

### クォータを解除する

オブジェクトを削除せずに、上限を外します。

```bash
rc bucket quota clear rustfs/my-bucket
rc bucket quota info rustfs/my-bucket
```

設定の変更が適用されると、バケットは無制限になります。

## 高度なクォータ確認

`rc 0.1.29` には、詳細な使用量統計や、提案された書き込みの事前確認を行うコマンドがありません。これらの操作には、RustFS の Admin API を使います。リクエストは、有効な RustFS 認証情報を使い、AWS 署名バージョン 4 で署名する必要があります。

例では、次のシェル変数を使います。

```bash
export RUSTFS_ENDPOINT=http://localhost:9000
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>
export BUCKET_NAME=my-bucket
```

:::warning[認証情報を保護する]

環境変数はローカルテストには便利ですが、同じオペレーティングシステムユーザーで動作するプロセスから見えることがあります。本番では、プラットフォームのシークレットマネージャー、またはアクセスを制限した認証情報ファイルを使います。

:::

### 詳細な使用量統計を読み取る

統計エンドポイントを使い、上限、現在の使用量、残りのバイト数、使用率を取得します。

```bash
curl --fail-with-body \
	--aws-sigv4 "aws:amz:us-east-1:s3" \
	--user "${RUSTFS_ACCESS_KEY}:${RUSTFS_SECRET_KEY}" \
	"${RUSTFS_ENDPOINT}/rustfs/admin/v3/quota-stats/${BUCKET_NAME}"
```

```json
{
	"bucket": "my-bucket",
	"quota_limit": 1073741824,
	"current_usage": 1048576,
	"remaining_quota": 1072693248,
	"usage_percentage": 0.09765625
}
```

使用量の値は、RustFS のデータ使用量集計から得られます。統計の応答を外部の課金やオーケストレーションに使う前に、ごく最近の変更がそのビューへ反映される時間を取ります。

### 提案されたアップロードを確認する

オブジェクトを書き込まずに、64 MiB のアップロードが収まるかを確認します。

```bash
curl --fail-with-body \
	--aws-sigv4 "aws:amz:us-east-1:s3" \
	--user "${RUSTFS_ACCESS_KEY}:${RUSTFS_SECRET_KEY}" \
	--request POST \
	--header "Content-Type: application/json" \
	--data '{"operation_type":"PUT","operation_size":67108864}' \
	"${RUSTFS_ENDPOINT}/rustfs/admin/v3/quota-check/${BUCKET_NAME}"
```

`allowed` フィールドが、その判定を示します。この確認は参考情報です。計画したアップロードが始まる前に、別の書き込みが容量を消費することがあるため、最終的な判定は実際のアップロードの結果です。

## 検証

小さなテスト用クォータを設定し、収まるオブジェクトをアップロードしたあと、残りの容量を超えるオブジェクトのアップロードを試みます。

```bash
rc bucket quota set rustfs/my-bucket 1M

dd if=/dev/zero of=/tmp/quota-small.bin bs=1024 count=256
dd if=/dev/zero of=/tmp/quota-large.bin bs=1048576 count=2

rc object copy /tmp/quota-small.bin rustfs/my-bucket/hello.bin
rc object copy /tmp/quota-large.bin rustfs/my-bucket/too-large.bin
```

256 KiB のオブジェクトは成功します。2 MiB のオブジェクトは 1 MiB のバケットクォータを超えるため、`rc` はエラーで終了し、RustFS は `too-large.bin` を作成しません。

最初のオブジェクトを削除し、テスト用クォータを解除します。

```bash
rc object remove rustfs/my-bucket/hello.bin --force
rc bucket quota clear rustfs/my-bucket
rc bucket quota info rustfs/my-bucket
```

最後の照会が `Quota: unlimited` と報告することを確認します。

クォータの適用処理が内部設定を読み取れない、または解析できない場合、RustFS は `Bucket quota check degraded to allow` をログに記録し、書き込みを許可します。この警告は、クォータの適用が一時的に利用できないことを意味するため、監視します。

## 次のステップ

- [バケットを作成する](./creation.md)
- [ライフサイクルルールを管理する](../lifecycle-management.md)
- [オブザーバビリティを設定する](/ja/operations/observability)
