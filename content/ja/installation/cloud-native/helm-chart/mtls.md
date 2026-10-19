---
title: mTLS
description: Helm チャートでデプロイした RustFS の Pod 間に、相互 TLS を設定します。
---

チャートでは、RustFS の Pod 間通信に相互トランスポート層セキュリティ（mTLS）を有効にできます。有効にすると、RustFS はクライアント証明書を要求し、生成されたピア URL に HTTPS を使い、サーバー用、クライアント用、CA 用の証明書データをすべての Pod へマウントします。

## 要件

mTLS は cert-manager の `Issuer` と `Certificate` リソースを使います。有効にする前に cert-manager をインストールし、CRD が利用できることを確認します。

```bash
kubectl get crd certificates.cert-manager.io issuers.cert-manager.io
```

## 1. チャートが管理する CA を使う

既存の values ファイルに、次の設定を追加します。

```yaml title="values.yaml"
mtls:
  enabled: true
```

リリースをアップグレードします。

```bash
helm upgrade rustfs ./helm/rustfs \
  --namespace rustfs \
  -f values.yaml
```

チャートは、自己署名のルート CA、名前空間の Issuer、サーバー用とクライアント用の Certificate を作成します。生成された Secret をマウントし、`RUSTFS_SERVER_MTLS_ENABLE=1` と `RUSTFS_TLS_PATH=/opt/tls` で RustFS を設定します。ヘルスプローブも、生成されたクライアント証明書を使います。

## 2. 既存の Issuer を使う

プラットフォームで既に管理している Issuer または ClusterIssuer を使うには、その参照を設定します。

```yaml title="values.yaml"
mtls:
  enabled: true
  existingIssuerRef:
    enabled: true
    name: internal-ca
    kind: ClusterIssuer
    group: cert-manager.io
```

Issuer は準備完了であり、`rustfs` 名前空間でサーバー証明書とクライアント証明書の両方を発行できる必要があります。名前空間スコープの Issuer には `kind: Issuer` を使います。

## 3. mTLS を確認する

```bash
kubectl -n rustfs get issuer,certificate,secret
kubectl -n rustfs describe certificate rustfs-server-tls
kubectl -n rustfs describe certificate rustfs-client-tls
kubectl -n rustfs get pods
```

リリース名が `rustfs` の場合、生成される証明書の Secret は `rustfs-server-tls` と `rustfs-client-tls` です。

:::warning[外部アクセスを計画する]

mTLS では、クライアントが信頼された証明書を提示する必要があります。既存のデプロイで mTLS を有効にする前に、Ingress コントローラーや他の外部クライアントが、その証明書をどのように提示するかを確認します。

:::
