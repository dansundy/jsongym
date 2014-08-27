'use strict';

/* Controllers */

angular.module('Gym.controllers')
  .controller('mainMenuCtrl', function($scope, gymData, storage){
    $scope.viewData.workouts = gymData.workouts = storage.get('workouts');
  }); 