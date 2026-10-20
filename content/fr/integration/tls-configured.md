---
title: "Configuration TLS"
description: "Activez TLS pour l’API S3 et la Console de RustFS sous Linux et Docker."
---

Configurez TLS pour un accès sécurisé. Définissez la variable d’environnement `RUSTFS_TLS_PATH`.

## Configuration

### Prérequis

- Une instance RustFS en cours d’exécution (voir le [guide d’installation](../installation/index.md)).
- Un certificat TLS et la clé privée correspondante.

**Remarque** : les certificats doivent être nommés `rustfs_cert.pem` et `rustfs_key.pem`, et placés dans le chemin indiqué.

### Linux

1. Modifiez le fichier de configuration de l’instance RustFS (par défaut `/etc/default/rustfs`) et ajoutez la variable d’environnement `RUSTFS_TLS_PATH`.

    ```bash
    # Edit RustFS instance configuration file
    sudo vi /etc/default/rustfs

    # Add RUSTFS_TLS_PATH environment variable
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**Remarque** : vous pouvez indiquer n’importe quel chemin pour `RUSTFS_TLS_PATH`, mais il doit contenir à la fois `rustfs_cert.pem` et `rustfs_key.pem`.

2. Redémarrez l’instance RustFS.

    ```bash
    systemctl restart rustfs
    ```

TLS s’applique alors aux deux écouteurs : l’API S3 à l’adresse `https://rustfs.example.com:9000` et la Console à l’adresse `https://rustfs.example.com:9001`.

### Docker

1. Montez le chemin des certificats avec `-v` et indiquez `RUSTFS_TLS_PATH` avec `-e`.

    ```bash
        docker pull rustfs/rustfs:latest
        docker run -d \
        --name rustfs \
        -e RUSTFS_TLS_PATH="/opt/tls/" \
        -v /opt/tls:/opt/tls \
        -p 9000:9000 \
        -p 9001:9001 \
        -v /data:/data \
        rustfs/rustfs:latest
    ```

2. Redémarrez le conteneur de l’instance RustFS, puis accédez à l’API S3 à l’adresse `https://rustfs.example.com:9000` et à la Console à l’adresse `https://rustfs.example.com:9001`.

:::note[Propriété des fichiers de certificat]

Le conteneur RustFS s’exécute par défaut sous l’utilisateur `rustfs` (UID `10001`). Assurez-vous que cet utilisateur est propriétaire de `rustfs_key.pem` et de `rustfs_cert.pem`. Sinon, RustFS ne peut pas lire les certificats et le démarrage de TLS échoue.

:::
