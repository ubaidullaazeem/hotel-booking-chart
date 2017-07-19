'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Newbooking = mongoose.model('Newbooking'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  newbooking;

/**
 * Newbooking routes tests
 */
describe('Newbooking CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Newbooking
    user.save(function () {
      newbooking = {
        name: 'Newbooking name'
      };

      done();
    });
  });

  it('should be able to save a Newbooking if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Newbooking
        agent.post('/api/newbookings')
          .send(newbooking)
          .expect(200)
          .end(function (newbookingSaveErr, newbookingSaveRes) {
            // Handle Newbooking save error
            if (newbookingSaveErr) {
              return done(newbookingSaveErr);
            }

            // Get a list of Newbookings
            agent.get('/api/newbookings')
              .end(function (newbookingsGetErr, newbookingsGetRes) {
                // Handle Newbookings save error
                if (newbookingsGetErr) {
                  return done(newbookingsGetErr);
                }

                // Get Newbookings list
                var newbookings = newbookingsGetRes.body;

                // Set assertions
                (newbookings[0].user._id).should.equal(userId);
                (newbookings[0].name).should.match('Newbooking name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Newbooking if not logged in', function (done) {
    agent.post('/api/newbookings')
      .send(newbooking)
      .expect(403)
      .end(function (newbookingSaveErr, newbookingSaveRes) {
        // Call the assertion callback
        done(newbookingSaveErr);
      });
  });

  it('should not be able to save an Newbooking if no name is provided', function (done) {
    // Invalidate name field
    newbooking.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Newbooking
        agent.post('/api/newbookings')
          .send(newbooking)
          .expect(400)
          .end(function (newbookingSaveErr, newbookingSaveRes) {
            // Set message assertion
            (newbookingSaveRes.body.message).should.match('Please fill Newbooking name');

            // Handle Newbooking save error
            done(newbookingSaveErr);
          });
      });
  });

  it('should be able to update an Newbooking if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Newbooking
        agent.post('/api/newbookings')
          .send(newbooking)
          .expect(200)
          .end(function (newbookingSaveErr, newbookingSaveRes) {
            // Handle Newbooking save error
            if (newbookingSaveErr) {
              return done(newbookingSaveErr);
            }

            // Update Newbooking name
            newbooking.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Newbooking
            agent.put('/api/newbookings/' + newbookingSaveRes.body._id)
              .send(newbooking)
              .expect(200)
              .end(function (newbookingUpdateErr, newbookingUpdateRes) {
                // Handle Newbooking update error
                if (newbookingUpdateErr) {
                  return done(newbookingUpdateErr);
                }

                // Set assertions
                (newbookingUpdateRes.body._id).should.equal(newbookingSaveRes.body._id);
                (newbookingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Newbookings if not signed in', function (done) {
    // Create new Newbooking model instance
    var newbookingObj = new Newbooking(newbooking);

    // Save the newbooking
    newbookingObj.save(function () {
      // Request Newbookings
      request(app).get('/api/newbookings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Newbooking if not signed in', function (done) {
    // Create new Newbooking model instance
    var newbookingObj = new Newbooking(newbooking);

    // Save the Newbooking
    newbookingObj.save(function () {
      request(app).get('/api/newbookings/' + newbookingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', newbooking.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Newbooking with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/newbookings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Newbooking is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Newbooking which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Newbooking
    request(app).get('/api/newbookings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Newbooking with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Newbooking if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Newbooking
        agent.post('/api/newbookings')
          .send(newbooking)
          .expect(200)
          .end(function (newbookingSaveErr, newbookingSaveRes) {
            // Handle Newbooking save error
            if (newbookingSaveErr) {
              return done(newbookingSaveErr);
            }

            // Delete an existing Newbooking
            agent.delete('/api/newbookings/' + newbookingSaveRes.body._id)
              .send(newbooking)
              .expect(200)
              .end(function (newbookingDeleteErr, newbookingDeleteRes) {
                // Handle newbooking error error
                if (newbookingDeleteErr) {
                  return done(newbookingDeleteErr);
                }

                // Set assertions
                (newbookingDeleteRes.body._id).should.equal(newbookingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Newbooking if not signed in', function (done) {
    // Set Newbooking user
    newbooking.user = user;

    // Create new Newbooking model instance
    var newbookingObj = new Newbooking(newbooking);

    // Save the Newbooking
    newbookingObj.save(function () {
      // Try deleting Newbooking
      request(app).delete('/api/newbookings/' + newbookingObj._id)
        .expect(403)
        .end(function (newbookingDeleteErr, newbookingDeleteRes) {
          // Set message assertion
          (newbookingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Newbooking error error
          done(newbookingDeleteErr);
        });

    });
  });

  it('should be able to get a single Newbooking that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Newbooking
          agent.post('/api/newbookings')
            .send(newbooking)
            .expect(200)
            .end(function (newbookingSaveErr, newbookingSaveRes) {
              // Handle Newbooking save error
              if (newbookingSaveErr) {
                return done(newbookingSaveErr);
              }

              // Set assertions on new Newbooking
              (newbookingSaveRes.body.name).should.equal(newbooking.name);
              should.exist(newbookingSaveRes.body.user);
              should.equal(newbookingSaveRes.body.user._id, orphanId);

              // force the Newbooking to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Newbooking
                    agent.get('/api/newbookings/' + newbookingSaveRes.body._id)
                      .expect(200)
                      .end(function (newbookingInfoErr, newbookingInfoRes) {
                        // Handle Newbooking error
                        if (newbookingInfoErr) {
                          return done(newbookingInfoErr);
                        }

                        // Set assertions
                        (newbookingInfoRes.body._id).should.equal(newbookingSaveRes.body._id);
                        (newbookingInfoRes.body.name).should.equal(newbooking.name);
                        should.equal(newbookingInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Newbooking.remove().exec(done);
    });
  });
});
