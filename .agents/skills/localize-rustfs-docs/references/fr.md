# French localization reference

Use this reference for `content/fr`. Write professional infrastructure documentation in natural French rather than reproducing English syntax.

## Authoritative sources

Use current official French documentation to confirm ecosystem terminology:

- [Amazon S3 User Guide](https://docs.aws.amazon.com/fr_fr/AmazonS3/latest/userguide/Welcome.html)
- [Amazon S3 multipart uploads](https://docs.aws.amazon.com/fr_fr/AmazonS3/latest/userguide/mpuoverview.html)
- [Amazon S3 Object Lock](https://docs.aws.amazon.com/fr_fr/AmazonS3/latest/userguide/object-lock.html)
- [Kubernetes documentation](https://kubernetes.io/fr/docs/)

Treat RustFS source code, APIs, and exact Console labels as authoritative for product-specific names.

## Voice and grammar

- Address the reader with `vous`; use concise active instructions.
- Prefer natural French clause order and avoid calques from English noun strings.
- Use sentence-style capitalization for headings.
- Apply French punctuation and non-breaking spacing where practical without damaging Markdown, URLs, code, or identifiers.
- Keep grammatical gender and number consistent across headings, prose, tables, and navigation.
- Retain established English ecosystem terms only when they are conventional in French technical writing.
- Avoid casual slang, promotional wording, and unjustified claims of seamless replacement.
- Keep the exact English Console label in bold when the reader must locate it; add a French explanation in parentheses on first use when useful.

## Preferred terminology

| English source | Preferred French prose | Guidance |
|---|---|---|
| RustFS | RustFS | Never alter the product name. |
| Amazon S3 / S3 | Amazon S3 / S3 | Keep the service and protocol name. |
| S3-compatible | compatible avec S3 | Never strengthen to complete or 100% compatibility. |
| object storage | stockage objet | Use for the storage model. |
| Bucket | compartiment / compartiment S3 | Preserve `Bucket` in APIs, identifiers, and exact UI labels. |
| Object | objet / objet S3 | Distinguish it from a local `fichier`. |
| object key | clé d’objet | Use `nom de clé` when specifically describing the key name; preserve `Key` in APIs. |
| Bucket policy | politique de compartiment | Preserve policy JSON and API names. |
| access key ID | ID de clé d’accès | Preserve `AccessKeyId` and environment variables. |
| secret access key | clé d’accès secrète | Preserve `SecretAccessKey` and placeholders. |
| endpoint | point de terminaison | Qualify as `point de terminaison de l’API S3` when ambiguous. |
| Region | Région / Région AWS | Preserve values such as `us-east-1`. |
| Console | Console | Treat as the RustFS product surface; use `interface web` only as an explanation. |
| storage pool | pool de stockage | Use consistently; avoid translating it as an application connection pool. |
| erasure coding | codage d’effacement | Explain once when required; preserve `EC:n`. |
| healing | réparation des données | Preserve exact UI, API, and metric names that contain `heal` or `healing`. |
| rebalancing | rééquilibrage | Preserve exact Console action names. |
| decommission | mise hors service | Explain that data is drained before the pool is deactivated. |
| replication | réplication | Qualify as `réplication de compartiment` or `réplication de site`. |
| versioning | gestion des versions | Use for S3 Object versions, not source control. |
| Object Lock | verrouillage d’objet | Preserve exact API and Console labels. |
| legal hold | conservation légale | Preserve API identifiers such as `ObjectLockLegalHold`. |
| lifecycle management | gestion du cycle de vie | Use for S3 lifecycle rules. |
| multipart upload | chargement partitionné | Preserve API actions such as `CreateMultipartUpload`. |
| server-side encryption | chiffrement côté serveur | Keep SSE-S3, SSE-KMS, and SSE-C unchanged. |
| presigned URL | URL présignée | Keep URL uppercase and preserve API names. |
| path-style addressing | adressage de type chemin | Preserve SDK option names. |
| virtual-hosted-style addressing | adressage de type hôte virtuel | Relate it to `RUSTFS_SERVER_DOMAINS` when relevant. |
| health check | contrôle d’intégrité | Preserve endpoint paths and probe names. |
| readiness | état de préparation | Preserve `/health/ready` and Kubernetes field names. |
| observability | observabilité | Keep OpenTelemetry and OTLP unchanged. |
| rootless | sans privilèges root | Prefer this over a literal calque. |
| root credentials | informations d’identification racine | Distinguish RustFS deployment credentials from the operating-system root account. |

## Common review failures

- Reject unchanged English paragraphs, descriptions, headings, and navigation labels.
- Reject `compatible à 100 % avec S3`, `entièrement compatible`, or an unverified `remplacement transparent` claim.
- Do not translate API operations, environment variables, UI labels, or command output.
- Do not alternate arbitrarily between `compartiment`, `bucket`, and `conteneur` in explanatory prose.
- Do not translate an S3 Object as `fichier` unless the source explicitly means a local file.
