# NodeJS_ToDoList
## ***Sommaire***
- [**Description du projet**](#description-du-projet)
- [**Option bonus : Frontend simple**](#option-bonus--frontend-simple)
- [**Explication des étapes de la réalisation du projet**](#explication-des-étapes-de-la-réalisation-du-projet)
    - [**Étape 1 : Configuration initiale du projet**](#étape-1--configuration-initiale-du-projet)
    - [**Étape 2 : Connexion à MySQL et création du modèle de tâche**](#étape-2--connexion-à-mysql-et-création-du-modèle-de-tâche)
    - [**Étape 3 : Gestion des erreurs et validations**](#étape-3--gestion-des-erreurs-et-validations)
    - [**Étape 4 : Ajouter la pagination, la recherche et le tri**](#étape-4--ajouter-la-pagination-la-recherche-et-le-tri)
        - [**Exemple de requête avec toutes les options**](#exemple-de-requête-avec-toutes-les-options-)
    - [**Étape 5 : Authentification avec JWT**](#étape-5--authentification-avec-jwt)
## ***Description du projet***
Un projet simple pour te familiariser avec Node.js et Express pourrait être la création d'une **application de gestion de tâches** (To-Do List). Voici les fonctionnalités principales pour ce projet :

1. **Création du backend avec Node.js et Express**
    - **API RESTful** : Développe des routes pour gérer les tâches avec les actions suivantes :
        - **GET** pour lister toutes les tâches.
        - **POST** pour ajouter une nouvelle tâche.
        - **PUT** pour modifier une tâche existante.
        - **DELETE** pour supprimer une tâche.
    - **Modèle de données** : Crée un modèle de tâche avec des champs comme `TaskID`, `description`, `status` (terminé ou non) et `created_at`.
2. **Utilisation de MySQL pour la base de données**
    - Connecte Express à MySQL et crée une table pour stocker les tâches. Assure-toi d'utiliser MySQLi et les requêtes préparées pour sécuriser l'application.
3. **Middleware et gestion des erreurs**
    - Ajoute des middlewares pour la gestion des erreurs et des logs de requêtes (ex. : morgan).
4. **Documentation et tests**
    - **Documentation de l'API** avec des outils comme Swagger pour bien structurer tes endpoints.
    - Écris des tests pour l'API avec Jest ou Mocha pour valider les fonctionnalités.
## ***Option bonus : Frontend simple***
Pour aller un peu plus loin, tu pourrais ajouter un frontend basique en HTML, CSS et JavaScript pour interagir avec l'API et visualiser les tâches.
## **Explication des étapes de la réalisation du projet**
### **Étape 1 : Configuration initiale du projet**
1. **Créer un nouveau dossier pour ton projet**
```bash
mkdir todo-app
cd todo-app
```
2. **Initialiser un projet Node.js** Cette commande va générer un fichier package.json qui contient les informations de ton projet et les dépendances.
```bash
npm init -y
```
3. **Installer les dépendances nécessaires**
    - **Express** pour gérer les routes et les requêtes HTTP.
    - **MySQL2** pour interagir avec ta base de données MySQL.
    - **Dotenv** pour gérer les variables d’environnement (par exemple, pour la configuration de la base de données).
    - **Morgan** pour le logging des requêtes.
```bash
npm install express mysql2 dotenv morgan
```
4. **Créer la structure du projet** Tu peux organiser ton projet comme suit :
```
todo-app/
├── node_modules/
├── src/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── app.js
├── .env
├── package.json
└── package-lock.json
```
    - `routes/` contiendra les fichiers qui définissent les endpoints (routes API).
    - `models/` pour définir les requêtes SQL ou les modèles de données.
    - `controllers/` pour la logique métier liée aux tâches.
    - `app.js` sera le fichier principal qui configure Express.
5. **Créer ton fichier** `.env` Ce fichier contiendra tes variables sensibles (comme les informations de connexion à la base de données). Par exemple :
```JS
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=todolist
```
6. **Créer le serveur de base dans** `app.js` Voici un exemple de code pour commencer à configurer ton serveur Express dans `src/app.js` :
```JS
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json()); // Pour parser les requêtes JSON

// Définir une route simple pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API To-Do List');
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
```
### **Étape 2 : Connexion à MySQL et création du modèle de tâche**
1. **Configurer la connexion MySQL dans un fichier séparé**
On va créer un fichier qui gérera la connexion à la base de données. Crée un fichier `src/config/db.js` :
```JS
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Créer une connexion à la base de données
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connecter à la base de données
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        throw err;
    }
    console.log('Connecté à la base de données MySQL');
});

module.exports = db;
```
2. **Créer la base de données et la table** `Task`
Connecte-toi à MySQL et crée la base de données et la table. Tu peux le faire directement via un client MySQL comme phpMyAdmin ou en ligne de commande.
```SQL
CREATE DATABASE todolist;

USE todolist;

CREATE TABLE Task (
    TaskID INT PRIMARY KEY AUTO_INCREMENT,
    Description VARCHAR(255),
    Status TINYINT(1) DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- `TaskID` est l'identifiant unique de chaque tâche.
- `Description` est le texte de la tâche.
- `Status` indique si la tâche est terminée (0 = non terminé, 1 = terminé).
- `CreatedAt` est la date et l'heure de création de la tâche.
3. **Créer le modèle de données pour les tâches**
Maintenant que la table est créée, nous allons écrire des fonctions pour interagir avec cette table. Crée un fichier `src/models/taskModel.js` :
```JS
const db = require('../config/db');

// Fonction pour récupérer toutes les tâches
const getAllTasks = (callback) => {
    const query = 'SELECT * FROM Task';
    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Fonction pour ajouter une nouvelle tâche
const addTask = (description, callback) => {
    const query = 'INSERT INTO Task (Description) VALUES (?)';
    db.query(query, [description], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Fonction pour modifier le statut d'une tâche
const updateTaskStatus = (taskId, status, callback) => {
    const query = 'UPDATE Task SET Status = ? WHERE TaskID = ?';
    db.query(query, [status, taskId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Fonction pour supprimer une tâche
const deleteTask = (taskId, callback) => {
    const query = 'DELETE FROM Task WHERE TaskID = ?';
    db.query(query, [taskId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

module.exports = {
    getAllTasks,
    addTask,
    updateTaskStatus,
    deleteTask
};
```
4. **Mettre en place les routes pour les tâches**
Ensuite, on va créer des routes pour notre API. Crée un fichier `src/routes/taskRoutes.js` :
```JS
const express = require('express');
const router = express.Router();
const taskModel = require('../models/taskModel');

// Route pour récupérer toutes les tâches
router.get('/', (req, res) => {
    taskModel.getAllTasks((err, tasks) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
        }
        res.json(tasks);
    });
});

// Route pour ajouter une nouvelle tâche
router.post('/', (req, res) => {
    const { description } = req.body;
    taskModel.addTask(description, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche' });
        }
        res.status(201).json({ message: 'Tâche ajoutée avec succès', taskId: result.insertId });
    });
});

// Route pour mettre à jour le statut d'une tâche
router.put('/:taskId', (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    taskModel.updateTaskStatus(taskId, status, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de la tâche' });
        }
        res.json({ message: 'Statut de la tâche mis à jour avec succès' });
    });
});

// Route pour supprimer une tâche
router.delete('/:taskId', (req, res) => {
    const { taskId } = req.params;
    taskModel.deleteTask(taskId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
        }
        res.json({ message: 'Tâche supprimée avec succès' });
    });
});

module.exports = router;
```
5. **Connecter les routes au serveur**
Enfin, on doit connecter les routes que tu viens de créer à notre serveur principal. Ouvre le fichier `src/app.js` et ajoute ceci :
```JS
const taskRoutes = require('./routes/taskRoutes');

// Utiliser les routes de tâches
app.use('/tasks', taskRoutes);
```
### **Étape 3 : Gestion des erreurs et validations**
1. **Ajout d'une validation simple pour les entrées**

Pour garantir que les descriptions des tâches ne soient pas vides, nous allons ajouter une validation basique avant d'insérer ou de mettre à jour une tâche.

Ouvre le fichier `src/routes/taskRoutes.js` et modifie la route POST ainsi que PUT comme suit :
```JS
// Route pour ajouter une nouvelle tâche avec validation
router.post('/', (req, res) => {
    const { description } = req.body;

    // Validation simple
    if (!description || description.trim() === '') {
        return res.status(400).json({ error: 'La description ne peut pas être vide' });
    }

    taskModel.addTask(description, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche' });
        }
        res.status(201).json({ message: 'Tâche ajoutée avec succès', taskId: result.insertId });
    });
});

// Route pour mettre à jour le statut d'une tâche avec validation
router.put('/:taskId', (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    // Vérification si le statut est valide (0 ou 1)
    if (typeof status !== 'number' || (status !== 0 && status !== 1)) {
        return res.status(400).json({ error: 'Statut invalide, il doit être 0 ou 1' });
    }

    taskModel.updateTaskStatus(taskId, status, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de la tâche' });
        }
        res.json({ message: 'Statut de la tâche mis à jour avec succès' });
    });
});
```
2. **Gestion centralisée des erreurs**

On peut aussi améliorer la gestion des erreurs en créant un middleware qui centralise la gestion des erreurs, évitant ainsi la répétition de code.
- Crée un nouveau fichier `src/middleware/errorHandler.js` :
```JS
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Quelque chose s\'est mal passé, réessayez plus tard.' });
};

module.exports = errorHandler;
```
- Puis dans `src/app.js`, ajoute ce middleware juste après les routes :
```JS
const errorHandler = require('./middleware/errorHandler');

// Utiliser les routes de tâches
app.use('/tasks', taskRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);
```
Maintenant, si une erreur se produit n'importe où dans ton application, elle sera automatiquement capturée et un message d'erreur générique sera renvoyé.
3. **Améliorer la gestion des erreurs MySQL**

Dans le fichier `src/models/taskModel.js`, nous pouvons améliorer la manière dont les erreurs MySQL sont gérées. Par exemple, on peut capturer les erreurs spécifiques comme celles liées à la duplication d'entrées.

Modifie les fonctions dans `taskModel.js` pour capturer et gérer des erreurs spécifiques :
```JS
const db = require('../config/db');

// Fonction pour récupérer toutes les tâches
const getAllTasks = (callback) => {
    const query = 'SELECT * FROM Task';
    db.query(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_BAD_TABLE_ERROR') {
                return callback(new Error('Table "Task" introuvable.'), null);
            }
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Autres fonctions restent inchangées
```
4. **Ajouter des codes d’erreur HTTP appropriés**

Dans tes routes, assure-toi d'utiliser les bons codes d'erreur HTTP pour chaque situation :

- `200 OK` pour les requêtes réussies.
- `201 Created` pour indiquer qu'une ressource a été créée avec succès (comme une nouvelle tâche).
- `400 Bad Request` pour des erreurs de validation utilisateur.
- `404 Not Found` si une tâche ou une ressource n’est pas trouvée.
- `500 Internal Server Error` pour des erreurs serveur.
Par exemple, si l'ID d'une tâche est introuvable lors de sa mise à jour ou suppression, renvoie un `404` :
```JS
// Route pour mettre à jour le statut d'une tâche avec validation
router.put('/:taskId', (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    // Vérification si le statut est valide (0 ou 1)
    if (typeof status !== 'number' || (status !== 0 && status !== 1)) {
        return res.status(400).json({ error: 'Statut invalide, il doit être 0 ou 1' });
    }

    taskModel.updateTaskStatus(taskId, status, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de la tâche' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Tâche introuvable' });
        }
        res.json({ message: 'Statut de la tâche mis à jour avec succès' });
    });
});

