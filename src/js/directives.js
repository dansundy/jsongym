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

            if ($rootScope.inter) {
              $interval.cancel($rootScope.inter);
            }
            $rootScope.inter = $interval(function() {
              $scope.exercise.currentTime--;

              if ($scope.exercise.currentTime <= 3) {
                $scope.states.viewClass = 'hot';
              } else if ($scope.exercise.currentTime <= 6) {
                $scope.states.viewClass = 'warm';
              } else {
                $scope.states.viewClass = null;
              }
              
              if ($scope.exercise.currentTime <= 0) {
                if ($scope.exercise.currentTime < 0) {
                  $scope.exercise.currentTime = 0;
                }
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
  .directive('descToggle', function() {
    return {
      restrict: 'C',
      link: function($scope, $elem, attrs) {
        var el = angular.element($elem[0]);
        var parent = el.parent('li');

        el.on('click', function() {
          if (parent.hasClass('is-showing-description')) {
            parent.removeClass('is-showing-description');
          } else {
            parent.addClass('is-showing-description');
          }
        });
      }
    }
  });