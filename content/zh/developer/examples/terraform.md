---
title: "Terraform"
description: "使用指向自定义端点的 AWS provider，通过 Terraform 管理 RustFS 存储桶和对象。"
---

将 [Terraform AWS provider](https://registry.terraform.io/providers/hashicorp/aws/latest) 的 S3 端点指向您的服务器并启用路径样式寻址后，即可与 RustFS 配合使用。

## 配置

请将 `http://localhost:9000` 替换为您的服务器地址，并使用您自己的[访问密钥](../../security-compliance/iam/access-token.md)。这些 skip 标志会阻止 provider 调用仅适用于 AWS 的元数据和 STS 端点：

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

## 应用

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

## 后续步骤

请参阅 [SDK 概述](../sdk/index.md)以连接应用程序，或参阅 [AWS CLI 示例](aws-cli.md)执行临时命令。