// Route pour supprimer une tâche
router.delete('/:taskId', (req, res) => {
    const { taskId } = req.params;
    taskModel.deleteTask(taskId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Tâche introuvable' });
        }
        res.json({ message: 'Tâche supprimée avec succès' });
    });
});
```
### **Étape 4 : Ajouter la pagination, la recherche et le tri**
1. **Ajouter la pagination**

La pagination permet de limiter le nombre de résultats renvoyés par l'API et d'éviter de renvoyer toutes les tâches en une seule fois. On va ajouter deux paramètres à la route `GET /tasks` : `limit` (nombre de tâches par page) et `page` (numéro de la page).

Dans `src/models/taskModel.js`, modifie la fonction `getAllTasks` pour inclure la pagination :
```JS
const getAllTasks = (limit, offset, callback) => {
    const query = 'SELECT * FROM Task LIMIT ? OFFSET ?';
    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};
```
Ensuite, dans `src/routes/taskRoutes.js`, modifie la route `GET` pour inclure ces paramètres :
```JS
// Route pour récupérer toutes les tâches avec pagination
router.get('/', (req, res) => {
    let { page, limit } = req.query;

    // Valeurs par défaut si les paramètres ne sont pas fournis
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const offset = (page - 1) * limit;

    taskModel.getAllTasks(limit, offset, (err, tasks) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
        }
        res.json(tasks);
    });
});
```
- `limit` : défini le nombre de tâches à afficher par page.
- `page` : défini quelle page est demandée.
- `offset` : calculé pour déterminer combien de résultats sauter pour atteindre la page demandée.
2. **Ajouter la recherche par description**

On va permettre à l'utilisateur de rechercher des tâches par leur description via un paramètre `search` dans la requête.

Modifie à nouveau la fonction `getAllTasks` dans `taskModel.js` pour inclure une recherche :
```JS
const getAllTasks = (limit, offset, search, callback) => {
    let query = 'SELECT * FROM Task WHERE Description LIKE ? LIMIT ? OFFSET ?';
    const searchTerm = '%' + search + '%';
    db.query(query, [searchTerm, limit, offset], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};
```
Puis modifie la route `GET` pour accepter le paramètre `search` :
```JS
router.get('/', (req, res) => {
    let { page, limit, search } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search || '';

    taskModel.getAllTasks(limit, offset, search, (err, tasks) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
        }
        res.json(tasks);
    });
});
```
- **search** : permet de rechercher une tâche par une partie de sa description.
3. **Ajouter le tri des résultats**

Enfin, on peut ajouter un tri pour afficher les tâches dans un ordre particulier, par exemple en fonction de la date de création ou de leur statut.

Modifie `getAllTasks` pour inclure le paramètre `orderBy` :
```JS
const getAllTasks = (limit, offset, search, orderBy, callback) => {
    let query = `SELECT * FROM Task WHERE Description LIKE ? ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    const searchTerm = '%' + search + '%';
    db.query(query, [searchTerm, limit, offset], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};
```
Modifie la route pour inclure ce paramètre :
```JS
router.get('/', (req, res) => {
    let { page, limit, search, orderBy } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search || '';
    orderBy = orderBy || 'CreatedAt DESC'; // Tri par date de création par défaut

    taskModel.getAllTasks(limit, offset, search, orderBy, (err, tasks) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
        }
        res.json(tasks);
    });
});
```
- **orderBy** : permet de trier les résultats par colonne, comme `CreatedAt` ou `Status`.
#### Exemple de requête avec toutes les options :
- Pagination : `GET /tasks?page=2&limit=5`
- Recherche : `GET /tasks?search=important`
- Tri : `GET /tasks?orderBy=Status ASC`
- Combinaison : `GET /tasks?search=urgent&page=1&limit=10&orderBy=CreatedAt DESC`
### Étape 5 : Authentification avec JWT
1. **Installer les dépendances nécessaires**

Nous allons utiliser deux nouvelles dépendances :

- **jsonwebtoken** : pour générer et vérifier les tokens.
- **bcryptjs** : pour hasher les mots de passe.

Installe-les :
```bash
npm install jsonwebtoken bcryptjs
```
2. **Créer un modèle d'utilisateur**
On va ajouter une table `User` dans la base de données pour gérer l'authentification. Crée cette table dans MySQL :
```SQL
CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE,
    Password VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
