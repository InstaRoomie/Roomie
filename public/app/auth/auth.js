angular.module('roomie.auth', [])

.controller('AuthController', function($scope, $window, $state, Auth) {
  $scope.user = {};

  $scope.signup = function() {
    console.log('This was sent from the auth controller ', $scope.user);

    Auth.signup($scope.user)
    .then(function(token) {
      $window.localStorage.setItem('com.roomie', token);
      $state.go('main');
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  $scope.signin = function() {
    Auth.signin($scope.user)
    .then(function(token) {
      $window.localStorage.setItem('com.roomie', token);
      $state.go('main');
    })
    .catch(function(error) {
      console.error(error);
    });
  };

});
