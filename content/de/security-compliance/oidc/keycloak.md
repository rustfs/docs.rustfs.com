---
title: "Keycloak"
description: "Konfigurieren Sie Keycloak als OpenID-Connect-Identitätsanbieter für das Single Sign-On der RustFS Console."
---

RustFS lässt sich über den OpenID-Connect-Ablauf Authorization Code Flow (OIDC) mit **Keycloak** verbinden. Die Beispiele auf dieser Seite verwenden die standardmäßige RustFS-Provider-ID `default`.

## Überblick

Der Anmeldeablauf im Browser ist:

1. RustFS sendet eine Authorization-Code-Anfrage mit einer S256-Challenge nach Proof Key for Code Exchange (PKCE).
2. Keycloak authentifiziert den Benutzer und leitet den Browser mit `code` und `state` zu RustFS zurück.
3. RustFS tauscht den Code am Token-Endpunkt von Keycloak ein.
4. RustFS prüft Signatur, Aussteller, Zielgruppe, Ablauf und Nonce des ID-Tokens.
5. RustFS ordnet Claim-Werte des ID-Tokens lokalen Richtlinien der Identitäts- und Zugriffsverwaltung (IAM) von RustFS zu und stellt temporäre Zugangsdaten für die Console-Sitzung aus.

Keycloak authentifiziert den Benutzer; die RustFS-Richtlinien autorisieren S3- und Verwaltungsoperationen. RustFS verwendet die Keycloak Authorization Services nicht für die Autorisierung von Objekten oder der Console.

Die Beispiele verwenden die folgenden Werte. Ersetzen Sie Hostnamen und Client-Secret für Ihre Umgebung:

| Einstellung | Beispiel |
| --- | --- |
| Keycloak-Realm | `rustfs` |
| Keycloak-Issuer | `https://keycloak.example.com/realms/rustfs` |
| Keycloak-Client-ID | `rustfs-console` |
| Öffentlicher RustFS-Origin | `https://rustfs.example.com` |
| RustFS-Callback-URL | `https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default` |

## Konfiguration

### Keycloak konfigurieren

#### Realm und Client anlegen

1. Öffnen Sie die Keycloak Admin Console und legen Sie den Realm `rustfs` an oder wählen Sie ihn aus.
2. Öffnen Sie **Clients** und legen Sie einen OpenID-Connect-Client mit der Client-ID `rustfs-console` an.
3. Aktivieren Sie **Client authentication** und **Standard flow**.
4. Deaktivieren Sie nicht verwendete Flows, darunter **Implicit flow**, **Direct access grants** und **Service accounts roles**.
5. Setzen Sie **Valid redirect URIs** auf die genaue RustFS-Callback-URL:

  ```text
  https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default
  ```

6. Setzen Sie **Web origins** auf den öffentlichen RustFS-Origin:

  ```text
  https://rustfs.example.com
  ```

7. Setzen Sie **Proof Key for Code Exchange Code Challenge Method** auf `S256`.
8. Speichern Sie den Client und kopieren Sie sein Secret aus **Credentials**.

RustFS sendet das Client-Secret im Body der Token-Anfrage. Wenden Sie keine Keycloak-Client-Richtlinie an, die `client_secret_post` deaktiviert.

#### Keycloak-Gruppen auf RustFS-Richtlinien abbilden

RustFS ordnet Werte im Claim `groups` des ID-Tokens den Namen der RustFS-Richtlinien zu. Legen Sie Keycloak-Gruppen an, die zu den Richtlinien Ihrer Benutzer passen, etwa `consoleAdmin`, `readwrite` oder `readonly`, und weisen Sie den Benutzern diese Gruppen zu.

Fügen Sie einem eigenen Client-Scope einen Mapper **Group Membership** hinzu und hängen Sie ihn an `rustfs-console` an:

| Mapper-Feld | Wert |
| --- | --- |
| Name | `rustfs-groups` |
| Token Claim Name | `groups` |
| Full group path | Off |
| Add to ID token | On |
| Add to access token | On |
| Add to userinfo | On |
| Multivalued | On |

Lassen Sie **Full group path** deaktiviert. Ein Wert wie `/consoleAdmin` entspricht nicht der RustFS-Richtlinie `consoleAdmin`.

:::note[Keycloak-Rollen verwenden]

Wenn Sie Realm- oder Client-Rollen statt Gruppen verwenden, fügen Sie einen Rollen-Mapper hinzu, der ein flaches `roles`-Array auf oberster Ebene ausgibt. RustFS wertet den verschachtelten Claim `realm_access.roles` von Keycloak nicht aus.

:::

### RustFS konfigurieren

Konfigurieren Sie den Keycloak-Provider über Umgebungsvariablen.

#### Mit Umgebungsvariablen konfigurieren

