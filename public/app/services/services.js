angular.module('roomie.services', [])
  .factory('Auth', function($http, $location, $window) {

    var signup = function(user) {
      return $http({
        method: 'POST',
        url:'api/url',
        data: user
      })
      .then(function(response) {
        return response.data.token;
      });
    };

    var signin = function(user) {
      return $http({
        method: 'POST',
        url:'api/url',
        data: user
      })
      .then(function(response) {
        return response.data.token;
      });
    };

    var isAuth = function() {
      return !!$window.localStorage.getItem('com.roomie');
    };

    var signout = function() {
      $window.localStorage.remoteItem('com.roomie');
      $location.path('/login');
    }
    
    return {
      signup: signup,
      signin: signin,
      isAuth: isAuth,
      signout: signout
    }

  })
  .factory('State', function($http, $location, $window) {
    var getPromise;





  })
