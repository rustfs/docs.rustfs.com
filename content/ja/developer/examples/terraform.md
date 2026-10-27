---
title: "Terraform の使用例"
description: "カスタムエンドポイントを指定した AWS プロバイダーを使い、Terraform で RustFS のバケットとオブジェクトを管理します。"
---

[Terraform の AWS プロバイダー](https://registry.terraform.io/providers/hashicorp/aws/latest)は、S3 エンドポイントをサーバーに向け、パススタイルアクセスを有効にすると、RustFS に対して動作します。

## 設定

`http://localhost:9000` を実際のサーバーアドレスに置き換え、独自の[アクセスキー](../../security-compliance/iam/access-token.md)を使います。skip フラグにより、プロバイダーは AWS 専用のメタデータエンドポイントと STS エンドポイントを呼び出しません。

```hcl title="main.tf"
provider "aws" {
  access_key                  = "<your-access-key>"
  secret_key                  = "<your-secret-key>"
  region                      = "us-east-1"
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    s3 = "http://localhost:9000"
  }
}

resource "aws_s3_bucket" "demo" {
  bucket = "my-bucket"
}

resource "aws_s3_object" "hello" {
  bucket = aws_s3_bucket.demo.id
  key    = "hello.txt"
  source = "/path/to/hello.txt"
}
```

## 適用

```bash
terraform init
terraform apply
```

```text
Plan: 2 to add, 0 to change, 0 to destroy.
...
aws_s3_bucket.demo: Creation complete after 0s [id=my-bucket]
aws_s3_object.hello: Creation complete after 0s [id=hello.txt]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

## 次のステップ

アプリケーションを接続するには [SDK の概要](../sdk/index.md)を参照するか、都度実行するコマンドについては [AWS CLI の例](aws-cli.md)を参照します。
