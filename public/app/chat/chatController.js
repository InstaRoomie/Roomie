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
