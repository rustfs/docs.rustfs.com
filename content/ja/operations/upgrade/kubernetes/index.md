---
title: "Kubernetes"
description: "Helm チャートまたは RustFS Operator で管理する RustFS デプロイをアップグレードし、各ロールアウトを確認します。"
---

リソースを所有するツールを通じて、Kubernetes のデプロイをアップグレードします。RustFS の Helm チャートを直接インストールしている場合は、Helm を使います。Operator でインストールしている場合は、Operator のリリースと各テナントを、それぞれの宣言的な設定を通じてアップグレードします。

## アップグレードの前に

そのデプロイに関係する RustFS、チャート、Operator のリリースノートを読みます。Pod の置き換えに足りる容量がクラスターにあり、現在のワークロードがすべて準備完了であることを確認します。

```bash
kubectl get nodes
kubectl -n <namespace> get pods,pvc
```

アップグレード中とロールバック中は、PersistentVolumeClaim（PVC）を削除してはいけません。イメージタグ、ストレージのトポロジー、スケジューリングルール、Secret の参照を含め、既存のデプロイの値とマニフェストはバージョン管理に残します。

## Helm チャートのデプロイをアップグレードする

この手順は、[RustFS Helm チャート](/ja/installation/cloud-native/helm-chart/installation) で直接インストールした RustFS に適用します。RustFS Operator が作成したテナントには適用しません。

現在のリリースリビジョン、チャートのバージョン、アプリケーションのバージョン、現在有効なユーザー指定値を記録します。

```bash
helm status rustfs --namespace rustfs
helm history rustfs --namespace rustfs
helm get values rustfs --namespace rustfs -o yaml > rustfs-values.previous.yaml
```

対象チャートは、インストール時と同じ方法で準備します。チャートリポジトリを使う場合は、インデックスを更新し、チャートの参照先を設定します。

```bash
helm repo update rustfs
export RUSTFS_CHART=rustfs/rustfs
```

ソースのチェックアウトを使う場合は、対象の RustFS リリースをチェックアウトし、`RUSTFS_CHART` をそのチャートディレクトリに向けます。

```bash
export RUSTFS_CHART=./helm/rustfs
```

リリース固有の変更があれば、管理している値ファイルを更新します。`image.rustfs.tag` を、実行する RustFS の明示的なバージョンに設定し、アップグレードを適用します。

```bash
helm upgrade rustfs "$RUSTFS_CHART" \
	--namespace rustfs \
	-f <values-file> \
	--set-string image.rustfs.tag=<target-version> \
	--wait \
	--timeout 10m
```

Helm はローリングアップデートを実行します。ロールアウトが完了するまで、リリースと Pod を監視します。

```bash
helm status rustfs --namespace rustfs
kubectl -n rustfs get pods,pvc,services
```

分散モードでは、StatefulSet が作成されます。

```bash
kubectl -n rustfs rollout status statefulset/rustfs --timeout=10m
```

スタンドアロンモードでは、Deployment が作成されます。

```bash
kubectl -n rustfs rollout status deployment/rustfs --timeout=10m
```

ロールアウトのあと、S3 API を確認します。S3 API をクラスターの外部へ公開していない場合は、先にインストールガイドに記載されたポートフォワードを開始します。

```bash
curl -fsS http://localhost:9000/health/ready
```

### Helm リリースをロールバックする

リリース履歴を一覧し、最後に正常だったリビジョンを特定します。チャート、値、イメージ設定は Helm に復元させます。

```bash
helm history rustfs --namespace rustfs
helm rollback rustfs <previous-revision> \
	--namespace rustfs \
	--wait \
	--timeout 10m
```

ロールバックのあと、ワークロードと準備完了エンドポイントを再度確認します。リリースをアンインストールしたり、その PVC を削除したりしてはいけません。

## Operator のデプロイをアップグレードする

Operator のデプロイには、互いに独立した 2 つのアップグレード対象があります。

- RustFS Operator と Operator Console は、`rustfs-operator` の Helm リリースで動作します。
- 各テナントは、そのテナントの `spec.image` フィールドで宣言された RustFS イメージを実行します。

テナントのイメージを変える前に、Operator のコントロールプレーンをアップグレードし、検証します。1 回のメンテナンス作業で、Operator のアップグレードと複数のテナントのアップグレードを同時に行ってはいけません。

### Operator のリリースをアップグレードする

