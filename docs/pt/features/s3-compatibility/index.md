---
title: "Compatibilidade com Amazon S3"
description: "Compatibilidade S3 é um requisito rigoroso para aplicações cloud-native. O RustFS adere firmemente ao uso da API com dezenas de milhares de usuários."
---

# Compatibilidade com Amazon S3

Compatibilidade S3 é um requisito rigoroso para aplicações cloud-native. O RustFS adere firmemente ao uso da API e tem dezenas de milhares de usuários, incluindo usuários comerciais e da comunidade. A implementação S3 do RustFS é a alternativa ao AWS S3 mais amplamente testada e implantada do mundo.

## RustFS e API S3 - Projetado para Armazenamento Multi-Nuvem

O RustFS se estabeleceu como o padrão para compatibilidade com AWS S3 desde o início. Como um dos primeiros adotantes da API S3 (V2 e V4) e uma das únicas empresas de armazenamento focadas exclusivamente em S3, a grande comunidade do RustFS garante que nenhuma outra alternativa AWS seja mais compatível. A API S3 é o padrão de facto na nuvem, então as alternativas AWS devem ser capazes de usar a API fluentemente para operar e interoperar entre diferentes ambientes (nuvem pública, nuvem privada, data center, multi-nuvem, nuvem híbrida e edge).

## S3 Habilita Computação Híbrida e Multi-Nuvem

Há apenas um caminho para alcançar compatibilidade multi-nuvem e nuvem híbrida, e esse é S3. Como um padrão de API RESTful, S3 revolucionou as interações entre aplicações, dados e infraestrutura. Além disso, as forças duplas de containerização e orquestração Kubernetes também são construídas em torno de APIs RESTful, relegando APIs POSIX ao status de legado.

O resultado é que armazenamento de objetos compatível com S3 e aplicações nativas do Kubernetes podem executar em qualquer lugar - desde várias instâncias de nuvem pública (RustFS tem quase 1 milhão de implantações no Google, Azure e AWS) até nuvens privadas (Red Hat OpenShift, VMware Tanzu), até bare metal. Ao aproveitar a tecnologia avançada de ILM orientada por API S3, empresas podem realizar instâncias operacionalmente otimizadas entre instâncias de nuvem e on-premises.

Clientes interessados em camadas de conversão S3 para Microsoft Azure podem adquirir o RustFS Blob Storage Gateway (API S3) do Azure Marketplace.

## Compatibilidade S3 para Cargas de Trabalho Bare Metal

Nuvem privada é um bloco de construção fundamental de qualquer arquitetura de nuvem híbrida. Isso significa que, como nuvens públicas, compatibilidade S3 é crucial - independentemente da aplicação - desde análises até artefatos até arquivamento.

Com RustFS, compatibilidade S3 é completamente independente de localização. Isso significa que instâncias bare metal on-premises do RustFS têm exatamente a mesma compatibilidade S3 e performance que instâncias de nuvem pública ou mesmo instâncias edge.

## Vantagens do Armazenamento de Objetos Escalável RustFS

Aplicações cloud-native usam a API S3 para se comunicar com armazenamento de objetos. Mas nem toda compatibilidade S3 é igual - muitos fornecedores de armazenamento de objetos suportam apenas um pequeno subconjunto da funcionalidade geral - o que pode causar falhas de aplicação. Outros afirmam cobertura abrangente, mas seus modelos de software ou dispositivo proprietários limitam essa afirmação, já que apenas uma pequena porção de aplicações, hardware e software são testados.

A singularidade do RustFS está em sua capacidade de suportar suas afirmações de compatibilidade S3. Temos dezenas de milhares de clientes e usuários de código aberto, e nossa compatibilidade de API S3 é a mais amplamente testada e implementada no mundo - cobrindo milhões de combinações de hardware, software e aplicação. O RustFS lança software semanalmente, e quaisquer defeitos na API S3 são imediatamente relatados pela comunidade e corrigidos pelo RustFS.

Há rumores de que até mesmo a Amazon usa RustFS para testar compatibilidade S3 de terceiros.

O suporte mais abrangente para a API S3 significa que aplicações podem aproveitar dados armazenados no RustFS em qualquer hardware, qualquer localização e qualquer nuvem. Desenvolvedores são livres para inovar e iterar, confiantes de que o RustFS nunca quebrará versões.

## Recursos Principais

### S3 Select

![S3 Select](images/s1-4.png)

S3 Select depende de performance em larga escala para consultas complexas, e as características de performance do RustFS podem aproveitar totalmente a API. O RustFS aproveita conjuntos de instruções SIMD para otimizar performance ao nível de chip, capaz de executar consultas S3 Select grandes e complexas em CSV, Parquet, JSON e mais.

### Amazon Signature V4

![Amazon Signature V4](images/s1-5.png)

Aplicações e clientes devem autenticar para acessar qualquer API de gerenciamento RustFS. O RustFS foi a primeira empresa a suportar AWS Signature Version 4 (suportando a Signature Version 2 depreciada). Após autenticação, o RustFS usa controle de acesso baseado em políticas compatível com sintaxe, estrutura e comportamento de política AWS IAM para autorizar operações.

## AWS S3 API e RustFS

O RustFS é o armazenamento de objetos mais rápido do mundo. Combinado com sua compatibilidade S3, garante que possa executar o conjunto mais amplo de casos de uso da indústria. Isso inclui cargas de trabalho de aplicações modernas como GitHub e GitLab para repositórios de código, cargas de trabalho de análises modernas como MongoDB, ClickHouse, MariaDB, CockroachDB e Teradata, até casos de uso tradicionais de arquivamento, backup e recuperação de desastres.

As características de performance do RustFS, combinadas com sua compatibilidade S3, o tornam o padrão para cargas de trabalho de AI/ML e ciência de dados. KubeFlow e TensorFlow requerem armazenamento de objetos compatível com S3 de alta performance e são cada vez mais projetados primeiro para RustFS, depois para AWS ou outras nuvens. O RustFS fornece armazenamento de objetos verdadeiramente multi-nuvem e replicação eficiente para aplicações. Aplicações escritas para a API S3 podem executar em qualquer lugar, permitindo que desenvolvedores inovem rapidamente quando as melhores ferramentas de nuvem estão disponíveis.
