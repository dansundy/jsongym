// 'use strict';

/* Controllers */

angular.module('Gym.controllers', [])
  .controller('listCtrl', function($scope, $rootScope, runScript){
    runScript('get-workouts.php').then(function(workouts) {
      $scope.workouts = $rootScope.workouts = workouts;
    });
  })
  .controller('workoutCtrl', function($scope, $rootScope, $routeParams, $interval, runScript){
    $scope.workoutID = $routeParams.id;

    var wk, n;

    var nextEx = function() {
      if (n.exercise.curr < n.exercise.total) {
        return n.exercise.curr+1;
      } else if (n.circuitReps.curr < n.circuitReps.total) {
        return 1;
      } 
      return false;
    }

    $scope.Work = {
      load: function() {
        $scope.nextAction = { 
          text: 'Start',
          action: function() {
            // $scope.Work.advance();
            $scope.Work.rest(3, 'Starting workout in:');
          }
        };
        $scope.workout = wk = $rootScope.workouts[$scope.workoutID];
        n = {
          circuitReps: {
            total: wk.reps,
            curr: 0
          },
          exercise: {
            total: wk.exercises.length,
            curr: 0
          }
        }
      },
      rest: function(t, name, action, desc) {
        $scope.nextAction = {
          text: action,
          action: $scope.Work.advance
        }
        $scope.exercise = {
          name: name,
          description: desc || null,
          setTimer: t,
          nextUp: nextEx() ? wk.exercises[nextEx()-1].name : null,
          currentTime: 0
        }
        $scope.actionClass = 'is-inactive';
      },
      advance: function() {
        var nxt = nextEx();

        if (nxt === 1) {
          n.circuitReps.curr++
        }

        n.exercise.curr = nxt;
        $scope.Work.update(n.exercise.curr);
      },
      update: function(exercise) {
        var ex = wk.exercises[exercise-1];
        $scope.actionClass = ex.time > 0 ? 'is-inactive' : null;

        $scope.exercise = {
          name: ex.name,
          description: ex.description || null,
          setTimer: ex.time || null,
          reps: ex.reps || null,
          nextUp: !ex.rest && nextEx() ? wk.exercises[nextEx()-1].name : null
        }
        $scope.nextAction = {
          text: 'Done',
          action: function() {
            $interval.cancel($rootScope.inter);
            if (!nextEx()) {
              $scope.Work.complete();
            } else if (ex.rest) {
              $scope.Work.rest(ex.rest, 'Resting', 'Skip');
            } else {
              $scope.Work.advance();
            }
          }
        }
      },
      complete: function() {
        $scope.exercise.name = 'Workout Complete!';
        $scope.exercise.description = 'Drink some water and rest up. See you soon!';
        $scope.nextUp = null;
        $scope.nextAction = {
          text: 'Home',
          action: function() {
            window.location.hash = '/list';
          }
        }
      }
    }
    
    if (!$rootScope.workouts) {
      runScript('get-workouts.php').then(function(workouts) {
        $scope.workouts = $rootScope.workouts = workouts;
        $scope.Work.load();
      });
    } else {
      $scope.Work.load();
    }

    
  });