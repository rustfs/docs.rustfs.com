---
title: cert-manager
description: 使用 cert-manager 为 RustFS Helm 部署签发和续订 TLS 证书。
---

使用 **cert-manager** 签发 RustFS Ingress 引用的证书。这样可以为公共 S3 API 和控制台端点提供 HTTPS，并允许 cert-manager 续订证书。

## 环境要求

- cert-manager 已安装，且其控制器 Pod 已就绪。
- `Issuer` 或 `ClusterIssuer` 已就绪。
- RustFS 主机名可解析到 Ingress 控制器。

安装 RustFS 前验证 issuer：

```bash
kubectl get clusterissuer letsencrypt-prod
kubectl -n cert-manager get pods
```

## 1. 配置 Ingress TLS

将 Ingress 和证书设置添加到单机或分布式 values 文件：

```yaml title="values.yaml"
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: s3.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    enabled: true
    certManager:
      enabled: true
    existingSecret:
      enabled: false
      name: ""
```

请根据集群替换 Ingress class、issuer 和主机名。对于命名空间级 Issuer，请改用 `cert-manager.io/issuer` 注解。

## 2. 应用配置

```bash
helm upgrade rustfs ./helm/rustfs \
  --namespace rustfs \
  -f values.yaml
```

对于名为 `rustfs` 的 release，Ingress 会引用 `rustfs-tls` Secret。cert-manager ingress-shim 读取 issuer 注解并创建 Certificate，将证书写入此 Secret。

## 3. 验证证书

```bash
kubectl -n rustfs get ingress,certificate,certificaterequest
kubectl -n rustfs describe certificate rustfs-tls
kubectl -n rustfs get secret rustfs-tls
```

等待 Certificate 报告 `Ready=True`，然后打开 `https://s3.example.com`。

## 将 cert-manager 与 mTLS 配合使用

启用 `mtls.enabled=true` 后，该 chart 也会使用 cert-manager 签发服务器和客户端证书。请参阅 [mTLS](./mtls.md)，了解如何使用 chart 管理的 CA 或引用现有 issuer。