var myApp = angular.module('roomie', ['roomie.auth', 'roomie.services', 'roomie.main', 'roomie.contact', 'roomie.angularfireChatController', 'roomie.ProfileController', 'roomie.angularfireChatFactory', 'roomie.angularfireUsersFactory', 'ui.router', 'ngMaterial', 'ngAria', 'ngAnimate', 'ngMessages', 'angular-md5', 'firebase', 'ngTouch'])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        templateUrl: 'app/home/homepage.html',
        url: '/',
        controller: 'AuthController'
      })
      .state('signin', {
        templateUrl: 'app/auth/login.html',
        url: '/login',
        controller: 'AuthController'
      })
      .state('socialsignup', {
        templateUrl: 'app/auth/socialsignup.html',
        url: '/socialsignup',
        controller: 'AuthController'
      })
      .state('signup', {
        templateUrl: 'app/auth/signup.html',
        url: '/signup',
        controller: 'AuthController'
      })
      .state('profile', {
        templateUrl: 'app/profile/profile.html',
        url: '/profile',
        controller: 'myProfileController',
        authenticate: true
      })
      .state('profileEdit', {
        templateUrl: 'app/profile/editprofile.html',
        url: '/edit',
        controller: 'EditProfileController as editProfileController',
        authenticate: true
      })
      .state('contact', {
        templateUrl: 'app/contact/contact.html',
        url: '/contact',
        controller: 'ContactController as contactController',
        resolve: {
          auth: ['$state', 'Users', 'Auth', function($state, Users, Auth) {
            console.log('PROFILE: checking if the user is authenticated...');
            return Auth.auth.$requireAuth().catch(function() {
              console.log('user is NOT authenticated so we are going HOME');
              $state.go('signin');
            });
          }],
          profile: ['$state', 'Auth', 'Users', function($state, Auth, Users) {
            return Auth.auth.$requireAuth().then(function(auth) {
              console.log('attempting to resolve contact auth promise...', auth);

              return Users.getProfile(auth.uid).$loaded().then(function(profile) {
                console.log('contact auth promise was able to resolve the getProfile...');
                console.log('profile: ', profile);
                if (profile.displayName) {
                  console.log('returning the profile!', profile);
                  return profile;
                } else {
                  console.log('user has no displayName so heading to PROFILE');
                  $state.go('profilepage');
                }
              });
            }, function(error) {
              //if one cannot is not authenticated... change state to 'signin'
              console.log('User is not Authenticated so we cannot get her profile. Heading to HOME');
              $state.go('signin');
            });
          }]
        },
        authenticate: true
      })
      .state('chat', {
        templateUrl: 'app/chat/chat.html',
        url: '/chat',
        controller: 'ContactController as contactController',
        resolve: {
          auth: ['$state', 'Users', 'Auth', function($state, Users, Auth) {
            console.log('PROFILE: checking if the user is authenticated...');
            return Auth.auth.$requireAuth().catch(function() {
              console.log('user is NOT authenticated so we are going HOME');
              $state.go('signin');
            });
          }],
          profile: ['$state', 'Auth', 'Users', function($state, Auth, Users) {
            return Auth.auth.$requireAuth().then(function(auth) {
              console.log('attempting to resolve contact auth promise...', auth);

              return Users.getProfile(auth.uid).$loaded().then(function(profile) {
                console.log('contact auth promise was able to resolve the getProfile...');
                console.log('profile: ', profile);
                if (profile.displayName) {
                  console.log('returning the profile!', profile);
                  return profile;
                } else {
                  console.log('user has no displayName so heading to PROFILE');
                  $state.go('profilepage');
                }
              });
            }, function(error) {
              //if one cannot is not authenticated... change state to 'signin'
              console.log('User is not Authenticated so we cannot get her profile. Heading to HOME');
              $state.go('signin');

            });
          }]
        },
        authenticate: true
      })
      .state('chat.direct', {
        templateUrl: 'app/chat/messages.html',
        url: '/{uid}/messages/direct',
        controller: 'MessagesCtrl as messagesCtrl',
        resolve: {
          messages: ['$stateParams', 'Messages', 'profile', function($stateParams, Messages, profile) {
            console.log('looking for the messages in direct! ', Messages);
            return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
          }],
          channelName: ['$stateParams', 'Users', function($stateParams, Users) {
            return Users.all.$loaded().then(function() {
              return '@' + Users.getDisplayNames($stateParams.uid);
            });
          }]
        },
        authenticate: true
      })
      .state('main', {
        templateUrl: 'app/main/main.html',
        url: '/main',
        controller: 'MainController',
        authenticate: true
      })
      .state('sociallogin', {
        templateUrl: 'app/profile/createSocialProfile.html',
        url: '/createprofile',
        controller: 'SocialProfileController as socialProfileController',
        resolve: {
          auth: ['$state', 'Users', 'Auth', function($state, Users, Auth) {
            console.log('PROFILE: checking if the user is authenticated...');
            return Auth.auth.$requireAuth().catch(function() {
              console.log('user is NOT authenticated so we are going HOME');
              $state.go('signup');
            });
          }]
        }
      });

    $httpProvider.interceptors.push('AttachTokens');
  }])
  .factory('AttachTokens', ['$window', function($window) {

    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('com.roomie');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  }])
  .run(['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams, error) {
      if (toState && toState.authenticate && !Auth.isAuth()) {
        evt.preventDefault();
        $state.go('login');
      }
    });
  }])
  .constant('FirebaseUrl', 'https://instaroomie.firebaseio.com/');

