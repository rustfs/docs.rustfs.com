---
title: "Modos de arranque"
description: "Quantos modos de arranque o RustFS oferece?"
---

# Modos de arranque

O RustFS suporta três modos:

- Single Node Single Disk (SNSD): um único disco numa só máquina
- Single Node Multiple Disk (SNMD): múltiplos discos numa só máquina
- Multiple Node Multiple Disk (MNMD): múltiplas máquinas com múltiplos discos

## Modo SNSD (Single Node Single Disk)

> Indicado para cargas não críticas e baixa densidade. Em produção, mantenha backups para evitar risco.

Uma máquina com um único disco de dados; todos os dados residem nesse disco.

Arquitetura:

<img src="./images/1.jpg" alt="RustFS Single Node Single Disk Mode" />

## Modo SNMD (Single Node Multiple Disk)

> Para cargas médias não críticas. Em produção, perda de até M discos não implica risco de dados; perda do servidor inteiro ou >M discos leva a perda de dados.

Uma máquina com múltiplos discos. Os objetos são fragmentados e distribuídos entre discos.

Um bloco é dividido em K fragmentos de dados e M de paridade; tolera perda de até M fragmentos de paridade e requer K dados para reconstrução.

Exemplo:

<img src="./images/2.jpg" alt="RustFS Single Node Multiple Disk Mode" />

## Modo MNMD (Multiple Node Multiple Disk)

> Para cargas críticas em produção. Requer ajuste por especialistas considerando concorrência, throughput, cenários e pressão.

Mínimo 4 servidores; cada servidor com pelo menos 1 disco para formar um cluster distribuído seguro.

Com balanceador de carga, dados podem ser escritos em qualquer servidor. Exemplo padrão 12+4: um bloco divide‑se em 12 de dados + 4 de paridade, distribuídos em discos distintos de servidores distintos.

Falha de 1 servidor não afeta a segurança dos dados. Danos em até 4 discos permanecem tolerados.

<img src="./images/lb.jpg" alt="RustFS Multiple Node Multiple Disk Mode" />
