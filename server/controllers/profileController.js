var User = require('../models/user.js'),
    Users = require('../collections/users.js'),
    Promise    = require('bluebird'),
    jwt  = require('jwt-simple');

module.exports = {
  getUser: funciton(req, res, next){
    console.log(req.token);
  }
}
