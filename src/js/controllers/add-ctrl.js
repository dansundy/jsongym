'use strict';

/* List View Controllers */

angular.module('Gym.controllers')
  .controller('getFileCtrl', function($scope, $http, $location, gymData){
    $scope.submit = function() {
      $http({
        method: 'POST',
        url: 'php-scripts/get-workouts.php',
        data: {jsonURL: this.jsonfile},
      })
      .success(function(data, status, headers, config){
        // $scope.viewData.workouts = data.workouts;
        // console.log($scope.viewData);
        if (!gymData.workouts) {
          gymData.workouts = [];
        }

        for (var i = 0; i < data.workouts.length; i++) {
          gymData.workouts.push(data.workouts[i]);
        }

        $location.path('/list');
      })
      .error(function(data, status, headers, config){
        console.log(data);
        console.log(status);
      });
    }

  });