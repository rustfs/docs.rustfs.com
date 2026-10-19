---
title: ストレージプールの拡張
description: ストレージプールを追加して、RustFS の Tenant のストレージ容量を増やします。
---

Tenant 内のすべてのプールは、1 つの RustFS クラスターを構成します。容量を増やすには `spec.pools` へ新しいプールを追加します。既存のプールの構成は変更しません。

:::warning[既存のプールは不変です]

既存のプールの `servers` と `persistence.volumesPerServer` は変更してはなりません。Operator は、プールごとに不変の StatefulSet を作成します。

:::

## 1. Tenant を確認する

```bash
kubectl -n storage-a get tenant tenant-a
kubectl -n storage-a get pods,pvc -l rustfs.tenant=tenant-a
```

Tenant が `Ready` であり、クラスターに十分な計算資源とストレージ容量があることを確認します。

## 2. プールを追加する

`tenant.yaml` にある既存の `spec.pools` リストの末尾に、次のエントリを追加します。既存のエントリはすべてそのままにします。

```yaml title="tenant.yaml"
- name: pool-1
  servers: 2
  persistence:
    volumesPerServer: 2
    volumeClaimTemplate:
      storageClassName: standard
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 100Gi
```

このプールは PVC を 4 つ作成します。サーバー 2 台 × サーバーあたりのボリューム 2 つです。Tenant マニフェスト全体を適用します。

```bash
kubectl apply -f tenant.yaml
```

## 3. 拡張を監視する

```bash
kubectl -n storage-a get tenant tenant-a -w
kubectl -n storage-a get pods,pvc \
  -l rustfs.pool=pool-1
```

次のトポロジー変更の前に、Tenant が `Ready` に戻るまで待ちます。既存 PVC のサイズを増やす操作は、これとは別の Kubernetes ストレージ操作であり、StorageClass に依存します。
