angular.module('roomie.ProfileController', [])
  .controller('EditProfileController', function($scope, $mdMedia, State, $window, $state, Auth) {

    var editProfileController = this;

    editProfileController.user;
    editProfileController.newinfo = {};

    editProfileController.editProfile = function() {
      console.log('edit profile is being sent! ', editProfileController.newinfo)
      State.updateProfile(editProfileController.newinfo);
    };

    editProfileController.getUser = function() {
      State.getUser().then(function(data) {
        editProfileController.user = data[0];
      });
    };

    $scope.$watch('editProfileController.user.firstname', function(v){
      editProfileController.newinfo.firstname = v;
    });

    $scope.$watch('editProfileController.user.lastname', function(v){
      editProfileController.newinfo.lastname = v;
    });

    $scope.$watch('editProfileController.user.image_url', function(v){
      editProfileController.newinfo.image_url = v;
    });

    $scope.$watch('editProfileController.user.about_me', function(v){
      editProfileController.newinfo.about_me = v;
    });

    editProfileController.profile = function() {
      $state.go('profile');
    };

    editProfileController.signout = function() {
      // firebase sign out
      Auth.auth.$unauth();
      // db sign out
      Auth.signout();
    };

    editProfileController.new = function() {
      $state.go('main')
    };

    editProfileController.contacts = function() {
      $state.go('contact')
    };

    editProfileController.getUser();

  })


  .controller('myProfileController', function($scope, $mdMedia, State, $window, $state, Auth) {
    /*$scope.data = { firstname: 'kyle', lastname: 'kyle', age: 23, gender: 'M', url: 'https://journalism.missouri.edu/wp-content/uploads/2011/10/greeley-kyle-200x300.jpg', aboutme: 'I like food'};*/

    $scope.data;
    $scope.currentuser = Auth.currentuser;
    $scope.dataArray = [];
    $scope.user;

    $scope.resetnos = function() {
      State.resetNos();
    }

    $scope.updateprofile = function() {
      $state.go('profileEdit');
    }

    $scope.profile = function() {
      $state.go('profile');
    }


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
    }

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
    $scope.getUser();

  })

  .controller('SocialProfileController', function($scope, $mdMedia, State, $window, $state, Auth, auth, Users, md5) {
    var socialProfileController = this;

    socialProfileController.newinfo = {};

    console.log('auth in social profile controller', auth);

    Auth.auth.$onAuth(function(authData) {
      if (authData === null) {
        console.log('Not logged in yet');
      } else {
        socialProfileController.newinfo.uid = authData.uid
        console.log('Logged in as', authData.uid);
        console.log('this is the provider ', authData.provider)
      }
      // This will display the user's name in our view
      if (authData.provider === 'twitter') {
          socialProfileController.authData = authData.twitter;
        };
      if (authData.provider === 'github') {
          socialProfileController.authData = authData.github;
        };
      if (authData.provider === 'google') {
          socialProfileController.authData = authData.google;

        };
      if (authData.provider === 'facebook') {
          socialProfileController.authData = authData.facebook;
        };
    });

    socialProfileController.createUser = function() {

      socialProfileController.firebaseUser = {
        email: socialProfileController.newinfo.email,
        password: socialProfileController.newinfo.password
      };

      Auth.signup(socialProfileController.newinfo)
      .then(function(token) {
        Users.getProfile(auth.uid).$loaded()
          .then(function(profile) {
              socialProfileController.profile = profile;
              socialProfileController.profile.displayName = socialProfileController.newinfo.username;
              socialProfileController.profile.emailHash = md5.createHash(socialProfileController.newinfo.email);
              console.log('this is the profile after it gets the displayname and email hash ', socialProfileController.profile);
              socialProfileController.profile.$save().then(function () {
                console.log('profile successfully saved');
                $window.localStorage.setItem('com.roomie', token);
                $state.go('main');
                });
            });
      })
      .catch(function(error) {
        console.log(error.data);
        socialProfileController.error = error.data;
        socialProfileController.error.message = 'That email exists already - did you create one already?';
        console.log('This is the socialProfileController.error ', socialProfileController.error);
      });
    };

    $scope.$watch('socialProfileController.authData.displayName', function(v){
      socialProfileController.newinfo.firstname = v;
    });

    $scope.$watch('socialProfileController.authData.profileImageURL', function(v){
      socialProfileController.newinfo.image_url = v;
    });

    $scope.$watch('socialProfileController.authData.email', function(v){
      socialProfileController.newinfo.email = v;
    });

    $scope.$watch('socialProfileController.authData.username', function(v){
      socialProfileController.newinfo.username = v;
    });

    socialProfileController.signout = function() {
      // firebase sign out
      Auth.auth.$unauth();
      Auth.signout();
    };

  });
