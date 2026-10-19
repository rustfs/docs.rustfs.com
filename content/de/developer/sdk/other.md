---
title: "Weitere SDKs"
description: "Verbinden Sie sich aus Sprachen ohne offizielles AWS-SDK mit RustFS."
---

Wenn AWS für Ihre Sprache kein offizielles SDK bereitstellt, können Sie RustFS auf einem der folgenden Wege integrieren:

## 1. HTTP-Anfragen direkt an die S3-API senden

Das S3-Protokoll ist eine standardmäßige REST-API. Sie können die Client-Logik selbst in jeder Sprache implementieren, die HTTP-Anfragen senden kann (zum Beispiel C, Rust, Lua oder Erlang).

### Zentrale Schritte

* **Request-Signierung**: Implementieren Sie AWS Signature Version 4 (der aufwendigste Teil).
* **Header und kanonische Anfrage**: Erstellen Sie die kanonische Anfrage und die erforderlichen Header.
* **HTTP-Client**: Senden Sie die signierte Anfrage mit einem HTTP- oder HTTPS-Client.

Wir empfehlen, vorhandene Open-Source-Implementierungen der Request-Signierung heranzuziehen, zum Beispiel:

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. Die AWS CLI oder einen Dienst auf Basis eines vorhandenen SDK verwenden

Wenn Sie Signaturen nicht selbst implementieren möchten, können Sie:

### 2.1. Die AWS CLI aufrufen

Führen Sie zum Beispiel den folgenden Befehl aus Ihrer Anwendung über eine Shell aus:

```bash
aws s3 cp /path/to/hello.txt s3://my-bucket/hello.txt --endpoint-url http://localhost:9000
```

Alternativ bauen Sie einen kleinen Relay-Dienst mit einem SDK für Node.js oder Python und rufen ihn aus Ihrer Anwendung auf, um Objekte hoch- oder herunterzuladen.

### 2.2. Einen Proxy-Dienst betreiben (zum Beispiel Flask, FastAPI oder Express)

Stellen Sie eine HTTP-API bereit, die Clients ohne S3-Unterstützung aufrufen können:

```http
POST /upload -> Service internally calls SDK to upload objects to RustFS
GET /presigned-url -> Generate presigned URL for frontend/client use
```

---

## 3. Community-SDKs von Drittanbietern finden

Suchen Sie für Sprachen ohne offizielles AWS-SDK nach S3-Clients, die von der Community gepflegt werden. Zum Beispiel:

* Haskell: `amazonka-s3`
* Rust: `rusoto` (veraltet) oder `aws-sdk-rust`
* OCaml: Erstellen Sie einen eigenen Client auf Basis von `cohttp`
* Delphi: Es gibt kommerzielle Bibliotheken mit S3-Unterstützung

Community-SDKs unterscheiden sich stark in der Stabilität. Prüfen Sie vor der Verwendung Aktivität, Dokumentation und Kompatibilität.

---

## 4. Direkt von Clients mit vorsignierten URLs hochladen

Zum Beispiel:

* Verwenden Sie vorsignierte URLs, um direkt aus einem Browser oder einer mobilen App hochzuladen.
* Implementieren Sie die Upload-Logik in einem Backend-Dienst (zum Beispiel Node.js, Python oder Go).

---

## Ansatz wählen

| Situation | Empfohlener Ansatz |
| --- | --- |
| Sie brauchen volle Kontrolle oder zielen auf eine eingebettete Umgebung | Implementieren Sie die SigV4-Signierung selbst |
| Eingeschränkte SDK-Unterstützung, aber eine Shell ist verfügbar | Laden Sie mit der AWS CLI hoch |
| Sie können einen Relay-Dienst bereitstellen | Bauen Sie ein kleines S3-Gateway mit Python oder Node.js |
| Upload aus dem Frontend | Verwenden Sie vorsignierte URLs |
