---
title: cert-manager
description: cert-manager を使い、RustFS の Helm デプロイ向け TLS 証明書を発行し、更新します。
---

**cert-manager** を使い、RustFS の Ingress が参照する証明書を発行します。公開する S3 API と Console のエンドポイントで HTTPS を提供し、cert-manager が証明書を更新できます。

## 要件

- cert-manager がインストールされ、コントローラーの Pod が準備完了である。
- `Issuer` または `ClusterIssuer` が準備完了である。
- RustFS のホスト名が Ingress コントローラーへ解決される。

RustFS をインストールする前に、Issuer を確認します。

```bash
kubectl get clusterissuer letsencrypt-prod
kubectl -n cert-manager get pods
```

## 1. Ingress の TLS を設定する

スタンドアロン用または分散用の values ファイルに、Ingress と証明書の設定を追加します。

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

クラスターに合わせて、Ingress クラス、Issuer、ホスト名を置き換えます。名前空間スコープの Issuer には、`cert-manager.io/issuer` アノテーションを使います。

## 2. 設定を適用する

```bash
helm upgrade rustfs ./helm/rustfs \
  --namespace rustfs \
  -f values.yaml
```

リリース名が `rustfs` の場合、Ingress は `rustfs-tls` Secret を参照します。cert-manager の ingress-shim は Issuer のアノテーションを読み取り、この Secret へ書き込む Certificate を作成します。

## 3. 証明書を確認する

```bash
kubectl -n rustfs get ingress,certificate,certificaterequest
kubectl -n rustfs describe certificate rustfs-tls
kubectl -n rustfs get secret rustfs-tls
```

Certificate が `Ready=True` を報告するまで待ち、その後 `https://s3.example.com` を開きます。

## mTLS で cert-manager を使う

`mtls.enabled=true` のとき、チャートはサーバー証明書とクライアント証明書の発行にも cert-manager を使います。チャートが管理する CA、または既存の Issuer の参照については、[mTLS](./mtls.md) を参照します。
