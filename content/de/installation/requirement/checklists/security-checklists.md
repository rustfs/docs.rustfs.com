---
title: "Sicherheits-Checkliste"
description: "Diese Checkliste fasst die Sicherheitsanforderungen für Unternehmensbereitstellungen zusammen."
---

> Bewährte Sicherheitspraktiken für RustFS. Prüfen Sie diese Checkliste während der Bereitstellung, damit das System sicher und zuverlässig bleibt.

## Authentifizierung und Zugriffskontrolle

- **S3-kompatible Schlüsselauthentifizierung verwenden**
  RustFS verwendet AWS Signature V4. Stellen Sie sicher, dass alle Anfragen mit einem gültigen Zugriffsschlüssel und einem gültigen geheimen Zugriffsschlüssel signiert sind.

- **Richtlinienbasierte Zugriffskontrolle**
  Definieren Sie Zugriffsrichtlinien nach dem Prinzip der geringsten Berechtigung. Legen Sie erlaubte Operationen ausdrücklich fest und verweigern Sie alle übrigen standardmäßig.

## Verschlüsselung (TLS/SSL)

- **TLS/SSL aktivieren**
  Konfigurieren Sie gültige TLS-Zertifikate. Wir empfehlen, für den externen und den internen Zugriff unterschiedliche Zertifikate zu verwenden und TLS 1.2+ zu erzwingen.

- **Zertifikatsverwaltung**
  Verwenden Sie Zertifikate vertrauenswürdiger CAs. Schützen Sie die privaten Schlüssel durch strikte Dateiberechtigungen.

- **Mehrere Domänen und Verschlüsselungssuiten**
  Verwenden Sie für jede Domäne ein eigenes Zertifikat. Verwenden Sie starke Schlüsselalgorithmen (zum Beispiel RSA mit 2048 Bit oder ECDSA P-256).

## Schutz der Zugangsdaten

- **Standardzugangsdaten ändern**
  Belassen Sie die Beispielplatzhalter (`<your-access-key>` / `<your-secret-key>`) niemals in der Produktion. Legen Sie unmittelbar nach der Initialisierung einen eindeutigen Zugriffsschlüssel und einen starken, zufälligen geheimen Zugriffsschlüssel fest — erzeugen Sie einen zum Beispiel mit `openssl rand -base64 24`.

- **Sichere Ablage**
  Hinterlegen Sie Zugangsdaten nicht fest im Code. Verwenden Sie Umgebungsvariablen oder eine Geheimnisverwaltung (zum Beispiel Kubernetes Secrets).

## Protokollierung und Audit

- **Audit-Protokolle aktivieren**
  Exportieren Sie Audit-Protokolle in externe Systeme (HTTP-Webhook, Kafka, ELK, Splunk).

- **Protokollerfassung**
  Erfassen Sie Protokolle mit Standardwerkzeugen (journald, Docker, Kubernetes) und werten Sie sie mit ELK oder Grafana Loki aus.

- **Überwachung und Alarme**
  Richten Sie Alarme für auffälliges Verhalten ein (fehlgeschlagene Anmeldungen, ungewöhnliche Zugriffsmuster, Massenlöschungen).

- **Observability**
  Überwachen Sie die Anfragelatenz, um Leistungsprobleme zu erkennen.

## API-Sicherheit

- **Netzwerkzugriff einschränken**
  Schränken Sie den Zugriff auf die S3-API (Port 9000) und die Console (Weboberfläche, Port 9001) mit Firewalls oder Sicherheitsgruppen ein.

- **Netzwerkisolierung**
  Verwenden Sie Reverse-Proxys (zum Beispiel Nginx), statt die Speicherknoten direkt offenzulegen.

- **Unnötige Ports schließen**
  Deaktivieren Sie ungenutzte Ports und legen Sie Verwaltungsschnittstellen nicht im öffentlichen Internet offen.

## WORM-Konformität

- **Versionierung und Object Lock**
  Aktivieren Sie die Versionierung und Object Lock, um aufsichtsrechtliche Anforderungen zu erfüllen.

## Aktualisierungen

- **Patches einspielen**
  Prüfen Sie regelmäßig auf Aktualisierungen von RustFS und spielen Sie sie ein.

- **Unterbrechungsfreie Upgrades**
  Verwenden Sie den fortlaufenden Neustart (Rolling Restart) für Upgrades ohne Ausfallzeit.

- **Betriebssystem und Abhängigkeiten**
  Halten Sie das Betriebssystem und die Abhängigkeiten (zum Beispiel OpenSSL) aktuell.

---

Prüfen Sie diese Checkliste regelmäßig, um eine sichere RustFS-Bereitstellung aufrechtzuerhalten.
