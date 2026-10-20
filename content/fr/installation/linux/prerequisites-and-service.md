---
title: "Prérequis Linux et configuration du service"
description: "Cette page décrit les prérequis communs, la préparation des disques, l’installation du binaire et la configuration du service systemd partagés par tous les modes de déploiement Linux de RustFS."
---

Cette page regroupe les prérequis et la configuration du service communs aux trois modes de déploiement Linux — [SNSD](./single-node-single-disk.md), [SNMD](./single-node-multiple-disk.md) et [MNMD](./multiple-node-multiple-disk.md). Terminez d’abord ces étapes, puis revenez à la page de votre mode pour configurer le fichier d’environnement et démarrer le service.

## Version du système d’exploitation

Nous recommandons un noyau Linux 4.x ou ultérieur ; les versions 5.x et 6.x offrent un meilleur débit d’E/S et de meilleures performances réseau. Ubuntu 22.04 et RHEL 8.x conviennent tous deux à l’installation de RustFS.

## Pare-feu

Les systèmes Linux ont un pare-feu activé par défaut. Vérifiez son état avec :

```bash
systemctl status firewalld
```

Si l’état du pare-feu est « active », vous pouvez le désactiver :

```bash
systemctl stop firewalld
systemctl disable firewalld
```

Ou autorisez le port S3 de RustFS (9000) et le port de la Console (9001) :

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --zone=public --add-port=9001/tcp --permanent
firewall-cmd --reload
```

Tous les serveurs RustFS d’un déploiement **doivent** utiliser le même port d’écoute. Si vous utilisez le port 9000, chaque autre serveur doit aussi utiliser le port 9000.

## Exigences de mémoire

RustFS exige au moins 2 Go de mémoire pour un environnement de test ; un environnement de production exige au minimum 128 Go.

## Synchronisation de l’heure

Tous les nœuds d’un déploiement distribué RustFS **doivent** maintenir des horloges synchronisées. RustFS s’appuie sur les horodatages pour la signature des requêtes, la gestion des versions des objets, le verrouillage distribué et la réplication. Une dérive significative de l’horloge entre les nœuds peut provoquer :

- **Échecs de signature de requête** — La vérification des signatures S3 dépend d’horodatages précis.
- **Problèmes de réplication et de cohérence** — Un décalage d’horloge peut entraîner des versions d’objets obsolètes ou conflictuelles.
- **Problèmes de contention de verrouillage** — Les verrous distribués utilisent des horodatages pour l’expiration des baux.
- **Échecs de démarrage du service** — RustFS refuse de démarrer si le décalage d’horloge entre les nœuds dépasse les seuils de sécurité.

:::warning

La dérive d’horloge entre deux nœuds ne doit pas dépasser **15 minutes**. Pour les environnements de production, nous recommandons de maintenir la dérive en dessous d'**1 seconde**.

:::

### Outils NTP recommandés

Utilisez l’un des services de synchronisation temporelle suivants sur **chaque nœud**. Choisissez un outil et configurez-le de manière cohérente sur l’ensemble du déploiement.

#### chrony (recommandé)

`chrony` est l’implémentation NTP préférée pour les distributions Linux modernes. Il synchronise plus rapidement et gère mieux la connectivité réseau intermittente que l’ancien `ntpd`.

Installez chrony :

```bash
# RHEL / CentOS / Rocky Linux
sudo dnf install chrony -y

# Ubuntu / Debian
sudo apt install chrony -y
```

Modifiez le fichier de configuration `/etc/chrony.conf` (RHEL) ou `/etc/chrony/chrony.conf` (Debian/Ubuntu) pour pointer vers vos serveurs NTP préférés :

```ini
server time1.google.com iburst
server time2.google.com iburst
server time3.google.com iburst
server time4.google.com iburst
```

> Remplacez les adresses serveur par les serveurs NTP internes de votre organisation, si disponibles. L’option `iburst` accélère la synchronisation initiale.

Activez et démarrez le service :

```bash
sudo systemctl enable chronyd
sudo systemctl start chronyd
```

#### systemd-timesyncd

`systemd-timesyncd` est un client SNTP léger intégré aux distributions basées sur systemd. Il convient aux environnements où un démon NTP complet n’est pas nécessaire.

Modifiez `/etc/systemd/timesyncd.conf` pour configurer les serveurs NTP :

```ini
[Time]
NTP=time1.google.com time2.google.com time3.google.com time4.google.com
FallbackNTP=0.pool.ntp.org 1.pool.ntp.org
```

Activez et démarrez le service :

```bash
sudo timedatectl set-ntp true
sudo systemctl enable systemd-timesyncd
sudo systemctl start systemd-timesyncd
```

#### ntpd (ancien)

Le classique `ntpd` de l’implémentation de référence NTP est toujours largement disponible. Utilisez `chrony` à la place, sauf si votre environnement nécessite spécifiquement `ntpd`.

```bash
# RHEL / CentOS / Rocky Linux
sudo dnf install ntp -y

