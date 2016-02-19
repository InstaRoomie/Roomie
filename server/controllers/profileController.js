var User = require('../models/user.js'),
    Users = require('../collections/users.js'),
    Promise    = require('bluebird'),
    jwt  = require('jwt-simple'),
    helpers = require('../util/helpers.js')

module.exports = {
  getUser: function(req, res, next){
      helpers.decode(req, res, function(item){
        console.log("From getUser() using decoded:", item);
      });

    res.status(200).send();
  }
}
