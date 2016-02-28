var User = require('../models/user.js');
var Users = require('../collections/users.js');
var Promise = require('bluebird');
var jwt = require('jwt-simple');

var userHelpers = {

  signin: function(req, res, next) {

    console.log('I\'m in userController this is the req ', req.body);

    var email = req.body.email || null;
    var password = req.body.password || null;
    var uid = req.body.uid || null;

    if (uid) {
      new User({auth_uid: uid})
        .fetch()
        .then(function(user) {
          var token = jwt.encode(user, 'secret');
          console.log('this is the token! ', token);
          res.json({token: token});
        });
    } else {
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
    }

  },

  signup: function(req, res, next) {
    console.log('I\'m in userController this is the req ', req.body);

    var userObj = {};

    userObj.email = req.body.email;
    userObj.password = req.body.password;
    userObj.username = req.body.username;
    userObj.firstname = req.body.firstname;
    userObj.lastname = req.body.lastname;
    userObj.dob = req.body.dob;
    userObj.gender = req.body.gender;
    userObj.image_url = req.body.image_url;
    userObj.aboutme = req.body.aboutme;
    userObj.location = req.body.location;
    userObj.uid = req.body.uid || null;

    console.log('I\'m in userController this is the email ', userObj.email);

    // check to see if user already exists
    new User({email: userObj.email})
      .fetch()
      .then(function(user) {
        console.log('this is when i create a new user in usercontroller ', user);
        if (user) {
          next(new Error('User already exist!'));
          console.log('user controller - user exists', user);
        } else {
          console.log('user controller - user doesn\'t exist', user);

          // checking for social auth

          if (userObj.uid !== null) {
            userHelpers.socialLogin(userObj.uid, userObj, res);
          } else {
            console.log('i am creating a new user');
            userHelpers.createUser(userObj, res);
          }

          /*new User({username: username})
            .fetch()
            .then(function(userName){
              if(userName){
                next(new Error('Username already taken, please choose a different one'))
              } else {
                // make a new user if not one
                var newUser = new User({
                  email: email,
                  firstname: firstname,
                  username: username,
                  lastname: lastname,
                  password: password,
                  dob: dob,
                  image_url: image_url,
                  gender: gender,
                  location: location,
                  about_me: aboutme
                  auth_uid: uid,
                });
                newUser.save()
                .then(function(newUser) {
                  Users.add(newUser);
                  var token = jwt.encode(newUser, 'secret');
                  console.log('this is the token! ', token);
                  res.json({token: token});
                });
              }
            })*/
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
  },

  socialLogin: function(uid, userObj, res, next) {
    new User({auth_uid: uid})
      .fetch()
      .then(function(user) {
        console.log('this is when I create a new social user in usercontroller ', user);
        if (user) {
          res.status(500).send(new Error('User already exists!'));
          console.log(' user controller - social user exists ', user);
        } else {
          console.log('user controller - user doesn\'t exist calling create user');
          userHelpers.createUser(userObj, res, next);
        }
      });
  },

  createUser: function(user, res) {
    console.log('I am creating a user');
    var newUser = new User({
      email: user.email,
      firstname: user.firstname,
      username: user.username,
      lastname: user.lastname,
      password: user.password,
      dob: user.dob,
      image_url: user.image_url,
      gender: user.gender,
      location: user.location,
      about_me: user.aboutme,
      auth_uid: user.uid,
    });
    newUser.save()
    .then(function(newUser) {
      Users.add(newUser);
      var token = jwt.encode(newUser, 'secret');
      console.log('this is the token! ', token);
      res.json({token: token});
    })
    .catch(function(err) {
      console.log('this is an error for creating a user', err);
      })
  }
};

module.exports = userHelpers;
