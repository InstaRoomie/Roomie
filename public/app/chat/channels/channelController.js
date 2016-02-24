angular.module('roomie.angularfireChannelsController', [])
  .controller('ChannelsCtrl', function($state, Auth, Users, profile, channels) {
    var channelsCtrl = this;

    channelsCtrl.channels = channels;
    channelsCtrl.profile = profile;

    Users.setOnline(profile.$id);

    channelsCtrl.getDisplayName = Users.getDisplayNames;
    channelsCtrl.getGravatar = Users.getGravatar;
    channelsCtrl.users = Users.all;


    channelsCtrl.logout = function () {
      Auth.auth.$unauth();
      $state.go('signin');
    };

    //Add a newChannel object on ChannelsCtrl with a blank name
		channelsCtrl.newChannel = {
			name: ''
		};

		//Create a createChannel function on ChannelsCtrl.
		channelsCtrl.createChannel = function(name){

			//the $add() function on $firebaseArray has similar functionality as .push() on an array
			channelsCtrl.channels.$add(channelsCtrl.newChannel).then(function(ref){
				channelsCtrl.newChannel = {
					name: ''
				};
				//channelId is usually taken from the params, but we are now passing it as
				//the id returned by ref.key()
				$state.go('channels.messages', { channelId: ref.key() } );
			});

		}



  })
