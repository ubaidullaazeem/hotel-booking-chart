'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Counter Schema
 */
var CounterSchema = new Schema({
  counterName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  seq: {
    type: Number
  }
},
{
    timestamps: true
});

mongoose.model('Counter', CounterSchema);
