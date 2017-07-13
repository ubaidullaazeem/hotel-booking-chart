'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Hall = mongoose.model('Hall'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  hall;

/**
 * Hall routes tests
 */
describe('Hall CRUD tests', function () {

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

    // Save a user to the test db and create new Hall
    user.save(function () {
      hall = {
        name: 'Hall name'
      };

      done();
    });
  });

  it('should be able to save a Hall if logged in', function (done) {
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

        // Save a new Hall
        agent.post('/api/halls')
          .send(hall)
          .expect(200)
          .end(function (hallSaveErr, hallSaveRes) {
            // Handle Hall save error
            if (hallSaveErr) {
              return done(hallSaveErr);
            }

            // Get a list of Halls
            agent.get('/api/halls')
              .end(function (hallsGetErr, hallsGetRes) {
                // Handle Halls save error
                if (hallsGetErr) {
                  return done(hallsGetErr);
                }

                // Get Halls list
                var halls = hallsGetRes.body;

                // Set assertions
                (halls[0].user._id).should.equal(userId);
                (halls[0].name).should.match('Hall name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Hall if not logged in', function (done) {
    agent.post('/api/halls')
      .send(hall)
      .expect(403)
      .end(function (hallSaveErr, hallSaveRes) {
        // Call the assertion callback
        done(hallSaveErr);
      });
  });

  it('should not be able to save an Hall if no name is provided', function (done) {
    // Invalidate name field
    hall.name = '';

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

        // Save a new Hall
        agent.post('/api/halls')
          .send(hall)
          .expect(400)
          .end(function (hallSaveErr, hallSaveRes) {
            // Set message assertion
            (hallSaveRes.body.message).should.match('Please fill Hall name');

            // Handle Hall save error
            done(hallSaveErr);
          });
      });
  });

  it('should be able to update an Hall if signed in', function (done) {
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

        // Save a new Hall
        agent.post('/api/halls')
          .send(hall)
          .expect(200)
          .end(function (hallSaveErr, hallSaveRes) {
            // Handle Hall save error
            if (hallSaveErr) {
              return done(hallSaveErr);
            }

            // Update Hall name
            hall.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Hall
            agent.put('/api/halls/' + hallSaveRes.body._id)
              .send(hall)
              .expect(200)
              .end(function (hallUpdateErr, hallUpdateRes) {
                // Handle Hall update error
                if (hallUpdateErr) {
                  return done(hallUpdateErr);
                }

                // Set assertions
                (hallUpdateRes.body._id).should.equal(hallSaveRes.body._id);
                (hallUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Halls if not signed in', function (done) {
    // Create new Hall model instance
    var hallObj = new Hall(hall);

    // Save the hall
    hallObj.save(function () {
      // Request Halls
      request(app).get('/api/halls')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Hall if not signed in', function (done) {
    // Create new Hall model instance
    var hallObj = new Hall(hall);

    // Save the Hall
    hallObj.save(function () {
      request(app).get('/api/halls/' + hallObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', hall.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Hall with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/halls/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Hall is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Hall which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Hall
    request(app).get('/api/halls/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Hall with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Hall if signed in', function (done) {
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

        // Save a new Hall
        agent.post('/api/halls')
          .send(hall)
          .expect(200)
          .end(function (hallSaveErr, hallSaveRes) {
            // Handle Hall save error
            if (hallSaveErr) {
              return done(hallSaveErr);
            }

            // Delete an existing Hall
            agent.delete('/api/halls/' + hallSaveRes.body._id)
              .send(hall)
              .expect(200)
              .end(function (hallDeleteErr, hallDeleteRes) {
                // Handle hall error error
                if (hallDeleteErr) {
                  return done(hallDeleteErr);
                }

                // Set assertions
                (hallDeleteRes.body._id).should.equal(hallSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Hall if not signed in', function (done) {
    // Set Hall user
    hall.user = user;

    // Create new Hall model instance
    var hallObj = new Hall(hall);

    // Save the Hall
    hallObj.save(function () {
      // Try deleting Hall
      request(app).delete('/api/halls/' + hallObj._id)
        .expect(403)
        .end(function (hallDeleteErr, hallDeleteRes) {
          // Set message assertion
          (hallDeleteRes.body.message).should.match('User is not authorized');

          // Handle Hall error error
          done(hallDeleteErr);
        });

    });
  });

  it('should be able to get a single Hall that has an orphaned user reference', function (done) {
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

          // Save a new Hall
          agent.post('/api/halls')
            .send(hall)
            .expect(200)
            .end(function (hallSaveErr, hallSaveRes) {
              // Handle Hall save error
              if (hallSaveErr) {
                return done(hallSaveErr);
              }

              // Set assertions on new Hall
              (hallSaveRes.body.name).should.equal(hall.name);
              should.exist(hallSaveRes.body.user);
              should.equal(hallSaveRes.body.user._id, orphanId);

              // force the Hall to have an orphaned user reference
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

                    // Get the Hall
                    agent.get('/api/halls/' + hallSaveRes.body._id)
                      .expect(200)
                      .end(function (hallInfoErr, hallInfoRes) {
                        // Handle Hall error
                        if (hallInfoErr) {
                          return done(hallInfoErr);
                        }

                        // Set assertions
                        (hallInfoRes.body._id).should.equal(hallSaveRes.body._id);
                        (hallInfoRes.body.name).should.equal(hall.name);
                        should.equal(hallInfoRes.body.user, undefined);

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
      Hall.remove().exec(done);
    });
  });
});
