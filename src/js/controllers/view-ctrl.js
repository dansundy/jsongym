'use strict';

/* Controllers */

angular.module('Gym.controllers')
  .controller('viewCtrl', function($scope, getWorkouts){
    
    $scope.viewData = {
      temperature: 'normal'
    };

    if (getWorkouts.success) {
      $scope.viewData.workouts = getWorkouts.workouts;
    } else {
      $scope.viewData.errorMsg = getWorkouts.msg;
    }
    
  }); 