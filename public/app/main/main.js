angular.module('roomie.main', [])

.controller('MainController', function($scope, State, $window) {
  $scope.data = { firstname: 'kyle', lastname: 'kyle', age: 23, gender: 'M', url: 'https://journalism.missouri.edu/wp-content/uploads/2011/10/greeley-kyle-200x300.jpg', aboutme: 'I like food'};

  console.log('inside main controller scope token ' + $scope.token);
  State.getData().then(function(data) {
    $scope.data = data;
  });

  $scope.approve = function() {
    State.approve($scope.data).then(function() {
      $scope.data = data;
    });
  };

  $scope.decline = function() {
    State.decline($scope.data).then(function(data) {
      $scope.data = data;
    });
  };

});
