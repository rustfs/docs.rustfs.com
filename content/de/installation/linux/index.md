---
title: "RustFS unter Linux installieren"
description: "Wählen Sie einen Linux-Bereitstellungsmodus — SNSD, SNMD oder MNMD — und installieren Sie RustFS auf einem oder mehreren Servern."
---

Dieser Abschnitt beschreibt die Installation von RustFS auf Linux-Servern. Für eine Testinstallation mit einem Befehl verwenden Sie den [Schnellstart](./quick-start.md). Für eine manuelle Installation wählen Sie einen der drei Bereitstellungsmodi unten. Alle drei verwenden dieselben [Voraussetzungen und die Diensteinrichtung](./prerequisites-and-service.md) und unterscheiden sich nur in der Topologie und der Konfiguration der Volumes.

:::warning[Standardzugangsdaten sofort ändern]

Tragen Sie nach der Installation eindeutige Werte für `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` in `/etc/default/rustfs` ein. Verwenden Sie den allgemein bekannten Wert `rustfsadmin` weder als Zugriffsschlüssel noch als geheimen Zugriffsschlüssel. Starten Sie den Dienst nach der Änderung der Datei mit `sudo systemctl restart rustfs` neu.

:::

## Einzelner Knoten mit einem Datenträger (SNSD)

Ein Server, ein Datenträger. Der einfachste Modus, ohne Redundanz: Ein Datenträgerausfall bedeutet Datenverlust. Verlassen Sie sich daher auf Sicherungen. Geeignet für Entwicklung, Tests und kleine, nicht kritische Arbeitslasten.

→ [Installation mit einem Knoten und einem Datenträger](./single-node-single-disk.md)

## Einzelner Knoten mit mehreren Datenträgern (SNMD)

Ein Server, mehrere Datenträger. Erasure Coding verteilt die Daten als Shards auf die Datenträger. Der Knoten toleriert dadurch eine begrenzte Zahl von Datenträgerausfällen, der Ausfall des gesamten Servers bedeutet jedoch weiterhin Datenverlust. Geeignet für mittlere, nicht kritische Arbeitslasten auf einem Rechner.

→ [Installation mit einem Knoten und mehreren Datenträgern](./single-node-multiple-disk.md)

## Mehrere Knoten mit mehreren Datenträgern (MNMD)

Vier oder mehr Server mit jeweils einem oder mehreren Datenträgern. Erasure Coding erstreckt sich über die Server und bietet Fehlertoleranz auf Datenträger- und Knotenebene sowie horizontale Skalierbarkeit. Das ist der Modus für Produktionsarbeitslasten.

→ [Installation mit mehreren Knoten und mehreren Datenträgern](./multiple-node-multiple-disk.md)

## Vor dem Produktivbetrieb

Arbeiten Sie die [Checklisten vor der Installation](../requirement/checklists/index.md) durch — Hardware, Netzwerk, Software und Sicherheit —, bevor Sie in der Produktion bereitstellen. Für Bereitstellungen außerhalb der Produktion können Sie sie überspringen.
