# Armazenamento de objetos de alto desempenho para Veeam Backup & Replication

![Veeam Logo](./images/veeam-logo.png)

Escale sua instância v12 e aumente capacidade e desempenho do Veeam com o RustFS.

## RustFS + Veeam: armazenamento de objetos privado de alto desempenho como endpoint S3

O Veeam Backup & Replication oferece soluções de backup otimizadas e definidas por software. Em conjunto, adicionamos armazenamento de objetos de alto desempenho como endpoint, desacoplando computação e armazenamento no ambiente de backup, com excelente performance, escalabilidade e economia. Um único cluster RustFS pode servir como endpoint Veeam para VMs, Oracle, SAP e MS Office.

## Principais cenários

### 🖥️ Backups Veeam para VMware ESXi com RustFS

Backups de infraestrutura virtual diretamente em armazenamento de objetos, com flexibilidade de capacidade praticamente ilimitada e controlo de custo/segurança.

### 📧 Backups Veeam para Microsoft 365 com RustFS

Backups do Microsoft 365 para armazenamento de objetos, com elasticidade de capacidade e políticas de proteção de dados.

### 💼 Backups Veeam para SAP HANA com RustFS

Com RustFS, os backups Veeam para SAP HANA ganham em desempenho e segurança.

### 🗄️ Backups Veeam para Oracle com RustFS

Workloads Oracle exigem desempenho, resiliência e segurança. Otimize estes backups críticos com armazenamento de objetos RustFS.

---

## Veeam e RustFS: parceria natural

Ambos entregam software de classe mundial. De VMs ao Microsoft 365, a performance em escala é a métrica chave. O RustFS provê uma solução de armazenamento de objetos altamente escalável e performante, ideal para clientes Veeam.

## Vantagens

### ⚡ Backup rápido é uma coisa; restore rápido é outra

Backups e restores precisam ser rápidos. RustFS com Veeam pode ler/escrever a mais de 160 GiB/s em um cluster de 32 nós, viabilizando velocidades de backup/restore antes consideradas impraticáveis.

### 🗃️ Metadados a favor

Com tabelas externas, é possível usar todo o poder do SQL Server sem mover dados. O RustFS grava metadados de forma atômica com os objetos, dispensando bases externas (como Cassandra) em muitos casos. Isso elimina penalidades comuns de pequenos objetos. O RustFS atende às recomendações de tamanho de objeto do Veeam, ajudando em deleções rápidas e deduplicação.

### 🔒 Inline e estritamente consistente

Os dados no RustFS são sempre legíveis e consistentes: todo I/O é commitado em sincronia com EC inline, verificação de bitrot e encriptação. O serviço S3 é resiliente a interrupções e reinícios sob carga. Não há caches/staging assíncronos – garantindo sucesso das operações de backup.

### 🔧 Agnóstico a hardware

Assim como o Veeam, o RustFS é definido por software e agnóstico a hardware, gerando economia e flexibilidade no desenho de soluções de backup.

### 🚀 RustFS + Veeam: backup e restore a partir de armazenamento de objetos

A combinação entrega as vantagens do SDS, velocidade de backup/restore e resiliência de um armazenamento de objetos que grava metadados de forma atômica.
