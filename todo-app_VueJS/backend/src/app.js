const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

dotenv.config();

// Logger toutes les requêtes pour vérifier si elles atteignent le serveur
app.use(morgan('dev'));
app.use(cors({ origin: '*'}));   // Autoriser toutes les origines 

// Middleware pour parser le JSON
app.use(express.json());

// Routes API avec le préfixe /api
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Servir les fichiers statiques du frontend (dist)
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Rediriger toutes les requêtes non-API vers index.html
app.get('*', (req, res) => {
  const filePath = path.resolve(__dirname, '../../frontend/dist/index.html');
  // Ne pas rediriger les requêtes API ou fichiers statiques
  if (!req.url.startsWith('/api') && !req.url.startsWith('/js') && !req.url.startsWith('/css') && !req.url.startsWith('/img')) {
    res.sendFile(filePath);  // Envoyer index.html pour être géré par Vue.js
  } else {
    res.status(404).send('Fichier introuvable');
  }
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    console.log(`Lien : http://localhost:${PORT}/`);
});