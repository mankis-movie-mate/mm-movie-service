const express = require('express');
const router = express.Router();
const movieManagementController = require('../controller/movieManagementController');


/**
 * @swagger
 * /bulk:
 *   post:
 *     tags:
 *       - Movies Management
 *     summary: Bulk save movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movies:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Movies created
 */
router.post('/bulk', movieManagementController.bulkSaveMovies);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     tags:
 *       - Movies Management
 *     summary: Delete a movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted
 */
router.delete('/:id', movieManagementController.deleteMovie);

/**
 * @swagger
 * /{id}:
 *   patch:
 *     tags:
 *       - Movies Management
 *     summary: Update a movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Movie updated
 */
router.patch('/:id', movieManagementController.updateMovie);


/**
 * @swagger
 * /genre/bulk:
 *   post:
 *     tags:
 *       - Genres Management
 *     summary: Bulk save genres
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
 *                   type: object
 *     responses:
 *       201:
 *         description: Genres created
 */
router.post('/genre/bulk', movieManagementController.bulkSaveGenres);

/**
 * @swagger
 * /genre/{id}:
 *   delete:
 *     tags:
 *       - Genres Management
 *     summary: Delete a genre by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre deleted
 */
router.delete('/genre/:id', movieManagementController.deleteGenre);

module.exports = router;
