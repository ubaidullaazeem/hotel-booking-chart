'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Hall = mongoose.model('Hall'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Hall
 */
exports.create = function(req, res) {
  var hall = new Hall(req.body);
  hall.user = req.user;

  hall.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hall);
    }
  });
};

/**
 * Show the current Hall
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var hall = req.hall ? req.hall.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  hall.isCurrentUserOwner = req.user && hall.user && hall.user._id.toString() === req.user._id.toString();

  res.jsonp(hall);
};

/**
 * Update a Hall
 */
exports.update = function(req, res) {
  var hall = req.hall;

  hall = _.extend(hall, req.body);

  hall.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hall);
    }
  });
};

/**
 * Delete an Hall
 */
exports.delete = function(req, res) {
  var hall = req.hall;

  hall.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hall);
    }
  });
};

/**
 * List of Halls
 */
exports.list = function(req, res) {
  Hall.find().sort('-created').populate('user', 'displayName').exec(function(err, halls) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(halls);
    }
  });
};

/**
 * Hall middleware
 */
exports.hallByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Hall is invalid'
    });
  }

  Hall.findById(id).populate('user', 'displayName').exec(function (err, hall) {
    if (err) {
      return next(err);
    } else if (!hall) {
      return res.status(404).send({
        message: 'No Hall with that identifier has been found'
      });
    }
    req.hall = hall;
    next();
  });
};
