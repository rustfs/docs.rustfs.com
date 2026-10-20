---
title: "Pannes de nœud"
description: "Préparez un nœud de remplacement, mettez à jour sa configuration, rétablissez son appartenance au cluster et vérifiez la réparation des données."
---

Un cluster RustFS distribué utilise le codage d’effacement pour rester lisible et inscriptible lorsque certains nœuds tombent en panne, et il répare les données automatiquement lorsqu’un nœud rejoint de nouveau le cluster. Ce guide détaille les étapes suivantes :

1. Démarrez le nœud de remplacement et alignez son environnement logiciel sur celui du cluster.
2. Mettez à jour le DNS ou `/etc/hosts` afin que l’ancien nom d’hôte soit résolu vers le nouveau nœud.
3. Installez la même version de RustFS que sur les autres nœuds.
4. Démarrez les nœuds de remplacement afin qu’ils rejoignent le cluster et commencent la réparation des données.
5. Surveillez la progression de la réparation, puis effectuez les vérifications de suivi.

## 1. Préparez le nœud de remplacement

* **Préparation du matériel et du système**
  Assurez-vous que le matériel du nœud de remplacement (processeur, mémoire, réseau et type de disque) correspond à peu près à celui du nœud défaillant. Un matériel de gamme supérieure n’affecte pas les performances du cluster.
  Utilisez des versions logicielles identiques à celles des autres nœuds, y compris le système d’exploitation, le noyau et les dépendances, afin d’éviter les problèmes causés par des environnements incohérents.

* **Accès exclusif aux disques**
  Comme pour les opérations sur les disques physiques, RustFS exige un accès exclusif à ses volumes de stockage. Ne laissez pas d’autres processus ou scripts modifier directement les données de ces volumes, car cela peut corrompre les données ou réduire la redondance.

## 2. Mettez à jour le nom d’hôte et la résolution réseau

* **Configuration du DNS et du fichier hosts**
  Si l’adresse IP du nœud de remplacement diffère de celle du nœud défaillant, faites pointer le nom d’hôte de l’ancien nœud (par exemple, `rustfs-node-2.example.net`) vers l’adresse IP du nouveau nœud, afin que les nœuds du cluster puissent toujours se joindre sous le même nom.

 ```bash
 # Example: Add or modify line in /etc/hosts
 192.168.1.12 rustfs-node-2.example.net
 ```

  Utilisez `ping` ou `nslookup` pour vérifier que le nom d’hôte est résolu vers le nouveau nœud.

## 3. Déployez et configurez les services RustFS

* **Téléchargement et installation**
  Installez la même version de RustFS que sur les nœuds existants, avec la même méthode d’installation et le même répertoire. Assurez-vous que les scripts de démarrage, les variables d’environnement et les fichiers de configuration (comme `/etc/default/rustfs`) sont identiques à ceux des autres nœuds.

* **Vérification de la configuration**

 * Vérifiez que `RUSTFS_VOLUMES` dans `/etc/default/rustfs` est identique, octet pour octet, à la valeur des autres nœuds, et qu’il couvre le nom d’hôte et le port du nœud de remplacement.
 * Assurez-vous que tous les nœuds utilisent les mêmes clés d’accès et les mêmes réglages de permissions ; sinon, le nouveau nœud échoue à l’authentification et ne peut pas rejoindre le cluster.

## 4. Réintégrez le cluster et déclenchez la réparation des données

* **Démarrage du service**

 ```bash
 systemctl start rustfs
 ```

  Vous pouvez aussi démarrer RustFS avec votre propre script de démarrage. Exécutez ensuite `journalctl -u rustfs -f` pour confirmer que le nouveau nœud a détecté les autres nœuds et a démarré la réparation.

* **Surveillance de l’état de la réparation**
  La réparation s’exécute en arrière-plan dès que le nœud rejoint le cluster ; aucune commande manuelle n’est requise. Suivez sa progression dans les journaux du service sur le nœud de remplacement, et vérifiez l’état des nœuds et des disques dans la Console RustFS :

 ```bash
 journalctl -u rustfs -f
 ```

* **Observations de la communauté**
  Lors des tests menés par la communauté, lorsqu’un nœud se déconnecte puis rejoint le cluster, RustFS ne répare que ce nœud, au lieu de rééquilibrer l’ensemble du cluster. Cela évite des pics inutiles de réseau et d’E/S.

## 5. Vérifications de suivi et bonnes pratiques

* **Surveillance et alertes**

 * Pendant la réparation, surveillez la charge des disques et du réseau afin de vous assurer que le cluster respecte encore ses exigences de lecture, d’écriture et de bande passante.
 * Configurez des alertes pour prévenir les équipes d’exploitation lorsque la réparation d’un nœud échoue ou lorsque la progression reste bloquée au-delà des seuils.

* **Tests de panne réguliers**
  Organisez régulièrement des exercices de panne de nœud et exercez-vous à l’ensemble de la procédure de reprise, afin que votre équipe connaisse les commandes et le processus de réponse aux incidents.

* **Analyse des causes racines**
  Exécutez des diagnostics matériels détaillés (par exemple, les données SMART et les journaux du BIOS) sur les nœuds ou les disques qui tombent en panne de façon répétée, et mettez en place un plan de maintenance préventive.

* **Assistance professionnelle**
  Pour obtenir de l’aide afin de diagnostiquer la cause d’une panne ou de rétablir le cluster, contactez l’équipe de développement ou la communauté RustFS.

---

Ces étapes remplacent un nœud défaillant et réparent ses données. Adaptez les commandes à votre environnement, et conservez une configuration identique sur tous les nœuds.
