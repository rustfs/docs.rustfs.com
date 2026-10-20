---
title: "Software-Checkliste"
description: "Diese Seite beschreibt die Softwareanforderungen und die zugehörigen Hinweise."
---

Stellen Sie vor der Bereitstellung sicher, dass die folgenden Anforderungen erfüllt sind.

## Anforderungen an das Betriebssystem

- **Betriebssystem**: Verwenden Sie LTS-Versionen (Ubuntu 20.04+, RHEL 8/9).
- **Kernel**: Linux 5.x+ wird empfohlen.
- **CPU und Arbeitsspeicher**: x86_64 oder ARM. Mindestens 2 GB RAM für Tests, mindestens 64 GB für die Produktion.
- **Störende Dienste deaktivieren**: Deaktivieren Sie Dienste zur Dateiindizierung und zur Auditierung (zum Beispiel `mlocate`, `auditd`, Virenschutz), damit sie die I/O nicht stören.

> **Warum Linux 5.x+?**
> Aktuelle LTS-Kernel bringen ausgereiftes asynchrones I/O und Verbesserungen des Dateisystems mit. RustFS bietet zusätzlich einen optionalen Lesepfad über `io_uring` (`RUSTFS_IO_URING_READ_ENABLE`, standardmäßig deaktiviert), der Linux 5.10 oder neuer voraussetzt, um wirksam zu sein.

## Bereitstellung der Binärdatei

- **Offizielle Bezugsquelle**: Laden Sie Binärdateien nur über die offiziellen Kanäle von RustFS herunter.
- **Prüfsummenprüfung**: Prüfen Sie die SHA256-Prüfsummen.
- **Einheitlichkeit**: Stellen Sie sicher, dass alle Knoten dieselbe RustFS-Version ausführen.
- **Installationsort**: Legen Sie die Binärdateien unter `/usr/local/bin` ab und stellen Sie sicher, dass sie ausführbar sind (`chmod +x`).

## Dateisystem und Datenträger

- **Dedizierte Speicherdatenträger**: Verwenden Sie dedizierte Datenträger für RustFS-Daten. Teilen Sie sie nicht mit dem Betriebssystem.
- **Dateisystem**: Verwenden Sie XFS oder ext4 mit leistungsorientierten Einhängeoptionen wie `noatime`.
- **Datenträgerkonfiguration**: Verwenden Sie JBOD (unabhängige Volumes). Verwenden Sie kein Hardware-RAID.
- **Berechtigungen**: Stellen Sie sicher, dass der RustFS-Benutzer Lese- und Schreibzugriff auf die Datenverzeichnisse hat.

## Abhängigkeiten

- **Zeitsynchronisation**: Synchronisieren Sie die Uhrzeit auf allen Knoten mit `ntp` oder `chrony`.
- **Hostname und DNS**: Konfigurieren Sie dauerhafte Hostnamen und stellen Sie eine korrekte DNS-Auflösung sicher.
- **Netzwerkverbindung**: Stellen Sie sicher, dass alle Knoten über den RustFS-Port kommunizieren können (Standard 9000).
- **TLS und Zertifikate**: Installieren Sie Stammzertifikate und bereiten Sie Serverzertifikate vor, wenn Sie HTTPS verwenden.
- **Pakete**: Stellen Sie sicher, dass die Standardwerkzeuge (`bash`, `glibc`, `openssl`) installiert sind.

## Benutzer und Sicherheit

- **Dedizierter Benutzer**: Führen Sie RustFS unter einem dedizierten Benutzer aus (zum Beispiel `rustfs-user`).
- **Dateiberechtigungen**: Schränken Sie den Zugriff auf Binärdateien und Konfigurationsdateien ein.
- **SELinux/AppArmor**: Konfigurieren Sie Richtlinien, die RustFS-Operationen erlauben, oder deaktivieren Sie sie, wenn das angemessen ist.
- **systemd**: Konfigurieren Sie die systemd-Dienstdatei korrekt (`User=`, `ExecStart=`, Umgebungsvariablen).

## Weiteres

- **Überwachung**: Konfigurieren Sie Prometheus und Grafana.
- **Rücknahmeplan**: Bereiten Sie Sicherungen der Konfiguration und einen Rücknahmeplan vor.
