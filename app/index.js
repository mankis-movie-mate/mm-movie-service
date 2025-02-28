const express = require('express');
const app = express();
const { base_url } = require('./config/config');
const genreRoutes = require('./route/genreRoutes');
const movieRoutes = require('./route/movieRoutes');

app.use(express.json());
app.use(`${base_url}`, genreRoutes);
app.use(`${base_url}`, movieRoutes);

module.exports = app;
