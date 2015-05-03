'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Donation Schema
 */
var DonationSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	fullName: {
		type: String,
		default: '',
		trim: true,
		required: 'Full Name cannot be blank'
	},
	email: {
		type: String,
		default: '',
		trim: true,
		required: 'Email cannot be blank'
	},
	organisation: {
		type: String,
		default: '',
		trim: true,
		required: 'Organisation cannot be blank'
	},
	amount: {
		type: Number,
		default: '',
		trim: true,
		required: 'Donation amount cannot be blank'
	},
	currency: {
		type: String,
		default: '',
		trim: true,
		required: 'Currency cannot be blank'
	},
});

mongoose.model('Donation', DonationSchema);
