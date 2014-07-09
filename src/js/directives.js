'use strict';

/* Directives */

angular.module('Gym.directives', [])
  .directive('workoutTimer', function($rootScope, $interval, $timeout){
    return {
      restrict: 'A',
      link: function($scope, $element, attrs) {

        attrs.$observe('workoutTimer', function(newVal) {
          if (newVal > 0) {
            $scope.exercise.currentTime = newVal;

            $rootScope.inter = $interval(function() {
              $scope.exercise.currentTime--;
              $scope.exercise.currentTime;
              
              if ($scope.exercise.currentTime <= 0) {
                $scope.actionClass = null;
                $interval.cancel($rootScope.inter);

                if (!$scope.exercise.reps) {
                  $scope.nextAction.action();
                }            
              }
            }, 1000);

            $scope.exercise.setTimer = null;
          }
        });
      }
    }
  })