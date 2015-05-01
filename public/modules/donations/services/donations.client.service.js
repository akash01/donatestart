'use strict';

//Donations service used for communicating with the donations REST endpoints
angular.module('donations').factory('Donations', ['$resource',
	function($resource) {
		return $resource('donations/:donationid', {
			donationid: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
