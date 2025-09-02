---
title: "RustFS SDK Übersicht"
description: "Welche S3 SDKs können mit RustFS verwendet werden? Diese Frage wird in diesem Artikel detailliert erklärt."
---

# SDK Übersicht

RustFS ist eine 100% S3-kompatible verteilte Objektspeicher-Software. Benutzer können:

1. RustFS über die Console-Verwaltungskonsole verwalten;
2. RustFS über S3-Clients verwalten;
3. Objektspeicher-Operationen und -verwaltung über SDKs in der Geschäftslogik implementieren.

Derzeit bietet RustFS folgende SDKs:

- [Java SDK](./java.md)
- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Rust SDK](./rust.md)
- [TypeScript SDK](./typescript.md)

## Begriffserklärungen vor dem Lesen

S3 ist der Produktname des Objektspeichers, den Amazon ursprünglich entwickelt und eingeführt hat. Darüber hinaus hat es sein vollständiges Protokoll und seine Spezifikationen offengelegt. Später folgten fast alle Objektspeicher dem S3-Protokoll und den S3-Spezifikationen. Manchmal wird S3 als Objektspeicher bezeichnet, manchmal wird S3 als Objektspeicher-Protokoll abgekürzt.

## 1. SDK Empfehlungen

Da es bereits zu viele jahrelang gewartete SDKs auf dem Markt gibt. Zum Beispiel wurde das AWS S3 SDK über Jahre hinweg debuggt und optimiert. Seine Leistung und Fehlerrate sind nahezu 0. Daher empfehlen wir Ihnen, das Standard-AWS S3 SDK direkt zu verwenden, um mit RustFS zu kommunizieren.

Wenn Sie ein vertrautes SDK haben und dem SDK-Anbieter vertrauen, können Sie es verwenden.

Da chinesische Cloud-Anbieter an vielen Stellen "Modifikationen" vorgenommen haben, unterstützen sie viele der neuesten S3-Technologien nicht. Daher empfehlen viele Objektspeicher-Produkte weltweit nicht die SDKs vieler chinesischer Cloud-Anbieter.

## 2. Können MinIO SDKs direkt mit RustFS kommunizieren?

Ja.

Wir haben eine umfassende Anpassung und Kompatibilität für MinIO SDKs durchgeführt.

Wenn Sie MinIO SDKs verwenden, können Sie nach der Änderung von Endpoint, AK und SK direkt mit RustFS kompatibel sein.

## 3. Was tun bei anderen inkompatiblen SDKs?

Was sollten wir tun, wenn wir ein SDK eines Cloud-Anbieters verwenden, das die neuesten S3-, MinIO- und RustFS-Versionen nicht unterstützt?
Bitte wechseln Sie so schnell wie möglich das SDK und führen Sie eine Neuanpassung und ein Upgrade in der Geschäftslogik durch.
