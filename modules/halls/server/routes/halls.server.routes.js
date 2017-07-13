'use strict';

/**
 * Module dependencies
 */
var hallsPolicy = require('../policies/halls.server.policy'),
  halls = require('../controllers/halls.server.controller');

module.exports = function(app) {
  // Halls Routes
  app.route('/api/halls')/*.all(hallsPolicy.isAllowed)*/
    .get(halls.list)
    .post(halls.create);

  app.route('/api/halls/:hallId')/*.all(hallsPolicy.isAllowed)*/
    .get(halls.read)
    .put(halls.update)
    .delete(halls.delete);

  // Finish by binding the Hall middleware
  app.param('hallId', halls.hallByID);
};
