'use strict';

/**
 * Module dependencies
 */
var countersPolicy = require('../policies/counters.server.policy'),
  counters = require('../controllers/counters.server.controller');

module.exports = function(app) {
  // Counters Routes
  app.route('/api/counters')/*.all(countersPolicy.isAllowed)*/
    .get(counters.list)
    .post(counters.create);

  app.route('/api/counters/:counterId')/*.all(countersPolicy.isAllowed)*/
    .get(counters.read)
    .put(counters.update)
    .delete(counters.delete);

  // Finish by binding the Counter middleware
  app.param('counterId', counters.counterByID);
};
