---
title: "Autres SDK"
description: "Ce document explique principalement l'utilisation des SDK de divers autres langages dans RustFS."
---

# Autres SDK

Si AWS S3 officiel ne supporte pas le langage que vous utilisez, vous pouvez adopter les stratégies suivantes pour vous connecter à RustFS :

## 1. Utiliser l'Interface HTTP pour les Requêtes Directes (Basé sur le Protocole API S3)

Le protocole S3 est une API RESTful standard. Vous pouvez encapsuler votre propre logique d'accès via n'importe quel langage supportant les requêtes HTTP (par exemple C, Rust, Lua, Erlang).

### Les Points Clés Incluent :

* **Algorithme de Signature** : Implémenter la signature AWS Signature Version 4 (assez complexe)
* **Construire les En-têtes Corrects et la Requête Canonique**
* **Utiliser un Client HTTPS / HTTP pour Envoyer les Requêtes**

👉 Il est recommandé de référencer les implémentations de signature de projets open source, par exemple :

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. Appeler les Outils CLI ou Services Intermédiaires des SDK Existants

Si vous ne voulez pas implémenter la signature vous-même, vous pouvez :