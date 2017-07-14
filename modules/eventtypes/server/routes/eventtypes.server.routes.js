'use strict';

/**
 * Module dependencies
 */
var eventtypesPolicy = require('../policies/eventtypes.server.policy'),
  eventtypes = require('../controllers/eventtypes.server.controller');

module.exports = function(app) {
  // Eventtypes Routes
  app.route('/api/eventtypes')/*.all(eventtypesPolicy.isAllowed)*/
    .get(eventtypes.list)
    .post(eventtypes.create);

  app.route('/api/eventtypes/:eventtypeId')/*.all(eventtypesPolicy.isAllowed)*/
    .get(eventtypes.read)
    .put(eventtypes.update)
    .delete(eventtypes.delete);

  // Finish by binding the Eventtype middleware
  app.param('eventtypeId', eventtypes.eventtypeByID);
};
