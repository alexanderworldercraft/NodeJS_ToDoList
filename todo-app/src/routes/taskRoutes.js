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
