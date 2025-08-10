# Solução para produção industrial

Armazenamento, inspeção de qualidade e rastreabilidade para volumes massivos de dados; preservação a longo prazo com otimização de custos.

## Quatro desafios centrais

| Dor | Cenários/Desafios | Necessidade do utilizador |
|-----|--------------------|---------------------------|
| Capacidade e escalabilidade | Sensores e equipamentos geram dados em PB; storage tradicional escala mal e é caro | Escala elástica com crescimento dinâmico; reduzir CAPEX/OPEX |
| Processamento em tempo real | Monitorização e manutenção preditiva exigem latências de ms; storage tradicional adiciona latência | Alto IOPS/throughput; suporte a analytics em tempo real e edge |
| Segurança e conformidade | Dados industriais sensíveis; conformidade (GDPR, ISO 27001, etc.) | Encriptação end‑to‑end, RBAC granular, auditoria completa |
| Dados heterogéneos | S3, NFS, bases de dados; silos e baixa utilização | Plataforma unificada multi‑protocolo com gestão centralizada |

## Solução

### Tiering SSD + HDD para reduzir custos

![SSD e HDD](./images/ssd-hdd-solution.png)

SSD para I/O intensivo e HDD para capacidade. Dados quentes em SSD e frios em HDD equilibram custo e desempenho.

#### Vantagens do tiering

- Desempenho: aceleração com SSD onde necessário
- Custo: HDD para o grosso dos dados frios
- Operação: políticas automáticas por ciclo de vida
- Escala: expansão por camadas e integração com cloud
- Resiliência: cópias e espelhamento
- Eficiência: menor consumo energético

#### Comparativo SSD+HDD vs. soluções únicas

| Item | Apenas SSD | Apenas HDD | Tiering SSD+HDD |
|------|------------|------------|------------------|
| Custo de mídia | Alto | Baixo | Misto (SSD p/ 20% dados quentes) |
| Latência | ~0,1 ms | 8–10 ms | ~0,15 ms em quente; frio sob consulta |
| Energia (1 PB/ano) | Elevada | Elevada | Otimizada (SSD baixo consumo + HDD hibernação) |
| Expansão | Caro | Gargalo de performance | Por camada (ex.: ampliar só HDD) |
| TCO 5 anos | Alto | Baixo | Intermédio (equilíbrio custo/perf.) |
| Cenários | Tempo real | Arquivo/backup | Cargas mistas (BD/ficheiros) |

### Arquivo frio para reduzir custos

![Arquivo frio](./images/cold-backup-solution.png)

Mídias como ótico/fita reduzem custo para dados de baixa frequência e longa retenção, com consumo energético menor.

#### Vantagens

- Custo por GB reduzido em dados frios
- Retenção longa com poucas migrações
- Segurança e conformidade com encriptação e imutabilidade

#### Comparativo (1 PB / 5 anos)

| Mídia | Custo total | Energia | Vida útil |
|-------|-------------|---------|----------|
| Óptico | Otimizado | Baixo | 50+ anos |
| Fita | Médio | Médio | ~30 anos |
| HDD | Mais alto | Mais alto | ~5 anos |

### Multicloud para otimizar custos

![Multicloud](./images/multi-cloud-solution.png)

Orquestração para colocar dados quentes em camadas de alto desempenho e frios em camadas económicas, usando interfaces padronizadas e caminhos ótimos por proximidade.

#### Vantagens

- Orquestração entre clouds
- Otimização de custo por políticas
- Aceleração com SSD para cargas críticas

### Pirâmide de valor tecnológico

![Pirâmide](./images/tech-value-pyramid.png)

Baseado em armazenamento de objetos distribuído confiável e elástico, suporta produção inteligente fim‑a‑fim, QA assistido por IA e colaboração global de cadeia de fornecimento, impulsionando evolução para Indústria 4.0.
