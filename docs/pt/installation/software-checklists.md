---
title: "Checklist de software"
description: "Pontos de atenção de SO, binários e dependências ao instalar o RustFS"
---

# Checklist de implantação de software do RustFS

RustFS é um armazenamento de objetos distribuído de alto desempenho, 100% compatível com S3, sob licença Apache 2.0. Desenvolvido em Rust com segurança de memória, executa em Linux/Windows/macOS (x86/ARM), com implantação flexível e extensível (plugins).
Abaixo, itens essenciais para garantir uma implantação estável em produção.

## Requisitos do sistema

- Sistema operativo: preferir Linux LTS (Ubuntu 20.04+/22.04, RHEL 8/9, etc.); kernel ≥ 5.x. Em Linux 5.x+, o RustFS pode usar `io_uring` para melhor throughput.
- CPU e memória: x86_64/ARM suportados. Mínimo 2 GB para testes; produção recomenda 64 GB+. Dimensione memória segundo dados e concorrência.
- Desativar serviços intrusivos: evite scanners/auditores de FS (mlocate/plocate/updatedb/auditd/AV) que conflitam com I/O. Caso não possa desativar, exclua o caminho de dados do RustFS.

O RustFS tira proveito de io_uring (Linux 5.1+, maduro em 5.10+), oferecendo I/O assíncrono com menor latência que epoll/threads — ideal para alta concorrência.

### Sugestões

- Use distros empresariais com kernel 5.x:
  - Ubuntu 20.04 LTS (HWE 5.15+)
  - Ubuntu 22.04 LTS (5.15+)
  - CentOS Stream 9 / RHEL 9
  - Debian 12 (6.x)
- Em kernels antigos (4.x), atualize para tirar proveito do desempenho.

## Verificação e implantação de binários

- Download oficial: obtenha binários apenas de canais oficiais do RustFS.
- Integridade: verifique checksums (SHA256/assinaturas) com `sha256sum` ou ferramentas de assinatura.
- Consistência: em clusters, use a mesma versão em todos os nós.
- Local de instalação: mova para `/usr/local/bin` e `chmod +x`. Se usar systemd, confirme caminhos no unit file.

## Sistema de ficheiros e layout de discos

- Disco dedicado: acesso exclusivo aos discos de dados; não misture com sistema ou outros apps.
- Tipo de FS: XFS/Ext4 com opções de performance (ex.: `noatime,nodiratime,nobarrier` conforme o caso).
- Configuração de discos: prefira JBOD; confie a confiabilidade ao EC do RustFS, não ao RAID de hardware.
- Montagem e permissões: garanta RW ao usuário do serviço. Em `/etc/fstab`, considere `noexec`/`nodev`. Assegure permissões adequadas.

## Dependências do sistema

- Sincronização de tempo: essencial em multi‑nó (ntp/chrony/timedatectl). Verifique `timedatectl status` (synchronized).
- Hostname/DNS: configure nomes consistentes e resoluções corretas (DNS ou `/etc/hosts`).
- Conectividade: valide ping entre nós e portas abertas (padrão 9000). Em firewalls: `firewall-cmd --add-port=9000/tcp`.
- TLS/certificados: se usar HTTPS, instale cadeia raiz e configure caminhos dos certificados/keys no RustFS.
- Pacotes: garanta toolchain GNU e libs cripto (openssl/gnutls). Instale conforme avisos do SO.

## Utilizador de execução e contexto de segurança

- Utilizador dedicado: crie usuário (ex.: `rustfs-user`) para rodar o serviço; ajuste ownership (chown) do diretório de dados.
- Permissões: binários/configs legíveis ao usuário de execução; restrinja diretórios irrelevantes. Dados: `700/750`.
- SELinux/AppArmor: ajuste políticas para binários/dados; em testes, pode usar permissivo, avaliando riscos.
- systemd: valide `User=`/`ExecStart=` e variáveis; habilite restart automático.

## Outros

- Monitorização e logs: instale Prometheus + Grafana; configure rotação de logs.
- Ferramentas de operação: pode usar AWS CLI, s3cmd, etc.
- Escalabilidade: RustFS suporta plugins e vários modos de implantação; comece simples e ative recursos avançados depois.
- Plano de rollback: garanta backups de configuração e estratégia de retorno antes de produção.

Estas listas cobrem os aspetos principais do software para implantação do RustFS. Com as boas práticas e io_uring em Linux modernos, o RustFS fornece armazenamento de objetos eficiente e fiável.


