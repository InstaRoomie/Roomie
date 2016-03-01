angular.module('roomie.auth', [])

.controller('AuthController', function($scope, $window, $state, Auth, Users, md5, $mdDialog, $mdMedia) {
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
            $scope.profile.$save().then(function() {
              /*Auth.auth.$authWithPassword($scope.firebaseUser);*/
              console.log('profile successfully saved');
            });
          });
        });
    }, function(error) {
          console.log('This is the error from Firebase ', error);
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
    .then(function(auth) {
        console.log(auth, ' is logged in!');
      }, function(error) {
        console.log('This is the error from Firebase ', error);
      });

    Auth.signin($scope.user)
    .then(function(token) {
      $window.localStorage.setItem('com.roomie', token);
      $state.go('main');
    })
    .catch(function(error) {
      console.log('this is the error from the server: ' , error.data.error);
      $scope.error = error.data.error;
    });
  };

  $scope.login = function(authMethod) {
    Auth.auth.$authWithOAuthPopup(authMethod).then(function(authData) {
      Auth.signin(authData)
      .then(function(token) {
          if (token) {
            $window.localStorage.setItem('com.roomie', token);
            $state.go('main');
          } else {
            console.log('social user does not exist');
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
    });
  };

  $scope.goLogin = function() {
    $state.go('signin');
  };

  $scope.goSignUp = function(ev) {
    var confirm = $mdDialog.confirm()
          .title('Do you have a Twitter, Facebook, GitHub, or Google account?')
          .textContent('')
          .ariaLabel('Social Sign Up')
          .targetEvent(ev)
          .ok('Yep')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $state.go('socialsignup');
    }, function() {
      $state.go('signup');
    });
  };
});
