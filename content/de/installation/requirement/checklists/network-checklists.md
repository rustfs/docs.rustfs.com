---
title: "Netzwerk-Checkliste"
description: "Diese Checkliste fasst die Netzwerkanforderungen für Unternehmensbereitstellungen zusammen."
---

## Netzwerkarchitektur

### Planung

- **Topologie**
  Prüfen Sie, ob die Architektur (Stern, Ring oder vermascht) die Anforderungen an die Hochverfügbarkeit erfüllt.
- **Redundanz**
  Stellen Sie mindestens zwei unabhängige physische Verbindungen zwischen den Knoten sicher.
- **Bandbreite**
  Schätzen Sie den Datenverkehr als Lese- und Schreibbandbreite × Knotenanzahl × Replikatanzahl und rechnen Sie 20 % Spielraum hinzu.

### IP-Zuweisung

- [ ] Trennen Sie das Verwaltungsnetz vom Datennetz.
- [ ] Weisen Sie den Speicherknoten einen zusammenhängenden IP-Adressbereich zu. Wir empfehlen ein /24-Subnetz.
- [ ] Reservieren Sie mindestens 15 % der IP-Adressen für die Erweiterung.

---

## Hardwareanforderungen

### Switches

| Punkt | Anforderung |
| --- | --- |
| Backplane-Bandbreite | ≥ 1,2 × aggregierte Leitungsrate aller Ports |
| Porttyp | Glasfaserports 10G/25G/100G SFP+/QSFP+ |
| Kapazität der Flow-Tabelle | ≥ Knotenanzahl × 5 |
| Spanning Tree | Aktivieren Sie RSTP oder MSTP für schnelle Konvergenz |

### Verkabelung

- [ ] Dämpfungstest der Glasfaser (Singlemode ≤ 0,35 dB/km).
- [ ] Prüfen Sie die Portzuordnung (Knoten A eth0 ↔ Knoten B eth0).
- [ ] Kabelbeschriftung (einschließlich Quell- und Ziel-IP sowie Portnummer).

---

## Konfiguration des Betriebssystems

### Kernel-Abstimmung

```bash
# Check the following parameter settings
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_slow_start_after_idle = 0
```

### NIC-Konfiguration

- [ ] Aktivieren Sie Jumbo-Frames (MTU=9000, Unterstützung auf dem gesamten Pfad erforderlich).
- [ ] Prüfen Sie den Bonding-Modus. Wir empfehlen LACP mode4.
- [ ] Deaktivieren Sie IPv6 (falls nicht benötigt).

---

## Sicherheit

### Firewall

```text
# Necessary open ports
- TCP 9000 (S3 API; also used for internal node-to-node communication)
- TCP 9001 (RustFS Console)
- TCP 443 (only if you terminate HTTPS on a reverse proxy / load balancer)
```

### Zugriffskontrolle

- Aktivieren Sie auf den Switches die Portsicherheit (Begrenzung der MAC-Adressen).
- Verschlüsseln Sie den Datenverkehr zwischen den Speicherknoten mit IPsec.
- Aktivieren Sie TLS 1.3 für die Verwaltungsschnittstellen.

---

## Leistungstests

### Referenzmessungen

1. Latenz zwischen Knoten: `ping -c 20 <target IP>` (führen Sie für Durchsatztests zuerst `iperf3 -s` auf dem Ziel aus)
2. Bandbreite zwischen Racks: `iperf3 -c <target IP> -P 8 -t 30`
3. Ausfallübernahme: Trennen Sie Kernverbindungen nach dem Zufallsprinzip und beobachten Sie die Wiederherstellungszeit.

### Kriterien

| Metrik | Anforderungen |
| --- | --- |
| Knotenlatenz | ≤ 1 ms (dasselbe Rechenzentrum) / ≤ 5 ms (über Verfügbarkeitszonen hinweg) |
| Bandbreitenauslastung | Spitze ≤ 70 % der Auslegungskapazität |
| Ausfallübernahme | < 500 ms BPDU-Konvergenz |

---

## Dokumentationsanforderungen

1. Netzwerktopologiediagramm (einschließlich physischer Verbindungen und logischer IP-Adressen)
2. Sicherungsdateien der Switch-Konfiguration (mit Zeitstempeln)
3. Berichte der Basismessung (einschließlich Rohdaten)
4. Änderungsprotokoll (einschließlich Wartungsfenster)

:::tip

Wir empfehlen, vor der Bereitstellung in der Produktion einen 72-Stunden-Stresstest mit 110 % des erwarteten Spitzenverkehrs durchzuführen.

:::

Diese Checkliste deckt die wesentlichen Netzwerkanforderungen für die Bereitstellung von verteiltem Objektspeicher in einer Unternehmensumgebung ab. Wenden Sie sich für technischen Support an RustFS.
