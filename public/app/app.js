var myApp = angular.module('roomie', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        templateUrl: 'login/login.html',
        url: '/login',
        controller: 'loginController'
      })
      .state('signup', {
        templateUrl: 'signup/signup.html',
        url: '/signup',
        controller: 'signupController'
      })
  });
