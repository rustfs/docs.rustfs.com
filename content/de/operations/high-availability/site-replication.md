---
title: "Site-Replikation"
description: "Konfigurieren und betreiben Sie die RustFS-Replikation über mehrere Standorte mit dem Kommandozeilenclient rc."
---

Die Site-Replikation verknüpft zwei oder mehr unabhängige **RustFS**-Bereitstellungen. Sie synchronisiert Buckets, Objektversionen und unterstützte Daten der Identitäts- und Zugriffsverwaltung (IAM) über die verknüpften Standorte. Verwenden Sie diesen Ablauf, wenn Anwendungen auf getrennte RustFS-Standorte schreiben müssen und dabei Speicher und Identitätskonfiguration abgeglichen bleiben sollen.

Die Site-Replikation unterscheidet sich von der [Bucket-Replikation](/de/administration/data/bucket/replication). Die Bucket-Replikation ist eine gerichtete Regel zwischen ausgewählten Buckets. Die Site-Replikation stellt eine breitere Beziehung zwischen vollständigen RustFS-Bereitstellungen her.

:::warning[Planen Sie die Wiederherstellung getrennt]

Die Site-Replikation ist asynchron. Ein erfolgreicher Schreibvorgang an einem Standort bestätigt nicht, dass ein anderer Standort die replizierte Version bereits hat. Die Site-Replikation bietet außerdem kein DNS-Failover, keine Verkehrslenkung und keine Orchestrierung der Anwendungswiederherstellung.

:::

## Replizierte Ressourcen

Die RustFS-Site-Replikation synchronisiert diese Ressourcenfamilien über verknüpfte Standorte:

- Buckets und Objektversionen, einschließlich Löschmarkierungen.
- Bucket-Metadaten, die der Ablauf der Site-Replikation benötigt.
- IAM-Benutzer, Gruppen, Richtlinien, Richtlinienzuordnungen und Servicekonten.

Die Unterstützung der Bucket-Versionierung ist an jedem beteiligten Standort erforderlich. RustFS konfiguriert die Standortbeziehung und die zugrunde liegenden Replikationsziele, wenn Sie die Standorte hinzufügen.

## Voraussetzungen

Bereiten Sie vor dem Verknüpfen der Standorte Folgendes vor:

- Zwei oder mehr unabhängige RustFS-Bereitstellungen, die ein Release ausführen, das die Admin-API der Site-Replikation bereitstellt.
- Einen eindeutigen, stabilen S3-API-Endpunkt für jede Bereitstellung.
- Bidirektionale Netzwerkkonnektivität zwischen jedem Standort-Endpunkt auf dem S3-API-Port, normalerweise `9000`.
- Vertrauenswürdige TLS-Zertifikate für Produktionsendpunkte.
- Den RustFS-Client [`rc`](/de/operations/rc) auf einem abgesicherten Administrationshost.
- Root-Anmeldedaten für die Verwaltung jedes beteiligten Standorts.
- Kompatible Unterstützung der Bucket-Versionierung an jedem Standort.

Verwenden Sie leere Teststandorte, wenn Sie den Ablauf zum ersten Mal prüfen. Inventarisieren Sie vor dem Verknüpfen vorhandener Standorte Bucket-Namen, Einstellungen von Object Lock, IAM-Identitäten und Richtlinien auf Konflikte.

:::warning[Schützen Sie administrative Anmeldedaten]

Die Operation `add` löst jeden Peer-Endpunkt und die Root-Anmeldedaten aus Ihrem lokalen Alias-Speicher von `rc` auf. Führen Sie sie nur von einem vertrauenswürdigen Administrationshost aus, beschränken Sie den Zugriff auf die lokale `rc`-Konfiguration und legen Sie Anmeldedaten nicht in der Shell-Historie, in Protokollen oder in Bildschirmfotos ab.

:::

## 1. Standort-Aliase konfigurieren

Konfigurieren Sie einen Alias je Standort. Ersetzen Sie Endpunkt und Anmeldedaten für beide Bereitstellungen:

