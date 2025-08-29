---
title: "RustFS SDK Übersicht"
description: "Welche S3-SDKs können mit RustFS verwendet werden? In diesem Artikel wird dies detailliert erklärt."
---

# SDK Übersicht

RustFS ist eine verteilte Objektspeichersoftware, die zu 100% mit dem S3-Protokoll kompatibel ist. Benutzer können:

1. RustFS über die Console-Verwaltungskonsole verwalten;
2. RustFS über S3-Clients verwalten;
3. Über SDKs auf der Geschäftsseite Objektspeicher-Operationen und -Verwaltung implementieren.

Die derzeit von RustFS bereitgestellten SDKs umfassen:

- [Java SDK](./java.md)
- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Rust SDK](./rust.md)

## Begriffsklärung vor dem Lesen

S3 ist der Name des ersten von Amazon veröffentlichten und geöffneten Objektspeicherprodukts. Darüber hinaus öffnete es alle seine Protokolle und Spezifikationen. Später folgten fast alle Objektspeicher den S3-Protokollen und -Spezifikationen. Manchmal nennen Menschen S3 Objektspeicher, manchmal bezeichnen sie S3 einfach als Objektspeicherprotokoll.

## 1. SDK-Empfehlung

Da es bereits viele über Jahre gewartete SDKs auf dem Markt gibt. Wie das AWS S3 SDK, das über Jahre hinweg debuggt und optimiert wurde. Seine Leistung und Fehlerrate sind praktisch Null. Daher empfehlen wir Ihnen, das standardmäßige AWS S3 SDK direkt zur Steuerung und Kommunikation mit RustFS zu verwenden.

Wenn Sie ein vertrautes SDK haben und dem SDK-Anbieter vertrauen, können Sie alle diese Produkte verwenden.

Da chinesische Cloud-Anbieter in vielen Bereichen "magische Modifikationen" vorgenommen haben. Viele der neuesten S3-Technologien werden nicht unterstützt. Daher werden in vielen globalen Objektspeicherprodukten SDKs vieler chinesischer Cloud-Anbieter nicht empfohlen.



## 2. Können MinIO-SDKs direkt mit RustFS kommunizieren?

Ja.

Wir haben eine umfassende Anpassung und Kompatibilität für MinIO-SDKs durchgeführt.

Wenn Sie MinIO-SDKs verwenden, können Sie nach der Änderung des Endpoints und der AK/SK direkt mit RustFS kompatibel sein.


## 3. Was ist zu tun, wenn es andere inkompatible SDKs gibt?

Wir verwenden das SDK eines bestimmten Cloud-Anbieters, das die neuesten S3-, MinIO- und RustFS-Versionen nicht unterstützt. Wie sollte dies behandelt werden?
Bitte wechseln Sie so schnell wie möglich das SDK und führen Sie eine erneute Anpassung und Aktualisierung auf der Geschäftsseite durch.