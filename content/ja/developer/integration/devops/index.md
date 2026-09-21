---
title: "DevOps"
description: "S3 互換オブジェクトストレージインターフェースを経由して、DevOps プラットフォームとインフラストラクチャツールを RustFS に接続します。"
---

S3 互換エンドポイントをサポートする DevOps プラットフォームおよびインフラストラクチャツールのオブジェクトストレージ層として **RustFS** を使用します。

## プラットフォームとツール

- [Elasticsearch](./elasticsearch.md)
- [Gitea](./gitea.md)
- [Terraform](./terraform.md)

アーティファクト、ステート、テレメトリデータは専用バケットに保存し、必要なバケット操作のみに権限が絞られた認証情報を使用してください。
