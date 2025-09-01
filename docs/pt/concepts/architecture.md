---
title: "Arquitetura RustFS"
description: "Introdução à arquitetura RustFS"
---

# Arquitetura RustFS

O RustFS é um sistema de armazenamento de objetos similar ao conhecido AWS S3. Como alternativa ao MinIO, o RustFS referencia a arquitetura limpa, leve, escalável e elegante do MinIO.

Objetos podem ser documentos, vídeos, arquivos PDF e muito mais. Para armazenar objetos, o MinIO fornece uma solução escalável, flexível e eficiente para armazenar, acessar e gerenciar dados. Sua compatibilidade com a API do AWS S3 permite integração perfeita com aplicações baseadas em AWS S3.

O diagrama da arquitetura é o seguinte:

![Diagrama de Arquitetura RustFS](./images/s2-1.png)

Esta é a arquitetura básica do RustFS. Uma malha distribuída é uma arquitetura de computador que usa múltiplos nós para executar uma única tarefa. Os nós estão conectados entre si através de uma rede, permitindo que se comuniquem uns com os outros.

## Design de Consistência

Em ambos os modos distribuído e de máquina única, todas as operações de leitura e escrita seguem rigorosamente o modelo de consistência de leitura-após-escrita.

## Conceitos Importantes no RustFS

**Objeto**: O objeto básico armazenado no RustFS, como arquivos, fluxos de bytes, qualquer coisa...

**Bucket**: O espaço lógico usado para armazenar objetos. Os dados entre cada bucket são mutuamente isolados. Para clientes, é equivalente a uma pasta de nível superior para armazenar arquivos.

**Drive**: O disco que armazena dados, passado como parâmetro quando o RustFS inicia. Todos os dados de objetos no RustFS serão armazenados em drives.

**Set**: Uma coleção de drives. A implantação distribuída divide automaticamente em um ou mais sets baseados na escala do cluster, e os drives em cada set são distribuídos em diferentes localizações. Um objeto é armazenado em um set.

Portanto, ao projetar arquitetura e implantar equipamentos, você precisa considerar:

1. Um objeto é armazenado em um set;
2. Um cluster é dividido em múltiplos sets;
3. O número de drives em um set é fixo, calculado automaticamente pelo sistema baseado na escala do cluster por padrão;
4. Os drives em um set são distribuídos entre diferentes nós o máximo possível;

## Agradecimentos Especiais

Todos os nós estão em relacionamentos peer-to-peer, simplificando enormemente o design arquitetural e eliminando preocupações sobre perda de metadados. Pode ser iniciado com um único comando.

Sem perder elegância, simplicidade e confiabilidade, o RustFS adota o mesmo design arquitetural do MinIO.

Obrigado ao MinIO pelo conceito arquitetural proposto, que tem facilitado enormemente usuários mundialmente e promovido o protocolo S3.
