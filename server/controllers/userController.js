var User = require('../models/user.js');
var Users = require('../collections/users.js');
var Promise = require('bluebird');
var jwt = require('jwt-simple');

module.exports = {

  signin: function(req, res, next) {

    console.log('I\'m in userController this is the req ', req.body);

    var email = req.body.email;
    var password = req.body.password;

    console.log('I\'m in userController this is the email ', email);
    new User({email: email})
      .fetch()
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          user.comparePassword(password, function(match) {
            if (match) {
              var token = jwt.encode(user, 'secret');
              console.log('this is the token! ', token);
              res.json({token: token});
            } else {
              return next(new Error('No user'));
            }
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  },

  signup: function(req, res, next) {
    console.log('I\'m in userController this is the req ', req.body);

    var email = req.body.email;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var dob = new Date(req.body.dob);
    var gender = req.body.gender;
    var aboutme = req.body.aboutme;

    console.log('I\'m in userController this is the email ', email);

    // check to see if user already exists
    new User({email: email})
      .fetch()
      .then(function(user) {
        console.log('this is when i create a new user in usercontroller ', user);
        if (user) {
          next(new Error('User already exist!'));
          console.log('user controller - user exists', user);
        } else {
          console.log('user controller - user doesn\'t exist', user);

          // make a new user if not one
          var newUser = new User({
              email: email,
              firstname: firstname,
              lastname: lastname,
              password: password,
              dob: dob,
              gender: gender,
              about_me: aboutme
            });
          newUser.save()
            .then(function(newUser) {
                Users.add(newUser);
                var token = jwt.encode(newUser, 'secret');
                console.log('this is the token! ', token);
                res.json({token: token});
              });
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  checkAuth: function(req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');

      new User({email: user.email})
        .fetch()
        .then(function(foundUser) {
          if (foundUser) {
            next();
          } else {
            res.status(401).send();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

};
