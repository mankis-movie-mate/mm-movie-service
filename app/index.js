const express = require('express');
const app = express();
const cors = require('cors');
const { base_url } = require('./config/config');
const { swaggerUI, swaggerSpec } = require('./config/swagger');
const movieRoutes = require('./route/movieRoutes');
const movieManagementRoutes = require('./route/movieManagementRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { allowedOrigins } = require('./config/cors');


app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());
app.use(`${base_url}/docs/swagger`, swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(`${base_url}`, movieRoutes);
app.use(`${base_url}/manage`, movieManagementRoutes);
app.get('/health', (req, res) => {
    logger.info('Health check OK');
    res.send('OK');
});
app.get(`/docs/swagger.json`, (req, res) => res.send(swaggerSpec));

// middleware
app.use(errorHandler);


module.exports = app;
