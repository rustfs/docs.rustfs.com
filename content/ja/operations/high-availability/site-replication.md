---
title: "サイトレプリケーション"
description: "rc コマンドラインクライアントを使い、複数サイトの RustFS レプリケーションを設定して運用します。"
---

サイトレプリケーションは、2 つ以上の独立した **RustFS** デプロイを結びます。リンクしたサイトのあいだで、バケット、オブジェクトバージョン、対応しているアイデンティティとアクセス管理（IAM）のデータを同期します。アプリケーションが別々の RustFS サイトへ書き込みつつ、ストレージとアイデンティティの設定を揃えておく必要がある場合に、この手順を使います。

サイトレプリケーションは [バケットレプリケーション](/ja/administration/data/bucket/replication) とは別です。バケットレプリケーションは、選択したバケットのあいだの、方向を持つルールです。サイトレプリケーションは、RustFS デプロイ全体のあいだに、より広い関係を作ります。

:::warning[復旧は別に計画する]

サイトレプリケーションは非同期です。一方のサイトで書き込みが成功しても、もう一方のサイトが複製されたバージョンをすでに持っていることにはなりません。サイトレプリケーションは、DNS フェイルオーバー、トラフィックの振り分け、アプリケーション復旧のオーケストレーションも提供しません。

:::

## 複製されるリソース

RustFS のサイトレプリケーションは、リンクしたサイトのあいだで次のリソース群を同期します。

- バケットとオブジェクトバージョン（削除マーカーを含む）。
- サイトレプリケーションの処理に必要なバケットメタデータ。
- IAM のユーザー、グループ、ポリシー、ポリシーのマッピング、サービスアカウント。

参加するすべてのサイトで、バケットのバージョニングに対応している必要があります。サイトを追加すると、RustFS がサイト間の関係と、その基礎になるレプリケーションターゲットを設定します。

## 要件

サイトをリンクする前に、次を準備します。

- サイトレプリケーションの Admin API を公開しているリリースで動作する、2 つ以上の独立した RustFS デプロイ。
- 各デプロイに固有で安定した S3 API エンドポイント。
- すべてのサイトエンドポイントのあいだで、S3 API ポート（通常は `9000`）の双方向ネットワーク接続。
- 本番エンドポイント向けの、信頼された TLS 証明書。
- 保護された管理ホスト上の RustFS [`rc`](/ja/operations/rc) クライアント。
- 参加するすべてのサイトの、ルートの管理認証情報。
- すべてのサイトで、互換性のあるバケットバージョニングの対応。

手順を初めて検証するときは、空のテストサイトを使います。既存のサイトをリンクする前に、バケット名、オブジェクトロックの設定、IAM のアイデンティティ、ポリシーを洗い出し、競合がないか確認します。

:::warning[管理用認証情報を保護する]

`add` 操作は、ローカルの `rc` エイリアスストアから、すべてのピアエンドポイントとルート認証情報を解決します。信頼できる管理ホストだけで実行し、ローカルの `rc` 設定へのアクセスを制限し、認証情報をシェルの履歴、ログ、スクリーンショットに残さないでください。

:::

## 1. サイトのエイリアスを設定する

サイトごとにエイリアスを 1 つ設定します。両方のデプロイについて、エンドポイントと認証情報を置き換えます。

```bash
rc alias set site1 https://site1.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias set site2 https://site2.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

両方のサイトに到達でき、準備完了であることを確認します。

```bash
rc ready site1
rc ready site2
rc admin info cluster site1
rc admin info cluster site2
```

本番では HTTPS のエンドポイントを使います。サイトがプライベート認証局を使う場合は、先にその認証局を管理ホストの信頼ストアへインストールします。

:::warning[ループバックのエンドポイントはテスト専用]

RustFS は、送信リクエストのセキュリティ制御として、既定でループバックのレプリケーションターゲットを拒否します。サーバーオプション `RUSTFS_REPLICATION_ALLOW_LOOPBACK_TARGET=true` は、単一ホストでの開発と自動テストのためだけに存在します。本番では有効にしないでください。

:::

## 2. サイトをリンクする

参加するエイリアスを、すべて 1 つのコマンドで指定します。管理リクエストを受け取るのは、最初のエイリアスです。

```bash
rc admin replicate add site1 site2
```

3 サイト以上の関係を作る場合は、最初のコマンドにすべてのエイリアスを含めます。

```bash
rc admin replicate add site1 site2 site3
```

同じマルチサイトの関係を、ペアごとの `add` を別々に実行して作らないでください。

結果の設定を、少なくとも 2 つのサイトから確認します。

```bash
rc admin replicate info site1
rc admin replicate info site2
```

出力は、リンクされた各デプロイを、デプロイ ID、サイト名、エンドポイントで識別します。edit と resync は、デプロイ ID の完全一致、または一意な名前の完全一致でサイトを選べます。デプロイ ID を保存します。

## 3. レプリケーションの状態を確認する

既定のバケットと IAM の概要を要求します。

```bash
rc admin replicate status site1
```

問題を調査するときは、特定の状態セクションを選びます。

```bash
rc admin replicate status site1 --buckets
rc admin replicate status site1 --users --groups --policies
rc admin replicate status site1 --metrics
```

各サイトから状態を確認します。`site1` からの正常な応答が示すのは、そのサイトから見た関係です。ほかのデプロイの確認に代わるものではありません。

## 4. データと IAM のレプリケーションを検証する

最初のサイトで、テスト用のバケットとオブジェクトを作成します。

```bash
rc bucket create site1/my-bucket
printf 'hello rustfs\n' > hello.txt
rc object copy hello.txt site1/my-bucket/hello.txt
```

オブジェクトが現れるまで、2 番目のサイトをポーリングします。

```bash
rc object stat site2/my-bucket/hello.txt
rc object copy site2/my-bucket/hello.txt ./hello-from-site2.txt
```

データパスを検証済みと見なす前に、ダウンロードした内容を比較します。

```bash
cmp hello.txt hello-from-site2.txt
```

IAM の検証では、一方のサイトで一時ユーザーを作成してテストポリシーを付与し、もう一方のサイトでユーザーとポリシーのマッピングを確認します。検証後に、一時アイデンティティを削除します。

```bash
rc admin user add site1 replication-test <temporary-secret-key>
rc admin policy attach site1 readonly --user replication-test

