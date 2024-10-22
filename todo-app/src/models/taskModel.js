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