angular.module('roomie.auth', [])

.controller('AuthController', ['$scope', '$window', '$state', 'Auth', 'Users', 'md5', '$mdDialog', '$mdMedia', function($scope, $window, $state, Auth, Users, md5, $mdDialog, $mdMedia) {
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
}]);

angular.module('roomie.angularfireChatController', [])
  .controller('MessagesCtrl', ['$scope', 'profile', 'channelName', 'messages', function($scope, profile, channelName, messages) {
    var messagesCtrl = this;

    messagesCtrl.messages = messages;
    messagesCtrl.channelName = channelName;

    messagesCtrl.message = '';

    messagesCtrl.sendMessage = function() {
      if (messagesCtrl.message.length > 0) {
        messagesCtrl.messages.$add({
          uid: profile.$id,
          body: messagesCtrl.message,
          timestamp: Firebase.ServerValue.TIMESTAMP
        })
        .then(function() {
          messagesCtrl.message = '';
        });
      }
    };

    $scope.signout = function() {
      // firebase sign out
      Auth.auth.$unauth();
      // db sign out
      Auth.signout();
    };

    $scope.new = function() {
      $state.go('main');
    };

    $scope.contacts = function() {
      $state.go('contact');
    };

    $scope.profile = function() {
      $state.go('profile');
    };

  }]);

