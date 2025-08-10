---
title: "Verificação e auto‑recuperação de objetos"
description: "Design e princípios da self‑healing no RustFS em ambiente single‑server multi‑disk"
---

# Verificação e auto‑recuperação de objetos

## Visão geral

## Arquitetura do RustFS e design de auto‑recuperação

### Arquitetura single‑server multi‑disk

O RustFS organiza múltiplos discos como um pool lógico. Objetos são divididos em shards de dados e de paridade (erasure coding) e distribuídos por discos distintos para fiabilidade e desempenho.

### Princípios de self‑healing

1. Verificação de integridade por checksum durante leitura (semelhante a ZFS)
2. Redundância por erasure coding para reconstrução quando partes se perdem/corrompem
3. Disparos multi‑nível: online na leitura, scanner de fundo e gatilho manual

## Princípios de auto‑recuperação

### Verificação e erasure

Durante escrita, objetos são particionados em `k` shards de dados e `m` de paridade (total `n=k+m`). Na leitura, shards em falta são reconstruídos a partir dos restantes.

### Scrub & Repair

Executa varrimento leve (comparação de metadados/tamanhos) e profundo (leitura bit‑a‑bit com checksum) para detetar e corrigir bit rot. Ao detetar inconsistências, aciona Repair para reconstruir shards e reescrevê‑los.

## Fluxos de self‑healing

### Auto‑recuperação online em leitura

1) Se todos os shards estão íntegros, retorna dados
2) Se há perda/corrupção, reconstrói com shards redundantes e devolve objeto completo

### Auto‑recuperação por scanner de fundo

O scanner percorre 1/1024 dos objetos por hashing, executa verificações periódicas e dispara reconstrução quando necessário. Por omissão, o deep scrub fica desativado (pode ser ligado sob demanda).

### Gatilho manual

```bash
rc admin heal start --all
```

Varre todo o pool e verifica/repara integralmente. Consome recursos; use em janelas de baixa atividade.

## Exemplos

```bash
# Estado de self‑healing
rc admin heal status
# Auto‑recuperar apenas um bucket
rc admin heal start --bucket photos
# Parar tarefa em execução
rc admin heal stop
```

## Sumário

A self‑healing do RustFS combina práticas de MinIO, Ceph e ZFS e, com múltiplos gatilhos e verificação/repair, lida eficazmente com shards danificados, falhas de disco e bit rot em cenários single‑node/multi‑node, garantindo alta fiabilidade e disponibilidade.