rc admin user info site2 replication-test
rc admin policy entities site2 --user replication-test

rc admin user rm site1 replication-test
```

ランダムに生成した一時シークレットを使い、アプリケーションや管理者の認証情報は再利用しないでください。

## 5. サイトを編集する

リンクしたサイトの名前、エンドポイント、または TLS の信頼設定が変わるときに `edit` を使います。まず、現在のデプロイ ID と名前を確認します。

```bash
rc admin replicate info site1
```

サイトの名前を変更します。

```bash
rc admin replicate edit site1 \
	--site <deployment-id> \
	--name site2-dr \
	--yes
```

エンドポイントを置き換え、TLS 検証は有効のままにします。

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--endpoint https://site2-dr.example.com:9000 \
	--verify-tls \
	--yes
```

プライベート認証局の場合は、証明書のみの PEM バンドルを指定します。

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--ca-cert ./site2-ca.pem \
	--yes
```

エンドポイントが、システム信頼ストアで信頼される証明書へ移るときは、以前設定したカスタム CA を消去します。

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--clear-ca-cert \
	--verify-tls \
	--yes
```

エンドポイントは、パス、クエリ、フラグメント、埋め込まれた認証情報を含まない HTTP または HTTPS のオリジンである必要があります。`--skip-tls-verify` より、信頼された証明書を使います。

## 6. サイトを再同期する

利用できなかったサイトを修復したあと、または状態確認で複製された状態の欠落が見つかったときに、再同期を使います。対象のピアを 1 つ厳密に指定して、resync を開始します。

```bash
rc admin replicate resync start site1 \
	--site <deployment-id> \
	--yes
```

最後に永続化された resync のスナップショットを読みます。

```bash
rc admin replicate resync status site1 \
	--site <deployment-id>
```

選択した resync をキャンセルするのは、停止すべきだと確認したときだけです。

```bash
rc admin replicate resync cancel site1 \
	--site <deployment-id> \
	--yes
```

:::warning[resync の状態はライブの進捗ではない]

現在の RustFS の resync 状態エンドポイントが返すのは、直近の開始またはキャンセル要求を永続化した結果です。実行中のワーカーは調べず、ライフサイクル状態は unknown と報告されます。開始操作は重なることがあり、キャンセルは冪等ではなく、ネットワークのタイムアウトで変更の結果が不明になることがあります。結果が曖昧なときは、次の変更を発行する前に `replicate info`、`replicate status`、対象データを確認します。

:::

## 7. サイトレプリケーションを解除する

サイトを外すと、レプリケーションの関係が変わります。アプリケーションの切り替えにはならず、キューに入っていたオブジェクトがすべて到着した証明にもなりません。先に状態を確認し、必要なデータを残してから進めます。

名前を指定して、1 つのサイトを外します。

```bash
rc admin replicate remove site1 --site site2-dr
```

1 回の要求で、名前を指定したサイトを複数外すには、`--site` を繰り返します。

```bash
rc admin replicate remove site1 \
	--site site2-dr \
	--site site3
```

サイトレプリケーションの関係をすべて解消します。

```bash
rc admin replicate remove site1 --all
```

残っているデプロイから、結果を確認します。

```bash
rc admin replicate info site1
rc admin replicate status site1
```

## トラブルシューティング

### ピアのエンドポイントが拒否される

エンドポイントが到達可能な HTTP または HTTPS のオリジンであり、ループバックへ解決されないことを確認します。本番では、各サイトを安定したネットワークアドレスで到達できるようにし、ループバックの上書きは無効のままにします。

### TLS 検証が失敗する

エンドポイント証明書にピアのホスト名が含まれ、発行した認証局が信頼されていることを確認します。プライベート CA のバンドルには `replicate edit --ca-cert` を使います。`--skip-tls-verify` を恒久的な対処にしないでください。

### 変更がタイムアウトする

`add`、`edit`、`resync start`、`resync cancel`、`remove` をすぐには繰り返さないでください。クライアントが応答を失う前に、サーバー側で変更が適用されていることがあります。まず関係とデータを確認します。

```bash
rc admin replicate info site1
rc admin replicate status site1
```

### レプリケーションが遅れる

すべてのデプロイからサイトの状態とメトリクスを確認し、そのあとエンドポイントへの到達性と、ストレージの準備完了を検証します。

```bash
rc admin replicate status site1 --metrics
rc ready site1
rc ready site2
```

アプリケーションの書き込みが、非同期レプリケーションより速くなることがあります。状態を 1 回見ただけで、目標復旧時点（RPO）を判断しないでください。実際のワークロードで遅延を測り、バックログが続く場合はアラートします。

## 次のステップ

- サイト全体の関係ではなく、選択したバケットの方向付きレプリケーションが必要な場合は、[バケットレプリケーション](/ja/administration/data/bucket/replication) を参照してください。
- すべてのサイトで、[クラスターの状態と準備完了](/ja/operations/status-check) を監視します。
- [`rc` コマンドガイド](/ja/operations/rc) を確認し、クライアントを RustFS サーバーのリリースに合わせます。
