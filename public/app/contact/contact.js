angular.module('roomie.contact', [])
  .controller('ContactController', function($scope, $state, State, profile, auth, Users, Auth, md5) {

    var contactController = this;

    contactController.friendPhoto = {};

    contactController.getContact = function() {
      State.getContact().then(function(data) {
          contactController.data = data;
          // goes over each friend to check with the firebase users to see
          // if the hashedEmails match and if they do match
          // it extends the friend with the firebase user that matches
          // this is to get the ng-repeat together
          _.each(data, function(friend) {
              _.each(contactController.users, function(user) {
                  if (md5.createHash(friend.email) === user.emailHash) {
                    _.extend(friend, user);
                    _.extend(contactController.friendPhoto, { [user.$id]: friend.image_url });
                  }
                });
            });

          console.log("This is the contact controller stuff ", contactController)
        });
    };

    contactController.profilepage = function() {
      $state.go('profile');
    }

    contactController.getUser = function() {
      State.getUser().then(function(data) {
        contactController.user = data[0];
        _.extend(contactController.friendPhoto, { [contactController.profile.$id]: contactController.user.image_url});
      });
    }

    contactController.profile = profile;

    Users.setOnline(profile.$id);

    contactController.getDisplayName = Users.getDisplayNames;
    contactController.getGravatar = Users.gravatar;
    contactController.users = Users.all;

    contactController.getProfileImage = function(uid) {
      return contactController.friendPhoto[uid];
    };

    contactController.signout = function() {
      //firebase signout
      Auth.auth.$unauth();
      //db signout
      Auth.signout();
    };

    contactController.new = function() {
      $state.go('main');
    }


    contactController.new = function() {
      $state.go('main');
    };

    contactController.contacts = function() {
      $state.go('contact');
    };

    contactController.getUser();

    contactController.getContact();

  });
