var myApp = angular.module('roomie', ['roomie.auth', 'roomie.services', 'roomie.main', 'roomie.contact', 'roomie.angularfireChatController', 'roomie.ProfileController', 'roomie.angularfireChatFactory', 'roomie.angularfireUsersFactory', 'ui.router', 'ngMaterial', 'ngAria', 'ngAnimate', 'ngMessages', 'angular-md5', 'firebase'])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

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
          auth: function($state, Users, Auth){
            console.log('PROFILE: checking if the user is authenticated...');
            return Auth.auth.$requireAuth().catch(function(){
              console.log('user is NOT authenticated so we are going HOME');
              $state.go('signin');
            });
          },
          profile: function($state, Auth, Users){
            return Auth.auth.$requireAuth().then(function(auth){
              console.log('attempting to resolve contact auth promise...', auth);

              return Users.getProfile(auth.uid).$loaded().then(function(profile){
                console.log('contact auth promise was able to resolve the getProfile...');
                console.log('profile: ', profile);
                if (profile.displayName){
                  console.log('returning the profile!', profile)
                  return profile;
                } else {
                  console.log('user has no displayName so heading to PROFILE');
                  $state.go('profilepage');
                }
              });
            }, function(error){
              //if one cannot is not authenticated... change state to 'signin'
              console.log('User is not Authenticated so we cannot get her profile. Heading to HOME');
              $state.go('signin');

            });
          }
        },
        authenticate: true
      })
      .state('chat', {
        templateUrl: 'app/chat/chat.html',
        url: '/chat',
        controller: 'ContactController as contactController',
        resolve: {
          auth: function($state, Users, Auth){
            console.log('PROFILE: checking if the user is authenticated...');
            return Auth.auth.$requireAuth().catch(function(){
              console.log('user is NOT authenticated so we are going HOME');
              $state.go('signin');
            });
          },
          profile: function($state, Auth, Users){
            return Auth.auth.$requireAuth().then(function(auth){
              console.log('attempting to resolve contact auth promise...', auth);

              return Users.getProfile(auth.uid).$loaded().then(function(profile){
                console.log('contact auth promise was able to resolve the getProfile...');
                console.log('profile: ', profile);
                if (profile.displayName){
                  console.log('returning the profile!', profile)
                  return profile;
                } else {
                  console.log('user has no displayName so heading to PROFILE');
                  $state.go('profilepage');
                }
              });
            }, function(error){
              //if one cannot is not authenticated... change state to 'signin'
              console.log('User is not Authenticated so we cannot get her profile. Heading to HOME');
              $state.go('signin');

            });
          }
        },
        authenticate: true
      })
      .state('chat.direct', {
        templateUrl: 'app/chat/messages.html',
        url: '/{uid}/messages/direct',
        controller: 'MessagesCtrl as messagesCtrl',
        resolve: {
          messages: function ($stateParams, Messages, profile) {
            console.log('looking for the messages in direct! ', Messages);
            return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
          },
          channelName: function($stateParams, Users) {
            return Users.all.$loaded().then(function() {
                return '@' + Users.getDisplayNames($stateParams.uid);
            });
          }
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
          auth: function($state, Users, Auth){
            console.log('PROFILE: checking if the user is authenticated...');
            return Auth.auth.$requireAuth().catch(function(){
              console.log('user is NOT authenticated so we are going HOME');
              $state.go('signup');
            });
          }
        }
      });

    $httpProvider.interceptors.push('AttachTokens');
  })
  .factory('AttachTokens', function($window) {

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
  })
  .run(function($rootScope, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams, error) {
      if (toState && toState.authenticate && !Auth.isAuth()) {
        evt.preventDefault();
        $state.go('login');
      }
    });
  })
  .constant('FirebaseUrl', 'https://instaroomie.firebaseio.com/');
