# German localization reference

Use this reference for `content/de`. Prefer natural, precise infrastructure documentation over literal translation.

## Authoritative sources

Use current official German documentation to confirm ecosystem terminology:

- [Amazon S3 User Guide](https://docs.aws.amazon.com/de_de/AmazonS3/latest/userguide/Welcome.html)
- [Amazon S3 uploads](https://docs.aws.amazon.com/de_de/AmazonS3/latest/userguide/upload-objects.html)
- [Amazon S3 Bucket policies](https://docs.aws.amazon.com/de_de/AmazonS3/latest/userguide/bucket-policies.html)
- [Kubernetes documentation](https://kubernetes.io/de/docs/)

Treat RustFS source code, APIs, and exact Console labels as authoritative for product-specific names.

## Voice and grammar

- Address the reader formally with `Sie` when direct address improves clarity.
- Use concise active instructions such as `Führen Sie ... aus` and `Öffnen Sie ...`.
- Apply standard German noun capitalization and form readable technical compounds.
- Use sentence-style capitalization for headings while respecting German noun rules.
- Prefer established German infrastructure usage; retain an English term only when German developers normally use it or no stable German term exists.
- Avoid casual slang, exaggerated claims, and English sentence structure copied into German.
- Keep the exact English Console label in bold when the reader must locate it; add a German explanation in parentheses on first use when useful.

## Preferred terminology

| English source | Preferred German prose | Guidance |
|---|---|---|
| RustFS | RustFS | Never alter the product name. |
| Amazon S3 / S3 | Amazon S3 / S3 | Keep the service and protocol name. |
| S3-compatible | S3-kompatibel | Never strengthen to complete or 100% compatibility. |
| object storage | Objektspeicher | Use for the storage model. |
| Bucket | Bucket / S3-Bucket | Follow established German AWS usage; preserve `Bucket` in identifiers and UI labels. |
| Object | Objekt / S3-Objekt | Distinguish it from a local `Datei`. |
| object key | Objektschlüssel | Use `Schlüsselname` when specifically describing the key name; preserve `Key` in APIs. |
| Bucket policy | Bucket-Richtlinie | Preserve policy JSON and API names. |
| access key ID | Zugriffsschlüssel-ID | Preserve `AccessKeyId` and environment variables. |
| secret access key | geheimer Zugriffsschlüssel | Preserve `SecretAccessKey` and placeholders. |
| endpoint | Endpunkt | Qualify as `S3-API-Endpunkt` when ambiguous. |
| Region | Region / AWS-Region | Preserve values such as `us-east-1`. |
| Console | Console | Treat as the RustFS product surface; use `Weboberfläche` only as an explanation. |
| storage pool | Speicherpool | Do not shorten to `Pool` when storage meaning is unclear. |
| erasure coding | Erasure Coding | Explain once as a redundancy scheme when the audience needs it; preserve `EC:n`. |
| healing | Datenwiederherstellung / Healing | Use one term consistently within an operational workflow; preserve exact UI and metric names. |
| rebalancing | Rebalancing / Neuverteilung | Preserve the RustFS operation name when it maps to a Console action. |
| decommission | Außerbetriebnahme | Explain that data is drained before the storage pool is deactivated. |
| replication | Replikation | Qualify as `Bucket-Replikation` or `Site-Replikation`. |
| versioning | Versionierung | Use for S3 Object versions, not source control. |
| Object Lock | Object Lock / Objektsperre | Preserve exact API and Console labels. |
| legal hold | Legal Hold | Preserve API/UI wording; explain the retention effect in German. |
| lifecycle management | Lebenszyklusverwaltung | Use for S3 lifecycle rules. |
| multipart upload | mehrteiliger Upload | Preserve API actions such as `CreateMultipartUpload`. |
| server-side encryption | serverseitige Verschlüsselung | Keep SSE-S3, SSE-KMS, and SSE-C unchanged. |
| presigned URL | vorsignierte URL | Keep URL uppercase and preserve API names. |
| path-style addressing | pfadbasierte Adressierung | Preserve SDK option names. |
| virtual-hosted-style addressing | Adressierung im Virtual-Hosted-Stil | Relate it to `RUSTFS_SERVER_DOMAINS` when relevant. |
| health check | Integritätsprüfung | Preserve endpoint paths and probe names. |
| readiness | Bereitschaft | Preserve `/health/ready` and Kubernetes field names. |
| observability | Observability / Beobachtbarkeit | Prefer the established term used by the surrounding German ecosystem documentation and keep it consistent. |
| rootless | ohne Root-Rechte | Prefer this over a literal calque. |
| root credentials | Root-Anmeldedaten | Distinguish RustFS deployment credentials from the operating-system root account. |

## Common review failures

- Reject unchanged English paragraphs, descriptions, headings, and navigation labels.
- Reject `100 % S3-kompatibel`, `vollständig S3-kompatibel`, or an unverified `Drop-in-Ersatz` claim.
- Do not translate API operations, environment variables, UI labels, or command output.
- Do not alternate arbitrarily between `Bucket`, `Speicher-Bucket`, and `Speicherbehälter`.
- Do not translate an S3 Object as `Datei` unless the source explicitly means a local file.