```bash
rc alias set site1 https://site1.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias set site2 https://site2.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

Prüfen Sie, dass beide Standorte erreichbar und bereit sind:

```bash
rc ready site1
rc ready site2
rc admin info cluster site1
rc admin info cluster site2
```

Verwenden Sie in der Produktion HTTPS-Endpunkte. Wenn ein Standort eine private Zertifizierungsstelle verwendet, installieren Sie diese Zertifizierungsstelle im Vertrauensspeicher des Administrationshosts, bevor Sie fortfahren.

:::warning[Loopback-Endpunkte sind nur für Tests]

RustFS lehnt Loopback-Replikationsziele standardmäßig ab, als Schutz für ausgehende Anfragen. Die Serveroption `RUSTFS_REPLICATION_ALLOW_LOOPBACK_TARGET=true` existiert nur für die Entwicklung auf einem einzelnen Host und für automatisierte Tests. Aktivieren Sie sie in der Produktion niemals.

:::

## 2. Standorte verknüpfen

Übergeben Sie alle beteiligten Aliase in einem Befehl. Der erste Alias empfängt die Verwaltungsanfrage:

```bash
rc admin replicate add site1 site2
```

Um eine Beziehung mit mehr als zwei Standorten anzulegen, nehmen Sie jeden Alias in den ersten Befehl auf:

```bash
rc admin replicate add site1 site2 site3
```

Führen Sie keine getrennten paarweisen `add`-Befehle aus, um dieselbe Beziehung über mehrere Standorte aufzubauen.

Prüfen Sie die entstandene Konfiguration von mindestens zwei Standorten:

```bash
rc admin replicate info site1
rc admin replicate info site2
```

Die Ausgabe identifiziert jede verknüpfte Bereitstellung über ihre Bereitstellungs-ID, den Standortnamen und den Endpunkt. Speichern Sie die Bereitstellungs-IDs, weil Bearbeitung und Resynchronisation einen Standort über die genaue Bereitstellungs-ID oder den genauen eindeutigen Namen auswählen können.

## 3. Replikationsstatus prüfen

Fordern Sie die Standardzusammenfassungen für Buckets und IAM an:

```bash
rc admin replicate status site1
```

Wählen Sie bestimmte Statusabschnitte, wenn Sie ein Problem eingrenzen:

```bash
rc admin replicate status site1 --buckets
rc admin replicate status site1 --users --groups --policies
rc admin replicate status site1 --metrics
```

Prüfen Sie den Status von jedem Standort. Eine intakte Antwort von `site1` bestätigt die Sicht dieses Standorts auf die Beziehung. Sie ersetzt die Prüfung der anderen Bereitstellungen nicht.

## 4. Daten- und IAM-Replikation prüfen

Legen Sie am ersten Standort einen Test-Bucket und ein Testobjekt an:

```bash
rc bucket create site1/my-bucket
printf 'hello rustfs\n' > hello.txt
rc object copy hello.txt site1/my-bucket/hello.txt
```

Fragen Sie den zweiten Standort ab, bis das Objekt erscheint:

```bash
rc object stat site2/my-bucket/hello.txt
rc object copy site2/my-bucket/hello.txt ./hello-from-site2.txt
```

Vergleichen Sie den heruntergeladenen Inhalt, bevor Sie den Datenpfad als geprüft behandeln:

```bash
cmp hello.txt hello-from-site2.txt
```

Legen Sie für die IAM-Prüfung an einem Standort einen temporären Benutzer an und hängen Sie eine Testrichtlinie an. Sehen Sie danach Benutzer und Richtlinienzuordnung an einem anderen Standort ein. Entfernen Sie die temporäre Identität nach der Prüfung:

```bash
rc admin user add site1 replication-test <temporary-secret-key>
rc admin policy attach site1 readonly --user replication-test

rc admin user info site2 replication-test
rc admin policy entities site2 --user replication-test

rc admin user rm site1 replication-test
```

Verwenden Sie ein zufällig erzeugtes temporäres Geheimnis und verwenden Sie keine Anmeldedaten einer Anwendung oder eines Administrators wieder.

## 5. Einen Standort bearbeiten

Verwenden Sie `edit`, wenn sich Name, Endpunkt oder TLS-Vertrauenseinstellungen eines verknüpften Standorts ändern. Sehen Sie zuerst die aktuellen Bereitstellungs-IDs und Namen ein:

```bash
rc admin replicate info site1
```

Benennen Sie einen Standort um:

```bash
rc admin replicate edit site1 \
	--site <deployment-id> \
	--name site2-dr \
	--yes
```

Ersetzen Sie einen Endpunkt und lassen Sie die TLS-Prüfung aktiviert:

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--endpoint https://site2-dr.example.com:9000 \
	--verify-tls \
	--yes
```

Geben Sie für eine private Zertifizierungsstelle ein PEM-Bündel an, das nur Zertifikate enthält:

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--ca-cert ./site2-ca.pem \
	--yes
```

Löschen Sie eine zuvor konfigurierte eigene Zertifizierungsstelle, wenn der Endpunkt zu einem Zertifikat wechselt, dem der Systemvertrauensspeicher vertraut:

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--clear-ca-cert \
	--verify-tls \
	--yes
```

Der Endpunkt muss ein HTTP- oder HTTPS-Ursprung ohne Pfad, Abfrage, Fragment oder eingebettete Anmeldedaten sein. Bevorzugen Sie ein vertrauenswürdiges Zertifikat gegenüber `--skip-tls-verify`.

