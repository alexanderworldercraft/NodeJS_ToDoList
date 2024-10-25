const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const router = express.Router();

// Route pour l'inscription d'un nouvel utilisateur
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Vérifier que le nom d'utilisateur n'est pas déjà utilisé
    userModel.findUserByUsername(username, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (user) {
            return res.status(400).json({ error: 'Nom d\'utilisateur déjà pris' });
        }

        // Créer un nouvel utilisateur
        userModel.createUser(username, password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
            }
            res.status(201).json({ message: 'Utilisateur créé avec succès' });
        });
    });
});

// Route pour l'authentification
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    userModel.findUserByUsername(username, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Comparer les mots de passe
        bcrypt.compare(password, user.Password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(400).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
            }

            // Générer un token JWT
            const token = jwt.sign({ userID: user.UserID }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({ message: 'Authentification réussie', token });
        });
    });
});

module.exports = router;