var Promise = require('bluebird');
var helpers = require('../util/helpers.js');
var Friend = require('../models/friend.js');
var Friends = require('../collections/friends.js');

module.exports = {

  getFriend: function(req, res) {

    helpers.decode(req, res, function(userThatSwiped) {
      console.log('From getFriend() using decoded: ', userThatSwiped.id);

      new Friend({ user_id: userThatSwiped.id })
        .fetch()
          .then(function(friend) {
              if (!friend) {
                console.log('No friends found!')
                res.status(200).send('No friends found');
              } else {
                console.log('Friend(s) found  ', friend)
                res.status(200).send(friend);
              }
            })
              .catch(function(err) {
                console.log('Finding friends failed... ', err);
                res.status(500).send('Finding friends failed...');
              });

    });

  }

};
