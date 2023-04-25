# Justifieur de texte

Bienvenue à vous !

Cette documentation présente l'API de justification de texte, une API REST qui permet de justifier un texte en respectant une longueur de ligne de 80 caractères. L'API utilise un mécanisme d'authentification via token unique et impose une limite de 80 000 mots par jour.

## Démarrage rapide

Voici les étapes à suivre pour mettre en place l'application dans votre environnement.

1. Clonez le projet et ouvrez le dans votre éditeur de code
2. Installez les dépendances avec la commande `npm install` ou `yarn install`.
3. Le projet utilise **PostgreSQL** donc vous devez créer une base de données PostgreSQL
4. Ouvrez le fichier `/env/dev.env` et renseignez les variable d'environnement suivantes:
    - PGUSER : Le nom d'utilisateur de la base de données
    - PGHOST : Le lien vers votre base de données
    - PGPASSWORD : Le mot de passe de votre base de données
    - PGDATABASE : Le nom de la base de données
    - PGPORT: Le port de la base de données
    - MAX_WORDS_ALLOWED_PER_DAY : Le nombre maximal de mot par token par jour
    - DELAY_TO_RESET_TOKEN : Le délai en ms permettant de réinitialiser un token (par défaut: 86400000 = 1 jour)
5. Démarrer le serveur avec la commande `npm start` ou `yarn start`. Le message suivant devrait apparaître dans votre console: Server started at <http://localhost:9000>

## Les testes

Vous pouvez utiliser les commandes suivantes pour :

- Lancer les testes unitaire : `npm run test` ou `yarn test`
- Lancer les testes et avoir les coverages : `npm run test:cov` ou `yarn test:cov`

## Documentation API

### <span style="color: orange;">POST</span> Créer un token

`/api/token/create`
  
Permet d'enregistrer un nouveau token unique avec son email.

**Body**

```json
{
 "email": "foo@bar.com"
}
```

**Réponse**

En cas de succès, la réponse est un objet JSON contenant les informations suivantes :

- `isError` : un booléen qui indique si une erreur est survenue lors de la création du token.
- `value` : une chaîne de caractères qui représente le token unique créé.

Si une erreur survient, la réponse est un objet JSON contenant les informations suivantes :

- `isError` : un booléen qui indique qu'une erreur est survenue.
- `message` : une chaîne de caractères qui décrit l'erreur survenue.

Exemple de réponse en cas de succès

```json
{  
 "isError":  false,  
 "value":  "GZYtBKTfZ3DqV8tkxXkbF2a7T4TbT2V7"  
}
```

Exemple de réponse en cas d'erreur :

```json
{  
 "isError":  true,  
 "message":  "This email is already used"  
}
```

---

### <span style="color: orange;">POST</span> Récupérer son token

`/api/token`

Permet de récupérer un token existant lié à un email
  
**Body**

```json
{
 "email": "foo@bar.com"
}
```

**Réponse**
En cas de succès, la réponse est un objet JSON contenant les informations suivantes :

- `isError` : un booléen qui indique si une erreur est survenue lors de la récupération du token.
- `value` : une chaîne de caractères qui représente le token.

Si une erreur survient, la réponse est un objet JSON contenant les informations suivantes :

- `isError` : un booléen qui indique qu'une erreur est survenue.
- `message` : une chaîne de caractères qui décrit l'erreur survenue.

Exemple de réponse en cas de succès

```json
{  
 "isError":  false,  
 "value":  "GZYtBKTfZ3DqV8tkxXkbF2a7T4TbT2V7"  
}
```

Exemple de réponse en cas d'erreur :

```json
{  
 "isError":  true,  
 "message":  "Token not found"  
}
```

---

### <span style="color: green;">GET</span> Justifier un texte

`/api/justify`

permet d'enregistrer un nouveau token unique avec son email.

**Header**

*Authorization :* `Bearer <<your_token>>`

*ContentType :* `text/plain`

**Body**

```txt
Your super text to justify
```

**Réponse**

Exemple de réponse en cas de succès :

```txt
Your justified super text
```

Exemple de réponse en cas d'erreur :

```json
{  
 "isError":  true,  
 "message":  "Payment Required"  
}
```
