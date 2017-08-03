'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Paymentstatus Schema
 */
var PaymentstatusSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: 'Please fill Paymentstatus name',
    trim: true
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

mongoose.model('Paymentstatus', PaymentstatusSchema);
