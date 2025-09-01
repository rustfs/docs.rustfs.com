---
title: "O que é RustFS e guia de instalação"
description: "RustFS é uma solução de armazenamento de objetos, software de código aberto distribuído sob licença Apache2."
---

# I. O que é RustFS?

RustFS é um armazenamento de objetos simples, eficiente e distribuído, adequado para substituição rápida do MinIO e para uso em cenários de armazenamento de objetos de treinamento e inferência de IA.
Ao mesmo tempo, RustFS é uma solução de armazenamento de objetos eficiente, de código aberto e livre. É 100% compatível com o protocolo S3, utiliza uma licença Apache2 e é distribuído como software de código aberto. RustFS é escrito na linguagem Rust, atualmente a linguagem mais popular e segura em memória do mundo, particularmente adequada para cenários de alto desempenho. RustFS é um produto de armazenamento de objetos distribuído comercialmente amigável no qual participam e contribuem excelentes engenheiros de todo o mundo. RustFS pode substituir muitos produtos de armazenamento de objetos com licenças de código aberto não amigáveis.

RustFS em breve fará a transição oficial de aplicações comerciais para código aberto, com lançamento global, ajudando o mundo a reduzir custos de armazenamento e melhorar a segurança dos dados.



## II. Leitura obrigatória antes da instalação

 RustFS se divide em três modos de instalação: nó único disco único, nó único múltiplos discos e múltiplos nós múltiplos discos. O modo múltiplos nós múltiplos discos inclui desempenho, segurança e escalabilidade de nível empresarial. Além disso, fornece diagramas de arquitetura necessários para cargas de trabalho de produção. Antes da instalação, leia nossos modos de inicialização e lista de verificação, como segue:

1. Por favor, esclareça seus três modos de instalação:

    - [Modo nó único disco único (SNSD)](./single-node-single-disk.md)   
    - [Modo nó único múltiplos discos (SNMD)](./single-node-multiple-disk.md)
    - [Modo múltiplos nós múltiplos discos (MNMD)](./multiple-node-multiple-disk.md) 

2. [Verificação antes da instalação](../checklists/index.md), para garantir que todos os indicadores atendam às características do guia de produção. Este guia pode ser ignorado se não for necessário padrão de produção;



## III. Suporte de sistema operacional e CPU

Você pode executar RustFS em quase qualquer CPU e sistema operacional, seja Linux, Unix, Windows, MacOS, FreeBSD, Docker, ou mesmo em gateways de borda, você pode executar RustFS.
Suporte de arquitetura de CPU: X86, ARM e muitas outras arquiteturas de CPU.

## IV. Características do RustFS

- **Compatível com S3**: 100% compatível com protocolo S3, excelente compatibilidade com big data, data lakes, software de backup, software de processamento de imagens e software de produção industrial;
- **Distribuído**: RustFS é um armazenamento de objetos distribuído, portanto, RustFS pode atender várias necessidades;
- **Comercialmente amigável**: RustFS é software 100% de código aberto e utiliza licença Apache v2.0, portanto, RustFS é comercialmente amigável;
- **Rápido**: O desempenho da linguagem de desenvolvimento Rust está infinitamente próximo à velocidade da linguagem C. Portanto, o desempenho do RustFS é muito poderoso;
- **Seguro**: RustFS é escrito na linguagem Rust segura em memória, portanto, RustFS é 100% seguro;
- **Multiplataforma**: RustFS funciona no Windows, macOS e Linux;
- **Extensível**: RustFS suporta plugins personalizados, portanto, RustFS pode atender várias necessidades;
- **Personalizável**: Devido às características do código aberto, você pode personalizar vários plugins, portanto, RustFS pode atender várias necessidades;
- **Nativo na nuvem**: RustFS suporta implantação via Docker e outros métodos, pode ser implantado rapidamente em ambientes nativos na nuvem.

## V. Valores do RustFS

Ajudar toda a humanidade a melhorar a segurança dos dados e reduzir custos de armazenamento.

## VI. Visão do RustFS

Toda entidade de IA pessoal no mundo pode usar RustFS para armazenar dados.
