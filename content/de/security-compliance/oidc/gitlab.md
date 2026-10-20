---
title: "GitLab"
description: "Konfigurieren Sie GitLab als OpenID-Connect-Identitätsanbieter für das Single Sign-On der RustFS Console."
---

RustFS lässt sich über den OpenID-Connect-Ablauf Authorization Code Flow (OIDC) mit **GitLab** verbinden. Die Beispiele auf dieser Seite verwenden die standardmäßige RustFS-Provider-ID `default`.

## Anforderungen

Bereiten Sie vor dem Beginn Folgendes vor:

- Eine [installierte GitLab-Instanz](https://about.gitlab.com/install/) und Zugriff auf ihren Administrationsbereich.
- Eine RustFS-Bereitstellung mit einem öffentlichen HTTPS-Origin der Console.
- Eine RustFS-Richtlinie, die Sie GitLab-Benutzern zuweisen. Die Beispiele verwenden `consoleAdmin`. Verwenden Sie in der Produktion eine Richtlinie, die nur die Berechtigungen enthält, die Ihre Benutzer benötigen.

## Überblick

Der Anmeldeablauf im Browser ist:

1. RustFS sendet eine Authorization-Code-Anfrage mit einer S256-Challenge nach Proof Key for Code Exchange (PKCE).
2. GitLab authentifiziert den Benutzer und leitet den Browser mit `code` und `state` zu RustFS zurück.
3. RustFS tauscht den Code am Token-Endpunkt von GitLab ein.
4. RustFS prüft Signatur, Aussteller, Zielgruppe, Ablauf und Nonce des ID-Tokens.
5. RustFS weist die konfigurierte lokale Richtlinie der Identitäts- und Zugriffsverwaltung (IAM) zu und stellt temporäre Zugangsdaten für die Console-Sitzung aus.

GitLab authentifiziert den Benutzer; die RustFS-Richtlinien autorisieren S3- und Verwaltungsoperationen.

Die Beispiele verwenden die folgenden Werte. Ersetzen Sie Hostnamen und Client-Secret für Ihre Umgebung:

| Einstellung | Beispiel |
| --- | --- |
| GitLab-Issuer | `https://gitlab.example.com` |
| GitLab-Anwendungs-ID | `<gitlab-application-id>` |
| Öffentlicher RustFS-Origin | `https://rustfs.example.com` |
| RustFS-Callback-URL | `https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default` |

## Konfiguration

### GitLab konfigurieren

#### OAuth-Anwendung anlegen

1. Melden Sie sich bei GitLab als Administrator an.
2. Öffnen Sie **Admin Area** (Administrationsbereich), wählen Sie **Applications** (Anwendungen) und wählen Sie **New application** (Neue Anwendung).
3. Geben Sie `RustFS OIDC` als Anwendungsnamen ein.
4. Setzen Sie **Redirect URI** (Umleitungs-URI) auf die genaue RustFS-Callback-URL:

  ```text
  https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default
  ```

5. Aktivieren Sie **Confidential** (Vertraulich).
6. Aktivieren Sie **Trusted** (Vertrauenswürdig), um die Benutzerabfrage zur Autorisierung für diese instanzweite Anwendung zu überspringen.
7. Wählen Sie die Scopes `openid`, `profile` und `email`.
8. Speichern Sie die Anwendung und kopieren Sie die erzeugte Anwendungs-ID und das Secret.

Einzelheiten zur Verwaltung von Anwendungen finden Sie in der [GitLab-Dokumentation zum OAuth-Provider](https://docs.gitlab.com/integration/oauth_provider/).

![GitLab-Administrationsbereich mit der vertrauenswürdigen und vertraulichen Instanz-OAuth-Anwendung RustFS OIDC](./images/gitlab-oidc-configuration.png)

:::note[Gezeigte Testumgebung]

Der Screenshot zeigt eine HTTP-Callback-URL aus einer Testumgebung. Verwenden Sie für Ihre RustFS-Bereitstellung die öffentliche HTTPS-Callback-URL.

:::

### RustFS konfigurieren

Konfigurieren Sie den GitLab-Anbieter über Umgebungsvariablen.

#### Mit Umgebungsvariablen konfigurieren

Fügen Sie den GitLab-Anbieter und den öffentlichen Browser-Origin zur Dienstumgebung von RustFS hinzu:

```ini title="/etc/default/rustfs"
RUSTFS_BROWSER_REDIRECT_URL="https://rustfs.example.com"

RUSTFS_IDENTITY_OPENID_ENABLE=on
RUSTFS_IDENTITY_OPENID_CONFIG_URL="https://gitlab.example.com"
RUSTFS_IDENTITY_OPENID_CLIENT_ID="<gitlab-application-id>"
RUSTFS_IDENTITY_OPENID_CLIENT_SECRET="<gitlab-application-secret>"
RUSTFS_IDENTITY_OPENID_SCOPES="openid,profile,email"
RUSTFS_IDENTITY_OPENID_REDIRECT_URI="https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default"
RUSTFS_IDENTITY_OPENID_REDIRECT_URI_DYNAMIC=off
RUSTFS_IDENTITY_OPENID_DISPLAY_NAME="GitLab"
RUSTFS_IDENTITY_OPENID_EMAIL_CLAIM="email"
RUSTFS_IDENTITY_OPENID_USERNAME_CLAIM="preferred_username"
RUSTFS_IDENTITY_OPENID_ROLE_POLICY="consoleAdmin"
```

Starten Sie RustFS neu, nachdem Sie die Konfiguration angewendet haben.

`RUSTFS_BROWSER_REDIRECT_URL` muss das öffentliche Schema und die Authority (Host, optional mit Port) ohne Pfad enthalten. Die Variable steuert die Erfolgsweiterleitung der Console und die Ersatz-URL beim Abmelden. Die Callback-URL des Anbieters muss exakt der in GitLab registrierten URL entsprechen.

:::warning[Zugewiesene Richtlinie begrenzen]

`RUSTFS_IDENTITY_OPENID_ROLE_POLICY` weist jedem Benutzer, der sich über diesen Anbieter anmeldet, dieselbe RustFS-Richtlinie zu. Ersetzen Sie `consoleAdmin` durch eine Richtlinie, die nur die Berechtigungen gewährt, die Ihre GitLab-Benutzer benötigen.

:::

Bewahren Sie bei einem Reverse-Proxy oder Load Balancer die Abfragezeichenfolge des Callbacks auf und leiten Sie Autorisierungs- und Callback-Anfragen an denselben RustFS-Knoten. Der laufende OIDC-`state` gilt nur auf diesem Knoten.

## Überprüfung

### GitLab-Discovery prüfen

Fragen Sie das Discovery-Dokument von GitLab ab:

```bash
curl -fsS "https://gitlab.example.com/.well-known/openid-configuration" | jq '{
  issuer,
  authorization_endpoint,
  token_endpoint,
  jwks_uri,
  scopes_supported,
  code_challenge_methods_supported
}'
```

Prüfen Sie Folgendes:

- `issuer` den Wert `https://gitlab.example.com` hat.
- `authorization_endpoint`, `token_endpoint` und `jwks_uri` vorhanden sind.
- `scopes_supported` die Werte `openid`, `profile` und `email` enthält.
- `code_challenge_methods_supported` den Wert `S256` enthält.

### RustFS-Provider prüfen

Prüfen Sie nach dem Neustart von RustFS, ob der Anbieter verfügbar ist:

```bash
curl -fsS "https://rustfs.example.com/rustfs/admin/v3/oidc/providers" | jq
```

Die Antwort sollte den Anbieter `default` mit dem Anzeigenamen `GitLab` enthalten.

### Console-Anmeldung testen

Öffnen Sie die RustFS Console und wählen Sie **GitLab**, oder öffnen Sie den Autorisierungsendpunkt direkt:

```text
https://rustfs.example.com/rustfs/admin/v3/oidc/authorize/default
```

![Anmeldeseite der RustFS Console mit der Option Login with GitLab](./images/rustfs-console-gitlab-oidc.png)

Prüfen Sie den vollständigen Ablauf:

1. Der Browser wird zu GitLab weitergeleitet.
2. Der Benutzer meldet sich an und autorisiert die Anwendung, wenn er dazu aufgefordert wird.
3. GitLab leitet zur RustFS-Callback-URL weiter und übergibt `code` und `state`.
4. RustFS prüft das ID-Token und legt die Console-Sitzung an.
5. Die Console öffnet sich mit der konfigurierten RustFS-Richtlinie.

Wenn GitLab eine abweichende Redirect-URI meldet, prüfen Sie, dass die in der GitLab-Anwendung registrierte URI exakt `RUSTFS_IDENTITY_OPENID_REDIRECT_URI` entspricht.

## Nächste Schritte

- Lesen Sie [Benutzer, Gruppen und Richtlinien](../iam/policies.md), bevor Sie die Richtlinie auswählen, die GitLab-Benutzern zugewiesen wird.
- Lesen Sie die [Sicherheitshinweise zur Console](/de/administration/console), bevor Sie den Anmeldeendpunkt öffentlich bereitstellen.
