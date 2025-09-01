# Immutabilité des Objets avec RustFS

## RustFS et API S3 - Conçu pour le Stockage Multi-Cloud

RustFS s'est établi comme la norme de compatibilité AWS S3 dès le début. En tant qu'un des premiers adopteurs de l'API S3 (V2 et V4) et l'une des seules entreprises de stockage axée exclusivement sur S3, la grande communauté de RustFS garantit qu'aucune autre alternative AWS n'est plus compatible. L'API S3 est la norme de facto dans le cloud, donc les alternatives AWS doivent pouvoir utiliser l'API couramment pour fonctionner et interopérer dans différents environnements (cloud public, cloud privé, centre de données, multi-cloud, cloud hybride et edge).

## Rétention d'Objets

Les règles de rétention de stockage d'objets garantissent que les objets sont protégés par WORM pendant une période de temps. Les politiques de rétention de stockage d'objets spécifient la période de rétention définie sur les versions d'objets, soit explicitement soit par des paramètres par défaut de bucket. Les configurations de verrouillage par défaut définies au niveau du bucket s'appliquent aux objets créés par la suite et ne s'appliquent pas rétroactivement aux versions d'objets créés précédemment.

Lors de l'utilisation des paramètres par défaut de bucket, une durée en jours ou années est définie pour spécifier la durée pendant laquelle chaque version d'objet placée dans le bucket doit être protégée. Les nouveaux objets placés dans le bucket hériteront de la durée de protection définie pour le bucket.

Les périodes de rétention peuvent être définies explicitement pour les versions d'objets. Les périodes de rétention explicites spécifient une "date de rétention jusqu'à" pour la version d'objet. La "date de rétention jusqu'à" est stockée dans les métadonnées de la version d'objet et protège la version d'objet jusqu'à ce que la période de rétention expire.

Après l'expiration de la période de rétention, la version d'objet peut être supprimée à moins qu'une conservation légale ne soit également placée sur la version d'objet.

Les paramètres de mode de rétention explicites remplacent les paramètres par défaut de bucket.

Les périodes de rétention peuvent être facilement étendues en soumettant une nouvelle demande de verrouillage.

Dans le cadre de la rétention, il existe deux types de modes pour définir les périodes de rétention pour les objets et buckets.

## Mode Gouvernance

Le mode gouvernance est utilisé pour empêcher les objets d'être supprimés par les utilisateurs standards. Cependant, certains utilisateurs doivent conserver les permissions requises pour modifier les paramètres de rétention ou supprimer des objets. Ces utilisateurs auront besoin de permissions spéciales telles que la permission s3:BypassGovernanceRetention et la permission DeleteObject.

## Mode Conformité

Le mode conformité est plus restrictif et ne peut pas être révoqué pendant la période de rétention. Par conséquent, le mode conformité garantit que personne (y compris l'utilisateur root) ne peut supprimer des objets pendant la période de rétention d'objet.

## Conservation Légale

La conservation légale fournit la même protection WORM que les périodes de rétention mais sans date d'expiration. Il s'agit d'une rétention indéfinie qui ne peut être supprimée que par les utilisateurs autorisés.

Lorsque les objets ont des politiques de rétention ou de conservation légale définies, ils continueront d'être versionnés. Les opérations de réplication effectuées sur une version d'objet ne transfèrent pas les paramètres de rétention et de conservation légale du bucket source vers la destination.

## L'Immutabilité des Données RustFS Répond ou Dépasse les Standards de Certification Cohasset

La norme d'or pour le verrouillage d'objets, la rétention et la conservation légale est la vérification par Cohasset Associates. La rétention de stockage d'objets et l'immutabilité des données de RustFS ont obtenu une évaluation positive de Cohasset Associates, particulièrement concernant la Règle SEC 17a-4(f), la Règle FINRA 4511 et la Réglementation CFTC 1.31. La Règle 17a-4 a des exigences spécifiques pour le stockage de données électroniques, incluant de nombreux aspects de la gestion d'enregistrements tels que la durée, le format, la qualité, la disponibilité et la responsabilité de la rétention d'enregistrements de courtier-négociant.

Une copie du rapport d'évaluation de Cohasset Associates peut être téléchargée intégralement et partagée avec les organismes de réglementation pertinents lors du stockage de données sur RustFS. Il détaille comment configurer RustFS pour répondre aux exigences et la logique soutenant la fonctionnalité de verrouillage d'objets.

