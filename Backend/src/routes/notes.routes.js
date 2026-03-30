const express = require('express');
const router = express.Router();

const notesController = require('../controllers/notes.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.get('/my-notes', authMiddleware, notesController.getAllNotesOfUser);
router.get('/my-notes/:id', authMiddleware, notesController.getSingleNote);
router.get('/total-notes', authMiddleware, notesController.getTotalNotesNumber);
router.delete('/my-notes/:id', authMiddleware, notesController.deleteNote);

module.exports = router;