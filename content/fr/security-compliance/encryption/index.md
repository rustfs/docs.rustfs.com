---
title: "Chiffrement des données"
description: "Retrouvez les références vérifiées de RustFS sur le chiffrement côté serveur et la gestion des clés."
---

RustFS propose des options de chiffrement côté serveur pour les données stockées dans le service de stockage objet. Utilisez cette section pour choisir le modèle de gestion des clés qui correspond à vos exigences de sécurité.

## Options de chiffrement

- [SSE-S3](./sse-s.md) décrit le chiffrement côté serveur géré par le serveur, avec le mode S3 `AES256`.
- [SSE-C](./sse-c.md) décrit le chiffrement côté serveur avec des clés fournies par le client.
- [SSE-KMS](./kms.md) décrit les backends de gestion des clés Local, Vault KV2 et Vault Transit.

Pour la surface de configuration KMS actuellement vérifiée, consultez la [référence CLI](/fr/reference/cli) et la [référence des variables d’environnement](/fr/reference/environment-variables).
