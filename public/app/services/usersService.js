angular.module('roomie.angularfireUsersFactory', [])
  .factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl) {
    var usersRef = new Firebase(FirebaseUrl + 'users');
    var users = $firebaseArray(userRef);
    var connectedRef = new Firebase(FirebaseUrl + '.info/connected');

    var Users = {
      getProfile: function(uid) {
        return $firebaseObject(usersRef.child(uid));
      },
      getDisplayName: function(uid) {
        return users.$getRecord(uid).displayName;
      },
      getGravatar: function(uid) {
        return '//www.gravatar.com/avatar' + users.$getRecord(uid).emailHash;
      },
      setOnline: function (uid) {
        var connected = $firebaseObject(connectedRef);
        var online = $firebaseArray(usersRef.child(uid + '/online'));

        connected.$watch(function () {
            if (connected.$value === true) {
              online.$add(true).then(function (connectedRef) {
                connectedRef.onDisconnect().remove();
              });
            }
          });
      },
      all:users
    }

    return Users;

  });
