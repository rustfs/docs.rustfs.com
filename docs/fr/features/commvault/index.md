# Intégration Commvault

RustFS offre une intégration transparente avec Commvault Complete Data Protection, fournissant des solutions de sauvegarde, récupération et gestion des données à l'échelle entreprise avec des performances et une fiabilité exceptionnelles.

## Vue d'ensemble

![Logo Commvault](./images/commvault-logo.png)

RustFS avec Commvault offre :

- **Protection des données d'entreprise** : Sauvegarde et récupération complètes pour toutes les charges de travail
- **Stockage à l'échelle cloud** : Stockage objet massivement évolutif en backend
- **Gestion avancée des données** : Gestion intelligente du cycle de vie des données
- **Plateforme unifiée** : Plateforme unique pour la sauvegarde, l'archivage et l'analytique

## Avantages clés

### Opérations de métadonnées atomiques

![Métadonnées atomiques](./images/atomic-metadata.png)

#### Métadonnées cohérentes

- **Transactions ACID** : Opérations atomiques, cohérentes, isolées et durables
- **Intégrité des métadonnées** : Cohérence garantie des métadonnées
- **Récupération rapide** : Récupération rapide avec des métadonnées cohérentes
- **Opérations concurrentes** : Forte concurrence sans conflits

### Performances rapides à grande échelle

![Performances rapides](./images/fast-performance.png)

#### Opérations haute performance

- **Traitement parallèle** : Sauvegarde et restauration massivement parallèles
- **E/S optimisées** : Optimisées pour les charges de travail de protection des données
- **Mise en cache intelligente** : Mise en cache intelligente pour les données fréquemment consultées
- **Évolutivité linéaire** : Les performances évoluent avec la croissance du cluster

### Évolutivité inégalée

![Évolutivité](./images/scalability.png)

#### Évolutivité élastique

- **Échelle pétaoctet** : Évolutivité jusqu'aux pétaoctets de données de sauvegarde
- **Évolutivité horizontale** : Ajout de nœuds pour la capacité et les performances
- **Auto-évolutivité** : Évolutivité automatique basée sur la demande
- **Espace de noms global** : Espace de noms unifié sur tous les nœuds

### Architecture simple et sécurisée

![Simple et sécurisé](./images/simple-secure.png)

#### Sécurité d'entreprise

- **Chiffrement de bout en bout** : Chiffrement au repos et en transit
- **Contrôles d'accès** : Politiques de contrôle d'accès granulaires
- **Journalisation d'audit** : Pistes d'audit complètes
- **Conformité** : Répondre aux exigences de conformité réglementaire

## Fonctionnalités d'intégration Commvault

### Intégration de stockage

#### Configuration de bibliothèque de disques

- **Bibliothèque de disques** : Configurer RustFS comme bibliothèque de disques Commvault
- **Déduplication** : Déduplication globale sur toutes les données
- **Compression** : Algorithmes de compression avancés
- **Chiffrement** : Chiffrement accéléré par matériel

#### Intégration de stockage cloud

- **Bibliothèque cloud** : Utiliser RustFS comme bibliothèque de stockage cloud
- **Compatibilité S3** : Compatibilité complète avec l'API Amazon S3
- **Déploiement hybride** : Déploiement cloud hybride transparent
- **Optimisation des coûts** : Hiérarchisation intelligente du stockage

### Capacités de protection des données

#### Sauvegarde et récupération

- **Prise en compte des applications** : Sauvegardes cohérentes avec les applications
- **Récupération granulaire** : Récupération au niveau fichier, dossier et application
- **Récupération instantanée** : Récupération rapide avec RTO minimal
- **Multi-plateforme** : Support pour toutes les plateformes principales

#### Archivage et conformité

- **Archivage intelligent** : Archivage des données basé sur des politiques
- **Conservation légale** : Support pour la conservation légale et les litiges
- **Gestion de la rétention** : Politiques de rétention flexibles
- **Rapports de conformité** : Rapports de conformité automatisés

## Architectures de déploiement

### Protection des données sur site

