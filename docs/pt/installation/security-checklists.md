---
title: "Checklist de segurança"
description: "Checklist de segurança para implantações empresariais do RustFS (licença Apache 2.0, desenvolvido em Rust)."
---

# Checklist de segurança

> Para ajudar na implantação segura do RustFS em ambientes empresariais, reunimos abaixo as melhores práticas recomendadas. Verifique item a item durante a implantação para garantir segurança e confiabilidade.

## 1. Autenticação e controlo de acesso

- Uso de chaves compatíveis com S3
  O RustFS utiliza mecanismo de assinatura similar ao AWS Signature V4. Cada utilizador/serviço deve usar Access Key e Secret Key válidas. Nunca ignore autenticação.

- Políticas de acesso com privilégio mínimo
  Defina políticas por função/utilizador com base no princípio do privilégio mínimo. Configure políticas de grupo e de utilizador, especificando operações S3 permitidas. Por padrão, operações não explicitamente autorizadas devem ser recusadas.

## 2. Criptografia de transporte (TLS/SSL)

- Ativar TLS/SSL
  Configure certificados SSL e chaves privadas válidos. Para acesso externo e interno, considere domínios/certificados separados. Use TLS 1.2 ou superior.

- Gestão de certificados
  Utilize CA confiável (ou CA interna). Evite certificados expirados/autofirmados. Restrinja permissões dos ficheiros de chave privada apenas ao processo RustFS/usuário dedicado.

- Múltiplos domínios e suites criptográficas
  Configure certificados distintos para múltiplos domínios. Use algoritmos recomendados (ex.: RSA 2048 ou ECC 256) para geração de chaves.

## 3. Variáveis de ambiente e proteção de credenciais

- Alterar credenciais padrão
  Se a instalação inicial usar credenciais padrão (ex.: `rustfsadmin`/`rustfsadmin`), altere imediatamente para senhas fortes e aleatórias.

- Armazenamento seguro de credenciais
  Não faça hard‑code de senhas em scripts, imagens ou logs. Utilize variáveis de ambiente ou Kubernetes Secrets.

## 4. Registos e auditoria

- Ativar auditoria
  O RustFS pode exportar auditoria para HTTP Webhook, Kafka, ELK, Splunk, etc.

- Recolha de logs
  Em systemd/Docker/K8s, recolha e analise logs de forma padronizada. Recomendado integrar com ELK/Grafana Loki.

- Monitorização e alertas
  Configure alertas para falhas de login, acessos fora de hora, deleções em massa e outras anomalias.

- Observabilidade
  O RustFS suporta implantação observável, permitindo afinar tempos de execução por função e otimizar conforme o ambiente.

## 5. Restrições de acesso à API

- Restringir acesso de rede
  Por padrão, o S3 API do RustFS escuta na porta 9000 e o console de gestão na 9090. Limite IPs de origem via firewall/security groups.

- Isolamento e proxy
  Exponha o serviço por reverse proxy (ex.: Nginx) e evite expor diretamente os IPs dos nós de armazenamento.

- Fechar portas desnecessárias
  Desative portas/interfaces não utilizadas. Não exponha o console de gestão à Internet pública.

## 6. Dados imutáveis (WORM)

- Versionamento e bloqueio de objetos
  Ative versionamento e políticas de bloqueio para cumprir requisitos regulatórios (ex.: finanças, governo).

## 7. Atualizações e gestão de versões

- Patches e upgrades em dia
  Acompanhe comunicados oficiais, atualize periodicamente e leia notas de versão para mitigar vulnerabilidades.

- Atualização sem interrupção
  O RustFS suporta atualização por rolling restart nó a nó, evitando downtime.

- SO e dependências
  Monitore CVEs/atualizações do SO e componentes (ex.: OpenSSL).

---

Esta é a checklist de segurança para implantação empresarial do RustFS. Revise antes da produção e reavalie periodicamente para reduzir riscos e aumentar a estabilidade.
