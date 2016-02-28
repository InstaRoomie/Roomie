angular.module('roomie.auth', [])

.controller('AuthController', function($scope, $window, $state, Auth, Users, md5) {
  $scope.user = {};

  $scope.signup = function() {
    console.log('This was sent from the auth controller ', $scope.user);

    // create firebase chat signup
    $scope.firebaseUser = {
      email: $scope.user.email,
      password: $scope.user.password
    };

    Auth.auth.$createUser($scope.firebaseUser)
    .then(function(user) {

      Users.getProfile(user.uid).$loaded()
        .then(function(profile) {
            $scope.profile = profile;
            $scope.profile.displayName = $scope.user.username;
            $scope.profile.emailHash = md5.createHash($scope.firebaseUser.email);
            console.log('this is the profile after it gets the displayname and email hash ', $scope.profile);
            Auth.auth.$authWithPassword($scope.firebaseUser).then(function(auth) {
              console.log(auth, ' is logged in!');
              $scope.profile.$save().then(function () {
                /*Auth.auth.$authWithPassword($scope.firebaseUser);*/
                console.log('profile successfully saved');
                });
              });
          });

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

  $scope.login = function(authMethod) {
    Auth.auth.$authWithOAuthPopup(authMethod).then(function(authData) {
      Auth.signin(authData)
      .then(function(token) {
          if (token) {
            $window.localStorage.setItem('com.roomie', token);
            $state.go('main')
          } else {
            console.log('social user does not exist')
            $state.go('sociallogin');
          }
        });
    }).catch(function(error) {
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        Auth.auth.$authWithOAuthPopup(authMethod).then(function(authData) {
        });
      } else {
        console.log(error);
      }
    })

  };

});
