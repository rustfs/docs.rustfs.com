---
title: "Installation Docker de RustFS"
description: "Déploiement Docker de RustFS."
---

# Installation Docker de RustFS

RustFS est un système de stockage d'objets distribué open source haute performance, 100% compatible S3. En mode de déploiement nœud unique disque unique (SNSD), le backend adopte zéro codage d'effacement de vérification, ne fournit pas de redondance de données supplémentaire, adapté aux tests locaux et aux scénarios à petite échelle.
Ce document est basé sur le package binaire Linux officiel RustFS, à travers un Dockerfile personnalisé, emballez RustFS et son environnement d'exécution dans un conteneur, et configurez les volumes de données et variables d'environnement pour lancer le service en un clic.

---

## I. Préparation préalable

1. **Exigences de l'hôte**

   * Docker installé (≥ 20.10) et capable de tirer des images et d'exécuter des conteneurs normalement
   * Chemin local `/mnt/rustfs/data` (ou chemin personnalisé) pour monter les données d'objets
2. **Réseau et pare-feu**

   * S'assurer que le port 9000 de l'hôte est ouvert vers l'extérieur (ou port personnalisé cohérent)
3. **Préparation du fichier de configuration**

   * Dans l'hôte `/etc/rustfs/config.toml`, définir le port d'écoute, compte administrateur, chemin des données, etc. (voir section quatre pour détails)

---

## II. Tirage rapide de l'image officielle RustFS

Utiliser l'image de base Ubuntu officielle, tirage rapide de l'image officielle RustFS :

```bash
docker pull quay.io/rustfs/rustfs
```

Ou utiliser docker pull :
```bash
docker pull rustfs/rustfs

```

---

## III. Écriture de la configuration d'environnement

Créer le fichier de configuration dans l'hôte `/etc/rustfs/config.toml`, contenu d'exemple :

```bash
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:7000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_ENDPOINT=""
RUSTFS_TLS_PATH="/opt/tls"
```

> **Explication :** Format des éléments de configuration et valeurs par défaut veuillez vous référer à la documentation officielle d'installation Linux.

---

## IV. Exécution du conteneur RustFS

Méthode d'exécution RustFS SNSD Docker, combinant l'image et la configuration ci-dessus, exécuter :

```bash
 docker run -d \
  --name rustfs_local \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest \
  /data
```

Explication des paramètres :

* `-p 9000:9000` : Mapper le port 9000 de l'hôte au conteneur
* `-v /mnt/rustfs/data:/data` : Monter le volume de données
* `--name rustfs_local` : Nom personnalisé du conteneur
* `-d` : Exécution en arrière-plan

---

### Exemple de configuration complète des paramètres

```bash
docker run -d \
  --name rustfs_container \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY=rustfsadmin \
  -e RUSTFS_SECRET_KEY=rustfsadmin \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_SERVER_DOMAINS=example.com \
  rustfs/rustfs:latest \
  --address :9000 \
  --console-enable \
  --server-domains example.com \
  --access-key rustfsadmin \
  --secret-key rustfsadmin \
  /data
```

### Explication des paramètres et méthodes correspondantes

1. **Méthode variables d'environnement** (recommandée) :
   ```bash
   -e RUSTFS_ADDRESS=:9000 \
   -e RUSTFS_SERVER_DOMAINS=example.com \
   -e RUSTFS_ACCESS_KEY=rustfsadmin \
   -e RUSTFS_SECRET_KEY=rustfsadmin \
   -e RUSTFS_CONSOLE_ENABLE=true \
   ```

2. **Méthode paramètres de ligne de commande** :
   ```
   --address :9000 \
   --server-domains example.com \
   --access-key rustfsadmin \
   --secret-key rustfsadmin \
   --console-enable \
   ```

3. **Paramètres requis** :
    - `<VOLUMES>` : Spécifié à la fin de la commande, comme `/data`

### Combinaisons de configuration communes

1. **Configuration de base** :
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     rustfs/rustfs:latest \
     /data
   ```

2. **Activer la console** :
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_CONSOLE_ENABLE=true \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --console-enable \
     /data
   ```

3. **Clés d'authentification personnalisées** :
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_ACCESS_KEY=rustfsadmin \
     -e RUSTFS_SECRET_KEY=rustfsadmin \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --access-key rustfsadmin \
     --secret-key rustfsadmin \
     /data
   ```

### Remarques importantes

1. Le mappage de port doit correspondre :
    - Port de service par défaut 9000 (`-p 9000:9000`)

2. Le volume de données doit être persistant :
    - `-v /host/path:/container/path`

3. Les variables d'environnement et paramètres de ligne de commande peuvent être utilisés de manière mixte, mais les paramètres de ligne de commande ont une priorité plus élevée

4. Si vous utilisez TLS, vous devez monter en plus le chemin du certificat :
   ```bash
   -v /path/to/certs:/certs \
   -e RUSTFS_TLS_PATH=/certs \
   ```

## V. Vérification et accès

1. **Voir l'état du conteneur et les journaux :**

   ```bash
   docker logs rustfs_local
   ```

   Les journaux doivent afficher le démarrage réussi du service et l'écoute sur le port 9000.

2. **Tester l'API S3 :**

   Utiliser `mc` ou autre client S3 :

   ```bash
   mc alias set rustfs http://localhost:9000 rustfsadmin ChangeMe123!
   mc mb rustfs/mybucket
   mc ls rustfs
   ```

   Si la création et la liste des buckets réussissent, le déploiement est effectif.

## VI. Autres suggestions

1. Recommandations pour l'environnement de production :
- Utiliser l'architecture de déploiement multi-nœuds
- Activer le chiffrement de communication TLS
- Configurer la stratégie de rotation des journaux
- Définir la stratégie de sauvegarde régulière

2. Suggestions de stockage :
- Utiliser le stockage SSD/NVMe local
- Éviter d'utiliser le système de fichiers réseau (NFS)
- Garantir l'accès exclusif au répertoire de stockage

---

## Résumé

Ce document combine les meilleures pratiques de conteneurisation RustFS nœud unique disque unique, démontrant en détail comment construire une image RustFS via Docker et déployer un environnement SNSD.
Cette solution est facile à démarrer rapidement et à expérimenter, et peut par la suite adopter la même approche sur des plateformes comme Kubernetes, Swarm pour étendre vers des clusters de production multi-nœuds multi-disques.

