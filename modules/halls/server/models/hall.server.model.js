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
    unique: true,
    required: 'Please fill Hall name',
    trim: true,
    lowercase: true
  },
  powerConsumpationCharges: Number,
  cleaningCharges: Number,
  CGSTTax: Number,
  SGSTTax: Number,
  rateSummaries: [{
    rate: Number,
    effectiveDate: Date
  }],
},
{
    timestamps: true
});

mongoose.model('Hall', HallSchema);
