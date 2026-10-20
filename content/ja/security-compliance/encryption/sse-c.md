---
title: "SSE-C"
description: "顧客が提供する AES-256 鍵を使い、RustFS のオブジェクトを暗号化および復号します。"
---

SSE-C は、書き込みと読み取りのリクエストごとにクライアントが提供する 256 ビット鍵でオブジェクトを暗号化します。RustFS はリクエストのために鍵を検証して使いますが、平文の顧客鍵は永続化しません。SSE-C は RustFS の KMS バックエンドを使いません。

## 要件

- [`rc`](/ja/operations/rc) をインストールして設定します。
- 鍵生成の例のために OpenSSL をインストールします。
- 顧客鍵が転送中に暗号化されるよう、HTTPS を使います。
- 顧客鍵はシークレットマネージャーに保管し、各オブジェクトと鍵の対応関係を維持します。

:::warning[読み取りのたびに同じ鍵が必要です]

SSE-C 鍵を失うと、RustFS は回復できず、オブジェクトは読めなくなります。鍵をログに記録したり、コミットしたり、暗号化されていない接続で送ったりしないでください。

:::

## 顧客鍵を用意する

16 進数の中間表現を経由して 32 バイトの乱数を生成し、Base64 鍵とその Base64 エンコードされた MD5 チェックサムを導出します。

```bash
SSE_C_KEY_HEX=$(openssl rand -hex 32)
SSE_C_KEY_B64=$(printf '%s' "$SSE_C_KEY_HEX" | xxd -r -p | openssl base64 -A)
SSE_C_KEY_MD5=$(printf '%s' "$SSE_C_KEY_HEX" | xxd -r -p \
	| openssl dgst -md5 -binary | openssl base64 -A)
```

これらの値は、承認されたシークレット管理の手順へ移します。端末やシェル履歴には出力しないでください。

## 暗号化したオブジェクトをアップロードする

`rc 0.1.29` には専用の SSE-C オプションがありません。署名付きカスタムヘッダーを送るオプションで、3 つの S3 SSE-C ヘッダーを送れます。

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	-H "x-amz-server-side-encryption-customer-algorithm:AES256" \
	-H "x-amz-server-side-encryption-customer-key:$SSE_C_KEY_B64" \
	-H "x-amz-server-side-encryption-customer-key-md5:$SSE_C_KEY_MD5"
```

必要なリクエストヘッダーは次のとおりです。

| ヘッダー | 値 |
| --- | --- |
| `x-amz-server-side-encryption-customer-algorithm` | `AES256` |
| `x-amz-server-side-encryption-customer-key` | Base64 エンコードされた 32 バイトの鍵 |
| `x-amz-server-side-encryption-customer-key-md5` | 生の鍵の MD5 ダイジェストを Base64 エンコードした値 |

## 暗号化したオブジェクトを読み取る

読み取りとメタデータのリクエストには、同じ 3 つのヘッダーを指定します。

```bash
rc object show rustfs/my-bucket/hello.txt \
	-H "x-amz-server-side-encryption-customer-algorithm:AES256" \
	-H "x-amz-server-side-encryption-customer-key:$SSE_C_KEY_B64" \
	-H "x-amz-server-side-encryption-customer-key-md5:$SSE_C_KEY_MD5"
```

同じ手順は、`rc 0.1.29` を使って RustFS に対して検証済みです。オブジェクトをアップロードし、元の鍵で読み取り、返されたバイト列をソースと比較しています。

:::warning[コマンド引数を保護する]

汎用の `-H` 方式は、展開されたヘッダー値を `rc` プロセスの引数に置くため、ホスト上の他のプロセスから見えることがあります。本番の自動化では、コマンドライン引数ではなく、保護されたメモリまたは認証情報プロバイダーを通じて SSE-C の鍵材料を受け取る S3 SDK を使うことを推奨します。

:::

## シェル変数を消去する

操作のあと、シェル環境から鍵材料を削除します。

```bash
unset SSE_C_KEY_HEX SSE_C_KEY_B64 SSE_C_KEY_MD5
```

バケットの SSE-S3 または SSE-KMS のデフォルトを変更しても、SSE-C オブジェクトは変わりません。SSE-C は、個々のリクエストの顧客鍵ヘッダーによって選択され、そのリクエストでは優先されます。

## 次のステップ

サーバー管理の暗号化については [SSE-S3](./sse-s.md) を、明示的な KMS による鍵管理については [KMS](./kms.md) を比較します。
