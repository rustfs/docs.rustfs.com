# Otimização para pequenos ficheiros

> Armazenamento de objetos em memória para workloads de ultra‑alta performance

Use DRAM do servidor para criar um pool de memória distribuída partilhada para workloads com requisitos elevados de IOPS e throughput.

## Contexto

A otimização para pequenos ficheiros do RustFS é ideal para workloads de IOPS/throughput, cada vez mais comuns em AI/ML. Sem cache, o I/O pode se tornar gargalo para GPUs.

Com cache empresarial, buckets com datasets de treino/validação/teste podem residir em memória.

## Funcionalidades

### 🗃️ Cache dedicada de objetos

Se o objeto não estiver na cache, é obtido do storage, armazenado para pedidos futuros e devolvido ao chamador.

### 💾 Hashing consistente

Distribui dados de objetos em nós de cache (pares) com hashing consistente. Facilita localizar por chave, equilibra carga e minimiza reshuffling quando nós entram/saem.

### 🧹 Gestão de memória por janela deslizante

Mantém o tamanho total da cache dentro do limite configurado; remove objetos menos recentes quando necessário.

### 🔄 Atualização automática de versões

Se um objeto em cache for atualizado no storage, a cache recebe a nova versão automaticamente.

### 🧩 Integração transparente de API

É uma extensão interna do RustFS; nenhuma API nova é necessária. Se o objeto estiver em cache, é servido de lá; se não, é buscado, devolvido e colocado na cache para próximos acessos.
