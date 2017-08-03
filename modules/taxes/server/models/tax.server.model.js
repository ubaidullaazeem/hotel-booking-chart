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
  rateSummaries: [{
    percentage: Number,
    effectiveDate: Date
  }],
},
{
    timestamps: true
});

mongoose.model('Tax', TaxSchema);
