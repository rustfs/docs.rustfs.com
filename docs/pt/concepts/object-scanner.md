---
title: "Scanner de objetos"
description: "Design do scanner de objetos do RustFS, integração com EC, monitorização e troubleshooting"
---

# Scanner de objetos

Este documento descreve o design e a implementação do scanner de objetos do RustFS, cobrindo a integração com Erasure Coding, mecanismos de Scrub & Repair, estratégia de escalonamento, métricas e troubleshooting.

## Visão geral

O scanner de objetos está embutido no motor de armazenamento e verifica periodicamente a integridade dos objetos, executando ações programadas.
As tarefas incluem estatísticas de uso de disco, avaliação de regras de ciclo de vida, replicação e acionamento de auto‑recuperação para objetos corrompidos.

## Arquitetura e princípios de design

### Arquitetura do scanner

O scanner usa amostragem por hash: para cada 1024 objetos, seleciona 1 para verificação, mitigando impacto em tráfego normal.
Integra‑se profundamente com o módulo de Erasure Coding: ao detetar perda/corrupção de partes, reconstrói online usando redundância, garantindo alta disponibilidade e consistência.

## Verificação e recuperação de dados

A verificação pode comparar metadados e tamanhos, e fazer leitura bit‑a‑bit para detetar bit rot. Quando necessário, o scanner aciona o fluxo de reparo.

## Modos de varrimento e agendamento

Três modos: verificação online em leitura, varrimento periódico em segundo plano e varrimento total manual—equilibrando performance e confiabilidade.
Semelhante ao `osd_scrub_begin_hour` no Ceph, administradores podem configurar janelas e frequência (ex.: verificação leve diária).

## Monitorização e métricas

Expõe contagem total de tarefas, falhas e distribuição de duração; publica métricas Prometheus como `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total`, `rustfs_scanner_duration_seconds`. Alarmes podem ser definidos com base em taxa de falhas e duração. 