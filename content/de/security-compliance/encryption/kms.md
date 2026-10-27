---
title: "SSE-KMS"
description: "Konfigurieren Sie SSE-KMS mit einem lokalen oder einem HashiCorp-Vault-KMS-Backend für RustFS."
---

Der Key Management Service (KMS) von RustFS erzeugt und umhüllt Datenverschlüsselungsschlüssel je Objekt für [SSE-S3](./sse-s.md) und SSE-KMS. In dieser Anleitung konfigurieren Sie SSE-KMS beim Serverstart mit einem lokalen Schlüsselspeicher, Vault KV v2 oder Vault Transit.

## Anforderungen

- Installieren und konfigurieren Sie [`rc`](/de/operations/rc) für den Ablauf zur Prüfung der Verschlüsselung.
- Sichern Sie alle vorhandenen Daten und das KMS-Schlüsselmaterial, bevor Sie die Verschlüsselungskonfiguration ändern.
- Verwenden Sie auf jedem RustFS-Knoten dasselbe KMS-Backend und dieselbe Standard-Schlüssel-ID.
- Verwenden Sie einen Prozess- oder Secret-Manager, der Geheimnisse einbindet, ohne sie in die Versionsverwaltung zu übernehmen.
- Aktivieren Sie für Vault die erforderlichen Secrets Engines, erstellen Sie ein Token mit geringsten Rechten und stellen Sie sicher, dass Vault von jedem RustFS-Knoten erreichbar ist.
- Legen Sie einen KMS-Hauptschlüssel an, bevor Sie seine ID als Standardschlüssel von RustFS konfigurieren.

:::warning[Ohne den Schlüssel sind verschlüsselte Objekte nicht lesbar]

RustFS speichert keine wiederherstellbare Kopie Ihres KMS-Hauptschlüssels außerhalb des konfigurierten Backends. Sichern Sie lokale Schlüsseldateien und ihren Hauptschlüssel oder schützen Sie Vault-Daten und Wiederherstellungs-Anmeldedaten, bevor Sie verschlüsselte Objekte schreiben.

:::

## Backend wählen

| Backend | `RUSTFS_KMS_BACKEND` | Schlüsselspeicherung und Umhüllung | Vorgesehener Einsatz |
| --- | --- | --- | --- |
| Local | `local` | Schlüsseldateien auf dem RustFS-Host | Entwicklung, Tests oder eine sorgfältig gesicherte Bereitstellung auf einem einzelnen Host |
| Vault KV2 | `vault` oder `vault-kv2` | Hauptschlüsselmaterial in Vault KV v2; Umhüllung der Datenschlüssel in RustFS | Zentrale Schlüsselspeicherung |
| Vault Transit | `vault-transit` | Kryptografische Operationen über Vault Transit | Zentrale Schlüsselverwaltung in der Produktion ohne den KV2-Backend-Modus |

SSE-S3 und SSE-KMS setzen voraus, dass der KMS-Dienst läuft. Allein ein Bucket-Standard führt nicht dazu, dass verschlüsselte Schreibvorgänge gelingen, wenn KMS nicht verfügbar ist.

## Lokales Backend konfigurieren

Legen Sie ein absolutes Schlüsselverzeichnis an, das dem Dienstkonto von RustFS gehört:

```bash
sudo install -d -m 0700 -o rustfs -g rustfs /var/lib/rustfs/kms
```

Fügen Sie die KMS-Einstellungen auf jedem Knoten in die Umgebungsdatei von RustFS ein:

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=local
RUSTFS_KMS_KEY_DIR=/var/lib/rustfs/kms
RUSTFS_KMS_LOCAL_MASTER_KEY=<your-kms-master-key>
```

`RUSTFS_KMS_KEY_DIR` ist im Startpfad des RustFS-Servers erforderlich. Das lokale Backend schreibt Schlüsseldateien mit Rechten nur für den Eigentümer. RustFS lehnt Entwicklungsstandards wie ein temporäres Schlüsselverzeichnis oder einen fehlenden lokalen Hauptschlüssel ab, es sei denn, Sie setzen ausdrücklich `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS=true`. Aktivieren Sie diese Überschreibung in der Produktion nicht.

Starten Sie RustFS nach der Änderung der Umgebung neu. Dadurch startet das KMS-Backend, ein Hauptschlüssel wird jedoch nicht angelegt:

```bash
sudo systemctl restart rustfs
sudo systemctl status rustfs --no-pager
```

## Vault KV2 konfigurieren

Aktivieren Sie eine KV-v2-Engine für Hauptschlüsselmaterial und Metadaten. RustFS liest das Hauptschlüsselmaterial und umhüllt Datenschlüssel lokal; dieses Backend ruft Vault Transit nicht auf. Konfigurieren Sie jeden RustFS-Knoten:

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=vault-kv2
RUSTFS_KMS_VAULT_ADDRESS=https://vault.example.com:8200
RUSTFS_KMS_VAULT_TOKEN=<your-vault-token>
RUSTFS_KMS_VAULT_KV_MOUNT=secret
RUSTFS_KMS_VAULT_KEY_PREFIX=rustfs/kms/keys
```

Der KV-Mount ist standardmäßig `secret`, das Schlüsselpräfix `rustfs/kms/keys`. Mit den Variablen oben wählen Sie andere Pfade. Verwenden Sie ein Vault-Token, das für die konfigurierten KV-Daten- und Metadatenpfade berechtigt ist. `RUSTFS_KMS_VAULT_MOUNT_PATH` ist veraltet und wird für das KV2-Backend nicht verwendet.

