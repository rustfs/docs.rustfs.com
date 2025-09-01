---
title: "Déploiements Bare Metal et de Virtualisation Prenant en Charge Windows/Linux"
description: "Open source, compatible S3, durcé entreprise et extrêmement rapide"
---

# Déploiements Bare Metal et de Virtualisation Prenant en Charge Windows/Linux

Open source, compatible S3, durcé entreprise et extrêmement rapide.

RustFS est un système de stockage d'objets distribué haute performance. Il est défini par logiciel, s'exécute sur du matériel standard de l'industrie et est 100% open source avec une licence principale Apache V2.0.

Ce qui distingue RustFS, c'est qu'il a été conçu dès le départ pour être le standard pour le stockage d'objets cloud privé/hybride. Parce que RustFS est construit spécifiquement pour servir des objets uniquement, une architecture à couche unique peut réaliser toutes les fonctionnalités nécessaires sans compromettre les performances. Le résultat est un serveur d'objets cloud-natif qui est à la fois haute performance, évolutif et léger.

Bien que RustFS excelle dans les cas d'usage traditionnels de stockage d'objets tels que le stockage secondaire, la récupération après sinistre et l'archivage, il est unique dans sa capacité à surmonter les défis associés aux charges de travail d'apprentissage automatique, d'analytique et d'applications cloud-natives.

## Caractéristiques Centrales

### Codage d'Effacement

RustFS protège les données en utilisant le codage d'effacement en ligne par objet écrit en code assembleur pour fournir les plus hautes performances possibles. RustFS utilise des codes Reed-Solomon pour strier des objets en blocs de données et de parité avec des niveaux de redondance configurables par l'utilisateur. Le codage d'effacement de RustFS effectue la réparation au niveau objet et peut réparer indépendamment plusieurs objets.

Avec une parité maximale de N/2, l'implémentation de RustFS peut garantir des opérations de lecture et écriture ininterrompues en utilisant seulement ((N/2)+1) disques opérationnels dans le déploiement. Par exemple, dans une configuration à 12 disques, RustFS fragmente les objets entre 6 disques de données et 6 disques de parité et peut écrire de nouveaux objets ou reconstruire des objets existants de manière fiable avec seulement 7 disques restants dans le déploiement.