```
┌─────────────────┐    ┌─────────────────┐
│   Environnement │    │   CommServe     │
│   de production │───►│   + MediaAgent  │
│                 │    │                 │
│ • Serveurs      │    │ ┌─────────────┐ │
│ • Bases données │    │ │   RustFS    │ │
│ • Applications  │    │ │   Stockage  │ │
│ • VMs           │    │ │ Bibliothèque│ │
└─────────────────┘    │ └─────────────┘ │
                       └─────────────────┘
```

### Architecture cloud hybride

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Production    │    │   Sauvegarde    │    │   Archive       │
│   sur site      │───►│   primaire      │───►│   cloud         │
│                 │    │   (RustFS)      │    │   (RustFS)      │
│ • Données       │    │                 │    │                 │
│   primaires     │    │ • Récupération  │    │ • Long terme    │
│ • Applications  │    │   rapide        │    │ • Conformité    │
│ • Bases données │    │ • Déduplication │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Protection des données multi-sites

```
┌─────────────────┐    ┌─────────────────┐
│   DC principal  │    │   Site DR       │
│                 │◄──►│                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Production  │ │    │ │ Systèmes DR │ │
│ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   RustFS    │ │    │ │   RustFS    │ │
│ │  Primaire   │ │    │ │  Réplique   │ │
│ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘
```

## Configuration et installation

### Configuration Commvault

#### Configuration de bibliothèque de disques

```bash
# Configurer RustFS comme bibliothèque de disques
# Via Commvault Command Center
1. Stockage → Disque → Créer une bibliothèque de disques
2. Nom de bibliothèque : RustFS-Library
3. MediaAgent : Sélectionner le MediaAgent approprié
4. Chemin de montage : /mnt/rustfs
5. Activer la déduplication : Oui
6. Chiffrement : Activer
```

#### Configuration de bibliothèque cloud

```bash
# Configurer RustFS comme bibliothèque cloud
1. Stockage → Cloud → Créer une bibliothèque cloud
2. Stockage cloud : S3 générique
3. Hôte de service : rustfs.example.com
4. Clé d'accès : votre-clé-d-acces
5. Clé secrète : votre-clé-secrete
6. Conteneur : commvault-backups
```

### Configuration des politiques de stockage

#### Politiques de stockage de sauvegarde

- **Copie primaire** : Stockage haute performance pour les sauvegardes récentes
- **Copie secondaire** : Stockage optimisé en coût pour les sauvegardes anciennes
- **Copie d'archive** : Rétention à long terme et conformité
- **Copie auxiliaire** : Reprise après sinistre et réplication

#### Politiques de vieillissement des données

- **Règles de rétention** : Définir les périodes de rétention pour différents types de données
- **Politiques de vieillissement** : Déplacement automatique entre les niveaux de stockage
- **Élagage** : Suppression automatique des données expirées
- **Conformité** : Répondre aux exigences de rétention réglementaire

## Protection des charges de travail

### Protection des machines virtuelles

#### VMware vSphere

- **Intégration vCenter** : Intégration native vCenter
- **Suivi des blocs modifiés** : Optimisation des sauvegardes incrémentielles
- **Cohérence des applications** : Sauvegardes compatibles VSS
- **Récupération instantanée** : Récupération et basculement rapide des VMs

#### Microsoft Hyper-V

- **Intégration SCVMM** : Intégration System Center
- **VSS Hyper-V** : Service de copie de volume
- **Migration en direct** : Sauvegarde pendant la migration en direct
- **Support de cluster** : Support de cluster de basculement

### Protection des bases de données

#### Microsoft SQL Server

- **SQL VSS Writer** : Sauvegardes cohérentes avec les applications
- **Expédition de journaux** : Sauvegarde et expédition des journaux de transactions
- **Always On** : Support des groupes de disponibilité Always On
- **Récupération granulaire** : Récupération au niveau base de données, table et ligne

#### Base de données Oracle

- **Intégration RMAN** : Intégration Oracle Recovery Manager
- **Data Guard** : Support Oracle Data Guard
- **Support RAC** : Support Real Application Clusters
- **Récupération point dans le temps** : Récupération granulaire point dans le temps

#### Autres bases de données

- **MySQL** : Protection de base de données MySQL
- **PostgreSQL** : Sauvegarde et récupération PostgreSQL
- **MongoDB** : Protection de base de données NoSQL
- **SAP HANA** : Sauvegarde de base de données SAP HANA

### Protection du système de fichiers

#### Systèmes de fichiers Windows

