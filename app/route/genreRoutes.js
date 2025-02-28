const express = require('express');
const router = express.Router();
const genreController = require('../controller/genreController');

router.get('/genre', genreController.getGenres);
router.post('/genre', genreController.saveGenre);

module.exports = router;
