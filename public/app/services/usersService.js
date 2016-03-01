angular.module('roomie.angularfireUsersFactory', [])
  .factory('Users', ['$firebaseArray', '$firebaseObject', 'FirebaseUrl', function($firebaseArray, $firebaseObject, FirebaseUrl) {

    var usersRef = new Firebase(FirebaseUrl + 'users');

    //create a $firebaseArray using the reference
    var users = $firebaseArray(usersRef);

    var connectedRef = new Firebase(FirebaseUrl + '.info/connected');

    var Users = {

      //allows us to get a $firebaseObject of a specific user's profile
      getProfile: function(uid) {
        return $firebaseObject(usersRef.child(uid));
      },
      //helper function that returns a user's displayname when given a uid
      getDisplayNames: function(uid) {
        return users.$getRecord(uid).displayName;
      },
      all: users,
      gravatar: function(uid) {
        return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
      },
      // sets the property of online whenever someone is loggedin.
      setOnline: function(uid) {
        var connected = $firebaseObject(connectedRef);
        var online = $firebaseArray(usersRef.child(uid + '/online'));

        connected.$watch(function() {
          if (connected.$value === true) {
            online.$add(true).then(function(connectedRef) {
              connectedRef.onDisconnect().remove();
            });
          }
        });
      }
    };

    return Users;

  }]);