Tragen Sie den Keycloak-Provider und den öffentlichen Browser-Origin in die Dienstumgebung von RustFS ein:

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

Starten Sie RustFS neu, nachdem Sie die Konfiguration übernommen haben.

:::note[Keycloak in einem privaten Netzwerk]

Wenn Keycloak zu einer privaten oder Loopback-IP-Adresse aufgelöst wird, fügen Sie dessen Origin zu `RUSTFS_OUTBOUND_ALLOW_ORIGINS` in der Dienstumgebung von RustFS hinzu. Beispiel für einen Docker-Dienst namens `kc` auf Port `8080`:

```ini
RUSTFS_OUTBOUND_ALLOW_ORIGINS="http://kc:8080"
```

Verwenden Sie `scheme://host:port` ohne einen Pfad wie `/realms/rustfs`. Trennen Sie mehrere Origins durch Kommas. Nehmen Sie auch andere private Origins auf, die `jwks_uri` oder `token_endpoint` im Discovery-Dokument verwenden. Starten Sie RustFS nach der Änderung neu. Öffentliche Endpunkte, die zu öffentlichen IP-Adressen aufgelöst werden, benötigen diese Freigabeliste nicht.

Ohne die erforderliche Freigabeliste schlägt die Discovery beim Start fehl. Der Provider ist dann für die Console-Anmeldung und für STS nicht verfügbar, auch wenn seine Konfiguration `enabled: true` anzeigt.

:::

`RUSTFS_BROWSER_REDIRECT_URL` muss das öffentliche Schema und die Authority ohne Pfad enthalten. Die Variable steuert die Weiterleitung nach erfolgreicher Console-Anmeldung und die Rückfall-URL beim Abmelden. Die Callback-URL des Providers muss genau der in Keycloak registrierten URL entsprechen.

:::warning[Claims in der Produktion zuordnen]

Verwenden Sie `RUSTFS_IDENTITY_OPENID_ROLE_POLICY=consoleAdmin` nicht als dauerhafte Abkürzung. Ordnen Sie Keycloak-Gruppen oder -Rollen RustFS-Richtlinien zu, damit jeder Benutzer nur die erforderlichen Berechtigungen erhält.

:::

Hinter einem Reverse-Proxy oder Load-Balancer müssen Sie die Query-Zeichenfolge des Callbacks beibehalten und die Authorize- und Callback-Anfragen an denselben RustFS-Knoten leiten. Der laufende OIDC-`state` gilt nur für diesen Knoten.

## Überprüfung

### Keycloak-Discovery prüfen

Fragen Sie das Discovery-Dokument des Realms ab:

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

Prüfen Sie Folgendes:

- `issuer` den Wert `https://keycloak.example.com/realms/rustfs` hat.
- `authorization_endpoint`, `token_endpoint` und `jwks_uri` vorhanden sind.
- `code_challenge_methods_supported` den Wert `S256` enthält.
- Der Token-Endpunkt die Authentifizierung mit dem Client-Secret im Anfrage-Body unterstützt.

### RustFS-Provider prüfen

Prüfen Sie nach dem Neustart von RustFS, ob der Provider verfügbar ist:

```bash
curl -fsS "https://rustfs.example.com/rustfs/admin/v3/oidc/providers" | jq
```

Die Antwort sollte den Provider `default` mit dem Anzeigenamen `Keycloak` enthalten.

### Console-Anmeldung testen

Öffnen Sie die RustFS Console und wählen Sie **Keycloak**, oder öffnen Sie den Autorisierungsendpunkt direkt:

```text
https://rustfs.example.com/rustfs/admin/v3/oidc/authorize/default
```

Prüfen Sie den vollständigen Ablauf:

1. Der Browser wird zu Keycloak weitergeleitet.
2. Der Benutzer meldet sich an.
3. Keycloak leitet zur RustFS-Callback-URL weiter und übergibt `code` und `state`.
4. RustFS prüft das ID-Token und legt die Console-Sitzung an.
5. Die Console öffnet sich mit den Berechtigungen, die aus dem Claim `groups` oder `roles` des Benutzers zugeordnet wurden.

Wenn die Authentifizierung gelingt, der Zugriff aber verweigert wird, prüfen Sie, ob das ID-Token einen flachen Claim `groups` oder `roles` enthält und ob jeder Wert genau dem Namen einer vorhandenen RustFS-Richtlinie entspricht.

## Nächste Schritte

- Lesen Sie [Benutzer, Gruppen und Richtlinien](../iam/policies.md), bevor Sie Keycloak-Gruppen zuweisen.
- Lesen Sie die [Sicherheitshinweise zur Console](/de/administration/console), bevor Sie den Anmeldeendpunkt öffentlich bereitstellen.
