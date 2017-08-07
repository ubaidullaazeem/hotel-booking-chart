'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Eventtype Schema
 */
var EventtypeSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: 'Please fill Eventtype name',
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: 'Please fill Eventtype display name',
    trim: true,
  },
  colour:{
    name:{
      type: String,
      unique: true,
      required: 'Please fill colour name',
      trim: true
    },
    code:{
      type: String,
      required: 'Please fill colour code',
      trim: true
    }
  }
},
{
    timestamps: true
});

mongoose.model('Eventtype', EventtypeSchema);
