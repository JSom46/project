"use strict";

require('dotenv').config();
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    info: {
      title: 'API restowe dla aplikacji obsługującej ogłoszenia zaginięcia zwierząt',
      version: '2.1.3.7',
      description: 'API wspierające rejestrację i autentyfikację użytkowników - w tym przy pomocy konta google lub facebook, oraz dodawanie, modyfikowanie, usuwanie i pobieranie ogłoszeń o zaginięciach zwierząt',
    },
    host: process.env.SERVER_ROOT_URI,
    basePath: '/'
};

const options = {
    swaggerDefinition,
    apis: ['./docs/anons-docs.yaml', './docs/auth-docs.yaml']
};

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));

module.exports = router;
