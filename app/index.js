const express = require('express');
const app = express();
const { base_url } = require('./config/config');
const { swaggerUI, swaggerSpec } = require('./config/swagger');
const movieRoutes = require('./route/movieRoutes');
const movieManagementRoutes = require('./route/movieManagementRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

app.use(express.json());
app.use(`${base_url}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(`${base_url}`, movieRoutes);
app.use(`${base_url}/manage`, movieManagementRoutes);

app.get('/health', (req, res) => {
    logger.info('Health check OK');
    res.send('OK');
});

app.get(`/artefacts/swagger.json`, (req, res) => res.send(swaggerSpec));

// middleware
app.use(errorHandler);

module.exports = app;
