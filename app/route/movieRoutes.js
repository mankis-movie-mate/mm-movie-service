const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController');

router.get('/movie', movieController.getMovies);

module.exports = router;
