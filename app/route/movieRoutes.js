const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController');

router.get('/all', movieController.getAllMovies);
router.post('/all-by-ids', movieController.getMoviesByIds);
router.get('/all-by-genres', movieController.getMovieIdsByGenres);
router.get('/:id', movieController.getMovieById);

router.get('/genre/all', movieController.getAllGenres);
router.get('/genre/top', movieController.getTopGenres);

module.exports = router;
