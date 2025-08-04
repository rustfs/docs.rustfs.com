---
title: "Explication de la disponibilité et de l'évolutivité"
description: "Cet article expliquera en détail les technologies et explications liées à l'extension de RustFS."
---

# Explication de la disponibilité et de l'évolutivité

## Aperçu du plan d'extension

RustFS prend en charge l'extension horizontale en ajoutant de nouveaux pools de stockage (Server Pool). Chaque nouveau pool de stockage ajouté doit satisfaire :

1. Les nœuds dans le pool de stockage doivent utiliser des **noms d'hôtes consécutifs** (comme node5-node8)
2. Un seul pool de stockage doit utiliser des disques de **même spécification** (type/capacité/quantité)
3. Le nouveau pool de stockage doit maintenir la **synchronisation temporelle** et la **connectivité réseau** avec le cluster existant

![Diagramme d'architecture RustFS](./images/s2-1.png)

---

## I. Préparation avant extension

### 1.1 Exigences de planification matérielle

| Élément | Exigence minimale | Configuration de production recommandée |
|---------------|---------------------------|---------------------------|
| Nombre de nœuds | 4 nœuds/pool de stockage | 4 - 8 nœuds/pool de stockage |
| Mémoire par nœud | 128 GB | 128 GB |
| Type de disque | SSD | NVMe SSD |
| Capacité par disque | ≥1 TB | ≥4 TB |
| Bande passante réseau | 10 Gbps | 25 Gbps |

### 1.2 Vérification de l'environnement système

```bash
# Vérifier la continuité des noms d'hôtes (exemple de nouveaux nœuds)
cat /etc/hosts
192.168.10.5 node5
192.168.10.6 node6
192.168.10.7 node7
192.168.10.8 node8

# Vérifier l'état de synchronisation temporelle
timedatectl status | grep synchronized

# Vérifier les règles de pare-feu (tous les nœuds doivent ouvrir les ports 7000/7001)
firewall-cmd --list-ports | grep 7000
```

---

## II. Étapes de mise en œuvre de l'extension

### 2.1 Configuration de base des nouveaux nœuds

```bash
# Créer un utilisateur dédié (exécuter sur tous les nouveaux nœuds)
groupadd rustfs-user
useradd -M -r -g rustfs-user rustfs-user

# Créer le répertoire de stockage (exemple avec 8 disques)
mkdir -p /data/rustfs{0..7}
chown -R rustfs-user:rustfs-user /data/rustfs*
```

### 2.2 Installation du service RustFS

```bash
# Télécharger le dernier package binaire (la version doit être cohérente avec le cluster existant)
wget https://dl.rustfs.com/rustfs/v2.3.0/rustfs -O /usr/local/bin/rustfs
chmod +x /usr/local/bin/rustfs

# Créer le fichier de configuration (/etc/default/rustfs)
cat <<EOF > /etc/default/rustfs
RUSTFS_ROOT_USER=admin
RUSTFS_ROOT_PASSWORD=YourSecurePassword
RUSTFS_VOLUMES="/data/rustfs{0...7}"
RUSTFS_ADDRESS=":7000"
RUSTFS_CONSOLE_ADDRESS=":7001"
EOF
```

### 2.3 Opération d'extension du cluster

```bash
# Mettre à jour la configuration sur tous les nœuds existants (ajouter un nouveau pool de stockage)
sed -i '/RUSTFS_VOLUMES/s|"$| http://node{5...8}:7000/data/rustfs{0...7}"|' /etc/default/rustfs

# Redémarrage global du service (exécuter simultanément sur tous les nœuds)
systemctl restart rustfs.service
```

---

## III. Vérification après extension

### 3.1 Vérification de l'état du cluster

```bash
# Vérifier l'état de jonction des nœuds
curl -s http://node1:7001/cluster/nodes | jq .poolMembers

# Vérifier la distribution des pools de stockage
rc admin info cluster
```

### 3.2 Vérification de l'équilibrage des données

```bash
# Voir le ratio de distribution des données (devrait être proche du ratio de capacité de chaque pool de stockage)
watch -n 5 "rustfs-admin metrics | grep 'PoolUsagePercent'"
```

---

## IV. Points d'attention

1. **Redémarrage en cascade interdit** : Tous les nœuds doivent être redémarrés simultanément pour éviter l'incohérence des données
2. **Recommandation de planification de capacité** : Planifier la prochaine extension avant que l'utilisation du stockage atteigne 70%
3. **Recommandations d'optimisation des performances** :

```bash
# Ajuster les paramètres du noyau (tous les nœuds)
echo "vm.swappiness=10" >> /etc/sysctl.conf
echo "net.core.somaxconn=32768" >> /etc/sysctl.conf
sysctl -p
```

---

## V. Guide de dépannage

| Phénomène | Point de vérification | Commande de réparation |
|---------------------------|---------------------------------|-------------------------------|
| Le nouveau nœud ne peut pas rejoindre le cluster | Vérifier la connectivité du port 7000 | `telnet node5 7000` |
| Distribution des données déséquilibrée | Vérifier la configuration de capacité du pool de stockage | `rustfs-admin rebalance start`|
| La console affiche un état de nœud anormal | Vérifier l'état de synchronisation temporelle | `chronyc sources` |

> Conseil : Ce document est écrit basé sur la dernière version de RustFS. Veuillez effectuer une sauvegarde complète des données avant les opérations d'extension. Pour l'environnement de production, il est recommandé de contacter les ingénieurs de support technique RustFS pour l'évaluation du plan.

