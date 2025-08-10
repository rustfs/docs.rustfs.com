---
title: "Checklist de rede"
description: "Checklist de rede para implantação empresarial do RustFS"
---

# Checklist de rede

## 1. Desenho da arquitetura de rede

### Planeamento básico
- Verificação da topologia (estrela/anel/malha) para alta disponibilidade
- Verificação de caminhos redundantes: pelo menos dois enlaces físicos independentes entre nós
- Planeamento de largura de banda: Tráfego estimado de leitura/gravação × nº de nós × nº de réplicas + 20% de margem

### Planeamento de IP
- [ ] Separar rede de gestão e rede de dados
- [ ] Alocar bloco de IPs contínuos aos nós de armazenamento (sugestão: /24)
- [ ] Reservar pelo menos 15% dos IPs para expansão

---

## 2. Requisitos de hardware
### Switches
| Item | Requisito |
|------|-----------|
| Backplane | ≥ capacidade de encaminhamento em linha de todas as portas × 1,2 |
| Tipo de portas | 10G/25G/100G SFP+/QSFP+ óticas |
| Tabela de fluxos | ≥ nº de nós × 5 |
| STP | Habilitar RSTP/MSTP com convergência rápida |

### Ligações físicas
- [ ] Teste de atenuação de fibra (monomodo ≤ 0,35 dB/km)
- [ ] Verificação de cruzamento de portas (nó A eth0 ↔ nó B eth0)
- [ ] Etiquetagem de cabos (IP de origem/destino + nº da porta)

---

## 3. Sistema operativo e tuning de rede
### Parâmetros de kernel
```bash
# Verificar as seguintes definições
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_slow_start_after_idle = 0
```

### Configuração de NIC
- [ ] Jumbo frame (MTU=9000, com suporte end‑to‑end)
- [ ] Modo de bonding (recomendado LACP mode4)
- [ ] Desativar IPv6 (se não usado)

---

## 4. Segurança
### Regras de firewall
```bash
# Portas necessárias
- TCP 443 (HTTPS API)
- TCP 9000 (S3 compatível)
- TCP 7946 (Serf)
- UDP 4789 (VxLAN)
```

### Controlo de acesso
- Segurança de porta no switch (limite de MAC)
- Túnel IPSec entre nós de armazenamento
- Interface de gestão com TLS 1.3

---

## 5. Testes de desempenho
### Itens de benchmark
1. Latência entre nós: `iperf3 -s 8972 <IP alvo>`
2. Largura de banda cross‑rack: `iperf3 -c <IP alvo> -P 8 -t 30`
3. Failover: desconectar link crítico e observar tempo de recuperação

### Critérios de aceitação
| Métrica | Requisito |
|--------|-----------|
| Latência | ≤1 ms (mesmo DC) / ≤5 ms (entre AZs) |
| Utilização de banda | Pico ≤70% da capacidade projetada |
| Failover | Convergência BPDU < 500 ms |

---

## 6. Registos e documentação
1. Diagrama de topologia (ligações físicas e IP lógicos)
2. Backup de configurações de switch (com timestamp)
3. Relatório de testes baseline (com dados brutos)
4. Registo de mudanças (com janela de manutenção)

> Dica: antes da produção, execute teste de stress por 72 h simulando 110% do pico de tráfego.

Esta checklist cobre pontos críticos para implantação de armazenamento distribuído; para apoio oficial, contacte a equipa RustFS.