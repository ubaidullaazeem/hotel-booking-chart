'use strict';

/**
 * Module dependencies
 */
var taxesPolicy = require('../policies/taxes.server.policy'),
  taxes = require('../controllers/taxes.server.controller');

module.exports = function(app) {
  // Taxes Routes
  app.route('/api/taxes')/*.all(taxesPolicy.isAllowed)*/
    .get(taxes.list)
    .post(taxes.create);

  app.route('/api/taxes/:taxId')/*.all(taxesPolicy.isAllowed)*/
    .get(taxes.read)
    .put(taxes.update)
    .delete(taxes.delete);

  // Finish by binding the Tax middleware
  app.param('taxId', taxes.taxByID);
};
