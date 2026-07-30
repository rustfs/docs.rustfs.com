---
title: 多租户
description: 创建相互隔离的 RustFS Tenant，并访问其 S3 API 和控制台服务。
---

一个 `Tenant` 表示一个独立的 RustFS 集群。请为每个团队或工作负载使用单独的命名空间、凭证 Secret 和 Tenant 资源。

## 1. 创建命名空间和凭证

直接创建 Secret，避免在 manifest 中存储凭证：

```bash
kubectl create namespace storage-a
kubectl -n storage-a create secret generic rustfs-tenant-creds \
  --from-literal=accesskey='<your-access-key>' \
  --from-literal=secretkey='<your-secret-key>'
```

## 2. 定义 Tenant

这个开发环境示例会创建一个 RustFS Pod 和一个 `10Gi` PVC。请将 `standard` 替换为集群中的 StorageClass。

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

## 3. 应用并验证

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a get tenant,pods,pvc,svc
kubectl -n storage-a describe tenant tenant-a
```

## 4. 访问 RustFS

```bash
kubectl -n storage-a port-forward svc/tenant-a-io 9000:9000
kubectl -n storage-a port-forward svc/tenant-a-console 9001:9001
```

请在不同终端中运行这些命令。将 `http://localhost:9000` 用作 S3 端点，并打开 `http://localhost:9001` 访问 Tenant 控制台。

如需添加其他 Tenant，请使用不同的命名空间、Secret 和 Tenant 名称重复上述过程。使用以下命令列出所有受管 Tenant：

```bash
kubectl get tenants --all-namespaces
```

:::warning[生产拓扑]

单服务器示例仅用于评估。生产 Tenant 需要分布式存储池布局、资源请求、调度约束和不可变镜像引用。

:::