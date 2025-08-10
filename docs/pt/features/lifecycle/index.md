# Gestão do ciclo de vida e tiering de dados

À medida que os dados crescem, otimizar conjuntamente acesso, segurança e economia deixa de ser opcional. A gestão do ciclo de vida resolve esse desafio. O RustFS oferece um conjunto de funcionalidades para proteger dados dentro e entre nuvens (pública/privada). Ferramentas empresariais incluem versionamento, bloqueio de objetos e componentes relacionados.

## Expiração de objetos

Os dados não precisam existir para sempre. Regras de ciclo de vida permitem definir por quanto tempo os objetos permanecem no disco antes de serem eliminados. O tempo pode ser um número de dias ou uma data específica.

As regras são definidas por bucket e permitem filtros por objeto/labels. É possível aplicar a regra a todo o bucket (sem filtros) ou criar múltiplas regras para comportamentos mais complexos.

As regras também se aplicam a buckets com versionamento, com opções específicas: por exemplo, definir expiração apenas para versões não atuais, reduzindo custo sem perder proteção, ou remover objetos cujo único remanescente seja um delete marker.

As regras respeitam WORM/Legal Hold: objetos bloqueados permanecem até expirar ou serem desbloqueados. Depois disso, as regras de expiração voltam a aplicar‑se normalmente.

As regras do RustFS são compatíveis em sintaxe e função com AWS Lifecycle Management. Pode importar regras existentes em JSON para migração facilitada.

## Tiering baseado em políticas

O RustFS permite configurar tiering programático, movendo objetos entre estados/classes com base em variáveis (tipicamente tempo/frequência de acesso). Tiering otimiza custo/desempenho face a padrões de acesso em mudança.

## Entre mídias de armazenamento

O caso mais comum: o RustFS abstrai a mídia e otimiza por performance/custo. Dados “quentes” podem residir em NVMe/SSD e, após algum tempo, mover para HDD ou camadas mais frias, conforme o cenário.

![Tiering entre mídias](images/s9-2.png)

## Entre tipos de nuvem

Use storage e computação de nuvem pública como camada adicional da nuvem privada. Workloads nearline de alto desempenho residem no privado; à medida que crescem e a exigência de performance cai, mova dados para cold storage na nuvem pública para otimizar custo.

Execute RustFS tanto na nuvem privada quanto na pública. Com replicação, mova dados para opções baratas e proteja/aceda via RustFS na nuvem pública. Aqui, a nuvem pública torna‑se “storage burro” do RustFS, tal como JBOD; evita substituições e custos de fita.

![Tiering entre nuvens](images/s9-3.png)

## Em nuvem pública

O RustFS frequentemente atua como storage primário de aplicações. O aplicativo apenas conhece o endpoint; o RustFS decide onde os dados pertencem, movendo blocos para objeto e escolhendo a camada que cumpre metas de performance/economia.

O RustFS combina camadas e seleciona mídia adequada para melhor economia sem afetar performance. O app endereça objetos via RustFS; políticas movem objetos entre camadas e mantêm metadados em bloco.

![Tiering em nuvem pública](images/s9-4.png)
