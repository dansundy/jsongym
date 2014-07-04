'use strict';

/* Directives */

angular.module('Gym.directives', [])
  .directive('workoutTimer', function($interval){
    return {
      restrict: 'A',
      link: function($scope, $element, attrs) {
        // console.log(attrs);
        var inter;
        var currentTime;

        attrs.$observe('workoutTimer', function(newVal) {
          if (newVal > 0) {
            currentTime = newVal;
            $element[0].innerHTML = currentTime;

            inter = $interval(function() {
              currentTime--;
              $element[0].innerHTML = currentTime;
              if (currentTime <= 0) {
                $element[0].innerHTML = currentTime;
                $interval.cancel(inter);
                
                $scope.nextAction.action();
              }
            }, 1000);

            $scope.exercise.setTimer = null;
          }
        });
      }
    }
  })