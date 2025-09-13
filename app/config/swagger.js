const { port, base_url, host } = require('../config/config');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'Movie service API',
      version: '1.0.0',
      description: 'API documentation for the Movie Service API',
    },
    servers: [
      {
        url: `http://${host}:${port}${base_url}/swagger`,
      },
    ],
  },
  apis: ['app/route/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUI, swaggerSpec };
