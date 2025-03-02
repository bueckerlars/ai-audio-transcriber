const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Web Audio Transcriber API',
      version: '1.0.0',
      description: 'API documentation for Web Audio Transcriber',
    },
    servers: [
      {
        url: 'http://localhost:5066/api/v1',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
