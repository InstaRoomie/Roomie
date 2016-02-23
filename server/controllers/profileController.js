var User = require('../models/user.js');
var Users = require('../collections/users.js');
var Promise = require('bluebird');
var jwt = require('jwt-simple');
var knex = require('../db/schema.js').knex;
var _ = require('underscore');

var helpers = {

  // This function will do proper checks to get users.. beware of callbacks
  // Need to Promisify
  getUser: function(req, res, next) {
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    var answers = [];
    var maybes = [];
    var usersToSend = [];

    // Grab all the people that answered No to loggedUser and vice-versa
    helpers.checkNo(req, function(item){
      item.forEach(function(enemy){
        if(enemy.user_id !== loggedUser.id){
          answers.push(enemy.user_id)
        } else {
          answers.push(enemy.enemy);
        }
      })
        // Grab all the people that answered Yes to loggedUser and vice-versa
        helpers.checkYes(req, function(item){
          item.forEach(function(friend){
            if(friend.user_id === loggedUser.id){
              answers.push(friend.friend)
            } else {
              answers.push(friend.user_id);
            }
          })
          // Grab all the people that are awaiting a response from loggedUser
          helpers.checkMaybe(req, function(item){
            item.forEach(function(potential){
              if(potential.potential === loggedUser.id){
                maybes.push(potential.user_id)
              }
            })
            var result = _.difference(maybes, answers);
            var union = _.union(result, answers);
            // Take differences between maybes array and answers array.
            // This will basically filter out unanswered results.
            helpers.getDifferences(result, function(item){
              item.forEach(function(some){
                usersToSend.push(some);
              })
              // Bring together (unionize) the difference of maybes, and answers
              // then get all the unique vales of those arrays.
              helpers.bringTogether(req, union, function(item){
                item.forEach(function(together){
                  usersToSend.push(together);
                })
                res.send(usersToSend);
              })
            })
          })
        })
      });
  },
  checkMaybe: function(req, callback){
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('Maybe')
      .where('potential', loggedUser.id)
      .then(function(potentials){
        callback(potentials);
      })
  },
  checkNo: function(req, callback){
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('No')
      .where('user_id', loggedUser.id)
      .orWhere('enemy', loggedUser.id)
      .then(function(enemies){
        callback(enemies)
      })
  },
  checkYes: function(req, callback){
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('Yes')
      .where('user_id', loggedUser.id)
      .orWhere('friend', loggedUser.id)
      .then(function(friends){
        callback(friends)
      })
  },
  getDifferences: function(resultArray, callback){
    knex('Users')
      .whereIn('id', resultArray)
      .select('id', 'firstname', 'lastname', 'username', 'dob', 'image_url', 'gender', 'about_me')
      .then(function(item){
        callback(item)
      })
  },
  bringTogether: function(req, unionArray, callback){
    var loggedUser = jwt.decode(req.headers['x-access-token'], 'secret');

    knex('Maybe')
      .where('user_id', loggedUser.id)
      .then(function(item){
        item.forEach(function(answered){
          unionArray.push(answered.potential);
        })
        knex('Users')
        .whereNotIn('id', unionArray)
        .andWhereNot('id', loggedUser.id)
        .select('id', 'firstname', 'lastname', 'username', 'dob', 'image_url', 'gender', 'about_me')
        .then(function(item){
          callback(item)
        })
      })
  },
  getUsersFromDb: function(req, userIdArray, callback){

    knex('Users')
      .whereIn('id', userIdArray)
      .select('id', 'firstname', 'lastname', 'username', 'dob', 'image_url', 'gender', 'about_me')
      .then(function(user){
        callback(user);
      })
  },
  calculateAge: function(dateString){
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){
        age--;
    }
    return age;
  }
};

module.exports = helpers;
