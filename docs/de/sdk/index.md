---
title: "SDK Übersicht"
description: "Welche S3 SDKs können mit RustFS verwendet werden? Dieser Artikel bietet eine detaillierte Erklärung."
---

# SDK Übersicht

RustFS ist eine 100% S3-protokollkompatible verteilte Objektspeichersoftware. Benutzer können:

1. RustFS über die Console-Konsole verwalten
2. RustFS über S3-Clients verwalten
3. SDKs auf der Geschäftsseite verwenden, um Objektspeichervorgänge und -verwaltung zu implementieren

## Begriffserklärung vor dem Lesen

S3 ist der Name des ersten von Amazon geöffneten und eingeführten Objektspeicherprodukts. Es öffnete alle seine Protokolle und Spezifikationen. Später folgten fast alle Objektspeicher den S3-Protokollen und -Spezifikationen.
Manchmal nennen Leute S3 Objektspeicher, und manchmal kürzen sie S3 als Objektspeicherprotokoll ab.

## 1. SDK-Empfehlungen

Es gibt bereits viele SDKs auf dem Markt, die seit Jahren gepflegt werden. Wie das AWS S3 SDK, das nach Jahren des Debugging und der Optimierung eine Performance und Fehlerrate von fast null hat. Daher empfehlen wir, das Standard-AWS S3 SDK direkt zu verwenden, um RustFS zu steuern und mit RustFS zu kommunizieren.

Wenn Sie vertraute SDKs und vertrauenswürdige SDK-Anbieterprodukte haben, können Sie diese verwenden.

Da chinesische Cloud-Anbieter an vielen Stellen "magische Änderungen" vorgenommen haben, werden viele der neuesten S3-Technologien nicht unterstützt. Daher empfehlen viele Objektspeicherprodukte weltweit nicht die SDKs vieler chinesischer Cloud-Anbieter.

## 2. Können MinIO SDKs direkt mit RustFS kommunizieren?

Ja.

Wir haben umfassende Anpassung und Kompatibilität für MinIO SDKs durchgeführt.

Wenn Sie MinIO SDKs verwenden, können Sie direkt mit RustFS kompatibel sein, indem Sie Endpoint und AK, SK ändern.

## 3. Was tun bei anderen inkompatiblen SDKs?

Wenn wir das SDK eines Cloud-Anbieters verwenden, das die neuesten S3, MinIO und RustFS nicht unterstützt, wie sollten wir damit umgehen?
Bitte wechseln Sie das SDK so schnell wie möglich und führen Sie Re-Matching und Upgrade auf der Geschäftsseite durch.
