---
title: "Instalar RustFS no Linux"
description: "Guia rápido para instalar o RustFS em Linux"
---

# Instalar RustFS no Linux

## 1. Antes de instalar

Esta página cobre os três modos de instalação do RustFS. O modo MNMD (multi‑nó, multi‑disco) oferece performance, segurança e escalabilidade de nível empresarial, com diagrama de referência.
Antes de prosseguir, consulte:

1) Modos de arranque: escolha o modo Linux apropriado
2) Checklists: verifique se cumpre os requisitos de produção (se não for produção, pode simplificar)

## 2. Pré‑requisitos

1) Versão do sistema operativo
2) Firewall
3) Hostname
4) Memória
5) Sincronização de tempo
6) Planeamento de capacidade
7) Planeamento de discos
8) Planeamento de capacidade
9) Tiering de dados

### 2.1 Versão do SO

Recomendamos kernel Linux ≥ 4.x; para melhor IO e rede, use 5.x ou superior.
Distribuições sugeridas: Ubuntu 22.04, RHEL 8.x.

### 2.2 Firewall

Verifique o estado do firewall:

```bash
systemctl status firewalld
```

Se “active”, pode desativar:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

Ou apenas liberar a porta 9000 do RustFS:

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```
Todas as máquinas do cluster devem usar a MESMA porta de escuta. Se usar 9000, todos os nós devem usar 9000.

### 2.3 Hostname

O cluster requer hostnames consistentes e contínuos. Duas opções:

1) DNS
2) `/etc/hosts`

```bash
vim /etc/hosts
127.0.0.1 localhost localhost.localdomain localhost4 localhost4.localdomain4
::1 localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```

### 2.4 Memória

Mínimo 2 GB para testes; produção recomenda 64 GB+.

### 2.5 Sincronização de tempo

Para consistência multi‑nó, sincronize via `ntp`/`timedatectl`/`timesyncd`.

Verifique o estado:

```bash
timedatectl status
```

Se “synchronized”, está ok.

## 3. Utilizador de serviço

Recomendamos criar um utilizador sem login para executar o RustFS. No `rustfs.service`, o padrão é `rustfs-user`/`rustfs-user`.
Crie grupo/usuário e atribua permissões ao diretório de dados conforme necessário.

## 4. Download e instalação

Instale wget ou curl e descarregue o binário do RustFS.

```bash
# Download
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-latest.zip
unzip rustfs-linux-x86_64-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

### 5. Variáveis de ambiente

1) Criar ficheiro de configuração

```bash
sudo tee /etc/default/rustfs <<EOF
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:9000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_ENDPOINT=""
RUSTFS_TLS_PATH="/opt/tls"
EOF
```

2) Criar diretórios de dados
```bash
sudo mkdir -p /data/rustfs{0..3} /var/logs/rustfs /opt/tls
sudo chmod -R 750 /data/rustfs* /var/logs/rustfs
```

### 6. Observabilidade

1) Configurar variáveis
```
export RUSTFS_OBS_ENDPOINT=http://localhost:4317 # endpoint do OpenTelemetry Collector
export RUSTFS_OBS_USE_STDOUT=false # usar stdout
export RUSTFS_OBS_SAMPLE_RATIO=2.0 # 0.0-1.0 (0 sem amostragem, 1 tudo)
export RUSTFS_OBS_METER_INTERVAL=1 # segundos
export RUSTFS_OBS_SERVICE_NAME=rustfs # nome do serviço
export RUSTFS_OBS_SERVICE_VERSION=0.1.0 # versão
export RUSTFS_OBS_ENVIRONMENT=develop # ambiente
export RUSTFS_OBS_LOGGER_LEVEL=debug # trace/debug/info/warn/error
export RUSTFS_OBS_LOCAL_LOGGING_ENABLED=true # logging local
# diretório de logs; quando RUSTFS_OBS_ENDPOINT vazio, aplica regras abaixo
export RUSTFS_OBS_LOG_DIRECTORY="$current_dir/deploy/logs"
export RUSTFS_OBS_LOG_ROTATION_TIME="minute"
export RUSTFS_OBS_LOG_ROTATION_SIZE_MB=1

# ficheiro de log
export RUSTFS_SINKS_FILE_PATH="$current_dir/deploy/logs/rustfs.log"
export RUSTFS_SINKS_FILE_BUFFER_SIZE=12
export RUSTFS_SINKS_FILE_FLUSH_INTERVAL_MS=1000
export RUSTFS_SINKS_FILE_FLUSH_THRESHOLD=100
```

2) Logrotate
```bash
sudo tee /etc/logrotate.d/rustfs <<EOF
/var/logs/rustfs/*.log {
 daily
 rotate 7
 missingok
 notifempty
 compress
 delaycompress
 sharedscripts
 postrotate
 systemctl restart rustfs >/dev/null 2>&1 || true
 endscript
}
EOF
```

### 7. Serviço systemd

1) Criar unit
```bash
sudo tee /etc/systemd/system/rustfs.service <<EOF
[Unit]
Description=RustFS Object Storage Server
Documentation=https://rustfs.com/docs/
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
NotifyAccess=main
User=root
Group=root

WorkingDirectory=/usr/local
EnvironmentFile=-/etc/default/rustfs
ExecStart=/usr/local/bin/rustfs $RUSTFS_VOLUMES

LimitNOFILE=1048576
LimitNPROC=32768
TasksMax=infinity

Restart=always
RestartSec=10s

OOMScoreAdjust=-1000
SendSIGKILL=no

TimeoutStartSec=30s
TimeoutStopSec=30s

NoNewPrivileges=true
ProtectSystem=full
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectClock=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictRealtime=true

# logs do serviço
StandardOutput=append:/var/logs/rustfs/rustfs.log
StandardError=append:/var/logs/rustfs/rustfs-err.log

[Install]
WantedBy=multi-user.target
EOF
```

2) Recarregar systemd
```bash
sudo systemctl daemon-reload
```

### 8. Iniciar e validar

1) Ativar e iniciar
```bash
sudo systemctl enable --now rustfs
```

2) Estado do serviço
```bash
systemctl status rustfs
```

3) Portas
```bash
ss -lnt | grep 9000
```

4) Console
```bash
curl -u rustfsadmin:rustfsadmin http://localhost:9000/
```

5) Logs
```bash
tail -f /var/logs/rustfs/app.log
```

6) Teste de API
```bash
curl -X PUT -u rustfsadmin:rustfsadmin \
 -H "Content-Type: application/octet-stream" \
 --data-binary @testfile \
 http://localhost:9000/bucket1/object1
```


