---
title: "Disponibilidade e escalabilidade"
description: "Descrição técnica de expansão do RustFS e notas de disponibilidade"
---

# Disponibilidade e escalabilidade

## Visão geral de expansão

O RustFS suporta scale‑out adicionando novos Server Pools. Cada novo pool deve cumprir:

1. Hostnames contínuos dentro do pool (ex.: node5‑node8)
2. Mesma especificação de discos no pool (tipo/capacidade/quantidade)
3. Sincronização de tempo e conectividade de rede com o cluster existente

![Arquitetura do RustFS](./images/s2-1.png)

---

## 1) Preparação antes de expandir

### 1.1 Planeamento de hardware

| Item | Mínimo | Recomendado produção |
|---|---|---|
| Nº nós | 4 nós/pool | 4‑8 nós/pool |
| RAM por nó | 128 GB | 128 GB |
| Tipo de disco | SSD | NVMe SSD |
| Capacidade por disco | ≥1 TB | ≥4 TB |
| Rede | 10 Gbps | 25 Gbps |

### 1.2 Verificações de sistema

```bash
# Hostnames contínuos (ex. nós novos)
cat /etc/hosts
192.168.10.5 node5
192.168.10.6 node6
192.168.10.7 node7
192.168.10.8 node8

# Estado de sincronização de tempo
timedatectl status | grep synchronized

# Firewall (abrir 7000/7001 em todos os nós)
firewall-cmd --list-ports | grep 7000
```

---

## 2) Passos de implementação

### 2.1 Configuração base nos novos nós

```bash
# Utilizador dedicado (em todos os novos nós)
groupadd rustfs-user
useradd -M -r -g rustfs-user rustfs-user

# Diretórios de dados (ex.: 8 discos)
mkdir -p /data/rustfs{0..7}
chown -R rustfs-user:rustfs-user /data/rustfs*
```

### 2.2 Instalar o serviço RustFS

```bash
# Binário (versão deve igualar ao cluster)
wget https://dl.rustfs.com/rustfs/v2.3.0/rustfs -O /usr/local/bin/rustfs
chmod +x /usr/local/bin/rustfs

# Configuração (/etc/default/rustfs)
cat <<EOF > /etc/default/rustfs
RUSTFS_ROOT_USER=admin
RUSTFS_ROOT_PASSWORD=YourSecurePassword
RUSTFS_VOLUMES="/data/rustfs{0...7}"
RUSTFS_ADDRESS=":7000"
RUSTFS_CONSOLE_ADDRESS=":7001"
EOF
```

### 2.3 Expandir o cluster

```bash
# Atualizar configuração nos nós existentes (adicionar novo pool)
sed -i '/RUSTFS_VOLUMES/s|"$| http://node{5...8}:7000/data/rustfs{0...7}"|' /etc/default/rustfs

# Reinício simultâneo em todos os nós
systemctl restart rustfs.service
```

---

## 3) Validação pós‑expansão

### 3.1 Estado do cluster

```bash
# Nós adicionados
curl -s http://node1:7001/cluster/nodes | jq .poolMembers

# Distribuição de pools
rc admin info cluster
```

### 3.2 Balanceamento de dados

```bash
# Proporções de distribuição (esperado próximo da capacidade de cada pool)
watch -n 5 "rustfs-admin metrics | grep 'PoolUsagePercent'"
```

---

## 4) Notas

1. Proibido rolling‑restart: reinicie todos os nós em simultâneo
2. Planeie expansão antes de 70% de utilização
3. Tuning recomendado:

```bash
# Kernel (em todos os nós)
echo "vm.swappiness=10" >> /etc/sysctl.conf
echo "net.core.somaxconn=32768" >> /etc/sysctl.conf
sysctl -p
```

---

## 5) Troubleshooting

| Sintoma | Verificar | Comando |
|---|---|---|
| Novo nó não entra | Porta 7000 reachability | `telnet node5 7000` |
| Distribuição desigual | Configuração de pools | `rustfs-admin rebalance start` |
| Estado anómalo na consola | Sincronização de tempo | `chronyc sources` |

> Nota: baseado na última versão do RustFS. Faça backup completo antes de expandir. Em produção, recomenda‑se revisão por engenheiro de suporte RustFS.
