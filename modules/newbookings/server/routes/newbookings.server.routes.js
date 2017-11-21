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

  app.route('/api/newbookings/validateoverlap')/*.all(newbookingsPolicy.isAllowed)*/
    .post(newbookings.validateoverlap);

  app.route('/api/newbookings/sendmail')
    .post(newbookings.sendEmail);

  app.route('/api/newbookings/sendReport')
    .post(newbookings.sendReport);

  app.route('/api/newbookings/searchgraphicalreports')
    .post(newbookings.getGraphicalReports);

  app.route('/api/newbookings/searchbookinglistreports')
    .post(newbookings.getBookingListReports);

  app.route('/api/newbookings/picture')
    .post(newbookings.changePhotoIdPicture);

  // app.route('/api/newbookings/picture')
  // .delete(newbookings.deletePhotoIdPicture);

  // Finish by binding the Newbooking middleware
  app.param('newbookingId', newbookings.newbookingByID);
};
