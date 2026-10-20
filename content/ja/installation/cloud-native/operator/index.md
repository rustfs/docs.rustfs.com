---
title: 概要
description: RustFS Operator が Kubernetes 上の RustFS クラスターをどのように管理するかを説明します。
---

**RustFS Operator** は、Kubernetes の Operator パターンを RustFS クラスターに適用します。StatefulSet、Service、PersistentVolumeClaim（PVC）、設定を手作業で作成する代わりに、必要なストレージクラスターを Kubernetes のカスタムリソースとして宣言します。コントローラーはそのリソースを監視し、実行中のクラスターを宣言した状態へ継続的に調整します。

Operator は、2 つのカスタムリソース定義（CRD）をインストールします。

- `Tenant`（`rustfs.com/v1alpha1`）は 1 つの RustFS クラスターを表します。ストレージプール、認証情報、スケジューリング、トランスポート層セキュリティ（TLS）、キー管理サービス（KMS）の設定を定義します。
- `PolicyBinding`（`sts.rustfs.com/v1alpha1`）は、ワークロードが Operator の Security Token Service（STS）へ一時認証情報を要求するとき、Kubernetes の ServiceAccount を RustFS のポリシーへ対応付けます。

1 つの Operator で、名前空間をまたいで複数の Tenant を管理できます。各 Tenant は、ストレージ、認証情報、S3 と Console の Service、ライフサイクルを独立して持ちます。Operator はプールごとに StatefulSet を 1 つ作成するため、クラスターを作り直さずにプールを追加して容量を増やせます。また、`Ready`、`Progressing`、`Degraded` の Condition と Kubernetes Event を報告し、クラスター監視用にヘルスとメトリクスのエンドポイントを公開します。

同じ API で、小規模なテスト用クラスターと分散デプロイの両方を扱えます。機密の認証情報と KMS の鍵材料は Kubernetes の Secret に置き、バージョン管理する Tenant のマニフェストには Secret の参照だけを記述します。これによりデプロイを繰り返し行え、GitOps のワークフローにも対応できます。マルチテナントの管理、プールの拡張、TLS、暗号化といった日常の運用は、Kubernetes ネイティブのツールで行えます。

## Operator のワークフロー

- [インストール](./installation.md)では、要件、Helm によるインストール、Console へのアクセス、TLS の設定を扱います。
- [マルチテナント](./tenant.md)では、チームやワークロードごとに分離した RustFS クラスターを作成します。
- [ストレージプールの拡張](./pool-expansion.md)では、既存の Tenant にプールを追加してストレージ容量を増やします。
- [KMS 連携](./kms.md)では、暗号化データ向けに、ローカルまたは HashiCorp Vault のキー管理を設定します。

:::warning[プレリリースのソフトウェア]

RustFS Operator は、現在 `v0.1.0` のプレリリースであり、活発に開発されています。アップグレードと Tenant の変更は、まず本番以外のクラスターで検証します。

:::
