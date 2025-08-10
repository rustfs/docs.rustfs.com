# Imutabilidade de objetos no RustFS

## RustFS e S3 API — concebido para multicloud

O RustFS adota o S3 como padrão desde o início. Como um dos primeiros a suportar S3 API (V2 e V4) e focado em S3, a comunidade assegura elevada compatibilidade. O S3 é o padrão de facto na nuvem; para interoperar em ambientes públicos/privados/híbridos/edge, a compatibilidade de API é essencial.

## Retenção de objetos

Políticas de retenção garantem proteção WORM por um período. A retenção pode ser definida por versão de objeto (explícita) ou por padrão no bucket. A configuração padrão do bucket aplica‑se a objetos criados depois (não retroativa).

Com o padrão do bucket, define‑se a duração em dias/anos para proteger cada nova versão colocada no bucket. Objetos novos herdam a duração.

Pode‑se definir retenção explícita por versão, com uma “data de expiração de retenção” armazenada nos metadados. Até expirar, a versão fica protegida.

Após expirar, a versão pode ser eliminada, salvo se houver legal hold.

A retenção explícita sobrepõe o padrão do bucket.

A duração pode ser estendida emitindo nova solicitação de bloqueio.

Existem dois modos de retenção:

## Modo de governança

Evita que utilizadores comuns apaguem objetos. Para determinados utilizadores com necessidade de alterar retenções ou eliminar objetos, conceda permissões específicas, como `s3:BypassGovernanceRetention` e `DeleteObject`.

## Modo de conformidade

Mais restritivo: não pode ser removido durante o período de retenção. Nem mesmo o root pode eliminar a versão nesse período.

## Legal hold

Oferece proteção WORM equivalente à retenção, porém sem data de expiração. É indefinido e só pode ser removido por utilizadores autorizados.

Quando há retenção ou legal hold, o versionamento permanece. Operações de cópia entre buckets não propagam automaticamente retenção/legal hold do source para o destino.

## Conformidade do RustFS com Cohasset

A referência para bloqueio/imutabilidade/retenção é a avaliação da Cohasset Associates. O RustFS obteve avaliação positiva relativamente às exigências de SEC 17a‑4(f), FINRA 4511 e CFTC 1.31, incluindo duração, formato, qualidade, disponibilidade e responsabilização.

O relatório da Cohasset pode ser obtido integralmente e partilhado com reguladores ao armazenar dados no RustFS. Nele constam detalhes de configuração e a lógica de suporte ao bloqueio de objetos.
