---
title: "RustFS MCP"
description: "Guia de utilização do RustFS MCP"
---

# RustFS MCP

**O servidor RustFS MCP** é um servidor [Model Context Protocol (MCP)](https://spec.modelcontextprotocol.org) de alto desempenho que fornece acesso transparente a operações de armazenamento de objetos compatível com S3 para ferramentas de IA/LLM. Escrito em Rust para máxima performance e segurança, permite que assistentes como o Claude Desktop interajam com storage em nuvem via protocolo padronizado.

### O que é MCP?

O Model Context Protocol é um padrão aberto para conexões seguras e controladas entre aplicações de IA e sistemas externos. Este servidor atua como ponte entre ferramentas de IA e serviços S3‑compatíveis, oferecendo acesso estruturado a operações de ficheiros com segurança e observabilidade.

## ✨ Funcionalidades

### Operações S3 suportadas

- Listar buckets: lista todos os buckets acessíveis
- Listar objetos: navegação com filtro opcional por prefixo
- Upload de ficheiros: upload local com deteção automática de MIME e cache control
- Obter objeto: leitura ou download de objetos do S3

## 🔧 Instalação

### Pré‑requisitos

- Rust 1.88+ (para compilar a partir da fonte)
- Credenciais AWS configuradas (variáveis de ambiente, AWS CLI ou IAM)
- Acesso a serviço S3‑compatível

### Compilar a partir da fonte

```bash
# Clonar repositório
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# Compilar o servidor MCP
cargo build --release -p rustfs-mcp

# Binário disponível em
./target/release/rustfs-mcp
```

## ⚙️ Configuração

### Variáveis de ambiente

```bash
# Credenciais AWS (obrigatórias)
export AWS_ACCESS_KEY_ID=SEU_ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=SEU_SECRET_KEY
export AWS_REGION=us-east-1  # opcional, padrão us-east-1

# Opcional: endpoint S3 personalizado (MinIO, etc.)
export AWS_ENDPOINT_URL=http://localhost:9000

# Nível de log (opcional)
export RUST_LOG=info
```

### Opções de linha de comando

```bash
rustfs-mcp --help
```

Opções comuns:
- `--access-key-id`: Access Key para S3
- `--secret-access-key`: Secret Key para S3
- `--region`: região AWS (padrão: us-east-1)
- `--endpoint-url`: endpoint S3 personalizado (MinIO, LocalStack)
- `--log-level`: nível de log (padrão: rustfs_mcp_server=info)

-----

## 🚀 Utilização

### Iniciar o servidor

```bash
# Iniciar servidor MCP
rustfs-mcp

# Com opções personalizadas
rustfs-mcp --log-level debug --region us-west-2
```

### Integração com cliente de chat

#### Opção 1: parâmetros de linha de comando

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "SEU_ACCESS_KEY",
        "--secret-access-key", "SEU_SECRET_KEY",
        "--region", "us-west-2",
        "--log-level", "info"
      ]
    }
  }
}
```

#### Opção 2: variáveis de ambiente

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "env": {
        "AWS_ACCESS_KEY_ID": "SEU_ACCESS_KEY",
        "AWS_SECRET_ACCESS_KEY": "SEU_SECRET_KEY",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

## 🛠️ Ferramentas disponíveis

O servidor expõe as seguintes ferramentas para assistentes de IA:

### `list_buckets`
Lista todos os buckets acessíveis com as credenciais configuradas.

Parâmetros: nenhum

### `list_objects`
Lista objetos num bucket S3, com filtro opcional por prefixo.

Parâmetros:
- `bucket_name` (string): nome do bucket
- `prefix` (string, opcional): prefixo de filtro

### `upload_file`
Carrega ficheiro local para S3, com deteção automática de MIME.

Parâmetros:
- `local_file_path` (string): caminho local
- `bucket_name` (string): bucket de destino
- `object_key` (string): chave/rota destino
- `content_type` (string, opcional): content‑type (auto se ausente)
- `storage_class` (string, opcional): classe de armazenamento
- `cache_control` (string, opcional): cabeçalho de cache

### `get_object`
Obtém objeto do S3 em dois modos: leitura direta do conteúdo ou download para ficheiro.

Parâmetros:
- `bucket_name` (string): bucket origem
- `object_key` (string): chave do objeto
- `version_id` (string, opcional): versão (se versionado)
- `mode` (string, opcional): "read" (padrão) ou "download"
- `local_path` (string, opcional): caminho local (obrigatório se "download")
- `max_content_size` (número, opcional): limite para modo leitura (bytes, padrão 1MB)

## Arquitetura

O servidor MCP tem arquitetura modular:

```
rustfs-mcp/
├── src/
│   ├── main.rs          # entrypoint, CLI e inicialização
│   ├── server.rs        # implementação do servidor MCP e handlers
│   ├── s3_client.rs     # wrapper S3 assíncrono
│   ├── config.rs        # gestão de configuração e CLI
│   └── lib.rs           # exports e API pública
└── Cargo.toml           # dependências e metadados
```

