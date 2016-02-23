var Promise = require('bluebird');
var util = require('../util/helpers.js');
var Friend = require('../models/friend.js');
var Friends = require('../collections/friends.js');
var _ = require('underscore');
var helpers = require('./profileController.js');

module.exports = {

  getFriend: function(req, res) {

    util.decode(req, res, function(userThatSwiped) {
      console.log('From getFriend() using decoded: ', userThatSwiped.id);

      var contactList = [];
      var usersToSend = [];

      helpers.checkYes(req, function(item) {
          item.forEach(function(friend) {
            if (friend.user_id === userThatSwiped.id) {
              contactList.push(friend.friend)
            } else {
              contactList.push(friend.user_id);
            }
          });
          helpers.getDifferences(contactList, function(item) {
            item.forEach(function(some) {
              usersToSend.push(some);
            })
              res.status(200).send(usersToSend);
            });
        })
          .catch(function(err) {
              console.log('This is an error from finding friends ', err);
            });
      });

    }

};
