---
title: "Console"
description: "Activez la Console RustFS, connectez-la à un serveur et connectez-vous de façon sûre."
---

La **Console RustFS** est l’interface d’administration web de RustFS. Utilisez cette page pour activer la Console, ouvrir la page de connexion et choisir la méthode de connexion adaptée. Les procédures détaillées sur les compartiments (buckets), les objets et la gestion des identités sont décrites dans les sections de documentation correspondantes.

## Activer la Console

La Console est activée par défaut et écoute sur le port `9001`, séparément de l’API S3 sur le port `9000`. Vous pouvez fixer explicitement ce comportement avec les variables d’environnement suivantes :

```ini title="/etc/default/rustfs"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ADDRESS=":9001"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"
```

Redémarrez RustFS après avoir modifié ces valeurs. Définissez `RUSTFS_CONSOLE_ENABLE=false` lorsque la Console ne doit pas s’exécuter.

Les options de ligne de commande équivalentes sont `--console-enable` et `--console-address`. Consultez la [référence de la CLI](/fr/reference/cli) et la [référence des variables d’environnement](/fr/reference/environment-variables) pour la configuration complète du serveur.

## Ouvrir la Console

Ouvrez l’adresse suivante, en remplaçant `<server-ip>` par l’adresse du serveur RustFS :

```text
http://<server-ip>:9001
```

![page de connexion de la Console RustFS, avec les options de connexion par clé, STS et OIDC](./images/rustfs-console-login.png)

Pour un déploiement local, y compris les lanceurs de bureau Windows et macOS, ouvrez `http://localhost:9001`. L’API S3 écoute sur le port `9000`.

Si la page de connexion ne peut pas joindre le service RustFS cible, sélectionnez **Server Configuration** ou ouvrez `/config`. Saisissez l’adresse du service RustFS accessible depuis l’extérieur et enregistrez-la une fois le contrôle d’intégrité réussi. **Reset** efface l’adresse enregistrée ; **Skip** revient à la connexion sans la modifier.

## Connexion

Les méthodes de connexion affichées dépendent de la configuration du déploiement :

- **Key Login** utilise la clé d’accès et la clé secrète configurées pour le déploiement RustFS. C’est la méthode de connexion habituelle d’un administrateur local.
- **STS Login** utilise des identifiants temporaires du Security Token Service (STS). Ne l’utilisez que si votre flux d’identité a émis un jeton de session valide.
- **OIDC Login** apparaît lorsqu’un fournisseur OpenID Connect (OIDC) est configuré. Sélectionnez le fournisseur et terminez l’authentification auprès du fournisseur d’identité.

Après la connexion, la Console ouvre la première page à laquelle votre compte peut accéder. Les menus et les actions varient selon la politique du compte et les capacités de plateforme activées ; un menu absent n’indique pas nécessairement une erreur de la Console.

Si la connexion échoue, vérifiez la méthode de connexion choisie, les identifiants, l’adresse du serveur cible et l’état du compte avant de réessayer.

:::warning[N’exposez pas les identifiants par défaut]

RustFS revient à `rustfsadmin` / `rustfsadmin` lorsque aucun identifiant personnalisé n’est configuré. N’utilisez ces valeurs par défaut que pour un test local jetable. Configurez une clé d’accès unique et une clé secrète robuste avant de rendre la Console accessible à d’autres utilisateurs.

:::

## Notes d’exploitation

- Utilisez [TLS](/fr/integration/tls-configured) avant d’exposer la Console en dehors d’un réseau de confiance.
- Restreignez l’accès réseau à l’écouteur de la Console et ne configurez [CORS pour la Console](/fr/administration/cors) que lorsque l’accès inter-origines est requis.
- La session de la Console hérite des autorisations de l’identité connectée. Utilisez un compte à moindre privilège pour le travail courant.
- La déconnexion, ou l’expiration de la session, vous ramène à la page de connexion. Ne stockez pas les identifiants d’administrateur dans des navigateurs partagés.

## Flux de gestion

- [Créer et gérer des compartiments](/fr/administration/data/bucket/creation)
- [Charger et gérer des objets](/fr/administration/data/object/creation)
- [Gérer les clés d’accès](/fr/security-compliance/iam/access-token)
- [Configurer la gestion des identités et des accès](/fr/security-compliance/iam)

## Étapes suivantes

Consultez la [liste de contrôle de sécurité](/fr/installation/requirement/checklists/security-checklists) avant d’exposer la Console en dehors d’un réseau de confiance. Pour une connexion fondée sur OIDC, poursuivez avec le [guide de configuration OIDC](/fr/security-compliance/oidc).
