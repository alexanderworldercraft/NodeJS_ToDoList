const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const taskRoutes = require('./routes/taskRoutes');

// Utiliser les routes de tâches
app.use('/tasks', taskRoutes);

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
    console.log(`Lien : http://localhost:${PORT}/`);
});