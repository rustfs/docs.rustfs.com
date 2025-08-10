# Versionamento de buckets e objetos

## Compatibilidade com versionamento AWS S3

Comparado a SAN/NAS, o versionamento a nível de objeto é um avanço. Além de proteger dados, é base para bloqueio de objetos, imutabilidade, tiering e gestão do ciclo de vida.

No RustFS, cada objeto é versionado de forma independente conforme a semântica S3. Cada versão recebe um ID único; aplicações podem referenciar um version ID para obter um snapshot temporal.

O versionamento permite manter múltiplas variantes do mesmo objeto no bucket, com mecanismos para salvar, recuperar e restaurar cada versão – eliminando a necessidade de snapshots. Protege contra falhas diversas, incluindo erros humanos/aplicativos.

Ative no nível do bucket. Após ativar, o RustFS cria automaticamente IDs únicos por versão e o mesmo objeto pode ter várias versões.

Um benefício chave é impedir sobrescrita/exclusão acidental, usando delete markers. Ao “apagar” um objeto versionado, cria‑se um delete marker como versão atual (o GET retorna 404). Para restaurar, remova o delete marker.

De forma similar, ao sobrescrever um objeto versionado, cria‑se nova versão como atual; versões antigas podem ser restauradas quando necessário.

## Três estados de versionamento por bucket

![Estados do bucket](./images/bucket-states.png)

Uma vez ativado o versionamento, não é possível desfazer – apenas pausar. É um setting global do bucket.

Com permissões adequadas, é possível pausar para interromper a criação de novas versões. Tal como a ativação, a pausa é aplicada no nível do bucket.

O versionamento pode ser aplicado via Console do RustFS, cliente (mc), SDKs ou linha de comando.

Versionamento é a forma mais simples de proteger contra operações acidentais. Contudo, mais versões aumentam o tamanho do bucket e dependências entre objetos; mitigue com regras de ciclo de vida.

## Benefícios principais

> Além de proteção de dados, o versionamento do RustFS fundamenta várias capacidades‑chave

### Destaques

- ✅ Replicação de buckets (ativo‑ativo, ativo‑passivo)
- ✅ mc undo – reverter PUT/DELETE com um comando
- ✅ Bloqueio de objetos
- ✅ Proteção tipo CDP sem overhead de snapshots/replicação completa
- ✅ mc rewind – visualizar bucket/objeto em qualquer ponto após ativação

## Arquitetura

![Arquitetura](./images/architecture.png)

### Requisitos do sistema

> Versionamento requer EC e ao menos quatro discos.

### Estados de versionamento

O RustFS suporta três estados distintos de versionamento de bucket:

1. 🔴 Desativado – estado padrão
2. 🟢 Ativado – ID único por versão, versionamento completo
3. 🟡 Pausado – não cria novas versões, mantém as existentes

### Recursos‑chave

- 🆔 ID único por versão
- 🔄 Recuperação temporal por version ID
- 🛡️ Proteção contra eliminação acidental (delete markers)
- 📊 Gestão do ciclo de vida para controlar quantidade/custos de versões
- 🔐 Controlo de permissões refinado
