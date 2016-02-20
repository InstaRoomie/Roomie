var User = require('../models/user.js');
var Users = require('../collections/users.js');
var Promise = require('bluebird');
var jwt = require('jwt-simple');
var helpers = require('../util/helpers.js');
var Enemy = require('../models/enemy.js');
var Enemies = require('../collections/enemies.js');
var Potential = require('../models/potential.js');
var Potentials = require('../collections/potentials.js');

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

    console.log("I'm in addNo - userThatSaidNo ", user);
    console.log("I'm in addNo - userThatGotSwiped ", enemyId);

    var newEnemy = new Enemy({ user_id: user, enemy: enemyId });

    // check to see if the enemy was already added to the enemy table;

    newEnemy
      .save()
      .then(function(enemy){
          Enemies.add(enemy);
          res.status(200).send('Potential created');

        })
        .catch(function(err) {
            console.log('Enemy creation failed ', err);
            res.status(500).send('Potential creation failed');

          });

  },

  addMaybe: function(req, res) {
    var user = req.userThatSwiped;
    var potentialId = req.userThatGotSwiped;

    // check to see if the potential was already added to the potential table;

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

  }

};
