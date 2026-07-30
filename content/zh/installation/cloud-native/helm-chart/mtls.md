---
title: mTLS
description: 为 Helm chart 部署的 RustFS Pod 配置双向 TLS。
---

该 chart 可以为 RustFS Pod 通信启用双向传输层安全性（mTLS）。启用后，RustFS 会要求客户端证书，为生成的对等节点 URL 使用 HTTPS，并将服务器、客户端和 CA 材料挂载到每个 Pod 中。

## 环境要求

mTLS 使用 cert-manager 的 `Issuer` 和 `Certificate` 资源。启用前请安装 cert-manager，并确认其 CRD 可用：

```bash
kubectl get crd certificates.cert-manager.io issuers.cert-manager.io
```

## 1. 使用 chart 管理的 CA

将以下设置添加到现有 values 文件：

```yaml title="values.yaml"
mtls:
  enabled: true
```

升级 release：

```bash
helm upgrade rustfs ./helm/rustfs \
  --namespace rustfs \
  -f values.yaml
```

该 chart 会创建自签名根 CA、命名空间级 Issuer 以及服务器和客户端 Certificate。它会挂载生成的 Secret，并使用 `RUSTFS_SERVER_MTLS_ENABLE=1` 和 `RUSTFS_TLS_PATH=/opt/tls` 配置 RustFS。健康探针也会使用生成的客户端证书。

## 2. 使用现有 Issuer

如需使用平台已管理的 Issuer 或 ClusterIssuer，请配置其引用：

```yaml title="values.yaml"
mtls:
  enabled: true
  existingIssuerRef:
    enabled: true
    name: internal-ca
    kind: ClusterIssuer
    group: cert-manager.io
```

该 issuer 必须处于就绪状态，并能够在 `rustfs` 命名空间中签发服务器和客户端证书。对于命名空间级 issuer，请使用 `kind: Issuer`。

## 3. 验证 mTLS

```bash
kubectl -n rustfs get issuer,certificate,secret
kubectl -n rustfs describe certificate rustfs-server-tls
kubectl -n rustfs describe certificate rustfs-client-tls
kubectl -n rustfs get pods
```

对于名为 `rustfs` 的 release，生成的证书 Secret 是 `rustfs-server-tls` 和 `rustfs-client-tls`。

:::warning[规划外部访问]

mTLS 要求客户端出示受信任的证书。在现有部署上启用 mTLS 前，请验证 Ingress 控制器或其他外部客户端如何提供该证书。

:::