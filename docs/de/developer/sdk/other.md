---
title: "Andere SDKs"
description: "Dieser Artikel erklärt hauptsächlich die Verwendung anderer SDKs in verschiedenen Sprachen in RustFS."
---

# Andere SDKs

Wenn AWS S3 offiziell Ihre verwendete Sprache nicht unterstützt, können Sie die folgenden Strategien verwenden, um sich mit RustFS zu verbinden:

## 1. Direkte HTTP-Interface-Anfragen verwenden (basierend auf S3 API-Protokoll)

Das S3-Protokoll ist eine standardmäßige RESTful API. Sie können die Zugriffslogik mit jeder Sprache, die HTTP-Anfragen unterstützt (z.B. C, Rust, Lua, Erlang), selbst kapseln.

### Wichtige Punkte umfassen

* **Signaturalgorithmus**: Implementierung der AWS Signature Version 4-Signatur (relativ komplex)
* **Korrekte Header und Canonical Request konstruieren**
* **HTTPS/HTTP-Client verwenden, um Anfragen zu senden**

👉 Empfohlen, Open-Source-Projekt-Signaturimplementierungen zu referenzieren, z.B.:

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. CLI-Tools oder Zwischendienste mit vorhandenen SDKs aufrufen

Wenn Sie die Signatur nicht selbst implementieren möchten, können Sie:

### 2.1. AWS CLI-Tools mit vorhandener Sprachunterstützung verwenden

Zum Beispiel durch Shell-Aufruf:

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

Oder mit Node.js/Python SDK einen einfachen Zwischendienst schreiben, den Ihre Sprache durch Aufruf dieses Dienstes zum Hoch-/Herunterladen verwendet.

### 2.2. Einen Proxy einrichten (z.B. Flask, FastAPI, Express)

Lassen Sie Clients, die S3 nicht unterstützen, Ihre gekapselte HTTP-API aufrufen:

```http
POST /upload -> Dienst ruft intern SDK auf, um Objekte zu RustFS hochzuladen
GET /presigned-url -> Generiert Presigned URL für Frontend/Client
```

---

## 3. Drittanbieter-Community-SDKs suchen

Obwohl AWS kein offizielles SDK hat, haben einige Sprachcommunities inoffizielle S3-Clients entwickelt. Zum Beispiel:

* Haskell: `amazonka-s3`
* Rust: `rusoto` (veraltet) oder `aws-sdk-rust`
* OCaml: Möglicherweise durch `cohttp` selbst implementieren
* Delphi: Hat kommerzielle Bibliotheken, die S3-Protokoll unterstützen

Die Stabilität von Community-SDKs variiert stark, und Sie sollten Aktivität, Dokumentation und Kompatibilität bewerten, bevor Sie sie verwenden.

---

## 4. Kern-Upload-Logik an plattformverwaltete Dienste delegieren

Zum Beispiel:

* Frontend (Web/Mobile) Upload-Aufgaben an Browser oder App-Seite delegieren (mit Presigned URL)
* Backend verwendet Node.js/Python/Go usw. als Proxy, um Upload-Logik zu implementieren

---

## Zusammenfassung und Empfehlungen

| Szenario | Empfohlene Lösung |
|----------|-------------------|
| Benötigt vollständige Kontrolle/Eingebettete Umgebung | Signature V4 Selbstsignatur implementieren |
| Schwache Sprachunterstützung, aber Shell verfügbar | Upload durch AWS CLI-Aufruf |
| Kann Zwischendienst bereitstellen | Python/Node verwenden, um S3 API-Gateway zu erstellen |
| Frontend-Upload | Presigned URL verwenden |
