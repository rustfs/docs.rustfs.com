---
title: "Windows Installation von RustFS"
description: "RustFS mit einem Klick auf Windows starten."
---

# Windows Installation von RustFS

## I. Vorbereitungen

Bitte beachten Sie:

> Der Windows-Start **Modus** unterstützt nur den Einzelmaschinen-Einzelfestplatten-Modus, der besser für Entwicklungs-, Debug- und Testumgebungen geeignet ist.


1. Für eine detaillierte Einführung des Windows-Startmodus, beziehen Sie sich bitte auf [Startmodi](../linux/index.md#mode);

2. Laden Sie das Installationspaket herunter, ändern Sie Berechtigungen und führen Sie den Start durch.


## II. Download

Besuchen Sie die offizielle Download-Seite, um die neueste Version des RustFS-Installationspakets herunterzuladen.


## III. Berechtigungen Ändern

Bitte bestätigen Sie, dass dieses Programm die entsprechenden Ausführungsberechtigungen im Windows-Betriebssystem hat.


## Doppelklick auf das Start-Symbol

1. Doppelklicken Sie auf das Start-Symbol;

2. Klicken Sie auf Festplatte konfigurieren;

3. Klicken Sie auf "Start Service", der RustFS-Dienst startet erfolgreich.


<img src="./images/windows-setup.jpg" alt="Windows-Start" />



## IV. Konfiguration Ändern

Klicken Sie auf die Ändern-Schaltfläche in der oberen rechten Ecke (Zahnrad-Schaltfläche), Sie können ändern:

1. Standard-Server-Port;

2. Benutzername und Passwort des Standard-Administrators;

3. Angegebenes Festplattenverzeichnis;

<img src="./images/setting.jpg" alt="RustFS Windows-Konfiguration" />



## V. Zugriff auf die Konsole


Nach erfolgreichem Start besuchen Sie `http://127.0.0.1:7001`, um auf die Konsole zuzugreifen.

