var User = require('../models/user.js');
var Users = require('../collections/users.js');
var Promise = require('bluebird');
var jwt = require('jwt-simple');
var helpers = require('../util/helpers.js');

module.exports = {
  getUser: function(req, res, next) {
    helpers.decode(req, res, function(item) {
      console.log('From getUser() using decoded: ', item);
    });

    res.status(200).send();
  }
};
