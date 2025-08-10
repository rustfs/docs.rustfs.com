# Alternativa ao Hadoop HDFS

## Desafios do HDFS

O HDFS teve papel importante, mas com o crescimento exponencial de dados e novas exigências, surgem desafios:

### Operação complexa

- Risco de SPOF do NameNode (mesmo com HA)
- Gestão de cluster complexa e dependente de equipa especializada
- Configuração/tuning com curva acentuada

### Gargalos de performance

- Pequenos ficheiros consomem memória do NameNode
- Metadados limitam expansão
- Overhead de rede devido a replicação

### Custos

- Elevado CAPEX (servidores/storage)
- OPEX e equipa especializada
- Energia/arrefecimento

## Vantagens do RustFS

### Arquitetura

- Descentralizado, sem SPOF
- Cloud‑native, contentorizado e escalável
- Multi‑protocolo: HDFS, S3, NFS

### Performance

- Alta concorrência (Rust, segurança de memória)
- Cache multi‑nível
- Layout otimizado, menos tráfego

### Operação

- Deploy simplificado e automação
- Monitorização e alertas em tempo real
- Scale‑out elástico

## Comparativo

| Característica | HDFS | RustFS |
|------|------|---------|
| Arquitetura | Master/Slave (NameNode/DataNode) | P2P descentralizada |
| SPOF | NameNode | Não |
| Escalabilidade | Limitada à memória do NameNode | Linear |
| Protocolos | HDFS | HDFS, S3, NFS |
| Pequenos ficheiros | Fraco | Otimizado |
| Complexidade de deploy | Alta | Baixa |
| O&M | Equipa especializada | Automatizada |
| Cloud‑native | Limitado | Nativo |

## Estratégias de migração

### Offline (DistCP)

- Janela em baixo tráfego
- Migração por lotes
- Validação de integridade

### Online (dual‑write)

- Escrita simultânea para HDFS e RustFS
- Cutover gradual de leituras
- Sincronização contínua

### Híbrido

- Camada de acesso unificada
- Roteamento inteligente por características de dados
- Migração progressiva (novo→RustFS, legado→HDFS)

## Arquitetura moderna

### Compatibilidade S3

- Operações padrão (PUT/GET/DELETE/LIST)
- Multipart upload
- URLs pré‑assinadas
- Versionamento

### Segurança

- Criptografia end‑to‑end (em trânsito e at‑rest)
- RBAC granular
- Auditoria completa
- Conformidade

### Auto‑scale

- Adaptação dinâmica de nós
- Balanceamento inteligente
- Otimização de recursos
- Redução de TCO

### Observabilidade

- Monitorização em tempo real
- Alertas inteligentes
- Análise de performance
- Operação automatizada

## Análise de custos (TCO)

| Item | HDFS | RustFS | Poupança |
|------|------|--------|----------|
| Hardware | Alto | Médio | 30–40% |
| Operação | Alto | Baixo | 50–60% |
| Equipa | Alto | Baixo | 40–50% |
| Energia | Alto | Médio | 20–30% |
| TCO | Base | | 40–50% |

### ROI

- Deploy de semanas para horas
- O&M reduzido em ~60%
- 2–3× performance
- 40–50% TCO

### Valor da migração

- Reduz dívida técnica
- Suporta estratégia cloud‑native
- Otimiza custos
- Acelera inovação (AI/Big Data)

Ao adotar o RustFS como sucessor do HDFS, resolve‑se os desafios atuais e prepara‑se a transformação digital futura.
