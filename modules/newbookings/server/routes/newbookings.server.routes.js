'use strict';

/**
 * Module dependencies
 */
var newbookingsPolicy = require('../policies/newbookings.server.policy'),
  newbookings = require('../controllers/newbookings.server.controller');

module.exports = function(app) {
  // Newbookings Routes
  app.route('/api/newbookings')/*.all(newbookingsPolicy.isAllowed)*/
    .get(newbookings.list)
    .post(newbookings.create);

  app.route('/api/newbookings/:newbookingId')/*.all(newbookingsPolicy.isAllowed)*/
    .get(newbookings.read)
    .put(newbookings.update)
    .delete(newbookings.delete);

  app.route('/api/newbookings/search')/*.all(newbookingsPolicy.isAllowed)*/
    .post(newbookings.search);

  // Finish by binding the Newbooking middleware
  app.param('newbookingId', newbookings.newbookingByID);
};
