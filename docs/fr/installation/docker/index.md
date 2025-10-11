---
title: "Installation Docker de RustFS"
description: "Déploiement Docker RustFS."
---

# Installation Docker de RustFS

RustFS est un système de stockage d'objets distribué open source haute performance, 100% compatible S3. En mode de déploiement noeud unique disque unique (SNSD), le backend adopte un codage d'effacement zéro, ne fournit pas de redondance de données supplémentaire, adapté aux tests locaux et aux scénarios à petite échelle.
Cet article est basé sur le package binaire Linux officiel de RustFS, à travers un Dockerfile personnalisé, empaquette RustFS et son environnement d'exécution dans des conteneurs, et configure des volumes de données et des variables d'environnement, permettant de démarrer le service en un clic.

---

## I. Préparation préalable

1. **Exigences de l'hôte**

 * Docker (≥ 20.10) installé et capable de tirer des images et d'exécuter des conteneurs normalement
 * Chemin local `/mnt/rustfs/data` (ou chemin personnalisé) pour monter les données d'objets
2. **Réseau et pare-feu**

 * Assurez-vous que le port 9000 de l'hôte est ouvert vers l'extérieur (ou cohérent avec le port personnalisé)
3. **Préparation du fichier de configuration**

 * Dans l'hôte `/etc/rustfs/config.toml`, définissez le port d'écoute, le compte administrateur, le chemin des données, etc. (voir section 4)

---

## II. Tirer rapidement l'image officielle RustFS

Utilisez l'image de base Ubuntu officielle pour tirer rapidement l'image officielle RustFS :


```bash
docker pull rustfs/rustfs

```


---

## III. Exécuter le conteneur RustFS

Méthode d'exécution Docker SNSD RustFS, combinée avec l'image et la configuration ci-dessus, exécuter :

```bash
 docker run -d \
  --name rustfs_local \
  -p 9000:9000 \
  -p 9001:9001 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest \
  /data
```

Explication des paramètres :

* `-p 9000:9000` : Mapper le port 9000 de l'hôte vers le conteneur
* `-v /mnt/rustfs/data:/data` : Monter le volume de données
* `--name rustfs_local` : Nom personnalisé du conteneur
* `-d` : Exécution en arrière-plan

---

### Exemple de configuration de paramètres complets

```bash
docker run -d \
  --name rustfs_container \
  -p 9000:9000 \
  -p 9001:9001 \
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

1. **Méthode des variables d'environnement** (recommandée) :
   ```bash
   -e RUSTFS_ADDRESS=:9000 \
   -e RUSTFS_SERVER_DOMAINS=example.com \
   -e RUSTFS_ACCESS_KEY=rustfsadmin \
   -e RUSTFS_SECRET_KEY=rustfsadmin \
   -e RUSTFS_CONSOLE_ENABLE=true \
   ```

2. **Méthode des paramètres de ligne de commande** :
   ```
   --address :9000 \
   --server-domains example.com \
   --access-key rustfsadmin \
   --secret-key rustfsadmin \
   --console-enable \
   ```

3. **Paramètres requis** :
    - `<VOLUMES>` : Spécifier à la fin de la commande, comme `/data`

### Combinaisons de configuration courantes

1. **Configuration de base** :
   ```bash
   docker run -d \
     -p 9000:9000 \
     -p 9001:9001 \
     -v /mnt/data:/data \
     rustfs/rustfs:latest \
     /data
   ```

2. **Activer la console** :
   ```bash
   docker run -d \
     -p 9000:9000 \
     -p 9001:9001 \
     -v /mnt/data:/data \
     -e RUSTFS_CONSOLE_ENABLE=true \
     rustfs/rustfs:latest \
     /data
   ```

3. **Clés d'authentification personnalisées** :
   ```bash
   docker run -d \
     -p 9000:9000 \
     -p 9001:9001 \
     -v /mnt/data:/data \
     -e RUSTFS_ACCESS_KEY=rustfsadmin \
     -e RUSTFS_SECRET_KEY=rustfsadmin \
     rustfs/rustfs:latest \
     --access-key rustfsadmin \
     --secret-key rustfsadmin \
     /data
   ```

### Points d'attention

1. Le mappage des ports doit correspondre :
    - Port de service par défaut 9000 (`-p 9000:9000`)

2. Le volume de données doit être persistant :
    - `-v /host/path:/container/path`

3. Les variables d'environnement et les paramètres de ligne de commande peuvent être utilisés de manière mixte, mais les paramètres de ligne de commande ont une priorité plus élevée

4. Si [utilisation de TLS](../../integration/tls-configured.md), il faut monter supplémentairement le chemin du certificat :

   ```bash
   -v /path/to/certs:/certs \
   -e RUSTFS_TLS_PATH=/certs \
   ```

## IV. Vérification et accès

1. **Voir l'état du conteneur et les journaux :**

 ```bash
 docker logs rustfs_local
 ```

 Les journaux devraient afficher un démarrage de service réussi et surveiller le port 9000.

2. **Tester l'API S3 :**

 Utilisez `mc` ou d'autres clients S3 :

 ```bash
 mc alias set rustfs http://localhost:9000 rustfsadmin ChangeMe123!
 mc mb rustfs/mybucket
 mc ls rustfs
 ```

 Si le bucket peut être créé et listé avec succès, alors le déploiement est effectif.


## V. Autres suggestions

1. Recommandations pour l'environnement de production :
- Utiliser une architecture de déploiement multi-noeud
- [Activer la communication chiffrée TLS](../../integration/tls-configured.md)
- Configurer une stratégie de rotation des journaux
- Définir une stratégie de sauvegarde régulière

2. Recommandations de stockage :
- Utiliser un stockage SSD/NVMe local
- Éviter d'utiliser un système de fichiers réseau (NFS)
- Garantir un accès exclusif au répertoire de stockage

---

## Résumé

Cet article combine les meilleures pratiques de conteneurisation RustFS noeud unique disque unique et démontre en détail comment construire soi-même des images RustFS via Docker et déployer un environnement SNSD.
Cette solution est facile pour un démarrage rapide et des expérimentations, et pourrait par la suite être étendue sur des plateformes comme Kubernetes, Swarm avec la même approche vers des clusters de production multi-noeud multi-disque.

