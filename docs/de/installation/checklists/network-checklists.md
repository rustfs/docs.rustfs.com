---
title: "Netzwerk-Checkliste"
description: "RustFS Unternehmensbereitstellungs-Netzwerk-Checkliste"
---

# Netzwerk-Checkliste

## 1. Netzwerkarchitektur-Design

### Grundlegende Netzwerkplanung

- **Topologie-Validierung**
 Bestätigen Sie, ob die Bereitstellungsarchitektur (Stern-/Ring-/Netzwerkstruktur) die Hochverfügbarkeitsanforderungen des verteilten Speichers erfüllt
- **Redundanzpfad-Überprüfung**
 Stellen Sie sicher, dass zwischen den Knoten mindestens zwei unabhängige physische Verbindungen bestehen
- **Bandbreitenplanung**
 Berechnen Sie den geschätzten Datenverkehr: Objektspeicher-Lese-/Schreibbandbreite × Anzahl der Knoten × Anzahl der Replikate + 20% Redundanz

### IP-Planung

- [ ] Verwaltungsnetzwerk und Datennetzwerk trennen
- [ ] Kontinuierliche IP-Bereiche für Speicherknoten zuweisen (empfohlen /24 Subnetz)
- [ ] Mindestens 15% der IP-Adressen für Erweiterungen reservieren

---

## 2. Hardware-Geräteanforderungen

### Switch-Konfiguration

| Prüfpunkt | Standardanforderung |
|-----------|-------------------|
| Backplane-Bandbreite | ≥ Vollport-Linienrate-Forwarding-Fähigkeit × 1.2 |
| Port-Typ | 10G/25G/100G SFP+/QSFP+ Glasfaser-Ports |
| Flusstabellen-Kapazität | ≥ Anzahl der Knoten × 5 |
| Spanning Tree Protocol | RSTP/MSTP schnelle Konvergenz aktivieren |

### Physische Verbindungen

- [ ] Glasfaser-Dämpfungstest (Einmodus ≤0.35dB/km)
- [ ] Port-Fehlausrichtung-Verbindungsprüfung (Knoten A eth0 ↔ Knoten B eth0)
- [ ] Kabel-Etikettierungssystem (enthält Quell-/Ziel-IP + Portnummer)

---

## 3. Betriebssystem-Netzwerkkonfiguration

### Kernel-Parameter-Optimierung

```bash
# Überprüfen Sie die folgenden Parameter-Einstellungen
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_slow_start_after_idle = 0
```

### Netzwerkkarten-Konfiguration

- [ ] Jumbo-Frames aktivieren (MTU=9000, erfordert Unterstützung des gesamten Pfads)
- [ ] Netzwerkkarten-Bindungsmodus validieren (empfohlen LACP mode4)
- [ ] IPv6 deaktivieren (falls nicht benötigt)

---

## 4. Sicherheitsstrategien

### Firewall-Regeln

```bash
# Notwendige offene Ports
- TCP 443 (HTTPS API)
- TCP 9000 (S3-kompatible Schnittstelle)
- TCP 7946 (Serf-Knotenkommunikation)
- UDP 4789 (VxLAN-Tunnel)
```

### Zugriffskontrolle

- Switch-Port-Sicherheit MAC-Beschränkung
- IPSec-Tunnel-Verschlüsselung zwischen Speicherknoten
- Verwaltungsschnittstelle TLS 1.3 aktivieren

---

## 5. Leistungsvalidierungstests

### Benchmark-Testpunkte

1. Knoten-zu-Knoten-Latenztest: `iperf3 -s 8972 <Ziel-IP>`
2. Rack-übergreifender Bandbreitentest: `iperf3 -c <Ziel-IP> -P 8 -t 30`
3. Failover-Test: Zufälliges Trennen der Kernverbindung und Beobachten der Wiederherstellungszeit

### Akzeptanzkriterien

| Metrik | Anforderung |
|--------|-------------|
| Knotenlatenz | ≤1ms (gleicher Raum) / ≤5ms (AZ-übergreifend) |
| Bandbreitenauslastung | Spitze ≤70% der Entwurfskapazität |
| Failover | Weniger als 500ms BPDU-Konvergenz |

---

## 6. Dokumentationsanforderungen

1. Netzwerk-Topologie-Diagramm (enthält physische Verbindungen und logische IPs)
2. Switch-Konfigurations-Backup-Datei (enthält Zeitstempel)
3. Baseline-Testbericht (enthält Rohdaten)
4. Änderungsprotokoll-Tabelle (enthält Wartungsfenster-Informationen)

> **Hinweis**: Es wird empfohlen, vor der offiziellen Bereitstellung einen 72-Stunden-Stresstest durchzuführen, der einen Spitzenverkehr von 110% der Last simuliert

Diese Checkliste deckt die kritischen Prüfpunkte für die Netzwerkbereitstellung von Unternehmensspeichersystemen ab und optimiert die Parameteranforderungen speziell für die Eigenschaften des verteilten Objektspeichers. Sie können sich an RustFS wenden, um offizielle technische Unterstützung zu erhalten.
