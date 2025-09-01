---
title: "Terminologia"
description: "Este artigo apresenta vocabulário frequentemente usado em armazenamento de objetos, ajudando usuários a entender rapidamente o armazenamento de objetos"
---

# Glossário Completo de Armazenamento de Objetos (100 Termos)

| No. | Termo | Inglês | Explicação |
|------|--------------------------|------------------------------|--------------------------------------------------------------------------|
| 1 | Armazenamento de Objetos | Object Storage | Arquitetura onde dados são armazenados como objetos, substituindo estruturas hierárquicas tradicionais de arquivos |
| 2 | Bucket | Bucket | Container para armazenar objetos, namespace globalmente único |
| 3 | Objeto | Object | Unidade básica de armazenamento, contém dados, metadados e identificador único (Object Key) |
| 4 | Metadados | Metadata | Informação de pares chave-valor que descreve propriedades do objeto (como tipo de arquivo, hora de criação) |
| 5 | Compatível com S3 | S3-Compatible | Serviço de armazenamento compatível com padrão de API do Amazon S3 |
| 6 | Durabilidade de Dados | Data Durability | Probabilidade de dados serem preservados a longo prazo no sistema (como 99.999999999%) |
| 7 | Multi-réplica | Replication | Tecnologia de redundância que garante segurança de dados através de múltiplas cópias |
| 8 | Código de Apagamento | Erasure Coding | Dividir e codificar dados para armazenamento, alcançando alta confiabilidade com menos espaço |
| 9 | Armazenamento Frio | Cold Storage | Tipo de armazenamento de baixo custo para dados de acesso infrequente (como dados de arquivo) |
| 10 | Gestão de Ciclo de Vida | Lifecycle Management | Política para transferir/excluir objetos automaticamente (como transferir para armazenamento frio após 30 dias) |
| 11 | Controle de Versão | Versioning | Manter versões históricas de objetos para prevenir sobrescrita |
| 12 | Classe de Armazenamento | Storage Class | Diferentes níveis de armazenamento com diferentes performance/custo (padrão, acesso infrequente, arquivo) |
| 13 | Chave de Acesso | Access Key | Chave de autenticação para solicitações de API (Access Key ID + Secret Access Key) |
| 14 | Região | Region | Localização geográfica da infraestrutura de armazenamento (como East China 1, US West) |
| 15 | Zona de Disponibilidade | Availability Zone (AZ) | Salas de máquinas isoladas com energia/rede independentes dentro da mesma região |
| 16 | Endpoint | Endpoint | Endereço de domínio para acessar serviço de armazenamento (como us-east1.rustfs.com) |
| 17 | API RESTful | RESTful API | Especificação de design de API baseada em protocolo HTTP |
| 18 | Upload Multiparte | Multipart Upload | Mecanismo de dividir arquivos grandes para upload e merge |
| 19 | URL Pré-assinada | Pre-Signed URL | Link de acesso temporário com prazo de validade |
| 20 | Criptografia do Servidor | SSE | Criptografia automática de dados no lado do servidor (SSE-S3/SSE-KMS/SSE-C) |
| 21 | Criptografia do Cliente | CSE | Criptografar localmente no cliente antes do upload |
| 22 | Replicação Cross-Region | Cross-Region Replication | Replicação automática de objetos entre regiões geográficas |
| 23 | Lista de Controle de Acesso | ACL | Lista de regras para controlar permissões de acesso a bucket/objeto |
| 24 | Política de Bucket | Bucket Policy | Política de controle de permissões refinada baseada em JSON |
| 25 | IAM | Identity and Access Management | Sistema para gerenciar centralizadamente permissões de acesso de usuários/funções |
| 26 | Notificação de Evento | Event Notification | Enviar notificações para filas de mensagens/computação de função quando eventos são acionados |
| 27 | Data Lake | Data Lake | Repositório para armazenamento centralizado de dados estruturados/não estruturados |
| 28 | Conformidade | Compliance | Atender requisitos de regulamentações de armazenamento de dados como GDPR, HIPAA |
| 29 | Log de Auditoria | Logging & Audit | Registrar todos os logs de operações de API para auditoria |
| 30 | Monitoramento e Alertas | Monitoring & Alerting | Monitorar em tempo real uso de armazenamento/número de solicitações e acionar alertas |
| 31 | CORS | CORS | Regras para controlar acesso cross-domain de recursos pelo navegador |
| 32 | Aceleração de Transferência | Transfer Acceleration | Otimizar velocidade de upload/download através de nós de borda |
| 33 | Integração CDN | CDN Integration | Combinar com rede de distribuição de conteúdo para acelerar cache |
| 34 | Exportação de Dados | Data Export | Processo de migrar dados para outros sistemas de armazenamento |
| 35 | Importação de Dados | Data Import | Migrar dados em lote de sistemas externos para armazenamento de objetos |
| 36 | Hospedagem de Site Estático | Static Website Hosting | Hospedar diretamente arquivos estáticos HTML/CSS/JS através de bucket |
| 37 | Proteção Anti-Hotlink | Hotlink Protection | Tecnologia para prevenir que sites externos roubem links de recursos |
| 38 | Limitação de Taxa de Solicitação | Request Rate Limiting | Controlar frequência de solicitações de API por usuário/IP individual |
| 39 | Tags | Tagging | Adicionar tags de classificação a buckets/objetos para facilitar gestão |
| 40 | Relatório de Inventário | Inventory Report | Gerar periodicamente arquivo CSV/ORC da lista de objetos armazenados |
| 41 | Restauração de Dados | Data Restoration | Recuperar dados de armazenamento de arquivo para estado acessível |
| 42 | Gateway de Armazenamento | Storage Gateway | Camada de acesso que mapeia armazenamento de objetos como sistema de arquivos local |
| 43 | Compressão de Dados | Data Compression | Comprimir dados antes do upload para economizar espaço de armazenamento |
| 44 | Desduplicação de Dados | Data Deduplication | Eliminar dados duplicados para reduzir ocupação de armazenamento |
| 45 | Leitura Direta de Arquivo | Direct Read Archive | Tecnologia para ler diretamente dados de arquivo sem necessidade de restauração |
| 46 | Controle de Tráfego | Bandwidth Control | Limitar largura de banda de download para evitar congestionamento de rede |
| 47 | Número de Conexões Concorrentes | Concurrent Connections | Número de conexões de transferência de dados processadas simultaneamente |
| 48 | Serviço de Migração de Dados | Data Migration Service | Ferramenta de migração automatizada (como AWS Snowball) |
| 49 | SDK do Cliente | Client SDK | Kit de ferramentas para desenvolvedores integrarem serviço de armazenamento (como Python/Java SDK) |
| 50 | Ferramenta CLI | Command Line Interface | Ferramenta de gestão em linha de comando (como aws s3 cp) |
| 51 | Console Gráfico | Web Console | Interface de gestão web |
| 52 | Verificação de Dados | Data Integrity Check | Verificar integridade de transmissão através de MD5/SHA |
| 53 | Upload/Download Resumível | Resumable Upload/Download | Continuar transmissão do ponto de interrupção após interrupção de rede |
| 54 | Mirror de Origem | Mirror Back to Source | Buscar e salvar da fonte especificada quando objeto solicitado não existe |
| 55 | Lançamento Gradual | Canary Release | Estratégia de lançamento que abre gradualmente novos recursos para alguns usuários |
| 56 | Exclusão Suave | Soft Delete | Marcar objetos para exclusão mas manter período de recuperação |
| 57 | Bloqueio de Objeto | Object Lock | Mecanismo de proteção de conformidade para prevenir exclusão ou sobrescrita de objetos |
| 58 | Marca D'água | Watermarking | Adicionar informações de identificação em imagens/vídeos |
| 59 | Geração de Miniaturas | Thumbnail Generation | Criar automaticamente versões em miniatura de imagens |
| 60 | Processamento de Imagem | Image Processing | Recursos de processamento online como corte/redimensionamento/rotação |
| 61 | Transcodificação de Vídeo | Video Transcoding | Converter formato/resolução de vídeo para adaptar a diferentes dispositivos |
| 62 | Moderação de Conteúdo | Content Moderation | Detectar automaticamente imagens/vídeos/texto em violação |
| 63 | Análise de Custos | Cost Analysis | Estatísticas de custos por tipo de armazenamento/número de solicitações e outras dimensões |
| 64 | Monitoramento de Uso | Usage Monitoring | Dashboard para visualizar em tempo real quantidade de armazenamento/tráfego/número de solicitações |
| 65 | Análise de Armazenamento | Storage Analytics | Ferramenta para analisar padrões de armazenamento e otimizar custos |
| 66 | Pagamento pelo Solicitante | Requester Pays | Modelo de cobrança onde parte que baixa dados arca com custos |
| 67 | Armazenamento em Camadas | Tiered Storage | Transferir automaticamente dados para níveis de armazenamento de menor custo |
| 68 | Camadas Inteligentes | Intelligent Tiering | Selecionar automaticamente melhor tipo de armazenamento baseado em padrões de acesso |
| 69 | Link Privado | PrivateLink | Acessar armazenamento de objetos diretamente através de rede interna evitando exposição pública |
| 70 | Endpoint VPC | VPC Endpoint | Entrada para acessar serviço de armazenamento com segurança dentro de nuvem privada virtual |
| 71 | Criptografia de Transmissão | SSL/TLS | Criptografar transmissão de dados através de protocolo HTTPS |
| 72 | Criptografia do Lado do Cliente | Client-Side Encryption | Usuário criptografa dados antes do upload |
| 73 | KMS | Key Management Service | Serviço para gerenciar centralizadamente chaves de criptografia |
| 74 | Limite de Permissões | Permission Boundary | Limitar escopo máximo de permissões de função/usuário IAM |
| 75 | Credenciais Temporárias | Temporary Credentials | Token de acesso válido por curto prazo (como STS Token) |
| 76 | Proteção de Exclusão MFA | MFA Delete | Requer autenticação multifator para excluir dados |
| 77 | Imutabilidade de Dados | Immutability | Característica que previne alteração de dados (combinado com modelo WORM) |
| 78 | Retenção Legal | Legal Hold | Proteção obrigatória proibindo exclusão/modificação de dados em cenários de conformidade |
| 79 | Compartilhamento Cross-Account | Cross-Account Sharing | Permitir que outras contas em nuvem acessem recursos de armazenamento especificados |
| 80 | Política de Pré-busca | Prefetch Policy | Carregar dados antecipadamente em cache para acelerar acesso subsequente |
| 81 | Controle de Cache | Cache-Control | Especificar comportamento de cache de navegador/CDN através de cabeçalhos HTTP |
| 82 | Exclusão Atrasada | Delayed Deletion | Operação de exclusão executada com atraso para prevenir operações acidentais |
| 83 | Operações em Lote | Batch Operations | Executar operação unificada em múltiplos objetos (excluir/copiar/restaurar) |
| 84 | Linhagem de Dados | Data Lineage | Registro de metadados rastreando origem e histórico de mudanças dos dados |
| 85 | Catálogo de Dados | Data Catalog | Sistema de busca armazenando informações de metadados |
| 86 | Gateway de Armazenamento | Storage Gateway | Solução de nuvem híbrida conectando sistemas locais com armazenamento em nuvem |
| 87 | Armazenamento em Nuvem Híbrida | Hybrid Cloud Storage | Arquitetura usando simultaneamente armazenamento local e em nuvem |
| 88 | Armazenamento de Borda | Edge Storage | Fornecer serviços de armazenamento em nós de borda próximos à fonte de dados |
| 89 | Armazenamento Multi-nuvem | Multi-Cloud Storage | Solução de armazenamento através de diferentes fornecedores de serviços em nuvem |
| 90 | Federação de Armazenamento | Storage Federation | Camada de abstração para gerenciamento unificado de múltiplos sistemas de armazenamento |
| 91 | Tag de Objeto | Object Tag | Adicionar tags de classificação personalizadas a objetos |
| 92 | Tag de Bucket | Bucket Tag | Adicionar tags relacionadas a gestão/cobrança a buckets |
| 93 | Cota de Armazenamento | Storage Quota | Limitar capacidade máxima de bucket |
| 94 | Limitação de Solicitações | Request Throttling | Limitar número de solicitações de API por unidade de tempo |
| 95 | Acordo de Nível de Serviço | SLA | Indicadores de compromisso para disponibilidade/durabilidade de serviço (como 99.9% de disponibilidade) |
| 96 | Recuperação de Desastres | Disaster Recovery | Garantir continuidade de negócios através de backup cross-region |
| 97 | Topologia de Armazenamento | Storage Topology | Estrutura de distribuição de dados em níveis físicos/lógicos |
| 98 | Acesso por Proximidade | Proximity Access | Rotear solicitações de usuários para nó de armazenamento mais próximo |
| 99 | Namespace Global Unificado | Global Namespace | Visão de gestão unificada de buckets cross-region |
| 100 | Migração Zero-Copy | Zero-Copy Migration | Migração rápida de dados através de operações de metadados |
