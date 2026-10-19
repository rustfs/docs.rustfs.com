---
title: "Versionierung"
description: "Aktivieren Sie die Bucket-Versionierung, stellen Sie frühere Objektversionen wieder her und verwalten Sie Löschmarker mit rc und der Console."
---

Die Bucket-Versionierung von RustFS bewahrt mehrere Versionen desselben Objektschlüssels auf. Damit stellen Sie versehentliche Überschreibungen und Löschungen wieder her und erfüllen Voraussetzungen für Object Lock und die Bucket-Replikation.

## Überblick

Wenn die Versionierung aktiviert ist:

- Jeder Upload oder jede Kopie auf einen vorhandenen Objektschlüssel erzeugt eine neue Versions-ID.
- Ein normales Löschen erzeugt einen Löschmarker, anstatt ältere Versionen zu entfernen.
- Das Lesen des Objektschlüssels ohne Versions-ID gibt die letzte sichtbare Version zurück oder `NotFound`, wenn der letzte Eintrag ein Löschmarker ist.
- Das Lesen oder Löschen einer bestimmten Version erfordert ihre Versions-ID.

Das Aussetzen der Versionierung beendet das normale Erzeugen neuer Versions-IDs, bewahrt aber vorhandene Versionen und Löschmarker. Aussetzen ist nicht dasselbe wie das Deaktivieren oder Entfernen der Versionshistorie.

## In der Console konfigurieren

### Beim Erstellen des Buckets aktivieren

1. Öffnen Sie **Buckets** und wählen Sie **Create Bucket** (Bucket erstellen).
2. Geben Sie den Bucket-Namen ein.
3. Aktivieren Sie **Version** (Versionierung).
4. Wählen Sie **Create** (Erstellen).

### Versionierung eines vorhandenen Buckets aktivieren oder aussetzen

1. Öffnen Sie **Buckets**, suchen Sie den Bucket und wählen Sie **Settings** (Einstellungen).
2. Suchen Sie unter **Data Protection** (Datenschutz) den Eintrag **Versioning** (Versionierung).
3. Aktivieren Sie die Versionierung oder setzen Sie sie nach Bedarf aus.

Die Einstellungsseite meldet `Enabled`, `Suspended` oder `Disabled`. Sie weist außerdem darauf hin, dass das Aussetzen vorhandene Versionen bewahrt.

### Versionen durchsuchen und wiederherstellen

1. Öffnen Sie den Bucket und aktivieren Sie **Show Deleted Objects** (Gelöschte Objekte anzeigen), wenn Sie Objektschlüssel sehen müssen, die durch Löschmarker verborgen sind.
2. Wählen Sie einen Objektnamen, um **Object Details** (Objektdetails) zu öffnen.
3. Wählen Sie **Versions** (Versionen), um verfügbare Versionen und Löschmarker anzuzeigen.
4. Laden Sie die benötigte Version herunter und laden Sie sie erneut hoch, damit ihr Inhalt die neueste Version wird.

## `rc` verwenden

Erstellen Sie einen Bucket und aktivieren Sie die Versionierung:

```bash
rc bucket create rustfs/my-bucket
rc bucket version enable rustfs/my-bucket
rc bucket version info rustfs/my-bucket
```

Laden Sie zwei Versionen desselben Objektschlüssels hoch:

```bash
printf 'version one\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt rustfs/my-bucket/hello.txt

printf 'version two\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt rustfs/my-bucket/hello.txt --overwrite
```

Listen Sie die Versionen auf und notieren Sie die Versions-ID, die Sie wiederherstellen möchten:

```bash
rc bucket version list rustfs/my-bucket/hello.txt --json
rc object stat rustfs/my-bucket/hello.txt \
	--version-id <version-id> --json
```

Stellen Sie eine frühere Version wieder her, indem Sie ihren Inhalt herunterladen und als neue neueste Version hochladen:

```bash
rc object show rustfs/my-bucket/hello.txt \
	--version-id <version-id> > /tmp/hello-restored.txt

rc object copy /tmp/hello-restored.txt \
	rustfs/my-bucket/hello.txt --overwrite
```

Löschen Sie den aktuellen Objektschlüssel, um einen Löschmarker zu erzeugen, und zeigen Sie ihn anschließend an:

```bash
rc object remove rustfs/my-bucket/hello.txt --force
rc bucket version list rustfs/my-bucket/hello.txt --json
```

Der neueste Eintrag sollte `is_delete_marker: true` anzeigen. Die früheren Versionen bleiben über die Versions-ID verfügbar.

Setzen Sie die Versionierung aus, wenn normale Schreibvorgänge keine neuen nummerierten Versionen mehr erzeugen sollen:

```bash
rc bucket version suspend rustfs/my-bucket
rc bucket version info rustfs/my-bucket
```

:::warning[Grenze beim Löschen von Versionen in rc 0.1.29]

`rc object remove --versions` steht in der Hilfe von `rc 0.1.29`, gibt bei der Ausführung aber `not implemented` zurück. Verwenden Sie die Console oder ein S3-SDK, um ausgewählte Versions-IDs dauerhaft zu löschen. Entfernen Sie eine vollständige Versionshistorie nur, wenn Sie Aufbewahrung, Replikation und Wiederherstellungsanforderungen geprüft haben.

:::

## Überprüfung

Nachdem Sie die Versionierung aktiviert haben:

1. Laden Sie denselben Objektschlüssel zweimal mit unterschiedlichem Inhalt hoch.
2. Führen Sie `rc bucket version list` aus und prüfen Sie, dass beide Einträge unterschiedliche Versions-IDs haben.
3. Rufen Sie jede Version mit `rc object show --version-id` ab und vergleichen Sie den Inhalt.
4. Löschen Sie den Objektschlüssel ohne Versions-ID und prüfen Sie, dass ein Löschmarker erscheint.
5. Rufen Sie eine ältere Version über die Versions-ID ab, um zu bestätigen, dass sie wiederherstellbar bleibt.

## Betriebliche Hinweise

- Die Versionierung erhöht den Speicherverbrauch, weil Überschreibungen und Löschungen ältere Daten behalten.
- Konfigurieren Sie Lebenszyklusregeln für nicht aktuelle Versionen erst, nachdem Sie Wiederherstellungs- und Aufbewahrungszeiträume festgelegt haben.
- Die Bucket-Replikation erfordert Versionierung auf dem Quell- und auf dem Ziel-Bucket.
- Object Lock setzt Versionierung voraus und schützt einzelne Versionen.
- Der Abschluss eines mehrteiligen Uploads erzeugt in einem versionierten Bucket eine neue Objektversion.

## Nächste Schritte

- [Versionen mit Object Lock schützen](./object-lock.md)
- [Große Objekte hochladen](./multipart-upload.md)
- [Bucket-Lebenszyklus verwalten](../lifecycle-management.md)
