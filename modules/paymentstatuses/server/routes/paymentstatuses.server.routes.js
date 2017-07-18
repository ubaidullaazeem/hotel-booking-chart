'use strict';

/**
 * Module dependencies
 */
var paymentstatusesPolicy = require('../policies/paymentstatuses.server.policy'),
  paymentstatuses = require('../controllers/paymentstatuses.server.controller');

module.exports = function(app) {
  // Paymentstatuses Routes
  app.route('/api/paymentstatuses')/*.all(paymentstatusesPolicy.isAllowed)*/
    .get(paymentstatuses.list)
    .post(paymentstatuses.create);

  app.route('/api/paymentstatuses/:paymentstatusId')/*.all(paymentstatusesPolicy.isAllowed)*/
    .get(paymentstatuses.read)
    .put(paymentstatuses.update)
    .delete(paymentstatuses.delete);

  // Finish by binding the Paymentstatus middleware
  app.param('paymentstatusId', paymentstatuses.paymentstatusByID);
};
