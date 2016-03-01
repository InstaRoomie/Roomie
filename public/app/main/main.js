angular.module('roomie.main', [])

.controller('MainController', ['$scope', '$mdMedia', 'State', '$window', '$state', 'Auth', function($scope, $mdMedia, State, $window, $state, Auth) {

  $scope.data;
  $scope.currentuser = Auth.currentuser;
  $scope.dataArray = [];
  $scope.user;

  $scope.profile = function() {
    $state.go('profile');
  };

  $scope.seenAllTruth = function() {
    var result = false;
    if (State.seenAllTruth() === true) {
      result = true;
    }
    return result;
  };

  $scope.getUser = function() {
    State.getUser().then(function(data) {
      $scope.user = data[0];
    });
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
  };

  $scope.signout = function() {
    // firebase sign out
    Auth.auth.$unauth();
    // db sign out
    Auth.signout();
  };

  $scope.new = function() {
    $state.go('main');
  };

  $scope.contacts = function() {
    $state.go('contact');
  };

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
  $scope.getUser();

}]);
