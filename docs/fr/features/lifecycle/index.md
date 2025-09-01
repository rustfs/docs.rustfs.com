# Gestion du Cycle de Vie des Données et Hiérarchisation

Avec la croissance continue des données, la capacité d'optimiser de manière collaborative l'accès, la sécurité et l'économie devient une exigence stricte, et non un plus. C'est là qu'intervient la gestion du cycle de vie des données. RustFS fournit un ensemble unique de fonctionnalités pour protéger les données à l'intérieur du cloud et entre les clouds - incluant les clouds publics et privés. Les outils de gestion du cycle de vie des données d'entreprise de RustFS, incluant le contrôle de version, le verrouillage d'objets et divers composants dérivés, répondent à de nombreux cas d'usage.

## Expiration des Objets

Les données n'ont pas besoin d'exister pour toujours : les outils de gestion du cycle de vie RustFS vous permettent de définir combien de temps les données restent sur le disque avant d'être supprimées. Les utilisateurs définissent la durée comme une date spécifique ou un nombre de jours où RustFS commence à supprimer les objets.

Les règles de gestion du cycle de vie sont établies par bucket et peuvent être construites en utilisant n'importe quelle combinaison de filtres d'objets et de tags. Ne spécifiez pas de critères de filtrage pour définir des règles d'expiration pour l'ensemble du bucket, ou spécifiez plusieurs règles pour élaborer des comportements d'expiration plus complexes.

Les règles d'expiration des objets RustFS s'appliquent également aux buckets versionnés, avec certaines variantes spécifiques au versioning. Par exemple, vous pouvez spécifier des règles d'expiration uniquement pour les versions non courantes des objets, pour maximiser les avantages du versioning d'objets sans engendrer de coûts de stockage à long terme. De même, vous pouvez créer des règles de gestion du cycle de vie pour supprimer des objets dont la seule version restante est un marqueur de suppression.

Les règles d'expiration de bucket sont entièrement compatibles avec le verrouillage WORM et la conservation légale RustFS - les objets en état de verrouillage resteront sur disque jusqu'à ce que le verrouillage expire ou soit explicitement levé. Une fois que l'objet n'est plus contraint par le verrouillage, RustFS commence à appliquer normalement les règles d'expiration.

Les règles de gestion du cycle de vie d'expiration des objets RustFS sont compatibles en fonctionnalité et syntaxe avec AWS Lifecycle Management. RustFS supporte également l'importation de règles existantes en format JSON, facilitant la migration des règles d'expiration AWS existantes.

## Hiérarchisation d'Objets Basée sur les Politiques

RustFS peut être configuré de manière programmatique pour la hiérarchisation du stockage d'objets, permettant aux objets de transitionner d'un état ou classe à un autre selon n'importe quel nombre de variables - bien que les plus couramment utilisées soient le temps et la fréquence d'accès. Cette fonctionnalité est mieux comprise dans le contexte de la hiérarchisation. La hiérarchisation permet aux utilisateurs d'optimiser les coûts ou fonctionnalités de stockage pour répondre aux modèles d'accès aux données changeants. Le stockage de données hiérarchisé est généralement utilisé dans les scénarios suivants :

## À Travers les Supports de Stockage

La hiérarchisation à travers les supports de stockage est le cas d'usage de hiérarchisation le plus connu et le plus direct. Ici, RustFS fait abstraction du support sous-jacent et optimise de manière collaborative pour la performance et le coût. Par exemple, pour les charges de travail de performance ou près-ligne, les données peuvent être stockées sur NVMe ou SSD, mais après un certain temps hiérarchisées vers un support HDD, ou pour des charges de travail valorisant l'extension de performance. Au fil du temps, si approprié, ces données peuvent être davantage migrées vers un stockage à long terme.

![Hiérarchisation à travers les supports de stockage](images/s9-2.png)

## À Travers les Types de Cloud

Un cas d'usage émergent rapidement implique l'utilisation du stockage et des ressources de calcul bon marché du cloud public comme une autre couche du cloud privé. Dans ce cas d'usage, des charges de travail près-ligne orientées performance sont exécutées en utilisant des supports de cloud privé appropriés. Le volume de données importe peu, mais la valeur et les attentes de performance importent peu. À mesure que le volume de données augmente et que les attentes de performance diminuent, les entreprises peuvent utiliser les options de stockage froid du cloud public pour optimiser les coûts et les capacités d'accès liés à la conservation des données.

Ceci est accompli en exécutant RustFS sur le cloud privé et le cloud public. En utilisant la réplication, RustFS peut déplacer les données vers des options de cloud public bon marché et utiliser RustFS dans le cloud public pour les protéger et y accéder si nécessaire. Dans ce cas, le cloud public devient un stockage muet pour RustFS, tout comme JBOD devient un stockage muet pour RustFS. Cette approche évite de remplacer et d'ajouter une infrastructure de bandes obsolète.

![Hiérarchisation à travers les types de cloud](images/s9-3.png)

## Dans le Cloud Public

RustFS sert souvent de couche de stockage d'application principale dans le cloud public. Dans ce cas, comme dans d'autres cas d'usage, RustFS est le seul stockage accessible par les applications. Les applications (et développeurs) n'ont besoin de connaître rien d'autre que le point de terminaison de stockage. RustFS détermine quelles données appartiennent où selon les paramètres de gestion. Par exemple, RustFS peut déterminer que les données de blocs doivent passer à la couche objet, et quelle couche objet répond aux objectifs de performance et économiques de l'entreprise.

RustFS combine différentes couches de hiérarchisation de stockage et détermine le support approprié pour fournir une meilleure économie sans affecter la performance. Les applications adressent simplement les objets via RustFS, et RustFS applique de manière transparente les politiques pour déplacer les objets entre les couches et conserve les métadonnées de cet objet dans la couche bloc.

![Hiérarchisation cloud public](images/s9-4.png)