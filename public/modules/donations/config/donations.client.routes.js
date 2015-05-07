'use strict';

// Setting up route
angular.module('donations').config(['$stateProvider',
  function($stateProvider) {
    // Articles state routing
    $stateProvider.
    state('listDonations', {
        url: '/donations',
        templateUrl: 'modules/donations/views/list-donations.client.view.html'
    }).
    state('privacy', {
        url: '/privacy',
        templateUrl: 'modules/donations/views/privacy.client.view.html'
    });
    // state('createDonation', {
    //     url: '/donation/create',
    //     templateUrl: 'modules/donations/views/create-donation.client.view.html'
    // });
}
]);
