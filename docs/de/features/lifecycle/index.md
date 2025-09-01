---
title: "Datenlebenszyklus-Management und Tiering"
description: "Optimierung für Zugriff, Sicherheit und Wirtschaftlichkeit"
---

# Datenlebenszyklus-Management und Tiering

Während Daten weiterhin wachsen, wird die Fähigkeit zur kollaborativen Optimierung für Zugriff, Sicherheit und Wirtschaftlichkeit zu einer harten Anforderung und nicht nur zu einem "nice-to-have". Hier kommt das Lebenszyklus-Datenmanagement ins Spiel. RustFS bietet einen einzigartigen Satz von Funktionen zum Schutz von Daten innerhalb und zwischen Clouds - einschließlich öffentlicher und privater Clouds. RustFS's Enterprise-Datenlebenszyklus-Management-Tools, einschließlich Versionierung, Objektsperrung und verschiedene abgeleitete Komponenten, erfüllen viele Anwendungsfälle.

## Objekt-Ablauf

Daten müssen nicht für immer existieren: RustFS Lebenszyklus-Management-Tools ermöglichen es Ihnen zu definieren, wie lange Daten auf der Festplatte bleiben, bevor sie gelöscht werden. Benutzer definieren die Zeitlänge als bestimmtes Datum oder Anzahl von Tagen, bevor RustFS mit dem Löschen von Objekten beginnt.

Lebenszyklus-Management-Regeln werden pro Bucket erstellt und können mit jeder Kombination von Objekt- und Tag-Filtern konstruiert werden. Geben Sie keine Filter an, um Ablaufregeln für den gesamten Bucket zu setzen, oder spezifizieren Sie mehrere Regeln, um komplexeres Ablaufverhalten zu erstellen.

RustFS Objekt-Ablaufregeln gelten auch für versionierte Buckets und kommen mit einigen versionierungsspezifischen Varianten. Zum Beispiel können Sie Ablaufregeln nur für nicht-aktuelle Versionen von Objekten spezifizieren, um die Vorteile der Objektversionierung zu maximieren, ohne langfristige Speicherkosten zu verursachen. Ähnlich können Sie Lebenszyklus-Management-Regeln für das Löschen von Objekten erstellen, deren einzige verbleibende Version ein Löschmarker ist.

Bucket-Ablaufregeln sind vollständig konform mit RustFS WORM-Sperrung und rechtlichen Sperren - Objekte in einem gesperrten Zustand bleiben auf der Festplatte, bis die Sperre abläuft oder explizit freigegeben wird. Sobald Objekte nicht mehr durch Sperren eingeschränkt sind, beginnt RustFS mit der normalen Anwendung von Ablaufregeln.

RustFS Objekt-Ablauf-Lebenszyklus-Management-Regeln sind funktional und syntaktisch kompatibel mit AWS Lifecycle Management. RustFS unterstützt auch das Importieren bestehender Regeln im JSON-Format, was es einfach macht, bestehende AWS-Ablaufregeln zu migrieren.

## Richtlinienbasiertes Objekt-Tiering

RustFS kann programmatisch für Objektspeicher-Tiering konfiguriert werden, sodass Objekte von einem Zustand oder einer Klasse zu einer anderen basierend auf einer beliebigen Anzahl von Variablen übergehen - obwohl die am häufigsten verwendeten Zeit und Häufigkeit des Zugriffs sind. Diese Funktion wird am besten im Kontext von Tiering verstanden. Tiering ermöglicht es Benutzern, Speicherkosten oder Funktionalität als Reaktion auf veränderliche Datenzugriffsmuster zu optimieren. Tiered-Datenspeicherung wird im Allgemeinen in den folgenden Szenarien verwendet:

## Über Speichermedien hinweg

Cross-Storage-Medien-Tiering ist der bekannteste und geradlinigste Tiering-Anwendungsfall. Hier abstrahiert RustFS die zugrundeliegenden Medien und optimiert kollaborativ für Leistung und Kosten. Zum Beispiel könnten für Leistungs- oder Nearline-Arbeitslasten Daten auf NVMe oder SSD gespeichert werden, aber nach einer gewissen Zeit zu HDD-Medien gestuft werden, oder für Arbeitslasten, die Leistungsskalierung schätzen. Mit der Zeit, wenn angemessen, können diese Daten weiter zu Langzeitspeicherung migriert werden.

![Cross-Storage-Medien-Tiering](images/s9-2.png)

## Über Cloud-Typen hinweg

Ein schnell entstehender Anwendungsfall beinhaltet die Nutzung der günstigen Speicher- und Rechenressourcen der öffentlichen Cloud als weitere Stufe für private Clouds. In diesem Anwendungsfall werden leistungsorientierte Nearline-Arbeitslasten mit geeigneten privaten Cloud-Medien ausgeführt. Das Datenvolumen spielt keine Rolle, aber Wert und Leistungserwartungen schon. Wenn Datenvolumen zunehmen und Leistungserwartungen abnehmen, können Unternehmen die Kaltspeicher-Optionen der öffentlichen Cloud nutzen, um Kosten und Zugriffsfunktionen im Zusammenhang mit der Datenaufbewahrung zu optimieren.

Dies wird erreicht, indem RustFS sowohl auf privaten als auch auf öffentlichen Clouds ausgeführt wird. Mit Replikation kann RustFS Daten zu günstigen öffentlichen Cloud-Optionen verschieben und RustFS in der öffentlichen Cloud nutzen, um sie bei Bedarf zu schützen und darauf zuzugreifen. In diesem Fall wird die öffentliche Cloud zu dummem Speicher für RustFS, genau wie JBOD zu dummem Speicher für RustFS wird. Dieser Ansatz vermeidet das Ersetzen und Hinzufügen veralteter Bandinfrastruktur.

![Cross-Cloud-Typ-Tiering](images/s9-3.png)

## In öffentlichen Clouds

RustFS dient typischerweise als primäre Anwendungsspeicher-Ebene in öffentlichen Clouds. In diesem Fall, wie bei anderen Anwendungsfällen, ist RustFS der einzige Speicher, auf den Anwendungen zugreifen. Anwendungen (und Entwickler) müssen nichts jenseits des Speicher-Endpoints wissen. RustFS bestimmt, welche Daten wohin gehören, basierend auf Verwaltungsparametern. Zum Beispiel kann RustFS bestimmen, dass Blockdaten zur Objekt-Ebene wechseln sollten, und welche Objekt-Ebene die Leistungs- und wirtschaftlichen Ziele des Unternehmens erfüllt.

RustFS kombiniert verschiedene Speicher-Tiering-Ebenen und bestimmt geeignete Medien, um bessere Wirtschaftlichkeit ohne Kompromisse bei der Leistung zu bieten. Anwendungen adressieren Objekte einfach durch RustFS, während RustFS transparent Richtlinien anwendet, um Objekte zwischen Ebenen zu verschieben und die Metadaten dieses Objekts in der Block-Ebene beibehält.

![Public Cloud Tiering](images/s9-4.png)

