---
title: "Terraform"
description: "Manage RustFS buckets and objects with Terraform using the AWS provider pointed at a custom endpoint."
---

The [Terraform AWS provider](https://registry.terraform.io/providers/hashicorp/aws/latest) works against RustFS when you point its S3 endpoint at your server and enable path-style addressing.

## Configure

Replace `http://localhost:9000` with your server address and use your own [access keys](../../security-compliance/iam/access-token.md). The skip flags stop the provider from calling AWS-only metadata and STS endpoints:

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

## Apply

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

## Next steps

See the [SDK overview](../sdk/index.md) to connect an application, or the [AWS CLI example](aws-cli.md) for ad-hoc commands.
