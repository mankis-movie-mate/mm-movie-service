const express = require('express');
const app = express();
const { base_url } = require('./config/config');
const { swaggerUI, swaggerSpec } = require('./config/swagger');
const movieRoutes = require('./route/movieRoutes');
const movieManagementRoutes = require('./route/movieManagementRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());
app.use(`${base_url}/api-docs`, swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(`${base_url}`, movieRoutes);
app.use(`${base_url}/manage`, movieManagementRoutes);

// middleware
app.use(errorHandler);

module.exports = app;
