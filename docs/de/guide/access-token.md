---
title: "Verwaltung von RustFS‑Zugriffsschlüsseln"
description: "Erstellen, Verwenden und Löschen von Zugriffsschlüsseln in RustFS"
---

# Zugriffsschlüssel

RustFS‑Zugriffsschlüssel sind zentrale Anmeldeinformationen, um Identitäten zu authentifizieren und Aktionen zu autorisieren. Sie sind besonders in API‑ und SDK‑Szenarien nützlich. Dieses Kapitel beschreibt das Erstellen und Löschen von Zugriffsschlüsseln.

Voraussetzungen:

- Eine verfügbare RustFS‑Instanz. Siehe [Installationshandbuch](../../de/installation/index.md).

## Zugriffsschlüssel erstellen

1. Melden Sie sich an der RustFS UI‑Konsole an.
1. Wählen Sie in der linken Navigation „Zugriffsschlüssel“.
1. Klicken Sie oben rechts auf „Zugriffsschlüssel hinzufügen“.
1. Geben Sie „Ablaufzeit, Name und Beschreibung“ ein und klicken Sie auf „Senden“.
1. (Optional, aber empfohlen) Wählen Sie auf der Schlüssel‑Detailseite „Kopieren“ oder „Exportieren“, um den Schlüssel sicher aufzubewahren.

![access key list page](images/access_token_creation.png)

## Zugriffsschlüssel löschen

1. Melden Sie sich an der RustFS UI‑Konsole an.
1. Wählen Sie in der linken Navigation „Zugriffsschlüssel“.
1. Wählen Sie den zu löschenden Schlüssel aus.
1. Klicken Sie rechts auf „Löschen“ oder oben rechts auf „Ausgewählte löschen“.

![access key deletion](images/access_token_deletion.png)