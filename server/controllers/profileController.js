var User = require('../models/user.js');
var Users = require('../collections/users.js');
var Promise = require('bluebird');
var jwt = require('jwt-simple');
var helpers = require('../util/helpers.js');
var db = require('../db/schema.js');

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'mysqlcluster7.registeredsite.com',
    user: 'iron_man',
    password: '!Qaz2wsx3edc',
    database: 'roomme_db',
    charset: 'utf8'
  }
});

module.exports = {

  getUser: function(req, res, next) {
    var token = req.headers['x-access-token'];
    var loggedUser = jwt.decode(token, 'secret');
    var firstUser;

    knex('Users').whereNot('id', loggedUser.id)
      .then(function(user){
        res.status(200).send(user[0]);
      });

  }
};
