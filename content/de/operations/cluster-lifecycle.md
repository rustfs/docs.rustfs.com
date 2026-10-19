---
title: "Cluster-Lebenszyklusoperationen"
description: "Planen, starten, erweitern und rebalancieren Sie RustFS-Cluster mit Erasure Coding, nehmen Sie sie außer Betrieb, stellen Sie Daten wieder her und starten Sie sie neu, mit geprüftem Verhalten von Quorum und Speicherklassen."
---

Dieses Runbook ist der Einstieg für den Betrieb von RustFS-Bereitstellungen mit Erasure Coding: Layoutgrenzen, Speicherklassen und Quorum, Null-Parität, Erweiterung, Rebalancing, Außerbetriebnahme, Datenwiederherstellung (Healing), Laufwerksaustausch und Neustarts. Jedes hier beschriebene Verhalten wurde gegen den RustFS-Quellcode geprüft. Das Upstream-Runbook in [rustfs/rustfs#7998](https://github.com/rustfs/rustfs/pull/7998) ist die Änderung, die es eingeführt hat.

Verwandte Aufgabenseiten: [Speicherpool-Erweiterung](./scaling/storage-pool-expansion.md), [Daten-Rebalancing](./scaling/data-rebalancing.md), [Speicherpool-Außerbetriebnahme](./scaling/storage-pool-decommission.md) und [Datenwiederherstellung von Knoten](./high-availability/node-healing.md).

## Layout-Beschränkungen

Endpunktzahl, Set-Zahl, Laufwerke je Set und Position in der Poolliste eines Speicherpools sind persistiertes Layout. Beim Start vergleicht RustFS das gespeicherte Format mit der konfigurierten Laufwerkszahl und Set-Breite und schlägt dauerhaft mit `PoolTopologyMismatch` fehl (oder mit `UnsupportedSnsdExpansion` bei einer Bereitstellung mit einem Laufwerk), statt zu migrieren. Stellen Sie die ursprünglichen Endpunkte und die Set-Breite wieder her. Löschen Sie `format.json` nicht, um den Fehler zu umgehen.

:::warning[Führen Sie Folgendes niemals aus]

- Überschreiben Sie einen vorhandenen Speicherpool nicht mit mehr oder weniger Endpunkten und ändern Sie `RUSTFS_ERASURE_SET_DRIVE_COUNT` für einen initialisierten Speicherpool nicht.
- Ändern Sie die Reihenfolge der Volume-Argumente nicht und verschieben Sie ein Laufwerksverzeichnis nicht in einen anderen Slot.
- Löschen, kopieren oder benennen Sie Objekt-Shards, `xl.meta` oder etwas unter `.rustfs.sys` nicht von Hand um.
- Behandeln Sie ein manuelles Kopieren von Dateien nicht als Datenverschiebung. Nur Rebalancing und Außerbetriebnahme verschieben Objekte, unter Objektsperren, mit erneuter Versionsprüfung und mit Bereinigung der Quelle.

:::

Laufzeitrollen:

- **Pool:** eine Endpunktliste mit persistiertem Layout. Sets mit mehreren Laufwerken enthalten 2 bis 16 Laufwerke. Ein einzelner lokaler Pfad ist das einzige Layout mit einem Laufwerk.
- **Pool-Leader:** der erste Endpunkt eines Speicherpools. Start, Abbruch und Löschen einer Außerbetriebnahme dürfen an jeden Knoten gesendet werden. Die Anfragen werden über authentifizierte RPC zwischen den Knoten an den Pool-Leader weitergeleitet.
- **Clusterweiter Zustand:** Rebalancing und Root-Heal werden an Peers weitergegeben und stellen sich beim Neustart aus persistierten Metadaten wieder her.

## Planung und erster Start

1. Planen Sie Endpunkte nach Knoten, Rack, Stromversorgung und Netzwerk-Fehlerdomäne. Die Annahme einer Topologie ist keine Hochverfügbarkeitszusage: Ein Speicherpool auf einem einzelnen Knoten verliert mit seinem Host jeden Shard, und der Start protokolliert für jeden Speicherpool mit mehreren Laufwerken eine Warnung `host_failure_data_unavailable`.
2. Wählen Sie die Set-Breite jedes Speicherpools. Die Breite darf sich zwischen Speicherpools unterscheiden, aber jeder Speicherpool muss sich gleichmäßig in Sets einer Breite von 2 bis 16 Laufwerken teilen. `RUSTFS_ERASURE_SET_DRIVE_COUNT` darf nur eine Breite festlegen, die bereits ein gültiger Teiler ist, sonst nichts.
3. Wählen Sie die Parität für STANDARD und RRS nach den Regeln unter [Speicherklassen](#speicherklassen-parität-und-quorum) und prüfen Sie sie gegen den schmalsten Speicherpool, weil eine explizite Parität in jeden Speicherpool passen muss.
4. Notieren Sie den vollständigen Startbefehl, die Endpunktreihenfolge, die Poolreihenfolge, die Set-Breite und die Variablen der Speicherklassen. Sie müssen auf jedem Knoten und bei jedem Neustart identisch sein.
5. Geben Sie RustFS das ausschließliche Eigentum an jedem Endpunktpfad.

Volumes stammen aus Positionsargumenten oder aus `RUSTFS_VOLUMES`. `rustfs` ohne Argumente verhält sich wie `rustfs server` mit Volumes aus der Umgebung. Die Expansion mit Auslassungspunkten folgt dem MinIO-Muster:

```bash
# one pool, four nodes, four drives each: sixteen endpoints
rustfs server http://node{1...4}:9000/data{1...4}

# two pools; every argument must carry an ellipsis once there is more than one
rustfs server http://node{1...4}:9000/data{1...4} http://node{5...8}:9000/data{1...4}
```

Bei mehr als einem Argument braucht jedes Argument Auslassungspunkte. Jeder Speicherpool muss sich auf mindestens zwei unterschiedliche Laufwerksendpunkte ausdehnen. Ein Speicherpool mit einem Laufwerk kann keiner Bereitstellung mit mehreren Speicherpools beitreten. Ein Bereich mit einem einzigen Wert wie `{3...3}` umgeht das Minimum nicht.

Ein Fehler der Speicherklasse stoppt den Start, bevor ein Laufwerk berührt wird. Der Start initialisiert danach lokale Laufwerke, die Lock-Clients und das Format-Quorum, in dieser Reihenfolge.

## Startkonfiguration

| Variable | Wirkung | Beschränkungen |
|---|---|---|
| `RUSTFS_ERASURE_SET_DRIVE_COUNT` | Legt die Set-Breite fest | Muss ein gültiger symmetrischer Teiler des Speicherpools sein, höchstens 16. Kann einen initialisierten Speicherpool nicht ändern |
| `RUSTFS_STORAGE_CLASS_STANDARD` | STANDARD-Parität als `EC:<n>` | Wird je Speicherpool geprüft. Wirkt nur auf neue Schreibvorgänge |
| `RUSTFS_STORAGE_CLASS_RRS` | RRS-Parität als `EC:<n>` | Wird je Speicherpool geprüft. Ein expliziter Wert schlägt auf einem einzelnen Laufwerk fehl. Der persistierte Standard `EC:1` wird dort zu `0` aufgelöst |
| `RUSTFS_STORAGE_CLASS_OPTIMIZE` | Wird aus MinIO-Kompatibilität akzeptiert | Wird gespeichert, ist derzeit aber ungenutzt: Zur Laufzeit ändert es nichts |
| `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` | Feste Inline-Grenze je Shard (Bytesize-Syntax wie `128KiB`) | Ersetzt den skalierten Standard unter [Inline-Objekte](#inline-objekte). Werte über 128 KiB erzeugen eine Warnung im Protokoll |

Ein leeres `RUSTFS_STORAGE_CLASS_STANDARD` oder `RUSTFS_STORAGE_CLASS_RRS` stellt die automatische Richtlinie wieder her und überschreibt einen persistierten Wert. Schreibweisen dieser Schlüssel, von `ERASURE_SET_DRIVE_COUNT` und von `VOLUMES` mit dem Präfix `MINIO_` werden auf die Namen mit `RUSTFS_` abgebildet, wenn der Name mit `RUSTFS_` nicht gesetzt ist. Wenn beide gesetzt sind, gilt der Wert mit `RUSTFS_`, und der Konflikt wird beim Start gemeldet.

Weitere Stellgrößen für Datenverschiebung und Auflistung: `RUSTFS_REBALANCE_MAX_ATTEMPTS` (Standard 3), `RUSTFS_DECOMMISSION_BUCKET_CONCURRENCY` (Standardobergrenze 4), `RUSTFS_DECOMMISSION_ENTRY_CONCURRENCY` (Standardobergrenze 8, harte Obergrenze 64) und `RUSTFS_LIST_OBJECTS_QUORUM` (Standard `optimal`; akzeptiert `disk`, `reduced`, `optimal`, `auto`, alles andere bedeutet `strict`). Keine davon lockert Objekt-Quorum, Objektsperren oder Versionsprüfungen.

## Speicherklassen, Parität und Quorum

### Geometrie

Jedes Objekt wird mit Reed-Solomon über die `N` Laufwerke eines Sets in `K` Daten-Shards und `M` Paritäts-Shards codiert, `N = K + M`. Beliebige `K` Shards stellen es wieder her. Die Geometrie wird je Objekt in `xl.meta` gespeichert. Eine spätere Änderung des Standards schreibt deshalb nichts um. Objekte werden einem Set per Hash zugeordnet, und die Shards rotieren innerhalb dieses Sets. Sets teilen sich nie ein Fehlerbudget.

Standardparität für STANDARD nach Set-Breite: 0 bei einem Laufwerk, 1 bei 2 bis 3, 2 bei 4 bis 5, 3 bei 6 bis 7, 4 bei 8 bis 16. Die Standardparität für RRS ist 1 (0 auf einem einzelnen Laufwerk).

Prüfregeln: Jede Parität beträgt für jeden Speicherpool höchstens `N/2`, und die STANDARD-Parität ist nur dann mindestens die RRS-Parität, wenn beide ungleich null sind. Ein Minimum gibt es nicht, deshalb besteht `EC:0` auf jeder Breite. Bei PUT, CopyObject und CreateMultipartUpload werden nur `STANDARD` und `REDUCED_REDUNDANCY` akzeptiert. Andere AWS-Speicherklassen liefern `InvalidStorageClass`.

### Quorum und Kapazität

```text
usable capacity  ≈ raw × K / N
read quorum      = K            (metadata vote and shard decode)
write quorum     = K, or K + 1 when K == M
delete markers   = N/2 + 1      (majority, both write and vote)
```

Sechzehn Laufwerke bei `EC:4`: `K = 12`, etwa 75 Prozent nutzbar, vier Ausfälle toleriert, zwölf gültige Shards zum Lesen erforderlich. Zwei Laufwerke bei `EC:1`: `K = M = 1`, ein ausgefallenes Laufwerk liest also noch, schreibt aber nicht mehr. Interne Metadaten unter `.rustfs.sys` werden immer mit der Parität `N/2` geschrieben, unabhängig von der konfigurierten Klasse.

### Inline-Objekte

Ein Objekt wird inline in `xl.meta` gespeichert, wenn jeder Shard höchstens das Budget je Shard erreicht. Das Standardbudget ist `256 KiB / K`, gedeckelt auf 128 KiB je Shard. Ein breiteres Set erhöht deshalb die maximale Größe eines Inline-Objekts nicht. In einem Bucket mit Versionierung wird das Budget durch 8 geteilt. `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` ersetzt den skalierten Standard durch eine feste Grenze je Shard. Jedes Laufwerk behält nur seinen eigenen Shard inline. Inline-Daten haben deshalb dieselbe Verlustsemantik wie externe Shards. Komprimierte oder verschlüsselte Ströme werden nur inline gespeichert, wenn die gespeicherte Größe bekannt und innerhalb des Budgets ist.

### Schreib- und Lesepfade

Schreibvorgänge lösen das Layout je Speicherpool auf, codieren mit Reed-Solomon in Blöcken von 1 MiB, schreiben gegen Bitrot geschützte Shards und schreiben sie erst nach Schreibquorum fest. Ein Schreibvorgang unterhalb des Quorums wird niemals als Erfolg gemeldet. Lesevorgänge wählen die maßgeblichen Metadaten beim Lesequorum, prüfen Bitrot, decodieren aus mindestens `K` Shards und lehnen den Vorgang ab, wenn weniger Shards vorliegen. Ein Lesevorgang, der mit fehlenden Shards gelingt, reiht eine Lesereparatur ein. Teile eines mehrteiligen Uploads verwenden die Geometrie und das Schreibquorum des Objekts. `CompleteMultipartUpload` prüft Metadaten und das Quorum für das Festschreiben erneut. Ein hochgeladener Teil ist deshalb kein festgeschriebenes Objekt.

## Null-Parität (EC:0)

`EC:0` wird für STANDARD, für RRS oder für beide auf jeder Set-Breite akzeptiert. Es liefert Rohkapazität und keine Redundanz.

:::danger[Bei EC:0 geht mit einem Laufwerksverlust der Datenbestand im Set verloren]

Ein ersetztes oder gelöschtes Laufwerk verliert dauerhaft jedes Objekt mit Null-Parität, das einen Shard darauf hatte, sofern außerhalb des Sets keine Kopie existiert. Die Datenwiederherstellung kann Objekte mit Null-Parität nicht wiederaufbauen. Sie meldet für sie `no-parity object is unrecoverable`. Produktivbereitstellungen sollten `EC:1` oder höher verwenden. Sobald ein Set mehr als einen Knoten umfasst, ist `EC:2` oder mehr je Set die übliche Untergrenze. Verwenden Sie `EC:0` nur dort, wo eine externe Schicht (RAID, Replikation, Sicherung oder eine neu erzeugbare Quelle) Haltbarkeit und Verfügbarkeit trägt, und nur mit ausdrücklicher Freigabe.

:::

Verhaltensdetails:

- **Konfiguration.** Explizites `EC:0` erzeugt keine Startwarnung. Die Warnung zur fehlenden Redundanz erscheint nur bei automatischer Null-Parität, also bei einem Speicherpool mit einem Laufwerk. `STANDARD=EC:2` mit `RRS=EC:0` ist gültig, weil die Ordnungsregel entfällt, wenn eine Seite null ist. Nur Objekte, die mit `x-amz-storage-class: REDUCED_REDUNDANCY` geschrieben werden, tragen dann die Semantik der Null-Parität.
- **Schreibvorgänge.** Das Schreibquorum ist `N`: Wenn irgendein Laufwerk des Sets nicht beschreibbar ist, schlägt der Schreibvorgang mit `ErasureWriteQuorum` fehl, und es wird nichts festgeschrieben. Weil ein Shard mit Null-Parität später nicht wiederaufgebaut werden kann, prüft der Schreibpfad jeden gerade geschriebenen Shard vor dem Festschreiben gegen seinen Bitrot-Hash und verweigert das Festschreiben eines Shards, der bereits fehlschlägt.
- **Lesevorgänge.** Das Lesequorum ist `N`. Ist irgendein Laufwerk des Sets offline, schlagen HEAD und GET jedes Objekts mit Null-Parität in diesem Set mit `ErasureReadQuorum` fehl. Einen eingeschränkten Lesevorgang gibt es nicht.
- **Löschvorgänge.** Löschmarkierungen und Versionslöschungen verwenden Mehrheitsquorum (`N/2 + 1`). Ein Löschvorgang kann deshalb auf einem Set gelingen, dessen Lese- und Schreibvorgänge fehlschlagen. Ein erfolgreicher Löschvorgang belegt nicht, dass das Set intakt ist.
- **Was bei einem ausgefallenen Laufwerk noch funktioniert.** Bucket-Operationen, Metadaten unter `.rustfs.sys`, Löschmarkierungen und Auflistungen, die das Listen-Quorum erfüllen. Alles andere im Set ist nicht verfügbar, einschließlich Rebalancing und Außerbetriebnahme seiner Objekte, die alle `N` Shards lesen müssen.
- **Ein späteres Anheben der Parität schreibt nichts um.** Laden Sie jedes Objekt nach der Änderung erneut hoch oder kopieren Sie es serverseitig, um es wieder zu schützen.

## Überprüfung nach dem Start

Schreibgeschützte Admin-Prüfungen:

```text
GET /rustfs/admin/v3/pools/list
GET /rustfs/admin/v3/pools/status?pool=<pool>[&by-id=true]
GET /rustfs/admin/v3/decommission/status[?pool=<pool>&by-id=true]
GET /rustfs/admin/v4/cluster/snapshot
GET /rustfs/admin/v4/runtime/capabilities
```

`pool` ist eine Pool-Befehlszeile oder ein nullbasierter Index mit `by-id=true`. Statusabfragen ignorieren unbekannte Parameter. Ändernde Abfragen lehnen unbekannte oder doppelte Parameter ab sowie einen Wert von `by-id`, der nicht `true` oder `false` ist.

Bestätigen Sie: Poolzahl, Endpunkte je Speicherpool, Set-Zahl und Breite je Speicherpool, lokale gegenüber entfernten Endpunkten und keine Topologieabweichung.

Prüfungen der Datenebene: Schreiben Sie ein STANDARD- und ein RRS-Objekt. Führen Sie GET, HEAD, Bereichs-GET, CopyObject und einen mehrteiligen Upload aus. Nehmen Sie ein Laufwerk oder einen Knoten innerhalb der Parität offline und bestätigen Sie, dass Lesevorgänge weiterlaufen und Schreibvorgänge der Quorum-Tabelle entsprechen. Bringen Sie es zurück und bestätigen Sie, dass sich die Heal-Warteschlange leert und Bitrot-Fehler aufhören. Bestätigen Sie, dass jeder Knoten dieselben Pool-Metadaten und denselben Cluster-Snapshot meldet.

## Erweiterung

Ein vorhandener Speicherpool kann nicht an Ort und Stelle wachsen. Fügen Sie einen Speicherpool hinzu:

1. Planen Sie seine Knoten, Laufwerke und Fehlerdomäne. Jeder neue Speicherpool braucht mindestens zwei Laufwerksendpunkte und ein eigenes gültiges Set-Layout.
2. Bereiten Sie auf jedem Knoten leere Pfade vor, die ausschließlich RustFS gehören.
3. Hängen Sie den Speicherpool auf **jedem** Knoten an die Startargumente an und lassen Sie vorhandene Speicherpools, ihre Reihenfolge, Endpunkte und Set-Breite unverändert. Eine Bereitstellung mit einem Knoten und einem Laufwerk kann nicht erweitert werden. Migrieren Sie stattdessen über S3.
4. Starten Sie neu und prüfen Sie gemäß den Prüfungen oben.
5. Neue Schreibvorgänge werden über die verfügbaren Speicherpools verteilt. Alte Objekte bleiben, wo sie sind. Um sie zu verschieben, starten Sie ein Rebalancing. Ein Neustart führt niemals ein Rebalancing aus.

Das Hinzufügen eines Speicherpools fügt vorhandenen Objekten keine Parität hinzu und kopiert nichts. Bewegung zwischen Speicherpools erfolgt nur durch Rebalancing oder Außerbetriebnahme. Ein ausgearbeitetes Beispiel steht unter [Speicherpool-Erweiterung](./scaling/storage-pool-expansion.md).

## Rebalancing

Rebalancing verteilt Objekte nach Nutzung über die Speicherpools neu. Vorbedingungen: mehr als ein Speicherpool (ein einzelner Speicherpool liefert `NotImplemented`), keine laufende oder im Konflikt stehende Außerbetriebnahme und keine Abfragezeichenfolge bei `start` oder `stop`.

```text
POST /rustfs/admin/v3/rebalance/start     → {"id": "<uuid>"}
GET  /rustfs/admin/v3/rebalance/status
POST /rustfs/admin/v3/rebalance/stop
```

Der Status meldet je Speicherpool `id`, `status`, `stopping`, `used`, `lastError`, `cleanupWarnings` und `progress` (Objekte, Versionen, Bytes, verbleibende Buckets, aktueller Bucket und aktuelles Objekt, vergangene Zeit, ETA) sowie `stoppedAt` und Felder zur Stopp-Weitergabe.

Start gibt eine Sperre für neue Zulassungen und den Worker-Zustand an die Peers weiter. Schlägt die Weitergabe fehl, wird auf einen Endzustand zurückgerollt, und jeder Peer, der nicht zurückgerollt ist, wird gemeldet. Stop schließt die Zulassung, stoppt lokale und entfernte Worker und persistiert den gestoppten Zustand. Behandeln Sie ein Rebalancing nur dann als abgeschlossen, wenn kein Speicherpool aktiv ist oder stoppt, `lastError` leer oder erklärt ist, `cleanupWarnings` verstanden sind, die Stopp-Weitergabe abgeschlossen ist und migrierte Objekte aus ihrem neuen Speicherpool gelesen werden können. Der Zustand je Speicherpool liegt in `rebalance.bin`. Löschen Sie die Datei niemals, um einen Lauf freizugeben. Die Durchführung steht unter [Daten-Rebalancing](./scaling/data-rebalancing.md).

## Außerbetriebnahme

Kurz für den Betrieb: nur bei Bereitstellungen mit mehreren Speicherpools unterstützt, die das Format mit Auslassungspunkten verwenden. Alles andere liefert `NotImplemented`. Ein laufendes Rebalancing blockiert den Start.

```text
POST /rustfs/admin/v3/pools/decommission?pool=<a>[,<b>]      # by command line
POST /rustfs/admin/v3/pools/decommission?pool=1&by-id=true   # by index
GET  /rustfs/admin/v3/decommission/status[?pool=1&by-id=true]
POST /rustfs/admin/v3/pools/cancel?pool=1&by-id=true
POST /rustfs/admin/v3/pools/clear?pool=1&by-id=true
```

- Ziele werden als Stapel geprüft, bevor etwas persistiert wird. Unbekannte, doppelte, aktive, eingereihte oder abgeschlossene Ziele werden abgelehnt. Fehlgeschlagene oder abgebrochene Ziele müssen zuerst gelöscht werden, außer sie enthalten unaufgelöste Auflistungseinträge. Dann ist ein neuer Start der Pfad für einen erneuten Versuch.
- Zustände der Einträge: `queued` → `active` → `completed`, `failed` oder `canceled`, persistiert in `pool.bin`. Der Start setzt Einträge fort, die noch keinen Endzustand haben, und überspringt vorangehende Einträge im Endzustand.
- Ein Quellpool in irgendeinem Außerbetriebszustand lehnt neue gewöhnliche PUTs und neue mehrteilige Uploads ab (ein bereits begonnener PUT erhält `SlowDown`). Vorhandene mehrteilige Uploads dürfen abfließen, solange die Quelle nicht endgültig ist.
- `clear` entfernt nur Metadaten fehlgeschlagener oder abgebrochener Vorgänge und verschiebt niemals Daten zurück.
- Entfernen Sie einen Speicherpool erst dann aus den Startargumenten, wenn sein Eintrag `completed` ist, freie Versionen und die Tier-Zugehörigkeit zusammengeführt sind und jeder Knoten denselben Status zeigt. Trennen Sie Quelllaufwerke niemals vorher, und ersetzen Sie die Konfigurationsänderung niemals durch das Löschen eines Verzeichnisses.

Die Durchführung steht unter [Speicherpool-Außerbetriebnahme](./scaling/storage-pool-decommission.md).

## Datenwiederherstellung und Laufwerksaustausch

### Admin-Heal

```text
POST /rustfs/admin/v3/heal/                    # root: cluster, or one erasure set with pool+set
POST /rustfs/admin/v3/heal/<bucket>
POST /rustfs/admin/v3/heal/<bucket>/<prefix>
POST /rustfs/admin/v3/background-heal/status
GET  /rustfs/admin/v4/heal/replacement-recovery
```

Der JSON-Body trägt `recursive`, `dryRun`, `remove`, `recreate`, `scanMode`, `updateParity`, `nolock`, `readRepair`, `pool` und `set`. Regeln der Verarbeitung:

- Ein Root-Heal muss `recursive=true` setzen oder sowohl `pool` als auch `set` nennen. Ein Bucket-Heal ohne Präfix ist immer rekursiv, und ein Präfix-Heal beachtet `recursive`.
- `readRepair=true` wird mit `InvalidArgument` abgelehnt.
- `nolock` wird auf der Leitung akzeptiert, aber immer auf `false` gezwungen. Admin-Heals nehmen immer die Sperre des Objekt-Namensraums. Eine Umgehung der Sperre gibt es nicht.
- `clientToken` verknüpft Start, Status und Stopp. `forceStart` und `forceStop` werden dagegen geprüft, und unbekannte oder doppelte Abfrageschlüssel werden abgelehnt.

Die Datenwiederherstellung wählt die maßgebliche Version aus den Quorum-Metadaten und verweigert den Vorgang, wenn mehr Shards fehlen, als die Parität wiederaufbauen kann, oder wenn die gespeicherte Geometrie nicht zum Set passt. Sie teilt die Sperre `(bucket, object)` mit PUT, Löschen, Abschluss eines mehrteiligen Uploads und Datenverschiebung.

### Laufwerksaustausch

1. Bestätigen Sie, dass das betroffene Set für seine Objekte noch das Lesequorum erfüllt (bei `EC:0` unmöglich), und notieren Sie Pool-Index, Set-Index, Slot und die UUID des ausgefallenen Laufwerks aus dem Poolstatus.
2. Ersetzen Sie das Laufwerk am **selben** Endpunkt und Einhängepfad durch ein leeres Dateisystem, das RustFS gehört. Kopieren Sie die Verzeichnisse des alten Laufwerks nicht. Eine kopierte `format.json` beansprucht eine Identität, die das Set bereits führt.
3. Bringen Sie den Knoten zurück. Das leere Laufwerk ist kein Mitglied des Format-Quorums, deshalb bleibt sein Slot offline, bis die Heal-Aufgabe des Erasure-Sets das Format in den ursprünglichen Slot schreibt und die Shards wiederaufbaut. Das geschieht über die aufgezeichnete automatische Ersatzabsicht, wenn der Start oder der Laufwerksscanner eine geänderte Einhängeidentität erkennt, oder über einen Admin-Heal des Erasure-Sets (`POST /rustfs/admin/v3/heal/` mit `pool` und `set`).
4. Beobachten Sie `GET /rustfs/admin/v4/heal/replacement-recovery`, den Status der Hintergrund-Datenwiederherstellung, die Laufwerksintegrität und die Bitrot-Zähler. Eine Warteschlange mit `idle` oder ein lesbares Objekt belegt den Abschluss nicht.
5. Der Austausch ist abgeschlossen, wenn die Wiederherstellung für diese Instanz `completed` meldet und stichprobenartig geprüfte Objekte `xl.meta` und Teile auf dem neuen Laufwerk haben.

Wenn ein Set mehr Laufwerke verloren hat, als seine Parität abdeckt, kann die Datenwiederherstellung nichts wiederaufbauen. Stellen Sie die Daten aus der Replikation, einer entfernten Stufe oder einer Sicherung wieder her. Das umfassendere Modell der Datenwiederherstellung steht unter [Datenwiederherstellung von Knoten](./high-availability/node-healing.md).

## Neustart und Wiederherstellung

- **Gewöhnlicher Neustart.** Keine laufende Topologieänderung, identische Argumente auf jedem Knoten, jeweils ein Knoten. Der Start lädt Pool-Metadaten, `rebalance.bin`, die Außerbetriebnahme-Warteschlange und die Wiederherstellungsdatensätze des Heal neu und setzt Worker nach den Regeln für Leader und Eigentümer fort.
- **Rebalancing.** Lesen Sie zuerst `/rebalance/status`. Behandeln Sie aktive oder stoppende Speicherpools, `lastError`, Bereinigungswarnungen und die Stopp-Weitergabe, bevor Sie sich für Stopp oder Neustart entscheiden. Löschen Sie `rebalance.bin` nicht.
- **Außerbetriebnahme.** Nicht endgültige Einträge werden fortgesetzt. Fehlgeschlagene und abgebrochene Einträge überdauern Neustarts, bis sie gelöscht oder über den zulässigen Pfad erneut versucht werden.
- **Root-Heal.** Ein geordnetes Herunterfahren persistiert eine unfertige clusterweite Datenwiederherstellung als `root-heal-<task-id>.json` unter `.rustfs.sys` und spielt sie mit derselben Aufgaben-ID erneut ab. Ungültige, zu große oder nicht unterstützte Datensätze wandern in Quarantäne-Präfixe und werden mit einer Protokollzeile übersprungen, bis der Betrieb sie repariert. Löschen Sie Quarantäne-Markierungen nicht und verwenden Sie eine Aufgaben-ID nicht erneut.
- **Unsauberes Herunterfahren.** Wenn der vorherige Lauf seine Markierung hinterlassen hat, reiht der Heal-Manager für jedes lokale Set eine vollständige Datenwiederherstellung des Erasure-Sets ein. Ein geordnetes Herunterfahren löscht die Markierung.

## Gegenseitiger Ausschluss und unzulässige Aktionen

| Vorgang | Mit Rebalancing | Mit Außerbetriebnahme | Hinweise |
|---|---|---|---|
| PUT, DELETE, Abschluss eines mehrteiligen Uploads | Objektsperre | Der Quellpool lehnt neue Veröffentlichung ab | Umgehen Sie die Poolsperre niemals |
| Außerbetriebnahme | Abgelehnt, solange Rebalancing läuft | Serielle Warteschlange | Änderung nur durch den Leader |
| Rebalancing | Nur bei mehreren Speicherpools | Abgelehnt, solange eine Außerbetriebnahme läuft oder im Konflikt steht | Keine Abfrageparameter |
| Admin-Heal | Objektsperre | Repariert Daten, ändert den Außerbetriebszustand niemals | `nolock` wird ignoriert |
| Laufwerksaustausch | Kann das Layout nicht ändern | Vermeiden Sie ihn auf einem Quellpool während der Außerbetriebnahme | Derselbe Slot, leeres Laufwerk |

:::warning[Unzulässig]

Ändern Sie Start-Endpunkte nicht, solange Rebalancing oder Außerbetriebnahme läuft. Löschen Sie `.rustfs.sys`, `rebalance.bin`, `pool.bin` oder Root-Heal-Datensätze nicht. Führen Sie manuelle Datenwiederherstellung, Dateikopien und Laufwerksaustausch nicht gleichzeitig auf einem Speicherpool aus. Werten Sie ein HTTP 200 bei einem Startaufruf nicht als Abschluss.

:::

## Checklisten

- **Nach Start oder Erweiterung:** identische Endpunkte und Poolreihenfolge auf jedem Knoten; Topologie entspricht dem gespeicherten Format; Peers bereit; neue Endpunkte eindeutig und ausschließlich für RustFS; GET, HEAD, Bereichs-GET und mehrteiliger Upload geprüft.
- **Nach dem Rebalancing:** kein Speicherpool aktiv oder stoppend; `lastError` leer oder erklärt; `cleanupWarnings` behandelt; Stopp-Weitergabe abgeschlossen; migrierte Objekte lesbar.
- **Nach der Außerbetriebnahme:** Status `completed`; andere Einträge gemäß Richtlinie behandelt; der Quellpool lehnt neue Schreibvorgänge ab; freie Versionen, Tier-Zugehörigkeit und Auflistungseinträge sind zusammengeführt; Startargumente auf jedem Knoten aktualisiert, bevor Laufwerke getrennt werden.
- **Nach Datenwiederherstellung oder Austausch:** Ersatzwiederherstellung `completed`; Slot und UUID korrekt; Heal-Warteschlange geleert; keine wachsende Bitrot-Zahl; stichprobenartig geprüfte aktuelle und historische Versionen lesbar; keine übrig gebliebenen temporären Verzeichnisse.

## Zuordnung der rc-Befehle

`rc` ist die RustFS-CLI (siehe [CLI-Client (rc)](./rc.mdx)). Die Gruppe `expand` ist ein Alias von `rebalance`. Eine serverseitige Expand-API gibt es nicht. Die folgenden Optionen sind die häufig verwendeten. Prüfen Sie `rc admin <group> --help` für die installierte Version.

```bash
rc alias set local http://localhost:9000 <your-access-key> <your-secret-key>
rc ping local
rc ready local --timeout 2
rc admin info cluster local
rc admin info disk local --offline
rc admin pool list local
rc admin pool status local 0 --by-id
rc admin rebalance start local
rc admin rebalance status local
rc admin rebalance stop local
rc admin decommission start local '/data/pool1/disk{1...4}'
rc admin decommission status local 1 --by-id
rc admin decommission cancel local 1 --by-id
rc admin decommission clear local 1 --by-id
rc admin heal start local --scan-mode deep
rc admin heal start local --bucket logs --prefix 2026/ --scan-mode deep
rc admin heal status local --client-token <TOKEN_FROM_START>
rc admin heal stop local --client-token <TOKEN_FROM_START>
```

| `rc`-Befehl | Serverroute |
|---|---|
| `rc ping` / `rc ready` | `GET /health` / `GET /health/ready` |
| `rc admin pool list` / `status` | `GET /rustfs/admin/v3/pools/list` / `GET /rustfs/admin/v3/pools/status` |
| `rc admin rebalance …` (Alias `expand`) | `/rustfs/admin/v3/rebalance/*` |
| `rc admin decommission start` / `cancel` / `clear` | `POST /rustfs/admin/v3/pools/decommission` / `cancel` / `clear` |
| `rc admin decommission status` | `GET /rustfs/admin/v3/decommission/status` |
| `rc admin heal start` / `status` / `stop` | `/rustfs/admin/v3/heal/*`, `POST /rustfs/admin/v3/background-heal/status` |

`rc admin heal start` stellt `--bucket`, `--prefix`, `--scan-mode`, `--remove`, `--recreate` und `--dry-run` bereit. `nolock`, `forceStart`, `forceStop`, `pool` und `set` stellt es nicht bereit. Für die Ersatzwiederherstellung gibt es keinen `rc`-Befehl. Rufen Sie `GET /rustfs/admin/v4/heal/replacement-recovery` direkt auf.

## Referenzen

- Upstream-Runbook: `docs/operations/cluster-lifecycle-operations.md` in [rustfs/rustfs#7998](https://github.com/rustfs/rustfs/pull/7998). Daraus ist diese Seite abgeleitet und Aussage für Aussage gegen den RustFS-Quellcode geprüft.
- [Speicherpool-Erweiterung](./scaling/storage-pool-expansion.md) · [Daten-Rebalancing](./scaling/data-rebalancing.md) · [Speicherpool-Außerbetriebnahme](./scaling/storage-pool-decommission.md) · [Datenwiederherstellung von Knoten](./high-availability/node-healing.md) · [CLI-Client (rc)](./rc.mdx)
