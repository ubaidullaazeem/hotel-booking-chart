'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Newbooking Schema
 */
var NewbookingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Newbooking name',
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

mongoose.model('Newbooking', NewbookingSchema);
