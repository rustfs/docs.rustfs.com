---
title: "Object Lock"
description: "Schützen Sie versionierte Objekte mit Aufbewahrungszeiträumen und Legal Holds vor dem Löschen."
---

Object Lock von RustFS schützt einzelne Objektversionen nach dem Prinzip Write once, read many. Verwenden Sie Aufbewahrungszeiträume für einen zeitlich begrenzten Schutz und Legal Hold für einen Schutz ohne vorgegebenes Ablaufdatum.

## Überblick

Object Lock erfordert die Bucket-Versionierung. Sie können es beim Erstellen eines Buckets aktivieren oder die S3-API `PutObjectLockConfiguration` für einen vorhandenen Bucket verwenden, dessen Versionierung aktiviert ist. Jede Überschreibung erzeugt eine neue Version. Aufbewahrung und Legal Hold schützen eine bestimmte Version und nicht den Objektschlüssel als Ganzes.

| Schutz | Verhalten |
| --- | --- |
| `GOVERNANCE`-Aufbewahrung | Blockiert das Löschen und das Verkürzen der Aufbewahrung, es sei denn, der Aufrufer hat die Bypass-Berechtigung und fordert einen Bypass ausdrücklich an. Die Aufbewahrung kann ohne Bypass verlängert werden. |
| `COMPLIANCE`-Aufbewahrung | Blockiert das Löschen auch mit Governance-Bypass. Das Datum kann verlängert, aber nicht verkürzt werden. |
| Legal Hold | Blockiert das Löschen, bis der Hold auf `OFF` gesetzt wird. Er hat kein Ablaufdatum, und ein Governance-Bypass setzt ihn nicht außer Kraft. |

Das Löschen eines Objektschlüssels ohne Versions-ID erzeugt einen Löschmarker. Die geschützte Version bleibt gespeichert und kann weiterhin über die Versions-ID abgerufen werden.

:::danger[Planen Sie die Aufbewahrung, bevor Sie sie aktivieren]

Die COMPLIANCE-Aufbewahrung kann vor dem Retain-until-Datum weder umgangen noch verkürzt werden. Testen Sie Richtlinien in einem Bucket außerhalb der Produktion und prüfen Sie Zeitsynchronisation, Berechtigungen, Lebenszyklusregeln, Replikation und Sicherungsverfahren, bevor Sie Produktionsdaten schützen.

:::

## In der Console konfigurieren

1. Melden Sie sich an der RustFS-Console an und öffnen Sie **Buckets**.
2. Wählen Sie **Create Bucket** (Bucket erstellen) und geben Sie den Bucket-Namen ein.
3. Aktivieren Sie **Object Lock**. Die Console aktiviert zusätzlich **Version** (Versionierung), weil Object Lock Versionierung erfordert.
4. Aktivieren Sie **Retention** (Aufbewahrung), wenn die Aufbewahrung automatisch auf neue Objektversionen angewendet werden soll.
5. Wählen Sie **COMPLIANCE** oder **GOVERNANCE**, geben Sie den Aufbewahrungszeitraum ein und wählen Sie **Day** (Tag) oder **Year** (Jahr).
6. Wählen Sie **Create** (Erstellen).

![Dialog Bucket erstellen mit aktivierter Versionierung, Object Lock und Standardaufbewahrung](./images/object-lock-create-bucket.png)

Die Console zeigt anfangs `180` Tage an, wenn die Standardaufbewahrung aktiviert ist. Ersetzen Sie den Wert durch den Zeitraum, den Ihre Aufbewahrungsrichtlinie verlangt. Es handelt sich um einen Anfangswert der Oberfläche und nicht um eine allgemeine Empfehlung.

Um ein geschütztes Objekt anzuzeigen, öffnen Sie den Bucket, wählen Sie den Objektnamen und verwenden Sie die Registerkarten **Versions** (Versionen) und **Info**. Die Registerkarte Info zeigt die Felder **Legal Hold** und **RetentionPolicy**.

## `rc` verwenden

Konfigurieren Sie einen Alias, bevor Sie diese Beispiele ausführen:

```bash
rc alias set rustfs http://localhost:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

:::note[Grenze beim Erstellen von Buckets in rc 0.1.29]

`rc bucket create --with-lock` und `--with-versioning` erscheinen in der Hilfe von `rc 0.1.29`, geben bei der Ausführung aber `not implemented` zurück. Erstellen Sie den Object-Lock-Bucket in der Console. Die unten gezeigten Upload-Header werden unterstützt und wurden gegen RustFS geprüft.

:::

Laden Sie eine Objektversion mit GOVERNANCE-Aufbewahrung hoch. Geben Sie beide Aufbewahrungsheader zusammen an und verwenden Sie einen RFC-3339-Zeitstempel in UTC in der Zukunft:

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	-H "x-amz-object-lock-mode:GOVERNANCE" \
	-H "x-amz-object-lock-retain-until-date:2027-01-01T00:00:00Z"
```

Laden Sie eine Objektversion mit aktiviertem Legal Hold hoch:

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/legal-hold.txt \
	-H "x-amz-object-lock-legal-hold:ON"
```

Listen Sie die geschützten Versionen auf und rufen Sie die Metadaten einer bestimmten Version ab (Head):

```bash
rc bucket version list rustfs/my-bucket --json
rc object stat rustfs/my-bucket/hello.txt \
	--version-id <version-id> --json
```

`rc 0.1.29` bietet keine Befehle, um die Aufbewahrung zu ändern oder einen vorhandenen Legal Hold zwischen `ON` und `OFF` umzuschalten. Verwenden Sie dafür die Console oder ein S3-SDK.

## Schutz prüfen

1. Laden Sie ein Testobjekt mit GOVERNANCE-Aufbewahrung oder Legal Hold hoch.
2. Notieren Sie seine Versions-ID mit `rc bucket version list`.
3. Versuchen Sie, genau diese Version über einen S3-Client ohne Bypass zu löschen. RustFS muss `AccessDenied` zurückgeben, solange der Schutz aktiv ist.
4. Prüfen Sie, dass die Version in der Console und über `rc object stat --version-id` sichtbar bleibt.

Testen Sie den Bypass bei GOVERNANCE-Aufbewahrung nur mit einer eigenen administrativen Identität, die `s3:BypassGovernanceRetention` besitzt. COMPLIANCE-Aufbewahrung und Legal Hold bleiben vor einem Governance-Bypass geschützt.

## Betriebliche Hinweise

- Die Standardaufbewahrung des Buckets wird berechnet, wenn eine neue Objektversion oder ein mehrteiliger Upload begonnen wird.
- Das Kopieren eines Objekts erzeugt eine neue Zielversion. Die Aufbewahrungsrichtlinie des Ziels gilt unabhängig.
- Das Aussetzen der Versionierung ist für einen Object-Lock-Bucket nicht geeignet.
- Der Lebenszyklusablauf kann eine Version nicht entfernen, solange Aufbewahrung oder Legal Hold das Löschen blockieren.
- Replikationsziele für gesperrte Objekte müssen ein kompatibles Object-Lock-Verhalten unterstützen.

## Nächste Schritte

- [Objektversionen verwalten](./versioning.md)
- [Bucket-Replikation konfigurieren](../bucket/replication.md)
- [Sicherheitscheckliste prüfen](/de/installation/requirement/checklists/security-checklists)
