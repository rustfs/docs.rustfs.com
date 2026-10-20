---
title: "SSE-S3"
description: "RustFS のバケットとオブジェクト書き込みに、サーバー管理の SSE-S3 暗号化を設定します。"
---

SSE-S3 は、S3 の `AES256` 暗号化モードを使います。RustFS は、暗号化するオブジェクトごとに一意のデータ暗号化鍵を生成し、設定した KMS サービスでその鍵をラップします。クライアントは暗号化鍵を提供せず、保持もしません。

## 要件

- [KMS](./kms.md) を設定して起動し、デフォルト鍵を作成し、SSE-S3 を有効にする前にその鍵が利用できることを確認します。
- [`rc`](/ja/operations/rc) をインストールして設定します。
- 対象のバケットを作成し、通常のオブジェクト書き込みが成功することを確認します。

:::warning[KMS が利用できることが必要です]

KMS が利用できない場合でも、RustFS は SSE-S3 のバケットデフォルトを受け付けます。ただし、その状態で暗号化したオブジェクトの書き込みは失敗します。本番データにバケットを使う前に、暗号化された書き込みと読み取りを確認します。

:::

## バケットのデフォルト暗号化を設定する

オブジェクト単位の暗号化モードを指定しない新しい書き込みに、SSE-S3 を適用します。

```bash
rc bucket encryption set rustfs/my-bucket --mode sse-s3
rc bucket encryption info rustfs/my-bucket
```

報告されるモードは `SSE-S3` になるはずです。

テストオブジェクトをアップロードして読み取ります。

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object show rustfs/my-bucket/hello.txt
```

## 1 つのオブジェクトを明示的に暗号化する

バケットのデフォルトを変えずに、単一の宛先へ SSE-S3 を適用します。

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	--enc-s3 rustfs/my-bucket/hello.txt
```

再帰的な書き込みでは、暗号化セレクターが宛先のプレフィックスと完全に一致する必要があります。

```bash
rc object copy ./reports/ rustfs/my-bucket/reports/ --recursive \
	--enc-s3 rustfs/my-bucket/reports/
```

## バケットのデフォルトを解除する

デフォルトルールを削除します。

```bash
rc bucket encryption clear rustfs/my-bucket
rc bucket encryption info rustfs/my-bucket
```

バケットのデフォルトを解除または変更しても、影響するのは以降の書き込みだけです。既存のオブジェクトは復号も書き換えもされません。

## リクエストヘッダー

S3 クライアントは、次のヘッダーで SSE-S3 を要求します。

```http
x-amz-server-side-encryption: AES256
```

オブジェクト単位のリクエストは、その書き込みについてバケットのデフォルトを上書きします。オブジェクト単位のモードが指定されていない場合、RustFS はバケットの暗号化設定から有効なモードを解決します。

## 次のステップ

明示的な KMS 鍵 ID が必要な場合は [SSE-KMS](./kms.md#verify-kms-backed-encryption) を使います。クライアントが保持する鍵については [SSE-C](./sse-c.md) と比較します。
