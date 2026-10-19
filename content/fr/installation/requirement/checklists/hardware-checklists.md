---
title: "Guide matériel de production"
description: "Cette page fournit des indications de dimensionnement et de configuration matérielle pour les déploiements RustFS en production."
---

## Considérations de planification

Avant de déployer RustFS en production, évaluez la charge de travail et les besoins en capacité sur une période de deux à trois semaines. Concentrez-vous sur les facteurs suivants :

1. **Volume de données**

   - **Volume initial** : estimez le volume de données utile à la mise en service (en TiB), y compris le ratio entre données chaudes et données froides.
   - **Prévision de croissance** : estimez la croissance des données pour les 24 prochains mois à partir des plans d’activité. Nous recommandons de modéliser la croissance chaque trimestre.
   - **Nombre d’objets** : estimez le nombre total d’objets à partir de la taille moyenne d’objet (idéalement de 128 KB à 1 MB). Les déploiements de plus de 100 millions d’objets nécessitent un réglage supplémentaire.

2. **Caractéristiques de la charge**

   - **Schémas d’accès** : distinguez les charges intensives en lecture (comme la distribution de contenu) des charges intensives en écriture (comme la collecte de journaux).
   - **Exigences de conformité** : les durées de conservation doivent respecter les réglementations du secteur (par exemple, certaines réglementations financières exigent au moins cinq ans de conservation).
   - **Déploiement multisite** : pour les déploiements interrégionaux, évaluez la latence réseau (idéalement inférieure à 50 ms) et les coûts de bande passante.

3. **Architecture de stockage**

   - **Planification des compartiments** : organisez les compartiments (bucket) par unité métier. Nous recommandons de ne pas dépasser 500 compartiments actifs par cluster.
   - **Reprise après sinistre** : choisissez la réplication actif-actif (recommandée) ou la réplication asynchrone selon la criticité des données.

## Matrice de configuration matérielle

Configurations de référence fondées sur les résultats des tests de charge :

| Composant | Entrée de gamme | Production standard | Hautes performances |
|--------------|---------------------------|--------------------------|--------------------------|
| Nombre de nœuds | 4 nœuds | 8 nœuds | 16 nœuds ou plus |
| Support de stockage | 4× NVMe SSD | 8×NVMe SSD | 12×NVMe SSD |
| Architecture réseau | Double 25GbE (agrégation de liens) | Double 100GbE | 200GbE |
| CPU | 2×Intel Silver 4310 (16 cœurs) | 2×AMD EPYC 7313 (32 cœurs) | 2×Intel Platinum 8461Y (48 cœurs) |
| Mémoire | 64 GB DDR4-3200 ECC | 256 GB DDR5-4800 ECC | 512 GB DDR5-5600 ECC |
| Contrôleur de stockage | HBA 9500-8i | HBA 9600-16i | Architecture redondante à double contrôleur |

**Consignes de déploiement :**

1. Utilisez des nœuds homogènes : chaque nœud devrait avoir un matériel identique, issu du même lot, et les mêmes versions de micrologiciel.
2. Le réseau doit utiliser une topologie leaf-spine, un réseau de stockage physiquement isolé et des liaisons montantes doubles.
3. Nous recommandons des serveurs 2U avec au moins 12 baies de disques par nœud, selon le nombre de disques requis.

## Réglage des performances

### Optimisation de la topologie réseau (priorité maximale)

- **Dimensionnement de la bande passante** : prévoyez 0.5 Gbps de bande passante par TB de données utiles (par exemple, 100 TB de données nécessitent 50 Gbps de bande passante dédiée).
- **Exigences de latence** :
  - Latence P99 entre nœuds ≤ 2ms
  - Latence entre racks ≤ 5ms

### Réglage du sous-système de stockage

- **Configuration du contrôleur** :
  - Activez le cache de lecture anticipée (256 MB ou plus recommandés).
  - Désactivez toutes les fonctions RAID et utilisez le mode transparent (pass-through, HBA/JBOD).
  - Contrôlez régulièrement l’état du BBU.
