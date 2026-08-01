# Japanese localization reference

Use this reference for `content/ja`. Write natural Japanese technical documentation instead of preserving English sentence structure.

## Authoritative sources

Use current official Japanese documentation to confirm ecosystem terminology:

- [Amazon S3 User Guide](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/Welcome.html)
- [Amazon S3 bucket restrictions](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/BucketRestrictions.html)
- [Amazon S3 Object Lock](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/object-lock-managing.html)
- [Kubernetes documentation](https://kubernetes.io/ja/docs/)

Treat RustFS source code, APIs, and exact Console labels as authoritative for product-specific names.

## Voice and grammar

- Use consistent professional `です・ます` style for explanatory prose and instructions.
- Omit unnecessary subjects and second-person pronouns when Japanese is clearer without them.
- Reorder clauses for natural Japanese; do not mirror English word order.
- Use Japanese punctuation in prose while preserving ASCII punctuation in code, URLs, identifiers, and syntax.
- Use established AWS and infrastructure katakana terminology, but avoid unnecessary katakana when a standard Japanese technical term is clearer.
- Avoid repeatedly ending adjacent steps with `してください`; prefer direct, concise action descriptions.
- Avoid casual slang, promotional wording, and unjustified claims of seamless replacement.
- Keep the exact English Console label in bold when the reader must locate it; add a Japanese explanation in parentheses on first use when useful.

## Preferred terminology

| English source | Preferred Japanese prose | Guidance |
|---|---|---|
| RustFS | RustFS | Never alter the product name. |
| Amazon S3 / S3 | Amazon S3 / S3 | Keep the service and protocol name. |
| S3-compatible | S3 互換 | Never strengthen to complete or 100% compatibility. |
| object storage | オブジェクトストレージ | Use for the storage model. |
| Bucket | バケット / S3 バケット | Preserve `Bucket` in APIs, identifiers, and exact UI labels. |
| Object | オブジェクト / S3 オブジェクト | Distinguish it from a local `ファイル`. |
| object key | オブジェクトキー | Use `キー名` when specifically describing the key name; preserve `Key` in APIs. |
| Bucket policy | バケットポリシー | Preserve policy JSON and API names. |
| access key ID | アクセスキー ID | Preserve `AccessKeyId` and environment variables. |
| secret access key | シークレットアクセスキー | Preserve `SecretAccessKey` and placeholders. |
| endpoint | エンドポイント | Qualify as `S3 API エンドポイント` when ambiguous. |
| Region | リージョン / AWS リージョン | Preserve values such as `us-east-1`. |
| Console | Console | Treat as the RustFS product surface; use `管理画面` only as an explanation. |
| storage pool | ストレージプール | Distinguish it from an application connection pool. |
| erasure coding | イレイジャーコーディング | Explain once when required; preserve `EC:n`. |
| healing | データ修復 | Preserve exact UI, API, and metric names that contain `heal` or `healing`. |
| rebalancing | リバランス | Preserve exact Console action names. |
| decommission | デコミッション / 使用停止 | Explain that data is drained before the pool is deactivated. |
| replication | レプリケーション | Qualify as `バケットレプリケーション` or `サイトレプリケーション`. |
| versioning | バージョニング | Use for S3 Object versions, not source control. |
| Object Lock | オブジェクトロック | Preserve exact API and Console labels. |
| legal hold | リーガルホールド | Preserve API identifiers such as `ObjectLockLegalHold`. |
| lifecycle management | ライフサイクル管理 | Use for S3 lifecycle rules. |
| multipart upload | マルチパートアップロード | Preserve API actions such as `CreateMultipartUpload`. |
| server-side encryption | サーバー側の暗号化 | Keep SSE-S3, SSE-KMS, and SSE-C unchanged. |
| presigned URL | 署名付き URL | Keep URL uppercase and preserve API names. |
| path-style addressing | パス形式のアドレス指定 | Preserve SDK option names. |
| virtual-hosted-style addressing | 仮想ホスト形式のアドレス指定 | Relate it to `RUSTFS_SERVER_DOMAINS` when relevant. |
| health check | ヘルスチェック | Preserve endpoint paths and probe names. |
| readiness | Readiness / 準備完了状態 | Preserve `/health/ready` and Kubernetes field names. |
| observability | オブザーバビリティ | Keep OpenTelemetry and OTLP unchanged. |
| rootless | root 権限なし | Prefer this over an unnatural literal translation. |
| root credentials | ルート認証情報 | Distinguish RustFS deployment credentials from the operating-system root account. |

## Common review failures

- Reject unchanged English paragraphs, descriptions, headings, and navigation labels.
- Reject `S3 と 100% 互換`, `完全互換`, or an unverified `ドロップイン代替` claim.
- Do not translate API operations, environment variables, UI labels, or command output.
- Do not alternate arbitrarily between `バケット` and improvised Japanese equivalents.
- Do not translate an S3 Object as `ファイル` unless the source explicitly means a local file.
