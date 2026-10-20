---
title: "Rebalancing"
description: "Verteilen Sie vorhandene Objekte über aktive RustFS-Speicherpools neu, über die Console oder mit rc."
---

## Überblick

### Voraussetzungen

- Installieren Sie [`rc`](/de/operations/rc) auf dem Administrationshost, bevor Sie den `rc`-Ablauf in dieser Anleitung verwenden.
- Konfigurieren Sie Zugangsdaten mit der Berechtigung zur Rebalancing-Verwaltung.

Nach der [Speicherpool-Erweiterung](./storage-pool-expansion.md) können neue Schreibvorgänge die zusätzliche Kapazität nutzen. Vorhandene Objekte bleiben in ihren ursprünglichen Speicherpools. **Rebalancing** verschiebt vorhandene Objekte über alle aktiven Speicherpools, sodass sich die Verhältnisse der genutzten Kapazität angleichen.

Rebalancing erfordert mindestens zwei aktive Speicherpools. RustFS lehnt ein neues Rebalancing ab, solange ein anderes Rebalancing oder eine Speicherpool-Außerbetriebnahme läuft. Wenn Sie ein Rebalancing stoppen, werden bereits verlagerte Objekte nicht in ihre ursprünglichen Speicherpools zurückverschoben.

Prüfen Sie vor dem Start, dass alle Knoten und Laufwerke betriebsbereit sind, keine Außerbetriebnahme aktiv ist und der Cluster während des Vorgangs genug freie Kapazität für normale Schreibvorgänge hat. Planen Sie den Vorgang in eine Zeit mit geringerer Last, weil die Objektverschiebung Laufwerks-, Netzwerk- und CPU-Ressourcen verbraucht.

## Ablauf

### Rebalancing in der Console starten

1. Melden Sie sich an der RustFS Console (Weboberfläche) mit einem Konto an, das die Berechtigung zur Rebalancing-Verwaltung hat.
2. Öffnen Sie **Rebalance** (Rebalancing).
3. Prüfen Sie die aktiven Speicherpools und die Verhältnisse der genutzten Kapazität.
4. Wählen Sie **Start Rebalance** (Rebalancing starten) und bestätigen Sie den Vorgang.
5. Lassen Sie die Seite geöffnet oder kehren Sie regelmäßig dorthin zurück, um den Fortschritt je Speicherpool zu prüfen.
6. Verwenden Sie **Stop Rebalance** (Rebalancing stoppen) nur, wenn Sie den Vorgang anhalten müssen. Bereits verschobene Daten bleiben im neuen Speicherpool.

![RustFS Console mit laufendem Rebalancing, verschobenen Bytes und Objekten](./images/rebalance-running-console.png)

### Rebalancing mit rc starten

Konfigurieren Sie den Cluster-Alias, falls er noch nicht existiert:

```bash
rc alias set rustfs http://<server-ip>:9000 <your-access-key> <your-secret-key>
```

Starten Sie das Rebalancing:

```bash
rc admin rebalance start rustfs
```

Prüfen Sie den Fortschritt:

```bash
rc admin rebalance status rustfs
```

Der Status enthält die Vorgangs-ID sowie je Speicherpool die Nutzung, verschobene Bytes, Objekt- und Versionszahlen, verbleibende Buckets, die vergangene Zeit und, falls verfügbar, die geschätzte Abschlusszeit.

So stoppen Sie ein laufendes Rebalancing:

```bash
rc admin rebalance stop rustfs
```

`rc admin expand start|status|stop` und der Alias `scale` stellen denselben Rebalancing-Ablauf nach einer Erweiterung bereit.

## Überprüfung

### Rebalancing in der Console prüfen

Warten Sie, bis die Seite **Rebalance** den Status `Completed` meldet. Bestätigen Sie Folgendes:

![RustFS Console mit abgeschlossenem Rebalancing und ausgeglichener Speichernutzung der Speicherpools](./images/rebalance-completed-console.png)

- Kein Speicherpool meldet einen fehlgeschlagenen oder gestoppten Zustand.
- Die Verhältnisse der genutzten Kapazität liegen über die aktiven Speicherpools hinweg näher beieinander.
- Alle Knoten und Laufwerke bleiben online.
- Normale Lese- und Schreibvorgänge für Objekte gelingen.

### Rebalancing mit rc prüfen

Führen Sie aus:

```bash
rc admin rebalance status rustfs
rc admin pool list rustfs
```

Prüfen Sie, dass der Rebalancing-Status `Completed` ist, die Zahl der verbleibenden Buckets null ist und kein Fehler gemeldet wird. Vergleichen Sie die Nutzungsverhältnisse je Speicherpool mit den vor dem Vorgang notierten Werten. Lesen Sie anschließend ein vorhandenes Objekt und schreiben Sie ein neues Testobjekt über den S3-Endpunkt.
