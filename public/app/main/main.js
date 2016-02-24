angular.module('roomie.main', [])

.controller('MainController', function($scope, $mdMedia, State, $window, $state, Auth) {
  /*$scope.data = { firstname: 'kyle', lastname: 'kyle', age: 23, gender: 'M', url: 'https://journalism.missouri.edu/wp-content/uploads/2011/10/greeley-kyle-200x300.jpg', aboutme: 'I like food'};*/

  $scope.data;

  $scope.dataArray = [];

  console.log('inside main controller scope token ' + $scope.token);

  $scope.seenAllTruth = function() {
    var result = false;
    if (State.seenAllTruth() === true) {
      result = true;
    }
    return result;
  };

  $scope.getData = function() {
    State.getData().then(function(data) {
      if (data.length < 1) {
        console.log('You\'ve seen all the roomies!');
      } else {
        $scope.dataArray = data;
        $scope.data = $scope.dataArray[0];
      }
    });
  }

  $scope.signout = function() {
    // firebase sign out
    Auth.auth.$unauth();
    // db sign out
    Auth.signout();
  }

  $scope.new = function() {
    $state.go('main')
  }

  $scope.contacts = function() {
    $state.go('contact')
  }


  $scope.approve = function() {
    State.approve($scope.data).then(function() {
      $scope.dataArray.shift();
      if ($scope.dataArray.length < 1) {
        $scope.getData();
      }
      $scope.data = $scope.dataArray[0];
    });
  };

  $scope.decline = function() {
    State.decline($scope.data).then(function(data) {
      $scope.dataArray.shift();
      if ($scope.dataArray.length < 1) {
        $scope.getData();
      }
      $scope.data = $scope.dataArray[0];
    });
  };

  $scope.getData();

});
