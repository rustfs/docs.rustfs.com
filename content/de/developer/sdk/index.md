---
title: "SDKs"
description: "Überblick über die unterstützten S3-SDKs für RustFS."
---

RustFS ist ein verteiltes Objektspeichersystem mit einer S3-kompatiblen API. Sie können:

- RustFS in der Console (Weboberfläche) verwalten.
- RustFS über S3-Clients verwalten.
- Buckets und Objekte aus Ihrer Anwendung mit einem S3-SDK verwalten.

Die folgenden Anleitungen erklären, wie Sie S3-SDKs mit RustFS verwenden:

- [Java-SDK](./java.md)
- [JavaScript-SDK](./javascript.md)
- [Python-SDK](./python.md)
- [Rust-SDK](./rust.md)
- [TypeScript-SDK](./typescript.md)
- [Go-SDK](./go.md)

## Terminologie

Amazon Simple Storage Service (Amazon S3) war der erste weit verbreitete Objektspeicherdienst. Seine API ist zum De-facto-Standard für Objektspeicher geworden. In dieser Dokumentation bezeichnet „S3“ das Protokoll.

## SDK-Empfehlungen

Wir empfehlen die offiziellen AWS-S3-SDKs. Diese SDKs sind ausgereift, werden gepflegt und sind stark optimiert.

Sie können auch ein Hersteller-SDK verwenden, das Sie kennen und dem Sie vertrauen, sofern es die benötigten S3-Operationen unterstützt.

Einige SDKs von Drittanbietern können vom Standard abweichen. Wir empfehlen, SDKs zu vermeiden, die nicht streng S3-konform sind.

## Kompatibilität mit MinIO-SDKs

RustFS funktioniert mit den MinIO-SDKs.

Um ein MinIO-SDK mit RustFS zu verbinden, setzen Sie den Endpunkt, den Zugriffsschlüssel und den geheimen Zugriffsschlüssel auf Ihre RustFS-Werte.

## Nicht kompatible SDKs

Wenn ein SDK nicht mit Standard-S3, MinIO oder RustFS funktioniert, empfehlen wir den Wechsel zu einem offiziellen AWS-SDK für S3.
