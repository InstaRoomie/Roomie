angular.module("roomie.main", [])

.controller('MainController', function ($scope, State, $window){
  $scope.data = {};

  console.log("inside main controller scope token " + $scope.token);
  State.getData().then(function(data) {
    $scope.data = data;

  })
})
