var User = require('../models/user.js');
var Users = require('../collections/users.js');
var Promise = require('bluebird');
var jwt = require('jwt-simple');
var helpers = require('../util/helpers.js');
var knex = require('../db/schema.js').knex;

// var knex = require('knex')(config);

module.exports = {

  getUser: function(req, res, next) {
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('Users').whereNot('id', loggedUser.id)
      .then(function(user){
        res.status(200).send(user[0]);
      });
  },
  respondedNo: function(req, res, next){
    var rejUser = req.body.user.id;
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('No').insert({user_id: loggedUser.id, enemy: rejUser});

  },
  respondedYes: function(req, res, next){
    var acceptedUser = req.body.user.id;
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('Yes').insert({user_id: loggedUser.id, friend: acceptedUser});

  },
  checkMaybe: function(req, userId, callback){
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('Maybe').where('potential', loggedUser.id)
      .then(function(potentials){
        callback(potentials);
      })
  },
  checkNo: function(req, userId, callback){
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('No')
      .where('user_id', loggedUser.id)
      .andWhere('enemy', userId)
      .orWhere('user_id', userId)
      .andWhere('enemy', loggedUser)
      .then(function(enemies){
        callback(enemies);
      })
  },
  checkYes: function(req, userId, callback){
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('Yes')
      .where('user_id', loggedUser.id)
      .andWhere('friend', userId)
      .orWhere('user_id', user_id)
      .andWhere('friend', loggedUser)
      .then(function(friends){
        return friends
      })
  }
};
