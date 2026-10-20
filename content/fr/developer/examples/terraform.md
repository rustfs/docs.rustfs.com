---
title: "Terraform"
description: "Gérez les compartiments et les objets RustFS avec Terraform, en pointant le fournisseur AWS vers un point de terminaison personnalisé."
---

Le [fournisseur AWS de Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest) fonctionne avec RustFS lorsque vous pointez son point de terminaison S3 vers votre serveur et que vous activez l’adressage de type chemin (path-style).

## Configuration

Remplacez `http://localhost:9000` par l’adresse de votre serveur et utilisez vos propres [clés d’accès](../../security-compliance/iam/access-token.md). Les options d’omission empêchent le fournisseur d’appeler les points de terminaison de métadonnées et STS propres à AWS :

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

## Application

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

## Étapes suivantes

Consultez la [présentation des SDK](../sdk/index.md) pour connecter une application, ou l’[exemple AWS CLI](aws-cli.md) pour des commandes ponctuelles.
