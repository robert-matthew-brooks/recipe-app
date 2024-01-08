const express = require('express');
const ratingsController = require('../controllers/ratings-controller');

const ratingsRouter = express.Router();

ratingsRouter.get('/:recipe_slug', ratingsController.get);
ratingsRouter.put('/:recipe_slug', ratingsController.put);
ratingsRouter.delete('/:recipe_slug', ratingsController.del);

module.exports = ratingsRouter;
