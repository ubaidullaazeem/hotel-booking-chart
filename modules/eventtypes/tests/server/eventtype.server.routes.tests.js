'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Eventtype = mongoose.model('Eventtype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  eventtype;

/**
 * Eventtype routes tests
 */
describe('Eventtype CRUD tests', function () {

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

    // Save a user to the test db and create new Eventtype
    user.save(function () {
      eventtype = {
        name: 'Eventtype name'
      };

      done();
    });
  });

  it('should be able to save a Eventtype if logged in', function (done) {
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

        // Save a new Eventtype
        agent.post('/api/eventtypes')
          .send(eventtype)
          .expect(200)
          .end(function (eventtypeSaveErr, eventtypeSaveRes) {
            // Handle Eventtype save error
            if (eventtypeSaveErr) {
              return done(eventtypeSaveErr);
            }

            // Get a list of Eventtypes
            agent.get('/api/eventtypes')
              .end(function (eventtypesGetErr, eventtypesGetRes) {
                // Handle Eventtypes save error
                if (eventtypesGetErr) {
                  return done(eventtypesGetErr);
                }

                // Get Eventtypes list
                var eventtypes = eventtypesGetRes.body;

                // Set assertions
                (eventtypes[0].user._id).should.equal(userId);
                (eventtypes[0].name).should.match('Eventtype name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Eventtype if not logged in', function (done) {
    agent.post('/api/eventtypes')
      .send(eventtype)
      .expect(403)
      .end(function (eventtypeSaveErr, eventtypeSaveRes) {
        // Call the assertion callback
        done(eventtypeSaveErr);
      });
  });

  it('should not be able to save an Eventtype if no name is provided', function (done) {
    // Invalidate name field
    eventtype.name = '';

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

        // Save a new Eventtype
        agent.post('/api/eventtypes')
          .send(eventtype)
          .expect(400)
          .end(function (eventtypeSaveErr, eventtypeSaveRes) {
            // Set message assertion
            (eventtypeSaveRes.body.message).should.match('Please fill Eventtype name');

            // Handle Eventtype save error
            done(eventtypeSaveErr);
          });
      });
  });

  it('should be able to update an Eventtype if signed in', function (done) {
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

        // Save a new Eventtype
        agent.post('/api/eventtypes')
          .send(eventtype)
          .expect(200)
          .end(function (eventtypeSaveErr, eventtypeSaveRes) {
            // Handle Eventtype save error
            if (eventtypeSaveErr) {
              return done(eventtypeSaveErr);
            }

            // Update Eventtype name
            eventtype.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Eventtype
            agent.put('/api/eventtypes/' + eventtypeSaveRes.body._id)
              .send(eventtype)
              .expect(200)
              .end(function (eventtypeUpdateErr, eventtypeUpdateRes) {
                // Handle Eventtype update error
                if (eventtypeUpdateErr) {
                  return done(eventtypeUpdateErr);
                }

                // Set assertions
                (eventtypeUpdateRes.body._id).should.equal(eventtypeSaveRes.body._id);
                (eventtypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Eventtypes if not signed in', function (done) {
    // Create new Eventtype model instance
    var eventtypeObj = new Eventtype(eventtype);

    // Save the eventtype
    eventtypeObj.save(function () {
      // Request Eventtypes
      request(app).get('/api/eventtypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Eventtype if not signed in', function (done) {
    // Create new Eventtype model instance
    var eventtypeObj = new Eventtype(eventtype);

    // Save the Eventtype
    eventtypeObj.save(function () {
      request(app).get('/api/eventtypes/' + eventtypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', eventtype.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Eventtype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/eventtypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Eventtype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Eventtype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Eventtype
    request(app).get('/api/eventtypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Eventtype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Eventtype if signed in', function (done) {
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

        // Save a new Eventtype
        agent.post('/api/eventtypes')
          .send(eventtype)
          .expect(200)
          .end(function (eventtypeSaveErr, eventtypeSaveRes) {
            // Handle Eventtype save error
            if (eventtypeSaveErr) {
              return done(eventtypeSaveErr);
            }

            // Delete an existing Eventtype
            agent.delete('/api/eventtypes/' + eventtypeSaveRes.body._id)
              .send(eventtype)
              .expect(200)
              .end(function (eventtypeDeleteErr, eventtypeDeleteRes) {
                // Handle eventtype error error
                if (eventtypeDeleteErr) {
                  return done(eventtypeDeleteErr);
                }

                // Set assertions
                (eventtypeDeleteRes.body._id).should.equal(eventtypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Eventtype if not signed in', function (done) {
    // Set Eventtype user
    eventtype.user = user;

    // Create new Eventtype model instance
    var eventtypeObj = new Eventtype(eventtype);

    // Save the Eventtype
    eventtypeObj.save(function () {
      // Try deleting Eventtype
      request(app).delete('/api/eventtypes/' + eventtypeObj._id)
        .expect(403)
        .end(function (eventtypeDeleteErr, eventtypeDeleteRes) {
          // Set message assertion
          (eventtypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Eventtype error error
          done(eventtypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Eventtype that has an orphaned user reference', function (done) {
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

          // Save a new Eventtype
          agent.post('/api/eventtypes')
            .send(eventtype)
            .expect(200)
            .end(function (eventtypeSaveErr, eventtypeSaveRes) {
              // Handle Eventtype save error
              if (eventtypeSaveErr) {
                return done(eventtypeSaveErr);
              }

              // Set assertions on new Eventtype
              (eventtypeSaveRes.body.name).should.equal(eventtype.name);
              should.exist(eventtypeSaveRes.body.user);
              should.equal(eventtypeSaveRes.body.user._id, orphanId);

              // force the Eventtype to have an orphaned user reference
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

                    // Get the Eventtype
                    agent.get('/api/eventtypes/' + eventtypeSaveRes.body._id)
                      .expect(200)
                      .end(function (eventtypeInfoErr, eventtypeInfoRes) {
                        // Handle Eventtype error
                        if (eventtypeInfoErr) {
                          return done(eventtypeInfoErr);
                        }

                        // Set assertions
                        (eventtypeInfoRes.body._id).should.equal(eventtypeSaveRes.body._id);
                        (eventtypeInfoRes.body.name).should.equal(eventtype.name);
                        should.equal(eventtypeInfoRes.body.user, undefined);

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
      Eventtype.remove().exec(done);
    });
  });
});
