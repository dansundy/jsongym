'use strict';

/* Services */

angular.module('Gym.services', [])
  .factory('utils', function(){
    var getWorkoutById = function(key, array) {
      for (var i = 0; i < array.length; i++) {
        var id = array[i]['id'];
        if (id === key) {
          return array[i];
        }
      }
      return null;
    }
    return {
      find: getWorkoutById
    }
  })
  .factory('storage', function(){

    var Test = {
      storage: function(){
        var test = 'test';
        try {
          localStorage.setItem(test,test);
          localStorage.removeItem(test);
          return true;
        } catch(e) {    
          return false;
        }
      },
      json: function(str){
        try {
          JSON.parse(str);
          return true;
        } catch (e) {
          return false;
        }
      }
    };

    var Storage = {

      setItem: function(key, data) {
        // Make sure local storage is supported.
        if (!Test.storage) { return; }

        // Make sure there is a key and a value.
        if (!key || !data) { return 'There is a key or value missing.'; }

        // Check if data is an object or string.
        var value = (typeof data === 'string') ? data : JSON.stringify(data);

        // console.log('[Storage] set %s -> %O', key, data)

        // Store it.
        localStorage.setItem(key,value); // value: data
      },
      getItem: function(key) {
        // Make sure local storage is supported.
        if (!Test.storage) { return; }

        // Make sure there is a key.
        if (!key) { return 'No key!'; }

        // Get the value from storage.
        var value = localStorage.getItem(key);

        // console.log('[Storage] get %s -> %O', key, value)

        return Test.json(value) ? JSON.parse(value) : value;
      },
      removeItem: function(key) {
        if (!Test.storage) { return; }

        localStorage.removeItem(key);
      }
    };

      return {
        supported: Test.storage,
        set: Storage.setItem,
        get: Storage.getItem,
        remove: Storage.removeItem
      }

  })
  .factory('runScript', function($q, $http) {

    return function(script) {
      var deferred = $q.defer();
      $http.post(script)
        .success(function(data, status, headers, config) {
          var err = typeof data == 'string' ? 'reject' : 'resolve';
          deferred[err](data);
          // deferred.reject(data);
          // deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {

          var messages = {
            0: {
              code: status, 
              message: 'Cannot connect to the workouts directory. You may be Offline.'
            },
            dflt: {
              code: null,
              message: 'No message'
            }
          };

          var msg = messages[status] || messages['dflt'];

          deferred.reject(msg);
        });

      return deferred.promise;
    }
  })
  .factory('workoutActions', function(){
    var init = function() {
      
    }
    return {
      init: init
    }
  });