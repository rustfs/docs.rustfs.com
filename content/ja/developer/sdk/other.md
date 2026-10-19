---
title: "その他の SDK"
description: "公式の AWS SDK がない言語から、RustFS へ接続する方法を説明します。"
---

使っている言語向けの公式 SDK を AWS が提供していない場合は、次のいずれかの方法で RustFS と連携できます。

## 1. S3 API へ HTTP リクエストを直接送る

S3 プロトコルは、標準的な RESTful API です。HTTP リクエストを送れる言語（C、Rust、Lua、Erlang など）であれば、クライアントの処理を自分で実装できます。

### 主な手順

* **リクエスト署名**: AWS Signature Version 4 を実装します（最も複雑な部分です）。
* **ヘッダーと正規リクエスト**: 正規リクエストと、必要なヘッダーを組み立てます。
* **HTTP クライアント**: 署名済みのリクエストを、HTTP または HTTPS のクライアントで送ります。

リクエスト署名については、既存のオープンソース実装を参照することを推奨します。例:

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. AWS CLI、または既存の SDK で構築したサービスを使う

自分で署名を実装したくない場合は、次の方法を使えます。

### 2.1. AWS CLI を呼び出す

たとえば、アプリケーションからシェルで次のコマンドを実行します。

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

あるいは、Node.js または Python の SDK で小さな中継サービスを作り、アプリケーションから呼び出してオブジェクトをアップロードまたはダウンロードします。

### 2.2. プロキシサービスを動かす（Flask、FastAPI、Express など）

S3 に対応していないクライアントが呼び出せる HTTP API を公開します。

```http
POST /upload -> Service internally calls SDK to upload objects to RustFS
GET /presigned-url -> Generate presigned URL for frontend/client use
```

---

## 3. サードパーティのコミュニティ SDK を探す

公式の AWS SDK がない言語では、コミュニティが保守している S3 クライアントを探します。例:

* Haskell: `amazonka-s3`
* Rust: `rusoto`（非推奨）、または `aws-sdk-rust`
* OCaml: `cohttp` の上に、独自のクライアントを構築します
* Delphi: S3 に対応した商用ライブラリがあります

コミュニティ SDK は安定性の差が大きいため、使用前に活動状況、ドキュメント、互換性を評価することを推奨します。

---

## 4. 署名付き URL でクライアントから直接アップロードする

例:

* ブラウザーやモバイルアプリから、署名付き URL を使って直接アップロードします。
* バックエンドサービス（Node.js、Python、Go など）に、アップロード処理を実装します。

---

## 方法の選び方

| 状況 | 推奨する方法 |
| --- | --- |
| すべてを自分で制御する必要がある、または組み込み環境が対象 | SigV4 署名を自分で実装する |
| SDK の対応は限られるが、シェルは使える | AWS CLI でアップロードする |
| 中継サービスをデプロイできる | Python または Node.js で、小さな S3 ゲートウェイを構築する |
| フロントエンドからのアップロード | 署名付き URL を使う |
