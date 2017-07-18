'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Paymentstatus = mongoose.model('Paymentstatus'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  paymentstatus;

/**
 * Paymentstatus routes tests
 */
describe('Paymentstatus CRUD tests', function () {

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

    // Save a user to the test db and create new Paymentstatus
    user.save(function () {
      paymentstatus = {
        name: 'Paymentstatus name'
      };

      done();
    });
  });

  it('should be able to save a Paymentstatus if logged in', function (done) {
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

        // Save a new Paymentstatus
        agent.post('/api/paymentstatuses')
          .send(paymentstatus)
          .expect(200)
          .end(function (paymentstatusSaveErr, paymentstatusSaveRes) {
            // Handle Paymentstatus save error
            if (paymentstatusSaveErr) {
              return done(paymentstatusSaveErr);
            }

            // Get a list of Paymentstatuses
            agent.get('/api/paymentstatuses')
              .end(function (paymentstatusesGetErr, paymentstatusesGetRes) {
                // Handle Paymentstatuses save error
                if (paymentstatusesGetErr) {
                  return done(paymentstatusesGetErr);
                }

                // Get Paymentstatuses list
                var paymentstatuses = paymentstatusesGetRes.body;

                // Set assertions
                (paymentstatuses[0].user._id).should.equal(userId);
                (paymentstatuses[0].name).should.match('Paymentstatus name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Paymentstatus if not logged in', function (done) {
    agent.post('/api/paymentstatuses')
      .send(paymentstatus)
      .expect(403)
      .end(function (paymentstatusSaveErr, paymentstatusSaveRes) {
        // Call the assertion callback
        done(paymentstatusSaveErr);
      });
  });

  it('should not be able to save an Paymentstatus if no name is provided', function (done) {
    // Invalidate name field
    paymentstatus.name = '';

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

        // Save a new Paymentstatus
        agent.post('/api/paymentstatuses')
          .send(paymentstatus)
          .expect(400)
          .end(function (paymentstatusSaveErr, paymentstatusSaveRes) {
            // Set message assertion
            (paymentstatusSaveRes.body.message).should.match('Please fill Paymentstatus name');

            // Handle Paymentstatus save error
            done(paymentstatusSaveErr);
          });
      });
  });

  it('should be able to update an Paymentstatus if signed in', function (done) {
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

        // Save a new Paymentstatus
        agent.post('/api/paymentstatuses')
          .send(paymentstatus)
          .expect(200)
          .end(function (paymentstatusSaveErr, paymentstatusSaveRes) {
            // Handle Paymentstatus save error
            if (paymentstatusSaveErr) {
              return done(paymentstatusSaveErr);
            }

            // Update Paymentstatus name
            paymentstatus.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Paymentstatus
            agent.put('/api/paymentstatuses/' + paymentstatusSaveRes.body._id)
              .send(paymentstatus)
              .expect(200)
              .end(function (paymentstatusUpdateErr, paymentstatusUpdateRes) {
                // Handle Paymentstatus update error
                if (paymentstatusUpdateErr) {
                  return done(paymentstatusUpdateErr);
                }

                // Set assertions
                (paymentstatusUpdateRes.body._id).should.equal(paymentstatusSaveRes.body._id);
                (paymentstatusUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Paymentstatuses if not signed in', function (done) {
    // Create new Paymentstatus model instance
    var paymentstatusObj = new Paymentstatus(paymentstatus);

    // Save the paymentstatus
    paymentstatusObj.save(function () {
      // Request Paymentstatuses
      request(app).get('/api/paymentstatuses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Paymentstatus if not signed in', function (done) {
    // Create new Paymentstatus model instance
    var paymentstatusObj = new Paymentstatus(paymentstatus);

    // Save the Paymentstatus
    paymentstatusObj.save(function () {
      request(app).get('/api/paymentstatuses/' + paymentstatusObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', paymentstatus.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Paymentstatus with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/paymentstatuses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Paymentstatus is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Paymentstatus which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Paymentstatus
    request(app).get('/api/paymentstatuses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Paymentstatus with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Paymentstatus if signed in', function (done) {
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

        // Save a new Paymentstatus
        agent.post('/api/paymentstatuses')
          .send(paymentstatus)
          .expect(200)
          .end(function (paymentstatusSaveErr, paymentstatusSaveRes) {
            // Handle Paymentstatus save error
            if (paymentstatusSaveErr) {
              return done(paymentstatusSaveErr);
            }

            // Delete an existing Paymentstatus
            agent.delete('/api/paymentstatuses/' + paymentstatusSaveRes.body._id)
              .send(paymentstatus)
              .expect(200)
              .end(function (paymentstatusDeleteErr, paymentstatusDeleteRes) {
                // Handle paymentstatus error error
                if (paymentstatusDeleteErr) {
                  return done(paymentstatusDeleteErr);
                }

                // Set assertions
                (paymentstatusDeleteRes.body._id).should.equal(paymentstatusSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Paymentstatus if not signed in', function (done) {
    // Set Paymentstatus user
    paymentstatus.user = user;

    // Create new Paymentstatus model instance
    var paymentstatusObj = new Paymentstatus(paymentstatus);

    // Save the Paymentstatus
    paymentstatusObj.save(function () {
      // Try deleting Paymentstatus
      request(app).delete('/api/paymentstatuses/' + paymentstatusObj._id)
        .expect(403)
        .end(function (paymentstatusDeleteErr, paymentstatusDeleteRes) {
          // Set message assertion
          (paymentstatusDeleteRes.body.message).should.match('User is not authorized');

          // Handle Paymentstatus error error
          done(paymentstatusDeleteErr);
        });

    });
  });

  it('should be able to get a single Paymentstatus that has an orphaned user reference', function (done) {
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

          // Save a new Paymentstatus
          agent.post('/api/paymentstatuses')
            .send(paymentstatus)
            .expect(200)
            .end(function (paymentstatusSaveErr, paymentstatusSaveRes) {
              // Handle Paymentstatus save error
              if (paymentstatusSaveErr) {
                return done(paymentstatusSaveErr);
              }

              // Set assertions on new Paymentstatus
              (paymentstatusSaveRes.body.name).should.equal(paymentstatus.name);
              should.exist(paymentstatusSaveRes.body.user);
              should.equal(paymentstatusSaveRes.body.user._id, orphanId);

              // force the Paymentstatus to have an orphaned user reference
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

                    // Get the Paymentstatus
                    agent.get('/api/paymentstatuses/' + paymentstatusSaveRes.body._id)
                      .expect(200)
                      .end(function (paymentstatusInfoErr, paymentstatusInfoRes) {
                        // Handle Paymentstatus error
                        if (paymentstatusInfoErr) {
                          return done(paymentstatusInfoErr);
                        }

                        // Set assertions
                        (paymentstatusInfoRes.body._id).should.equal(paymentstatusSaveRes.body._id);
                        (paymentstatusInfoRes.body.name).should.equal(paymentstatus.name);
                        should.equal(paymentstatusInfoRes.body.user, undefined);

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
      Paymentstatus.remove().exec(done);
    });
  });
});
