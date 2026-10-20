---
title: "OIDC"
description: "RustFS が Console のシングルサインオンに OpenID Connect プロバイダーを使う仕組みを説明します。"
---

RustFS は、Console のシングルサインオンで OpenID Connect（OIDC）に対応しています。この概要では、認証の流れを理解し、アイデンティティプロバイダーを準備し、プロバイダー別の設定ガイドを選びます。

## OIDC の仕組み

RustFS は、Proof Key for Code Exchange（PKCE）を伴う OIDC の Authorization Code Flow を使います。

1. RustFS は、S256 の PKCE チャレンジ付きで認可リクエストを送ります。
2. アイデンティティプロバイダーがユーザーを認証し、認可コードを RustFS のコールバック URL へ返します。
3. RustFS は、プロバイダーのトークンエンドポイントでコードを交換します。
4. RustFS は、ID トークンの署名、発行者、オーディエンス、有効期限、nonce を検証します。
5. RustFS は、設定されたトークンクレームをローカルのアイデンティティとアクセス管理（IAM）ポリシーに対応付け、一時認証情報を持つ Console セッションを作成します。

アイデンティティプロバイダーがユーザーを認証し、RustFS のポリシーが S3 と管理操作を認可します。

## プロバイダーの要件

プロバイダーを設定する前に、次を準備します。

- 認可、トークン、JSON Web Key Set（JWKS）の各エンドポイントを公開する OIDC ディスカバリー URL。
- Authorization Code Flow、S256 PKCE、トークンリクエスト本文でのクライアントシークレット認証に対応する機密クライアント。
- `https://<rustfs-host>/rustfs/admin/v3/oidc/callback/<provider-id>` 形式の、完全一致するコールバック URL。
- RustFS Console の公開 HTTPS オリジン。
- 値が既存の RustFS ポリシー名と一致する、フラットなグループまたはロールのクレーム。

RustFS 専用のクライアントを使い、各アイデンティティには必要なポリシーだけを付与します。

## プロバイダー別のガイド

- [Keycloak の設定](/ja/security-compliance/oidc/keycloak)では、RustFS Console の OIDC プロバイダーとして Keycloak を設定します。
- [GitLab の設定](/ja/security-compliance/oidc/gitlab)では、RustFS Console の OIDC プロバイダーとして GitLab を設定します。

## 次のステップ

- アイデンティティプロバイダーのクレームを対応付ける前に、[ユーザー、グループ、ポリシー](/ja/security-compliance/iam/policies)を確認します。
- ログインエンドポイントを公開する前に、[Console のセキュリティに関する注意](/ja/administration/console)を確認します。
