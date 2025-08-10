# Implementação bare‑metal e virtualizada para Windows/Linux

Open source, compatível com S3, reforçado para enterprise e extremamente rápido.

O RustFS é um armazenamento de objetos distribuído de alto desempenho. Definido por software, executa em hardware padrão de mercado e é 100% open source (licença principal: Apache v2.0).

Diferencial: desenhado desde o início como padrão para armazenamento de objetos de nuvem privada/híbrida. Focado exclusivamente em objetos, a arquitetura single‑tier reúne os recursos necessários sem sacrificar performance – resultando num servidor cloud‑native leve, escalável e rápido.

Embora brilhe em casos clássicos (backup/DR/arquivamento), o RustFS destaca‑se em desafios de ML/analytics/apps cloud‑native.

## Características‑chave

### Erasure Coding

Proteção por EC inline por objeto (implementação otimizada, inclusive em baixo nível) para máxima performance. Usa Reed‑Solomon para striping em blocos de dados/paridade com redundância configurável. O repair ocorre ao nível do objeto e múltiplos objetos podem ser reparados em paralelo.

Com paridade até N/2, garante leituras/escritas contínuas com apenas ((N/2)+1) discos operacionais (ex.: em 12 discos, fragmentos 6+6; escreve/reconstrói com 7 discos).

![Erasure Coding](./images/sec2-1.png)

### Proteção contra bitrot

Corrupção silenciosa é um problema sério. O RustFS usa implementação otimizada de HighwayHash para nunca ler dados corrompidos – captura e repara no ato. Calcula hash no READ e valida no WRITE (app→rede→memória/disco) garantindo integridade end‑to‑end. Projetado para velocidade (10+ GB/s por core em CPUs Intel).

![Proteção bitrot](./images/sec2-2.png)

### Encriptação no servidor

Encriptar em trânsito é uma parte; proteger at‑rest é outra. O RustFS suporta esquemas server‑side avançados (AES‑256‑GCM, ChaCha20‑Poly1305, AES‑CBC), com overhead desprezável, além de client‑side. Objetos encriptados usam AEAD, e integra com KMS (ex.: HashiCorp Vault) para SSE‑S3.

Se SSE‑S3 for requerido ou encriptação automática estiver ativa, cada objeto recebe chave única protegida por master key do KMS. Com baixo overhead, a encriptação automática pode ser padrão por aplicação/instância.

![Server‑side encryption](./images/sec2-3.png)

### WORM (Write Once Read Many)

#### Gestão de identidade

Integra IdPs compatíveis com OpenID Connect e fornecedores líderes. Acesso centralizado, senhas temporárias/rotativas, políticas de acesso granulares – facilitando multi‑tenant/multi‑instância.

#### Replicação contínua

Replicações tradicionais não escalam bem acima de centenas de TiB. É preciso DR entre DCs/regiões. A replicação contínua do RustFS é desenhada para grande escala geodistribuída, usando notificações Lambda e metadados para deltas eficientes e rápidos (propagação imediata, não batch).

#### Federação global

Dados em todo lugar. Combine instâncias distintas num namespace global unificado: múltiplos servidores RustFS em “conjuntos distribuídos”, e vários conjuntos formando uma federação. Oferece administração e namespace unificados.

#### Gateway multicloud

Estratégia multicloud (pública e privada) exige que a infraestrutura pareça S3. O RustFS corre em bare‑metal, NAS e nuvens; e pode tornar a infraestrutura existente compatível com S3, unificando dados (file/block→object via S3 API) sem migração.

![WORM](./images/sec2-4.png)

## Arquitetura do sistema

Cloud‑native, executa como contentor leve gerido por orquestrador (ex.: Kubernetes). O servidor é um binário estático (~40 MB), eficiente em CPU/memória mesmo sob carga, permitindo alta densidade multi‑tenant em hardware partilhado.

Executa em servidores COTS com discos locais (JBOD/JBOF). Todos os nós são simétricos (sem NameNode/servidor de metadados). Dados e metadados são escritos juntos como objetos (sem BD de metadados). EC/bitrot/encriptação são inline e estritamente consistentes, para elevada resiliência.

Cada cluster é um conjunto de processos de servidor (um por nó), user‑space single‑process com corrotinas leves para alta concorrência. Discos agrupados em conjuntos de EC (padrão 16 discos) e colocação por hashing determinístico. Desenhado para multi‑DC em grande escala; cada tenant opera seu próprio cluster, isolado e federado geograficamente.
