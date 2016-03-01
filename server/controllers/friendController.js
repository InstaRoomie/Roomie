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
            contactList.push(friend.friend);
          }
          if (friend.friend === userThatSwiped.id) {
            contactList.push(friend.user_id);
          }
        });
        helpers.getUsersFromDb(req, contactList, function(user) {
          user.forEach(function(friend) {
            friend.age = helpers.calculateAge(friend.dob);
            usersToSend.push(friend);
          });
          res.status(200).send(usersToSend);
        });
      });
    });
  }
};
