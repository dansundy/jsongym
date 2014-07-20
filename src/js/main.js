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
}])
.run(function($route){
  var appCache = window.applicationCache;
  if (appCache.status > 0) {
    // Check if a new cache is available on page load.
    appCache.addEventListener('updateready', function(e) {
      if (appCache.status == window.applicationCache.UPDATEREADY) {
        // Browser downloaded a new app cache.
        if (confirm('A new version of this site is available. Load it?')) {
          // $route.reload();
          window.location.reload();
        }
      } 
    }, false);
  }
});