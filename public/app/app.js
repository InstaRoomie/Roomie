var myApp = angular.module('roomie', ['roomie.auth', 'roomie.services', 'roomie.main', 'roomie.contact', 'roomie.angularfireChatController', 'roomie.angularfireProfileController', 'roomie.angularfireChatFactory', 'roomie.angularfireUsersFactory', 'ui.router', 'ngMaterial', 'ngAria', 'ngAnimate', 'ngMessages', 'angular-md5', 'firebase'])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('signin', {
        templateUrl: 'app/auth/login.html',
        url: '/login',
        controller: 'AuthController'
      })
      .state('signup', {
        templateUrl: 'app/auth/signup.html',
        url: '/signup',
        controller: 'AuthController'
      })
      .state('contact', {
        templateUrl: 'app/contact/contact.html',
        url: '/contact',
        controller: 'ContactController',
        authenticate: true
      })
      .state('main', {
        templateUrl: 'app/main/main.html',
        url: '/main',
        controller: 'MainController',
        authenticate: true
      })
      .state('profilepage', {
        templateUrl: 'app/profile/profilepage.html',
        url: '/profilepage',
        controller: 'ProfileCtrl as profileCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            console.log('PROFILE: checking if the user is authenticated...');
            return Auth.auth.$requireAuth().catch(function(){
              console.log('user is NOT authenticated so we are going HOME');
              $state.go('signin');
            });
          },
          profile: function (Users, Auth) {
            console.log('getting the users profile...');
            return Auth.auth.$requireAuth().then(function(auth){
              console.log('getting the users profile...', auth);
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('channels.messages', {
        url: '/{channelId}/messages',
        template: 'app/channels/messages.html',
        controller: 'MessagesCtrl as messagesCtrl',
        resolve: {
          messages: function ($stateParams, Messages) {
            return Messages.forChannel($stateParams.channelId).$loaded();
          },
          channelName: function ($stateParams, channels) {
            return '#' + channels.$getRecord($stateParams.channelId).name;
          }
        },
        authenticate: true
      })
      .state('channels.direct', {
        url: '/{uid}/messages/direct',
        templateURL: 'app/channels/messages.html',
        controller: 'MessagesCtrl as messagesCtrl',
        resolve: {
          messages: function ($stateParams, Messages, profile) {
            return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
          },
          channelName: function ($stateParams, Users) {
            return Users.all.$loaded().then(function () {
                return '@' + Users.getDisplayName($stateParams.uid);
              })
          }
        },
        authenticate: true
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
        $state.go('signup');
      }
    });
  })
  .constant('FirebaseUrl', 'https://instaroomie.firebaseio.com/');
