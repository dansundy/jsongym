'use strict';

/* List View Controllers */

angular.module('Gym.controllers')
  .controller('listCtrl', function($scope, $filter, storage, gymData){

    if (gymData.workouts) {
      $scope.viewData.workouts = $filter('orderBy')(gymData.workouts, ['order', '-timestamp', 'name']);
      storage.set('workouts', $scope.viewData.workouts);
    } else {
      var wks = storage.get('workouts');

      if (wks) {
        $scope.viewData.workouts = $filter('orderBy')(wks, ['order', '-timestamp', 'name']);
      }
    }
    
  });