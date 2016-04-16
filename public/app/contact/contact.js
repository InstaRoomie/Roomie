angular.module('roomie.contact', [])
  .controller('ContactController', ['$scope', '$state', 'State', 'profile', 'auth', 'Users', 'Auth', 'md5', function($scope, $state, State, profile, auth, Users, Auth, md5) {

    var contactController = this;

    contactController.friendPhoto = {};

    contactController.getContact = function() {
      State.getContact().then(function(data) {
        console.log('this is the data ', data);
        contactController.data = data;
        // goes over each friend to check with the firebase users to see
        // if the hashedEmails match and if they do match
        // it extends the friend with the firebase user that matches
        // this is to get the ng-repeat together
        _.each(data, function(friend) {
          _.each(contactController.users, function(user) {
            if (md5.createHash(friend.email) === user.emailHash) {
              _.extend(friend, user);
              var friendObj = {};
              friendObj[user.$id] = friend.image_url;
              _.extend(contactController.friendPhoto, friendObj);
            }
          });
        });
        console.log('This is the contact controller stuff ', contactController);
      });
    };

    contactController.profilepage = function() {
      $state.go('profile');
    };

    contactController.getUser = function() {
      State.getUser().then(function(data) {
        contactController.user = data[0];
        var contactObj = {};
        contactObj[contactController.profile.$id] = contactController.user.image_url;
        _.extend(contactController.friendPhoto, contactObj);
      });
    };

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
    };

    contactController.new = function() {
      $state.go('main');
    };

    contactController.contacts = function() {
      $state.go('contact');
    };

    contactController.getUser();

    contactController.getContact();

  }]);
