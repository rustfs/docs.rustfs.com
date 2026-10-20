---
title: "Anfragen im Virtual-Hosted-Stil"
description: "Konfigurieren Sie die pfadbasierte Adressierung (Path-Style) und die Adressierung im Virtual-Hosted-Stil für S3-URLs in RustFS."
---

RustFS unterstützt beide Adressierungsarten für S3-URLs:

1. Adressierung im Virtual-Hosted-Stil
2. Pfadbasierte Adressierung

Die beiden Arten unterscheiden sich darin, wo der Bucket-Name in der URL steht.

## Pfadbasierte Adressierung

Die pfadbasierte Adressierung ist der Standard. In einer pfadbasierten URL folgt der Bucket-Name auf den Endpunkt.

Beispiel (Bucket: `test`, Host: `rustfs.yourdomain.com`):

```text
http://rustfs.example.com/my-bucket
```

**Hinweis**: Für die pfadbasierte Adressierung ist keine Konfiguration erforderlich.

## Adressierung im Virtual-Hosted-Stil

Bei der Adressierung im Virtual-Hosted-Stil ist der Bucket-Name Teil der Domain.

Beispiel (Bucket: `test`, Host: `rustfs.yourdomain.com`):

```text
http://my-bucket.rustfs.example.com/
```

### Konfiguration

1. **DNS**: Legen Sie einen Wildcard-DNS-Eintrag an (zum Beispiel `*.rustfs.yourdomain.com` → IP-Adresse Ihres Servers).
2. **Konfiguration**: Ändern Sie die Konfigurationsdatei (Linux: `/etc/default/rustfs`, Docker/Kubernetes: Umgebungsvariablen).
3. **Domain setzen**: Setzen Sie `RUSTFS_SERVER_DOMAINS = "rustfs.yourdomain.com"`.
4. **Neustart**: Starten Sie den Dienst neu (`systemctl restart rustfs`).

### Port in der Domain (optional)

Das Routing im Virtual-Hosted-Stil gilt für den Listener der S3-API (standardmäßig Port 9000). RustFS erkennt `Host`-Header automatisch, die den eigenen Port dieses Listeners enthalten. Nur wenn Clients RustFS über einen **anderen** Port erreichen (zum Beispiel über einen Proxy), müssen Sie diesen Port in `RUSTFS_SERVER_DOMAINS` angeben.

Beispiel (`rustfs.yourdomain.com:8000`):

```ini title="/etc/default/rustfs"
RUSTFS_SERVER_DOMAINS=rustfs.example.com:8000
```

Damit werden Anfragen wie diese korrekt weitergeleitet:

```text
http://my-bucket.rustfs.example.com:8000/
```

Die Weiterleitung verwendet die Adressierung im Virtual-Hosted-Stil.

:::warning[Host-Header angleichen]

Der Wert von `RUSTFS_SERVER_DOMAINS` muss exakt dem `Host`-Header entsprechen (einschließlich des Ports, falls vorhanden), den Clients senden.

:::
