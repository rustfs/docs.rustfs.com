---
title: "OIDC"
description: "Verstehen Sie, wie RustFS OpenID-Connect-Anbieter für das Single Sign-On der Console verwendet."
---

RustFS unterstützt OpenID Connect (OIDC) für das Single Sign-On der Console. Dieser Überblick erklärt den Authentifizierungsablauf, die Vorbereitung eines Identitätsanbieters und die anbieterspezifischen Konfigurationsanleitungen.

## Funktionsweise von OIDC

RustFS verwendet den OIDC Authorization Code Flow mit Proof Key for Code Exchange (PKCE):

1. RustFS sendet eine Autorisierungsanfrage mit einer S256-PKCE-Challenge.
2. Der Identitätsanbieter authentifiziert Sie und gibt einen Autorisierungscode an die Callback-URL von RustFS zurück.
3. RustFS tauscht den Code am Token-Endpunkt des Anbieters ein.
4. RustFS prüft Signatur, Aussteller, Zielgruppe, Ablauf und Nonce des ID-Tokens.
5. RustFS ordnet konfigurierte Token-Claims lokalen Richtlinien der Identitäts- und Zugriffsverwaltung (IAM) zu und erstellt eine Console-Sitzung mit temporären Zugangsdaten.

Der Identitätsanbieter authentifiziert Sie; die RustFS-Richtlinien autorisieren S3- und Verwaltungsoperationen.

## Anforderungen an den Anbieter

Bereiten Sie vor der Konfiguration eines Anbieters Folgendes vor:

- Eine OIDC-Discovery-URL, die die Endpunkte für Autorisierung, Token und das JSON Web Key Set (JWKS) bereitstellt.
- Einen vertraulichen Client, der den Authorization Code Flow, S256-PKCE und die Authentifizierung mit dem Client-Secret im Body der Token-Anfrage unterstützt.
- Eine exakte Callback-URL in der Form `https://<rustfs-host>/rustfs/admin/v3/oidc/callback/<provider-id>`.
- Einen öffentlichen HTTPS-Origin für die RustFS Console.
- Einen flachen Gruppen- oder Rollen-Claim, dessen Werte vorhandenen Namen von RustFS-Richtlinien entsprechen.

Verwenden Sie einen eigenen Client für RustFS und weisen Sie jeder Identität nur die Richtlinien zu, die sie benötigt.

## Anleitungen zu Anbietern

- [Keycloak konfigurieren](/de/security-compliance/oidc/keycloak) als OIDC-Anbieter für die RustFS Console.
- [GitLab konfigurieren](/de/security-compliance/oidc/gitlab) als OIDC-Anbieter für die RustFS Console.

## Nächste Schritte

- Lesen Sie [Benutzer, Gruppen und Richtlinien](/de/security-compliance/iam/policies), bevor Sie Claims des Identitätsanbieters zuordnen.
- Lesen Sie die [Sicherheitshinweise zur Console](/de/administration/console), bevor Sie den Anmeldeendpunkt öffentlich bereitstellen.
