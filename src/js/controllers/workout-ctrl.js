'use strict';

angular.module('Gym.controllers')
  .controller('workoutCtrl', function($scope, $rootScope, $location, $routeParams, $interval, $filter, storage, utils){
    $scope.workoutID = $routeParams.id;
    $scope.workoutEvents = {};
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
            $scope.Work.rest(3, 'Starting workout in:');
          }
        };

        wk = utils.find($scope.workoutID, $scope.viewData.workouts);

        $scope.exercise = {
          name: wk.name
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
        // $scope.states.viewClass = null;
        $scope.actionClass = 'is-inactive';
        $scope.nextAction = {
          text: action,
          action: $scope.Work.advance
        }
        $scope.exercise = {
          name: name,
          description: desc || null,
          nextUp: nextEx() ? wk.exercises[nextEx()-1].title : null,
          resting: true,
          time: t
        }

        $scope.timerComplete = function() {
          $scope.Work.advance();
        }

        $scope.workoutEvents.startTimer(t);

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
        var autoStart = wk.autoStart || false;
        var ex = wk.exercises[exercise-1];
        var preventAutoStart = (ex.time && !autoStart) ? true : false;
        var exerciseDone = function() {
          if (!nextEx()) {
            $scope.Work.complete();
          } else if (ex.rest) {
            $scope.Work.rest(ex.rest, 'Resting', 'Skip');
          } else {
            $scope.Work.advance();
          }
        }

        $scope.actionClass = ex.time > 0 && !preventAutoStart ? 'is-inactive' : null;

        $scope.exercise = {
          name: ex.title,
          description: ex.description || null,
          reps: ex.reps || null,
          time: ex.time || null,
          nextUp: !ex.rest && nextEx() ? wk.exercises[nextEx()-1].title : null,
        }
        
        $scope.nextAction = {
          text: preventAutoStart ? 'Start' : 'Done',
          action: function() {
            if (preventAutoStart) {
              $scope.workoutEvents.startTimer(ex.time);
              $scope.actionClass = 'is-inactive';
              this.text = 'Done';
              this.action = function() {
                exerciseDone();
              }
            } else {
              exerciseDone();
            }
          }
        }

        $scope.timerComplete = function() {
          if (wk.autoNext) {
            exerciseDone();
          } else {
            $scope.actionClass = null;
          }
        }

        $scope.workoutEvents.startTimer(!preventAutoStart ? ex.time : null);


      },
      complete: function() {
        $scope.exercise = {
          name: 'Workout Complete!',
          description: 'Drink some water and rest up. See you soon!',
          reps: null
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

    $scope.leaveWorkout = function(loc) {
      var c = confirm('Are you sure you want to leave this workout?');
      if (c === true) {
        $location.path(loc);
      }
    }

    $scope.pauseToggle = function() {
      if (!$scope.exercise.time) {
        return;
      }
      if (!$scope.states.paused) {
        $scope.workoutEvents.startTimer(false);
        $scope.states.paused = true;
      } else {
        $scope.workoutEvents.startTimer(true);
        $scope.states.paused = false;
      }
    }
    
    if (!$scope.viewData.workouts) {

      var wks = storage.get('workouts');

      if (wks) {
        $scope.viewData.workouts = $filter('orderBy')(wks,['order', '-timestamp', 'name']);
        $scope.Work.load();
        return;
      }

      console.log('That workout isn\'t there');
      $location.url('/');

    } else {
      $scope.Work.load();
    }
    
  });