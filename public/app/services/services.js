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
