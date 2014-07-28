'use strict';

/* List View Controllers */

angular.module('Gym.controllers')
  .controller('listCtrl', function($scope, $rootScope, $filter, runScript, storage, gymVars){

    runScript('php-scripts/get-workouts.php').then(function(workouts) {
      $scope.workouts = $rootScope.workouts = $filter('orderBy')(workouts,['order', '-timestamp', 'name']);
      storage.set('workouts', $scope.workouts);
    }, function(err){
      var wks = storage.get('workouts');

      console.log(err);
      if (wks) {
        $scope.workouts = $rootScope.workouts = $filter('orderBy')(wks,['order', '-timestamp', 'name']);
      }

      if (typeof err === 'string') {
        $scope.err = err;
      } else {
        $scope.err = err.message;
      }
    });
  })
  .controller('getFileCtrl', function($scope, $http){
    $scope.submit = function() {
      $http({
        method: 'POST',
        url: 'php-scripts/get-json-workout.php',
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
  })