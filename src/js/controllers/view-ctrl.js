'use strict';

/* Controllers */

angular.module('Gym.controllers')
  .controller('viewCtrl', function($scope, $routeParams){
    
    $scope.viewData = {
      view: $routeParams.view,
      temperature: 'normal'      
    };

    $scope.changeTab = function(tab) {
      $scope.viewData.currentTab = tab;
    }

    // if (getWorkouts.success) {
    //   // $scope.viewData.workouts = getWorkouts.workouts;

    // } else {
    //   $scope.viewData.errorMsg = getWorkouts.msg;
    // }
    
  }); 