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
    trim: true
  },
  rate:{
    type: Number,
    required: 'Please fill Hall rate'
  }
},
{
    timestamps: true
});

mongoose.model('Hall', HallSchema);
