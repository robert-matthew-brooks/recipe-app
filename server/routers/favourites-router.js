const express = require('express');
const favouritesController = require('../controllers/favourites-controller');

const favouritesRouter = express.Router();

favouritesRouter.get('/', favouritesController.getAll);
favouritesRouter.put('/:recipe_slug', favouritesController.put);
favouritesRouter.delete('/:recipe_slug', favouritesController.del);

module.exports = favouritesRouter;
