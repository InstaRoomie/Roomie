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

  });
