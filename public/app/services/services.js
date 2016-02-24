angular.module('roomie.services', [])
  .factory('Auth', function($http, $state, $window, $firebaseAuth, FirebaseUrl) {

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

  })
  .factory('State', function($http, $location, $window, Auth) {
    var getPromise;

    var seenAll = false;

    var seenAllTruth = function() {
      return seenAll;
    }

    var getUser = function() {
      return $http({
        method: 'GET',
        url: 'api/users/user',
      }).then(function(res) {
        console.log('this is the signedin profile', res.data);
        return res.data;
      });
    };

    var getData = function() {
      return $http({
        method: 'GET',
        url: 'api/users/main',
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

    return {
      getData: getData,
      approve: approve,
      decline: decline,
      getContact: getContact,
      seenAllTruth: seenAllTruth,
      getUser: getUser
    };

  });
