---
title: "Mise à niveau du binaire"
description: "Mettez à niveau les déploiements binaires de RustFS un nœud à la fois, tout en préservant la disponibilité du cluster."
---

Utilisez une mise à niveau progressive pour remplacer l’exécutable RustFS sur chaque nœud sans mettre l’ensemble du cluster hors ligne. Avant de commencer, lisez les notes de la version cible et confirmez que chaque nœud est sain.

## Avant la mise à niveau

Vérifiez l’état de préparation sur chaque nœud :

```bash
curl -fsS http://<node-hostname>:9000/health/ready
```

Sauvegardez la configuration du service et conservez l’exécutable en cours d’exécution pour le retour arrière :

```bash
sudo cp /etc/default/rustfs /etc/default/rustfs.bak
sudo cp /usr/local/bin/rustfs /usr/local/bin/rustfs.previous
```

## Mettre à niveau chaque nœud

Mettez à niveau un nœud à la fois. Ne continuez pas tant que le nœud redémarré ne se déclare pas prêt.

```bash
sudo systemctl stop rustfs
sudo cp rustfs-new /usr/local/bin/rustfs
sudo chmod +x /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node-hostname>:9000/health/ready
```

Répétez la procédure pour chaque nœud restant.

## Revenir en arrière

Si la nouvelle version échoue à la validation, restaurez l’exécutable précédent un nœud à la fois et attendez l’état de préparation avant de continuer :

```bash
sudo systemctl stop rustfs
sudo cp /usr/local/bin/rustfs.previous /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node-hostname>:9000/health/ready
```

## Étapes suivantes

Consultez [Contrôle de l’état](/fr/operations/status-check) pour une validation supplémentaire après la mise à niveau.
