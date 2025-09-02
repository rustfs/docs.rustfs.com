---
title: "Virtual-Modus-Konfiguration"
description: "RustFS S3 Virtual-Modus-Konfiguration und Path-Style-Modus-Konfiguration"
---

# RustFS S3-Modus-Einführung

RustFS erfüllt 100% die Anforderungen des S3-Speicherprotokolls. Bei S3-Speicherung gibt es zwei Modi für Anfragepfade:

1. Virtual Host Style
2. Path Style

Der Kernunterschied zwischen diesen beiden Modi liegt darin, wie der Name des Speicher-Buckets (Bucket) in die Anfrage-URL eingefügt wird.

## 1. Path Style Modus

Beim Start wird standardmäßig der Path-Style-Modus verwendet. Das Merkmal des Path-Style-Modus ist, dass der Bucket-Name nach dem Endpoint-Zugangspunkt steht. Angenommen, der Hostname ist rustfs.com und der Bucket-Name ist test, dann ist der zusammengesetzte Pfad im Path-Style:

~~~
http://rustfs.com/test
~~~

Hinweise:
- Standardmäßig Path-Style
- Benutzer müssen keine Einstellungen vornehmen, es ist automatisch Path-Style-Modus

## 2. Virtual Host Style

Beim Start kann der Modus zu Virtual Host Style geändert werden. Das Merkmal des Virtual Host Style-Modus ist, dass der Bucket-Name Teil der Domain ist. Angenommen, der Hostname ist rustfs.com und der Bucket-Name ist test, dann ist der zusammengesetzte Pfad im Virtual Host Style:

~~~
http://test.rustfs.com/
~~~

Die Schritte zum Einrichten des Virtual Host Style sind wie folgt:

1. Richten Sie eine Wildcard-DNS-Auflösung für Ihre Domain zum angegebenen Server ein. Angenommen, die Domain ist rustfs.com, dann können Sie *.rustfs.com zum angegebenen Server auflösen;
2. Wenn es Linux ist, ändern Sie die Datei `/etc/default/rustfs`, wenn es Docker oder Kubernetes ist, ändern Sie yaml oder Startkonfigurationsparameter;
3. Fügen Sie in der Konfigurationsdatei hinzu: `RUSTFS_SERVER_DOMAINS`, setzen Sie diesen Parameter auf `RUSTFS_SERVER_DOMAINS = "rustfs.com"`;
4. Speichern Sie die Konfigurationsdatei, dann verwenden Sie `systemctl restart rustfs`, um den Dienst neu zu starten.
