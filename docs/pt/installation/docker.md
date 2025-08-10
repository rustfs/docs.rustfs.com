---
title: "Instalar RustFS com Docker"
description: "Implantação do RustFS via Docker"
---

# Instalar RustFS com Docker

RustFS é um armazenamento de objetos distribuído de alto desempenho, 100% compatível com S3. No modo SNSD (single node, single disk), não há redundância adicional (sem EC), adequado para testes locais e cenários pequenos.
Este guia usa o binário oficial para Linux como base e empacota num contêiner via Dockerfile, configurando volumes e variáveis de ambiente para iniciar o serviço.

---

## 1. Pré‑requisitos

1) Requisitos da máquina

- Docker ≥ 20.10 instalado e funcional
- Diretório local `/mnt/rustfs/data` (ou personalizado) para dados

2) Rede e firewall

- Garanta a abertura da porta 9000 (ou porta escolhida)

3) Ficheiro de configuração

- Em `/etc/rustfs/config.toml`, defina porta, credenciais admin, diretórios de dados, etc.

---

## 2. Obter a imagem oficial

Usando base Ubuntu, puxe a imagem oficial do RustFS:

```bash
docker pull rustfs/rustfs
```

---

## 3. Configuração do ambiente

Crie `/etc/rustfs/config.toml` no host. Exemplo de variáveis:

```bash
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:7000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_ENDPOINT=""
RUSTFS_TLS_PATH="/opt/tls"
```

> Nota: veja a documentação de instalação Linux para defaults e formatos.

---

## 4. Executar o contêiner RustFS

Execução típica do SNSD com a imagem e configuração acima:

```bash
docker run -d \
  --name rustfs_local \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest \
  /data
```

Parâmetros:

- `-p 9000:9000`: mapeia porta 9000
- `-v /mnt/rustfs/data:/data`: monta volume de dados
- `--name rustfs_local`: nome do contêiner
- `-d`: em background

---

### Exemplo com parâmetros completos

```bash
docker run -d \
  --name rustfs_container \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY=rustfsadmin \
  -e RUSTFS_SECRET_KEY=rustfsadmin \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_SERVER_DOMAINS=example.com \
  rustfs/rustfs:latest \
  --address :9000 \
  --console-enable \
  --server-domains example.com \
  --access-key rustfsadmin \
  --secret-key rustfsadmin \
  /data
```

### Métodos de configuração

1) Variáveis de ambiente (recomendado):
```bash
-e RUSTFS_ADDRESS=:9000 \
-e RUSTFS_SERVER_DOMAINS=example.com \
-e RUSTFS_ACCESS_KEY=rustfsadmin \
-e RUSTFS_SECRET_KEY=rustfsadmin \
-e RUSTFS_CONSOLE_ENABLE=true \
```

2) Parâmetros de linha de comando:
```
--address :9000 \
--server-domains example.com \
--access-key rustfsadmin \
--secret-key rustfsadmin \
--console-enable \
```

3) Parâmetros obrigatórios:
- `<VOLUMES>`: no fim do comando, ex.: `/data`

### Combinações comuns

1) Configuração básica:
```bash
docker run -d \
  -p 9000:9000 \
  -v /mnt/data:/data \
  rustfs/rustfs:latest \
  /data
```

2) Ativar console:
```bash
docker run -d \
  -p 9000:9000 \
  -v /mnt/data:/data \
  -e RUSTFS_CONSOLE_ENABLE=true \
  rustfs/rustfs:latest \
  ./target/debug/rustfs \
  --console-enable \
  /data
```

3) Chaves de autenticação personalizadas:
```bash
docker run -d \
  -p 9000:9000 \
  -v /mnt/data:/data \
  -e RUSTFS_ACCESS_KEY=rustfsadmin \
  -e RUSTFS_SECRET_KEY=rustfsadmin \
  rustfs/rustfs:latest \
  ./target/debug/rustfs \
  --access-key rustfsadmin \
  --secret-key rustfsadmin \
  /data
```

### Notas

1) Portas mapeadas corretamente (padrão 9000)
2) Volumes persistentes `-v /host:/container`
3) Pode misturar env + CLI, mas CLI tem prioridade
4) Para TLS, monte certificados:
```bash
-v /path/to/certs:/certs \
-e RUSTFS_TLS_PATH=/certs \
```

## 5. Verificação e acesso

1) Estado e logs do contêiner:
```bash
docker logs rustfs_local
```
Deve indicar sucesso e escuta na porta 9000.

2) Testar S3 API (ex.: `mc`):
```bash
mc alias set rustfs http://localhost:9000 rustfsadmin ChangeMe123!
mc mb rustfs/mybucket
mc ls rustfs
```
Se criar e listar buckets, a implantação está ok.

## 6. Recomendações

- Produção: multi‑nó, TLS, rotação de logs, backups periódicos
- Armazenamento: SSD/NVMe local, evitar NFS, acesso exclusivo ao diretório de dados

---

## Resumo

Este guia demonstrou como empacotar e executar o RustFS em modo SNSD via Docker para arranque rápido. Posteriormente, pode evoluir para MNMD em plataformas como Kubernetes/Swarm.
