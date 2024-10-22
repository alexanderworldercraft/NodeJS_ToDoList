const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));               // Logger des requêtes HTTP
app.use(express.json());              // Middleware pour parser le JSON dans les requêtes

// Utiliser les routes de tâches
app.use('/tasks', taskRoutes);

// Définir une route simple pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API To-Do List');
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    console.log(`Lien : http://localhost:${PORT}/`);
});