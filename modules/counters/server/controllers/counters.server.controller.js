'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Counter = mongoose.model('Counter'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Counter
 */
exports.create = function(req, res) {
  var counter = new Counter(req.body);
  counter.user = req.user;

  counter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(counter);
    }
  });
};

/**
 * Show the current Counter
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var counter = req.counter ? req.counter.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  counter.isCurrentUserOwner = req.user && counter.user && counter.user._id.toString() === req.user._id.toString();

  res.jsonp(counter);
};

/**
 * Update a Counter
 */
exports.update = function(req, res) {
  var counter = req.counter;

  counter = _.extend(counter, req.body);

  counter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(counter);
    }
  });
};

/**
 * Delete an Counter
 */
exports.delete = function(req, res) {
  var counter = req.counter;

  counter.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(counter);
    }
  });
};

/**
 * List of Counters
 */
exports.list = function(req, res) {
  Counter.find().sort('-created').populate('user', 'displayName').exec(function(err, counters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(counters);
    }
  });
};

/**
 * Counter middleware
 */
exports.counterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Counter is invalid'
    });
  }

  Counter.findById(id).populate('user', 'displayName').exec(function (err, counter) {
    if (err) {
      return next(err);
    } else if (!counter) {
      return res.status(404).send({
        message: 'No Counter with that identifier has been found'
      });
    }
    req.counter = counter;
    next();
  });
};
