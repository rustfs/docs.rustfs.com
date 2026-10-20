---
title: "Installer RustFS sur macOS"
description: "Installez une instance RustFS locale sur macOS avec RustFS Launcher ou le binaire serveur autonome."
---

Ce guide présente deux façons d’exécuter **RustFS** sur macOS : utiliser **RustFS Launcher** graphique, ou exécuter le binaire serveur autonome depuis Terminal. Les deux méthodes créent une instance locale à nœud unique, adaptée à l’évaluation, au développement et aux tests.

:::note[Périmètre du déploiement]

Ces procédures exécutent RustFS comme un processus de bureau, et non comme un service d’arrière-plan macOS. Pour un déploiement de production ou distribué, utilisez les [guides d’installation Linux](/fr/installation/linux).

:::

## 1. Vérifier l’architecture du Mac

RustFS fournit des binaires distincts pour les Mac Apple silicon (`arm64`) et Intel (`x86_64`). Ouvrez Terminal et exécutez :

```bash
uname -m
```

Utilisez le résultat pour choisir le paquet approprié :

| Résultat | Type de Mac | Disponibilité actuelle du binaire autonome |
| --- | --- | --- |
| `arm64` | Apple Silicon | Téléchargez le paquet macOS AArch64 depuis les versions actuelles de RustFS. |
| `x86_64` | Intel | Les versions de RustFS postérieures à `v1.0.0-beta.9` ne fournissent pas de paquet macOS Intel précompilé. Compilez la version actuelle à partir du code source. |

:::warning[Limite de publication pour les Mac Intel]

N’exécutez pas le binaire Apple Silicon sur un Mac Intel. Si vous avez besoin d’une version de RustFS plus récente que `v1.0.0-beta.9` sur macOS Intel, suivez la procédure de compilation depuis les sources de ce guide. Un binaire beta.9 plus ancien ne contient ni les correctifs ni les fonctionnalités des versions ultérieures.

:::

Avant de continuer, vérifiez également que :

- Vous avez le droit d’installer ou d’exécuter des applications et d’écrire dans le répertoire de données choisi.
- Les ports TCP `9000` et `9001` sont disponibles, ou vous avez choisi deux autres ports libres.
- Vous avez créé un répertoire de données dédié, par exemple `$HOME/rustfs/data`.

```bash
mkdir -p "$HOME/rustfs/data"
```

:::warning[Protégez le répertoire de données]

Utilisez un répertoire vide sur un disque disposant de suffisamment d’espace libre. Ne stockez pas de fichiers sans rapport dans ce répertoire, et ne modifiez pas les fichiers de données RustFS pendant que le serveur est en cours d’exécution.

:::

## 2. Choisir une méthode d’installation

| Méthode | Utilisez-la lorsque | Remarque sur l’architecture |
| --- | --- | --- |
| RustFS Launcher | Vous souhaitez une configuration graphique et une visionneuse de journaux intégrée. | Téléchargez un paquet Launcher correspondant à Apple Silicon ou à Intel. |
| Binaire autonome | Vous souhaitez des commandes Terminal explicites ou des scripts. | Les versions actuelles fournissent des binaires Apple Silicon. Les utilisateurs Intel compilent les versions postérieures à beta.9 à partir du code source. |

## Installer avec RustFS Launcher

### 3. Télécharger et installer Launcher

