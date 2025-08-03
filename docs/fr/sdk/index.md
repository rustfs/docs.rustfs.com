---
title: "Aperçu des SDK"
description: "Quels SDK S3 peuvent être utilisés avec RustFS ? Cet article fournit une explication détaillée."
---

# Aperçu des SDK

RustFS est un logiciel de stockage d'objets distribué 100% compatible avec le protocole S3. Les utilisateurs peuvent :

1. Gérer RustFS via la console Console
2. Gérer RustFS via les clients S3
3. Utiliser des SDK côté business pour implémenter les opérations et la gestion du stockage d'objets

## Explication des termes avant lecture

S3 est le nom du premier produit de stockage d'objets ouvert et lancé par Amazon. Il a ouvert tous ses protocoles et spécifications. Par la suite, presque tous les stockages d'objets ont suivi les protocoles et spécifications S3.
Parfois, les gens appellent S3 stockage d'objets, et parfois ils abrègent S3 en protocole de stockage d'objets.

## 1. Recommandations SDK

Il existe déjà de nombreux SDK maintenus depuis des années sur le marché. Comme le SDK AWS S3, après des années de débogage et d'optimisation, ses performances et erreurs sont presque nulles. Par conséquent, nous recommandons d'utiliser directement le SDK S3 standard d'AWS pour contrôler et communiquer avec RustFS.

Si vous avez des SDK familiers et des produits de fournisseurs SDK de confiance, vous pouvez les utiliser.

Comme les fournisseurs de cloud chinois ont effectué des "modifications magiques" dans de nombreux endroits, beaucoup de technologies S3 récentes ne sont pas supportées. Par conséquent, de nombreux produits de stockage d'objets dans le monde ne recommandent pas les SDK de nombreux fournisseurs de cloud chinois.

## 2. Les SDK MinIO peuvent-ils communiquer directement avec RustFS ?

Oui.

Nous avons effectué une adaptation et une compatibilité complètes pour les SDK MinIO.

Si vous utilisez les SDK MinIO, vous pouvez directement être compatible avec RustFS en modifiant l'Endpoint et les AK, SK.

## 3. Que faire s'il y a d'autres SDK incompatibles ?

Si nous utilisons le SDK d'un fournisseur de cloud qui ne supporte pas les derniers S3, MinIO et RustFS, comment devons-nous le traiter ?
Veuillez changer de SDK dès que possible et effectuer un re-matching et une mise à niveau côté business.
