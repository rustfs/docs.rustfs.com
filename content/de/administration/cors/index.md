---
title: "CORS-Konfiguration"
description: "Konfigurieren Sie die zulässigen Browser-Origins für die S3-API und die Console von RustFS."
---

Cross-Origin Resource Sharing (CORS) steuert, welche Browser-Origins auf die S3-API und die Console von RustFS zugreifen dürfen. Konfigurieren Sie jeden Listener getrennt und starten Sie RustFS neu, damit die Änderungen an den Umgebungsvariablen wirksam werden.

## Origins der S3-API

Setzen Sie `RUSTFS_CORS_ALLOWED_ORIGINS` auf eine durch Kommas getrennte Liste vertrauenswürdiger Origins:

```ini title="/etc/default/rustfs"
RUSTFS_CORS_ALLOWED_ORIGINS="https://app.example.com,https://admin.example.com"
```

Wenn diese Variable nicht gesetzt oder leer ist, fügt der S3-Endpunkt keine allgemeinen CORS-Antwortheader hinzu. Eine Liste ausdrücklicher Origins erlaubt Browseranfragen mit Zugangsdaten von übereinstimmenden Origins.

Sie können den Wert auf `*` setzen, um Anfragen von jeder Origin zuzulassen. Der Wildcard-Modus lässt keine Browser-Zugangsdaten zu.

:::warning[In der Produktion ausdrückliche Origins verwenden]

Verwenden Sie eine durch Kommas getrennte Zulassungsliste für Anwendungen, die Zugangsdaten senden. Reservieren Sie `*` für öffentliche Ressourcen, die keine Browseranfragen mit Zugangsdaten erfordern.

:::

## Origins der Console

Die Console verwendet eine eigene Variable:

```ini title="/etc/default/rustfs"
RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS="https://admin.example.com"
```

Verwenden Sie eine durch Kommas getrennte Liste, wenn mehr als eine Browser-Origin auf die Console zugreifen muss. Setzen Sie `*` nur, wenn jede Origin zugelassen werden soll.

## Antwort prüfen

Senden Sie eine Anfrage mit einem `Origin`-Header und prüfen Sie die CORS-Antwortheader:

```bash
curl -i \
  -H "Origin: https://app.example.com" \
  http://localhost:9000/
```

Prüfen Sie, dass `Access-Control-Allow-Origin` die erwartete Origin enthält. Wiederholen Sie die Prüfung mit einer nicht aufgeführten Origin und bestätigen Sie, dass sie nicht zugelassen wird.

## Nächste Schritte

Die geprüften Standardwerte und Konfigurationsformate stehen in der [Referenz der Umgebungsvariablen](/de/reference/environment-variables#cors).
