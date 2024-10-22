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

module.exports = router;