// 'use strict';

/* Controllers */

angular.module('Gym.controllers', [])
  .controller('listCtrl', function($scope, $rootScope, $filter, runScript, storage, gymVars){
    $scope.states = {
      listMessage: 'This site is in a very early alpha. Eventually you will be able to add your own workouts but for now you’re welcome to use mine.'
    };

    runScript('php-scripts/get-workouts.php').then(function(workouts) {
      $scope.workouts = $rootScope.workouts = $filter('orderBy')(workouts,['order', '-timestamp', 'name']);
      storage.set('workouts', $scope.workouts);
    }, function(err){
      var wks = storage.get('workouts');

      console.log(err);
      if (wks) {
        $scope.workouts = $rootScope.workouts = $filter('orderBy')(wks,['order', '-timestamp', 'name']);
      }

      if (typeof err === 'string') {
        $scope.err = err;
      } else {
        $scope.err = err.message;
      }
    });
  })
  .controller('getFileCtrl', function($scope, $http){
    $scope.submit = function() {
      $http({
        method: 'POST',
        url: 'php-scripts/get-json-workout.php',
        data: {jsonURL: this.jsonfile},
      })
        .success(function(data, status, headers, config){
          console.log(data);             
        })
        .error(function(data, status, headers, config){
          console.log(data);
          console.log(status);
        });
    }
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
            total: wk.cycles || 1,
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
          nextUp: nextEx() ? wk.exercises[nextEx()-1].title : null,
          currentTime: null,
          resting: true
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
        var autoStart = wk.autoStart || false;
        var ex = wk.exercises[exercise-1];
        var preventAutoStart = (ex.time && !autoStart) ? true : false;

        if ($rootScope.inter) { $interval.cancel($rootScope.inter); }

        $scope.actionClass = ex.time > 0 && !preventAutoStart ? 'is-inactive' : null;

        $scope.exercise = {
          name: ex.title,
          description: ex.description || null,
          currentTime: ex.time || null,
          setTimer: !preventAutoStart ? ex.time : null,
          reps: ex.reps || null,
          nextUp: !ex.rest && nextEx() ? wk.exercises[nextEx()-1].title : null
        }
        
        $scope.nextAction = {
          text: preventAutoStart ? 'Start' : 'Done',
          action: function() {
            if (preventAutoStart) {
              $scope.exercise.setTimer = ex.time;
              $scope.actionClass = 'is-inactive';
              $scope.nextAction.text = 'Done';
              preventAutoStart = false;
              return;
            }
              
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
        $scope.workouts = $rootScope.workouts = $filter('orderBy')(wks,['order', '-timestamp', 'name']);
        $scope.Work.load();
        return;
      }

      console.log('That workout isn\'t there');
      $location.url($location.path('/list'));

    } else {
      $scope.Work.load();
    }
    
  });