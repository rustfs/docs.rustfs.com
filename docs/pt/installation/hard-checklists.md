---
title: "Guia de configuração de hardware para produção"
description: "RustFS é um armazenamento de objetos distribuído de alto desempenho desenvolvido em Rust. Este guia fornece recomendações de escolha e configuração de hardware para implantação em produção."
---

# Guia de configuração de hardware para produção

## 1. Análise de planeamento

Antes da produção, conduza 2–3 semanas de levantamento para avaliar:

1. Escala de dados
   - Volume inicial efetivo (em TiB) e proporção hot/cold
   - Crescimento previsto em 24 meses (modelo de taxa trimestral)
   - Número de objetos (média 128 KB–1 MB). Acima de 100 milhões exige otimizações

2. Perfil de negócio
   - Padrão de acesso: leitura intensiva (CDN) vs escrita intensiva (logs)
   - Conformidade: retenção conforme regulação (ex.: 5 anos em finanças)
   - Multissite: latência (<50 ms) e custo de banda entre regiões

3. Arquitetura de armazenamento
   - Planeamento de buckets por domínio de negócio (≤ 500 buckets ativos/cluster)
   - DR: ativo‑ativo (recomendado) ou replicação assíncrona

## 2. Matriz de configuração de hardware

Configuração base sugerida por resultados de testes de stress:

| Componente | Ambiente base | Padrão de produção | Alto desempenho |
|------------|----------------|--------------------|-----------------|
| Nº de nós | 4 | 8 | 16+ |
| Mídia | 4× NVMe SSD | 8× NVMe SSD | 12× NVMe SSD |
| Rede | Duplo 25GbE (LACP) | Duplo 100GbE | 200GbE |
| CPU | 2× Intel Silver 4310 (16c) | 2× AMD EPYC 7313 (32c) | 2× Intel Platinum 8461Y (48c) |
| Memória | 64 GB DDR4‑3200 ECC | 256 GB DDR5‑4800 ECC | 512 GB DDR5‑5600 ECC |
| Controlador | HBA 9500‑8i | HBA 9600‑16i | Duplo controlador redundante |

Princípios críticos:
1) “Fazenda” homogénea: mesmo lote de hardware/firmware em todos os nós
2) Rede: leaf‑spine + rede de storage isolada + dupla uplink
3) Servidor 2U recomendado; ≥ 12 bays por nó (conforme discos reais)

## 3. Otimização de caminho crítico

### 1) Topologia de rede (prioridade máxima)
- Cálculo de banda: reserve 0,5 Gbps por TiB efetivo (ex.: 100 TiB ⇒ 50 Gbps dedicados)
- Latência:
  - P99 entre nós ≤ 2 ms
  - Entre racks ≤ 5 ms

### 2) Subsistema de armazenamento
- Controlador:
  - Read‑ahead ativo (≥ 256 MB)
  - RAID desativado (modo HBA pass‑through)
  - Verificar saúde de BBU regularmente
- SSD:
  - 20% OP para durabilidade
  - Atomic write se suportado

### 3) Gestão de memória
- Proporções:
  - Cache de metadados: 60%
  - Buffers R/W: 30%
  - Reserva do sistema: 10%

## 4. Modelos de rede de referência

### Relação banda vs discos
| Rede | Throughput teórico | Mídia | Nº máx. de discos |
|------|--------------------|-------|-------------------|
| 10GbE | 1.25 GB/s | HDD 7.2K (180 MB/s) | 8 |
| 25GbE | 3.125 GB/s | SATA SSD (550 MB/s) | 6 |
| 100GbE | 12.5 GB/s | NVMe Gen4 (7 GB/s) | 2 a full RW |

Caso prático: plataforma de vídeo com 16 nós, cada um com:
- 8× 7.68 TB NVMe SSD
- Duas NICs 100GbE CX5
- Throughput agregado 38 GB/s

## 5. Calculadora de memória

Algoritmo dinâmico por capacidade e padrão de acesso:

```python
# Fórmula (GB)
def calc_memory(data_tb, access_pattern):
 base = 32
 if access_pattern == "read_heavy":
  return base + data_tb * 0.8
 elif access_pattern == "write_heavy":
  return base + data_tb * 1.2
 else:  # mixed
  return base + data_tb * 1.0
```

Tabela de referência:
| Escala | Leitura | Escrita | Misto |
|--------|---------|---------|-------|
| 10 TB | 40 GB | 44 GB | 42 GB |
| 100 TB | 112 GB | 152 GB | 132 GB |
| 500 TB | 432 GB | 632 GB | 532 GB |

## 6. Normas de implantação de storage

### 1) Seleção de mídia
| Métrica | HDD | SSD | NVMe (requisitos) |
|--------|-----|-----|-------------------|
| Latência | >50 ms | 1–10 ms | <1 ms |
| Throughput | < 500 MB/s | 500 MB–3 GB/s | > 3 GB/s |
| Casos | Arquivo | Hot cache | Análise em tempo real |

### 2) Sistema de ficheiros
```bash
# Exemplo XFS
mkfs.xfs -f -L rustfs_disk1 -d su=256k,sw=10 /dev/sdb

# Montagem recomendada
UUID=xxxx /mnt/disk1 xfs defaults,noatime,nodiratime,logbsize=256k 0 0
```

## 7. Alta disponibilidade

1) Energia
- Dual power feed
- PDUs em subestações distintas
- UPS (≥ 30 min)

2) Arrefecimento
- Densidade ≤ 15 kW/rack
- Delta T in/out ≤ 8 °C

3) Firmware
- Matriz de compatibilidade de hardware
- Versões de firmware unificadas

> Sugestão: execute stress test de 72 h antes da produção, simulando:
> 1) Failover de nó
> 2) Partition de rede
> 3) Pico de escrita (até 120% do teórico)

---

Este guia baseia‑se na versão recente do RustFS. Ajuste parâmetros conforme whitepapers dos fornecedores e considere auditoria de saúde de hardware trimestral com a equipa RustFS.