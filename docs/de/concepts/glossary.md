---
title: "Glossar"
description: "Dieser Artikel stellt häufig verwendete Begriffe im Bereich Objektspeicher vor, um Benutzern beim schnellen Verständnis von Objektspeicher zu helfen"
---

# Objektspeicher Kernvokabular-Sammlung (100 Begriffe)

| Nr. | Begriff | Chinesisch | Beschreibung |
|------|--------------------------|------------------------------|--------------------------------------------------------------------------|
| 1 | Object Storage | 对象存储 | Eine Architektur, bei der Daten als Objekte gespeichert werden, um herkömmliche Datei-Hierarchiestrukturen zu ersetzen |
| 2 | Bucket | 存储桶 | Ein Container zur Speicherung von Objekten mit global eindeutigem Namensraum |
| 3 | Object | 对象 | Grundlegende Speichereinheit mit Daten, Metadaten und eindeutigem Bezeichner (Object Key) |
| 4 | Metadata | 元数据 | Schlüssel-Wert-Paar-Informationen, die Objektattribute beschreiben (wie Dateityp, Erstellungszeit) |
| 5 | S3-Compatible | S3 兼容 | Speicherdienste, die mit Amazon S3 API-Standards kompatibel sind |
| 6 | Data Durability | 数据持久性 | Wahrscheinlichkeit, dass Daten langfristig ohne Verlust im System erhalten bleiben (z.B. 99,999999999%) |
| 7 | Replication | 多副本 | Redundanztechnologie, die Datensicherheit durch mehrere Kopien gewährleistet |
| 8 | Erasure Coding | 纠删码 | Technologie, die Daten fragmentiert und kodiert für hohe Zuverlässigkeit mit weniger Speicherplatz |
| 9 | Cold Storage | 冷存储 | Kostengünstiger Speichertyp für selten zugreifbare Daten (wie archivierte Daten) |
| 10 | Lifecycle Management | 生命周期管理 | Richtlinien zur automatischen Überführung/Löschung von Objekten (z.B. nach 30 Tagen zu Cold Storage verschieben) |
| 11 | Versioning | 版本控制 | Aufbewahrung historischer Versionen von Objekten zur Vermeidung von Überschreibung |
| 12 | Storage Class | 存储类型 | Verschiedene Leistungs-/Kosten-Speicherstufen (Standard, Seltener Zugriff, Archiv) |
| 13 | Access Key | 访问密钥 | Authentifizierungsschlüssel für API-Anfragen (Access Key ID + Secret Access Key) |
| 14 | Region | 区域 | Geografischer Standort der Speicherinfrastruktur (z.B. Ostchina 1, US West) |
| 15 | Availability Zone (AZ) | 可用区 | Isolierte Rechenzentren mit unabhängiger Strom-/Netzwerkversorgung innerhalb derselben Region |
| 16 | Endpoint | 端点 | Domain-Adresse für den Zugriff auf Speicherdienst (z.B. us-east1.rustfs.com) |
| 17 | RESTful API | RESTful API | API-Designspezifikation basierend auf HTTP-Protokoll |
| 18 | Multipart Upload | 分片上传 | Mechanismus zur Aufteilung großer Dateien für Upload und Zusammenführung |
| 19 | Pre-Signed URL | 预签名 URL | Temporäre Zugangslinks mit zeitlicher Gültigkeit |
| 20 | Server-Side Encryption (SSE) | 服务端加密 | Automatische Datenverschlüsselung auf Serverseite (SSE-S3/SSE-KMS/SSE-C) |
| 21 | Client-Side Encryption (CSE) | 客户端加密 | Lokale Verschlüsselung auf Client-Seite vor dem Upload |
| 22 | Cross-Region Replication | 跨区域复制 | Automatische Objektreplikation über geografische Regionen hinweg |
| 23 | Access Control List (ACL) | 访问控制列表 | Regelliste zur Kontrolle von Zugriffsberechtigungen für Buckets/Objekte |
| 24 | Bucket Policy | 存储桶策略 | JSON-basierte feinkörnige Berechtigungskontroll-Richtlinien |
| 25 | IAM | IAM | Identity and Access Management System für zentralisierte Benutzer-/Rollen-Berechtigungsverwaltung |
| 26 | Event Notification | 事件通知 | Senden von Benachrichtigungen an Nachrichtenwarteschlangen/Function Computing bei Ereignisauslösung |
| 27 | Data Lake | 数据湖 | Repository für zentralisierte Speicherung strukturierter/unstrukturierter Daten |
| 28 | Compliance | 合规性 | Erfüllung regulatorischer Anforderungen für Datenspeicherung wie GDPR, HIPAA |
| 29 | Logging & Audit | 日志审计 | Aufzeichnung aller API-Operationslogs für Auditierung |
| 30 | Monitoring & Alerting | 监控告警 | Echtzeitüberwachung der Speichernutzung/Anfragen mit Alarmierung |
| 31 | CORS | 跨域资源共享 | Regeln zur Kontrolle des browserbasierten Cross-Origin-Ressourcenzugriffs |
| 32 | Transfer Acceleration | 传输加速 | Optimierung der Upload-/Download-Geschwindigkeit durch Edge-Nodes |
| 33 | CDN Integration | CDN 加速 | Kombination mit Content Delivery Network für Caching-Beschleunigung |
| 34 | Data Export | 数据导出 | Prozess der Datenmigration zu anderen Speichersystemen |
| 35 | Data Import | 数据导入 | Batch-Datenmigration von externen Systemen zu Objektspeicher |
| 36 | Static Website Hosting | 静态网站托管 | Direktes Hosting von HTML/CSS/JS-statischen Dateien durch Buckets |
| 37 | Hotlink Protection | 防盗链 | Technologie zur Verhinderung des Diebstahls von Ressourcenlinks durch externe Websites |
| 38 | Request Rate Limiting | 请求速率限制 | Kontrolle der API-Anfragefrequenz pro Benutzer/IP |
| 39 | Tagging | 标签 | Hinzufügen von Klassifizierungs-Tags zu Buckets/Objekten für Verwaltung |
| 40 | Inventory Report | 清单报告 | Periodisch generierte CSV/ORC-Dateien, die Speicherobjekte auflisten |
| 41 | Data Restoration | 数据恢复 | Wiederherstellung von Daten aus Archivspeicher in zugänglichen Zustand |
| 42 | Storage Gateway | 存储网关 | Zugangsschicht, die Objektspeicher als lokales Dateisystem abbildet |
| 43 | Data Compression | 数据压缩 | Komprimierung von Daten vor Upload zur Speicherplatz-Einsparung |
| 44 | Data Deduplication | 数据去重 | Eliminierung doppelter Daten zur Reduzierung der Speichernutzung |
| 45 | Direct Read Archive | 直读归档 | Technologie zum direkten Lesen archivierter Daten ohne Wiederherstellung |
| 46 | Bandwidth Control | 流量控制 | Begrenzung der Download-Bandbreite zur Vermeidung von Netzwerküberlastung |
| 47 | Concurrent Connections | 并发连接数 | Anzahl gleichzeitiger Datenübertragungsverbindungen |
| 48 | Data Migration Service | 数据迁移服务 | Automatisierte Migrationswerkzeuge (z.B. AWS Snowball) |
| 49 | Client SDK | 客户端 SDK | Entwickler-Toolkits zur Integration von Speicherdiensten (z.B. Python/Java SDK) |
| 50 | CLI | 命令行工具 | Befehlszeilen-Verwaltungstools (z.B. aws s3 cp) |
| 51 | Web Console | 图形化控制台 | Web-basierte Verwaltungsschnittstelle |
| 52 | Data Integrity Check | 数据校验 | Verifizierung der Übertragungsintegrität durch MD5/SHA |
| 53 | Resumable Upload/Download | 断点续传 | Fortsetzung der Übertragung vom Unterbrechungspunkt nach Netzwerkstörung |
| 54 | Mirror Back to Source | 镜像回源 | Abrufen und Speichern von spezifizierten Quellen, wenn angefragtes Objekt nicht existiert |
| 55 | Canary Release | 灰度发布 | Release-Strategie, die neue Features schrittweise für einige Benutzer öffnet |
| 56 | Soft Delete | 软删除 | Markierung von Objekten zur Löschung mit Aufrechterhaltung einer Wiederherstellungsperiode |
| 57 | Object Lock | 对象锁定 | Compliance-Schutzmechanismus zur Verhinderung der Objektlöschung oder Überschreibung |
| 58 | Watermarking | 水印 | Hinzufügen von Identifikationsinformationen zu Bildern/Videos |
| 59 | Thumbnail Generation | 缩略图生成 | Automatische Erstellung von Vorschauversionen von Bildern |
| 60 | Image Processing | 图片处理 | Online-Zuschneiden/Skalieren/Rotieren-Verarbeitungsfunktionen |
| 61 | Video Transcoding | 视频转码 | Konvertierung von Videoformaten/Auflösungen für verschiedene Geräte |
| 62 | Content Moderation | 内容审核 | Automatische Erkennung unangemessener Bilder/Videos/Texte |
| 63 | Cost Analysis | 成本分析 | Kostenberechnung nach Speichertyp/Anfragezahl-Dimensionen |
| 64 | Usage Monitoring | 用量监控 | Echtzeit-Dashboard zur Anzeige von Speicher-/Traffic-/Anfragezählern |
| 65 | Storage Analytics | 存储分析 | Tools zur Analyse von Speichermustern zur Kostenoptimierung |
| 66 | Requester Pays | 请求者付费 | Abrechnungsmodell, bei dem der Daten-Downloader die Kosten trägt |
| 67 | Tiered Storage | 数据分层 | Automatische Verschiebung von Daten zu kostengünstigeren Speicherstufen |
| 68 | Intelligent Tiering | 智能分层 | Automatische Auswahl des optimalen Speichertyps basierend auf Zugriffsmustern |
| 69 | PrivateLink | 私有链接 | Zugriff auf Objektspeicher über internes Netzwerk zur Vermeidung öffentlicher Exposition |
| 70 | VPC Endpoint | VPC 端点 | Einstiegspunkt für sicheren Zugriff auf Speicherdienste innerhalb Virtual Private Cloud |
| 71 | SSL/TLS | 传输加密 | Verschlüsselung der Datenübertragung durch HTTPS-Protokoll |
| 72 | Client-Side Encryption | 客户端加密 | Benutzer verschlüsseln Daten selbst vor dem Upload |
| 73 | KMS | KMS | Key Management Service für zentralisierte Verschlüsselungsschlüssel-Verwaltung |
| 74 | Permission Boundary | 权限边界 | Begrenzung des maximalen Berechtigungsumfangs von IAM-Rollen/Benutzern |
| 75 | Temporary Credentials | 临时凭证 | Kurzzeitig gültige Zugangs-Token (z.B. STS Token) |
| 76 | MFA Delete | MFA 删除保护 | Erforderung einer Multi-Faktor-Authentifizierung zur Datenlöschung |
| 77 | Immutability | 数据不可变性 | Eigenschaft zur Verhinderung von Datenmanipulation (kombiniert mit WORM-Modell) |
| 78 | Legal Hold | 法律保留 | Obligatorischer Schutz, der Datenlöschung/-änderung in Compliance-Szenarien verbietet |
| 79 | Cross-Account Sharing | 跨账户共享 | Erlaubnis für andere Cloud-Konten, auf spezifizierte Speicherressourcen zuzugreifen |
| 80 | Prefetch Policy | 预取策略 | Vorladen von Daten in Cache zur Beschleunigung nachfolgender Zugriffe |
| 81 | Cache-Control | 缓存控制 | Spezifizierung des Browser-/CDN-Caching-Verhaltens durch HTTP-Header |
| 82 | Delayed Deletion | 延迟删除 | Verzögerung von Löschoperationen zur Verhinderung versehentlicher Aktionen |
| 83 | Batch Operations | 批量操作 | Durchführung einheitlicher Operationen auf mehreren Objekten (löschen/kopieren/wiederherstellen) |
| 84 | Data Lineage | 数据血缘 | Metadaten-Aufzeichnungen zur Verfolgung von Datenquellen und Änderungshistorie |
| 85 | Data Catalog | 数据目录 | Abrufsystem zur Speicherung von Metadaten-Informationen |
| 86 | Storage Gateway | 存储网关 | Hybrid-Cloud-Lösung, die lokale Systeme mit Cloud-Speicher verbindet |
| 87 | Hybrid Cloud Storage | 混合云存储 | Architektur mit sowohl lokalem Speicher als auch Cloud-Speicher |
| 88 | Edge Storage | 边缘存储 | Bereitstellung von Speicherdiensten an Edge-Nodes nahe den Datenquellen |
| 89 | Multi-Cloud Storage | 多云存储 | Speicherlösungen über verschiedene Cloud-Service-Anbieter hinweg |
| 90 | Storage Federation | 存储联盟 | Abstraktionsschicht für einheitliche Verwaltung mehrerer Speichersysteme |
| 91 | Object Tag | 对象标签 | Hinzufügen benutzerdefinierter Klassifizierungs-Tags zu Objekten |
| 92 | Bucket Tag | 存储桶标签 | Hinzufügen verwaltungs-/abrechnungsrelevanter Tags zu Buckets |
| 93 | Storage Quota | 存储配额 | Begrenzung der maximalen Kapazität von Buckets |
| 94 | Request Throttling | 请求限速 | Begrenzung der API-Anfragen pro Zeiteinheit |
| 95 | SLA | 服务等级协议 | Service Level Agreement-Verpflichtungen für Verfügbarkeit/Haltbarkeit (z.B. 99,9% Verfügbarkeit) |
| 96 | Disaster Recovery | 灾难恢复 | Gewährleistung der Geschäftskontinuität durch regionsübergreifende Backups |
| 97 | Storage Topology | 存储拓扑 | Verteilungsstruktur von Daten auf physischer/logischer Ebene |
| 98 | Proximity Access | 就近访问 | Weiterleitung von Benutzeranfragen an nächstgelegene Speicherknoten |
| 99 | Global Namespace | 全球统一命名空间 | Einheitliche Ansichtsverwaltung regionsübergreifender Buckets |
| 100 | Zero-Copy Migration | 零拷贝迁移 | Schnelle Datenmigration durch Metadaten-Operationen |

