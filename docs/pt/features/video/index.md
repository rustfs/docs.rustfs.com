# Solução de redução de custos para armazenamento de vídeo

Reduza significativamente o custo de armazenamento de vídeo com object storage e arquitetura híbrida/multicloud.

## Desafios centrais do armazenamento de vídeo

### Limitações de abordagens tradicionais

- Arquiteturas lineares degradam I/O com crescimento de capacidade
- Vídeo bruto consome espaço; dados frios ocupam camadas de alto desempenho
- Replicação simples + backups periódicos
- Expansão exige janelas de manutenção; falta de ferramentas de gestão inteligentes

### Impacto no negócio

- Atrasos ao recuperar frames críticos afetam resposta a incidentes
- Crescimento acelerado de custo; grande parte do storage é acesso esporádico
- Risco de recuperação lenta após falhas
- Custo operacional por TB elevado, disponibilidade inferior ao desejado

## Cinco pilares de otimização de custo

### Otimização de armazenamento

- Compressão/encodes eficientes adequados ao caso
- Tiering automático: dados frios migram para camadas de custo reduzido
- Escala elástica para níveis de capacidade elevados

### Acesso eficiente

- Caching/edge para acelerar acesso distribuído
- Suporte a ingest concorrente
- Pré‑carregamento para conteúdos de alto acesso

### Proteção de dados

- Redundância e resiliência geográfica
- Trilha de auditoria e integridade dos conteúdos
- Versionamento e restauração por ponto‑no‑tempo

### Integração simplificada

- Compatível com protocolos comuns de vídeo/ingestão
- SDK/API/REST para integração
- Ferramentas de migração de dados legados

### Observabilidade e otimização

- Monitorização de saúde/custos/hotspots
- Projeção de capacidade e alertas
- Recomendações de otimização contínuas

## Arquiteturas de referência

Os fluxos de vídeo podem chegar à nuvem de três maneiras.

### Armazenamento híbrido em camadas

Cenário: campus/parques urbanos com grande nº de câmeras.

- Tiering: quente em SSD on‑prem; full replica na nuvem
- Otimização de custos com camadas frias
- Alta disponibilidade ativa‑ativa entre on‑prem e nuvem

### Gravação direta na nuvem

Cenário: retalho, condomínios, residências.

- Provisionamento simplificado
- Gestão inteligente de eventos/clipes
- Armazenamento gerido, com durabilidade elevada

### Servidor de trânsito/edge

Cenário: educação, empresas multi‑região.

- Pré‑processamento na borda (redução de tráfego)
- Roteamento adaptativo
- Arquivo em camadas (curto prazo quente, longo prazo frio)

![Arquitetura de solução](./images/solution.png)

## Por que RustFS

### Custo sob controle

- Escala elástica; dados frios em camadas económicas

### Performance

- Nós de edge e caching para acesso mais rápido

### Encriptação na ingestão

- Proteção dos conteúdos em trânsito e at‑rest

### Versionamento

- Restauração de conteúdos por histórico

## Comparativo técnico

![Comparativo técnico](./images/params.png)
