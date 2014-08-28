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
    controller: 'viewCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/menu'});
}])
.run(function($rootScope) {
  $rootScope.configData = {
    homeLink: '#/menu'
  }
});
