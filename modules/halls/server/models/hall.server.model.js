'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hall Schema
 */
var HallSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Hall name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Hall', HallSchema);
