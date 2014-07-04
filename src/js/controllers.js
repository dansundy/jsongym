'use strict';

/* Controllers */

angular.module('Gym.controllers', [])
  .controller('listCtrl', function($scope, $rootScope, runScript){
    runScript('get-workouts.php').then(function(workouts) {
      $scope.workouts = $rootScope.workouts = workouts;
    });
  })
  .controller('workoutCtrl', function($scope, $rootScope, $routeParams, runScript){
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
          text: 'Go',
          action: function() {
            $scope.Work.advance();
          }
        };
        $scope.workout = wk = $rootScope.workouts[$scope.workoutID];
        n = {
          circuitReps: {
            total: wk.reps,
            curr: 0
          },
          exercise: {
            total: wk.circuit.length,
            curr: 0
          }
        }
      },
      rest: function(t, name, desc) {
        $scope.nextAction = {
          text: null,
          action: $scope.Work.advance
        }
        $scope.exercise = {
          name: name,
          description: desc || null,
          setTimer: t,
          nextUp: nextEx() ? wk.circuit[nextEx()-1].name : null
        }
      },
      advance: function() {
        var nxt = nextEx();

        // if (!nxt) {
        //   $scope.Work.complete();
        // } else 

        if (nxt === 1) {
          n.circuitReps.curr++
        }

        n.exercise.curr = nxt;
        $scope.Work.update(n.exercise.curr);
      },
      update: function(exercise) {
        var ex = wk.circuit[exercise-1];

        $scope.exercise = {
          name: ex.name,
          description: ex.description || null,
          setTimer: ex.time || null,
          reps: ex.reps || null,
          nextUp: !ex.rest && nextEx() ? wk.circuit[nextEx()-1].name : null
        }
        $scope.nextAction = {
          text: !ex.reps ? null : 'Done',
          action: function() {
            if (!nextEx()) {
              $scope.Work.complete();
            } else if (ex.rest) {
              $scope.Work.rest(ex.rest, 'Resting');
            } else {
              $scope.Work.advance();
            }
          }
        }
      },
      complete: function() {
        console.log('Workout Complete');
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