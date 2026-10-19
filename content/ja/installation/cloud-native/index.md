---
title: "Kubernetes インストール（Helm）"
description: "公式の Helm チャートを使い、スタンドアロンまたは分散モード、ストレージ容量、プローブ、本番向けの強化、ストレージプールの拡張を含めて、Kubernetes 上に RustFS をデプロイします。"
---

RustFS の公式 Helm チャートは、単一ノードのインスタンス（PVC が 1 つの `Deployment`）、または分散クラスター（複数の Pod と PVC を持つ `StatefulSet`）をデプロイします。このガイドでは、チャートのインストール、デプロイモードの選択、ストレージ容量の適切な設定、チャートが提供する本番向けのオプションを説明します。

**前提条件**

- Kubernetes クラスターと `kubectl` によるアクセス
- Helm 3
- RustFS イメージのバージョン `>= 1.0.0-alpha.69`（チャートの要件）
- 動作するプロビジョナーを備えた StorageClass。チャートのデフォルトは [`local-path`](https://github.com/rancher/local-path-provisioner) です。独自の StorageClass を使う場合は `storageclass.name` を設定します
- このガイドのストレージプール用コマンドを使う前に、管理用ホストへ [`rc`](/ja/operations/rc) をインストールします

チャートは、RustFS のソースリポジトリ内の `helm/rustfs` にあります。

```bash
git clone https://github.com/rustfs/rustfs.git
cd rustfs/helm/rustfs
```

## 1. クイックインストール

専用の名前空間へインストールし、独自の認証情報と実際の使用量に見合うデータサイズを設定します。

```bash
helm install rustfs . \
  --namespace rustfs --create-namespace \
  --set secret.rustfs.access_key=<your-access-key> \
  --set secret.rustfs.secret_key=<your-secret-key> \
  --set storageclass.dataStorageSize=100Gi \
  --set storageclass.logStorageSize=1Gi
```

:::note[チャートはデフォルトの認証情報を拒否します]

デフォルトでは、次のいずれかを満たさない限り、マニフェストの生成に失敗します。

1. `secret.existingSecret` に、管理している Kubernetes の Secret の名前を指定する。
2. `secret.rustfs.access_key` と `secret.rustfs.secret_key` の**両方**に、空でなくデフォルトでもない値を設定する。
3. `secret.allowInsecureDefaults: true` を設定する（ローカル開発のみ）。

これにより、周知のデフォルト認証情報 `rustfsadmin`/`rustfsadmin` での誤ったデプロイを防ぎます。2 つのキーのうち一方だけを設定した場合も拒否されるため、欠けているキーが通知なくデフォルトへ戻ることはありません。

:::

Pod の起動を確認します。

```bash
kubectl -n rustfs get pods -w
```

```text
NAME       READY   STATUS    RESTARTS   AGE
rustfs-0   1/1     Running   0          2m27s
rustfs-1   1/1     Running   0          2m27s
rustfs-2   1/1     Running   0          2m27s
rustfs-3   1/1     Running   0          2m27s
```

## 2. デプロイモードを選ぶ

チャートは、`mode` の値で選ぶ 2 つのモードに対応しています。

| モード | 値 | ワークロード | 構成 |
| --- | --- | --- | --- |
| 分散（**デフォルト**） | `mode.distributed.enabled=true` | StatefulSet | `replicaCount` 個の Pod（`>= 2`、デフォルト `4`）× Pod あたり `drivesPerNode` 個のデータ PVC（`>= 1`。`replicaCount: 4` のときは `4`、それ以外は `1` と推定。デフォルトはドライブ 16 台） |
| スタンドアロン | `mode.standalone.enabled=true`、`mode.distributed.enabled=false` | Deployment | Pod 1 つ、データ PVC 1 つ（シングルノード・シングルディスク） |

- **スタンドアロン**はシングルノード・シングルディスクに相当し、ノードをまたぐイレイジャーコーディングの冗長性はありません。開発、テスト、または基盤のストレージ自身が耐久性を提供する小規模な構成に使います。既存の PVC は `mode.standalone.existingClaim.dataClaim` / `mode.standalone.existingClaim.logsClaim` で再利用できます。
- **分散**は[マルチノード・マルチディスク](../linux/multiple-node-multiple-disk.md)と同様に動作し、オブジェクトは Pod と PVC にまたがってイレイジャーコーディングされます。`replicaCount` は Pod 数（`>= 2`）、`drivesPerNode` は Pod あたりのデータ PVC 数（`>= 1`）を指定し、合計ドライブ数は `replicaCount * drivesPerNode` になります。`drivesPerNode` を未設定（`null`）にすると、`replicaCount` が `4` のときは Pod あたりのデータ PVC を `4` つ（合計 16 ドライブ）、それ以外の `replicaCount`（たとえば Pod 16 台に PVC を 1 つずつ割り当てる `replicaCount: 16`）では Pod あたりのデータ PVC を `1` つと推定します。別の構成にするには `replicaCount` と `drivesPerNode` の両方を明示します（たとえば 8 ドライブにする場合は `replicaCount: 4` と `drivesPerNode: 2`）。

```bash
# Standalone mode
helm install rustfs . -n rustfs --create-namespace \
  --set mode.standalone.enabled=true \
  --set mode.distributed.enabled=false \
  --set secret.rustfs.access_key=<your-access-key> \
  --set secret.rustfs.secret_key=<your-secret-key>
```

## 3. ストレージ容量の設定

PVC のサイズは `storageclass` ブロックで指定します。

```yaml title="values-prod.yaml"
storageclass:
  name: local-path        # your StorageClass
  dataStorageSize: 256Mi  # per data PVC
  logStorageSize: 256Mi   # per logs PVC
```

:::warning[デフォルトの PVC サイズ 256Mi は変更が必要です]

データボリュームとログボリュームについて、チャートの既定サイズは **256Mi** であり、チャートの動作確認に足りるだけです。実際のワークロードでは、インストール時に `storageclass.dataStorageSize`（例: `1Ti`）と `storageclass.logStorageSize`（例: `1Gi`）を設定します。分散モードでは、データサイズは**各**データ PVC（`replicaCount * drivesPerNode`、デフォルトでは PVC 16 個）に適用されます。

:::

`config.rustfs.obs_log_directory` を `""` に設定すると、ログ用 PVC とマウントが完全に無効になります。PVC のカスタムアノテーションは `storageclass.pvcAnnotations.data` / `storageclass.pvcAnnotations.logs` に指定します。

## 4. ヘルスプローブ

チャートは、サーバーのヘルスエンドポイントに合わせ、S3 ポート（9000）の HTTP プローブを標準で含みます。

- **Liveness**（生存確認）: `GET /health`（`livenessProbe.httpGet.path`）。初期遅延は 30 秒、間隔は 5 秒です
- **Readiness**（準備完了）: `GET /health/ready`（`readinessProbe.httpGet.path`）。初期遅延は 10 秒、間隔は 5 秒です

Pod が Service のエンドポイントに追加されるのは、`/health/ready` が `200` を返したあとだけです。分散モードでは、この応答にストレージのクォーラムが満たされている必要があります。しきい値とタイミングは `livenessProbe.*` と `readinessProbe.*` の値で調整できます。

## 5. 本番向けの強化

### PodDisruptionBudget

デフォルトでは無効です。有効にすると、自発的な退避（ノードのドレインやクラスターのアップグレード）で同時に停止する Pod は 1 つまでになります。

```bash
--set pdb.create=true    # pdb.maxUnavailable defaults to 1
```

### アンチアフィニティとトポロジースプレッド

`affinity.podAntiAffinity.enabled` のデフォルトは `true` で、`topologyKey: kubernetes.io/hostname` により Pod を別々のノードへ分散します。ゾーン単位で分散するには `topologySpreadConstraints.enabled` を有効にし、`topologySpreadConstraints.constraints` に制約エントリをそのまま指定します（分散モードの StatefulSet に適用されます）。

### Pod 間の mTLS（cert-manager）

`mtls.enabled=true` にすると、Pod 間のトラフィックが暗号化されます。チャートは、CA、サーバー証明書、クライアント証明書用に、cert-manager の `Issuer` と `Certificate` リソースを生成します。既に運用している Issuer を使う場合は、`mtls.existingIssuerRef.enabled=true` とともに `name`、`kind`（`Issuer` または `ClusterIssuer`）、`group` を指定します。

### Ingress と Gateway API

Ingress はデフォルトで有効です（`ingress.enabled=true`）。`ingress.className: nginx` が設定されています。コントローラーが Traefik の場合は `traefik` にします。チャートは、コントローラーに対応するセッション固定のアノテーションを適用します。ドメインは `ingress.hosts[0].host` で設定します（デフォルトは `example.rustfs.com`）。HTTPS では `ingress.tls.enabled` を有効にし、`--set-file ingress.tls.crt=./tls.crt --set-file ingress.tls.key=./tls.key` で証明書を渡すか、既存の Secret を指定するか（`ingress.tls.existingSecret`）、cert-manager に発行させます（`ingress.tls.certManager.enabled=true`）。

チャートには、アルファ版の [Gateway API](https://gateway-api.sigs.k8s.io/) サポートもあります（`gatewayApi.enabled=true` と `ingress.enabled=false` を併用し、Gateway クラスは Traefik）。`Gateway` と `HTTPRoute` リソースを生成します。

## 6. RustFS へアクセスする

Ingress を使わない場合は、Service をポートフォワードします。

```bash
kubectl -n rustfs port-forward svc/rustfs 9000:9000 9001:9001
```

- S3 API: `http://localhost:9000`
- Console: `http://localhost:9001`

インストール時に設定したアクセスキーとシークレットキーで Console にログインします。Ingress を有効にしている場合は、設定したホストを使います（`kubectl -n rustfs get ing` で確認します）。Service のデフォルトは `ClusterIP` です。`service.type` は `NodePort`（S3 は `service.endpoint.nodePort: 32000`、Console は `service.console.nodePort: 32001`）または `LoadBalancer` に切り替えられます。

## 7. ストレージプールでスケールアウトする

分散モードでは、チャートは複数の**ストレージプール**を実行できます。各プールは独立した StatefulSet であり、それらのドライブがまとまって 1 つのクラスターを構成します。これは、[ストレージプールの拡張](../../operations/scaling/storage-pool-expansion.md)で説明するストレージプールの追加を、チャート上で行う操作に相当します。

既存のデプロイを拡張するには、プールを有効にし、現在の構成をプール 0 として残したうえで、新しい容量を追記します。

```yaml title="values-prod.yaml (pools)"
pools:
  enabled: true
  list:
    - {}                  # pool 0: inherits top-level values and keeps the
                          # existing StatefulSet/pod/PVC names and data
    - replicaCount: 4     # pool 1: new capacity (replicaCount >= 2)
      storageclass:
        dataStorageSize: 10Gi
```

その後、`helm upgrade` で適用します。各エントリでは `replicaCount`（`>= 2`）と `storageclass` ブロックの一方または両方を設定できます。省略したフィールドはトップレベルの値を継承します。トップレベルの `drivesPerNode` を明示すると、そのドライブ数はすべてのプールに適用されます。`drivesPerNode` を未設定（`null`）にすると、チャートは各プールの `replicaCount` からドライブ数を推定します（`replicaCount` が `4` のときは Pod あたり `4` ドライブ、それ以外は Pod あたり `1` ドライブ）。追加のプールは `<fullname>-pool<N>` という名前の StatefulSet として生成されます。すべてのプールは、ヘッドレス Service、メインの Service、設定、認証情報を共有します。

:::warning[プールは追記のみです]

リストのインデックスが StatefulSet 名を決めます。エントリを削除したり、順序を変えたりしてはなりません。リストから除く前に `rc admin decommission` を実行し、データを排出してプールをデコミッションします。

:::

ロールアウト中に想定される動作は、チャートのドキュメントでは次のとおりです。

- **再起動を想定します。** すべてのプールですべての Pod が名前解決できるようになるまで、Pod は再起動します。解決できないピアがあるとサーバーは起動を拒否するため、クラスターが収束するまでにクラッシュループが数回発生することがあります。これは問題ありません。
- **その後にリバランスします。** クラスターが収束したら、`rc admin rebalance start <alias>` を実行して、既存のオブジェクトを新しいプールへ分散します。
- PodDisruptionBudget はすべてのプールに適用されます。デフォルトの `pdb.maxUnavailable: 1` では、クラスター全体で同時に退避できる Pod は最大 1 つです。

:::note

`rc` は RustFS のコマンドラインクライアントです。チャートが説明するストレージプールの操作には、`rc admin pool list`、`expand`、`rebalance`、`decommission` を使います。

:::

## 8. アンインストール

```bash
helm uninstall rustfs -n rustfs
```

:::note

Helm は、StatefulSet の volumeClaimTemplates が作成した PVC を削除しません。データを破棄する場合は、PVC を明示的に削除します（`kubectl -n rustfs delete pvc -l app.kubernetes.io/name=rustfs`）。削除しない場合、同じリリース名で再インストールすると、それらの PVC が再び接続されます。

:::

## 次のステップ

- [ストレージプールの拡張](../../operations/scaling/storage-pool-expansion.md) — クラスターレベルでのストレージプール拡張の仕組み
- [Kubernetes のアップグレード](../../operations/upgrade/kubernetes/index.md) — Helm と Operator で管理するデプロイのアップグレード
- [TLS の設定](../../integration/tls-configured.md) — エンドツーエンドの TLS オプション