Das Hauptschlüsselmaterial liegt in KV2 Base64-kodiert vor. Jede Identität mit KV-Leserecht auf den Schlüsselpfad kann den Hauptschlüssel im Klartext wiederherstellen. Beschränken Sie diesen Zugriff deshalb auf vertrauenswürdige RustFS-Identitäten.

RustFS prüft die Vault-URL und lehnt unsichere Entwicklungsstandards ab, sofern `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS=true` nicht gesetzt ist. Verwenden Sie in der Produktion HTTPS und ein Zertifikat, dem die RustFS-Hosts vertrauen.

## Vault Transit konfigurieren

Aktivieren Sie die Transit-Engine und konfigurieren Sie jeden RustFS-Knoten:

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=vault-transit
RUSTFS_KMS_VAULT_ADDRESS=https://vault.example.com:8200
RUSTFS_KMS_VAULT_TOKEN=<your-vault-token>
RUSTFS_KMS_VAULT_MOUNT_PATH=transit
```

Vault Transit behält historische Schlüsselversionen. Die Rotation eines Transit-Schlüssels allein macht Objekte, die mit einer älteren Version umhüllt wurden, nicht unlesbar. Lassen Sie alte Versionen so lange aktiviert, wie Objekte von ihnen abhängen.

## Standardschlüssel anlegen und auswählen

`RUSTFS_KMS_DEFAULT_KEY_ID` wählt einen vorhandenen Schlüssel aus und legt keinen an. Starten Sie das KMS-Backend ohne diese Variable, legen Sie den Schlüssel an und fügen Sie die Variable erst danach hinzu. Starten Sie RustFS anschließend neu.

Wenn das installierte `rc` die KMS-Lebenszyklusbefehle bereitstellt, legen Sie einen Schlüssel an und rufen Sie seinen Status ab:

```bash
rc admin kms status rustfs
rc admin kms key create rustfs --name rustfs-default-key
rc admin kms key status rustfs rustfs-default-key
```

Fügen Sie anschließend auf jedem RustFS-Knoten dieselbe Standard-Schlüssel-ID hinzu:

```ini title="/etc/default/rustfs"
RUSTFS_KMS_DEFAULT_KEY_ID=rustfs-default-key
```

Starten Sie nach der Änderung des Standards jeden Knoten einheitlich neu.

Bei Vault Transit können Sie den benannten Transit-Schlüssel alternativ direkt in Vault anlegen, bevor Sie ihn als Standard konfigurieren:

```bash
vault write -f transit/keys/rustfs-default-key
```

:::note[Anforderungen an die rc-Version]

`rc 0.1.29` enthält `rc admin kms` nicht. Es unterstützt nur die unten verwendeten Befehle zur Bucket- und Objektverschlüsselung. Führen Sie `rc admin --help` aus, bevor Sie den Befehlen für den Schlüssel-Lebenszyklus folgen. Fehlt die KMS-Befehlsfamilie, verwenden Sie eine neuere `rc`-Version, die sie enthält, oder legen Sie den Schlüssel über die native RustFS KMS Admin API an.

:::

<a id="verify-kms-backed-encryption"></a>

## KMS-gestützte Verschlüsselung prüfen [#verify-kms-backed-encryption]

Legen Sie einen Test-Bucket an, konfigurieren Sie SSE-KMS mit dem Standardschlüssel, laden Sie ein Objekt hoch und lesen Sie es zurück:

```bash
rc bucket create rustfs/my-bucket
rc bucket encryption set rustfs/my-bucket --mode sse-kms
rc bucket encryption info rustfs/my-bucket
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object show rustfs/my-bucket/hello.txt
```

Um einen bestimmten KMS-Schlüssel auszuwählen, setzen Sie ihn als Bucket-Standard oder beim einzelnen Schreibvorgang:

```bash
rc bucket encryption set rustfs/my-bucket \
	--mode sse-kms \
	--key-id rustfs-default-key

rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	--enc-kms rustfs/my-bucket/hello.txt=rustfs-default-key
```

Die Auswahl vor `=` muss exakt dem Ziel entsprechen, das Sie an `rc object copy` übergeben.

## Schlüssel rotieren und wiederherstellen

- **Vault-Token:** Stellen Sie ein Ersatz-Token aus, aktualisieren Sie jeden RustFS-Knoten, starten Sie einheitlich neu, prüfen Sie verschlüsselte Lese- und Schreibvorgänge und widerrufen Sie anschließend das alte Token.
- **Vault-Transit-Schlüssel:** Rotieren Sie den Transit-Schlüssel in Vault. Neue Umhüllungen verwenden die neue Version, während Vault ältere Versionen für die Entschlüsselung behält.
- **Schlüsselmaterial von Local oder Vault KV2:** Sichern Sie das aktuelle Material vor der Rotation und prüfen Sie, dass Objekte, die vor und nach der Rotation geschrieben wurden, lesbar bleiben.
- **Vorhandene Objekte:** Die Rotation eines Hauptschlüssels schreibt Objektdaten nicht neu. Jedes Objekt behält den umhüllten Datenschlüssel in seinen Verschlüsselungsmetadaten.

Löschen oder deaktivieren Sie eine alte Hauptschlüsselversion erst, wenn feststeht, dass kein aufbewahrtes Objekt von ihr abhängt.

## Nächste Schritte

Konfigurieren Sie [SSE-S3](./sse-s.md), oder verwenden Sie [SSE-C](./sse-c.md), wenn der Client die Kontrolle über den Verschlüsselungsschlüssel behalten muss.
