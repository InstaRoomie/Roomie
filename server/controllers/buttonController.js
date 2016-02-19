var User = require('../models/user.js');
var Users = require('../collections/users.js');
var Promise = require('bluebird');
var jwt = require('jwt-simple');
var helpers = require('../util/helpers.js');

module.exports = {

  // abstract getUser to decode the json object
  getUser: function(req, res, next) {
    // grab req
    var userThatGotSwiped = req.body.id

    helpers.decode(req, res, function(userThatSwiped) {
      console.log('From getUser() using decoded: ', userThatSwiped);
      callback(userThatSwiped, userThatGotSwiped);
    });

  res.status(200).send();
  },

  addNo: function(userThatSaidNo, userThatGotSwiped) {
    var enemyId = userThatGotSwiped;
    var user = userThatSaidNo;

    new User({ id: user.id })
      .fetch()

    // 2. fetch userThatSaidNo and then add that user to
    // the no table with the enemy's ID

  },

  addMaybe: function(userThatSaidYes, ) {
    //

  }

};
