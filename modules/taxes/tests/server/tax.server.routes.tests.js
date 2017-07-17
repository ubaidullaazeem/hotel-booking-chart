'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tax = mongoose.model('Tax'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  tax;

/**
 * Tax routes tests
 */
describe('Tax CRUD tests', function () {

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

    // Save a user to the test db and create new Tax
    user.save(function () {
      tax = {
        name: 'Tax name'
      };

      done();
    });
  });

  it('should be able to save a Tax if logged in', function (done) {
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

        // Save a new Tax
        agent.post('/api/taxes')
          .send(tax)
          .expect(200)
          .end(function (taxSaveErr, taxSaveRes) {
            // Handle Tax save error
            if (taxSaveErr) {
              return done(taxSaveErr);
            }

            // Get a list of Taxes
            agent.get('/api/taxes')
              .end(function (taxesGetErr, taxesGetRes) {
                // Handle Taxes save error
                if (taxesGetErr) {
                  return done(taxesGetErr);
                }

                // Get Taxes list
                var taxes = taxesGetRes.body;

                // Set assertions
                (taxes[0].user._id).should.equal(userId);
                (taxes[0].name).should.match('Tax name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Tax if not logged in', function (done) {
    agent.post('/api/taxes')
      .send(tax)
      .expect(403)
      .end(function (taxSaveErr, taxSaveRes) {
        // Call the assertion callback
        done(taxSaveErr);
      });
  });

  it('should not be able to save an Tax if no name is provided', function (done) {
    // Invalidate name field
    tax.name = '';

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

        // Save a new Tax
        agent.post('/api/taxes')
          .send(tax)
          .expect(400)
          .end(function (taxSaveErr, taxSaveRes) {
            // Set message assertion
            (taxSaveRes.body.message).should.match('Please fill Tax name');

            // Handle Tax save error
            done(taxSaveErr);
          });
      });
  });

  it('should be able to update an Tax if signed in', function (done) {
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

        // Save a new Tax
        agent.post('/api/taxes')
          .send(tax)
          .expect(200)
          .end(function (taxSaveErr, taxSaveRes) {
            // Handle Tax save error
            if (taxSaveErr) {
              return done(taxSaveErr);
            }

            // Update Tax name
            tax.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Tax
            agent.put('/api/taxes/' + taxSaveRes.body._id)
              .send(tax)
              .expect(200)
              .end(function (taxUpdateErr, taxUpdateRes) {
                // Handle Tax update error
                if (taxUpdateErr) {
                  return done(taxUpdateErr);
                }

                // Set assertions
                (taxUpdateRes.body._id).should.equal(taxSaveRes.body._id);
                (taxUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Taxes if not signed in', function (done) {
    // Create new Tax model instance
    var taxObj = new Tax(tax);

    // Save the tax
    taxObj.save(function () {
      // Request Taxes
      request(app).get('/api/taxes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Tax if not signed in', function (done) {
    // Create new Tax model instance
    var taxObj = new Tax(tax);

    // Save the Tax
    taxObj.save(function () {
      request(app).get('/api/taxes/' + taxObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', tax.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Tax with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/taxes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tax is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Tax which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Tax
    request(app).get('/api/taxes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Tax with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Tax if signed in', function (done) {
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

        // Save a new Tax
        agent.post('/api/taxes')
          .send(tax)
          .expect(200)
          .end(function (taxSaveErr, taxSaveRes) {
            // Handle Tax save error
            if (taxSaveErr) {
              return done(taxSaveErr);
            }

            // Delete an existing Tax
            agent.delete('/api/taxes/' + taxSaveRes.body._id)
              .send(tax)
              .expect(200)
              .end(function (taxDeleteErr, taxDeleteRes) {
                // Handle tax error error
                if (taxDeleteErr) {
                  return done(taxDeleteErr);
                }

                // Set assertions
                (taxDeleteRes.body._id).should.equal(taxSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Tax if not signed in', function (done) {
    // Set Tax user
    tax.user = user;

    // Create new Tax model instance
    var taxObj = new Tax(tax);

    // Save the Tax
    taxObj.save(function () {
      // Try deleting Tax
      request(app).delete('/api/taxes/' + taxObj._id)
        .expect(403)
        .end(function (taxDeleteErr, taxDeleteRes) {
          // Set message assertion
          (taxDeleteRes.body.message).should.match('User is not authorized');

          // Handle Tax error error
          done(taxDeleteErr);
        });

    });
  });

  it('should be able to get a single Tax that has an orphaned user reference', function (done) {
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

          // Save a new Tax
          agent.post('/api/taxes')
            .send(tax)
            .expect(200)
            .end(function (taxSaveErr, taxSaveRes) {
              // Handle Tax save error
              if (taxSaveErr) {
                return done(taxSaveErr);
              }

              // Set assertions on new Tax
              (taxSaveRes.body.name).should.equal(tax.name);
              should.exist(taxSaveRes.body.user);
              should.equal(taxSaveRes.body.user._id, orphanId);

              // force the Tax to have an orphaned user reference
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

                    // Get the Tax
                    agent.get('/api/taxes/' + taxSaveRes.body._id)
                      .expect(200)
                      .end(function (taxInfoErr, taxInfoRes) {
                        // Handle Tax error
                        if (taxInfoErr) {
                          return done(taxInfoErr);
                        }

                        // Set assertions
                        (taxInfoRes.body._id).should.equal(taxSaveRes.body._id);
                        (taxInfoRes.body.name).should.equal(tax.name);
                        should.equal(taxInfoRes.body.user, undefined);

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
      Tax.remove().exec(done);
    });
  });
});
