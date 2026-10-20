---
title: "Terraform"
description: "Verwalten Sie RustFS-Buckets und -Objekte mit Terraform, indem Sie den AWS-Provider auf einen benutzerdefinierten Endpunkt richten."
---

Der [Terraform-AWS-Provider](https://registry.terraform.io/providers/hashicorp/aws/latest) arbeitet mit RustFS, wenn Sie seinen S3-Endpunkt auf Ihren Server richten und pfadbasierte Adressierung (Path-Style) aktivieren.

## Konfiguration

Ersetzen Sie `http://localhost:9000` durch Ihre Serveradresse und verwenden Sie Ihre eigenen [Zugriffsschlüssel](../../security-compliance/iam/access-token.md). Die `skip`-Flags verhindern, dass der Provider Metadaten- und STS-Endpunkte aufruft, die es nur bei AWS gibt:

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

## Anwenden

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

## Nächste Schritte

Lesen Sie die [SDK-Übersicht](../sdk/index.md), um eine Anwendung anzubinden, oder das [AWS-CLI-Beispiel](aws-cli.md) für Ad-hoc-Befehle.
