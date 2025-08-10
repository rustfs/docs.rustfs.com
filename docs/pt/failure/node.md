---
title: "Falha de nó"
description: "Passos completos para lidar com falha de nó num cluster RustFS: preparação de hardware de substituição, atualização de config, implantação do serviço, reentrada no cluster, healing e verificação."
---

# Falha de nó

Num cluster RustFS distribuído, o Erasure Coding garante leitura/gravação mesmo com falhas parciais de nós e executa auto‑healing quando o nó retorna. Este guia cobre:

1. Iniciar o nó de substituição e alinhar o ambiente
2. Atualizar DNS/hostname para apontar o identificador antigo para o novo nó
3. Descarregar e implantar a mesma versão do RustFS usada no cluster
4. Reingressar o nó no cluster e acionar o healing
5. Monitorizar o progresso e realizar verificações pós‑recuperação

## 1) Iniciar o nó de substituição

- Hardware e SO
  Mantenha CPU/memória/rede/discos similares ao nó antigo (maior não prejudica). Alinhe versões de SO/kernel/libs para evitar inconsistências.

- Acesso exclusivo aos discos
  Garanta acesso exclusivo aos volumes de dados; nenhum outro processo deve escrever neles, evitando corrupção ou perda de redundância.

## 2) Atualizar hostname e resolução

- DNS/Hosts
  Se IP mudou, mapeie o hostname antigo (ex.: `rustfs-node-2.example.net`) para o novo IP.

  ```bash
  # Ex.: ajustar /etc/hosts
  192.168.1.12 rustfs-node-2.example.net
  ```

  Valide com `ping` ou `nslookup`.

## 3) Implantar e configurar o serviço RustFS

- Download e instalação
  Instale a mesma versão usada nos demais nós. Garanta scripts, variáveis e configs (ex.: `/etc/default/rustfs`) alinhados.

- Verificação de configuração
  - Revise endpoints no `config.yaml` (ou ficheiro equivalente) incluindo hostname/porta do novo nó
  - Replique credenciais e permissões para evitar falhas de autenticação

## 4) Reingressar no cluster e acionar healing

- Iniciar serviço

  ```bash
  systemctl start rustfs-server
  ```

  Siga logs (`journalctl -u rustfs-server -f`) para confirmar descoberta de pares e início do healing.

- Monitorização manual

  ```bash
  # Estado do cluster
  rc cluster status

  # Acionar healing do nó
  rc heal --node rustfs-node-2.example.net

  # Acompanhar progresso
  rc heal status --follow
  ```

  O comando `heal` (equivalente a `rc admin heal`) assegura reconstrução de fragmentos perdidos/inconsistentes.

- Nota de campo
  Em testes de comunidade, após retorno de nó offline, o RustFS foca healing apenas no nó novo, evitando rebalanceamento completo.

## 5) Pós‑verificações e boas práticas

- Monitorização e alertas
  - Observe carga de disco e rede durante o healing
  - Configure alertas para falhas/estagnação de progresso

- Exercícios de DR
  Simule falhas periodicamente para treinar a equipa no procedimento

- Análise de causa raiz
  Para falhas frequentes, inspecione saúde de hardware (SMART, BIOS logs) e planeie manutenção preventiva

- Suporte profissional
  Para diagnósticos avançados, contate a equipa do RustFS ou a comunidade

---

Resumo: estes passos permitem substituir um nó com falha e concluir healing rapidamente, minimizando indisponibilidade. Ajuste comandos e configs ao seu ambiente, garantindo ordem correta de operações.