![Codage d'Effacement](./images/sec2-1.png)

### Protection Bitrot

La corruption silencieuse de données ou bitrot est un problème grave pour les disques durs, entraînant une corruption des données à l'insu de l'utilisateur. Les causes sont multiples (vieillissement des disques, pics de courant, erreurs firmware de disque, écritures fantômes, lectures/écritures mal dirigées, erreurs de pilotes, écrasements accidentels), mais le résultat est le même - compromission des données.

L'implémentation optimisée de RustFS de l'algorithme HighwayHash garantit qu'il ne lira jamais de données corrompues - il peut capturer et réparer la corruption d'objets à la volée. En calculant les hashes lors de READ et en les vérifiant lors de WRITE de l'application, réseau à mémoire/disque, l'intégrité bout-en-bout est assurée. L'implémentation est conçue pour la vitesse et peut atteindre des vitesses de hachage de plus de 10 GB/sec sur un seul cœur sur CPU Intel.

![Protection Bitrot](./images/sec2-2.png)

### Chiffrement Côté Serveur

Chiffrer les données en vol est une chose ; protéger les données au repos en est une autre. RustFS prend en charge plusieurs schémas de chiffrement côté serveur sophistiqués pour protéger les données - peu importe où elles résident. L'approche de RustFS garantit la confidentialité, l'intégrité et l'authenticité avec un surcoût de performance négligeable. Le chiffrement côté serveur et client est pris en charge en utilisant AES-256-GCM, ChaCha20-Poly1305 et AES-CBC.

Les objets chiffrés sont protégés contre la falsification en utilisant le chiffrement côté serveur AEAD. De plus, RustFS est compatible et testé avec toutes les solutions de gestion de clés courantes (par exemple, HashiCorp Vault). RustFS utilise un système de gestion de clés (KMS) pour prendre en charge SSE-S3.

Si un client demande SSE-S3 ou si le chiffrement automatique est activé, le serveur RustFS chiffre chaque objet avec une clé d'objet unique protégée par une clé maître gérée par KMS. Étant donné le surcoût extrêmement faible, le chiffrement automatique peut être activé pour chaque application et instance.

![Chiffrement Côté Serveur](./images/sec2-3.png)

### WORM (Write Once Read Many)

#### Gestion d'Identité

RustFS prend en charge les standards les plus avancés en gestion d'identité, pouvant s'intégrer avec des fournisseurs compatibles OpenID Connect ainsi que les principaux fournisseurs IDP externes. Cela signifie que l'accès est centralisé, les mots de passe sont temporaires et rotatifs plutôt que stockés dans des fichiers de configuration et bases de données. De plus, les politiques d'accès sont granulaires et hautement configurables, rendant le support des déploiements multi-locataires et multi-instances simple.

#### Réplication Continue

Le défi des méthodes de réplication traditionnelles est qu'elles ne peuvent pas évoluer efficacement au-delà de quelques centaines de TiB. Cela dit, tout le monde a besoin d'une stratégie de réplication pour soutenir la récupération après sinistre, et cette stratégie doit couvrir les emplacements géographiques, centres de données et clouds.

La réplication continue de RustFS est conçue pour des déploiements à grande échelle et inter-centres de données. En exploitant les notifications de calcul Lambda et les métadonnées d'objet, elle peut calculer les deltas efficacement et rapidement. Les notifications Lambda garantissent la propagation immédiate des changements plutôt que les modes batch traditionnels.

La réplication continue signifie qu'en cas de panne, la perte de données sera maintenue au minimum - même face à des ensembles de données hautement dynamiques. Enfin, comme tout ce que fait RustFS, la réplication continue est multi-fournisseur, ce qui signifie que votre emplacement de sauvegarde peut être n'importe où du NAS au cloud public.

#### Fédération Globale

Les données de l'entreprise moderne sont partout. RustFS permet de combiner ces instances disparates pour former un espace de noms global unifié. Spécifiquement, n'importe quel nombre de serveurs RustFS peuvent être combinés en un ensemble de mode distribué, et plusieurs ensembles de mode distribué peuvent être combinés en une fédération de serveurs RustFS. Chaque fédération de serveurs RustFS fournit un administrateur et un espace de noms unifiés.

Les serveurs fédérés RustFS prennent en charge un nombre illimité d'ensembles de mode distribué. L'impact de cette approche est que le stockage d'objets peut évoluer massivement pour de grandes entreprises géographiquement dispersées tout en conservant la capacité d'accommoder diverses applications (Splunk, Teradata, Spark, Hive, Presto, TensorFlow, H20) depuis une console unique.

#### Passerelle Multi-Cloud

Toutes les entreprises adoptent des stratégies multi-cloud. Cela inclut aussi les clouds privés. Par conséquent, vos services de conteneurisation bare metal et de cloud public (incluant les fournisseurs non-S3 comme Google, Microsoft et Alibaba) doivent paraître identiques. Alors que les applications modernes sont hautement portables, les données qui les alimentent ne le sont pas.

Fournir ces données peu importe où elles résident est un défi primaire que RustFS résout. RustFS s'exécute sur bare metal, stockage attaché réseau et chaque cloud public. Plus important, RustFS garantit via l'API Amazon S3 que du point de vue de l'application et de la gestion, cette vue des données paraît exactement identique.

RustFS peut aller plus loin et rendre votre infrastructure de stockage existante compatible Amazon S3. L'impact est profond. Maintenant, les organisations peuvent vraiment unifier leur infrastructure de données - des fichiers aux blocs, toutes les données apparaissent comme des objets accessibles via l'API Amazon S3 sans migration.

Quand WORM est activé, RustFS désactive toutes les API qui pourraient modifier les données et métadonnées d'objet. Cela signifie que les données deviennent inaltérables une fois écrites. Cela a des applications pratiques dans de nombreuses exigences réglementaires différentes.

![Fonctionnalité WORM](./images/sec2-4.png)

## Architecture Système

RustFS est conçu comme cloud-natif et peut s'exécuter comme des conteneurs légers gérés par des services d'orchestration externes tels que Kubernetes. L'ensemble du serveur est un binaire statique d'environ 40 MB qui utilise efficacement les ressources CPU et mémoire même sous forte charge. Le résultat est que vous pouvez co-héberger de nombreux locataires sur du matériel partagé.

RustFS s'exécute sur des serveurs de base avec des disques connectés localement (JBOD/JBOF). Tous les serveurs du cluster sont fonctionnellement équivalents (architecture complètement symétrique). Il n'y a pas de nœuds de nom ou de serveurs de métadonnées.

RustFS écrit les données et métadonnées ensemble comme des objets, ne nécessitant pas de base de données de métadonnées. De plus, RustFS exécute toutes les fonctionnalités (codage d'effacement, vérification bitrot, chiffrement) comme des opérations en ligne, strictement cohérentes. Le résultat est que RustFS a une résilience extraordinaire.

Chaque cluster RustFS est une collection de serveurs RustFS distribués avec un processus par nœud. RustFS s'exécute dans l'espace utilisateur comme un processus unique et utilise des coroutines légères pour une haute concurrence. Les disques sont groupés en ensembles d'effacement (16 disques par ensemble par défaut) et les objets sont placés sur ces ensembles utilisant des algorithmes de hachage déterministes.

RustFS est conçu pour des services de stockage cloud multi-centres de données à grande échelle. Chaque locataire exécute son propre cluster RustFS, complètement isolé des autres locataires, leur permettant de les protéger de toute interruption due aux mises à niveau, mises à jour et événements de sécurité. Chaque locataire évolue indépendamment en fédérant des clusters à travers les emplacements géographiques.