# Ubuntu / Debian
sudo apt install ntp -y
```

Modifiez `/etc/ntp.conf` pour définir vos serveurs NTP, puis activez et démarrez :

```bash
sudo systemctl enable ntpd
sudo systemctl start ntpd
```

### Vérification de la synchronisation temporelle

Après avoir configuré le service NTP, vérifiez l’état de la synchronisation sur chaque nœud.

Vérifiez l’état de l’horloge système :

```bash
timedatectl status
```

La sortie doit afficher `System clock synchronized: yes` et `NTP service: active`.

Pour `chrony`, utilisez la commande suivante pour un état détaillé de la synchronisation :

```bash
chronyc tracking
```

Champs clés à vérifier :

- **Leap status** — Doit être `Normal` (pas `Not synchronised`).
- **System time** — Le décalage par rapport au serveur de référence. Doit être proche de `0.000000000 seconds`.
- **Root delay** — Temps aller-retour vers le serveur de référence.

Listez les sources NTP actuelles et leur état :

```bash
chronyc sources -v
```

Colonnes à surveiller :

- **`*`** — La source de synchronisation actuellement sélectionnée.
- **`+`** — Autres sources acceptables.
- **`-`** — Sources rejetées par l’algorithme de sélection.
- **`?`** — Sources dont la connectivité est incertaine.

Pour `ntpd` :

```bash
ntpq -p
```

### Vérification de la cohérence inter-nœuds

Après la synchronisation de tous les nœuds, vérifiez que les horloges sont cohérentes dans tout le cluster. Comparez les horodatages sur chaque nœud :

```bash
# Run on each node and compare the output
date -u '+%Y-%m-%d %H:%M:%S'
```

Pour une comparaison plus précise, installez `sshpass` et exécutez :

```bash
for host in node1 node2 node3 node4; do
  echo -n "$host: "
  ssh "$host" date -u '+%Y-%m-%d %H:%M:%S.%N'
done
```

Dans un environnement correctement configuré, la différence entre deux nœuds doit être négligeable (inférieure à 1 milliseconde).

## Planification de la capacité

Pour planifier la capacité de stockage objet, nous recommandons de prendre en compte :

- Volume initial : quelle quantité de données prévoyez-vous de migrer ou de stocker en une fois ? (par exemple, 500 To)
- Croissance : capacité de croissance quotidienne, hebdomadaire ou mensuelle
- Horizon : combien de temps cette planification matérielle doit-elle couvrir ? (recommandation : 3 ans)
- Cycles de renouvellement matériel de votre organisation.

Consultez la [configuration EC](../requirement/ec-configuration.md) pour calculer la capacité utile, comprendre les valeurs de parité automatiques et valider toute parité explicite ou largeur d’ensemble d’effacement avant le déploiement.

## Planification des disques

NFS produit des écritures fantômes et des problèmes de verrouillage sous forte charge d’E/S. **NFS est interdit** comme support de stockage sous-jacent pour RustFS. Nous recommandons vivement le mode **JBOD (Just a Bunch of Disks)** : exposez les disques physiques directement et individuellement au système d’exploitation, et laissez la couche logicielle RustFS assurer la redondance et la protection des données.

Les raisons sont les suivantes :

- **Performances.** Le moteur de codage d’effacement de RustFS est fortement optimisé et lit ou écrit plusieurs disques en parallèle, avec un débit supérieur à celui des contrôleurs RAID matériels. Le RAID matériel devient un goulet d’étranglement.
- **Coût.** Aucune carte RAID coûteuse n’est nécessaire, ce qui réduit le coût d’acquisition.
- **Exploitation.** RustFS gère les disques de façon uniforme, ce qui simplifie l’exploitation de la couche de stockage.
- **Reprise après incident.** Le processus de réparation des données (healing) de RustFS est plus rapide qu’une reconstruction RAID classique et affecte moins les performances du cluster.

Nous recommandons des SSD NVMe comme support de stockage, pour de meilleures performances et un meilleur débit.

## Choix du système de fichiers

Nous recommandons vivement de formater tous les disques de stockage en XFS. Le développement et les tests de RustFS s’appuient sur XFS, ce qui assure les meilleures performances et la meilleure stabilité. Évitez les autres systèmes de fichiers tels que ext4, BTRFS ou ZFS : ils peuvent dégrader les performances ou provoquer des comportements imprévisibles.

XFS convient à la charge de RustFS pour trois raisons :

- **E/S fortement concurrentes.** XFS a été conçu pour la performance et le passage à l’échelle. Sa journalisation et ses structures internes (notamment les arbres B+) traitent efficacement un grand nombre de lectures et d’écritures parallèles, ce qui correspond à la façon dont RustFS découpe les objets volumineux et lit ou écrit plusieurs disques d’un ensemble d’effacement en parallèle.
- **Fichiers très nombreux et très volumineux.** XFS est un système de fichiers 64 bits qui prend en charge des fichiers extrêmement volumineux (jusqu’à 8 Eo). Sa gestion des métadonnées reste efficace même avec des millions de fichiers dans un seul répertoire, ce qui compte parce que RustFS stocke chaque objet (ou version d’objet) comme un fichier indépendant sur le disque.
- **Réservation d’espace.** XFS fournit une API `fallocate` efficace. RustFS l’utilise pour réserver un espace disque contigu avant d’écrire les objets, ce qui évite le coût de l’extension dynamique et des mises à jour de métadonnées pendant l’écriture, et limite la fragmentation.

Pour faciliter l’identification et le montage des disques, nous recommandons d’attribuer une étiquette de système de fichiers (`-L`) lors du formatage de chaque disque.

Vérifiez d’abord la disposition des disques :

```bash
sudo lsblk

NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    0 465.7G  0 disk
├─sda1        8:1    0   512M  0 part /boot/efi
└─sda2        8:2    0 465.2G  0 part /
nvme0n1           8:16   0   3.7T  0 disk  <-- if this is our format new disk
nvme1n1           8:32   0   3.7T  0 disk  <-- if this is our format new disk
nvme2n1          8:48   0   3.7T   0  disk
```

Formatez chaque disque de données :

```bash
sudo mkfs.xfs  -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

Options de formatage :

- `-L <label>` : définit une étiquette de système de fichiers pour faciliter l’identification et le montage.
- `-i size=512` : nous recommandons une taille d’inode de 512 octets, utile lorsque vous stockez un grand nombre de petits objets (métadonnées).
- `-n ftype=1` : active ftype afin que le système de fichiers enregistre le type des fichiers dans les répertoires, ce qui accélère des opérations telles que readdir et unlink.

Montage :

```bash
# write new line
vim /etc/fstab
LABEL=RUSTFS0 /data/rustfs0   xfs   defaults,noatime,nodiratime   0   0

#save & exit

# mount disk
sudo mount -a
```

## Configurer l’utilisateur du service

Nous recommandons d’exécuter RustFS sous un utilisateur dédié, sans droit de connexion.

1. **Conserver le compte par défaut.** L’utilisateur et le groupe par défaut de l’unité de service sont `root` et `root` ; aucune modification n’est nécessaire si vous les conservez.
2. **Utiliser un compte dédié.** Créez un utilisateur et un groupe, puis mettez à jour l’unité de service en conséquence.

L’exemple suivant crée l’utilisateur et le groupe, puis leur accorde l’accès aux répertoires de données RustFS (facultatif) :

```bash
groupadd -r rustfs-user
useradd -M -r -g rustfs-user rustfs-user
chown rustfs-user:rustfs-user  /data/rustfs*
```

:::note

- Si vous avez créé l’utilisateur et le groupe rustfs-user, remplacez `User` et `Group` dans `/etc/systemd/system/rustfs.service` par `rustfs-user`.
- Adaptez `/data/rustfs*` à vos répertoires de montage réels.

:::

## Télécharger le paquet d’installation

Installez d’abord wget ou curl, puis téléchargez et installez le binaire RustFS :

```bash
# Download address
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip
unzip rustfs-linux-x86_64-musl-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

## Configurer le service systemd

1. Créez le fichier d’unité systemd

```bash
sudo tee /etc/systemd/system/rustfs.service <<EOF
[Unit]
Description=RustFS Object Storage Server
Documentation=https://rustfs.com/docs/
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
NotifyAccess=main
User=root
Group=root

WorkingDirectory=/usr/local
EnvironmentFile=-/etc/default/rustfs
ExecStart=/usr/local/bin/rustfs \$RUSTFS_VOLUMES

LimitNOFILE=1048576
LimitNPROC=32768
TasksMax=infinity

Restart=always
RestartSec=10s

OOMScoreAdjust=-1000
SendSIGKILL=no

TimeoutStartSec=120s
TimeoutStopSec=30s

NoNewPrivileges=true
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectClock=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictRealtime=true

# service log configuration
StandardOutput=append:/var/log/rustfs/rustfs.log
StandardError=append:/var/log/rustfs/rustfs-err.log

[Install]
WantedBy=multi-user.target
EOF
```

Le service lit `RUSTFS_VOLUMES` et les autres réglages dans `/etc/default/rustfs`, dont le contenu dépend du mode. La page de votre mode de déploiement indique le contenu exact.

2. Rechargez la configuration du service

```bash
sudo systemctl daemon-reload
```

## Étapes suivantes

Revenez à la page de votre mode de déploiement pour configurer le fichier d’environnement et démarrer le service :

- [Mode nœud unique, disque unique (SNSD)](./single-node-single-disk.md)
- [Mode nœud unique, disques multiples (SNMD)](./single-node-multiple-disk.md)
- [Mode nœuds multiples, disques multiples (MNMD)](./multiple-node-multiple-disk.md)
