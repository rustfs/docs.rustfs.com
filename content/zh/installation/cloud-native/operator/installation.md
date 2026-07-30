---
title: 安装
description: 准备 Kubernetes、安装 RustFS Operator 并安全访问其控制台。
---

本指南使用 Helm 安装 Operator、验证部署，并在本地或通过 HTTPS 公开 Operator 控制台。

## 环境要求

| 组件 | 要求 |
|-----------|-------------|
| Kubernetes | `v1.30` 或更高版本 |
| Helm | `v3.0` 或更高版本 |
| kubectl | 与 Kubernetes 集群兼容 |
| StorageClass | 为 Tenant 存储动态预配 PVC |

你的账户必须能够创建 CRD、集群 RBAC、Deployment 和 Service。安装前确认目标集群：

```bash
kubectl config current-context
kubectl get storageclass
```

## 1. 安装 Operator

Helm chart 存储在 Operator 仓库中：

```bash
git clone https://github.com/rustfs/operator.git
cd operator

helm upgrade --install rustfs-operator deploy/rustfs-operator/ \
  --namespace rustfs-system \
  --create-namespace
```

通用设置应放在 values 文件中：

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

使用 `-f values.yaml` 应用该文件。chart 会根据这些值生成 `OPERATOR_*` 变量；不要在 `operator.env` 中重复定义。

## 2. 验证安装

```bash
kubectl -n rustfs-system get pods,services
kubectl get crd tenants.rustfs.com
kubectl -n rustfs-system rollout status deployment/rustfs-operator
kubectl -n rustfs-system rollout status deployment/rustfs-operator-console
```

## 3. 访问 Operator 控制台

控制台监听端口 `9090`。生成短期登录 token：

```bash
kubectl -n rustfs-system create token rustfs-operator-console --duration=24h
```

将控制台 Service 转发到工作站：

```bash
kubectl -n rustfs-system port-forward \
  svc/rustfs-operator-console 19090:9090
```

打开 `http://127.0.0.1:19090`，将 token 粘贴到登录表单中。当 release 名称或命名空间不同时，Helm 安装说明会输出准确的 ServiceAccount 和 Service 名称。

:::note[本地 HTTP 访问]

如果浏览器无法通过 HTTP 保持登录，请仅为本地测试在 `console.env` 下设置 `CONSOLE_COOKIE_SECURE=false`。使用 HTTPS 时请保持安全 cookie 启用。

:::

## 4. 配置控制台 TLS

为控制台 UI 和 `/api/v1` 使用同一个 HTTPS 主机名。创建 TLS Secret，或让 cert-manager 创建，然后启用 Ingress：

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

使用 values 文件升级 release：

```bash
helm upgrade rustfs-operator deploy/rustfs-operator/ \
  --namespace rustfs-system \
  -f values.yaml
```

请根据环境替换 Ingress class、issuer 和主机名。如果未安装 cert-manager，请在升级前使用证书和私钥创建 `console-tls` Secret。

接下来，[创建 Tenant](./tenant.md)。