- **NTFS** : Système de fichiers Windows NTFS
- **Protection de partage** : Sauvegarde de partage réseau
- **Intégration VSS** : Service de copie de volume
- **Sauvegarde de fichiers ouverts** : Sauvegarde des fichiers ouverts et verrouillés

#### Systèmes de fichiers Unix/Linux

- **ext4/XFS** : Support du système de fichiers Linux
- **NFS** : Sauvegarde Network File System
- **Intégration d'instantanés** : Instantanés LVM et système de fichiers
- **Liens symboliques** : Préserver les liens symboliques et les permissions

### Protection des applications

#### Microsoft Exchange

- **VSS Exchange** : Sauvegardes compatibles Exchange
- **Récupération de boîte aux lettres** : Récupération individuelle de boîte aux lettres
- **Récupération de base de données** : Récupération de base de données Exchange
- **Dossier public** : Sauvegarde et récupération de dossier public

#### Microsoft SharePoint

- **VSS SharePoint** : Sauvegardes compatibles SharePoint
- **Collection de sites** : Sauvegarde et récupération de collection de sites
- **Base de données de contenu** : Protection de base de données de contenu
- **Index de recherche** : Sauvegarde et récupération d'index de recherche

#### Applications d'entreprise

- **SAP** : Sauvegarde d'application SAP
- **Lotus Notes** : IBM Lotus Notes/Domino
- **Active Directory** : Sauvegarde Active Directory
- **Partages de fichiers** : Protection de partage de fichiers réseau

## Gestion et analytique des données

### Indexation du contenu

#### Recherche et découverte

- **Recherche en texte intégral** : Recherche sur toutes les données de sauvegarde
- **Indexation de métadonnées** : Indexer les métadonnées de fichier et d'application
- **Analytique de contenu** : Analyser les modèles et tendances des données
- **eDiscovery** : Découverte légale et conformité

#### Classification des données

- **Classification automatique** : Classification des données alimentée par IA
- **Basée sur des politiques** : Politiques de classification basées sur des règles
- **Données sensibles** : Identifier et protéger les données sensibles
- **Conformité** : Répondre aux exigences de gouvernance des données

### Gestion du cycle de vie des données

#### Déplacement intelligent des données

- **Hiérarchisation basée sur des politiques** : Déplacement automatique des données entre niveaux
- **Optimisation des coûts** : Optimiser les coûts de stockage
- **Optimisation des performances** : Équilibrer performance et coût
- **Conformité** : Répondre aux exigences de rétention et de conformité

#### Archivage et rétention

- **Archivage automatisé** : Archivage des données basé sur des politiques
- **Conservation légale** : Support pour la conservation légale et les litiges
- **Politiques de rétention** : Gestion flexible de la rétention
- **Disposition** : Élimination sécurisée des données

## Sécurité et conformité

### Sécurité des données

#### Chiffrement

- **Chiffrement AES-256** : Chiffrement fort pour les données au repos
- **Chiffrement en transit** : Chiffrement TLS pour le transfert de données
- **Gestion des clés** : Gestion centralisée des clés de chiffrement
- **Sécurité matérielle** : Support de module de sécurité matérielle

#### Contrôle d'accès

- **Accès basé sur les rôles** : Contrôle d'accès basé sur les rôles (RBAC)
- **Authentification multi-facteurs** : Authentification renforcée
- **Intégration LDAP/AD** : Intégration d'annuaire d'entreprise
- **Journalisation d'audit** : Journalisation complète des accès

### Fonctionnalités de conformité

#### Conformité réglementaire

- **RGPD** : Règlement général sur la protection des données
- **HIPAA** : Health Insurance Portability and Accountability Act
- **SOX** : Loi Sarbanes-Oxley
- **SEC** : Règles de la Securities and Exchange Commission

#### Gouvernance des données

- **Rétention des données** : Politiques de rétention automatisées
- **Conservation légale** : Conservation légale et préservation
- **Rapports d'audit** : Rapports d'audit automatisés
- **Chaîne de custody** : Maintenir la chaîne de custody des données

## Surveillance et gestion

### Commvault Command Center

#### Gestion centralisée

- **Console unique** : Interface de gestion unifiée
- **Multi-locataire** : Support pour plusieurs organisations
- **Tableau de bord** : Statut en temps réel et analytique
- **Rapports** : Rapports et analytique complets

