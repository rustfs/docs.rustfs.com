---
title: "Knotenausfälle"
description: "Bereiten Sie einen Ersatzknoten vor, aktualisieren Sie seine Konfiguration, stellen Sie die Cluster-Mitgliedschaft wieder her und prüfen Sie die Datenwiederherstellung."
---

Ein verteiltes RustFS-Cluster verwendet Erasure Coding, um lesbar und schreibbar zu bleiben, wenn einzelne Knoten ausfallen, und stellt Daten automatisch wieder her (Healing), wenn ein Knoten wieder beitritt. In dieser Anleitung führen Sie die folgenden Schritte aus:

1. Starten Sie den Ersatzknoten und gleichen Sie seine Softwareumgebung an das Cluster an.
2. Aktualisieren Sie DNS oder `/etc/hosts`, damit der bisherige Hostname auf den neuen Knoten zeigt.
3. Installieren Sie dieselbe RustFS-Version wie auf den anderen Knoten.
4. Starten Sie die Ersatzknoten, damit sie dem Cluster wieder beitreten und die Datenwiederherstellung beginnt.
5. Beobachten Sie den Fortschritt der Datenwiederherstellung und führen Sie anschließend weitere Prüfungen aus.

## 1. Ersatzknoten vorbereiten

* **Hardware und System vorbereiten**
  Stellen Sie sicher, dass die Hardware des Ersatzknotens (CPU, Arbeitsspeicher, Netzwerk und Laufwerkstyp) ungefähr dem ausgefallenen Knoten entspricht. Leistungsstärkere Hardware beeinträchtigt die Leistung des Clusters nicht.
  Verwenden Sie Softwareversionen, die zu den anderen Knoten passen, darunter Betriebssystem, Kernel und Abhängigkeiten, damit abweichende Umgebungen keine Probleme verursachen.

* **Exklusiver Zugriff auf Laufwerke**
  Wie bei Operationen an physischen Laufwerken benötigt RustFS exklusiven Zugriff auf seine Speicher-Volumes. Lassen Sie andere Prozesse oder Skripte die Daten auf diesen Volumes nicht direkt ändern. Das kann Daten beschädigen oder die Redundanz verringern.

## 2. Hostname und Namensauflösung aktualisieren

* **DNS- und Hosts-Konfiguration**
  Wenn die IP-Adresse des Ersatzknotens von der des ausgefallenen Knotens abweicht, lassen Sie den bisherigen Hostnamen (zum Beispiel `rustfs-node-2.example.net`) auf die IP-Adresse des neuen Knotens zeigen, damit die Knoten des Clusters einander weiterhin unter demselben Namen erreichen.

 ```bash
 # Example: Add or modify line in /etc/hosts
 192.168.1.12 rustfs-node-2.example.net
 ```

  Prüfen Sie mit `ping` oder `nslookup`, dass der Hostname auf den neuen Knoten zeigt.

## 3. RustFS-Dienste bereitstellen und konfigurieren

* **Herunterladen und Installation**
  Installieren Sie dieselbe RustFS-Version wie auf den vorhandenen Knoten, mit derselben Installationsmethode und demselben Verzeichnis. Stellen Sie sicher, dass Startskripte, Umgebungsvariablen und Konfigurationsdateien (etwa `/etc/default/rustfs`) mit denen der anderen Knoten übereinstimmen.

* **Konfiguration prüfen**

 * Prüfen Sie, dass `RUSTFS_VOLUMES` in `/etc/default/rustfs` bytegenau mit den anderen Knoten übereinstimmt und Hostname sowie Port des Ersatzknotens abdeckt.
 * Stellen Sie sicher, dass alle Knoten dieselben Zugriffsschlüssel und Berechtigungseinstellungen verwenden. Andernfalls schlägt die Authentifizierung des neuen Knotens fehl und er kann dem Cluster nicht beitreten.

## 4. Dem Cluster wieder beitreten und die Datenwiederherstellung auslösen

* **Dienst starten**

 ```bash
 systemctl start rustfs
 ```

  Alternativ starten Sie RustFS mit Ihrem eigenen Startskript. Führen Sie anschließend `journalctl -u rustfs -f` aus, um zu bestätigen, dass der neue Knoten die anderen Knoten erkannt hat und die Datenwiederherstellung begonnen hat.

* **Status der Datenwiederherstellung beobachten**
  Die Datenwiederherstellung läuft im Hintergrund, sobald der Knoten wieder beitritt; ein manueller Befehl ist nicht erforderlich. Verfolgen Sie den Fortschritt in den Dienstprotokollen des Ersatzknotens und prüfen Sie Knoten- und Festplattenstatus in der RustFS Console:

 ```bash
 journalctl -u rustfs -f
 ```

* **Beobachtungen aus der Community**
  In Tests der Community stellt RustFS nach dem Offline-Gehen und Wiederbeitritt eines Knotens nur diesen Knoten wieder her, statt das gesamte Cluster neu zu verteilen (Rebalancing). Das vermeidet unnötige Spitzen bei Netzwerk und I/O.

## 5. Anschlussprüfungen und bewährte Vorgehensweisen

* **Überwachung und Alarme**

 * Überwachen Sie während der Datenwiederherstellung die Last von Festplatte und Netzwerk, damit das Cluster seine Anforderungen an Lesezugriff, Schreibzugriff und Bandbreite weiterhin erfüllt.
 * Richten Sie Alarme ein, die Betriebsteams benachrichtigen, wenn die Datenwiederherstellung eines Knotens fehlschlägt oder der Fortschritt über festgelegte Schwellen hinaus stockt.

* **Regelmäßige Ausfalltests**
  Führen Sie regelmäßig Übungen zum Knotenausfall durch und proben Sie das vollständige Wiederherstellungsverfahren, damit Ihr Team die Befehle und den Ablauf bei einem Vorfall kennt.

* **Ursachenanalyse**
  Führen Sie eine ausführliche Hardwarediagnose (zum Beispiel SMART-Daten und BIOS-Protokolle) an Knoten oder Festplatten durch, die wiederholt ausfallen, und setzen Sie einen Plan für vorbeugende Wartung um.

* **Professionelle Unterstützung**
  Wenden Sie sich zur Ursachenklärung eines Ausfalls oder zur Wiederherstellung des Clusters an das RustFS-Entwicklungsteam oder die Community.

---

Diese Schritte ersetzen einen ausgefallenen Knoten und stellen seine Daten wieder her. Passen Sie die Befehle an Ihre Umgebung an und halten Sie die Konfiguration auf allen Knoten identisch.
