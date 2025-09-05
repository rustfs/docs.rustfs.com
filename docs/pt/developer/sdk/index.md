---
title: "Visão Geral do SDK RustFS"
description: "Quais SDKs S3 podem ser usados com RustFS? Este artigo fornece uma explicação detalhada."
---

# Visão Geral do SDK

RustFS é um software de armazenamento de objetos distribuído 100% compatível com o protocolo S3. Os usuários podem:

1. Gerenciar RustFS através da interface de gerenciamento do Console;
2. Gerenciar RustFS através de clientes S3;
3. Implementar operações e gerenciamento de armazenamento de objetos no lado comercial através de SDKs.

Atualmente, os SDKs fornecidos pelo RustFS incluem:

- [SDK Java](./java.md)
- [SDK JavaScript](./javascript.md)
- [SDK Python](./python.md)
- [SDK Rust](./rust.md)
- [SDK TypeScript](./typescript.md)
- [SDK Golang](./go.md)

## Explicação de Terminologia Antes da Leitura

S3 é o nome do primeiro produto de armazenamento de objetos aberto e lançado pela Amazon. Ele abriu todos os seus protocolos e especificações. Posteriormente, quase todos os sistemas de armazenamento de objetos seguiram os protocolos e especificações do S3. Às vezes as pessoas chamam S3 de armazenamento de objetos, e às vezes simplesmente chamam S3 de protocolo de armazenamento de objetos.

## 1. Recomendações de SDK

Como já existem muitos SDKs no mercado que foram mantidos por muitos anos, como o SDK AWS S3 que foi depurado e otimizado por muitos anos. Seu desempenho e erros são quase zero. Portanto, recomendamos que você use diretamente o SDK S3 padrão da AWS para controlar e se comunicar com o RustFS.

Se você tem um SDK familiar e confiável de um fornecedor, pode usá-lo.

Como muitos provedores de nuvem chineses fizeram "modificações" em muitos lugares e não suportam muitas das tecnologias S3 mais recentes, muitos produtos de armazenamento de objetos em todo o mundo não recomendam os SDKs de muitos provedores de nuvem chineses.

## 2. Os SDKs MinIO podem se comunicar diretamente com RustFS?

Sim.

Realizamos adaptação e compatibilidade abrangentes para os SDKs MinIO.

Se você está usando os SDKs MinIO, pode modificar o Endpoint, AK e SK para ser diretamente compatível com RustFS.

## 3. O que fazer se houver outros SDKs incompatíveis?

Se usamos um SDK de um provedor de nuvem que não suporta os mais recentes S3, MinIO e RustFS, como devemos lidar com isso?
Por favor, substitua o SDK o mais rápido possível e faça re-emparelhamento e atualização no lado comercial.
