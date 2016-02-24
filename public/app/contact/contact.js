angular.module('roomie.contact', [])
  .controller('ContactController', function($scope, $state, State, profile, auth, Users, Auth, md5) {


    var contactController = this;
    $scope.user;

    contactController.filterArray = [];

    contactController.getContact = function() {
      State.getContact().then(function(data) {
          contactController.data = data;
          _.each(data, function(friend) {
              contactController.filterArray.push(md5.createHash(friend.email));
            });
          console.log("this is the email array! ", contactController.filterArray);
          console.log('contactController ', contactController);
          // goes over each friend to check with the firebase users to see
          // if the hashedEmails match and if they do match
          // it extends the friend with the firebase user that matches
          // this is to get the ng-repeat together
          _.each(data, function(friend) {
              _.each(contactController.users, function(user) {
                  if (md5.createHash(friend.email) === user.emailHash) {
                    _.extend(friend, user);
                  }
                });
            });
        });
    };

    $scope.profile = function() {
      $state.go('profile');
    }

    $scope.getUser = function() {
      State.getUser().then(function(data) {
        $scope.user = data[0];
      });
    }

    contactController.profile = profile;

    Users.setOnline(profile.$id);

    contactController.getDisplayName = Users.getDisplayNames;
    contactController.getGravatar = Users.getGravatar;
    contactController.users = Users.all;

    contactController.signout = function() {
      //firebase signout
      Auth.auth.$unauth();
      //db signout
      Auth.signout();
    };

    contactController.new = function() {
      $state.go('main')
    };

    contactController.contacts = function() {
      $state.go('contact')
    };

    $scope.getUser();

    contactController.getContact();

    // $scope.data = [{
    //   firstname: 'Daniel',
    //   lastname: 'kim',
    //   age: 23,
    //   gender: 'M',
    //   aboutme: 'Hi, my name is Daniel',
    //   email: 'danielkim@gmail.com',
    //   url: 'https://www.guthriegreen.com/sites/default/files/Kung-Fu-Panda-6%5B1%5D.jpg'
    // }, {
    //   firstname: 'Danny',
    //   lastname: 'Rizko',
    //   age: 26,
    //   gender: 'M',
    //   aboutme: 'Hi, my name is Danny',
    //   email: 'dannyrizko@gmail.com',
    //   url: 'http://vignette2.wikia.nocookie.net/kungfupanda/images/2/2e/Oogway-white.png/revision/latest?cb=20120901174344'
    // }, {
    //   firstname: 'Ethan',
    //   lastname: 'Rubio',
    //   age: 25,
    //   gender: 'M',
    //   aboutme: 'Hi, my name is Ethan',
    //   email: 'ethanrubio@gmail.com',
    //   url: 'http://images-cdn.moviepilot.com/image/upload/c_fill,h_1198,w_1777/t_mp_quality/monkeykfp2-kung-fu-panda-3-jpeg-77119.jpg'
    // }, {
    //   firstname: 'Bobby',
    //   lastname: 'Chong',
    //   age: 33,
    //   gender: 'M',
    //   aboutme: 'Hi, my name is Bobby',
    //   email: 'bobbychong@gmail.com',
    //   url: 'http://vignette1.wikia.nocookie.net/dreamworks/images/e/e9/ShifuGreen.jpg'
    // }];

  });
