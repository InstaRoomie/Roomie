var myApp = angular.module('roomie', ['roomie.auth', 'roomie.services', 'ui.router'])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
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
        templateUrl: 'contact/contact.html',
        url: '/contact',
        controller: 'ContactController'
      })
      .state('main', {
        templateUrl: '/main/main.html',
        url: '/main',
        controller: 'MainController'
      })

      $httpProvider.interceptors.push('AttachTokens');
  })
  .factory('AttachTokens', function($window) {

    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('com.roomie');
        if(jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(function($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function(evt, next, current) {
      if(next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
        $location.path('/signin');
      }
    });
  });
