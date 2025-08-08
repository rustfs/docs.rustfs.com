---
title: "Arquitetura do RustFS"
description: "Introdução à arquitetura do RustFS"
---

# Arquitetura do RustFS

O RustFS é um sistema de armazenamento de objetos, semelhante ao conhecido AWS S3. Como alternativa ao MinIO, o RustFS inspira‑se numa arquitetura simples, leve, escalável e elegante.

Os objetos podem ser documentos, vídeos, PDFs, etc. Para os armazenar, o MinIO oferece uma solução escalável, flexível e eficiente para armazenar, aceder e gerir dados. A compatibilidade com a API do AWS S3 permite integração transparente com aplicações que já falam S3.

Diagrama de arquitetura:

![Arquitetura do RustFS](./images/s2-1.png)

Esta é a arquitetura básica do RustFS. O cluster distribuído utiliza múltiplos nós para executar um objetivo comum. Os nós comunicam entre si através da rede.

## Modelo de consistência

Em modos distribuído e single‑node, todas as operações de leitura/escrita seguem estritamente o modelo de consistência read‑after‑write.

## Conceitos importantes no RustFS

- Object (objeto): a unidade básica armazenada (ficheiro, fluxo de bytes, etc.)
- Bucket: espaço lógico que contém objetos; para o cliente equivale a uma pasta de topo
- Drive (disco): dispositivo físico onde os dados são gravados
- Set (conjunto): grupo de drives; os objetos são distribuídos por sets via hashing determinístico

Boas práticas de desenho/planeamento:

1. Um objeto reside num único Set
2. Um cluster é particionado em múltiplos Sets
3. O número de Drives por Set é fixo e determinado pelo tamanho do cluster
4. Drives de um mesmo Set devem estar, se possível, em nós distintos

## Agradecimentos

Arquiteturas tradicionais exigem Master/MetaData/Data Nodes, aumentando a complexidade de deployment e risco de perda de metadados. No RustFS, todos os nós são de mesmo nível, simplificando o desenho e evitando pontos únicos de falha.

O RustFS adota princípios de arquitetura semelhantes ao MinIO. Agradecemos à comunidade MinIO por promover o S3 e democratizar o acesso ao armazenamento de objetos.