1. Ouvrez la [page des versions de RustFS Launcher](https://github.com/rustfs/launcher/releases).
2. Sélectionnez la dernière version et développez **Assets** (fichiers de la version).
3. Téléchargez l’installateur macOS correspondant à votre architecture : AArch64 pour Apple Silicon, ou x86-64 pour Intel. Ne téléchargez **Source code** (code source) que si vous comptez compiler Launcher vous-même.
4. Ouvrez l’image disque téléchargée et déplacez **RustFS Launcher** vers **Applications** (dossier Applications).
5. Ouvrez **RustFS Launcher** depuis **Applications**.

Si macOS bloque le premier lancement, confirmez que le paquet provient de la page officielle des versions de `rustfs/launcher`. Ouvrez ensuite **System Settings > Privacy & Security** (Réglages Système > Confidentialité et sécurité) et autorisez cette application précise. Ne désactivez pas Gatekeeper globalement.

### 4. Configurer Launcher

Configurez les champs de la fenêtre Launcher :

| Section | Champ | Valeur recommandée | Description |
| --- | --- | --- | --- |
| Dataset Mount | Data Path | `$HOME/rustfs/data` | Répertoire existant dans lequel RustFS stocke les données d’objets. |
| Ports & Access | API Port | `9000` | Port de l’API compatible avec S3. |
| Ports & Access | Host | `127.0.0.1` | Limite l’accès à ce Mac. |
| Ports & Access | Console Endpoint | Enabled | Active la Console web. Launcher la désactive par défaut. |
| Ports & Access | Console Port | `9001` | Port de la Console, qui doit être différent du port de l’API. |
| Credentials | Access Key | `<your-access-key>` | Clé d’accès d’administrateur pour cette instance. |
| Credentials | Secret Key | `<your-secret-key>` | Clé secrète d’administrateur pour cette instance. |

Utilisez **Browse** (Parcourir) pour sélectionner le répertoire de données, ou faites-le glisser dans Launcher. Launcher exige que le répertoire existe avant le démarrage. Le sélecteur de fichiers macOS affiche le chemin développé, et non la variable littérale `$HOME`.

Remplacez les identifiants indicatifs par vos propres valeurs. Launcher affiche d’abord les identifiants par défaut d’un test local. Ne les conservez pas sur un Mac accessible à d’autres utilisateurs.

:::warning[Exposition réseau]

Laissez **Host** défini sur `127.0.0.1`, sauf si un autre ordinateur doit se connecter à RustFS. Une adresse autre que l’adresse de bouclage expose l’API et la Console sur les interfaces réseau correspondantes. Configurez le pare-feu macOS et des identifiants robustes avant d’autoriser un accès distant.

:::

### 5. Démarrer et vérifier RustFS

1. Sélectionnez **Launch RustFS** (démarrer RustFS).
2. Attendez que Launcher indique que le point de terminaison configuré est en ligne.
3. Ouvrez `http://localhost:9001` et connectez-vous avec la clé d’accès et la clé secrète que vous avez configurées.
4. Utilisez `http://localhost:9000` comme point de terminaison pour les clients compatibles avec S3.

![RustFS Launcher indiquant le service en ligne, avec le port API 9000, le port Console 9001 et des journaux de démarrage réussis](../windows/images/windows-rustfs-launcher.jpg)

Si vous avez modifié l’hôte ou les ports, utilisez ces valeurs. L’URL de la Console n’est disponible que lorsque **Console Endpoint** est activé.

Launcher verrouille sa configuration tant qu’il gère un processus en cours d’exécution. Il crée aussi un répertoire `logs` à côté du répertoire de données. Par exemple, si vous sélectionnez `$HOME/rustfs/data`, les fichiers journaux du serveur se trouvent sous `$HOME/rustfs/logs`.

### 6. Arrêter ou quitter Launcher

Sélectionnez **Stop RustFS** (arrêter RustFS) avant de modifier la configuration, de déconnecter un disque de données externe ou d’éteindre macOS.

Fermer la fenêtre de Launcher la masque dans la barre de menus. Cela n’arrête pas RustFS. Pour arrêter le processus géré et quitter Launcher, ouvrez l’icône de la barre de menus de Launcher et sélectionnez **Quit** (quitter). Sélectionnez **Show** (afficher), ou sélectionnez l’icône, pour restaurer la fenêtre.

## Installer le binaire autonome

### 7. Télécharger le binaire Apple Silicon

Utilisez cette procédure lorsque `uname -m` renvoie `arm64` :

1. Ouvrez la [page des versions de RustFS](https://github.com/rustfs/rustfs/releases).
2. Sélectionnez la version requise et téléchargez l’archive ZIP macOS AArch64 depuis **Assets**. Le nom du fichier commence par `rustfs-macos-aarch64`.
3. Créez un répertoire de programme et extrayez l’archive. Remplacez `<version>` par la version figurant dans le nom du fichier téléchargé :

```bash
mkdir -p "$HOME/rustfs/bin"
unzip "$HOME/Downloads/rustfs-macos-aarch64-<version>.zip" -d "$HOME/rustfs/bin"
chmod +x "$HOME/rustfs/bin/rustfs"
"$HOME/rustfs/bin/rustfs" --help
```

Si l’archive contient un nom de binaire propre à la plateforme plutôt que `rustfs`, utilisez ce nom de fichier dans les commandes suivantes, ou renommez-le en `$HOME/rustfs/bin/rustfs`.

### 8. Compiler le binaire Intel à partir du code source

Utilisez cette procédure lorsque `uname -m` renvoie `x86_64` et que vous avez besoin d’une version plus récente que `v1.0.0-beta.9`.

1. Installez les outils de ligne de commande Xcode :

```bash
xcode-select --install
```

2. Installez la chaîne d’outils Rust stable actuelle depuis [rustup.rs](https://rustup.rs/), puis ouvrez une nouvelle session Terminal.
3. Clonez RustFS et extrayez la version dont vous avez besoin :

```bash
git clone https://github.com/rustfs/rustfs.git
cd rustfs
git checkout <release-tag>
```

4. Compilez la cible macOS Intel avec le script de compilation du dépôt :

```bash
./build-rustfs.sh --platform x86_64-apple-darwin
```

Le script de compilation inclut les ressources de la Console par défaut et vérifie le binaire produit. Utilisez le binaire indiqué à la fin de la sortie de compilation à l’étape suivante.

:::note[Dépendances de la compilation depuis les sources]

Compiler depuis les sources exige les outils utilisés par la version RustFS choisie, en plus de Rust et des outils de ligne de commande Xcode. Si la compilation signale une dépendance manquante, suivez les exigences du fichier README du dépôt de cette version, plutôt que de substituer un binaire compilé pour Apple Silicon.

:::

### 9. Démarrer le serveur autonome

Définissez les identifiants pour la session Terminal en cours et affectez le chemin de votre binaire téléchargé ou compilé :

```bash
export RUSTFS_ACCESS_KEY="<your-access-key>"
export RUSTFS_SECRET_KEY="<your-secret-key>"
export RUSTFS_BIN="$HOME/rustfs/bin/rustfs"

"$RUSTFS_BIN" server \
	--address "127.0.0.1:9000" \
	--console-enable true \
	--console-address "127.0.0.1:9001" \
	"$HOME/rustfs/data"
```

Pour une compilation Intel depuis les sources, remplacez `RUSTFS_BIN` par le chemin du binaire affiché par `build-rustfs.sh`. Laissez la fenêtre Terminal ouverte pendant l’exécution de RustFS. Appuyez sur `Control+C` pour arrêter le serveur.

:::tip[Gestion des identifiants]

Les variables d’environnement de session évitent de placer les identifiants directement sur la ligne de commande. Pour un usage répété ou automatisé, préférez les variables d’environnement `RUSTFS_ACCESS_KEY_FILE` et `RUSTFS_SECRET_KEY_FILE`, et protégez ces fichiers avec les droits macOS.

:::

### 10. Vérifier le serveur autonome

Ouvrez `http://localhost:9001` et connectez-vous avec les identifiants configurés. Utilisez `http://localhost:9000` comme point de terminaison pour les clients compatibles avec S3. RustFS utilise par défaut l’adressage de type chemin (path-style) : configurez les clients en conséquence.

Pour une vérification de bout en bout, créez un compartiment (bucket) nommé `my-bucket`, chargez (upload) `hello.txt`, puis confirmez que l’objet apparaît dans le compartiment.

## Confirmer une installation réussie

Que vous ayez utilisé Launcher, un binaire Apple Silicon ou une compilation Intel depuis les sources, une connexion réussie à la Console ouvre la page **Buckets** (compartiments).

![Page Buckets de la Console RustFS après une connexion réussie](../windows/images/rustfs-console-login.png)

## Dépannage

### macOS bloque l’application ou le binaire

Vérifiez que le fichier provient de l’organisation GitHub officielle de RustFS. Pour Launcher, autorisez l’application précise sous **System Settings > Privacy & Security**. Pour un binaire autonome que macOS a mis en quarantaine, examinez l’avertissement et vérifiez la source du téléchargement avant de modifier ses attributs de sécurité.

### L’architecture du binaire ne correspond pas

Exécutez `uname -m` et inspectez le binaire :

```bash
uname -m
file "$RUSTFS_BIN"
```

Utilisez un binaire AArch64 sur Apple Silicon. Sur un Mac Intel, compilez les versions postérieures à `v1.0.0-beta.9` à partir du code source pour `x86_64-apple-darwin`.

### Le chemin de données est rejeté

Confirmez que le répertoire existe et que votre compte macOS dispose d’un accès en lecture et en écriture. Launcher ne crée pas pour vous le répertoire de données sélectionné.

### Le port de l’API ou de la Console est indisponible

Les ports doivent être des nombres de `1` à `65535`, doivent être différents l’un de l’autre et ne doivent pas être déjà utilisés. Inspectez les ports par défaut :

```bash
lsof -nP -iTCP:9000 -iTCP:9001 -sTCP:LISTEN
```

Arrêtez l’application en conflit ou choisissez des ports libres, puis redémarrez RustFS.

### La Console ne s’ouvre pas

Pour Launcher, confirmez que **Console Endpoint** est activé. Pour le binaire autonome, confirmez que le processus est toujours en cours d’exécution et que `--console-enable true` est présent.

### Launcher signale un processus RustFS externe

Un autre processus écoute sur l’adresse API configurée, mais Launcher ne l’a pas démarré. Arrêtez ce processus ou choisissez un autre port d’API. Launcher ne peut pas arrêter un processus qu’il ne gère pas.

### RustFS s’arrête après le lancement

Dans Launcher, examinez les onglets de l’application et de RustFS dans la visionneuse de journaux intégrée. Pour une installation autonome, examinez la sortie du Terminal. Les causes courantes sont un répertoire de données manquant, des droits insuffisants, une architecture qui ne correspond pas ou un conflit de port.

## Étapes suivantes

- Consultez le [guide de l’API S3](/fr/administration/protocols/s3) avant de connecter un client.
- Apprenez à [créer un compartiment](/fr/administration/data/bucket/creation).
- Consultez les [vérifications d’état](/fr/operations/status-check) pour d’autres méthodes de vérification.
- Utilisez les [guides d’installation Linux](/fr/installation/linux) pour un déploiement orienté production.
