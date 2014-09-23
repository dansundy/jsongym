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

    // console.log($scope.viewData.workouts);

    $scope.listEvents = {
      deleteWorkout: function(id) {
        var c = confirm('Are you sure you want to delete this workout?');
        if (c === true) {
          for (var i=0; i<$scope.viewData.workouts.length; i++) {
            if ($scope.viewData.workouts[i].id === id) {
              $scope.viewData.workouts.splice(i,1);
              break;
            }
          }
          storage.set('workouts', $scope.viewData.workouts);
        }
      }
    }

    $scope.getHeight = function(e) {
      console.log(e);
    }
    
  });