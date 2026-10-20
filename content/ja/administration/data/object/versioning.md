---
title: "バージョニング"
description: "バケットのバージョニングを有効にし、以前のオブジェクトバージョンを復元し、削除マーカーを rc と Console で管理する方法を説明します。"
---

RustFS のバケットバージョニングは、同じオブジェクトキーの複数のバージョンを保持します。誤った上書きや削除からの復元と、オブジェクトロックおよびバケットレプリケーションの前提を満たすために使います。

## 概要

バージョニングが有効な場合の動作は、次のとおりです。

- 既存のキーへのアップロードまたはコピーのたびに、新しいバージョン ID が作成されます。
- 通常の削除では、古いバージョンを消さずに削除マーカーが作成されます。
- バージョン ID を指定せずにキーを読み取ると、最新の可視バージョンが返されます。最新のエントリが削除マーカーの場合は、`NotFound` が返されます。
- 特定のバージョンを読み取る、または削除するには、そのバージョン ID が必要です。

バージョニングを一時停止すると、新しいバージョン ID の通常の作成は止まりますが、既存のバージョンと削除マーカーは保持されます。一時停止は、無効化やバージョン履歴の削除とは異なります。

## Console で設定する

### バケット作成時に有効にする

1. **Buckets**（バケット）を開き、**Create Bucket**（バケットの作成）を選択します。
2. バケット名を入力します。
3. **Version**（バージョン）を有効にします。
4. **Create**（作成）を選択します。

### 既存バケットのバージョニングを有効または一時停止する

1. **Buckets** を開き、対象のバケットを見つけて **Settings**（設定）を選択します。
2. **Data Protection**（データ保護）で **Versioning**（バージョニング）を見つけます。
3. 必要に応じて、バージョニングを有効にするか、一時停止します。

設定ページには `Enabled`、`Suspended`、または `Disabled` が表示されます。一時停止しても既存のバージョンは保持されることも示されます。

### バージョンを参照して復元する

1. バケットを開き、削除マーカーで隠れたキーを確認する必要がある場合は、**Show Deleted Objects**（削除済みオブジェクトを表示）を有効にします。
2. オブジェクト名を選択して、**Object Details**（オブジェクトの詳細）を開きます。
3. **Versions**（バージョン）を選択し、利用できるバージョンと削除マーカーを確認します。
4. 必要なバージョンをダウンロードし、再度アップロードして、その内容を最新バージョンにします。

## rc を使う

バケットを作成し、バージョニングを有効にします。

```bash
rc bucket create rustfs/my-bucket
rc bucket version enable rustfs/my-bucket
rc bucket version info rustfs/my-bucket
```

同じキーの 2 つのバージョンをアップロードします。

```bash
printf 'version one\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt rustfs/my-bucket/hello.txt

printf 'version two\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt rustfs/my-bucket/hello.txt --overwrite
```

バージョンを一覧し、復元するバージョン ID を記録します。

```bash
rc bucket version list rustfs/my-bucket/hello.txt --json
rc object stat rustfs/my-bucket/hello.txt \
	--version-id <version-id> --json
```

以前のバージョンの本文をダウンロードし、新しい最新バージョンとしてアップロードして復元します。

```bash
rc object show rustfs/my-bucket/hello.txt \
	--version-id <version-id> > /tmp/hello-restored.txt

rc object copy /tmp/hello-restored.txt \
	rustfs/my-bucket/hello.txt --overwrite
```

現在のキーを削除して削除マーカーを作成し、結果を確認します。

```bash
rc object remove rustfs/my-bucket/hello.txt --force
rc bucket version list rustfs/my-bucket/hello.txt --json
```

最新のエントリには `is_delete_marker: true` が表示されるはずです。それより前のバージョンは、バージョン ID を指定すれば引き続き利用できます。

通常の書き込みで新しい番号付きバージョンを作成しないようにするには、バージョニングを一時停止します。

```bash
rc bucket version suspend rustfs/my-bucket
rc bucket version info rustfs/my-bucket
```

:::warning[rc 0.1.29 におけるバージョン削除の制限]

`rc object remove --versions` は `rc 0.1.29` のヘルプ出力に記載されていますが、`not implemented` を返します。選択したバージョン ID を完全に削除するには、Console または S3 SDK を使います。保持、レプリケーション、復旧の要件を確認するまで、バージョン履歴全体は削除しないでください。

:::

## 検証

バージョニングを有効にしたあと、次を確認します。

1. 内容の異なる同じキーを、2 回アップロードします。
2. `rc bucket version list` を実行し、両方のエントリのバージョン ID が異なることを確認します。
3. `rc object show --version-id` で各バージョンを取得し、内容を比較します。
4. バージョン ID を指定せずにキーを削除し、削除マーカーが現れることを確認します。
5. 古いバージョンをバージョン ID で取得し、復元できることを確認します。

## 運用上の考慮事項

- 上書きと削除が古いデータを残すため、バージョニングによってストレージ使用量が増えます。
- 非現行バージョンのライフサイクルルールは、復旧期間と保持期間を定義したあとにだけ設定します。
- バケットレプリケーションには、ソースと宛先の両方のバケットでバージョニングが必要です。
- オブジェクトロックはバージョニングに依存し、個々のバージョンを保護します。
- マルチパートの完了は、バージョニングが有効なバケットに、新しいオブジェクトバージョンを 1 つ作成します。

## 次のステップ

- [オブジェクトロックでバージョンを保護する](./object-lock.md)
- [大きなオブジェクトをアップロードする](./multipart-upload.md)
- [バケットのライフサイクルを管理する](../lifecycle-management.md)
