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
  displayName:{
    type: String,
    required: 'Please fill Hall display name',
    trim: true    
  },
  description:{
    type: String,
    default: '',
    trim: true
  },
  rateSummaries: [{
    rate: Number,
    powerConsumpationCharges: Number,
    cleaningCharges: Number,
    CGSTTax: Number,
    SGSTTax: Number,
    effectiveDate: Date
  }],
},
{
    timestamps: true
});

mongoose.model('Hall', HallSchema);
