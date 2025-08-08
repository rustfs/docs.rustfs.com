---
title: "Registo e auditoria"
description: "Métricas, registos, auditoria e arquitetura de observabilidade no RustFS"
---

# Registo e auditoria

Para acompanhar o estado e o desempenho de qualquer sistema, métricas e logs são críticos. O RustFS oferece monitorização detalhada de desempenho, métricas e registo por operação, proporcionando visibilidade completa do cluster.

## Funcionalidades

### Métricas de monitorização

Fornece recolha abrangente de métricas de sistema e desempenho.

### Registo

Regista informações detalhadas de cada operação, suportando trilhos de auditoria.

## Monitorização de métricas

O RustFS exporta métricas finas de HW/SW por endpoint compatível com Prometheus. O Prometheus, com modelo de dados multidimensional e séries temporais (nome/pares chave‑valor), é usado com Grafana para visualização. O ecossistema inclui integrações para encaminhar métricas para armazenamento/mensageria/alertas.

Expõe saúde de discos/nós, capacidade total/disco, etc. Tirando partido do Prometheus como plataforma líder de recolha/análise, o RustFS foca‑se no core em vez de múltiplos adaptadores proprietários de monitorização.

O operador Kubernetes do RustFS pode implementar/configurar/gerir Prometheus por tenant. Organizações podem apontar o seu Prometheus (ou compatíveis) para cada tenant e centralizar monitorização em múltiplas clouds/DCs/ferramentas.

Inclui ainda endpoint de health‑check a nível de nó/cluster para verificar quorum de leitura/escrita via simples `curl`.

## Logs de auditoria

Com auditoria ativa, o RustFS gera um log por operação com ID único e metadados de cliente/objeto/bucket. Os logs são enviados para webhook HTTP/HTTPS configurado. Adaptadores personalizados podem atender requisitos específicos de destino.

A auditoria é configurável via consola e via `mc`. Em Kubernetes, o operador configura a integração com LogSearch para visualização dos logs.

O RustFS suporta notificações tipo Lambda, enviando eventos de bucket/objeto para terceiros (serverless/FaaS). Via webhook, suporta RabbitMQ, Kafka, Elasticsearch e serviços arbitrários.

Também suporta tracing em tempo real de operações HTTP/S via consola e `mc admin trace`.

## Arquitetura

**O RustFS expõe métricas por HTTP(S) compatível com Prometheus; o serviço Prometheus efetua pull/push. O operador Kubernetes implementa Prometheus por tenant para scraping. Organizações podem usar Prometheus centralizado.**

![Arquitetura 1](images/s7-1.png)

As notificações Lambda empurram eventos para Kafka, Elasticsearch ou PostgreSQL. Administradores definem regras de notificação ao nível do bucket com filtros granulares de eventos/objetos.

![Arquitetura 2](images/s7-2.png)

## Requisitos

### Para métricas

BYO Prometheus ou usar o operador para deploy por tenant.

### Para pesquisa de logs

BYO PostgreSQL ou usar o operador para deploy por tenant.

### Para logs

Suporta destinos de notificação de terceiros.
