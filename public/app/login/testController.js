angular.module('roomie.test', [])

.controller('TestController', function($scope, $window, $state, Auth, Users, md5) {

  Auth.auth.$onAuth(function(authData) {
    if (authData === null) {
      console.log('Not logged in yet');
    } else {
      console.log('Logged in as', authData.uid);
    }
    // This will display the user's name in our view
    $scope.authData = authData;
  });

  $scope.signout = function() {
    // firebase sign out
    Auth.auth.$unauth();
    // db sign out
    Auth.signout();
  }

});
