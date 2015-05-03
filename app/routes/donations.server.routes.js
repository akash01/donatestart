'use strict';

/**
 * Module dependencies.
 */
var donations = require('../../app/controllers/donations.server.controller');

module.exports = function(app) {
  // Donation Routes
    app.route('/donations')
      .get(donations.list)
      .post(donations.create);
    app.route('/')
      .get(donations.sumDonation);

};
