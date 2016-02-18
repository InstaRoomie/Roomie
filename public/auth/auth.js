angular.module('roomie.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth){
  $scope.user = {};

  $scope.signup = function(){
    Auth.signup($scope.user)
    .then(function (token){
      $window.localStorage.setItem('com.roomie', token);
      $location.path('/main');
    })
    .catch(function (error){
      console.error(error);
    });
  };


  $scope.signin = function(){
    Auth.signin($scope.user)
    .then(function (token){
      $window.localStorage.setItem('com.roomie', token);
      $location.path('/main');
    })
    .catch(function (error){
      console.error(error);
    });
  };


});
