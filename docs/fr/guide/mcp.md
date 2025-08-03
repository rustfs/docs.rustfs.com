---
title: "RustFS MCP"
description: "Guide d'utilisation de RustFS MCP"
---

# RustFS MCP

**Le serveur RustFS MCP** est un serveur [Protocole de Contexte de Modèle (MCP)](https://spec.modelcontextprotocol.org) haute performance qui fournit aux outils IA/LLM un accès transparent aux opérations de stockage d'objets compatibles S3. Ce serveur est construit avec Rust pour des performances et une sécurité maximales, permettant aux assistants IA comme Claude Desktop d'interagir avec le stockage cloud via un protocole standardisé.

### Qu'est-ce que MCP ?

Le Protocole de Contexte de Modèle est un standard ouvert qui permet aux applications IA d'établir des connexions sécurisées et contrôlées avec des systèmes externes. Ce serveur agit comme un pont entre les outils IA et les services de stockage compatibles S3, fournissant un accès structuré aux opérations de fichiers tout en maintenant la sécurité et l'observabilité.

## ✨ Fonctionnalités

### Opérations S3 prises en charge

- **Lister les buckets** : Lister tous les buckets S3 accessibles
- **Lister les objets** : Parcourir le contenu des buckets avec un filtrage par préfixe optionnel
- **Télécharger des fichiers** : Télécharger des fichiers locaux avec détection automatique du type MIME et contrôle de cache
- **Obtenir des objets** : Récupérer des objets depuis le stockage S3, support des modes lecture ou téléchargement

## 🔧 Installation

### Prérequis

- Rust 1.88+ (pour construire depuis les sources)
- Identifiants AWS configurés (via variables d'environnement, AWS CLI ou rôles IAM)
- Accès aux services de stockage compatibles S3

### Construire depuis les sources

```bash
# Cloner le dépôt
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# Construire le serveur MCP
cargo build --release -p rustfs-mcp

# Le binaire sera disponible à
./target/release/rustfs-mcp
```

## ⚙️ Configuration

### Variables d'environnement

```bash
# Identifiants AWS (requis)
export AWS_ACCESS_KEY_ID=votre_clé_d_accès
export AWS_SECRET_ACCESS_KEY=votre_clé_secrète
export AWS_REGION=us-east-1  # Optionnel, par défaut us-east-1

# Optionnel : Endpoint S3 personnalisé (pour MinIO, etc.)
export AWS_ENDPOINT_URL=http://localhost:9000

# Niveau de log (optionnel)
export RUST_LOG=info
```

### Options de ligne de commande

```bash
rustfs-mcp --help
```

Le serveur prend en charge diverses options de ligne de commande pour personnaliser le comportement :

- `--access-key-id` : ID de clé d'accès AWS pour l'authentification S3
- `--secret-access-key` : Clé secrète AWS pour l'authentification S3
- `--region` : Région AWS à utiliser pour les opérations S3 (par défaut : us-east-1)
- `--endpoint-url` : URL d'endpoint S3 personnalisée (pour MinIO, LocalStack, etc.)
- `--log-level` : Configuration du niveau de log (par défaut : rustfs_mcp_server=info)

-----

## 🚀 Utilisation

### Démarrer le serveur

```bash
# Démarrer le serveur MCP
rustfs-mcp

# Ou avec des options personnalisées
rustfs-mcp --log-level debug --region us-west-2
```

### Intégration avec les clients de chat

#### Option 1 : Utiliser les arguments de ligne de commande

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "votre_clé_d_accès",
        "--secret-access-key", "votre_clé_secrète",
        "--region", "us-west-2",
        "--log-level", "info"
      ]
    }
  }
}
```

#### Option 2 : Utiliser les variables d'environnement

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "env": {
        "AWS_ACCESS_KEY_ID": "votre_clé_d_accès",
        "AWS_SECRET_ACCESS_KEY": "votre_clé_secrète",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

## 🛠️ Outils disponibles

Le serveur MCP expose les outils suivants que les assistants IA peuvent utiliser :

### `list_buckets`

Lister tous les buckets S3 accessibles avec les identifiants configurés.

**Paramètres** : Aucun

### `list_objects`

Lister les objets dans un bucket S3, avec support du filtrage par préfixe optionnel.

**Paramètres** :
- `bucket_name` (chaîne) : Nom du bucket S3
- `prefix` (chaîne, optionnel) : Préfixe pour filtrer les objets

### `upload_file`

Télécharger un fichier local vers S3 avec détection automatique du type MIME.

**Paramètres** :
- `local_file_path` (chaîne) : Chemin du fichier local
- `bucket_name` (chaîne) : Bucket S3 de destination
- `object_key` (chaîne) : Clé d'objet S3 (chemin de destination)
- `content_type` (chaîne, optionnel) : Type de contenu (détecté automatiquement si non fourni)
- `storage_class` (chaîne, optionnel) : Classe de stockage S3
- `cache_control` (chaîne, optionnel) : En-tête de contrôle de cache

### `get_object`

Récupérer un objet depuis S3, avec deux modes d'opération : lecture directe du contenu ou téléchargement vers un fichier.

**Paramètres** :
- `bucket_name` (chaîne) : Bucket S3 source
- `object_key` (chaîne) : Clé d'objet S3
- `version_id` (chaîne, optionnel) : ID de version pour les objets versionnés
- `mode` (chaîne, optionnel) : Mode d'opération - "read" (par défaut) retourne directement le contenu, "download" sauvegarde vers un fichier local
- `local_path` (chaîne, optionnel) : Chemin du fichier local (requis quand le mode est "download")
- `max_content_size` (nombre, optionnel) : Taille maximale du contenu pour le mode lecture (octets) (par défaut : 1MB)

## Architecture

Le serveur MCP est construit avec une architecture modulaire :

```
rustfs-mcp/
├── src/
│   ├── main.rs          # Point d'entrée, analyse CLI et initialisation du serveur
│   ├── server.rs        # Implémentation du serveur MCP et gestionnaires d'outils
│   ├── s3_client.rs     # Wrapper client S3 avec opérations asynchrones
│   ├── config.rs        # Gestion de la configuration et options CLI
│   └── lib.rs           # Exports de bibliothèque et API publique
└── Cargo.toml           # Dépendances, métadonnées et configuration binaire
```

