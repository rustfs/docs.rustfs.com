---
title: "Autres SDK"
description: "Cet article explique principalement l'utilisation des SDK de diverses autres langues dans RustFS."
---

# Autres SDK

Si AWS S3 officiel ne prend pas en charge le langage que vous utilisez, vous pouvez adopter plusieurs stratégies pour interfacer avec RustFS :

## 1. Utiliser l'interface HTTP directement (basée sur le protocole API S3)

Le protocole S3 est une API RESTful standard. Vous pouvez encapsuler votre propre logique d'accès via n'importe quel langage supportant les requêtes HTTP (par exemple C, Rust, Lua, Erlang).

### Les points clés incluent :

* **Algorithme de signature** : Implémenter la signature AWS Signature Version 4 (assez complexe)
* **Construire les Headers corrects et Canonical Request**
* **Utiliser un client HTTPS / HTTP pour envoyer des requêtes**

👉 Recommandé de se référer aux implémentations de signature de projets open source, par exemple :

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. Appeler les outils CLI ou services intermédiaires des SDK existants

Si vous ne voulez pas implémenter la signature vous-même, vous pouvez :

### 2.1. Utiliser les outils AWS CLI supportés par les langages existants :

Par exemple, en appelant via Shell :

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

Ou écrire un service de transfert simple avec Node.js/Python SDK, votre langage appelle ce service pour télécharger/téléverser.

### 2.2. Mettre en place un Proxy (comme Flask, FastAPI, Express)

Permettre aux clients qui ne supportent pas S3 d'appeler votre API HTTP encapsulée :

```http
POST /upload -> Service interne appelle SDK pour téléverser objet vers RustFS
GET /presigned-url -> Générer URL pré-signée pour frontend/client
```

---

## 3. Rechercher des SDK communautaires tiers

Bien qu'AWS n'ait pas de SDK officiel, certaines communautés de langages ont développé des clients S3 non officiels. Par exemple :

* Haskell : `amazonka-s3`
* Rust : `rusoto` (déprécié) ou `aws-sdk-rust`
* OCaml : Possiblement via implémentation personnelle avec `cohttp`
* Delphi : Il existe des bibliothèques commerciales supportant le protocole S3

La stabilité des SDK communautaires varie considérablement, l'activité, la documentation et la compatibilité doivent être évaluées avant utilisation.

---

## 4. Confier la logique de téléversement principale à l'hébergement de plateforme

Par exemple :

* Confier les tâches de téléversement frontend (Web/Mobile) à l'exécution par le navigateur ou l'application (utilisant des URL pré-signées)
* Backend utilise Node.js/Python/Go etc. comme proxy pour implémenter la logique de téléversement

---

## Recommandations résumées

| Scénario | Solution recommandée |
| ------------- | ---------------------------------- |
| Besoin de contrôle total/environnement embarqué | Implémenter auto-signature Signature V4 |
| Langage faiblement supporté mais avec Shell | Appeler téléversement via AWS CLI |
| Peut déployer service de transfert | Construire passerelle API S3 avec Python/Node |
| Téléversement frontend | Utiliser URL pré-signée |

