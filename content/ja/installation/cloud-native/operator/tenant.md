---
title: マルチテナント
description: 分離された RustFS の Tenant を作成し、その S3 API と Console の Service へアクセスします。
---

`Tenant` は、独立した 1 つの RustFS クラスターを表します。チームまたはワークロードごとに、別々の名前空間、認証情報の Secret、Tenant リソースを使います。

## 1. 名前空間と認証情報を作成する

認証情報がマニフェストに残らないよう、Secret を直接作成します。

```bash
kubectl create namespace storage-a
kubectl -n storage-a create secret generic rustfs-tenant-creds \
  --from-literal=accesskey='<your-access-key>' \
  --from-literal=secretkey='<your-secret-key>'
```

## 2. Tenant を定義する

この開発用の例は、RustFS の Pod を 1 つと `10Gi` の PVC を 1 つ作成します。`standard` は、クラスター内の StorageClass に置き換えます。

```yaml title="tenant.yaml"
apiVersion: rustfs.com/v1alpha1
kind: Tenant
metadata:
  name: tenant-a
  namespace: storage-a
spec:
  image: rustfs/rustfs:1.0.0-beta.10
  credsSecret:
    name: rustfs-tenant-creds
  pools:
    - name: pool-0
      servers: 1
      persistence:
        volumesPerServer: 1
        volumeClaimTemplate:
          storageClassName: standard
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: 10Gi
```

## 3. 適用して確認する

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a get tenant,pods,pvc,svc
kubectl -n storage-a describe tenant tenant-a
```

## 4. RustFS にアクセスする

```bash
kubectl -n storage-a port-forward svc/tenant-a-io 9000:9000
kubectl -n storage-a port-forward svc/tenant-a-console 9001:9001
```

各コマンドは別々のターミナルで実行します。S3 エンドポイントには `http://localhost:9000` を使い、Tenant の Console は `http://localhost:9001` を開きます。

別の Tenant を追加するには、異なる名前空間、Secret、Tenant 名で同じ手順を繰り返します。管理している Tenant をすべて表示します。

```bash
kubectl get tenants --all-namespaces
```

:::warning[本番のトポロジー]

サーバー 1 台の例は評価用です。本番の Tenant には、分散プールのレイアウト、リソース要求、スケジューリング制約、不変のイメージ参照が必要です。

:::
