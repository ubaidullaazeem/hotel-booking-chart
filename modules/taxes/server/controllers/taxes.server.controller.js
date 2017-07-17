'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tax = mongoose.model('Tax'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Tax
 */
exports.create = function(req, res) {
  var tax = new Tax(req.body);
  tax.user = req.user;

  tax.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tax);
    }
  });
};

/**
 * Show the current Tax
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var tax = req.tax ? req.tax.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  tax.isCurrentUserOwner = req.user && tax.user && tax.user._id.toString() === req.user._id.toString();

  res.jsonp(tax);
};

/**
 * Update a Tax
 */
exports.update = function(req, res) {
  var tax = req.tax;

  tax = _.extend(tax, req.body);

  tax.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tax);
    }
  });
};

/**
 * Delete an Tax
 */
exports.delete = function(req, res) {
  var tax = req.tax;

  tax.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tax);
    }
  });
};

/**
 * List of Taxes
 */
exports.list = function(req, res) {
  Tax.find().sort('-created').populate('user', 'displayName').exec(function(err, taxes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taxes);
    }
  });
};

/**
 * Tax middleware
 */
exports.taxByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tax is invalid'
    });
  }

  Tax.findById(id).populate('user', 'displayName').exec(function (err, tax) {
    if (err) {
      return next(err);
    } else if (!tax) {
      return res.status(404).send({
        message: 'No Tax with that identifier has been found'
      });
    }
    req.tax = tax;
    next();
  });
};