現在のリリースを記録し、その値を保存します。

```bash
helm status rustfs-operator --namespace rustfs-system
helm history rustfs-operator --namespace rustfs-system
helm get values rustfs-operator --namespace rustfs-system -o yaml \
	> rustfs-operator-values.previous.yaml
```

Operator のソースチェックアウトを対象リリースへ更新し、チャートの値と CustomResourceDefinition（CRD）の変更点を確認します。Helm は、チャートの `crds/` ディレクトリに置かれた CRD をアップグレードしません。コントローラーをアップグレードする前に、対象の 2 つの CRD をどちらも適用します。

```bash
kubectl apply --server-side --force-conflicts \
	--field-manager=rustfs-operator-crd-upgrade \
	-f deploy/rustfs-operator/crds/tenant.yaml
kubectl apply --server-side --force-conflicts \
	--field-manager=rustfs-operator-crd-upgrade \
	-f deploy/rustfs-operator/crds/policybinding-crd.yaml
```

これらの CRD はクラスタースコープであり、すべてのテナントの Namespace で共有されます。先に適用すると、Kubernetes API サーバーは、新しいコントローラーが導入するフィールドを受け付けられるようになります。両方のコマンドが成功したら、管理している値ファイルで Operator をアップグレードします。

```bash
helm upgrade rustfs-operator deploy/rustfs-operator/ \
	--namespace rustfs-system \
	-f <operator-values-file> \
	--set-string operator.image.tag=<target-operator-version> \
	--set-string console.image.tag=<target-operator-version> \
	--wait \
	--timeout 10m
```

テナントをアップグレードする前に、CRD とコントロールプレーンの全コンポーネントを確認します。

```bash
kubectl get crd tenants.rustfs.com
kubectl -n rustfs-system rollout status deployment/rustfs-operator --timeout=10m
kubectl -n rustfs-system rollout status deployment/rustfs-operator-console --timeout=10m
kubectl get tenants --all-namespaces
```

CRD の変更は Helm のリリース履歴に含まれません。`helm rollback` でも復元されません。コントローラーのロールバックを検討する前に、対象リリースの互換性と移行に関する注記を確認します。そのリリースがダウングレードを明示的にサポートしている場合は、古い CRD ファイルは適用せず、以前の Helm リビジョンを復元します。

```bash
helm history rustfs-operator --namespace rustfs-system
helm rollback rustfs-operator <previous-revision> \
	--namespace rustfs-system \
	--wait \
	--timeout 10m
```

文書で一方向とされているワークロード移行、またはセキュリティ移行を越えてダウングレードしてはいけません。修正を含む Operator リリースへロールフォワードします。

### テナントをアップグレードする

各テナントの StatefulSet は、Operator が所有します。コンテナのイメージを直接変更しません。調整処理が、テナントで宣言されたイメージを復元します。

現在のテナントイメージを記録し、`Ready` 条件を確認します。

```bash
kubectl -n storage-a get tenant tenant-a \
	-o jsonpath='{.spec.image}{"\n"}'
kubectl -n storage-a get tenant tenant-a
kubectl -n storage-a get pods,pvc -l rustfs.tenant=tenant-a
```

テナントのインストールに使った完全な `tenant.yaml` では、`spec.image` だけを `rustfs/rustfs:<target-version>` に変更します。プール、PVC テンプレート、認証情報、その他の設定は変更しません。完全なマニフェストを適用し、Operator が新しい世代を調整するまで待ちます。

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a wait tenant/tenant-a \
	--for=condition=Ready \
	--timeout=10m
kubectl -n storage-a get pods -l rustfs.tenant=tenant-a
```

テナントは 1 つずつアップグレードします。別のテナントを更新する前に、その S3 API と [クラスターの状態](/ja/operations/status-check) を確認します。

### テナントをロールバックする

以前に記録したイメージを `spec.image` に戻し、完全なテナントのマニフェストを適用して、再び `Ready` になるまで待ちます。

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a wait tenant/tenant-a \
	--for=condition=Ready \
	--timeout=10m
```

Operator は、テナントの既存 PVC を再利用します。ロールバック中に、テナント、その StatefulSet、その PVC を削除してはいけません。

## 次のステップ

ロールアウト後にデプロイを検証するには、[状態の確認](/ja/operations/status-check) と [オブザーバビリティ](/ja/operations/observability) を参照します。
