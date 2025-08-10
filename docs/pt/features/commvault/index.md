# Object storage de alto desempenho para Commvault (backup, restore e replicação)

**Simples. Escalável. Rápido. Resistente a ransomware. Exatamente o que precisa.**

## Vantagens

### 🔒 Simples = Seguro

Commvault e RustFS simplificam backup e restore para proteger os seus dados – de VMs ao Microsoft 365.

### 📈 Escala simples

O RustFS escala linearmente com clusters de servidores, até EB e além. O Commvault foca no core, enquanto o RustFS cuida de heterogeneidade de hardware, erasure coding e proteção contra bitrot. Assim, é possível expandir o backup e proteger mais dados.

### ⚡ Backup rápido é uma coisa; restore rápido é outra

RustFS + Commvault pode exceder 325 GiB/s de leitura/escrita num cluster de 32 nós, permitindo backup/restore a velocidades antes impraticáveis.

### ⚛️ Atómico

O RustFS grava metadados de forma atômica com os objetos, dispensando bases externas (como Cassandra) em muitos casos. Elimina penalidades comuns de pequenos objetos e atende às recomendações de tamanho do Commvault.

### 🔐 Inline e consistente

Todo I/O é commitado com EC/bitrot/encriptação inline. O serviço S3 é resiliente a interrupções/reinícios. Sem staging assíncrono: garantia de operações concluídas.

### 🔧 Agnóstico a hardware

Definido por software e agnóstico a hardware, o RustFS dá flexibilidade e economia no design de soluções de backup com Commvault.

## Visão geral da solução

RustFS e Commvault oferecem soluções de backup definidas por software. O armazenamento de objetos de alto desempenho do RustFS atua como endpoint, desacoplando computação e armazenamento, com performance, escala e economia. Um único cluster pode servir endpoints para VMs, Oracle, SAP e MS Office.

## Principais cenários

### 🖥️ Backups Commvault para VMware ESXi com RustFS

Backups de infraestrutura virtual para armazenamento de objetos com elasticidade e controlo de custo/segurança.

### 📧 Backups Commvault para Microsoft 365 com RustFS

Backups do Microsoft 365 para armazenamento de objetos com gestão eficiente.

### 💼 Backups Commvault para SAP HANA com RustFS

Desempenho e segurança reforçados.

### 🗄️ Backups Commvault para Oracle com RustFS

Otimização de backups críticos de Oracle usando armazenamento de objetos RustFS.
