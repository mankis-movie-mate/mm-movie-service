const express = require('express');
const router = express.Router();
const genreController = require('../controller/genreController');

/**
 * @swagger
 * /genre:
 *  get:
 *    tags:
 *      - Genres
 *    summary: Get all genres
 *    responses:
 *      200:
 *        description: Success
 */
router.get('/genre', genreController.getGenres);

/**
 * @swagger
 * /genre:
 *  post:
 *    tags:
 *      - Genres
 *    summary: Create a new genre
 *    responses:
 *      201:
 *        description: Genre created successfully
 */
router.post('/genre', genreController.saveGenre);

module.exports = router;
