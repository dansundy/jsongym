'use strict';

/* Directives */
var app = angular.module('Gym.directives', [])
  .directive('workoutTimer', function($rootScope, $interval, $timeout){
    return {
      restrict: 'AE',
      scope: {
        time: '@',
        viewdata: '=',
        complete: '&',
        events: '='
      },
      template: '<span class="timer">{{time}}</span>',
      link: function(scope, element, attrs) {

        var getTemp = function(int) {
          if (int <= 3) {
            return 'hot';
          } else if (int <= 6) {
            return 'warm';
          }
          return null;
        }

        scope.internalEvents = scope.events || {};
        
        scope.internalEvents.startTimer = function(n) {
          if (scope.inter) {
            $interval.cancel(scope.inter);
            scope.inter = null;
          }

          if (!n) {
            scope.time = null;
            scope.viewdata.temperature = null;
            return;
          }

          scope.time = n;
          scope.viewdata.temperature = getTemp(scope.time);

          scope.inter = $interval(function() {
            scope.time--;
            scope.viewdata.temperature = getTemp(scope.time);
            // if (scope.time <= 0) {
              // console.log(scope.complete())
              // scope.complete();
            // }
          }, 1000, n);

          scope.inter.then(function(data){
            scope.complete();
            scope.inter = undefined;
          });

        }

        scope.internalEvents.pauseToggle = function() {

          if (scope.time < 1) {
            return;
          }

          if (scope.inter) {
            console.log('canceling');
            $interval.cancel(scope.inter);
            scope.inter = undefined;
          } else {
            console.log(scope.time);
            scope.internalEvents.startTimer(scope.time);
          }

          scope.viewdata.workoutPaused = !scope.viewdata.workoutPaused;
        }

        element.on('$destroy', function() {
          $interval.cancel(scope.inter);
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
  })
  // .directive('mainToolbar', function(){
  //   return {
  //     restrict: 'AE',
  //     replace: true,
  //     templateUrl: function(tElement, tAttrs) {
  //       return 'partials/toolbar-' + tAttrs.mainToolbar +'.html';
  //     },
  //     link: function($scope, $element, $attrs, workoutTimerCtrl) {
  //       $scope.toolbarEvents = {
  //         close: function(leaveTo, msg) {
  //           var message = {
  //             leaveWorkout: 'Are you sure you want to leave this workout?' 
  //           }
  //           var c = confirm(message[msg]);
  //           if (c === true) {
  //             $location.path(leaveTo);
  //           }
  //         },
  //         togglePause: function() {
  //           console.log(workoutTimerCtrl);
  //           // $scope.states.paused = !$scope.states.paused;
  //         }
  //       }
  //     }
  //   }
  // });