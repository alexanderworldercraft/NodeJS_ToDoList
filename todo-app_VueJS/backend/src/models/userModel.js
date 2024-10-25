const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Fonction pour trouver un utilisateur par son nom
const findUserByUsername = (username, callback) => {
    const query = 'SELECT * FROM User WHERE Username = ?';
    db.query(query, [username], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
};

// Fonction pour créer un nouvel utilisateur
const createUser = (username, password, callback) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return callback(err, null);
        }

        const query = 'INSERT INTO User (Username, Password) VALUES (?, ?)';
        db.query(query, [username, hashedPassword], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    });
};

module.exports = {
    findUserByUsername,
    createUser
};