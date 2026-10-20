---
title: "Keycloak"
description: "Keycloak を、RustFS Console のシングルサインオン用 OpenID Connect アイデンティティプロバイダーとして設定します。"
---

RustFS は、OpenID Connect（OIDC）の Authorization Code Flow を通じて **Keycloak** と連携します。このページの例では、RustFS のデフォルトプロバイダー ID である `default` を使います。

## 概要

ブラウザのログインの流れは次のとおりです。

1. RustFS は、Proof Key for Code Exchange（PKCE）の S256 チャレンジ付きで認可コードリクエストを送ります。
2. Keycloak がユーザーを認証し、`code` と `state` を付けてブラウザを RustFS へリダイレクトします。
3. RustFS は、Keycloak のトークンエンドポイントでコードを交換します。
4. RustFS は、ID トークンの署名、発行者、オーディエンス、有効期限、nonce を検証します。
5. RustFS は、ID トークンのクレーム値をローカルの Identity and Access Management（IAM）ポリシーに対応付け、Console セッション用の一時認証情報を発行します。

Keycloak がユーザーを認証し、RustFS のポリシーが S3 と管理操作を認可します。RustFS は、オブジェクトや Console の認可に Keycloak Authorization Services を使いません。

例では次の値を使います。ホスト名とクライアントシークレットは、環境に合わせて置き換えてください。

| 設定 | 例 |
| --- | --- |
| Keycloak のレルム | `rustfs` |
| Keycloak の発行者 | `https://keycloak.example.com/realms/rustfs` |
| Keycloak のクライアント ID | `rustfs-console` |
| 公開する RustFS のオリジン | `https://rustfs.example.com` |
| RustFS のコールバック URL | `https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default` |

## 設定

### Keycloak の設定

#### レルムとクライアントを作成する

1. Keycloak の Admin Console を開き、`rustfs` レルムを作成または選択します。
2. **Clients** を開き、クライアント ID `rustfs-console` の OpenID Connect クライアントを作成します。
3. **Client authentication** と **Standard flow** を有効にします。
4. **Implicit flow**、**Direct access grants**、**Service accounts roles** など、使わないフローを無効にします。
5. **Valid redirect URIs** に、RustFS のコールバック URL を完全一致で設定します。

  ```text
  https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default
  ```

6. **Web origins** に、公開する RustFS のオリジンを設定します。

  ```text
  https://rustfs.example.com
  ```

7. **Proof Key for Code Exchange Code Challenge Method** を `S256` に設定します。
8. クライアントを保存し、**Credentials** からシークレットをコピーします。

RustFS は、トークンリクエストの本文でクライアントシークレットを送ります。`client_secret_post` を無効にする Keycloak のクライアントポリシーは適用しないでください。

#### Keycloak のグループを RustFS のポリシーに対応付ける

RustFS は、ID トークンの `groups` クレームの値を RustFS のポリシー名に対応付けます。ユーザーに必要なポリシーと一致する Keycloak グループ（`consoleAdmin`、`readwrite`、`readonly` など）を作成し、ユーザーをそれらのグループに割り当てます。

専用のクライアントスコープに **Group Membership** マッパーを追加し、`rustfs-console` に割り当てます。

| マッパーのフィールド | 値 |
| --- | --- |
| Name | `rustfs-groups` |
| Token Claim Name | `groups` |
| Full group path | Off |
| Add to ID token | On |
| Add to access token | On |
| Add to userinfo | On |
| Multivalued | On |

**Full group path** は無効のままにします。`/consoleAdmin` のような値は、RustFS のポリシー名 `consoleAdmin` と一致しません。

:::note[Keycloak のロールを使う場合]

グループの代わりにレルムロールまたはクライアントロールを使う場合は、フラットなトップレベルの `roles` 配列を出力するロールマッパーを追加します。RustFS は、Keycloak のネストした `realm_access.roles` クレームを解析しません。

:::

### RustFS の設定

環境変数で Keycloak プロバイダーを設定します。

#### 環境変数で設定する

Keycloak プロバイダーと、ブラウザ向けの公開オリジンを、RustFS サービスの環境に追加します。

```ini title="/etc/default/rustfs"
RUSTFS_BROWSER_REDIRECT_URL="https://rustfs.example.com"

RUSTFS_IDENTITY_OPENID_ENABLE=on
RUSTFS_IDENTITY_OPENID_CONFIG_URL="https://keycloak.example.com/realms/rustfs"
RUSTFS_IDENTITY_OPENID_CLIENT_ID="rustfs-console"
RUSTFS_IDENTITY_OPENID_CLIENT_SECRET="<keycloak-client-secret>"
RUSTFS_IDENTITY_OPENID_SCOPES="openid,profile,email"
RUSTFS_IDENTITY_OPENID_REDIRECT_URI="https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default"
RUSTFS_IDENTITY_OPENID_REDIRECT_URI_DYNAMIC=off
RUSTFS_IDENTITY_OPENID_DISPLAY_NAME="Keycloak"
RUSTFS_IDENTITY_OPENID_GROUPS_CLAIM="groups"
RUSTFS_IDENTITY_OPENID_ROLES_CLAIM="roles"
RUSTFS_IDENTITY_OPENID_EMAIL_CLAIM="email"
RUSTFS_IDENTITY_OPENID_USERNAME_CLAIM="preferred_username"
```

