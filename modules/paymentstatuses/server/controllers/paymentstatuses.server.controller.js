'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Paymentstatus = mongoose.model('Paymentstatus'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Paymentstatus
 */
exports.create = function(req, res) {
  var paymentstatus = new Paymentstatus(req.body);
  paymentstatus.user = req.user;

  paymentstatus.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymentstatus);
    }
  });
};

/**
 * Show the current Paymentstatus
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var paymentstatus = req.paymentstatus ? req.paymentstatus.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  paymentstatus.isCurrentUserOwner = req.user && paymentstatus.user && paymentstatus.user._id.toString() === req.user._id.toString();

  res.jsonp(paymentstatus);
};

/**
 * Update a Paymentstatus
 */
exports.update = function(req, res) {
  var paymentstatus = req.paymentstatus;

  paymentstatus = _.extend(paymentstatus, req.body);

  paymentstatus.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymentstatus);
    }
  });
};

/**
 * Delete an Paymentstatus
 */
exports.delete = function(req, res) {
  var paymentstatus = req.paymentstatus;

  paymentstatus.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymentstatus);
    }
  });
};

/**
 * List of Paymentstatuses
 */
exports.list = function(req, res) {
  Paymentstatus.find().sort('-created').populate('user', 'displayName').exec(function(err, paymentstatuses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymentstatuses);
    }
  });
};

/**
 * Paymentstatus middleware
 */
exports.paymentstatusByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Paymentstatus is invalid'
    });
  }

  Paymentstatus.findById(id).populate('user', 'displayName').exec(function (err, paymentstatus) {
    if (err) {
      return next(err);
    } else if (!paymentstatus) {
      return res.status(404).send({
        message: 'No Paymentstatus with that identifier has been found'
      });
    }
    req.paymentstatus = paymentstatus;
    next();
  });
};
