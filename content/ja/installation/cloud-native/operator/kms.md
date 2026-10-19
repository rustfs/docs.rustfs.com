---
title: KMS 連携
description: Operator の暗号化 API を通じて、RustFS の Tenant にローカルまたは HashiCorp Vault のキー管理を設定します。
---

`spec.encryption` でキー管理サービス（KMS）の連携を設定します。`RUSTFS_KMS_*` 変数を `spec.env` へ追加してはなりません。Operator は、構造化された Tenant の設定と Secret の参照から、これらの変数を生成します。

## バックエンドを選ぶ

`local` は、サーバーが 1 台の Tenant に限り使います。すべての Tenant Pod が HashiCorp Vault へ到達できる分散デプロイでは、`vault` を使います。

## ローカル KMS

マスターキーの Secret を作成します。

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

既存の Tenant マニフェストに、encryption ブロックを追加します。

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

キーディレクトリは、マウントされたデータパスの内部にある必要があります。これにより、Pod が置き換わっても残ります。

## HashiCorp Vault の KMS

Vault トークンを含む Secret を作成します。

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

既存の Tenant マニフェストに、Vault の設定を追加します。

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

すべての Tenant Pod は、Vault のエンドポイントを名前解決して接続でき、その証明書を信頼する必要があります。

## 設定を適用する

```bash
kubectl apply -f local-kms-secret.yaml
kubectl apply -f tenant.yaml
kubectl -n storage-a describe tenant tenant-a
```

Vault の場合は、`tenant.yaml` の前に `vault-kms-secret.yaml` を適用します。暗号化の設定を変更すると、影響を受ける StatefulSet がローリング更新されます。

:::warning[暗号鍵を保護する]

本番データを保存する前に、鍵材料をバックアップし、復旧をテストします。ローカルのマスターキーまたは Vault の鍵を失うと、暗号化されたオブジェクトを復旧できなくなる可能性があります。

:::
