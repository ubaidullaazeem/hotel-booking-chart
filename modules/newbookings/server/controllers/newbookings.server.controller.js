'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Newbooking = mongoose.model('Newbooking'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  smtpTransport = nodemailer.createTransport(config.mailer.options),
  async = require('async'),
  _ = require('lodash'),
  pdf = require('html-pdf'),
  fs = require('fs');


/**
 * Create a Newbooking
 */
exports.create = function(req, res) {
  var newbooking = new Newbooking(req.body);
  newbooking.user = req.user;
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
 * Validate Overlap
 */

exports.validateoverlap = function(req, res) {
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
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entries);
    }
  });
};

/**
 * Email template to Booking Report
 */
exports.sendEmail = function(req, res, next) {
  var newBooking = req.body.newBooking;
  async.waterfall([

    function(done) {
      pdf.create(req.body.content).toFile('modules/newbookings/server/templates/booking-details.pdf', function(err, filename) {
        done(err, filename);
      });
    },
    function(filename, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      var templateURL = 'modules/newbookings/server/templates/customer-booking-email';

      res.render(path.resolve(templateURL), {
        mirthLogo: baseUrl + '/modules/core/client/img/logo-bw.png',
        newBooking: newBooking,
        mAddress: newBooking.mAddress !== null ? newBooking.mAddress : '--',
        mPhotoId: newBooking.mPhotoId !== null ? newBooking.mPhotoId : '--',
        totalCharges:  req.body.totalCharges,
        halls: req.body.halls,
        appName: config.app.title,
        paymentMode: req.body.paymentMode !== null ? req.body.paymentMode : '--',
        eventDateTime: req.body.eventDateTime !== null ? req.body.eventDateTime : '-',
        currentTime: new Date()
      }, function(err, emailHTML) {
        done(err, emailHTML, req);
      });
    },
    // If valid email, send reset email using service
    function(emailHTML, req, done) {
      var path = 'modules/newbookings/server/templates/booking-details.pdf';
      var mailOptions = {
        to: newBooking.mEmail,
        from: config.mailer.from,
        subject: req.body.subject,
        html: emailHTML,
        attachments: [{
          filename: "booking-details.pdf",
          path: path,
          contentType: 'application/pdf'
        }]
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if (!err) {
          fs.unlink(path);
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });


    }
  ], function(err) {
    if (err) {
      return next(err);
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

