'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Counter = mongoose.model('Counter'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  counter;

/**
 * Counter routes tests
 */
describe('Counter CRUD tests', function () {

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

    // Save a user to the test db and create new Counter
    user.save(function () {
      counter = {
        name: 'Counter name'
      };

      done();
    });
  });

  it('should be able to save a Counter if logged in', function (done) {
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

        // Save a new Counter
        agent.post('/api/counters')
          .send(counter)
          .expect(200)
          .end(function (counterSaveErr, counterSaveRes) {
            // Handle Counter save error
            if (counterSaveErr) {
              return done(counterSaveErr);
            }

            // Get a list of Counters
            agent.get('/api/counters')
              .end(function (countersGetErr, countersGetRes) {
                // Handle Counters save error
                if (countersGetErr) {
                  return done(countersGetErr);
                }

                // Get Counters list
                var counters = countersGetRes.body;

                // Set assertions
                (counters[0].user._id).should.equal(userId);
                (counters[0].name).should.match('Counter name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Counter if not logged in', function (done) {
    agent.post('/api/counters')
      .send(counter)
      .expect(403)
      .end(function (counterSaveErr, counterSaveRes) {
        // Call the assertion callback
        done(counterSaveErr);
      });
  });

  it('should not be able to save an Counter if no name is provided', function (done) {
    // Invalidate name field
    counter.name = '';

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

        // Save a new Counter
        agent.post('/api/counters')
          .send(counter)
          .expect(400)
          .end(function (counterSaveErr, counterSaveRes) {
            // Set message assertion
            (counterSaveRes.body.message).should.match('Please fill Counter name');

            // Handle Counter save error
            done(counterSaveErr);
          });
      });
  });

  it('should be able to update an Counter if signed in', function (done) {
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

        // Save a new Counter
        agent.post('/api/counters')
          .send(counter)
          .expect(200)
          .end(function (counterSaveErr, counterSaveRes) {
            // Handle Counter save error
            if (counterSaveErr) {
              return done(counterSaveErr);
            }

            // Update Counter name
            counter.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Counter
            agent.put('/api/counters/' + counterSaveRes.body._id)
              .send(counter)
              .expect(200)
              .end(function (counterUpdateErr, counterUpdateRes) {
                // Handle Counter update error
                if (counterUpdateErr) {
                  return done(counterUpdateErr);
                }

                // Set assertions
                (counterUpdateRes.body._id).should.equal(counterSaveRes.body._id);
                (counterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Counters if not signed in', function (done) {
    // Create new Counter model instance
    var counterObj = new Counter(counter);

    // Save the counter
    counterObj.save(function () {
      // Request Counters
      request(app).get('/api/counters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Counter if not signed in', function (done) {
    // Create new Counter model instance
    var counterObj = new Counter(counter);

    // Save the Counter
    counterObj.save(function () {
      request(app).get('/api/counters/' + counterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', counter.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Counter with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/counters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Counter is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Counter which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Counter
    request(app).get('/api/counters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Counter with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Counter if signed in', function (done) {
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

        // Save a new Counter
        agent.post('/api/counters')
          .send(counter)
          .expect(200)
          .end(function (counterSaveErr, counterSaveRes) {
            // Handle Counter save error
            if (counterSaveErr) {
              return done(counterSaveErr);
            }

            // Delete an existing Counter
            agent.delete('/api/counters/' + counterSaveRes.body._id)
              .send(counter)
              .expect(200)
              .end(function (counterDeleteErr, counterDeleteRes) {
                // Handle counter error error
                if (counterDeleteErr) {
                  return done(counterDeleteErr);
                }

                // Set assertions
                (counterDeleteRes.body._id).should.equal(counterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Counter if not signed in', function (done) {
    // Set Counter user
    counter.user = user;

    // Create new Counter model instance
    var counterObj = new Counter(counter);

    // Save the Counter
    counterObj.save(function () {
      // Try deleting Counter
      request(app).delete('/api/counters/' + counterObj._id)
        .expect(403)
        .end(function (counterDeleteErr, counterDeleteRes) {
          // Set message assertion
          (counterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Counter error error
          done(counterDeleteErr);
        });

    });
  });

  it('should be able to get a single Counter that has an orphaned user reference', function (done) {
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

          // Save a new Counter
          agent.post('/api/counters')
            .send(counter)
            .expect(200)
            .end(function (counterSaveErr, counterSaveRes) {
              // Handle Counter save error
              if (counterSaveErr) {
                return done(counterSaveErr);
              }

              // Set assertions on new Counter
              (counterSaveRes.body.name).should.equal(counter.name);
              should.exist(counterSaveRes.body.user);
              should.equal(counterSaveRes.body.user._id, orphanId);

              // force the Counter to have an orphaned user reference
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

                    // Get the Counter
                    agent.get('/api/counters/' + counterSaveRes.body._id)
                      .expect(200)
                      .end(function (counterInfoErr, counterInfoRes) {
                        // Handle Counter error
                        if (counterInfoErr) {
                          return done(counterInfoErr);
                        }

                        // Set assertions
                        (counterInfoRes.body._id).should.equal(counterSaveRes.body._id);
                        (counterInfoRes.body.name).should.equal(counter.name);
                        should.equal(counterInfoRes.body.user, undefined);

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
      Counter.remove().exec(done);
    });
  });
});
