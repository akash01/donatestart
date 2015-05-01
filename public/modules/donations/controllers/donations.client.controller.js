'use strict';

angular.module('donations').controller('DonationsController', ['$scope', '$stateParams', '$location','Donations',
  function($scope, $stateParams, $location,Donations) {

    $scope.create = function() {

        var donation = new Donations({
            fullName: this.fullName,
            email: this.email,
            organisation: this.organisation,
            amount: this.amount
        });
        donation.$save(function(response) {
            $location.path('donations');
            $scope.fullName = '';
            $scope.email = '';
            $scope.organisation = '';
            $scope.amount = '';
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

    $scope.find = function() {
      //$scope.donations = Donations.query();
        $scope.donations = 'this is test one.';
    };

}
]);
