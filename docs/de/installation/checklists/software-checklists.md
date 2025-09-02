---
title: "Software-Checkliste"
description: "Dieser Artikel erklärt hauptsächlich die wichtigsten Punkte bei der Installation von RustFS, einschließlich Betriebssystem, Binärpakete usw."
---

# RustFS Software-Bereitstellungs-Checkliste

RustFS ist ein leistungsstarker verteilter Objektspeicher, der 100% kompatibel mit dem S3-Protokoll ist und unter der Apache 2.0 Open-Source-Lizenz veröffentlicht wird ([Was ist RustFS?](https://rustfs.com/docs/#:~:text=RustFS%E6%98%AF%E4%B8%80%E7%A7%8D%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%EF%BC%8C%E4%BD%BF%E7%94%A8Apache2%20%E8%AE%B8%E5%8F%AF%E8%AF%81%E5%8F%91%E8%A1%8C%E7%9A%84%E5%BC%80%E6%BA%90%E5%88%86%E5%B8%83%E5%BC%8F%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E3%80%82)). Es ist in der Rust-Sprache entwickelt und verfügt über Speichersicherheitsfunktionen. Es kann auf verschiedenen Plattformen laufen (einschließlich Linux, Windows, MacOS, unterstützt x86/ARM-Architekturen, flexible Bereitstellung und anpassbar (unterstützt benutzerdefinierte Plugin-Erweiterungen)). Um eine stabile und zuverlässige Bereitstellung in der Produktionsumgebung zu gewährleisten, sind unten einige notwendige Prüfpunkte aufgeführt. Bitte bestätigen Sie als Betriebsmitarbeiter **zuerst**, ob die folgenden Einstellungen vorhanden sind:

## Systemanforderungen

- **Betriebssystem**: Empfohlen wird die Verwendung von Linux-Versionen mit langfristiger Unterstützung (wie Ubuntu 20.04+/22.04, RHEL 8/9 usw.), Kernel-Version am besten 5.x oder höher. RustFS kann unter Linux 5.x+ Kernel die `io_uring` asynchrone I/O-Optimierung nutzen, was eine bessere Durchsatzleistung bringt.
- **CPU & Speicher**: Unterstützt x86_64, ARM und andere Mainstream-CPU-Architekturen. Testumgebung mindestens 2 GB Speicher, Produktionsumgebung empfohlen mindestens 64 GB Speicher ([Linux RustFS-Installation](https://rustfs.com/docs/install/linux/#:~:text=2)). **Vergessen Sie nicht**, den benötigten Speicher basierend auf der Datenmenge und der geschätzten Parallelität zu berechnen, um Speichermangel zu vermeiden, der zu Leistungsengpässen führen könnte.
- **Störende Dienste deaktivieren**: Um die Leistung zu gewährleisten, wird empfohlen, Dienste zu schließen oder zu ignorieren, die das Dateisystem scannen/überwachen (wie `mlocate`, `plocate`, `updatedb`, `auditd`, Antivirensoftware usw.), da diese Dienste möglicherweise mit der RustFS-Datenträger-I/O kollidieren. Wenn sie nicht geschlossen werden können, sollten auch die RustFS-Datenpfade ausgeschlossen werden, um zu vermeiden, dass das Scannen die Leistung beeinträchtigt.

RustFS empfiehlt dringend, auf Linux 5.x oder höheren Kernel-Versionen zu laufen, insbesondere Version 5.10+.
Warum?

Weil RustFS in seinem grundlegenden I/O-Modell priorisiert die Linux **io_uring**-Technologie verwendet, und io_uring wurde ab Linux 5.1 eingeführt und wird in Version 5.10+ reifer und stabiler. Im Vergleich zu traditionellem epoll oder Thread-Pools bietet io_uring effizientere, niedrigere Latenz asynchrone I/O-Fähigkeiten, die sehr gut für Szenarien mit hoher Parallelität im Objektspeicher geeignet sind.

### Empfehlungen:

- Verwenden Sie Versionen mit 5.x Kernel in Mainstream-Unternehmens-Distributionen, zum Beispiel:
 - Ubuntu 20.04 LTS (kann HWE-Kernel installieren, um 5.15+ zu erhalten)
 - Ubuntu 22.04 LTS (Standard 5.15+)
 - CentOS Stream 9 / RHEL 9
 - Debian 12 (Standard 6.x, stärker)

- Wenn Sie noch alte Kernel verwenden (wie 4.x), wird empfohlen, zu aktualisieren oder Distributionen zu verwenden, die benutzerdefinierte Kernel unterstützen, um die Leistungsvorteile von RustFS voll auszuschöpfen.

## Binärpaket-Validierung und -Bereitstellung

- **Offizieller Download**: Laden Sie unbedingt die Server-Binärpakete von offiziellen RustFS-Kanälen herunter (wie der offiziellen Website oder offiziellen Spiegeln), verwenden Sie keine Softwarepakete unbekannter Herkunft, um Manipulationen zu vermeiden.
- **Integritätsprüfung**: **Vergessen Sie nicht**, nach dem Download die Integrität der Binärpakete zu überprüfen. Normalerweise gibt es offizielle SHA256-Prüfsummen oder Signaturdateien, die über `sha256sum` oder Signaturvalidierungstools überprüft werden können, um sicherzustellen, dass die Dateien nicht beschädigt oder manipuliert wurden.
- **Konsistenz**: Bei verteilter Bereitstellung stellen Sie sicher, dass alle Knoten die gleiche RustFS-Binärversion verwenden, da Versionsunterschiede sonst zu Kompatibilitätsproblemen führen können.
- **Installationsort**: Zur einfacheren Verwaltung können Sie die Binärdatei in den globalen Ausführungspfad verschieben (wie `/usr/local/bin`) und ausführbare Berechtigungen gewähren (`chmod +x`). Bei Verwendung von systemd zur Dienstverwaltung müssen Sie bestätigen, dass der Pfad in der Service-Datei korrekt ist.

## Dateisystem und Datenträger-Layout

- **Dedizierte Datenträger**: RustFS erfordert exklusiven Zugriff auf Speicherdatenträger. Mischen Sie nicht Systemdatenträger oder andere Anwendungsdaten mit RustFS-Daten. Es wird empfohlen, für das Betriebssystem und RustFS-Daten verschiedene Datenträger oder Partitionen zu verwenden; **bestätigen Sie zuerst**, ob der Einbindungspunkt des Datenträgers korrekt ist.
- **Dateisystemtyp**: Empfohlen wird die Verwendung reifer und leistungsstarker Dateisysteme wie XFS oder Ext4, und beim Einbinden Leistungsoptionen hinzufügen (wie `noatime,nodiratime,nobarrier` usw., je nach tatsächlicher Situation anpassen). Dies kann unnötige I/O-Overheads reduzieren und den Durchsatz erhöhen.
- **Datenträger-Konfiguration**: Bei Verwendung mehrerer Datenträger wird normalerweise empfohlen, sie als unabhängige Volumes (JBOD) zu konfigurieren, damit RustFS selbst durch Mechanismen wie Löschcodes die Datenzuverlässigkeit gewährleistet, anstatt sich auf Hardware-RAID zu verlassen, um die Speicherkapazität flexibler zu erweitern.
- **Einbindungsoptionen und Berechtigungen**: Überprüfen Sie die Einbindungsparameter und stellen Sie sicher, dass der RustFS-Dienstbenutzer Lese- und Schreibberechtigungen für das Datenverzeichnis hat. Sie können in `/etc/fstab` Sicherheitsoptionen wie `noexec`, `nodev` usw. hinzufügen und gleichzeitig sicherstellen, dass der RustFS-Prozess Zugriffsberechtigungen hat.

## Systemabhängigkeitsprüfung

- **Zeitsynchronisation**: Bei der Bereitstellung mehrerer Knoten **vergessen Sie auf keinen Fall** die Zeitsynchronisation. Die Systemzeit aller Knoten muss konsistent sein (verwenden Sie Tools wie `ntp`, `chrony`, `timedatectl` zur Zeitsynchronisation), da sonst Cluster-Start oder Datenkonsistenzanomalien auftreten können ([Linux RustFS-Installation](https://rustfs.com/docs/install/linux/#:~:text=2)). Überprüfen Sie, ob die Ausgabe von `timedatectl status` "`synchronized`" ist ([Linux RustFS-Installation](https://rustfs.com/docs/install/linux/#:~:text=2)).
- **Hostname und DNS**: Konfigurieren Sie für jeden Knoten **konsekutive Hostnamen** und stellen Sie sicher, dass diese Hostnamen zu den richtigen IPs aufgelöst werden können. Sie können DNS oder `/etc/hosts` zur Konfiguration verwenden ([Linux RustFS-Installation](https://rustfs.com/docs/install/linux/#:~:text=2)). Zum Beispiel können Sie in `/etc/hosts` für jeden Knoten feste IPs und entsprechende Hostnamen konfigurieren, um zu vermeiden, dass Knotenverbindungen aufgrund von DNS-Problemen fehlschlagen.
- **Netzwerkverbindung**: Überprüfen Sie die Netzwerkverbindung zwischen den Knoten im Cluster. **Bestätigen Sie zuerst**, dass das Netzwerk nicht blockiert ist, dass sie sich normal gegenseitig anpingen können und dass der von RustFS standardmäßig überwachte Port (normalerweise 9000) zwischen allen Knoten frei ist ([Linux RustFS-Installation](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A)). Wenn eine Firewall aktiviert ist, öffnen Sie bitte den RustFS-Port; Sie können `firewall-cmd` verwenden, um eine permanente Regel mit `--add-port=9000/tcp` hinzuzufügen ([Linux RustFS-Installation](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A)). Bei der Bereitstellung sollten alle Knoten die gleiche Portnummer verwenden.
- **TLS/Zertifikate**: Wenn Sie planen, HTTPS-Zugriff zu aktivieren, überprüfen Sie, ob das System Root-Zertifikate installiert hat (wie `/etc/ssl/certs/ca-bundle.crt` usw.), und bereiten Sie Server-TLS-Zertifikate und private Schlüsseldateien vor. Geben Sie in der RustFS-Konfigurationsdatei den Zertifikatspfad korrekt an, um sicherzustellen, dass die verschlüsselte Kommunikation zwischen Knoten und Client-Verbindungen normal funktioniert.
- **Abhängige Softwarepakete**: Bestätigen Sie, dass die verwendete Linux-Distribution die notwendigen Abhängigkeiten installiert hat, wie z.B. die übliche GNU-Toolchain (`bash`, `glibc` usw.) und Kryptografiebibliotheken (`openssl`/`gnutls` usw.). Verschiedene Distributionen könnten bestimmte Pakete vermissen, installieren Sie bitte die benötigten Bibliotheken gemäß der tatsächlichen Dokumentation oder Fehlermeldungen.

## Ausführungsbenutzer und Sicherheitskontext

- **Dedizierter Ausführungsbenutzer**: Es wird empfohlen, einen **dedizierten Benutzer** (wie `rustfs-user`) für RustFS zu erstellen, um den Dienst auszuführen ([Linux RustFS-Installation](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D)). Dieser Benutzer benötigt keine Shell-Anmeldeberechtigungen, sollte aber Eigentümerberechtigungen für das RustFS-Datenverzeichnis haben. Verwenden Sie `groupadd`/`useradd`, um Benutzergruppen und -benutzer zu erstellen, und verwenden Sie `chown`, um dem Benutzer die Eigentümerschaft des Datenverzeichnisses zu gewähren ([Linux RustFS-Installation](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D)).
- **Dateiberechtigungen**: Stellen Sie sicher, dass die RustFS-Binärdatei und alle Konfigurationsdateien für den Ausführungsbenutzer les- und schreibbar sind, und beschränken Sie den Zugriff auf andere, nicht relevante Verzeichnisse. Zum Beispiel können Sie die Binärdatei in `/usr/local/bin` platzieren und `755`-Berechtigungen setzen, sodass nur der Ausführungsbenutzer sie ändern kann. Für Datenverzeichnisse werden `700` oder `750`-Berechtigungen empfohlen, die nur RustFS-Benutzern oder Administratoren den Zugriff erlauben.
- **SELinux/AppArmor**: Wenn das System SELinux oder AppArmor aktiviert hat, setzen Sie bitte entsprechende Sicherheitsrichtlinien für die RustFS-Binärdatei und Datenpfade. Sie können SELinux temporär auf den `Permissive`-Modus setzen, um zu testen, oder `semanage fcontext` verwenden, um Regeln hinzuzufügen; auf Ubuntu können Sie durch Ändern der AppArmor-Konfigurationsdatei den Zugriff erlauben. Wenn Sie diese Mechanismen nicht verstehen, können Sie sie vorübergehend deaktivieren, aber bewerten Sie die Sicherheitsauswirkungen.
- **Systemd-Dienst**: Bei Verwendung von systemd zur Verwaltung des RustFS-Dienstes überprüfen Sie, ob die in der Dienst-Einheitsdatei (`rustfs.service`) angegebenen `User=`, `ExecStart=` usw. korrekt sind. Stellen Sie sicher, dass Umgebungsvariablen (wie Protokollpfade usw.) korrekt gesetzt sind, und aktivieren Sie die automatische Neustart-Strategie, um die Stabilität zu erhöhen.

## Andere wichtige Punkte

- **Überwachung und Protokollierung**: Obwohl es keine strenge Bereitstellungsvorprüfung ist, wird empfohlen, Überwachungssysteme (wie Prometheus + Grafana) zu installieren und zu konfigurieren, um RustFS-Metriken zu sammeln. Überprüfen Sie gleichzeitig, ob das Protokollverzeichnis beschreibbar ist, und setzen Sie eine geeignete Protokollrotationsstrategie, um zu vermeiden, dass Protokolldateien unbegrenzt wachsen.
- **Betriebstools**: Die Open-Source-Version von RustFS könnte eigene CLI-Clients haben oder mit Drittanbietertools kompatibel sein (wie AWS CLI, s3cmd usw.).
- **Flexible Erweiterung**: RustFS unterstützt Plugin-Erweiterungen und verschiedene Bereitstellungsmodi, die je nach Geschäftsanforderungen flexibel angepasst werden können. Zum Beispiel können später Knoten hinzugefügt oder Datenträger erweitert werden. Bei der Bereitstellung können Sie zuerst die einfachste Grundkonfiguration verwenden und nach der Überprüfung erweiterte Funktionen aktivieren.
- **Rollback-Plan**: Vor der tatsächlichen Bereitstellung **bestätigen Sie zuerst**, ob es einen vollständigen Konfigurationsbackup- und Rollback-Plan gibt. Sobald Sie feststellen, dass die Umgebung nicht mit der Realität übereinstimmt oder ernsthafte Probleme auftreten, können Sie den Systemstatus schnell wiederherstellen.

Die obige Checkliste deckt die wichtigsten Aspekte ab, auf die bei der Bereitstellung von RustFS auf Software-Ebene geachtet werden sollte. Bitte überprüfen Sie als Betriebsmitarbeiter gemäß den Projektanforderungen und Umgebungsmerkmalen Punkt für Punkt in Kombination mit der tatsächlichen Situation, um sicherzustellen, dass der Server die Bedingungen erfüllt und entsprechend konfiguriert ist. Nach erfolgreicher Bereitstellung wird RustFS mit seinen **flexiblen und anpassbaren** Eigenschaften sowie der Optimierung für io_uring auf modernen Linux-Systemen effiziente und zuverlässige Objektspeicherdienste bereitstellen.
