---
title: "Autres SDK"
description: "Découvrez comment vous connecter à RustFS depuis un langage sans SDK AWS officiel."
---

Si AWS ne fournit pas de SDK officiel pour votre langage, vous pouvez utiliser l’une des approches suivantes pour intégrer RustFS :

## 1. Envoyez des requêtes HTTP directement à l’API S3

Le protocole S3 est une API REST standard. Vous pouvez implémenter vous-même la logique du client dans tout langage capable d’envoyer des requêtes HTTP (comme C, Rust, Lua ou Erlang).

### Étapes clés

* **Signature des requêtes** : implémentez AWS Signature Version 4 (la partie la plus complexe).
* **En-têtes et requête canonique** : construisez la requête canonique et les en-têtes requis.
* **Client HTTP** : envoyez la requête signée avec un client HTTP ou HTTPS.

Nous recommandons de consulter les implémentations open source existantes de la signature des requêtes, par exemple :

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. Utilisez l’AWS CLI ou un service construit sur un SDK existant

Si vous ne souhaitez pas implémenter les signatures vous-même, vous pouvez :

### 2.1. Appelez l’AWS CLI

Par exemple, exécutez la commande suivante depuis votre application, à l’aide d’un shell :

```bash
aws s3 cp /path/to/hello.txt s3://my-bucket/hello.txt --endpoint-url http://localhost:9000
```

Vous pouvez aussi construire un petit service relais avec un SDK Node.js ou Python, puis l’appeler depuis votre application pour charger (upload) ou télécharger des objets.

### 2.2. Exécutez un service proxy (par exemple Flask, FastAPI ou Express)

Exposez une API HTTP que les clients sans prise en charge de S3 peuvent appeler :

```http
POST /upload -> Service internally calls SDK to upload objects to RustFS
GET /presigned-url -> Generate presigned URL for frontend/client use
```

---

## 3. Recherchez des SDK communautaires tiers

Pour les langages sans SDK AWS officiel, recherchez des clients S3 maintenus par la communauté. Par exemple :

* Haskell : `amazonka-s3`
* Rust : `rusoto` (obsolète) ou `aws-sdk-rust`
* OCaml : construisez votre propre client au-dessus de `cohttp`
* Delphi : des bibliothèques commerciales avec prise en charge de S3 sont disponibles

Les SDK communautaires varient fortement en stabilité. Vous devriez donc évaluer l’activité, la documentation et la compatibilité avant de les utiliser.

---

## 4. Chargez directement depuis les clients avec des URL présignées

Par exemple :

* Utilisez des URL présignées pour charger directement depuis un navigateur ou une application mobile.
* Implémentez la logique de chargement dans un service côté serveur (par exemple Node.js, Python ou Go)

---

## Choisissez une approche

| Situation | Approche recommandée |
| ------------- | ---------------------------------- |
| Vous avez besoin d’un contrôle total, ou vous visez un environnement embarqué | Implémentez vous-même la signature SigV4 |
| Prise en charge limitée des SDK, mais un shell est disponible | Chargez avec l’AWS CLI |
| Vous pouvez déployer un service relais | Construisez une petite passerelle S3 avec Python ou Node.js |
| Chargement côté client | Utilisez des URL présignées |
