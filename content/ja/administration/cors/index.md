---
title: "CORS の設定"
description: "RustFS の S3 API と Console について、ブラウザから許可するオリジンを設定します。"
---

Cross-Origin Resource Sharing（CORS）は、どのブラウザオリジンが RustFS の S3 API と Console にアクセスできるかを制御します。リスナーごとに設定したあと、環境変数の変更を反映するために RustFS を再起動します。

## S3 API のオリジン

`RUSTFS_CORS_ALLOWED_ORIGINS` に、信頼できるオリジンをカンマ区切りで設定します。

```ini title="/etc/default/rustfs"
RUSTFS_CORS_ALLOWED_ORIGINS="https://app.example.com,https://admin.example.com"
```

この変数が未設定または空のとき、S3 エンドポイントは汎用の CORS 応答ヘッダーを付加しません。明示したオリジンの一覧を設定すると、一致するオリジンからの、認証情報を伴うブラウザリクエストが許可されます。

任意のオリジンからのリクエストを許可するには、値を `*` にできます。ワイルドカードモードでは、ブラウザの認証情報は許可されません。

:::warning[本番では明示したオリジンを使う]

認証情報を送信するアプリケーションには、カンマ区切りの許可リストを使います。認証情報を伴うブラウザリクエストが不要な公開リソースに限り、`*` を使います。

:::

## Console のオリジン

Console は、別の変数を使います。

```ini title="/etc/default/rustfs"
RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS="https://admin.example.com"
```

複数のブラウザオリジンが Console にアクセスする必要がある場合は、カンマ区切りの一覧を使います。任意のオリジンを許可する必要がある場合にだけ、`*` を設定します。

## 応答を確認する

`Origin` ヘッダーを付けてリクエストを送り、CORS の応答ヘッダーを確認します。

```bash
curl -i \
  -H "Origin: https://app.example.com" \
  http://localhost:9000/
```

`Access-Control-Allow-Origin` に、想定したオリジンが含まれていることを確認します。一覧にないオリジンでも確認を繰り返し、許可されていないことを確認します。

## 次のステップ

検証済みの既定値と設定形式は、[環境変数リファレンス](/ja/reference/environment-variables#cors) を参照します。
