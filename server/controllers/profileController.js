var User = require('../models/user.js');
var Users = require('../collections/users.js');
var Promise = require('bluebird');
var jwt = require('jwt-simple');
var helpers = require('../util/helpers.js');
var knex = require('../db/schema.js').knex;

// var knex = require('knex')(config);

var helpers = {

  getUser: function(req, res, next) {
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    console.log(loggedUser.id);

    // knex('Users').whereNot('id', loggedUser.id)
    //   .then(function(users){
    //     res.send(users[0])
    //   });

    knex('Users').whereNot('id', loggedUser.id)
      .then(function(users){
        helpers.checkMaybe(req, loggedUser, function(potentials){
          potentials.forEach(function(potentialUser){
            helpers.checkNo(req, potentialUser.user_id, function(answer){
              if(answer.length === 0){
                console.log("They're not enemies");
              } else {
                console.log("They're enemies");
              }
            })
            helpers.checkYes(req, potentialUser.user_id, function(answer){
              if(answer.length === 0){
                console.log("They're not friends");
              } else {
                console.log("They're friends");
              }
            })
          })
        })

        res.send(users);
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
  checkMaybe: function(req, loggedUser, callback){
    knex('Maybe').where('potential', loggedUser.id)
      .then(function(potentials){
        callback(potentials);
      })

    //   .then(function(potentials){
    //     console.log("Potentials", potentials);
    //     potentials.forEach(function(item){
    //       helpers.checkNo(req, item.user_id, function(item){
    //         if(item.length === 1){
    //           console.log("Said No", item);
    //         }
    //       })
    //       helpers.checkYes(req, item.user_id, function(item){
    //         console.log("Said yes", item);
    //       })
    //     })
    //     return potentials;
    //   })
  },
  checkNo: function(req, userId, callback){
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('No')
      .where('user_id', loggedUser.id)
      .andWhere('enemy', userId)
      .orWhere('user_id', userId)
      .andWhere('enemy', loggedUser.id)
      .then(function(enemies){
        callback(enemies)
      })
  },
  checkYes: function(req, userId, callback){
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('Yes')
      .where('user_id', loggedUser.id)
      .andWhere('friend', userId)
      .orWhere('user_id', userId)
      .andWhere('friend', loggedUser.id)
      .then(function(friends){
        callback(friends)
      })
  }
};

module.exports = helpers;
