'use strict';

/* List View Controllers */

angular.module('Gym.controllers')
  .controller('listCtrl', function($scope, $rootScope, $filter, storage, gymVars){

    if ($scope.viewData.workouts) {
      $scope.viewData.workouts = $filter('orderBy')($scope.viewData.workouts,['order', '-timestamp', 'name']);
      storage.set('workouts', $scope.viewData.workouts);
    } else {
      var wks = storage.get('workouts');

      if (wks) {
        $scope.viewData.workouts = $filter('orderBy')(wks,['order', '-timestamp', 'name']);
      }
    }
    
  });