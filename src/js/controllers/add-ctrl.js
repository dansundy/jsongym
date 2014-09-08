'use strict';

/* List View Controllers */

angular.module('Gym.controllers')
  .controller('getFileCtrl', function($scope, $http, $location, gymData){
    $scope.getData = function(data) {
      $http({
        method: 'POST',
        url: 'php-scripts/get-workouts.php',
        data: data,
      })
      .success(function(data, status, headers, config){

        if (!gymData.workouts) {
          gymData.workouts = [];
        }

        for (var i = 0; i < data.workouts.length; i++) {
          gymData.workouts.push(data.workouts[i]);
        }

        $location.path('/list');
      })
      .error(function(data, status, headers, config){
        console.log(data);
        console.log(status);
      });
    }

    $scope.submit = function() {
      $scope.getData({jsonURL: this.jsonfile});
    }

    $scope.fromDropbox = function() {
      Dropbox.choose({
        linkType: 'direct',
        multiselect: true,
        extensions: ['.json'],
        success: function(files) {
          var links = [];
          for (var i=0; i<files.length; i++) {
            links.push(files[i].link);
          }
          $scope.getData({jsonURL: links});
        }
      });
    }

  });