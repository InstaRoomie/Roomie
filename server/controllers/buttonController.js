var User = require('../models/user.js');
var Users = require('../collections/users.js');
var Promise = require('bluebird');
var jwt = require('jwt-simple');
var helpers = require('../util/helpers.js');
var Enemy = require('../models/enemy.js');
var Enemies = require('../collections/enemies.js');
var Potential = require('../models/potential.js');
var Potentials = require('../collections/potentials.js');
var Friend = require('../models/friend.js');
var Friends = require('../collections/friends.js');

module.exports = {

  // abstract getUser to decode the json object
  getUser: function(req, res, next) {

    var userThatGotSwiped = req.body.id

    helpers.decode(req, res, function(userThatSwiped) {
      console.log('From getUser() using decoded: ', userThatSwiped.id);
      console.log("This is inside helpers.decode userThatGotSwiped ", userThatGotSwiped);
      console.log(next);
      req.userThatSwiped = userThatSwiped.id;
      req.userThatGotSwiped = userThatGotSwiped;
      next();
    });

  },

  addNo: function(req, res) {

    var user = req.userThatSwiped;
    var enemyId = req.userThatGotSwiped;

    if (enemyId === undefined) {
      res.status(500).send('Can\'t say no to no one!');
    } else {
      console.log("I'm in addNo - userThatSaidNo ", user);
      console.log("I'm in addNo - userThatGotSwiped ", enemyId);

      var newEnemy = new Enemy({ user_id: user, enemy: enemyId });

      // check to see if the enemy was already added to the enemy table;

      newEnemy
      .save()
      .then(function(enemy){
        Enemies.add(enemy);
        res.status(200).send('Enemy created');

        })
        .catch(function(err) {
          console.log('Enemy creation failed ', err);
          res.status(500).send('Enemy creation failed');

          });
    }

  },

  addMaybe: function(req, res) {

    var user = req.userThatSwiped;
    var potentialId = req.userThatGotSwiped;

    if (potentialId === undefined) {
      res.status(500).send('Can\'t say yes to no one!');
    } else {
      // check to see if this is a response to a Maybe
      new Potential({ user_id: potentialId, potential: user })
      .fetch()
      .then(function(potential) {
        // if not a response to a Maybe create a new potential
        if (!potential) {
          var newPotential = new Potential({ user_id: user, potential: potentialId });
          newPotential
          .save()
          .then(function(potential){
            Potentials.add(potential);
            res.status(200).send('Potential created');
            })
            .catch(function(err) {
              console.log('Potential creation failed ', err);
              res.status(500).send('Potential creation failed');
              });
              } else {
                // if a response to a Maybe create a new friend
                console.log('The potential has been answered and a friend is being created...')
                var newFriend = new Friend({ user_id: user, friend: potentialId});
                newFriend
                .save()
                .then(function(friend) {
                  Friends.add(friend);
                  res.status(200).send('Friend created');
                  })
                  .catch(function(err) {
                    console.log('Friend creation failed ', err);
                    res.status(500).send('Friend creation failed');
                    });
                  }

                  });
    }


  }

};
