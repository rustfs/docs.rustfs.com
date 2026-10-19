---
title: "CLI-Referenz"
description: "Referenz der Unterbefehle von rustfs, der Server-Flags, der äquivalenten Umgebungsvariablen und der Syntax für Volume-Pfade."
---

Das Binary `rustfs` enthält sechs Unterbefehle. Wenn Sie `rustfs` ohne Unterbefehl ausführen, startet der Server.

## Unterbefehle

| Befehl | Beschreibung |
| --- | --- |
| `rustfs server [OPTIONS] <VOLUMES>...` | Startet den Objektspeicher-Server (Standard, wenn kein Unterbefehl angegeben ist). |
| `rustfs info [--all] [--json] [system\|runtime\|build\|config\|deps]` | Zeigt Informationen zu System, Laufzeit, Build, Konfiguration oder Abhängigkeiten. |
| `rustfs tls inspect --path <DIR>` | Prüft Layout und Parse-Status eines TLS-Zertifikatsverzeichnisses. |
| `rustfs diagnose [OPTIONS] <PATHS>...` | Analysiert Protokolldateien und nennt wahrscheinliche Fehlerursachen. |
| `rustfs inspect <COMMAND>` | Ruft persistierte Bucket-Metadaten ohne laufenden Server ab. |
| `rustfs connect <COMMAND>` | Konfiguriert die ausgehende Integration RustFS Connect. |

```bash title="Examples"
rustfs server /data/rustfs
rustfs info --all --json
rustfs tls inspect --path /etc/rustfs/tls
```

### Kompatibilität älterer Aufrufe

Argumente werden aus Gründen der Abwärtskompatibilität vorverarbeitet, damit ältere Aufrufformen weiterhin funktionieren:

| Ältere Form | Wird interpretiert als |
| --- | --- |
| `rustfs /data` | `rustfs server /data` |
| `rustfs --address :9000 /data` | `rustfs server --address :9000 /data` |
| `rustfs` (keine Argumente) | `rustfs server` mit Volumes aus `RUSTFS_VOLUMES` |
| `rustfs --info` | `rustfs info` |
| `rustfs help` | `rustfs --help` |

## Server-Flags

Jedes Server-Flag hat eine äquivalente Umgebungsvariable. Wenn beide gesetzt sind, gilt das Flag.

