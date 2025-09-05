---
title: "Aperçu du SDK RustFS"
description: "Quels SDK S3 peuvent être utilisés avec RustFS ? Cet article fournit une explication détaillée."
---

# Aperçu du SDK

RustFS est un logiciel de stockage d'objets distribué 100% compatible avec le protocole S3. Les utilisateurs peuvent :

1. Gérer RustFS via la console de gestion ;
2. Gérer RustFS via les clients S3 ;
3. Implémenter des opérations et la gestion du stockage d'objets côté métier via les SDK.

Actuellement, les SDK fournis par RustFS incluent :

- [SDK Java](./java.md)
- [SDK JavaScript](./javascript.md)
- [SDK Python](./python.md)
- [SDK Rust](./rust.md)
- [SDK TypeScript](./typescript.md)
- [SDK Golang](./go.md)

## Explication des termes avant lecture

S3 est le nom du premier produit de stockage d'objets ouvert et lancé par Amazon. Il a ouvert tous ses protocoles et spécifications. Par la suite, presque tous les stockages d'objets ont suivi les protocoles et spécifications S3. Parfois, les gens appellent S3 le stockage d'objets, parfois ils appellent simplement S3 le protocole de stockage d'objets.

## 1. Recommandations SDK

Comme il existe déjà de nombreux SDK sur le marché qui ont été maintenus pendant des années, comme le SDK AWS S3 qui a été débogué et optimisé pendant des années. Ses performances et erreurs sont presque nulles. Par conséquent, nous recommandons d'utiliser directement le SDK S3 standard d'AWS pour contrôler et communiquer avec RustFS.

Si vous avez un SDK familier et de confiance d'un fournisseur, vous pouvez l'utiliser.

Comme les fournisseurs de cloud chinois ont effectué de nombreuses "modifications" dans de nombreux domaines et ne supportent pas de nombreuses technologies S3 récentes, de nombreux produits de stockage d'objets dans le monde ne recommandent pas les SDK de nombreux fournisseurs de cloud chinois.

## 2. Les SDK MinIO peuvent-ils communiquer directement avec RustFS ?

Oui.

Nous avons effectué une adaptation et compatibilité complètes pour les SDK MinIO.

Si vous utilisez les SDK MinIO, vous pouvez modifier l'Endpoint, AK et SK pour être directement compatible avec RustFS.

## 3. Que faire s'il y a d'autres SDK incompatibles ?

Si nous utilisons le SDK d'un fournisseur de cloud qui ne supporte ni les derniers S3, MinIO ni RustFS, comment procéder ?
Veuillez remplacer le SDK dès que possible et effectuer un ré-appariement et une mise à niveau côté métier.
