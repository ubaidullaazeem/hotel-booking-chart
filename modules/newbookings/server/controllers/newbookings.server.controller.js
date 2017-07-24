'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Newbooking = mongoose.model('Newbooking'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  async = require('async'),
  _ = require('lodash');

/**
 * Create a Newbooking
 */
exports.create = function(req, res) {
  var newbooking = new Newbooking(req.body);
  newbooking.user = req.user;
  var mapSelectedHallsByName = _.map(req.body.mSelectedHalls, 'name');
  Newbooking.find({
    $and: [{
      mStartDateTime: {
        $gte: req.body.startGMT
      }
    }, {
      mEndDateTime: {
        $lte: req.body.endGMT
      }
    }]
  }, function(err, entries) {
    if (entries.length > 0) {
      var mapEntriesBySelectedHalls = _.map(entries, 'mSelectedHalls');
      entries.forEach(function(entry) {
        if ((convertTimeStamp(req.body.mStartDateTime) <= addExtraHours(entry.mEndDateTime, 3)) && (convertTimeStamp(req.body.mEndDateTime) >= addExtraHours(entry.mStartDateTime, 3))) { // overlaps
          mapEntriesBySelectedHalls.forEach(function(bookedHall) {
            var mapEntrySelectedHallByName = _.map(bookedHall, 'name');            
            var commonHallsFromArrays = _.intersection(mapEntrySelectedHallByName, mapSelectedHallsByName);
            if (commonHallsFromArrays.length > 0) {
              return res.status(400).send({
                message: "Halls '" + commonHallsFromArrays + "' are already booked on the date between startdate: " + convertDate(req.body.mStartDateTime) + " enddate: " + convertDate(req.body.mEndDateTime)
              });
            } else {
              saveBooking(newbooking, res);
            }
          });
        } else {
          saveBooking(newbooking, res);
        }
      });
    } else {
      saveBooking(newbooking, res);
    }
  });
};

/**
 * Save New Booking
 */

 function saveBooking(newbooking, res) {
    newbooking.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(newbooking);
    }
  });
 }

/**
 * Show the current Newbooking
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var newbooking = req.newbooking ? req.newbooking.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  newbooking.isCurrentUserOwner = req.user && newbooking.user && newbooking.user._id.toString() === req.user._id.toString();

  res.jsonp(newbooking);
};

/**
 * Update a Newbooking
 */
exports.update = function(req, res) {
  var newbooking = req.newbooking;

  newbooking = _.extend(newbooking, req.body);

  newbooking.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(newbooking);
    }
  });
};

/**
 * Delete an Newbooking
 */
exports.delete = function(req, res) {
  var newbooking = req.newbooking;

  newbooking.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(newbooking);
    }
  });
};

/**
 * List of Newbookings
 */
exports.list = function(req, res) {
  Newbooking.find().sort('-created').populate('user', 'displayName').exec(function(err, newbookings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(newbookings);
    }
  });
};

/**
 * Search of Newbookings
 */
exports.search = function(req, res) {
  var mapSelectedHallsByName = _.map(req.body.selectedHalls, 'name');
  if (req.body.selectedHalls.length > 0) {
    Newbooking.find({
      mSelectedHalls: {
        $elemMatch: {
          name: {
            $in: mapSelectedHallsByName
          }
        }
      }
    }, function(err, searchResults) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(searchResults);
      }

    });
  } else {
    Newbooking.find().sort('-created').populate('user', 'displayName').exec(function(err, newbookings) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(newbookings);
      }
    });
  }

};


/**
 * Newbooking middleware
 */
exports.newbookingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Newbooking is invalid'
    });
  }

  Newbooking.findById(id).populate('user', 'displayName').exec(function (err, newbooking) {
    if (err) {
      return next(err);
    } else if (!newbooking) {
      return res.status(404).send({
        message: 'No Newbooking with that identifier has been found'
      });
    }
    req.newbooking = newbooking;
    next();
  });
};

/**
 * Date convertion to YYYY-MM-DD HH:MM:SS
 */

function convertDate(date) {
  return new Date(date).toString().replace(/GMT.+/,"");
}

/**
 * Date convertion to timestamp
 */

function convertTimeStamp(date) {
  return new Date(date).getTime();
}

/**
 * Add hours
 */

function addExtraHours(date, hours) {
  var dateTime = new Date(date);
  var addExtraTime = dateTime.setHours(dateTime.getHours() + hours);
  return addExtraTime;
}

