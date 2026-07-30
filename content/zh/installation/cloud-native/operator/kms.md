---
title: KMS 集成
description: 通过 Operator 加密 API 为 RustFS Tenant 配置本地或 HashiCorp Vault 密钥管理。
---

通过 `spec.encryption` 配置密钥管理服务（KMS）集成。不要将 `RUSTFS_KMS_*` 变量添加到 `spec.env`；Operator 会根据结构化 Tenant 配置和 Secret 引用生成这些变量。

## 选择后端

仅对单服务器 Tenant 使用 `local`。对于每个 Tenant Pod 都能访问 HashiCorp Vault 的分布式部署，请使用 `vault`。

## 本地 KMS

创建主密钥 Secret：

```yaml title="local-kms-secret.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: rustfs-local-kms
  namespace: storage-a
type: Opaque
stringData:
  local-master-key: "replace-with-a-random-master-key"
```

将加密区块添加到现有 Tenant manifest：

```yaml title="tenant.yaml"
spec:
  encryption:
    enabled: true
    backend: local
    local:
      keyDirectory: /data/rustfs0/.kms-keys
      masterKeySecretRef:
        name: rustfs-local-kms
        key: local-master-key
    defaultKeyId: tenant-default
```

密钥目录必须位于已挂载的数据路径中，以便更换 Pod 后仍然保留。

## HashiCorp Vault KMS

创建包含 Vault token 的 Secret：

```yaml title="vault-kms-secret.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: rustfs-kms
  namespace: storage-a
type: Opaque
stringData:
  vault-token: "replace-with-vault-token"
```

将 Vault 配置添加到现有 Tenant manifest：

```yaml title="tenant.yaml"
spec:
  encryption:
    enabled: true
    backend: vault
    vault:
      endpoint: https://vault.example.com:8200
    kmsSecret:
      name: rustfs-kms
    defaultKeyId: tenant-default
```

每个 Tenant Pod 都必须能够解析并连接 Vault 端点，且信任其证书。

## 应用配置

```bash
kubectl apply -f local-kms-secret.yaml
kubectl apply -f tenant.yaml
kubectl -n storage-a describe tenant tenant-a
```

使用 Vault 时，请先应用 `vault-kms-secret.yaml`，再应用 `tenant.yaml`。更改加密设置会滚动更新受影响的 StatefulSet。

:::warning[保护加密密钥]

存储生产数据前，请备份密钥材料并测试恢复流程。丢失本地主密钥或 Vault 密钥可能导致加密对象无法恢复。

:::