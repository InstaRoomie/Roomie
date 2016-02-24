angular.module('roomie.angularfireProfileController', [])
  .controller('ProfileCtrl', function ($state, md5, auth, profile) {
    var profileCtrl = this;

    profileCtrl.profile = profile;

    console.log("This is the profileCtrl profile ", profileCtrl.profile);

    console.log('this is the auth ', auth)

    profileCtrl.updateProfile = function(){

      //getting the current user's email from the auth data that was resolved
      //from our router, hashing it and setting it equal to emailHash on profile
      profileCtrl.profile.emailHash = md5.createHash(auth.password.email);

      //send the user to the channels state after a successful save.
      profileCtrl.profile.$save().then(function(){
        console.log('profile successfully saved');
        $state.go('contact');
      });
    }
  })