## 6. Einen Standort neu synchronisieren

Verwenden Sie die Resynchronisation, nachdem Sie einen Standort repariert haben, der nicht verfügbar war, oder wenn Statusprüfungen fehlenden replizierten Zustand zeigen. Starten Sie eine Resynchronisation für genau einen Peer:

```bash
rc admin replicate resync start site1 \
	--site <deployment-id> \
	--yes
```

Lesen Sie den zuletzt persistierten Resynchronisations-Snapshot:

```bash
rc admin replicate resync status site1 \
	--site <deployment-id>
```

Brechen Sie die ausgewählte Resynchronisation nur ab, wenn Sie bestätigt haben, dass sie stoppen soll:

```bash
rc admin replicate resync cancel site1 \
	--site <deployment-id> \
	--yes
```

:::warning[Der Status der Resynchronisation zeigt keinen laufenden Fortschritt]

Der aktuelle Statusendpunkt der RustFS-Resynchronisation liefert das persistierte Ergebnis der letzten Start- oder Abbruchanfrage. Er sieht keine laufenden Worker, und sein Lebenszykluszustand wird als unbekannt gemeldet. Startvorgänge können sich überlappen, der Abbruch ist nicht idempotent, und ein Netzwerk-Zeitlimit kann das Ergebnis der Änderung unbekannt lassen. Sehen Sie nach einem mehrdeutigen Ergebnis `replicate info`, `replicate status` und die Zieldaten ein, bevor Sie eine weitere Änderung auslösen.

:::

## 7. Site-Replikation entfernen

Das Entfernen eines Standorts ändert die Replikationsbeziehung. Es bietet keine Anwendungsumschaltung und belegt nicht, dass jedes eingereihte Objekt angekommen ist. Prüfen Sie den Status und bewahren Sie alle benötigten Daten auf, bevor Sie fortfahren.

Entfernen Sie einen benannten Standort:

```bash
rc admin replicate remove site1 --site site2-dr
```

Wiederholen Sie `--site`, um mehrere benannte Standorte in einer Anfrage zu entfernen:

```bash
rc admin replicate remove site1 \
	--site site2-dr \
	--site site3
```

Lösen Sie die vollständige Beziehung der Site-Replikation auf:

```bash
rc admin replicate remove site1 --all
```

Prüfen Sie das Ergebnis von den verbleibenden Bereitstellungen:

```bash
rc admin replicate info site1
rc admin replicate status site1
```

## Fehlerbehebung

### Ein Peer-Endpunkt wird abgelehnt

Bestätigen Sie, dass der Endpunkt ein erreichbarer HTTP- oder HTTPS-Ursprung ist und nicht auf Loopback auflöst. Machen Sie in der Produktion jeden Standort über seine stabile Netzwerkadresse erreichbar und lassen Sie die Loopback-Überschreibung deaktiviert.

### Die TLS-Prüfung schlägt fehl

Bestätigen Sie, dass das Endpunktzertifikat den Hostnamen des Peers enthält und dass der Zertifizierungsstelle, die es ausgestellt hat, vertraut wird. Verwenden Sie `replicate edit --ca-cert` für ein Bündel einer privaten Zertifizierungsstelle. Machen Sie `--skip-tls-verify` nicht zur dauerhaften Abhilfe.

### Eine Änderung läuft in ein Zeitlimit

Wiederholen Sie `add`, `edit`, `resync start`, `resync cancel` oder `remove` nicht sofort. Der Server kann die Änderung angewendet haben, bevor der Client die Antwort verloren hat. Sehen Sie zuerst die Beziehung und die Daten ein:

```bash
rc admin replicate info site1
rc admin replicate status site1
```

### Die Replikation fällt zurück

Prüfen Sie Standortstatus und Metriken von jeder Bereitstellung und prüfen Sie dann Erreichbarkeit der Endpunkte und Speicherbereitschaft:

```bash
rc admin replicate status site1 --metrics
rc ready site1
rc ready site2
```

Schreibvorgänge der Anwendung können der asynchronen Replikation vorauseilen. Leiten Sie kein Wiederherstellungsziel (Recovery Point Objective) aus einer einzelnen Statusprobe ab. Messen Sie die Verzögerung unter Ihrer Last und alarmieren Sie bei anhaltendem Rückstand.

## Nächste Schritte

- Lesen Sie [Bucket-Replikation](/de/administration/data/bucket/replication), wenn Sie gerichtete Replikation für ausgewählte Buckets brauchen statt einer vollständigen Standortbeziehung.
- Überwachen Sie an jedem Standort [Clusterstatus und Bereitschaft](/de/operations/status-check).
- Lesen Sie die [`rc`-Befehlsanleitung](/de/operations/rc) und halten Sie den Client auf dem Release des RustFS-Servers.
