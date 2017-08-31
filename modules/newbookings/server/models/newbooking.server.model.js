'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,  
  Counter = mongoose.model('Counter');

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
  date: {
    type: Number
  },
  month: {
    type: Number
  },
  year: {
    type: Number
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
  mGSTINNumber: {
    type: String,
    default: '',
    trim: true
  },
  mPhotoId: {
    type: String,
    default: '',
    trim: true
  },
  mPhotoIdPath:{
    type:String,
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
  mPendingSubTotal: {
    type: Number,
    default: '',
    required: 'Please enter pending subtotal amount',
    trim: true
  },
  mPendingCGST: {
    type: Number,
    default: '',
    required: 'Please enter pending CGST tax',
    trim: true
  },
  mPendingSGST: {
    type: Number,
    default: '',
    required: 'Please enter pending SGST tax',
    trim: true
  },
  mPendingGrandTotal: {
    type: Number,
    default: '',
    required: 'Please enter pending grand total',
    trim: true
  },
  mReceivedSubTotal: {
    type: Number,
    default: '',
    required: 'Please enter received subtotal amount',
    trim: true
  },
  mReceivedCGST: {
    type: Number,
    default: '',
    required: 'Please enter received CGST tax',
    trim: true
  },
  mReceivedSGST: {
    type: Number,
    default: '',
    required: 'Please enter received SGST tax',
    trim: true
  },
  mReceivedGrandTotal: {
    type: Number,
    default: '',
    required: 'Please enter received grand total',
    trim: true
  },
  mPaymentHistories: [{
    amountPaid : Number,
    paidDate : Date,
    paymentMode : String,
    details : String,
    drawnOn : String,
    CGSTPercent : Number,
    SGSTPercent : Number,
    paidSubTotal : Number,
    paidCGST : Number,
    paidSGST : Number,
    receiptNo : Number,
    receiptDate: Date,
    isDeletedPayment: {
      type: Boolean,
      default: false
    }
  }],
  mBalanceDue: {
    type: Number,
    default: '',
    required: 'Please enter balance due amount',
    trim: true
  },
  invoiceNo:{
    type: Number
  },
  invoiceDate:{
    type: Date
  }
},
{
    timestamps: true
});

mongoose.model('Newbooking', NewbookingSchema);
