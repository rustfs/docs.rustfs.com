# Guide de contribution à la documentation RustFS

Bienvenue dans la communauté RustFS ! Nous apprécions votre intérêt à contribuer à notre documentation. Votre contribution, qu'il s'agisse de corriger une faute de frappe ou de traduire un guide complet, est importante pour nous. Ce guide a pour objectif de vous fournir des instructions claires pour vous aider à participer sereinement à la co-construction de la documentation RustFS.



<p align="center">
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ZH.md">English </a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ZH.md">简体中文</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_JA.md">日本語</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_DA.md">(#deutsch)</a> |
 Français 
</p>

------




### Table des matières



1. (#1-quest-ce-que-rustfs-)
2. Notre mission : un stockage de données accessible et sécurisé pour tous
3. Votre parcours de contribution
   - Pour commencer : votre première contribution
   - (#32-traduire-la-documentation--ajouter-une-nouvelle-langue)
4. Le flux de travail technique
   - Prérequis
   - Configuration du développement local
   - (#43-directives-pour-les-pull-requests-pr-et-les-commits)
   - Vérifications automatisées et déploiement
5. Communauté et licence
   - (#51-remerciements)
   - Licence du contenu



### 1. Qu'est-ce que RustFS?



RustFS est une solution de stockage d'objets distribuée, simple et performante. Elle est 100 % compatible avec le protocole S3 et est publiée sous la licence Apache 2.0, ce qui en fait un logiciel open source adapté à un usage commercial.

Entièrement écrit en Rust – le langage de programmation moderne réputé pour sa sécurité mémoire et ses performances exceptionnelles 1 – RustFS est développé par une communauté mondiale d'ingénieurs talentueux. Il est conçu pour être une alternative open source puissante et fiable, pouvant servir de remplacement direct à des produits comme MinIO.2



### 2. Notre mission : un stockage de données accessible et sécurisé pour tous



Nous croyons que le stockage de données doit être abordable, fiable et sécurisé pour tous, partout dans le monde.

Une documentation de haute qualité et multilingue est au cœur de cette mission. Ce n'est pas seulement un complément ; c'est la clé pour abaisser la barrière à l'entrée pour les utilisateurs et les développeurs du monde entier. Lorsque vous traduisez un guide ou corrigez une erreur, vous aidez directement les personnes de différentes communautés linguistiques à construire plus facilement des infrastructures de données robustes et rentables. Vos contributions renforcent une audience mondiale et améliorent collectivement la sécurité et la souveraineté des données. Cette approche communautaire du partage des connaissances maximise la valeur du projet et nous aide à réaliser véritablement notre vision.4



### 3. Votre parcours de contribution



Nous avons conçu différents parcours pour différents types de contributeurs. Que vous souhaitiez corriger rapidement un petit problème ou traduire systématiquement l'ensemble de la documentation, vous trouverez ici le guide approprié.



#### 3.1 Pour commencer : votre première contribution



Le moyen le plus simple de commencer est de faire de petites modifications directement via l'interface web de GitHub. Cette méthode ne nécessite aucune configuration de développement local et est parfaite pour les changements mineurs.6

Les contributions simples que vous pouvez faire incluent :

- Corriger des fautes de frappe ou des erreurs grammaticales.
- Réparer des liens brisés.
- Clarifier des phrases ou des paragraphes confus.
- Signaler un problème pour lequel vous ne connaissez pas la solution en créant une "Issue".

**Le processus de Pull Request en "5 minutes" :**

1. Rendez-vous sur la page que vous souhaitez modifier sur le site de documentation `https://docs.rustfs.com/`.
2. Faites défiler vers le bas et cliquez sur le lien "Modifier cette page sur GitHub".
3. Cela vous amènera au fichier source Markdown correspondant sur GitHub. Cliquez sur l'icône du crayon (✏️) en haut à droite pour passer en mode édition.
4. Effectuez vos modifications dans l'éditeur de texte.
5. Lorsque vous avez terminé, faites défiler vers le bas. Dans la section "Propose changes", rédigez un message de commit concis, par exemple, "Correction d'une faute de frappe dans le guide d'installation".
6. Cliquez sur le bouton "Propose changes". GitHub vous guidera ensuite dans le processus de création d'une pull request.

Ce processus sert d'excellente "rampe d'accès pour les contributeurs", vous permettant de vous familiariser avec notre flux de travail sans aucune configuration complexe. Une contribution légère réussie est souvent le premier pas vers un engagement plus profond.5



#### 3.2 Traduire la documentation : ajouter une nouvelle langue



C'est le domaine principal où nous avons le plus besoin de l'aide de la communauté. Veuillez suivre ces étapes pour ajouter ou améliorer des traductions.

**Étape 1 : Coordination via les Issues GitHub**

Pour éviter le travail en double et assurer la collaboration, veuillez visiter notre **[page d'Issues GitHub](https://github.com/rustfs/rustfs/issues)** avant de commencer à traduire.

- **Ajouter une nouvelle langue** : Vérifiez si quelqu'un d'autre travaille déjà sur la langue que vous souhaitez traduire. Si ce n'est pas le cas, veuillez créer une nouvelle "Issue" avec le titre `[i18n] Add <Language> (<lang-code>) Translation`, par exemple, `[i18n] Add German (de) Translation`. Cela nous aide à suivre les progrès et à attribuer la responsabilité.7
- **Améliorer une traduction existante** : Si vous souhaitez améliorer une traduction existante, trouvez l'Issue correspondante ou créez-en une nouvelle en détaillant les améliorations que vous prévoyez d'apporter.

**Étape 2 : Comprendre la structure des répertoires**

Notre site de documentation est construit avec VitePress, qui utilise une structure de répertoires basée sur les fichiers pour gérer plusieurs langues.9 Tous les fichiers sources se trouvent dans le répertoire 

`docs/`.

```
docs/
├── en/                  # Anglais (ou comme répertoire racine)
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
├── ja/                  # Japonais
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
└──.vitepress/
    └── config.ts        # Fichier de configuration de VitePress
```

**Étape 3 : Ajouter un nouveau pack de langue**

1. **Forkez et clonez** le dépôt sur votre machine locale, puis créez une nouvelle branche.

2. Dans le répertoire `docs/`, créez un nouveau dossier en utilisant le **code de langue ISO 639-1** correspondant à votre langue cible. Veuillez vous référer au tableau des codes de langue ci-dessous.

3. Copiez **l'intégralité du contenu** de `docs/en/` (ou des fichiers sources anglais à la racine) dans votre nouveau dossier de langue. Cela vous fournit une structure de fichiers complète à traduire.

4. Ouvrez le fichier `docs/.vitepress/config.ts` et ajoutez une nouvelle entrée pour votre langue dans l'objet `locales`.

   Par exemple, pour ajouter l'allemand (`de`) :

   TypeScript

   ```
   //.vitepress/config.ts
   import { defineConfig } from 'vitepress'
   
   export default defineConfig({
     //... autres configurations
     locales: {
       root: {
         label: 'English',
         lang: 'en'
       },
       // Ajoutez la nouvelle configuration de locale ici
       de: {
         label: 'Deutsch', // Texte dans le menu déroulant des langues
         lang: 'de',       // Attribut lang de HTML
         link: '/de/',     // Lien de redirection
         // Vous pouvez surcharger les configurations de thème pour cette locale,
         // par exemple, pour les textes de la barre de navigation et de la barre latérale.
         themeConfig: {
           nav: [
             { text: 'Anleitung', link: '/de/guide/getting-started' }
           ],
           sidebar: {
             '/de/guide/':
               }
             ]
           }
         }
       }
     }
   })
   ```

   Pour vous aider à configurer cela correctement, le tableau suivant explique le but de chaque propriété dans l'objet `locales`.9

| Propriété     | Type     | Requis | Description                                                  |
| ------------- | -------- | ------ | ------------------------------------------------------------ |
| `label`       | `string` | Oui    | Le texte qui apparaît dans le menu déroulant de sélection de la langue dans la barre de navigation. |
| `lang`        | `string` | Non    | L'attribut `lang` pour la balise `<html>`. Utilise le nom du répertoire si non spécifié. |
| `link`        | `string` | Non    | Le lien vers lequel l'utilisateur est redirigé lors de la sélection de cette langue. Par défaut, le chemin racine de la locale (par exemple, `/ja/`). |
| `title`       | `string` | Non    | Surcharge le titre principal du site pour cette locale spécifique. |
| `description` | `string` | Non    | Surcharge la description principale du site pour cette locale spécifique. |
| `themeConfig` | `object` | Non    | Configuration de thème spécifique à la locale. Utilisé pour traduire les liens de la barre de navigation, le texte de la barre latérale, etc. |

```
Ce tableau vise à éliminer toute ambiguïté dans la configuration, en veillant à ce que les contributeurs puissent le faire correctement du premier coup et en réduisant le besoin de révisions.
```

**Étape 4 : Traduire le contenu**

- Dans votre nouveau répertoire de langue, ouvrez les fichiers Markdown un par un et traduisez le contenu textuel.
- **Important** : Veuillez **ne pas** traduire ce qui suit :
  - Les clés dans le frontmatter (par exemple, `title:`, `layout:`).
  - Tout code à l'intérieur des blocs de code.
  - Les liens URL.
  - Les balises HTML.
- Traduisez uniquement le texte lisible par l'homme.

**Étape 5 : Soumettre votre Pull Request**

Une fois la traduction terminée, veuillez suivre les(#43-directives-pour-les-pull-requests-pr-et-les-commits) pour soumettre votre contribution, et assurez-vous de la lier à l'Issue que vous avez créée à l'étape 1.

**Référence des codes de langue**

Pour garantir la cohérence, veuillez utiliser les codes ISO 639-1 standard du tableau ci-dessous.13

| Langue              | Code ISO 639-1  |
| ------------------- | --------------- |
| Chinois (simplifié) | `zh` ou `zh-CN` |
| Anglais             | `en`            |
| Japonais            | `ja`            |
| Allemand            | `de`            |
| Français            | `fr`            |



### 4. Le flux de travail technique



Pour les développeurs qui souhaitent apporter des contributions plus substantielles en local (comme l'ajout d'un nouveau pack de langue ou des modifications importantes), veuillez suivre ce flux de travail technique.



#### 4.1 Prérequis



Avant de commencer, veuillez vous assurer que les logiciels suivants sont installés sur votre système :

- **Node.js** : Version `18.x` ou supérieure.14 Vous pouvez le télécharger sur le 

  [site officiel de Node.js](https://nodejs.org/).

- **Gestionnaire de paquets** : Nous recommandons d'utiliser `pnpm` pour plus d'efficacité. Vous pouvez l'installer globalement avec `npm install -g pnpm`. Vous pouvez également utiliser `npm` ou `yarn`.15

- **Git** : Un système de contrôle de version. Vous pouvez le télécharger sur le [site officiel de Git](https://git-scm.com/).



#### 4.2 Configuration du développement local



Suivez cette séquence de commandes pour exécuter le serveur de développement de la documentation en local :

1. Forker et cloner le dépôt

   D'abord, forkez ce dépôt sur GitHub. Ensuite, clonez votre fork sur votre machine locale.

   Bash

   ```
   # Remplacez <YOUR_USERNAME> par votre nom d'utilisateur GitHub
   git clone https://github.com/<YOUR_USERNAME>/docs.rustfs.com.git
   cd docs.rustfs.com
   ```

2. Installer les dépendances

   Utilisez pnpm pour installer toutes les dépendances requises du projet.

   Bash

   ```
   pnpm install
   ```

3. Lancer le serveur de développement

   Cette commande lancera un serveur de développement local avec rechargement à chaud.

   Bash

   ```
   pnpm docs:dev
   ```

4. Accéder au site

   Après une exécution réussie, vous devriez voir une sortie dans votre terminal similaire à VitePress dev server running at: http://localhost:5173/. Ouvrez cette URL dans votre navigateur pour voir le site de documentation. Toute modification apportée aux fichiers Markdown sera instantanément répercutée dans le navigateur.15



#### 4.3 Directives pour les Pull Requests (PR) et les commits



Nous suivons un flux de travail standardisé pour garantir la qualité du code et un historique de projet clair.

- **Stratégie de branche**

  - Créez toujours une nouvelle branche pour votre travail. Ne commitez pas directement sur la branche `main`.
  - Utilisez un nom de branche descriptif, tel que `feat/add-german-translation` ou `fix/correct-s3-api-typo`.17

- Convention des messages de commit

  Nous adhérons à la spécification Conventional Commits. Cela nous aide à automatiser les journaux de modifications et rend l'historique des commits plus facile à comprendre.

  - **Format** : `<type>(<scope>): <subject>`

  - **Exemples** :

    - `feat(i18n): add initial french translation`

    - `fix(guide): correct typo in getting-started.md`

    - docs(contributing): update local development setup

      Cette approche structurée est une bonne pratique dans de nombreux projets open source matures.8

- **Soumettre une Pull Request**

  1. Poussez votre branche vers votre fork : `git push -u origin your-branch-name`.
  2. Sur GitHub, ouvrez une pull request de votre fork vers la branche `main` du dépôt `rustfs/docs.rustfs.com`.
  3. **Lier l'Issue** : Dans la description de la PR, utilisez des mots-clés comme `Closes #123` ou `Fixes #123` pour lier l'Issue que vous avez créée précédemment. Cela fermera automatiquement l'Issue lorsque la PR sera fusionnée, une étape clé de l'automatisation de notre flux de travail.7
  4. **Rédigez une description claire** : Expliquez clairement **ce que** vous avez changé et **pourquoi**. Si vos modifications sont visuelles, veuillez inclure des captures d'écran avant/après.5

- **Le processus de revue**

  - Une fois que vous avez soumis une PR, un mainteneur du projet la examinera.
  - Nous pouvons demander des modifications. Ne vous découragez pas! C'est une partie normale du développement collaboratif open source visant à améliorer la qualité des contributions.
  - Une fois votre PR approuvée et que toutes les vérifications automatisées sont passées, un mainteneur la fusionnera.



#### 4.4 Vérifications automatisées et déploiement



Pour garantir la qualité et la stabilité de notre documentation, nous disposons d'un pipeline CI/CD (Intégration Continue/Déploiement Continu) entièrement automatisé.

- **Vérifications automatisées** : Lorsque vous soumettez une pull request, GitHub Actions exécutera automatiquement une série de vérifications. Ces vérifications s'assurent que le site de documentation se construit avec succès et que le formatage du code est correct (linting).19
- **Déploiement automatisé** : Une fois votre PR fusionnée dans la branche `main`, GitHub Actions se déclenchera à nouveau, construisant automatiquement la dernière version du site et la déployant sur `https://docs.rustfs.com`.

En rendant ce processus transparent, nous visons à renforcer la confiance des contributeurs dans notre flux de travail. Vous n'avez pas à vous soucier des détails du déploiement ; une fusion réussie signifie un déploiement réussi. Cela vous donne une vue claire de l'ensemble du cycle de vie de votre contribution, de la soumission à la publication.19



### 5. Communauté et licence





#### 5.1 Remerciements



La documentation de RustFS est construite par la communauté, pour la communauté. Nous sommes incroyablement reconnaissants envers tous ceux qui contribuent de leur temps et de leur expertise.

Chaque contribution, aussi petite soit-elle, est très appréciée. Pour reconnaître toutes les contributions de manière juste et transparente, nous utilisons les outils intégrés de GitHub.

Vous pouvez voir une liste de tous nos incroyables contributeurs sur le **[graphique des contributeurs](https://github.com/rustfs/docs.rustfs.com/graphs/contributors)**. Cette approche automatisée et évolutive garantit que chaque contribution est reconnue et toujours à jour.22



#### 5.2 Licence du contenu



Toute la documentation de ce projet est sous licence **Creative Commons Attribution 4.0 International**.23

En contribuant au projet de documentation de RustFS, vous acceptez que vos contributions soient publiées sous cette licence.

Sous cette licence, vous êtes libre de :

- **Partager** — copier et redistribuer le matériel sur n'importe quel support ou format.
- **Adapter** — remixer, transformer et créer à partir du matériel pour toute utilisation, y compris commerciale.

Vous devez respecter les conditions suivantes :

- **Attribution (Paternité)** — Vous devez créditer l'Œuvre, intégrer un lien vers la licence et **indiquer si des modifications ont été effectuées** à l'Œuvre. Vous devez indiquer ces informations par tous les moyens raisonnables, sans toutefois suggérer que le Titulaire des droits vous soutient ou soutient la façon dont vous avez utilisé son Œuvre.23