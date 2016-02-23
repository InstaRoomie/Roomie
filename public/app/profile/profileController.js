angular.module('roomie.profiles', [])
  .controller('ProfileCtrl', function ($state, md5, Auth, profile) {
    var profileCtrl = this;

    profileCtrl.profile = profile;

    profileCtrl.updateProfile = function () {
      profileCtrl.profile.emailHash = md5.createHash(Auth.password.email);
      profileCtrl.profile.$save();
    }
  })
