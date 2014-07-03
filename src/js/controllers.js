'use strict';

/* Controllers */

angular.module('Gym.controllers', [])
  .controller('listCtrl', function($scope, $rootScope, runScript){
    runScript('get-workouts.php').then(function(workouts) {
      $scope.workouts = $rootScope.workouts = workouts;
    });
  })
  .controller('workoutCtrl', function($scope, $rootScope, $routeParams){
    $scope.workoutID = $routeParams.id
    $scope.workout = $rootScope.workouts[$scope.workoutID]
    console.log($scope.workout);
  });