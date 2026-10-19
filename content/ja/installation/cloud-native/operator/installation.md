---
title: インストール
description: Kubernetes を準備し、RustFS Operator をインストールして、Console へ安全にアクセスします。
---

このガイドでは、Helm で Operator をインストールし、デプロイを確認し、Operator の Console をローカルまたは HTTPS で公開します。

## 要件

| コンポーネント | 要件 |
|-----------|-------------|
| Kubernetes | `v1.30` 以降 |
| Helm | `v3.0` 以降 |
| kubectl | Kubernetes クラスターと互換性があること |
| StorageClass | Tenant のストレージ向け動的な PVC プロビジョニング |

アカウントは、CRD、クラスター RBAC、Deployment、Service を作成できる必要があります。インストール前に、対象クラスターを確認します。

```bash
kubectl config current-context
kubectl get storageclass
```

## 1. Operator をインストールする

Helm チャートは、Operator のリポジトリにあります。

```bash
git clone https://github.com/rustfs/operator.git
cd operator

helm upgrade --install rustfs-operator deploy/rustfs-operator/ \
  --namespace rustfs-system \
  --create-namespace
```

一般的な設定は values ファイルに記述します。

```yaml title="values.yaml"
operator:
  replicas: 1
  metrics:
    enabled: true
  tenantMonitor:
    enabled: true
    intervalSeconds: 300
console:
  enabled: true
  service:
    type: ClusterIP
```

`-f values.yaml` でこのファイルを適用します。チャートはこれらの値から `OPERATOR_*` 変数を生成します。`operator.env` の下へ同じ内容を重複して定義してはなりません。

## 2. インストールを確認する

```bash
kubectl -n rustfs-system get pods,services
kubectl get crd tenants.rustfs.com
kubectl -n rustfs-system rollout status deployment/rustfs-operator
kubectl -n rustfs-system rollout status deployment/rustfs-operator-console
```

## 3. Operator の Console にアクセスする

Console はポート `9090` で待ち受けます。有効期間の短いログイントークンを生成します。

```bash
kubectl -n rustfs-system create token rustfs-operator-console --duration=24h
```

Console の Service を作業用マシンへポートフォワードします。

```bash
kubectl -n rustfs-system port-forward \
  svc/rustfs-operator-console 19090:9090
```

`http://127.0.0.1:19090` を開き、ログインフォームへトークンを貼り付けます。リリース名や名前空間が異なる場合は、Helm のインストール時の注記に、ServiceAccount と Service の正確な名前が出力されます。

:::note[ローカルの HTTP アクセス]

ブラウザーが HTTP 上のログインを保持しない場合は、ローカルテストに限り `console.env` で `CONSOLE_COOKIE_SECURE=false` を設定します。HTTPS では、セキュア Cookie を有効のままにする必要があります。

:::

## 4. Console の TLS を設定する

Console の UI と `/api/v1` の両方に、同じ HTTPS ホスト名を使います。TLS 用の Secret を作成するか、cert-manager に作成させてから、Ingress を有効にします。

```yaml title="values.yaml"
console:
  ingress:
    enabled: true
    className: nginx
    annotations:
      cert-manager.io/cluster-issuer: letsencrypt-prod
    hosts:
      - host: console.example.com
        paths:
          - path: /
            pathType: Prefix
    tls:
      - secretName: console-tls
        hosts:
          - console.example.com
```

values ファイルでリリースをアップグレードします。

```bash
helm upgrade rustfs-operator deploy/rustfs-operator/ \
  --namespace rustfs-system \
  -f values.yaml
```

環境に合わせて、Ingress クラス、Issuer、ホスト名を置き換えます。cert-manager をインストールしていない場合は、アップグレードの前に、証明書と秘密鍵で `console-tls` Secret を作成します。

次に、[Tenant を作成](./tenant.md)します。
