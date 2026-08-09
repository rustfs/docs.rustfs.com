---
title: "OpenStack-Swift-API"
description: "Erstellen Sie RustFS mit der optionalen Swift-API und binden Sie die OpenStack-Keystone-Authentifizierung an."
---

RustFS kann auf demselben HTTP-Endpunkt wie die S3-API eine mit OpenStack Swift kompatible API bereitstellen. Diese Anleitung zeigt, wie Sie das optionale Feature `swift` erstellen, die Keystone-Tokenvalidierung konfigurieren und grundlegende Konto-, Container- und Objektoperationen prüfen.

:::warning[Kompatibilitätsumfang]

Die Swift-Unterstützung ist optional und deckt nicht jedes Verhalten von OpenStack Swift ab. `HEAD`-Anfragen auf Kontoebene und Listenformate außer JSON sind nicht implementiert. Prüfen Sie Ihren Client-Workflow, bevor Sie die API produktiv einsetzen.

:::

## Zuordnung von Swift zu RustFS

Swift-Anfragen verwenden den Pfad `/v1/AUTH_<project-id>/...` am S3-API-Endpunkt von RustFS:

| Swift-Ressource | Anfragepfad | RustFS-Zuordnung |
| --- | --- | --- |
| Konto | `/v1/AUTH_<project-id>` | Das authentifizierte Keystone-Projekt |
| Container | `/v1/AUTH_<project-id>/<container>` | Ein projektisolierter RustFS-Bucket |
| Objekt | `/v1/AUTH_<project-id>/<container>/<object>` | Ein Objekt im zugeordneten Bucket |

Die Projekt-ID in der URL muss mit der Projekt-ID im validierten Keystone-Token übereinstimmen. RustFS akzeptiert das Token in `X-Auth-Token` oder `X-Storage-Token`.

Die bestätigten Kernoperationen sind:

| Bereich | Operationen |
| --- | --- |
| Konto | Container auflisten, Kontometadaten aktualisieren |
| Container | Erstellen, auflisten, untersuchen, Metadaten aktualisieren, löschen |
| Objekt | Hochladen, herunterladen, Bereich herunterladen, untersuchen, Metadaten aktualisieren, kopieren, löschen |

## Mit Swift-Unterstützung erstellen

Swift gehört nicht zum standardmäßigen RustFS-Featuresatz. Erstellen Sie das Feature ausdrücklich aus dem Repository `rustfs/rustfs`:

```bash
cargo build --release --features swift
```

Das erzeugte Binary stellt Swift-Pfade an der konfigurierten S3-API-Adresse bereit. Es gibt keinen separaten Swift-Listener und keinen Swift-spezifischen Port.

## Keystone konfigurieren

Aktivieren Sie Keystone und legen Sie vor dem Start von RustFS den Authentifizierungsendpunkt fest:

```bash
export RUSTFS_KEYSTONE_ENABLE=true
export RUSTFS_KEYSTONE_AUTH_URL=https://keystone.example.com
export RUSTFS_KEYSTONE_VERSION=v3
export RUSTFS_KEYSTONE_VERIFY_SSL=true
```

| Variable | Zweck | Standardwert |
| --- | --- | --- |
| `RUSTFS_KEYSTONE_ENABLE` | Aktiviert die Keystone-Tokenvalidierung. | `false` |
| `RUSTFS_KEYSTONE_AUTH_URL` | Legt den Keystone-Authentifizierungsendpunkt fest; bei aktiviertem Keystone erforderlich. | Nicht gesetzt |
| `RUSTFS_KEYSTONE_VERSION` | Wählt die Keystone-API-Version. | `v3` |
| `RUSTFS_KEYSTONE_VERIFY_SSL` | Prüft das TLS-Zertifikat von Keystone. | `true` |
| `RUSTFS_KEYSTONE_CACHE_SIZE` | Legt die maximale Anzahl der Token-Cache-Einträge fest. | `10000` |
| `RUSTFS_KEYSTONE_CACHE_TTL` | Legt die Lebensdauer des Token-Caches in Sekunden fest. | `300` |
| `RUSTFS_KEYSTONE_TIMEOUT` | Legt das Zeitlimit für Keystone-Anfragen in Sekunden fest. | `30` |

Wir empfehlen, die TLS-Prüfung aktiviert zu lassen. Wenn Keystone ein übergebenes Token ablehnt, gibt RustFS `401 Unauthorized` zurück und verwendet für diese Anfrage keine lokalen Anmeldedaten als Rückfall.

## API prüfen

Beziehen Sie ein bereichsgebundenes Token und eine Projekt-ID von Keystone und setzen Sie anschließend diese Shell-Variablen:

```bash
export SWIFT_TOKEN='<your-keystone-token>'
export SWIFT_ACCOUNT='AUTH_<your-project-id>'
export SWIFT_URL="http://localhost:9000/v1/${SWIFT_ACCOUNT}"
```

Listen Sie die für das Projekt sichtbaren Container auf:

```bash
curl --fail-with-body \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}"
```

Erstellen Sie `my-bucket`, laden Sie `hello.txt` hoch und laden Sie das Objekt wieder herunter:

```bash
curl --fail-with-body --request PUT \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}/my-bucket"

curl --fail-with-body --request PUT \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	--upload-file /path/to/hello.txt \
	"${SWIFT_URL}/my-bucket/hello.txt"

curl --fail-with-body \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}/my-bucket/hello.txt"
```

Eine Anfrage an ein `AUTH_<project-id>`-Konto, das nicht zum Token-Projekt passt, erhält `403 Forbidden`.

## Nächste Schritte

- [S3-Kompatibilitätsmatrix prüfen](/de/reference/s3-compatibility)
- [RustFS-Anmeldedaten verwalten](/de/operations/credentials)
- [TLS für RustFS konfigurieren](/de/integration/tls-configured)
