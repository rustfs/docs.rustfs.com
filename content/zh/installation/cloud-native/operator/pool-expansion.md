---
title: 存储池扩容
description: 通过追加存储池增加 RustFS Tenant 的存储容量。
---

Tenant 中的所有存储池共同组成一个 RustFS 集群。通过向 `spec.pools` 追加新存储池来增加容量；不要更改现有存储池的结构。

:::warning[现有存储池不可变]

不要更改现有存储池的 `servers` 或 `persistence.volumesPerServer`。Operator 会为每个存储池创建不可变的 StatefulSet。

:::

## 1. 检查 Tenant

```bash
kubectl -n storage-a get tenant tenant-a
kubectl -n storage-a get pods,pvc -l rustfs.tenant=tenant-a
```

确认 Tenant 处于 `Ready` 状态，并且集群具有足够的计算和存储容量。

## 2. 添加存储池

将以下条目追加到 `tenant.yaml` 中现有的 `spec.pools` 列表。保持所有现有条目不变。

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

该存储池会创建四个 PVC：两台服务器乘以每台服务器两个卷。应用完整的 Tenant manifest：

```bash
kubectl apply -f tenant.yaml
```

## 3. 观察扩容过程

```bash
kubectl -n storage-a get tenant tenant-a -w
kubectl -n storage-a get pods,pvc \
  -l rustfs.pool=pool-1
```

等待 Tenant 恢复到 `Ready` 状态后，再进行其他拓扑变更。扩展现有 PVC 容量属于独立的 Kubernetes 存储操作，并依赖 StorageClass。