// 'use strict';

/* Controllers */

angular.module('Gym.controllers', [])
  .controller('listCtrl', function($scope, $rootScope, $filter, runScript, storage){
    runScript('get-workouts.php').then(function(workouts) {
      $scope.workouts = $rootScope.workouts = $filter('orderBy')(workouts,'-timestamp');
      storage.set('workouts', $scope.workouts);
    }, function(message){
      console.log(message);
      $scope.err = message;
    });
  })
  .controller('workoutCtrl', function($scope, $rootScope, $location, $routeParams, $interval, $filter, storage, utils){
    $scope.workoutID = $routeParams.id;
    $scope.states = {};

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

        $scope.workout = wk = utils.find($scope.workoutID, $rootScope.workouts);
        $scope.exercise = {
          name: wk.name,
          currentTime: null
        }
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
        $scope.states.viewClass = null;
        $scope.actionClass = 'is-inactive';
        $scope.nextAction = {
          text: action,
          action: $scope.Work.advance
        }
        $scope.exercise = {
          name: name,
          description: desc || null,
          setTimer: t,
          nextUp: nextEx() ? wk.exercises[nextEx()-1].name : null,
          currentTime: null
        }
        
      },
      advance: function() {
        var nxt = nextEx();
        $scope.states.viewClass = null;

        if (nxt === 1) {
          n.circuitReps.curr++
        }

        n.exercise.curr = nxt;
        $scope.Work.update(n.exercise.curr);
      },
      update: function(exercise) {
        var ex = wk.exercises[exercise-1];
        if ($rootScope.inter) {
          $interval.cancel($rootScope.inter);
        }
        $scope.actionClass = ex.time > 0 ? 'is-inactive' : null;

        $scope.exercise = {
          name: ex.name,
          description: ex.description || null,
          currentTime: null,
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
        $scope.exercise = {
          name: 'Workout Complete!',
          description: 'Drink some water and rest up. See you soon!',
          reps: null,
          currentTime: null
        }
        $scope.nextUp = null;
        $scope.nextAction = {
          text: 'Home',
          action: function() {
            window.location.hash = '/list';
          }
        }
      }
    }

    $scope.events = {
      close: function() {
        var c = confirm("Are you sure you want to leave this workout?");
        if (c === true) {
          window.location.hash = '/list';
        }
      }
    }

    $scope.$watch('states.paused', function(newVal, oldVal){
      if (newVal === oldVal) { return; }

      if ($scope.exercise.currentTime) {
        if (newVal) {
          $interval.cancel($rootScope.inter);
        } else {
          $scope.exercise.setTimer = $scope.exercise.currentTime;
        }
      } else {
        $scope.states.paused = false;
      }
    });
    
    if (!$rootScope.workouts) {

      var wks = storage.get('workouts');

      if (wks) {
        $scope.workouts = $rootScope.workouts = $filter('orderBy')(wks,'-timestamp');
        $scope.Work.load();
        return;
      }

      console.log('That workout isn\'t there');
      $location.url($location.path('/list'));

    } else {
      $scope.Work.load();
    }
    
  });