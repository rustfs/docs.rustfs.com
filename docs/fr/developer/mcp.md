---
title: "RustFS MCP"
description: "Guide d'utilisation de RustFS MCP"
---

# RustFS MCP

**Le serveur RustFS MCP** est un serveur haute performance [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) qui fournit aux outils AI/LLM un accès transparent aux opérations de stockage d'objets compatibles S3. Ce serveur est construit avec Rust pour des performances et une sécurité maximales, permettant aux assistants IA comme Claude Desktop d'interagir avec le stockage cloud via un protocole standardisé.

### Qu'est-ce que MCP ?

Le Model Context Protocol est un standard ouvert qui permet aux applications IA d'établir des connexions sécurisées et contrôlées avec les systèmes externes. Ce serveur fait le pont entre les outils IA et les services de stockage compatibles S3, fournissant un accès structuré aux opérations sur fichiers tout en maintenant la sécurité et l'observabilité.

## ✨ Fonctionnalités

### Opérations S3 Supportées

  - **Lister les buckets** : Liste tous les buckets S3 accessibles
  - **Lister les objets** : Parcourir le contenu des buckets avec filtrage de préfixe optionnel
  - **Télécharger des fichiers** : Télécharger des fichiers locaux avec détection automatique du type MIME et contrôle de cache
  - **Obtenir des objets** : Récupérer des objets du stockage S3, supportant les modes lecture ou téléchargement

## 🔧 Installation

### Prérequis

  - Rust 1.88+ (pour la compilation depuis les sources)
  - Identifiants AWS configurés (via variables d'environnement, AWS CLI ou rôle IAM)
  - Accès à un service de stockage compatible S3

### Compilation depuis les Sources

```bash
# Cloner le dépôt
git clone https://github.com/rustfs/rustfs.git
cd rustfs