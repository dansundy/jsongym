'use strict';

/* Services */

angular.module('Gym.services', [])
  // .value('allWorkouts', {})
  // .factory('HelloWorld', function($q, $timeout) {
  
  //   var getMessages = function() {
  //     var deferred = $q.defer();
  
  //     $timeout(function() {
  //       deferred.resolve(['Hello', 'world']);
  //     }, 2000);
  
  //     return deferred.promise;
  //   };
    
  //   return {
  //     getMessages: getMessages
  //   };
  
  // })
  .factory('runScript', function($q, $http) {

    return function(script) {
      var deferred = $q.defer();
      $http.post(script)
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          deferred.resolve(status);
        })

      return deferred.promise;
    }
  });