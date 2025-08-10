---
title: "Visão geral dos SDKs"
description: "Quais SDKs S3 posso usar com o RustFS? Esta página explica as opções e recomendações."
---

# Visão geral dos SDKs

RustFS é 100% compatível com o protocolo S3. Você pode:

1. Usar o console para gerir o RustFS;
2. Usar clientes S3 para gerir o RustFS;
3. Integrar no seu aplicativo via SDK para operar/gerir objetos.

## Glossário rápido

S3 é o nome do serviço de armazenamento de objetos da Amazon, cujo protocolo/SDKs foram documentados publicamente. A maioria das soluções de object storage atuais segue o protocolo S3. Em muitos contextos “S3” é usado como sinónimo de “armazenamento de objetos” ou “protocolo S3”.

## 1. Recomendações de SDK

Há SDKs maduros mantidos há anos. Os SDKs oficiais da AWS para S3 passaram por extensos testes e otimizações, com baixíssima taxa de erros. Recomendamos usar diretamente os SDKs S3 oficiais da AWS para se comunicar com o RustFS.

Se já possui confiança em outro SDK/fornecedor compatível com S3, também pode utilizá‑lo.

Observação: alguns fornecedores na China modificam SDKs e nem sempre suportam recursos S3 mais recentes. Em ambientes globais, muitas soluções não recomendam esses SDKs específicos.

## 2. O SDK do MinIO funciona com RustFS?

Sim. O SDK do MinIO é suportado e compatível. Ajuste apenas o endpoint e as credenciais (AK/SK) para usar com RustFS.

## 3. E se o SDK for incompatível?

Se o SDK que utiliza não suportar corretamente S3/MinIO/RustFS, recomendamos substituí‑lo por um SDK compatível e realizar a migração no seu aplicativo.


