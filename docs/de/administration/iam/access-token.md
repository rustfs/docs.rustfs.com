---
title: "RustFS Zugangsschlüssel-Verwaltung"
description: "Erstellung, Verwendung und Löschung von RustFS-Zugangsschlüsseln."
---

# Zugangsschlüssel

RustFS-Zugangsschlüssel sind die Kernberechtigungen des RustFS-Systems, die zur Authentifizierung der Identität und Autorisierung von Operationen verwendet werden und in API- und SDK-Szenarien sehr nützlich sind. Dieses Kapitel beschreibt die Erstellung und Löschung von RustFS-Zugangsschlüsseln.

Voraussetzungen:

- Eine verfügbare RustFS-Instanz. Siehe [Installationsanleitung](../../installation/index.md) für die Installation.

## Zugangsschlüssel erstellen

1. Melden Sie sich in der RustFS UI-Konsole an.
2. Wählen Sie in der linken Navigationsleiste **Zugangsschlüssel** aus.
3. Klicken Sie auf der Zugangsschlüssel-Seite oben rechts auf **Zugangsschlüssel hinzufügen**.
4. Geben Sie die **Ablaufzeit, den Namen und die Beschreibung** des Schlüssels ein und klicken Sie dann auf **Senden**.
5. (Optional, aber empfohlen). Wählen Sie auf der angezeigten Zugangsschlüssel-Seite **Kopieren** oder **Exportieren**, um den Zugangsschlüssel für die spätere Verwendung zu speichern.

![access key list page](images/access_token_creation.png)

## Zugangsschlüssel löschen

1. Melden Sie sich in der RustFS UI-Konsole an.
2. Wählen Sie in der linken Navigationsleiste **Zugangsschlüssel** aus.
3. Wählen Sie auf der Zugangsschlüssel-Seite den zu löschenden Zugangsschlüssel aus.
4. Klicken Sie auf die Schaltfläche **Löschen** rechts neben dem Zugangsschlüssel oder auf **Ausgewählte Elemente löschen** oben rechts, um den Zugangsschlüssel zu löschen.

![access key deletion](images/access_token_deletion.png)