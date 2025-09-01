const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController');


/**
 * @swagger
 * /all:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get all movies (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Page size
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/all', movieController.getAllMovies);

/**
 * @swagger
 * /all-by-ids:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get movies by IDs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/all-by-ids', movieController.getMoviesByIds);

/**
 * @swagger
 * /all-by-genres:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get movie IDs by genres
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/all-by-genres', movieController.getMovieIdsByGenres);

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', movieController.getMovieById);

/**
 * @swagger
 * /genre/all:
 *   get:
 *     tags:
 *       - Genres
 *     summary: Get all genres
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/genre/all', movieController.getAllGenres);

/**
 * @swagger
 * /genre/top:
 *   get:
 *     tags:
 *       - Genres
 *     summary: Get top genres
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/genre/top', movieController.getTopGenres);

module.exports = router;