#### Surveillance des tâches

- **Statut en temps réel** : Surveillance du statut des tâches en temps réel
- **Métriques de performance** : Performance de sauvegarde et restauration
- **Planification de capacité** : Planification de la capacité de stockage
- **Alertes** : Alertes et notifications proactives

### Intégration et automatisation

#### API REST

- **Accès programmatique** : API RESTful pour l'automatisation
- **Intégration tierce** : Intégration avec des systèmes externes
- **Applications personnalisées** : Créer des applications personnalisées
- **Automatisation de flux de travail** : Automatiser les flux de travail opérationnels

#### Intégration PowerShell

- **Cmdlets PowerShell** : Support natif PowerShell
- **Scripting** : Automatiser les tâches de routine
- **Opérations en masse** : Effectuer des opérations en masse
- **Scripts personnalisés** : Créer des scripts d'automatisation personnalisés

## Meilleures pratiques

### Meilleures pratiques de déploiement

1. **Dimensionnement** : Dimensionnement approprié pour les charges de travail de sauvegarde
2. **Réseau** : Optimiser la configuration réseau
3. **Stockage** : Configurer des politiques de stockage appropriées
4. **Sécurité** : Implémenter les meilleures pratiques de sécurité

### Optimisation des performances

1. **Opérations concurrentes** : Optimiser les paramètres de tâches concurrentes
2. **Déduplication** : Configurer la déduplication globale
3. **Compression** : Équilibrer compression et performance
4. **Réseau** : Optimiser l'utilisation de la bande passante réseau

### Gestion des données

1. **Politiques de stockage** : Concevoir des politiques de stockage efficaces
2. **Rétention** : Implémenter des politiques de rétention appropriées
3. **Archivage** : Utiliser des politiques d'archivage intelligentes
4. **Surveillance** : Surveillance et optimisation continues

## Dépannage

### Problèmes courants

#### Problèmes de performance

- **Sauvegardes lentes** : Vérifier les performances réseau et de stockage
- **Utilisation CPU élevée** : Surveiller l'utilisation des ressources MediaAgent
- **Problèmes de mémoire** : Optimiser l'allocation mémoire
- **Espace disque** : Surveiller l'espace disque disponible

#### Problèmes de connectivité

- **Connectivité réseau** : Vérifier la connectivité réseau
- **Règles de pare-feu** : Vérifier la configuration du pare-feu
- **Résolution DNS** : Vérifier la résolution DNS
- **Statut de service** : Vérifier le statut du service Commvault

#### Problèmes de configuration

- **Configuration de bibliothèque** : Vérifier les paramètres de bibliothèque
- **Politique de stockage** : Vérifier la configuration de la politique de stockage
- **Identifiants** : Vérifier les identifiants d'accès
- **Permissions** : Vérifier les permissions du système de fichiers

## Commencer

### Prérequis

1. **Environnement Commvault** : Commvault Complete Data Protection v11.20+
2. **Cluster RustFS** : Cluster RustFS correctement configuré
3. **Connectivité réseau** : Connectivité réseau entre Commvault et RustFS
4. **MediaAgent** : Commvault MediaAgent avec ressources suffisantes

### Guide de démarrage rapide

1. **Installer MediaAgent** : Installer et configurer Commvault MediaAgent
2. **Configurer la bibliothèque** : Ajouter RustFS comme bibliothèque de disques ou cloud
3. **Créer une politique de stockage** : Créer une politique de stockage utilisant la bibliothèque RustFS
4. **Configurer Subclient** : Créer un subclient pour la protection des données
5. **Exécuter la sauvegarde** : Exécuter la tâche de sauvegarde initiale
6. **Tester la récupération** : Tester les procédures de récupération de sauvegarde

### Étapes suivantes

- **Optimiser les performances** : Ajuster les paramètres de sauvegarde pour des performances optimales
- **Implémenter la sécurité** : Configurer le chiffrement et les contrôles d'accès
- **Configurer la surveillance** : Implémenter une surveillance complète
- **Planifier la reprise après sinistre** : Développer des procédures de reprise après sinistre
- **Former le personnel** : Former le personnel sur les procédures de sauvegarde et récupération

