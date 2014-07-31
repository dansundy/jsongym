'use strict';

angular.module('Gym', [
  'ngRoute',

  'Gym.services',
  'Gym.directives',
  'Gym.controllers',
  'Gym.data'
])
.config(['$routeProvider', function($routeProvider, runScript){
  $routeProvider.when('/:view', {
    templateUrl: function(params) {
      return 'partials/' + params.view + '.html';
    },
    controller: 'viewCtrl',
    resolve: {
      getWorkouts: function(runScript) {
        return runScript('php-scripts/get-workouts.php');
      }
    }
  });
  $routeProvider.otherwise({redirectTo: '/menu'});
}]);















// .run(function($route){
  // var appCache = window.applicationCache;
  // if (appCache.status > 0) {
  //   // Check if a new cache is available on page load.
  //   appCache.addEventListener('updateready', function(e) {
  //     if (appCache.status == window.applicationCache.UPDATEREADY) {
  //       // Browser downloaded a new app cache.
  //       if (confirm('A new version of this site is available. Load it?')) {
  //         // $route.reload();
  //         window.location.reload();
  //       }
  //     } 
  //   }, false);
  // }
// });