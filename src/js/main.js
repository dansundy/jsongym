'use strict';

angular.module('Gym', [
  'ngRoute',

  'Gym.services',
  'Gym.directives',
  'Gym.controllers'
])
.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/list', {
    templateUrl: 'partials/list.html',
    controller: 'listCtrl'
  });
  $routeProvider.when('/workout', {
    templateUrl: 'partials/workout.html',
    controller: 'workoutCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/list'})
}]);