---
title: "Liste de contrôle logicielle"
description: "Cette page indique les exigences logicielles et les points à vérifier avant le déploiement."
---

Vérifiez que les exigences suivantes sont satisfaites avant le déploiement.

## Exigences du système d’exploitation

- **Système d’exploitation** : utilisez des versions LTS (Ubuntu 20.04 ou ultérieur, RHEL 8/9).
- **Noyau** : Linux 5.x ou ultérieur est recommandé.
- **Processeur et mémoire** : x86_64 ou ARM. Au minimum 2 Go de RAM pour les tests, et 64 Go ou plus en production.
- **Désactivez les services perturbateurs** : désactivez les services d’indexation de fichiers et d’audit (par exemple, `mlocate`, `auditd`, un antivirus) afin d’éviter les interférences d’E/S.

> **Pourquoi Linux 5.x ou ultérieur ?**
> Les noyaux LTS modernes apportent des E/S asynchrones éprouvées et des améliorations des systèmes de fichiers. RustFS propose aussi un chemin de lecture `io_uring` facultatif (`RUSTFS_IO_URING_READ_ENABLE`, désactivé par défaut), qui exige Linux 5.10 ou ultérieur pour être effectif.

## Déploiement du binaire

- **Téléchargement officiel** : ne téléchargez les binaires que depuis les canaux officiels de RustFS.
- **Vérification d’intégrité** : vérifiez les sommes de contrôle SHA256.
- **Cohérence** : assurez-vous que tous les nœuds exécutent la même version de RustFS.
- **Emplacement d’installation** : placez les binaires dans `/usr/local/bin` et assurez-vous qu’ils sont exécutables (`chmod +x`).

## Système de fichiers et disques

- **Disques de données dédiés** : utilisez des disques dédiés pour les données RustFS. Ne les partagez pas avec le système d’exploitation.
- **Système de fichiers** : utilisez XFS ou ext4 avec des options de montage orientées performances, telles que `noatime`.
- **Configuration des disques** : utilisez le JBOD (volumes indépendants). N’utilisez pas le RAID matériel.
- **Permissions** : assurez-vous que l’utilisateur RustFS dispose d’un accès en lecture et en écriture aux répertoires de données.

## Dépendances

- **Synchronisation de l’heure** : synchronisez l’heure de tous les nœuds avec `ntp` ou `chrony`.
- **Nom d’hôte et DNS** : configurez des noms d’hôte persistants et assurez une résolution DNS correcte.
- **Connectivité réseau** : assurez-vous que tous les nœuds peuvent communiquer sur le port RustFS (9000 par défaut).
- **TLS et certificats** : installez les certificats racine et préparez les certificats de serveur si vous utilisez HTTPS.
- **Paquets** : assurez-vous que les outils habituels (`bash`, `glibc`, `openssl`) sont installés.

## Utilisateur et sécurité

- **Utilisateur dédié** : exécutez RustFS sous un utilisateur dédié (par exemple, `rustfs-user`).
- **Permissions des fichiers** : restreignez l’accès aux binaires et aux fichiers de configuration.
- **SELinux/AppArmor** : configurez des politiques qui autorisent les opérations RustFS, ou désactivez SELinux ou AppArmor si c’est approprié.
- **systemd** : configurez correctement le fichier de service systemd (`User=`, `ExecStart=`, variables d’environnement).

## Autres points

- **Supervision** : configurez Prometheus et Grafana.
- **Plan de retour arrière** : préparez des sauvegardes de la configuration et un plan de retour arrière.