angular.module('roomie.contact', [])
  .controller('ContactController', ['$scope', '$state', 'State', 'profile', 'auth', 'Users', 'Auth', 'md5', function($scope, $state, State, profile, auth, Users, Auth, md5) {

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
              /*console.log('this is the friend photo id ', id);*/
              _.extend(friend, user);
              _.extend(contactController.friendPhoto, {[user.$id]: friend.image_url});
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
        _.extend(contactController.friendPhoto, {[contactController.profile.$id]: contactController.user.image_url});
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

angular.module('roomie.main', [])

.controller('MainController', ['$scope', '$mdMedia', 'State', '$window', '$state', 'Auth', function($scope, $mdMedia, State, $window, $state, Auth) {

  $scope.data;
  $scope.currentuser = Auth.currentuser;
  $scope.dataArray = [];
  $scope.user;

  $scope.profile = function() {
    $state.go('profile');
  };

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
  };

  $scope.getData = function() {
    State.getData().then(function(data) {
      if (data.length < 1) {
        console.log('You\'ve seen all the roomies!');
      } else {
        $scope.dataArray = data;
        $scope.data = $scope.dataArray[0];
      }
    });
  };

  $scope.signout = function() {
    // firebase sign out
    Auth.auth.$unauth();
    // db sign out
    Auth.signout();
  };

  $scope.new = function() {
    $state.go('main');
  };

  $scope.contacts = function() {
    $state.go('contact');
  };

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

}]);

angular.module('roomie.ProfileController', [])
  .controller('EditProfileController', ['$scope', '$mdMedia', 'State', '$window', '$state', 'Auth', function($scope, $mdMedia, State, $window, $state, Auth) {

    var editProfileController = this;

    editProfileController.user;
    editProfileController.newinfo = {};

    editProfileController.editProfile = function() {
      console.log('edit profile is being sent! ', editProfileController.newinfo);
      State.updateProfile(editProfileController.newinfo);
    };

    editProfileController.getUser = function() {
      State.getUser().then(function(data) {
        editProfileController.user = data[0];
      });
    };

    $scope.$watch('editProfileController.user.firstname', function(v) {
      editProfileController.newinfo.firstname = v;
    });

    $scope.$watch('editProfileController.user.lastname', function(v) {
      editProfileController.newinfo.lastname = v;
    });

    $scope.$watch('editProfileController.user.image_url', function(v) {
      editProfileController.newinfo.image_url = v;
    });

    $scope.$watch('editProfileController.user.about_me', function(v) {
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
      $state.go('main');
    };

    editProfileController.contacts = function() {
      $state.go('contact');
    };

    editProfileController.getUser();

  }])

  .controller('myProfileController', ['$scope', '$mdMedia', 'State', '$window', '$state', 'Auth', function($scope, $mdMedia, State, $window, $state, Auth) {

    $scope.data;
    $scope.currentuser = Auth.currentuser;
    $scope.dataArray = [];
    $scope.user;

    $scope.resetnos = function() {
      State.resetNos();
    };

    $scope.updateprofile = function() {
      $state.go('profileEdit');
    };

    $scope.profile = function() {
      $state.go('profile');
    };


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
    };

    $scope.getData = function() {
      State.getData().then(function(data) {
        if (data.length < 1) {
          console.log('You\'ve seen all the roomies!');
        } else {
          $scope.dataArray = data;
          $scope.data = $scope.dataArray[0];
        }
      });
    };

    $scope.signout = function() {
      // firebase sign out
      Auth.auth.$unauth();
      // db sign out
      Auth.signout();
    };

    $scope.new = function() {
      $state.go('main');
    };

    $scope.contacts = function() {
      $state.go('contact');
    };

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

  }])

  .controller('SocialProfileController', ['$scope', '$mdMedia', 'State', '$window', '$state', 'Auth', 'auth', 'Users', 'md5', function($scope, $mdMedia, State, $window, $state, Auth, auth, Users, md5) {
    var socialProfileController = this;

    socialProfileController.newinfo = {};

    console.log('auth in social profile controller', auth);

    Auth.auth.$onAuth(function(authData) {
      if (authData === null) {
        console.log('Not logged in yet');
      } else {
        socialProfileController.newinfo.uid = authData.uid;
        console.log('Logged in as', authData.uid);
        console.log('this is the provider ', authData.provider);
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
          socialProfileController.profile.$save().then(function() {
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

    $scope.$watch('socialProfileController.authData.displayName', function(v) {
      socialProfileController.newinfo.firstname = v;
    });

    $scope.$watch('socialProfileController.authData.profileImageURL', function(v) {
      socialProfileController.newinfo.image_url = v;
    });

    $scope.$watch('socialProfileController.authData.email', function(v) {
      socialProfileController.newinfo.email = v;
    });

    $scope.$watch('socialProfileController.authData.username', function(v) {
      socialProfileController.newinfo.username = v;
    });

    socialProfileController.signout = function() {
      // firebase sign out
      Auth.auth.$unauth();
      Auth.signout();
    };

  }]);

angular.module('roomie.angularfireChatFactory', [])
  .factory('Messages', ['$firebaseArray', 'FirebaseUrl', function($firebaseArray, FirebaseUrl) {
    var channelMessagesRef = new Firebase(FirebaseUrl + 'channelMessages');

    var userMessagesRef = new Firebase(FirebaseUrl + 'userMessages');

    return {
      forChannel: function(channelId) {
        return $firebaseArray(channelMessagesRef.child(channelId));
      },
      forUsers: function(uid1, uid2) {
        /*var path = if (uid1 < uid2) { uid1 + '/' + uid2; } else { uid2 + '/' + uid1; };*/
        var path = uid1 < uid2 ? uid1 + '/' + uid2 : uid2 + '/' + uid1;

        return $firebaseArray(userMessagesRef.child(path));
      }
    };
  }]);

angular.module('roomie.services', [])
  .factory('Auth', ['$http', '$state', '$window', '$firebaseAuth', 'FirebaseUrl', function($http, $state, $window, $firebaseAuth, FirebaseUrl) {

    var ref = new Firebase(FirebaseUrl);
    var auth = $firebaseAuth(ref);
    var currentuser;

    var signup = function(user) {
      return $http({
        method: 'POST',
        url: 'api/users/signup',
        data: user
      })
      .then(function(res) {
        return res.data.token;
      });
    };

    var signin = function(user) {
      return $http({
        method: 'POST',
        url: 'api/users/signin',
        data: user
      })
      .then(function(res) {
        return res.data.token;
      });
    };

    var isAuth = function() {
      return !!$window.localStorage.getItem('com.roomie');
    };

    var signout = function() {
      $window.localStorage.removeItem('com.roomie');
      $state.go('signin');
    };
    //
    // var saveUser = function(user){
    //   currentuser = user;
    // };

    return {
      signup: signup,
      signin: signin,
      isAuth: isAuth,
      signout: signout,
      auth: auth,
      currentuser: currentuser
    };

  }])
  .factory('State', ['$http', '$location', '$window', 'Auth', function($http, $location, $window, Auth) {
    var getPromise;

    var seenAll = false;

    var seenAllTruth = function() {
      return seenAll;
    };

    var resetNos = function() {
      return $http({
        method: 'GET',
        url: 'api/users/reset'
      }).then(function(res) {
        console.log(res);
      });
    };

    var getUser = function() {
      return $http({
        method: 'GET',
        url: 'api/users/user'
      }).then(function(res) {
        console.log('this is the signedin profile', res.data);
        return res.data;
      });
    };

    var getData = function() {
      return $http({
        method: 'GET',
        url: 'api/users/main'
      }).then(function(res) {
        console.log('inside getData',res.data);
        if (res.data.length === 0) {
          seenAll = true;
        }
        return res.data;
      });
    };

    var approve = function(user) {
      return $http({
        method: 'POST',
        url: 'api/profile/yes',
        data: user
      }).then(function(res) {
        return res.data;
      });
    };

    var decline = function(user) {
      return $http({
        method: 'POST',
        url: 'api/profile/no',
        data: user
      }).then(function(res) {
        return res.data;
      });
    };

    var getContact = function() {
      return $http({
        method: 'GET',
        url: 'api/contact/friend'
      }).then(function(res) {
        console.log(res);
        return res.data;
      });
    };

    var updateProfile = function(data) {
      return $http({
        method: 'POST',
        url: 'api/users/update',
        data: data
      }).then(function(res) {
        console.log(res);
      });
    };

    return {
      getData: getData,
      approve: approve,
      decline: decline,
      getContact: getContact,
      seenAllTruth: seenAllTruth,
      getUser: getUser,
      resetNos: resetNos,
      updateProfile: updateProfile
    };

  }]);

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