- **Paramètres des SSD** :
  - Réservez 20 % d’espace de surprovisionnement (OP) pour améliorer l’endurance.
  - Activez les écritures atomiques (nécessite une prise en charge matérielle).

### Répartition de la mémoire

- **Proportions d’allocation** :
  - Cache de métadonnées : 60 % de la mémoire totale
  - Tampons de lecture et d’écriture : 30 %
  - Réserve système : 10 %

## Modèle de référence pour la conception réseau

### Bande passante réseau et nombre de disques

| Réseau | Débit théorique | Type de disque | Nombre maximal de disques par nœud |
|------------|------------|---------------------|----------------|
| 10GbE | 1.25 GB/s | 7.2K HDD (180 MB/s) | 8 disques |
| 25GbE | 3.125 GB/s | SATA SSD (550 MB/s) | 6 disques |
| 100GbE | 12.5 GB/s | NVMe Gen4 (7 GB/s) | 2 (à pleine vitesse en lecture et en écriture) |

**Exemple** : une plateforme vidéo exploite un cluster de 16 nœuds. Chaque nœud comporte :

- 8×7.68 TB NVMe SSD
- Deux cartes réseau NVIDIA ConnectX-5 en 100GbE
- Atteint un débit agrégé de 38 GB/s

## Dimensionnement de la mémoire

Utilisez la formule suivante pour dimensionner la mémoire selon la capacité des disques et le type de charge :

```python
# Memory calculation formula (unit: GB)
def calc_memory(data_tb, access_pattern):
 base = 32 # Base memory
 if access_pattern == "read_heavy":
 return base + data_tb * 0.8
 elif access_pattern == "write_heavy":
 return base + data_tb * 1.2
 else: # mixed
 return base + data_tb * 1.0
```

**Tailles de référence** :

| Volume de données | Lecture intensive | Écriture intensive | Mixte |
|-----------|----------|----------|---------|
| 10 TB | 40 GB | 44 GB | 42 GB |
| 100 TB | 112 GB | 152 GB | 132 GB |
| 500 TB | 432 GB | 632 GB | 532 GB |

## Consignes de stockage

### Choix des supports de stockage

| Indicateur | HDD | SATA SSD | NVMe (requis) |
|-------------|------------------|---------------------|----------------------|
| Exigences de latence | >50ms | 1 à 10ms | < 1ms |
| Exigences de débit | < 500 MB/s | 500 MB-3 GB/s | > 3 GB/s |
| Cas d’usage typiques | Stockage d’archives | Cache de données chaudes | Analytique en temps réel |

### Configuration du système de fichiers

```bash
# XFS formatting example
mkfs.xfs -f -L rustfs_disk1 -d su=256k,sw=10 /dev/sdb

# Recommended mount parameters
UUID=xxxx /mnt/disk1 xfs defaults,noatime,nodiratime,logbsize=256k 0 0
```

## Haute disponibilité

1. **Alimentation** :

   - Utilisez des alimentations doubles (redondantes).
   - Raccordez chaque PDU à une alimentation distincte.
   - Prévoyez un onduleur (UPS) offrant au moins 30 minutes d’autonomie.

2. **Exigences de refroidissement** :

   - Densité de puissance ≤ 15 kW par rack.
   - Maintenez l’écart de température entre l’entrée et la sortie (ΔT) dans une limite de 8 °C.

3. **Gestion des micrologiciels** :

   - Tenez à jour une matrice de compatibilité matérielle.
   - Uniformisez les versions de micrologiciel sur l’ensemble des nœuds.

:::tip[Avant la mise en service]

Nous recommandons d’exécuter un test de charge de 72 heures avant la mise en production, couvrant les scénarios suivants :

1. Tests de basculement de nœud
2. Tests de partition réseau
3. Tests de charge d’écriture en rafale (nous recommandons de tester à 120 % du maximum théorique)

:::

---

Ce guide s’appuie sur la dernière version de développement de RustFS. Pour les déploiements en production, affinez ces réglages à l’aide de la documentation de votre fournisseur de matériel. Pour des évaluations trimestrielles de l’état du matériel, contactez RustFS.
