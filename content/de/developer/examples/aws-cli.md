---
title: "AWS CLI"
description: "Verbinden Sie die AWS CLI mit RustFS und führen Sie grundlegende Objektoperationen aus."
---

Die [AWS CLI](https://docs.aws.amazon.com/cli/) ist das offizielle Befehlszeilenwerkzeug von Amazon für S3 und funktioniert mit RustFS über das Flag `--endpoint-url`.

## Installation

Folgen Sie der [offiziellen Installationsanleitung](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html). Unter macOS:

```bash
brew install awscli
```

## Konfiguration

Setzen Sie Ihre [Zugriffsschlüssel](../../security-compliance/iam/access-token.md) und die Region:

```bash
aws configure
```

```text
AWS Access Key ID [None]: <your-access-key>
AWS Secret Access Key [None]: <your-secret-key>
Default region name [None]: us-east-1
Default output format [None]: json
```

Übergeben Sie bei jedem Befehl die RustFS-Adresse mit `--endpoint-url`. Ersetzen Sie `http://localhost:9000` durch Ihre Serveradresse. Wenn `--endpoint-url` gesetzt ist, verwendet die AWS CLI pfadbasierte Adressierung (Path-Style). Das ist die Adressierung, die RustFS erwartet.

:::note

Wenn Sie bei der Installation keine Anmeldedaten gesetzt haben, lautet der Standard für lokale Tests `rustfsadmin` / `rustfsadmin`. Verwenden Sie ihn niemals außerhalb eines wegwerfbaren lokalen Tests.

:::

## Überprüfung

Erstellen Sie einen Bucket:

```bash
aws s3 mb s3://my-bucket --endpoint-url http://localhost:9000
```

```text
make_bucket: my-bucket
```

Laden Sie eine Datei hoch:

```bash
aws s3 cp /path/to/hello.txt s3://my-bucket/ --endpoint-url http://localhost:9000
```

```text
upload: ../path/to/hello.txt to s3://my-bucket/hello.txt
```

Listen Sie den Bucket auf:

```bash
aws s3 ls s3://my-bucket --endpoint-url http://localhost:9000
```

```text
2026-07-15 10:30:00         12 hello.txt
```

## Nächste Schritte

Schreiben Sie Anwendungen, die RustFS verwenden, mit einem [S3-SDK](../sdk/index.md), oder verwalten Sie Objekte mit [`rc`](/de/operations/rc).
