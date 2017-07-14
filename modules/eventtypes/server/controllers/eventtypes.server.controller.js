'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Eventtype = mongoose.model('Eventtype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Eventtype
 */
exports.create = function(req, res) {
  var eventtype = new Eventtype(req.body);
  eventtype.user = req.user;

  eventtype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventtype);
    }
  });
};

/**
 * Show the current Eventtype
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var eventtype = req.eventtype ? req.eventtype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  eventtype.isCurrentUserOwner = req.user && eventtype.user && eventtype.user._id.toString() === req.user._id.toString();

  res.jsonp(eventtype);
};

/**
 * Update a Eventtype
 */
exports.update = function(req, res) {
  var eventtype = req.eventtype;

  eventtype = _.extend(eventtype, req.body);

  eventtype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventtype);
    }
  });
};

/**
 * Delete an Eventtype
 */
exports.delete = function(req, res) {
  var eventtype = req.eventtype;

  eventtype.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventtype);
    }
  });
};

/**
 * List of Eventtypes
 */
exports.list = function(req, res) {
  Eventtype.find().sort('-created').populate('user', 'displayName').exec(function(err, eventtypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventtypes);
    }
  });
};

/**
 * Eventtype middleware
 */
exports.eventtypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Eventtype is invalid'
    });
  }

  Eventtype.findById(id).populate('user', 'displayName').exec(function (err, eventtype) {
    if (err) {
      return next(err);
    } else if (!eventtype) {
      return res.status(404).send({
        message: 'No Eventtype with that identifier has been found'
      });
    }
    req.eventtype = eventtype;
    next();
  });
};
