---
title: "Réplication de site"
description: "Configurez et exploitez la réplication multi-site de RustFS avec le client en ligne de commande rc."
---

La réplication de site relie deux déploiements **RustFS** indépendants ou plus. Elle synchronise les compartiments (bucket), les versions d’objets et les données prises en charge de gestion des identités et des accès (IAM) entre les sites liés. Utilisez ce flux lorsque des applications doivent écrire sur des sites RustFS distincts tout en gardant leur configuration de stockage et d’identité alignée.

La réplication de site diffère de la [réplication de compartiment](/fr/administration/data/bucket/replication). La réplication de compartiment est une règle directionnelle entre des compartiments sélectionnés ; la réplication de site établit une relation plus large entre des déploiements RustFS complets.

:::warning[Planifiez la reprise séparément]

La réplication de site est asynchrone. Une écriture réussie sur un site ne confirme pas qu’un autre site possède déjà la version répliquée. La réplication de site ne fournit pas non plus de basculement DNS, de routage de trafic ni d’orchestration de reprise applicative.

:::

## Ressources répliquées

La réplication de site RustFS synchronise ces familles de ressources entre les sites liés :

- Les compartiments et les versions d’objets, y compris les marqueurs de suppression.
- Les métadonnées de compartiment requises par le flux de réplication de site.
- Les utilisateurs, groupes, politiques IAM, associations de politiques et comptes de service.

La prise en charge de la gestion des versions des compartiments est requise sur chaque site participant. RustFS configure la relation entre sites et les cibles de réplication sous-jacentes lorsque vous ajoutez les sites.

## Conditions requises

Avant de lier les sites, préparez :

- Deux déploiements RustFS indépendants ou plus, exécutant une version qui expose l’API d’administration de réplication de site.
- Un point de terminaison d’API S3 unique et stable pour chaque déploiement.
- Une connectivité réseau bidirectionnelle entre chaque point de terminaison de site sur le port de l’API S3, normalement `9000`.
- Des certificats TLS de confiance pour les points de terminaison de production.
- Le client RustFS [`rc`](/fr/operations/rc) sur un hôte d’administration sécurisé.
- Des identifiants racine d’administration pour chaque site participant.
- Une prise en charge compatible de la gestion des versions des compartiments sur chaque site.

Utilisez des sites de test vides lors de la première validation du flux. Avant de lier des sites existants, inventoriez les noms de compartiments, les paramètres de verrouillage d’objet, les identités IAM et les politiques afin de détecter les conflits.

:::warning[Protégez les identifiants d’administration]

L’opération `add` résout chaque point de terminaison pair et chaque identifiant racine à partir de votre magasin local d’alias `rc`. Ne l’exécutez que depuis un hôte d’administration de confiance, limitez l’accès à la configuration locale de `rc` et ne placez pas les identifiants dans l’historique du shell, les journaux ou les captures d’écran.

:::

## 1. Configurer les alias de site

Configurez un alias pour chaque site. Remplacez le point de terminaison et les identifiants des deux déploiements :

```bash
rc alias set site1 https://site1.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias set site2 https://site2.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

Vérifiez que les deux sites sont joignables et à l’état de préparation :

```bash
rc ready site1
rc ready site2
rc admin info cluster site1
rc admin info cluster site2
```

Utilisez des points de terminaison HTTPS en production. Si un site utilise une autorité de certification privée, installez cette autorité dans le magasin de confiance de l’hôte d’administration avant de continuer.

:::warning[Les points de terminaison de bouclage sont réservés aux tests]

RustFS rejette par défaut les cibles de réplication en bouclage, comme contrôle de sécurité des requêtes sortantes. L’option serveur `RUSTFS_REPLICATION_ALLOW_LOOPBACK_TARGET=true` n’existe que pour le développement sur un seul hôte et les tests automatisés. Ne l’activez jamais en production.

:::

## 2. Lier les sites

Soumettez tous les alias participants dans une seule commande. Le premier alias reçoit la requête d’administration :

```bash
rc admin replicate add site1 site2
```

Pour créer une relation avec plus de deux sites, incluez chaque alias dans la commande initiale :

```bash
rc admin replicate add site1 site2 site3
```

N’exécutez pas des commandes `add` deux à deux séparées pour construire la même relation multi-site.

Inspectez la configuration obtenue depuis au moins deux sites :

```bash
rc admin replicate info site1
rc admin replicate info site2
```

La sortie identifie chaque déploiement lié par son ID de déploiement, son nom de site et son point de terminaison. Conservez les ID de déploiement, car les opérations de modification et de resynchronisation peuvent sélectionner un site par ID de déploiement exact ou par nom unique exact.

## 3. Vérifier l’état de la réplication

Demandez les résumés par défaut des compartiments et de l’IAM :

```bash
rc admin replicate status site1
```

Sélectionnez des sections d’état précises lorsque vous examinez un problème :

```bash
rc admin replicate status site1 --buckets
rc admin replicate status site1 --users --groups --policies
rc admin replicate status site1 --metrics
```

Vérifiez l’état depuis chaque site. Une réponse saine de `site1` confirme la vue de ce site sur la relation ; elle ne remplace pas la vérification des autres déploiements.

## 4. Valider la réplication des données et de l’IAM

Créez un compartiment et un objet de test sur le premier site :

```bash
rc bucket create site1/my-bucket
printf 'hello rustfs\n' > hello.txt
rc object copy hello.txt site1/my-bucket/hello.txt
```

Interrogez le second site jusqu’à ce que l’objet apparaisse :

```bash
rc object stat site2/my-bucket/hello.txt
rc object copy site2/my-bucket/hello.txt ./hello-from-site2.txt
```

Comparez le contenu téléchargé avant de considérer le chemin de données comme validé :

```bash
cmp hello.txt hello-from-site2.txt
```

Pour la validation IAM, créez un utilisateur temporaire et attachez une politique de test sur un site, puis inspectez l’utilisateur et l’association de politique sur un autre site. Retirez l’identité temporaire après la validation :

```bash
rc admin user add site1 replication-test <temporary-secret-key>
rc admin policy attach site1 readonly --user replication-test

