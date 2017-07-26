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
  mSelectedHalls: {
    type: Array,
    default: '',
    required: 'Please select halls',
    trim: true
  },
  mStartDateTime: {
    type: Date
  },
  mEndDateTime: {
    type: Date
  },
  mExtraStartDateTime: {
    type: Date
  },
  mExtraEndDateTime: {
    type: Date
  },
  mSelectedEventType: {
    type: Object,
    default: '',
    required: 'Please select event type',
    trim: true
  },
  mOtherEvent: {
    type: String,
    default: '',
    trim: true
  },
  mDescription: {
    type: String,
    default: '',
    trim: true
  },
  mName: {
    type: String,
    default: '',
    required: 'Please enter customer name',
    trim: true
  },
  mPhone: {
    type: String,
    default: '',
    required: 'Please enter customer mobile number',
    trim: true
  },
  mEmail: {
    type: String,
    default: '',
    trim: true
  },
  mAddress: {
    type: String,
    default: '',
    trim: true
  },
  mPhotoId: {
    type: String,
    default: '',
    trim: true
  },
  mSelectedPaymentStatus: {
    type: Object,
    default: '',
    required: 'Please select payment status',
    trim: true
  },
  mManagerName: {
    type: String,
    default: '',
    required: 'Please enter manager name',
    trim: true
  },
  mBasicCost: {
    type: Number,
    default: '',
    required: 'Please enter rent amount',
    trim: true
  },
  mElectricityCharges: {
    type: Number,
    default: '',
    required: 'Please enter electricity charges',
    trim: true
  },
  mCleaningCharges: {
    type: Number,
    default: '',
    required: 'Please enter cleaning charges',
    trim: true
  },
  mGeneratorCharges: {
    type: Number,
    default: '',
    required: 'Please enter generator charges',
    trim: true
  },
  mMiscellaneousCharges: {
    type: Number,
    default: '',
    required: 'Please enter miscellaneous charges',
    trim: true
  },
  mDiscount: {
    type: Number,
    default: '',
    required: 'Please enter discount amount',
    trim: true
  },
  mSubTotal: {
    type: Number,
    default: '',
    required: 'Please enter subtotal amount',
    trim: true
  },
  mCGST: {
    type: Number,
    default: '',
    required: 'Please enter CGST tax',
    trim: true
  },
  mSGST: {
    type: Number,
    default: '',
    required: 'Please enter SGST tax',
    trim: true
  },
  mGrandTotal: {
    type: Number,
    default: '',
    required: 'Please enter grand total',
    trim: true
  },
  mPaymentHistories: [{
    amountPaid : Number,
    paidDate : Date,
    paymentMode : String
  }],
  mBalanceDue: {
    type: Number,
    default: '',
    required: 'Please enter balance due amount',
    trim: true
  }
},
{
    timestamps: true
});

mongoose.model('Newbooking', NewbookingSchema);
