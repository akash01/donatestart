'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Donation = mongoose.model('Donation'),
  _ = require('lodash');

/**
 * Create a donation
 */
exports.create = function(req, res) {
    var donation = new Donation(req.body);
    //donation.user = req.user;

    donation.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(donation);
        }
    });
};

/**
 * Show the current donation
 */
exports.read = function(req, res) {
    res.json(req.donation);
};



// /**
//  * Delete an donation
//  */
// exports.delete = function(req, res) {
//   var donation = req.donation;

//   donation.remove(function(err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(donation);
//     }
//   });
// };

/**
 * List of Donations
 */
exports.list = function(req, res) {
    Donation.find().sort('-created').populate('user', 'displayName').exec(function(err, donations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(donations);
        }
    });
};

/**
 * Donations authorization middleware
 */
// exports.hasAuthorization = function(req, res, next) {
//   if (req.donation.user.id !== req.user.id) {
//     return res.status(403).send({
//       message: 'User is not authorized'
//     });
//   }
//   next();
//};
