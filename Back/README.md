# Documentation du projet back Gestion inventaire

## Résolution de problèms de configuration du projet

### Problèmes de **migrations**:

* Suppréssion de la base de donnée: **php bin/console doctrine:database:drop --force**
* Création de la base de donnée: **php bin/console doctrine:database:create**
* Création des tables avec les migrations: **php bin/console doctrine:migrations:migrate**
* Ajouter des fackes données avec les fixtures: **php bin/console doctrine:fixtures:load**
