---
title: "Matrice de compatibilité S3"
description: "Consultez les comportements Amazon S3 testés et volontairement exclus du contrôle de compatibilité RustFS actuel."
---

RustFS implémente un sous-ensemble testé de l’API Amazon S3. Cette matrice résume les listes exécutables Ceph s3tests maintenues dans `rustfs/rustfs` ; elle ne prétend pas couvrir tous les comportements S3 standard ou propres à un fournisseur.

L’instantané ci-dessous a été vérifié le 9 août 2026 à partir du commit RustFS [`1e6f5f1e`](https://github.com/rustfs/rustfs/commit/1e6f5f1e35f188f28844a7f81361ccca4d5d0c7b).

## Légende des états

| État | Signification |
| --- | --- |
| ✅ Testé | Couvert par le contrôle de compatibilité par défaut ou celui du cycle de vie |
| ❌ Planifié | Comportement standard répertorié comme non encore implémenté |
| ⊘ Exclu | Propre à un fournisseur, volontairement non pris en charge ou hors du contrôle par défaut |

## Listes de tests exécutables

| Liste | Cas | Rôle |
| --- | ---: | --- |
| [Tests implémentés](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/implemented_tests.txt) | 455 | Cas standard censés réussir dans le contrôle par défaut |
| [Tests du cycle de vie](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/lifecycle_behavior_tests.txt) | 5 | Cas d’expiration exécutés dans le contrôle dédié au cycle de vie |
| [Tests non implémentés](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/unimplemented_tests.txt) | 17 | Comportements standard encore planifiés |
| [Tests exclus](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/excluded_tests.txt) | 270 | Cas qui ne bloquent pas le contrôle de compatibilité RustFS |

Le comptage ignore les lignes vides et les commentaires. Les tests changent de liste au fil des évolutions ; consultez les fichiers liés pour obtenir l’état le plus récent.

## Opérations sur les compartiments

| Fonctionnalité | État | Portée |
| --- | --- | --- |
| Créer, supprimer, répertorier et inspecter des compartiments | ✅ Testé | Opérations courantes du cycle de vie d’un compartiment |
| Étiquettes de compartiment | ✅ Testé | Ajouter, obtenir et supprimer des étiquettes |
| Politiques de compartiment | ✅ Testé | Ajouter, obtenir et supprimer des politiques |
| Blocage de l’accès public | ✅ Testé | Ajouter, obtenir et supprimer la configuration |
| Certains comportements de gestion des versions, de verrouillage d’objet, de CORS et de cycle de vie | ✅ Testé | Uniquement les cas présents dans les listes implémentées |
| Journalisation des accès aux compartiments | ❌ Planifié | Répertoriée dans la liste non implémentée |
| Contrôles de propriété des compartiments | ❌ Planifié | Répertoriés dans la liste non implémentée |
| Autorisation par ACL | ⊘ Exclu | Comportement volontairement non pris en charge |

## Opérations sur les objets

| Fonctionnalité | État | Portée |
| --- | --- | --- |
| Charger, obtenir, copier, inspecter et supprimer des objets | ✅ Testé | Opérations courantes sur les objets |
| Comportement de liste avec préfixe, délimiteur, marqueur et `max-keys` | ✅ Testé | `ListObjects` et `ListObjectsV2` |
| Lectures par plage et conditionnelles | ✅ Testé | Certains cas HTTP Range et de précondition |
| Métadonnées utilisateur et étiquettes d’objet | ✅ Testé | Aller-retour des métadonnées et des étiquettes |
| URL GET et PUT présignées | ✅ Testé | Certains cas de signature et de requête |
| SSE-C et certains comportements SSE-KMS | ✅ Testé | Uniquement les objets gérés de bout en bout par RustFS |
| Gestion des sommes de contrôle des formulaires POST Object | ❌ Planifié | Répertoriée dans la liste non implémentée |

Les formats d’objets chiffrés ne sont pas portables entre RustFS et les autres implémentations S3. La réussite d’un test de chiffrement signifie que RustFS peut lire les objets chiffrés par RustFS ; elle ne garantit pas la lecture d’un objet chiffré copié directement depuis une autre implémentation.

## Chargements partitionnés

| Fonctionnalité | État | Portée |
| --- | --- | --- |
| Créer, charger des parties, terminer et abandonner | ✅ Testé | Flux principal de chargement partitionné |
| Certains comportements de copie partitionnée, de somme de contrôle et d’attributs d’objet | ✅ Testé | Cas présents dans la liste implémentée |
| Liste des chargements partitionnés et cas limites de recherche de parties | ⊘ Exclu | Hors du contrôle de compatibilité par défaut |

## Sources de référence

La [matrice de compatibilité S3](https://github.com/rustfs/rustfs/blob/main/docs/architecture/s3-compatibility-matrix.md) du dépôt décrit le contrôle et sa règle de mise à jour. Les fichiers exécutables sous [`scripts/s3-tests`](https://github.com/rustfs/rustfs/tree/main/scripts/s3-tests) déterminent le résultat actuel. Lorsqu’une fonctionnalité évolue, mettez à jour ensemble les listes de tests et les deux matrices publiées.
