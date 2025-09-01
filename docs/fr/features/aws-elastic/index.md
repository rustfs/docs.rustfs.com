---
title: "RustFS pour la Plateforme de Conteneurs VMware Tanzu"
description: "RustFS s'intègre nativement avec VMware Tanzu pour un stockage d'objets haute performance et évolutif dans les environnements Kubernetes d'entreprise"
---

# RustFS pour la Plateforme de Conteneurs VMware Tanzu

## Trois raisons pour lesquelles les clients exécutent RustFS sur VMware Tanzu

- RustFS sert de couche de stockage cohérente dans les scénarios de déploiement cloud hybride ou multi-cloud
- RustFS est un produit haute performance natif Kubernetes qui peut fournir des performances prévisibles dans les environnements cloud public, privé et edge.
- L'exécution de RustFS sur EKS permet de contrôler la pile logicielle et offre la flexibilité nécessaire pour éviter le verrouillage cloud.

VMware Tanzu est une plateforme de conteneurs Kubernetes d'entreprise avec des capacités d'exploitation automatisée full-stack, capable de gérer les déploiements cloud hybride, multi-cloud et edge. VMware Tanzu inclut un système d'exploitation Linux d'entreprise, un runtime de conteneurs, des réseaux, une surveillance, un registre, ainsi que des solutions d'authentification et d'autorisation.

RustFS s'intègre nativement avec VMware Tanzu, facilitant l'exploitation de votre propre stockage d'objets multi-tenant à grande échelle en tant que service. L'Opérateur RustFS fonctionne avec la chaîne d'outils VMware Tanzu (comme VMware Tanzu Cluster Manager CLI et le registre de conteneurs Quay), garantissant que vous obtenez le maximum de retour sur investissement de l'écosystème VMware Tanzu.

