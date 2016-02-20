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
  getUser: function(req, res, callback) {
    // grab req
    /*var userThatGotSwiped = req.body.id*/
    var userThatGotSwiped = 62; // bobby

    helpers.decode(req, res, function(userThatSwiped) {
      console.log('From getUser() using decoded: ', userThatSwiped);
      callback(userThatSwiped, userThatGotSwiped);
    });

  },

  addNo: function(userThatSaidNo, userThatGotSwiped) {
    var enemyId = userThatGotSwiped;
    var user = userThatSaidNo.id;

    /*var userId = 2; // kyle
    var enemyId = 10; // bobby*/

    var newEnemy = new Enemy({ user_id: userId, enemy: enemyId });

    newEnemy
      .save()
      .then(function(enemy){
          Enemies.add(enemy);
        })
        .catch(function(err) {
            console.log('Enemy creation failed ', err);
          });

  },

  addMaybe: function(userThatSaidYes, userThatGotSwiped) {
    var potentialId = userThatGotSwiped;
    var user = userThatSaidYes.id;

    var newPotential = new Potential({ user_id: user, potential: potentialId });

    newPotential
      .save()
      .then(function(potential){
          Potentials.add(potential);
          /*res.status(200).send('Potential created');*/
        })
        .catch(function(err) {
            console.log('Potential creation failed ', err);
            /*res.status(500).send('Potential creation failed');*/
          });

  }

};
