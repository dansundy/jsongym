'use strict';

/* List View Controllers */

angular.module('Gym.controllers')
  .controller('getFileCtrl', function($scope, $http){
    console.log(this.jsonfile);
    $scope.submit = function() {
      $http({
        method: 'POST',
        url: 'php-scripts/get-workouts.php',
        data: {jsonURL: this.jsonfile},
      })
      .success(function(data, status, headers, config){
        console.log(data);             
      })
      .error(function(data, status, headers, config){
        console.log(data);
        console.log(status);
      });
    }

  });