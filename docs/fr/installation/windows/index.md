---
title: "Installation de RustFS sur Windows"
description: "Démarrer RustFS en un clic sur Windows."
---

# Installation de RustFS sur Windows

## I. Préparatifs

Veuillez comprendre :

> Le **mode** de démarrage Windows ne prend en charge que le mode mono-machine mono-disque, plus adapté aux environnements de développement, débogage et test.


1. Pour une introduction détaillée du mode de démarrage Windows, veuillez vous référer aux [Modes de Démarrage](../linux/index.md#mode);

2. Téléchargez le package d'installation, modifiez les permissions et procédez au démarrage.


## II. Téléchargement

Rendez-vous sur la page de téléchargement officielle pour télécharger la dernière version du package d'installation RustFS.


## III. Modification des Permissions

Veuillez confirmer que ce programme a les permissions d'exécution pertinentes dans le système d'exploitation Windows.


## Double-cliquez sur l'Icône de Démarrage

1. Double-cliquez sur l'icône de démarrage ;

2. Cliquez sur configurer le disque ;

3. Cliquez sur "Start Service", le service RustFS démarre avec succès.


<img src="./images/windows-setup.jpg" alt="démarrage windows" />



## IV. Modification de la Configuration

Cliquez sur le bouton de modification en haut à droite (bouton en forme d'engrenage), vous pouvez modifier :

1. Le port par défaut du serveur ;

2. Le nom d'utilisateur et mot de passe de l'administrateur par défaut ;

3. Le répertoire de disque spécifié ;

<img src="./images/setting.jpg" alt="configuration RustFS windows" />



## V. Accès à la Console


Après un démarrage réussi, accédez à `http://127.0.0.1:7001` pour accéder à la console.

