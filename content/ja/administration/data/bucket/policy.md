---
title: "バケットポリシー"
description: "S3 API を使い、RustFS のバケットポリシーを作成、適用、確認、検証します。"
---

RustFS のバケットポリシーは、バケットに直接付与する S3 互換のリソースポリシーです。バケットとそのオブジェクトへのアクセスを許可または拒否するために使います。公開ダウンロード向けに、許可範囲を定めた匿名アクセスも含められます。

## 概要

バケットポリシーは、プリンシパル、アクション、リソース、任意の条件に一致する 1 つ以上のステートメントを含みます。RustFS は、ストレージ操作を許可する前に、そのバケットへのリクエストに対してポリシーを評価します。

バケットポリシーと IAM ポリシーは、目的が異なります。

| ポリシーの種類 | 付与先 | 典型的な用途 |
| --- | --- | --- |
| バケットポリシー | バケット | 公開アクセスの許可、リソース単位の制限の追加、または 1 つのバケットへのアクセス認可。 |
| IAM ポリシー | ユーザーまたはグループ | 認証済みアイデンティティが、1 つ以上のリソースに対して実行できる操作の定義。 |

明示的な `Deny` は `Allow` より優先されます。バケット所有者は、バケットポリシーの取得、置換、削除を引き続き実行できます。拒否ステートメントによって、ポリシー管理が恒久的にロックされることはありません。

RustFS は、標準の S3 操作である `PutBucketPolicy`、`GetBucketPolicy`、`GetBucketPolicyStatus`、`DeleteBucketPolicy` を実装しています。

:::warning[公開ポリシー]

`"Principal": "*"` を含むステートメントは、認証なしのアクセスを許可できます。アクションとリソースの範囲はできる限り狭く保ち、本番で使う前に、認証しないリクエストで結果を確認します。

:::

## 設定

### 要件

- ポリシーを適用する前に、対象のバケットを作成します。
- AWS CLI に、RustFS の認証情報とリージョン `us-east-1` を設定します。
- 必要なポリシー管理アクションを許可された認証情報を使います。

再利用する変数を設定します。

```bash
export RUSTFS_ENDPOINT=http://localhost:9000
export BUCKET_NAME=my-bucket
```

ポリシー管理には、次のアクションが必要です。

| 操作 | 必要なアクション |
| --- | --- |
| ポリシーの適用または置換 | `s3:PutBucketPolicy` |
| ポリシーの読み取り | `s3:GetBucketPolicy` |
| 公開状態の読み取り | `s3:GetBucketPolicyStatus` |
| ポリシーの削除 | `s3:DeleteBucketPolicy` |

### ポリシードキュメントの構造

バケットポリシーは、バージョン `2012-10-17` と `Statement` 配列を使います。

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::my-bucket/public/*"]
		}
	]
}
```

バケットの ARN とオブジェクトの ARN は異なります。

| リソース | ARN の形式 | アクションの例 |
| --- | --- | --- |
| バケット | `arn:aws:s3:::my-bucket` | `s3:ListBucket`、`s3:GetBucketLocation` |
| オブジェクト | `arn:aws:s3:::my-bucket/*` | `s3:GetObject`、`s3:PutObject`、`s3:DeleteObject` |

オブジェクト ARN に `arn:aws:s3:::my-bucket/public/*` のようなプレフィックスを使い、バケットの一部へアクセスを限定します。ステートメント形式の全体と、対応している条件演算子は、[ユーザー、グループ、ポリシー](/ja/security-compliance/iam/policies#policy-document-format) を参照します。

### パブリックアクセスブロック

バケットのパブリックアクセスブロック設定で `BlockPublicPolicy` が有効な場合、RustFS は、ワイルドカードのプリンシパルを持つ `Allow` ステートメントを含む新しいポリシーを拒否します。匿名アクセスが意図的である場合を除き、この保護は有効なままにします。

パブリックアクセスブロックは、慎重なポリシー確認の代わりにはなりません。既存の明示的な `Deny` は引き続き許可より優先され、認証済みリクエストは引き続き IAM ポリシーとバケットポリシーに照らして評価されます。

## 使い方

### 公開読み取りポリシーを作成する

`public/` プレフィックスからの匿名ダウンロードだけを許可するポリシーを作成します。

```bash
cat > /tmp/my-bucket-policy.json <<'EOF'
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::my-bucket/public/*"]
		}
	]
}
EOF
```

このポリシーは、匿名でのバケット一覧、アップロード、上書き、削除を許可しません。

### ポリシーを適用する

```bash
aws s3api put-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--policy file:///tmp/my-bucket-policy.json \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

別のポリシーを適用すると、既存のポリシー全体が置き換わります。更新する前に、現在のドキュメントを取得して確認します。ステートメントは自動ではマージされません。

### ポリシーを読み取る

```bash
aws s3api get-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT" \
	--query Policy \
	--output text
```

RustFS は、送信されたポリシー JSON をそのまま保持します。ポリシーが存在しない場合、API は `NoSuchBucketPolicy` を返します。

### 公開状態を確認する

```bash
aws s3api get-bucket-policy-status \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

応答には、概要レベルの公開アクセス状態が含まれます。

```json
{
	"PolicyStatus": {
		"IsPublic": false
	}
}
```

現在の状態確認が検出するのは、匿名のバケット一覧（`s3:ListBucket`）とアップロード（`s3:PutObject`）です。上の `public/` の例のように、オブジェクトのダウンロードだけを公開するポリシーでも、`false` と報告されることがあります。この状態を網羅的なアクセス分析として扱わず、匿名で行う具体的なアクション、オブジェクトのプレフィックス、条件を必ずテストします。

### ポリシーを削除する

```bash
aws s3api delete-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

バケットポリシーを削除しても、取り除かれるのはそのリソースポリシーだけです。ユーザーとグループにアタッチされた IAM ポリシーは変わりません。

## 検証

認証済みの認証情報で、テスト用オブジェクトをアップロードします。

```bash
printf 'hello from RustFS\n' > /tmp/hello.txt

aws s3api put-object \
	--bucket "$BUCKET_NAME" \
	--key public/hello.txt \
	--body /tmp/hello.txt \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

許可されたオブジェクトを、認証情報なしでダウンロードできることを確認します。

```bash
curl --fail-with-body \
	"${RUSTFS_ENDPOINT}/${BUCKET_NAME}/public/hello.txt"
```

次に、許可されたプレフィックスの外にあるオブジェクトが公開されていないことを確認します。

```bash
aws s3api put-object \
	--bucket "$BUCKET_NAME" \
	--key private/hello.txt \
	--body /tmp/hello.txt \
	--endpoint-url "$RUSTFS_ENDPOINT"

curl --fail-with-body \
	"${RUSTFS_ENDPOINT}/${BUCKET_NAME}/private/hello.txt"
```

2 回目の `curl` リクエストは、`AccessDenied` で失敗するはずです。ポリシーに依存する認証済みユーザーの役割も、それぞれテストします。ドキュメントに条件や明示的な拒否ステートメントが含まれる場合は、特に確認します。

## 次のステップ

- [IAM ポリシーを管理する](/ja/security-compliance/iam/policies)
- [認証情報を管理する](/ja/operations/credentials)
- [監査ログを設定する](/ja/security-compliance/audit-logs)
