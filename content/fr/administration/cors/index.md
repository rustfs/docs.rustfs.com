---
title: "Configuration CORS"
description: "Configurez les origines de navigateur autorisées pour l’API S3 et la Console RustFS."
---

Le partage de ressources entre origines (Cross-Origin Resource Sharing, CORS) détermine quelles origines de navigateur peuvent accéder à l’API S3 et à la Console de RustFS. Configurez chaque écouteur séparément, puis redémarrez RustFS pour appliquer les changements d’environnement.

## Origines de l’API S3

Définissez `RUSTFS_CORS_ALLOWED_ORIGINS` avec une liste d’origines de confiance séparées par des virgules :

```ini title="/etc/default/rustfs"
RUSTFS_CORS_ALLOWED_ORIGINS="https://app.example.com,https://admin.example.com"
```

Lorsque cette variable n’est pas définie ou qu’elle est vide, le point de terminaison S3 n’ajoute pas d’en-têtes de réponse CORS génériques. Une liste d’origines explicites autorise les requêtes de navigateur avec identifiants en provenance des origines correspondantes.

Vous pouvez définir la valeur sur `*` pour autoriser les requêtes depuis n’importe quelle origine. Le mode caractère générique n’autorise pas les identifiants de navigateur.

:::warning[Utilisez des origines explicites en production]

Utilisez une liste d’autorisation séparée par des virgules pour les applications qui envoient des identifiants. Réservez `*` aux ressources publiques qui n’exigent pas de requêtes de navigateur avec identifiants.

:::

## Origines de la Console

La Console utilise une variable distincte :

```ini title="/etc/default/rustfs"
RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS="https://admin.example.com"
```

Utilisez une liste séparée par des virgules lorsque plusieurs origines de navigateur doivent accéder à la Console. Ne définissez `*` que lorsque toute origine doit être autorisée.

## Vérifier la réponse

Envoyez une requête avec un en-tête `Origin` et inspectez les en-têtes de réponse CORS :

```bash
curl -i \
  -H "Origin: https://app.example.com" \
  http://localhost:9000/
```

Confirmez que `Access-Control-Allow-Origin` contient l’origine attendue. Répétez la vérification avec une origine absente de la liste et confirmez qu’elle n’est pas autorisée.

## Étapes suivantes

Consultez la [référence des variables d’environnement](/fr/reference/environment-variables#cors) pour les valeurs par défaut vérifiées et les formats de configuration.
