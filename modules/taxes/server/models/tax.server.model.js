'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tax Schema
 */
var TaxSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: 'Please fill tax name',
    trim: true
  },
  percentage:{
    type: Number,
    required: 'Please fill tax percentage'
  }
},
{
    timestamps: true
});

mongoose.model('Tax', TaxSchema);
