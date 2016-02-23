angular.module('roomie.auth', [])

.controller('AuthController', function($scope, $window, $state, Auth) {
  $scope.user = {};

  $scope.signup = function() {
    console.log('This was sent from the auth controller ', $scope.user);

    // create firebase chat signup
    $scope.firebaseUser = {
      email: $scope.user.email,
      password: $scope.user.password
    };


    Auth.auth.$createUser($scope.firebaseUser)
    .then(function (user) {
        console.log(user, ' is created!');
      }, function (error) {
          $scope.error = error;
        });

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

    // create firebase chat login
    $scope.firebaseUser = {
      email: $scope.user.email,
      password: $scope.user.password
    };


    Auth.auth.$authWithPassword($scope.firebaseUser)
    .then(function (auth) {
        console.log(auth, ' is logged in!');
      }, function (error) {
          $scope.error = error;
        });


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