rc admin user info site2 replication-test
rc admin policy entities site2 --user replication-test

rc admin user rm site1 replication-test
```

Utilisez un secret temporaire généré aléatoirement et ne réutilisez pas un identifiant d’application ou d’administrateur.

## 5. Modifier un site

Utilisez `edit` lorsque le nom, le point de terminaison ou les paramètres de confiance TLS d’un site lié changent. Inspectez d’abord les ID de déploiement et les noms actuels :

```bash
rc admin replicate info site1
```

Renommez un site :

```bash
rc admin replicate edit site1 \
	--site <deployment-id> \
	--name site2-dr \
	--yes
```

Remplacez un point de terminaison et laissez la vérification TLS activée :

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--endpoint https://site2-dr.example.com:9000 \
	--verify-tls \
	--yes
```

Pour une autorité de certification privée, fournissez un lot PEM contenant seulement des certificats :

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--ca-cert ./site2-ca.pem \
	--yes
```

Effacez une AC personnalisée déjà configurée lorsque le point de terminaison passe à un certificat approuvé par le magasin de confiance du système :

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--clear-ca-cert \
	--verify-tls \
	--yes
```

Le point de terminaison doit être une origine HTTP ou HTTPS sans chemin, requête, fragment ni identifiants incorporés. Préférez un certificat de confiance à `--skip-tls-verify`.

## 6. Resynchroniser un site

Utilisez la resynchronisation après avoir réparé un site qui était indisponible, ou lorsque les contrôles d’état montrent un état répliqué manquant. Démarrez une resynchronisation pour un pair exact :

```bash
rc admin replicate resync start site1 \
	--site <deployment-id> \
	--yes
```

Lisez le dernier instantané de resynchronisation persisté :

```bash
rc admin replicate resync status site1 \
	--site <deployment-id>
```

N’annulez la resynchronisation sélectionnée que lorsque vous avez confirmé qu’elle devrait s’arrêter :

```bash
rc admin replicate resync cancel site1 \
	--site <deployment-id> \
	--yes
```

:::warning[L’état de resynchronisation n’est pas une progression en direct]

Le point de terminaison actuel d’état de resynchronisation RustFS renvoie le résultat persisté de la requête de démarrage ou d’annulation la plus récente. Il n’inspecte pas les workers en cours, et son état de cycle de vie est signalé comme inconnu. Les opérations de démarrage peuvent se chevaucher, l’annulation n’est pas idempotente, et un délai réseau peut laisser le résultat de la mutation inconnu. Après un résultat ambigu, inspectez `replicate info`, `replicate status` et les données cibles avant d’émettre une autre mutation.

:::

## 7. Retirer la réplication de site

Retirer un site modifie la relation de réplication. Cela ne fournit pas de bascule applicative et ne prouve pas que chaque objet en file est arrivé. Vérifiez l’état et préservez les données requises avant de continuer.

Retirez un site nommé :

```bash
rc admin replicate remove site1 --site site2-dr
```

Répétez `--site` pour retirer plusieurs sites nommés dans une seule requête :

```bash
rc admin replicate remove site1 \
	--site site2-dr \
	--site site3
```

Dissolvez la relation complète de réplication de site :

```bash
rc admin replicate remove site1 --all
```

Vérifiez le résultat depuis les déploiements restants :

```bash
rc admin replicate info site1
rc admin replicate status site1
```

## Dépannage

### Un point de terminaison pair est rejeté

Vérifiez que le point de terminaison est une origine HTTP ou HTTPS joignable et qu’il ne se résout pas en bouclage. En production, rendez chaque site joignable par son adresse réseau stable et laissez le contournement de bouclage désactivé.

### La validation TLS échoue

Vérifiez que le certificat du point de terminaison contient le nom d’hôte du pair et que l’autorité de certification émettrice est approuvée. Utilisez `replicate edit --ca-cert` pour un lot d’AC privée. Ne faites pas de `--skip-tls-verify` le correctif permanent.

### Une mutation expire

Ne répétez pas immédiatement `add`, `edit`, `resync start`, `resync cancel` ou `remove`. Le serveur peut avoir appliqué le changement avant que le client ne perde la réponse. Inspectez d’abord la relation et les données :

```bash
rc admin replicate info site1
rc admin replicate status site1
```

### La réplication prend du retard

Vérifiez l’état du site et les métriques depuis chaque déploiement, puis vérifiez la joignabilité des points de terminaison et l’état de préparation du stockage :

```bash
rc admin replicate status site1 --metrics
rc ready site1
rc ready site2
```

Les écritures applicatives peuvent aller plus vite que la réplication asynchrone. N’inférez pas un objectif de point de reprise à partir d’un seul échantillon d’état ; mesurez le retard sous votre charge et alertez en cas d’arriéré prolongé.

## Étapes suivantes

- Consultez la [Réplication de compartiment](/fr/administration/data/bucket/replication) lorsque vous avez besoin d’une réplication directionnelle pour des compartiments sélectionnés plutôt que d’une relation de site complète.
- Surveillez l’[état du cluster et l’état de préparation](/fr/operations/status-check) sur chaque site.
- Consultez le [guide des commandes `rc`](/fr/operations/rc) et maintenez le client aligné sur la version du serveur RustFS.