![Diagramme d'Architecture RustFS](images/sec1-1.png)

RustFS fournit un stockage d'objets cohérent, haute performance et évolutif car il est natif Kubernetes par conception et compatible S3 dès le départ. Les développeurs peuvent facilement obtenir des services de stockage persistant compatibles Amazon S3 pour toutes les applications cloud-natives s'exécutant sur VMware Tanzu. Contrairement à AWS S3, RustFS permet aux applications d'évoluer à travers toute infrastructure multi-cloud et cloud hybride, et peut toujours être gérée dans l'écosystème VMware Tanzu sans subir de verrouillage de cloud public.

## L'Opérateur RustFS s'intègre nativement avec les fonctionnalités VMware Tanzu

### Aperçu des Fonctionnalités

- **Classes de Stockage et Hiérarchisation**
- **Équilibrage de Charge Externe**
- **Gestion des Clés de Chiffrement**
- **Gestion d'Identité**
- **Gestion des Certificats**
- **Surveillance et Alertes**
- **Journalisation et Audit**

## Classes de Stockage et Hiérarchisation

Une exigence clé pour déployer RustFS à grande échelle sur Tencent Cloud TKE est la capacité de hiérarchisation entre les classes de stockage (NVMe, HDD, cloud public). Cela permet aux entreprises de gérer simultanément les coûts et les performances.

RustFS prend en charge la transition automatique des objets vieillissants depuis la couche NVMe rapide vers la couche HDD plus rentable, voire vers la couche de stockage cloud public optimisée pour les coûts.

Lors de la hiérarchisation, RustFS fournit un espace de noms unifié à travers les couches. Le mouvement entre couches est transparent pour les applications et déclenché par des politiques déterminées par le client.

RustFS fournit un stockage sécurisé dans le cloud hybride Alibaba Cloud ACK en chiffrant les objets à la source, garantissant que les clients gardent toujours un contrôle complet sur leurs données. Lorsqu'Alibaba Cloud ACK est déployé dans le cloud public, la fonctionnalité de hiérarchisation aide Alibaba Cloud ACK à gérer efficacement les données entre le stockage persistant par blocs et les couches de stockage d'objets moins chères.

**En savoir plus :**

## Équilibrage de Charge Externe

Toutes les communications RustFS sont basées sur HTTP, des API RESTful, et supporteront tout contrôleur d'entrée compatible Kubernetes standard. Cela inclut les solutions définies par matériel et par logiciel. Le choix le plus populaire est NGINX. Installez en utilisant OperatorHub ou OpenShift Marketplace, puis exposez les locataires RustFS en utilisant des annotations.

## Gestion des Clés de Chiffrement

Il n'y a pas de fonctionnalité native de gestion des clés OpenShift. Par conséquent, RustFS recommande d'utiliser HashiCorp Vault pour stocker les clés en dehors du système de stockage d'objets. C'est une meilleure pratique pour les applications cloud-natives.

Pour tous les environnements de production, nous recommandons d'activer le chiffrement par défaut sur tous les seaux de stockage. RustFS utilise le chiffrement AES-256-GCM ou ChaCha20-Poly1305 pour protéger l'intégrité et la confidentialité des données, avec un impact négligeable sur les performances.

RustFS prend en charge les trois modes de chiffrement côté serveur (SSE-KMS, SSE-S3 et SSE-C). SSE-S3 et SSE-KMS s'intègrent avec le KMS côté serveur, tandis que SSE-C utilise des clés fournies par le client.

RustFS utilisera ce KMS pour démarrer son serveur de chiffrement de clés interne (service KES) pour un chiffrement haute performance par objet. Chaque locataire exécute son propre serveur KES dans un espace de noms isolé.

## Gestion d'Identité

Lors de l'exécution de RustFS sur OpenShift, les clients peuvent gérer l'authentification unique (SSO) via des fournisseurs d'identité compatibles OpenID Connect/LDAP tiers (comme Keycloak, Okta/Auth0, Google, Facebook, ActiveDirectory et OpenLDAP). RustFS recommande le fournisseur d'identité Keycloak compatible OpenID Connect.

Les fournisseurs d'identité externes permettent aux administrateurs de gérer centralement les identités utilisateur/application. RustFS s'appuie sur les fournisseurs d'identité pour fournir des API de services utilisateur, groupe, rôle, politique et jeton de style AWS IAM. La capacité d'une couche de gestion d'identité et d'accès (IAM) unifiée indépendante de l'infrastructure offre une flexibilité architecturale significative.

## Gestion des Certificats

Tout le trafic de l'application vers RustFS, y compris le trafic inter-nœuds, utilise le chiffrement TLS. Les certificats TLS sont utilisés pour sécuriser les communications réseau et établir l'identité des ressources de connexion réseau, telles que les domaines de serveur RustFS.

RustFS s'intègre avec le gestionnaire de certificats OpenShift, vous permettant d'utiliser l'opérateur RustFS pour provisionner, configurer, gérer et mettre à jour automatiquement les certificats pour les locataires RustFS. Les locataires sont complètement isolés les uns des autres dans leurs propres espaces de noms Kubernetes, avec leurs propres certificats pour une sécurité améliorée.

## Surveillance et Alertes

RustFS recommande d'utiliser Grafana, les composants de surveillance de plateforme installés dans le projet openshift-user-workload-monitoring, ou tout autre outil de surveillance de conteneurs OpenShift pour se connecter à RustFS. RustFS publie toutes les métriques Prometheus liées au stockage imaginables, de la capacité des seaux aux métriques d'accès. Ces métriques peuvent être collectées et visualisées dans tout outil compatible Prometheus ou dans la console RustFS.

Les solutions de surveillance externes récupèrent périodiquement les points de terminaison Prometheus RustFS. RustFS recommande d'utiliser Grafana ou les composants de surveillance de plateforme installés dans le projet openshift-user-workload-monitoring pour se connecter à RustFS. Ces mêmes outils peuvent également être utilisés pour établir des lignes de base et définir des seuils d'alerte de notification, qui peuvent ensuite être routés vers des plateformes de notification comme PagerDuty, Freshservice ou même SNMP.

## Journalisation et Audit

L'activation de l'audit RustFS génère des journaux pour chaque opération sur le cluster de stockage d'objets. En plus des journaux d'audit, RustFS enregistre les erreurs de console pour le dépannage opérationnel.

RustFS prend en charge la sortie des journaux vers la pile Elastic (ou des tiers) pour l'analyse et les alertes.

