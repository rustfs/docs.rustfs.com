# Infrastruktur für großangelegte Daten

RustFS ist für Skalierung konzipiert. Technische Skalierung, operative Skalierung und wirtschaftliche Skalierung. Grundlegende Skalierung.

RustFS ist als Cloud-nativ konzipiert und kann als leichtgewichtige Container betrieben werden, die von externen Orchestrierungsdiensten wie Kubernetes verwaltet werden. Der gesamte Server ist eine ~100 MB statische Binärdatei, die CPU- und Speicherressourcen auch bei hoher Last effizient nutzt. Das Ergebnis ist, dass Sie eine große Anzahl von Mandanten auf gemeinsam genutzter Hardware co-hosten können.

![RustFS Architekturdiagramm](./images/s2-1.png)

RustFS kann überall und in jeder Cloud laufen, läuft aber typischerweise auf handelsüblichen Servern mit lokal angeschlossenen Laufwerken (JBOD/JBOF). Alle Server im Cluster sind funktional gleichwertig (vollständig symmetrische Architektur). Es gibt keine Namensknoten oder Metadatenserver.

RustFS schreibt Daten und Metadaten zusammen als Objekte, ohne eine Metadatendatenbank zu benötigen. Darüber hinaus führt RustFS alle Funktionen (Erasure Coding, Bitrot-Checking, Verschlüsselung) als Inline-, strikt konsistente Operationen aus. Das Ergebnis ist, dass RustFS außergewöhnlich resilient ist.

Jeder RustFS-Cluster ist eine Sammlung verteilter RustFS-Server mit einem Prozess pro Knoten. RustFS läuft im Benutzerraum als ein einziger Prozess und nutzt leichtgewichtige Coroutinen für hohe Parallelität. Laufwerke werden in Erasure-Sets gruppiert (siehe Erasure-Rechner hier) und Objekte werden mit deterministischen Hash-Algorithmen auf diesen Sets platziert.

RustFS ist für große, Multi-Rechenzentrum-Cloud-Speicherdienste konzipiert. Jeder Mandant betreibt seinen eigenen RustFS-Cluster, vollständig isoliert von anderen Mandanten, was ihnen ermöglicht, sie vor jeglichen Störungen durch Upgrades, Updates und Sicherheitsereignisse zu schützen. Jeder Mandant skaliert unabhängig durch Föderierung von Clustern über geografische Standorte hinweg.

