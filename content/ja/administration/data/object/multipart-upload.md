---
title: "マルチパートアップロード"
description: "大きなオブジェクトをパートに分けてアップロードし、Console のアップロードタスクを監視し、完了したオブジェクトを rc で検証する方法を説明します。"
---

マルチパートアップロードは、1 つのオブジェクトを個別にアップロードするパートに分割し、サーバー上で組み立てます。大きなオブジェクト、再試行できる転送、進捗とキャンセルの制御が必要なブラウザーアップロードに使います。

## 概要

S3 のマルチパート手順には、必須の 3 段階があります。

1. **CreateMultipartUpload** がアップロード ID を返します。
2. **UploadPart** が番号付きのパートをアップロードし、各パートの ETag を返します。
3. **CompleteMultipartUpload** が、順序付けされたパート番号と ETag を送信し、最終的なオブジェクトを作成します。

未完了のアップロードは **AbortMultipartUpload** で中止し、一時パートがストレージを消費し続けないようにします。

RustFS が受け付けるパート番号は `1` から `10000` までです。`ListParts` と `ListMultipartUploads` は、1 回の応答で最大 1,000 件を返し、ページネーションにはマーカーを使います。完了したオブジェクトは、完了リクエストが成功したあとにだけ現れます。

## Console でアップロードする

1. RustFS Console にサインインし、保存先のバケットを開きます。
2. **Upload File/Folder**（ファイルまたはフォルダーのアップロード）を選択します。
3. 必要に応じて **Current Prefix**（現在のプレフィックス）を入力します。
4. **Select File**（ファイルを選択）または **Select Folder**（フォルダーを選択）を選び、アップロードする内容を指定します。
5. 選択した名前とサイズを確認し、**Start Upload**（アップロード開始）を選択します。

![大きなファイルを選択した Console のアップロードダイアログ](./images/multipart-upload-console.png)

Console のアップロードダイアログは最大 10,000 ファイルに対応し、単一ファイルの上限として 512 GB を表示します。これらは Console のアップロード上限です。S3 クライアントには、これとは異なるローカル上限がある場合があります。

アップロードを開始すると、**Task Management**（タスク管理）がタスクを Pending（保留）、Processing（処理中）、Completed（完了）、Failed（失敗）、Canceled（キャンセル済み）の状態に分けます。処理中の各タスクには、進捗と **Cancel**（キャンセル）操作が表示されます。実行中のマルチパートタスクをキャンセルすると、進行中のパートリクエストが中止され、タスクはキャンセル済みになります。

完了後にバケットの表示を更新し、オブジェクトのサイズと更新時刻を確認します。

## rc を使う

`rc` でオブジェクトをアップロードし、検証します。

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object stat rustfs/my-bucket/hello.txt --json
```

:::note[rc 0.1.29 におけるマルチパートの制限]

`rc 0.1.29` は、マルチパートの create、upload-part、complete、list-parts、abort コマンドを公開していません。検証済みの 20 MiB の `rc object copy` は、マルチパートアップロードではなく、単一の `PutObject` リクエストを使っていました。明示的なマルチパート動作が必要な場合は Console または S3 SDK を使い、完了したオブジェクトの検証には `rc object stat` を使います。

:::

バージョニングが有効なバケットでは、完了したマルチパートアップロードが作成したバージョンを一覧します。

```bash
rc bucket version list rustfs/my-bucket/hello.txt --json
```

バージョニングが有効なバケットでマルチパートの完了が成功すると、RustFS はバージョン ID を返します。

## S3 のマルチパート操作

次の標準操作に対応した S3 SDK を使います。

| 段階 | S3 操作 | 必要な値 |
| --- | --- | --- |
| 開始 | `CreateMultipartUpload` | バケット、キー、メタデータ、暗号化、および任意のオブジェクトロック設定。 |
| アップロード | `UploadPart` | バケット、キー、アップロード ID、パート番号、本文。返された ETag を保存します。 |
| 検査 | `ListParts` | バケット、キー、アップロード ID。必要に応じてページネーションします。 |
| 完了 | `CompleteMultipartUpload` | 順序付けされたパート番号と、それぞれの正確な ETag。 |
| キャンセル | `AbortMultipartUpload` | バケット、キー、アップロード ID。 |
| 検出 | `ListMultipartUploads` | バケットと任意のプレフィックス。必要に応じてページネーションします。 |

別のキーに対してアップロード ID を再利用しないでください。完了したパートはパート番号の昇順で送信し、各 ETag は返された値をそのまま保持します。

## 検証

完了後に、次を実行します。

```bash
rc object stat rustfs/my-bucket/hello.txt --json
rc object show rustfs/my-bucket/hello.txt > /tmp/hello-downloaded.txt
cmp /path/to/hello.txt /tmp/hello-downloaded.txt
```

`size_bytes` がローカルファイルと一致し、`cmp` が正常終了することを確認します。バージョニングが有効なバケットでは、`rc bucket version list` がバージョン ID を返すことも確認します。

## トラブルシューティング

| 現象 | 確認すること |
| --- | --- |
| アップロードが Processing のままになる | ブラウザーの接続を確認し、Console のタブは開いたままにします。接続が中断した場合は、キャンセルして再試行します。 |
| パートリクエストが失敗する | 同じアップロード ID とパート番号でそのパートを再試行し、最後に返された ETag を使います。 |
| 完了時に無効なパートが報告される | 送信したパート番号、順序、ETag を `ListParts` と照合します。 |
| パートをアップロードしたあともオブジェクトがない | `CompleteMultipartUpload` を送信します。アップロードしたパートだけでは、オブジェクトは作成されません。 |
| 一時ストレージが増え続ける | 未完了のアップロードを一覧し、不要なものを中止します。 |
| ロックされたキーで完了が失敗する | 現在の宛先バージョンに対するオブジェクトロックの保持、またはリーガルホールドを確認します。 |

## 次のステップ

- [オブジェクトを作成して確認する](./creation.md)
- [オブジェクトのバージョンを管理する](./versioning.md)
- [オブジェクトロックでオブジェクトを保護する](./object-lock.md)
