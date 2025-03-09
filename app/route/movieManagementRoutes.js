const express = require('express');
const router = express.Router();
const movieManagementController = require('../controller/movieManagementController');

router.post('/bulk', movieManagementController.bulkSaveMovies);
router.delete('/:id', movieManagementController.deleteMovie);
router.patch('/:id', movieManagementController.updateMovie);

router.post('/genre/bulk', movieManagementController.bulkSaveGenres);
router.delete('/genre/:id', movieManagementController.deleteGenre);

module.exports = router;