| Flag | Umgebungsvariable | Standard | Beschreibung |
| --- | --- | --- | --- |
| `<VOLUMES>...` (Positionsargument) | `RUSTFS_VOLUMES` | erforderlich | Speicher-Volumes oder Endpunkte, durch Leerzeichen getrennt. |
| `--address` | `RUSTFS_ADDRESS` | `:9000` | Bind-Adresse der S3-API (`ADDRESS:PORT`, IP oder Hostname). |
| `--server-domains` | `RUSTFS_SERVER_DOMAINS` | nicht gesetzt | Durch Kommas getrennte Domains für Anfragen mit Adressierung im Virtual-Hosted-Stil. |
| `--access-key` | `RUSTFS_ACCESS_KEY` | nicht gesetzt | Root-Zugriffsschlüssel (schließt `--access-key-file` aus). |
| `--access-key-file` | `RUSTFS_ACCESS_KEY_FILE` | nicht gesetzt | Datei mit dem Root-Zugriffsschlüssel. |
| `--secret-key` | `RUSTFS_SECRET_KEY` | nicht gesetzt | Geheimer Root-Zugriffsschlüssel (schließt `--secret-key-file` aus). |
| `--secret-key-file` | `RUSTFS_SECRET_KEY_FILE` | nicht gesetzt | Datei mit dem geheimen Root-Zugriffsschlüssel. |
| `--console-enable` | `RUSTFS_CONSOLE_ENABLE` | `true` | Aktiviert die eingebettete Console (Weboberfläche). |
| `--console-address` | `RUSTFS_CONSOLE_ADDRESS` | `:9001` | Bind-Adresse der Console. |
| `--obs-endpoint` | `RUSTFS_OBS_ENDPOINT` | leer | OTLP/HTTP-Basis-URL für Traces, Metriken und Protokolle. |
| `--tls-path` | `RUSTFS_TLS_PATH` | nicht gesetzt | TLS-Zertifikatsverzeichnis für API und Console. |
| `--license` | `RUSTFS_LICENSE` | nicht gesetzt | Lizenzzeichenkette. |
| `--region` | `RUSTFS_REGION` | nicht gesetzt | Region, die Clients als Dienstregion gemeldet wird. |
| `--kms-enable` | `RUSTFS_KMS_ENABLE` | `false` | Aktiviert die serverseitige Verschlüsselung über KMS. |
| `--kms-backend` | `RUSTFS_KMS_BACKEND` | `local` | KMS-Backend: `local`, `vault` / `vault-kv2`, `vault-transit`. |
| `--kms-key-dir` | `RUSTFS_KMS_KEY_DIR` | nicht gesetzt | Schlüsselverzeichnis für das lokale KMS-Backend. |
| `--kms-local-master-key` | `RUSTFS_KMS_LOCAL_MASTER_KEY` | nicht gesetzt | Hauptschlüssel für die Verschlüsselung lokaler KMS-Schlüsseldateien. |
| `--kms-vault-address` | `RUSTFS_KMS_VAULT_ADDRESS` | nicht gesetzt | Vault-Adresse für die Vault-Backends. |
| `--kms-vault-token` | `RUSTFS_KMS_VAULT_TOKEN` | nicht gesetzt | Vault-Token für die Vault-Backends. |
| `--kms-vault-mount-path` | `RUSTFS_KMS_VAULT_MOUNT_PATH` | nicht gesetzt | Transit-Mount für `vault-transit` (Standard `transit`); veraltet und ungenutzt für `vault` / `vault-kv2`. |
| `--kms-default-key-id` | `RUSTFS_KMS_DEFAULT_KEY_ID` | nicht gesetzt | Standard-KMS-Schlüssel-ID für die Verschlüsselung. |
| `--kms-allow-insecure-dev-defaults` | `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS` | `false` | Erlaubt unsichere KMS-Standards, die nur für die Entwicklung gedacht sind. |
| `--buffer-profile` | `RUSTFS_BUFFER_PROFILE` | `GeneralPurpose` | Lastprofil für die adaptive Puffergröße. |
| `--buffer-profile-disable` | `RUSTFS_BUFFER_PROFILE_DISABLE` | `false` | Verwendet feste Puffergrößen der älteren Implementierung. |

:::note

Wenn weder `--access-key` und `--secret-key` noch die Dateivarianten angegeben sind, fällt der Server auf die eingebauten Standard-Anmeldedaten (`rustfsadmin`/`rustfsadmin`) zurück und protokolliert eine Warnung. Setzen Sie echte Anmeldedaten, sobald die Bereitstellung kein reiner Wegwerf-Test ist.

:::

## Volume-Syntax

Volumes werden als Positionsargumente übergeben (oder über `RUSTFS_VOLUMES`) und durch Leerzeichen getrennt.

### Ellipsen-Erweiterung

Ein Volume-Token kann einen oder mehrere Bereiche `{N...M}` enthalten, die numerisch erweitert werden:

```bash title="Ellipses expansion"
# Expands to /data/rustfs0 /data/rustfs1 /data/rustfs2 /data/rustfs3
rustfs server /data/rustfs{0...3}

# Multi-node: expands across hosts and disks
rustfs server http://node{1...4}:9000/data/rustfs{0...3}
```

Vom Parser geprüfte Regeln:

- Das Bereichsformat ist `{N...M}`, wobei `N` und `M` positive Ganzzahlen in Dezimal- oder Hexadezimalform sind und `M` größer als `N` sein muss.
- Ein einzelnes Token kann mehrere Bereiche tragen (zum Beispiel Host-Bereich plus Laufwerksbereich); alle Kombinationen werden erweitert.
- Die maximale erweiterte Größe eines Bereichs beträgt 10.000 Einträge.

### Mehrere Pools

Getrennte Server-Pools geben Sie als durch Leerzeichen getrennte Gruppen von Endpunkten an. Jedes Argument (eines je Leerzeichen) bildet eine eigene Erweiterungsgruppe:

```bash title="Two pools"
rustfs server http://node{1...4}:9000/data/rustfs{0...3} http://node{5...8}:9000/data/rustfs{0...3}
```

Wenn Sie die Angabe über die Umgebung setzen, steht dieselbe Zeichenkette in `RUSTFS_VOLUMES`:

```bash title="Via environment"
export RUSTFS_VOLUMES="http://node{1...4}:9000/data/rustfs{0...3}"
rustfs server
```
