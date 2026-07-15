---
title: "AWS CLI"
description: "Connect the AWS CLI to RustFS and perform basic object operations."
---

The [AWS CLI](https://docs.aws.amazon.com/cli/) is Amazon's official command-line tool for S3, and it works with RustFS via the `--endpoint-url` flag.

## Install

Follow the [official install guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html), or on macOS:

```bash
brew install awscli
```

## Configure

Set your [access keys](../../administration/iam/access-token.md) and region:

```bash
aws configure
```

```text
AWS Access Key ID [None]: <your-access-key>
AWS Secret Access Key [None]: <your-secret-key>
Default region name [None]: us-east-1
Default output format [None]: json
```

Pass your RustFS address with `--endpoint-url` on every command. Replace `http://localhost:9000` with your server address. When `--endpoint-url` is set, the AWS CLI uses path-style addressing, which is what RustFS requires.

:::note
If you did not set credentials at install, the local-test default is `rustfsadmin` / `rustfsadmin` — never use it beyond a throwaway local trial.
:::

## Verify

Create a bucket:

```bash
aws s3 mb s3://my-bucket --endpoint-url http://localhost:9000
```

```text
make_bucket: my-bucket
```

Upload a file:

```bash
aws s3 cp /path/to/hello.txt s3://my-bucket/ --endpoint-url http://localhost:9000
```

```text
upload: ../path/to/hello.txt to s3://my-bucket/hello.txt
```

List the bucket:

```bash
aws s3 ls s3://my-bucket --endpoint-url http://localhost:9000
```

```text
2026-07-15 10:30:00         12 hello.txt
```

## Next steps

Build applications against RustFS with an [S3 SDK](../sdk/index.md), or manage objects with [mc](../mc.md).
