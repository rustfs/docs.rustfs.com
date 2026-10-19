---
title: 概要
description: RustFS の Helm チャートが、Kubernetes 上のスタンドアロンおよび分散クラスターをどのようにデプロイするかを説明します。
---

公式の **RustFS Helm チャート**は、1 つの RustFS クラスターを Kubernetes へ直接デプロイします。Helm は、1 つの values ファイルから、ワークロード、Service、認証情報、設定、PersistentVolumeClaim（PVC）、Ingress、任意の証明書リソースを生成します。

チャートは 2 つのデプロイモードに対応しています。

- **スタンドアロン**は、データ PVC を 1 つ持つ Pod を 1 つ作成します。評価と開発に使います。
- **分散**は、複数の Pod とデータ PVC を持つ StatefulSet を作成します。`replicaCount` は Pod 数を、`drivesPerNode` は各 Pod がマウントするデータ PVC の数を制御します。

分散モードはデフォルトで有効です。チャートは、追記のみのストレージプールを複数持つ構成にも対応していますが、初期のデプロイでは、明示した単一のトポロジーの方が運用しやすいです。認証情報は、チャートの値または既存の Secret で指定する必要があります。安全でない開発用のデフォルトを明示的に有効にしない限り、チャートは空の値と周知のデフォルト認証情報を拒否します。

1 つの RustFS クラスターを Helm で管理する場合は、Helm チャートを使います。Kubernetes のカスタムリソース、複数の Tenant、Operator によるプール管理が必要な場合は、[RustFS Operator](../operator/index.md) を使います。

## Helm チャートのワークフロー

- [インストール](./installation.mdx)では、要件と、スタンドアロンまたは分散でのデプロイを扱います。
- [mTLS](./mtls.md)では、RustFS の Pod 間トラフィックを暗号化し、認証します。
- [cert-manager](./cert-manager.md)では、RustFS の Ingress と mTLS 向けの証明書を発行し、更新します。
