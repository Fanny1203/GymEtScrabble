# Scrabble et gainage !

Une application web interactive pour créer et exécuter des séquences personnalisées d'exercices de gym, type gainage, en lien avec un tirage de scrabble.

## Fonctionnalités

- **Création de séquences personnalisées**
  - Sélection de 7 exercices selon les lettres d'un tirage de scrabble (A-Z et * pour joker)
  - Configuration du temps d'exercice
  - Configuration des temps de pause (départ et entre exercices)
  - Option pour ordre aléatoire des exercices
  

- **Options sonores**
  - Bips de décompte (3-2-1)
  - Son de cloche pour les transitions
  - Option pour musique aléatoire

- **Interface intuitive**
  - Affichage clair des exercices en cours
  - Liste des exercices avec progression visuelle
  - Exercices terminés barrés
  - Exercice en cours surligné

- **Administration**
  - Interface d'administration pour gérer le lien entre les lettres et lesexercices
  - Ajout, modification et suppression d'exercices
  - Correspondance mémorisée dans un fichier CSV

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (p5.js)
- PHP (pour l'administration)

## Installation

1. Clonez le dépôt :
```bash
git clone [URL_du_repo]
```

2. Placez les fichiers dans un serveur web avec PHP activé (comme XAMPP, WAMP, etc.)

3. Accédez à l'application via votre navigateur :
```
http://localhost/[chemin_vers_le_dossier]
```

## Structure des fichiers

- `index.html` - Page principale de l'application
- `style.css` - Styles de l'interface
- `sketch.js` - Logique JavaScript de l'application
- `instructions.csv` - Base de données des exercices
- `admin.php` - Interface d'administration
- `bip.mp3` - Son de décompte
- `ding.mp3` - Son de transition


## Personnalisation

Le fichier `instructions.csv` contient les correspondances lettre-exercice. On peut le modifier directement dans le fichier ou utiliser l'interface d'administration:
```csv
lettre,instruction
A,"Planche frontale"
B,"Planche latérale droite"
...
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork (selon la grammaire lolienne) le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence creative commons CC BY-NC-SA 4.0.

## Auteurs

- Nom de l'auteur - *Fanny Boitard (https://github.com/Fanny1203)*

## Autres

- Guillaume n'a plus aucune excuse pour ne pas faire son gainage ?