設定を適用したあと、RustFS を再起動します。

:::note[プライベートネットワーク上の Keycloak]

Keycloak の名前解決結果がプライベート IP アドレスまたはループバック IP アドレスの場合は、RustFS サービスの環境変数 `RUSTFS_OUTBOUND_ALLOW_ORIGINS` にそのオリジンを追加します。たとえば、ポート `8080` を使用する Docker サービス `kc` では、次のように設定します。

```ini
RUSTFS_OUTBOUND_ALLOW_ORIGINS="http://kc:8080"
```

`scheme://host:port` 形式を使用し、`/realms/rustfs` などのパスは含めません。複数のオリジンはカンマで区切ります。ディスカバリードキュメントの `jwks_uri` または `token_endpoint` が別のプライベートオリジンを使用する場合は、それらも追加します。設定を変更したら RustFS を再起動します。パブリック IP アドレスに解決される公開エンドポイントには、この許可リストは不要です。

必要な許可設定がないと、起動時のディスカバリーが失敗します。設定に `enabled: true` と表示されていても、そのプロバイダーは Console ログインと STS に使用できません。

:::

`RUSTFS_BROWSER_REDIRECT_URL` には、パスを除いた公開スキームとオーソリティを指定します。Console の成功時リダイレクトと、ログアウト時のフォールバック URL を制御します。プロバイダーのコールバック URL は、Keycloak に登録した URL と完全に一致する必要があります。

:::warning[本番ではクレームを対応付ける]

恒久的な省略手段として `RUSTFS_IDENTITY_OPENID_ROLE_POLICY=consoleAdmin` を使わないでください。Keycloak のグループまたはロールを RustFS のポリシーに対応付け、各ユーザーに必要な権限だけを付与します。

:::

リバースプロキシまたはロードバランサーを使う場合は、コールバックのクエリ文字列を保持し、認可リクエストとコールバックリクエストを同じ RustFS ノードへルーティングします。処理中の OIDC `state` は、そのノードのローカルにあります。

## 確認

### Keycloak のディスカバリーを確認する

レルムのディスカバリードキュメントを問い合わせます。

```bash
curl -fsS "https://keycloak.example.com/realms/rustfs/.well-known/openid-configuration" | jq '{
  issuer,
  authorization_endpoint,
  token_endpoint,
  jwks_uri,
  code_challenge_methods_supported,
  token_endpoint_auth_methods_supported
}'
```

次を確認します。

- `issuer` が `https://keycloak.example.com/realms/rustfs` であること。
- `authorization_endpoint`、`token_endpoint`、`jwks_uri` があること。
- `code_challenge_methods_supported` に `S256` が含まれること。
- トークンエンドポイントが、リクエスト本文でのクライアントシークレット認証に対応していること。

### RustFS のプロバイダーを確認する

RustFS を再起動したあと、プロバイダーが利用できることを確認します。

```bash
curl -fsS "https://rustfs.example.com/rustfs/admin/v3/oidc/providers" | jq
```

レスポンスには、表示名 `Keycloak` の `default` プロバイダーが含まれるはずです。

### Console ログインを試す

RustFS Console を開き **Keycloak** を選択するか、認可エンドポイントを直接開きます。

```text
https://rustfs.example.com/rustfs/admin/v3/oidc/authorize/default
```

一連の流れを確認します。

1. ブラウザが Keycloak へリダイレクトされる。
2. ユーザーがサインインする。
3. Keycloak が `code` と `state` を付けて RustFS のコールバック URL へリダイレクトする。
4. RustFS が ID トークンを検証し、Console セッションを作成する。
5. ユーザーの `groups` または `roles` クレームから対応付けた権限で Console が開く。

認証は成功するのにアクセスが拒否される場合は、ID トークンにフラットな `groups` または `roles` クレームがあり、各値が既存の RustFS ポリシー名と完全に一致することを確認します。

## 次のステップ

- Keycloak のグループを割り当てる前に、[ユーザー、グループ、ポリシー](../iam/policies.md)を確認します。
- ログインエンドポイントを公開する前に、[Console のセキュリティに関する注意](/ja/administration/console)を確認します。
